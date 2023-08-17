import {loadImage} from 'canvas';
import {existsSync, mkdirSync} from 'node:fs';
import {readFile, readdir} from 'node:fs/promises';
import * as path from 'path';

import {
  AllElementImage,
  CollectionSetting,
  ElementLayers,
} from './generator/interfaces';
import * as multiplication from './generator/sets/multiplication';
import * as randomization from './generator/sets/randomization';
import * as batch from './generator/images/batch';
import * as sequential from './generator/images/sequential';

const directory = path.join(__dirname, 'collection');

(async () => {
  const {traits, elements, setting} = await getCollectionInfo();
  console.time('generate sets');
  const sets =
    setting.setsGenerator === 'multiplication'
      ? multiplication.generateSets(traits, elements)
      : randomization.generateSets(
          traits,
          elements,
          setting.randomTimes || Math.random() * 20
        );
  console.timeEnd('generate sets');

  console.time('preload all element image');
  const imgDict = await getAllElementImage(elements);
  console.timeEnd('preload all element image');

  !existsSync(path.join(directory, 'output', 'images')) &&
    mkdirSync(path.join(directory, 'output', 'images'), {recursive: true});

  console.time('generate images');
  setting.imagesGenerator === 'batch'
    ? await batch.generateImages(directory, sets, imgDict, setting)
    : await sequential.generateImages(directory, sets, imgDict, setting);
  console.timeEnd('generate images');
})();

async function getCollectionInfo() {
  const traits: string[] = JSON.parse(
    await readFile(path.join(directory, 'ordinal.json'), 'utf-8')
  );
  const layerRegex = /\.\d+$/;
  const elements: ElementLayers[][] = await Promise.all(
    traits.map(async (trait, traitIndex) => {
      const elementDict: {[element: string]: ElementLayers['layers']} = {};

      (await readdir(path.join(directory, 'traits', trait))).forEach(
        fileName => {
          const layerName = path.basename(fileName, path.extname(fileName));
          const element = layerName.replace(layerRegex, '');
          const layerZIndex =
            Number(layerName.match(layerRegex)?.[0].substring(1)) ||
            traitIndex * 200;

          if (elementDict[element])
            elementDict[element][layerZIndex] = path.join(
              directory,
              'traits',
              trait,
              fileName
            );
          else
            elementDict[element] = {
              [layerZIndex]: path.join(directory, 'traits', trait, fileName),
            };
        }
      );

      return Object.entries(elementDict).map(([element, layers]) => ({
        layers,
        name: element,
      }));
    })
  );

  return {
    traits,
    elements,
    setting: JSON.parse(
      await readFile(path.join(directory, 'setting.json'), 'utf-8')
    ) as CollectionSetting,
  };
}

async function getAllElementImage(elements: ElementLayers[][]) {
  const imgDict: AllElementImage = {};

  await Promise.all(
    elements.flat().map(
      async element =>
        await Promise.all(
          Object.values(element.layers).map(async filePath => {
            imgDict[filePath] = await loadImage(filePath);
          })
        )
    )
  );

  return imgDict;
}

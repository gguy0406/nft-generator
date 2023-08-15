import {loadImage} from 'canvas';
import {existsSync, mkdirSync} from 'node:fs';
import {readFile, readdir, writeFile} from 'node:fs/promises';
import * as path from 'path';

import {
  AllElementImage,
  CollectionSetting,
  ElementLayers,
} from './generator/interfaces';
import * as multiplication from './generator/sets/multiplication';
import * as randomization from './generator/sets/randomization';
import * as batch from './generator/canvases/batch';
import * as sequential from './generator/canvases/sequential';

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

  console.time('get all img');
  const imgs = await getAllElementImage(elements);
  console.timeEnd('get all img');
  console.time('generate canvases');
  const canvases =
    setting.canvasesGenerator === 'batch'
      ? batch.generateCanvases(sets, imgs, setting)
      : sequential.generateCanvases(sets, imgs, setting);
  console.timeEnd('generate canvases');

  !existsSync(path.join(directory, 'output', 'images')) &&
    mkdirSync(path.join(directory, 'output', 'images'), {recursive: true});

  console.time('save file png');
  for (const [index, canvas] of canvases.entries()) {
    await writeFile(
      path.join(directory, 'output', 'images', `${index}.png`),
      canvas.toBuffer()
    );
  }
  console.timeEnd('save file png');
})();

async function getCollectionInfo() {
  const traits: string[] = JSON.parse(
    await readFile(path.join(directory, 'ordinal.json'), 'utf-8')
  );
  const layerRegex = /\.\d+$/;
  const elements: ElementLayers[][] = await Promise.all(
    traits.map(async (trait, traitIndex) => {
      const elementKeyByName: {[element: string]: ElementLayers['layers']} = {};

      (await readdir(path.join(directory, 'traits', trait))).forEach(
        fileName => {
          const element = path.basename(fileName, path.extname(fileName));
          const layerZIndex =
            Number(element.match(layerRegex)?.[0].substring(1)) ||
            traitIndex * 100;

          if (elementKeyByName[element])
            elementKeyByName[element][layerZIndex] = path.join(
              directory,
              'traits',
              trait,
              fileName
            );
          else
            elementKeyByName[element] = {
              [layerZIndex]: path.join(directory, 'traits', trait, fileName),
            };
        }
      );

      return Object.entries(elementKeyByName).map(([element, layers]) => ({
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
  const imgs: AllElementImage = {};

  await Promise.all(
    elements.flat().map(
      async element =>
        await Promise.all(
          Object.values(element.layers).map(async filePath => {
            imgs[filePath] = await loadImage(filePath);
          })
        )
    )
  );

  return imgs;
}

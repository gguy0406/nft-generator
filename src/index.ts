import {existsSync, mkdirSync, rmSync} from 'node:fs';
import {readFile, readdir} from 'node:fs/promises';
import * as path from 'path';

import {Image, loadImage} from 'canvas';

import {setting} from './collection/setting';

import {
  ImageDictionary,
  CollectionSetting,
  ElementLayers,
  TraitSet,
} from './generator/interfaces';
import * as multiplication from './generator/sets/multiplication';
import * as randomization from './generator/sets/randomization';
import * as batch from './generator/images/batch';
import * as sequential from './generator/images/sequential';

import {collectionDir, outputImageDir, outputMetadataDir} from './lib';

if (setting.removeOutputs) {
  try {
    rmSync(outputImageDir, {recursive: true});
    rmSync(outputMetadataDir, {recursive: true});
  } catch {
    /* empty */
  }
}

(async () => {
  console.time('Initialize collection');
  const {traits, elements, imgDict} = await initializeCollection();
  console.timeEnd('Initialize collection');

  console.time('Generate sets');
  const sets = generateSets(setting, traits, elements);
  console.timeEnd('Generate sets');

  console.time('Generate images');
  await generateImages(setting, sets, imgDict);
  console.timeEnd('Generate images');
})();

async function initializeCollection() {
  const traitsPath = path.join(collectionDir, 'traits');
  const imgExts = ['.png', '.svg'];
  const layerRegex = /\.\d+$/;
  const filePaths: string[] = [];

  const traits: string[] =
    setting.traits ||
    (await readdir(traitsPath, {withFileTypes: true}))
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

  const elements: ElementLayers[][] = await Promise.all(
    traits.map(async (trait, traitIndex) => {
      const traitPath = path.join(traitsPath, trait);
      const elementDict: {[element: string]: ElementLayers['layers']} = {};

      (await readdir(traitPath, {withFileTypes: true}))
        .filter(
          dirent =>
            dirent.isFile() && imgExts.includes(path.extname(dirent.name))
        )
        .map(dirent => dirent.name)
        .forEach(fileName => {
          const filePath = path.join(traitPath, fileName);
          const layerName = path.basename(fileName, path.extname(fileName));
          const element = layerName.replace(layerRegex, '');
          const layerZIndex =
            Number(layerName.match(layerRegex)?.[0].substring(1)) ||
            traitIndex * (setting.indexStep || 200);

          if (elementDict[element])
            elementDict[element][layerZIndex] = filePath;
          else elementDict[element] = {[layerZIndex]: filePath};

          filePaths.push(filePath);
        });

      return Object.entries(elementDict).map(([element, layers]) => ({
        layers,
        name: element,
      }));
    })
  );

  const imgDict: ImageDictionary = {};

  if (setting.syncColor) {
    const syncColorSetting = setting.syncColor;
    const defaultColorRegex: Record<string, RegExp> =
      syncColorSetting.types.reduce(
        (regexps, type) => {
          regexps[type] = new RegExp(syncColorSetting.defaultSet[type], 'g');

          return regexps;
        },
        {} as Record<string, RegExp>
      );

    await Promise.all(
      filePaths.map(async filePath => {
        imgDict[filePath] = {};

        return Promise.all(
          syncColorSetting.colorSets.map(async (colorSet, index) => {
            if (path.extname(filePath) === '.svg') {
              let imgFile = await readFile(filePath, {encoding: 'utf-8'});
              const img = new Image();

              syncColorSetting.types.forEach(type => {
                imgFile = imgFile.replace(
                  defaultColorRegex[type],
                  colorSet[type]
                );
              });

              img.src = 'data:image/svg+xml;charset=utf-8,' + imgFile;
              imgDict[filePath][index] = img;
              return;
            }

            imgDict[filePath][index] = await loadImage(filePath);
          })
        );
      })
    );
  } else {
    await Promise.all(
      filePaths.map(async filePath => {
        imgDict[filePath] = {};

        imgDict[filePath][0] = await loadImage(filePath);
      })
    );
  }

  return {traits, elements, imgDict};
}

function generateSets(
  setting: CollectionSetting,
  traits: string[],
  elements: ElementLayers[][]
) {
  switch (setting.setsGenerator) {
    case 'multiplication':
      return multiplication.generateSets(traits, elements);
    case 'randomization':
    default:
      return randomization.generateSets(
        traits,
        elements,
        setting.randomTimes || Math.random() * 10
      );
  }
}

function generateImages(
  setting: CollectionSetting,
  sets: TraitSet[],
  imgDict: ImageDictionary
) {
  const outputDirectory = path.join(collectionDir, 'output', 'images');

  !existsSync(outputDirectory) && mkdirSync(outputDirectory, {recursive: true});

  switch (setting.imgsGenerator) {
    case 'batch':
      return batch.generateImages(sets, imgDict, setting);
    case 'sequential':
    default:
      return sequential.generateImages(sets, imgDict);
  }
}

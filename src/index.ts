import {existsSync, mkdirSync, rmSync} from 'node:fs';
import {readFile, readdir} from 'node:fs/promises';
import * as path from 'path';

import {Image, loadImage} from 'canvas';

import {GeneratorSetting, setting} from './setting';

import {generateByBatch} from './generator/nft/batch';
import {generateSequential} from './generator/nft/sequential';
import * as multiplication from './generator/set/multiplication';
import * as randomization from './generator/set/randomization';
import {ImageDictionary, ElementLayers, TraitSet} from './generator/interface';
import {generateImage} from './generator/nft/image';
import {generateCanvas} from './generator/canvas';

const collectionDir = path.join(__dirname, '..', 'collection');
const traitsDir = path.join(collectionDir, 'traits');
const outputDir = path.join(collectionDir, 'output');
const outputImageDir = path.join(outputDir, 'images');
const outputMetadataDir = path.join(outputDir, 'metadata');

if (setting.removeOutputs) {
  try {
    rmSync(outputImageDir, {recursive: true});
    rmSync(outputMetadataDir, {recursive: true});
  } catch {
    /* empty */
  }
}

!existsSync(outputImageDir) && mkdirSync(outputImageDir, {recursive: true});
!existsSync(outputMetadataDir) && mkdirSync(outputMetadataDir);

(async () => {
  console.time('Initialize collection');
  const {traits, elements, imgDict} = await initializeCollection();
  console.timeEnd('Initialize collection');

  console.time('Generate sets');
  const sets = generateSets(setting, traits, elements);
  console.timeEnd('Generate sets');

  console.time('Generate images');
  await generateNFTs(setting, sets, imgDict);
  console.timeEnd('Generate images');
})();

async function initializeCollection() {
  const imgExts = ['.png', '.svg'];
  const layerRegex = /\.\d+$/;
  const filePaths: string[] = [];

  const traits: string[] =
    setting.traits ||
    (await readdir(traitsDir, {withFileTypes: true}))
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

  const elements: ElementLayers[][] = await Promise.all(
    traits.map(async (trait, traitIndex) => {
      const traitPath = path.join(traitsDir, trait);
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
  setting: GeneratorSetting,
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

function generateNFTs(
  setting: GeneratorSetting,
  sets: TraitSet[],
  imgDict: ImageDictionary
) {
  const cb = (set: TraitSet, index: number) => {
    return Promise.all([
      generateImage(
        path.join(outputImageDir, `${index + 1}.png`),
        generateCanvas(
          set,
          imgDict,
          setting.imgSize,
          setting.syncColor
            ? Math.floor(Math.random() * setting.syncColor.colorSets.length)
            : 0
        ),
        setting.resolution ? {resolution: setting.resolution} : undefined
      ),
    ]);
  };

  switch (setting.imgsGenerator) {
    case 'batch':
      return generateByBatch(sets, cb, setting.batchSize);
    case 'sequential':
    default:
      return generateSequential(sets, cb);
  }
}

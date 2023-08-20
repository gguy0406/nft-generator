import {existsSync, mkdirSync, rmSync} from 'node:fs';
import {readFile, readdir} from 'node:fs/promises';
import * as path from 'path';

import {Image, loadImage} from 'canvas';

import {batchGenAssets} from './generator/asset/batch';
import {sequentialGenAssets} from './generator/asset/sequential';
import {genImg} from './generator/asset/image';
import {genMetadata} from './generator/asset/metadata';
import {multiplyTraits} from './generator/set/multiplication';
import {randomSets} from './generator/set/randomization';
import {genCanvas} from './generator/canvas';
import {ImageDictionary, ElementLayers, TraitSet} from './generator/interface';

import {GeneratorSetting, setting} from './setting';

const collectionDir = path.join(__dirname, '..', 'collection');
const traitsDir = path.join(collectionDir, 'traits');
const outputDir = path.join(collectionDir, 'output');
const outputImageDir = path.join(outputDir, 'images');
const outputMetadataDir = path.join(outputDir, 'metadata');

if (setting.rmOutputs) {
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
  await generateAssets(setting, sets, imgDict);
  console.timeEnd('Generate images');
})();

async function initializeCollection() {
  const traits: string[] =
    setting.traits ||
    (await readdir(traitsDir, {withFileTypes: true})).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);

  const {elements, filePaths}: {elements: ElementLayers[][]; filePaths: string[]} = await getElements(traits);
  const imgDict: ImageDictionary = await getImgDict(filePaths);

  return {traits, elements, imgDict};
}

async function getElements(traits: string[]) {
  const imgExts = ['.png', '.svg'];
  const layerRegex = /\.\d+$/;
  const filePaths: string[] = [];

  const elements: ElementLayers[][] = await Promise.all(
    traits.map(async (trait, traitIndex) => {
      const traitPath = path.join(traitsDir, trait);
      const elementDict: {[element: string]: ElementLayers['layers']} = {};

      (await readdir(traitPath, {withFileTypes: true}))
        .filter(dirent => dirent.isFile() && imgExts.includes(path.extname(dirent.name)))
        .map(dirent => dirent.name)
        .forEach(fileName => {
          const filePath = path.join(traitPath, fileName);
          const layerName = path.basename(fileName, path.extname(fileName));
          const element = layerName.replace(layerRegex, '');
          const layerZIndex =
            Number(layerName.match(layerRegex)?.[0].substring(1)) || traitIndex * (setting.indexStep || 100);

          if (elementDict[element]) elementDict[element][layerZIndex] = filePath;
          else elementDict[element] = {[layerZIndex]: filePath};

          filePaths.push(filePath);
        });

      return Object.entries(elementDict).map(([element, layers]) => ({
        layers,
        name: element,
      }));
    })
  );

  return {elements, filePaths};
}

async function getImgDict(filePaths: string[]) {
  const imgDict: ImageDictionary = {};

  if (!setting.syncColor) {
    await Promise.all(filePaths.map(async filePath => (imgDict[filePath] = {[0]: await loadImage(filePath)})));

    return imgDict;
  }

  const syncColorSetting = setting.syncColor;
  const defaultColorRegex: Record<string, RegExp> = syncColorSetting.types.reduce(
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
              imgFile = imgFile.replace(defaultColorRegex[type], colorSet[type]);
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

  return imgDict;
}

function generateSets(setting: GeneratorSetting, traits: string[], elements: ElementLayers[][]) {
  switch (setting.setsGenerator) {
    case 'multiplication':
      return multiplyTraits(traits, elements);
    case 'randomization':
    default:
      return randomSets(traits, elements, setting.randomTimes || Math.random() * 10);
  }
}

function generateAssets(setting: GeneratorSetting, sets: TraitSet[], imgDict: ImageDictionary) {
  const pngConfig = {resolution: setting.resolution};
  const callbackfn = (set: TraitSet, index: number) => {
    const canvas = genCanvas(
      set,
      imgDict,
      setting.imgSize,
      setting.syncColor ? Math.floor(Math.random() * setting.syncColor.colorSets.length) : 0
    );

    return Promise.all([
      genImg(path.join(outputImageDir, `${index + 1}.png`), canvas, pngConfig),
      genMetadata(path.join(outputMetadataDir, `${index + 1}.json`), set),
    ]);
  };

  switch (setting.imgsGenerator) {
    case 'batch':
      return batchGenAssets(sets, callbackfn, setting.batchSize);
    case 'sequential':
    default:
      return sequentialGenAssets(sets, callbackfn);
  }
}

import {existsSync, mkdirSync, rmSync} from 'node:fs';
import {readdir} from 'node:fs/promises';
import * as path from 'path';

import {ElementLayers} from './set-generator/interface';
import {multiplyTraits} from './set-generator/multiplication';
import {randomSets} from './set-generator/randomization';

import {TraitFilePaths, generateAssets} from './asset-generator';
import {GeneratorSetting, setting} from './setting';

const collectionDir = path.join(__dirname, '..', 'collection');
const traitsDir = path.join(collectionDir, 'traits');
const outputDir = path.join(collectionDir, 'output');

export const outputImageDir = path.join(outputDir, 'images');
export const outputMetadataDir = path.join(outputDir, 'metadata');

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
  const {traits, elements, filePaths} = await initializeCollection();
  console.timeEnd('Initialize collection');

  console.time('Generate sets');
  const sets = generateSets(setting, traits, elements);
  console.timeEnd('Generate sets');

  console.time('Generate images');
  await generateAssets(sets, filePaths);
  console.timeEnd('Generate images');
})();

async function initializeCollection() {
  const traits: string[] =
    setting.traits ||
    (await readdir(traitsDir, {withFileTypes: true})).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);

  const {elements, filePaths}: {elements: ElementLayers[][]; filePaths: TraitFilePaths} = await getElements(traits);

  return {traits, elements, filePaths};
}

async function getElements(traits: string[]) {
  const imgExts = ['.png', '.svg'];
  const layerRegex = /\.\d+$/;
  const filePaths: TraitFilePaths = {};

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

          if (filePaths[trait]) filePaths[trait].push(filePath);
          else filePaths[trait] = [filePath];
        });

      return Object.entries(elementDict).map(([element, layers]) => ({
        layers,
        name: element,
      }));
    })
  );

  return {elements, filePaths};
}

function generateSets(setting: GeneratorSetting, traits: string[], elements: ElementLayers[][]) {
  switch (setting.setsGenerator) {
    case 'multiplication':
      return multiplyTraits(traits, elements, setting.randomTraits);
    case 'randomization':
    default:
      return randomSets(traits, elements, setting.randomTimes || Math.random() * 10);
  }
}

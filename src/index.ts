import * as _cluster from 'node:cluster';
import {existsSync} from 'node:fs';
import {mkdir, readdir, rm, writeFile} from 'node:fs/promises';
import {availableParallelism} from 'os';
import * as path from 'path';

import {ElementLayers} from './set-generator/interface';
import {multiplyTraits} from './set-generator/multiplication';
import {randomSets} from './set-generator/randomization';

import {traitsDir, outputDir, outputImageDir, outputMetadataDir} from './constant';
import {TraitFilePaths} from './interface';
import {GeneratorSetting, setting} from './setting';

main();

async function main() {
  console.time('Initialize collection');
  const {traits, elements, traitFilePaths} = await initializeCollection();
  console.timeEnd('Initialize collection');

  console.time('Generate sets');
  const sets = generateSets(setting, traits, elements);
  console.timeEnd('Generate sets');
  console.log(sets.length);

  console.time('Generate assets');
  if (setting.rmOutputs) {
    await Promise.all([rm(outputImageDir, {recursive: true}), rm(outputMetadataDir, {recursive: true})]).catch();
  }

  !existsSync(outputDir) && (await mkdir(outputDir, {recursive: true}));
  !existsSync(outputImageDir) && (await mkdir(outputImageDir));
  !existsSync(outputMetadataDir) && (await mkdir(outputMetadataDir));

  const setsJsonPath = path.join(outputDir, 'sets.json');
  const traitFilePathsJsonPath = path.join(outputDir, 'traitFilePaths.json');

  await Promise.all([
    writeFile(setsJsonPath, JSON.stringify(sets)),
    writeFile(traitFilePathsJsonPath, JSON.stringify(traitFilePaths)),
  ]);

  const cluster = _cluster as unknown as _cluster.Cluster;
  const numCPUs = availableParallelism();
  let disconnectedCount = 0;

  cluster.setupPrimary({exec: './src/asset-generator.ts'});

  for (let i = 1; i <= numCPUs; i++) {
    const worker = cluster.fork();

    worker.on('exit', () => {
      disconnectedCount++;

      if (disconnectedCount < numCPUs) return;

      Promise.all([rm(setsJsonPath), rm(traitFilePathsJsonPath)]);
      console.timeEnd('Generate assets');
    });
  }
}

async function initializeCollection() {
  const traits: string[] =
    setting.traits ||
    (await readdir(traitsDir, {withFileTypes: true})).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);

  const {elements, traitFilePaths} = await getElements(traits);

  return {traits, elements, traitFilePaths};
}

async function getElements(traits: string[]) {
  const imgExts = ['.png', '.svg'];
  const layerRegex = /\.\d+$/;
  const traitFilePaths: TraitFilePaths = {};

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

          if (traitFilePaths[trait]) traitFilePaths[trait].push(filePath);
          else traitFilePaths[trait] = [filePath];
        });

      return Object.entries(elementDict).map(([element, layers]) => ({
        layers,
        name: element,
      }));
    })
  );

  return {elements, traitFilePaths};
}

function generateSets(setting: GeneratorSetting, traits: string[], elements: ElementLayers[][]) {
  switch (setting.setsGenerator) {
    case 'multiplication':
      return multiplyTraits(traits, elements, setting.randomTraits, setting.constraintSetting);
    case 'randomization':
    default:
      return randomSets(traits, elements, setting.randomTimes || Math.random() * 10);
  }
}

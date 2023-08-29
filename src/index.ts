import * as _cluster from 'node:cluster';
import {existsSync} from 'node:fs';
import {mkdir, readdir, rm} from 'node:fs/promises';
import * as path from 'path';
import * as ProgressBar from 'progress';

import {ElementLayers, TraitSet} from './set-generator/interface';
import {multiplyTraits, multiplyTraitsWithConstraint} from './set-generator/multiplication';
import {randomSets} from './set-generator/randomization';

import {numCpus, traitsDir, outputImageDir, outputMetadataDir} from './constant';
import {TraitFilePaths} from './interface';
import {GeneratorSetting, setting} from './setting';

main();

async function main() {
  console.time('Initialize collection');
  const {traits, elements, traitFilePaths} = await initializeCollection();
  console.timeEnd('Initialize collection');

  console.time('sets');
  const sets = generateSets(setting, traits, elements);
  process.stdout.write(`Generate ${sets.length} `);
  console.timeEnd('sets');

  console.log('Number of cpu cores to use: ' + numCpus);

  console.time('Generate assets');
  await generateAssets(sets, traitFilePaths);
  console.timeEnd('Generate assets');
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
  let sets: TraitSet[];

  switch (setting.setsGenerator) {
    case 'multiplication':
      sets = setting.constraintSetting
        ? multiplyTraitsWithConstraint(traits, elements, setting.constraintSetting, setting.randomTraits)
        : multiplyTraits(traits, elements, setting.randomTraits);
      break;
    case 'randomization':
    default:
      sets = randomSets(traits, elements, setting.randomTimes || Math.random() * 10);
  }

  if (setting.hiddenTraits) {
    sets.forEach(set => {
      for (const trait of setting.hiddenTraits!) {
        delete set.traits[trait];
      }
    });
  }

  return sets;
}

async function generateAssets(sets: TraitSet[], traitFilePaths: TraitFilePaths) {
  setting.rmOutputs &&
    (await Promise.all([rm(outputImageDir, {recursive: true}), rm(outputMetadataDir, {recursive: true})]).catch());

  !existsSync(outputImageDir) && (await mkdir(outputImageDir, {recursive: true}));
  !existsSync(outputMetadataDir) && (await mkdir(outputMetadataDir));

  const cluster = _cluster as unknown as _cluster.Cluster;

  cluster.setupPrimary({exec: './src/asset-generator.ts'});

  for (let i = 1; i <= numCpus; i++) {
    cluster.fork().send({channel: 'init', message: traitFilePaths});
  }

  return new Promise<void>((resolve, reject) => {
    try {
      const progressBar = new ProgressBar(
        'Generating [:bar] :percent, :current/:total assets, estimate: :rate asset per second, :etas left',
        {total: sets.length, width: 50}
      );

      let setIndex = 0;

      cluster.on('message', (worker, {channel}) => {
        if (setIndex < sets.length) {
          worker.send({channel: 'assign', message: {setIndex, set: sets[setIndex]}});
          setIndex++;
        }

        if (channel === 'complete') progressBar.tick();
        if (!progressBar.complete) return;

        cluster.disconnect();
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
}

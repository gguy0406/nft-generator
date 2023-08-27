import * as _cluster from 'node:cluster';
import {readFile, writeFile} from 'node:fs/promises';
import * as path from 'path';

import {Image, createCanvas, loadImage} from 'canvas';

import {TraitSet} from './set-generator/interface';

import {numCPUs, outputDir, outputImageDir, outputMetadataDir} from './constant';
import {TraitFilePaths} from './interface';
import {setting} from './setting';

type ColoredImage = {[colorSet: number]: Image};
type ImageDictionary = {[filePath: string]: Image | ColoredImage};

(async () => {
  const cluster = _cluster as unknown as _cluster.Cluster;

  if (!cluster.worker) return;

  const workerId = cluster.worker.id;
  const sets: TraitSet[] = JSON.parse(await readFile(path.join(outputDir, 'sets.json'), 'utf-8'));
  const filePaths: TraitFilePaths = JSON.parse(await readFile(path.join(outputDir, 'traitFilePaths.json'), 'utf-8'));
  const numSetsEachWorker = Math.ceil(sets.length / numCPUs);
  const startSetIndex = numSetsEachWorker * (workerId - 1);
  const endSetIndex = startSetIndex + numSetsEachWorker;

  await sleep(500 * (workerId - 1));
  await generateAssets(sets.slice(startSetIndex, endSetIndex), filePaths, startSetIndex);
  cluster.worker.disconnect();
})();

async function generateAssets(sets: TraitSet[], traitFilePaths: TraitFilePaths, offset: number) {
  const imgDict = await getImgDict(traitFilePaths);
  const pngConfig = {resolution: setting.resolution};
  const imgSize = setting.imgSize || 1520;

  return sets.reduce(async (previousSet: Promise<[void, void]> | undefined, currentSet, index) => {
    if (previousSet) await previousSet;

    await sleep(500);

    const canvas = createCanvas(imgSize, imgSize);
    const ctx = canvas.getContext('2d');
    const colorSet = setting.syncColor ? Math.floor(Math.random() * setting.syncColor.colorSets.length) : 0;

    for (const layer of Object.values(currentSet.layers)) {
      ctx.drawImage((imgDict[layer] as ColoredImage)[colorSet] || (imgDict[layer] as Image), 0, 0, imgSize, imgSize);
    }

    return Promise.all([
      writeFile(path.join(outputImageDir, `${offset + index + 1}.png`), canvas.toBuffer('image/png', pngConfig)),
      writeFile(
        path.join(outputMetadataDir, `${offset + index + 1}.json`),
        JSON.stringify(currentSet.traits, undefined, 2)
      ),
    ]);
  }, undefined);
}

async function getImgDict(traitFilePaths: TraitFilePaths) {
  const imgDict: ImageDictionary = {};

  if (!setting.syncColor) {
    await getImgDictNormalTrait(imgDict, Object.values(traitFilePaths).flat());

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
    Object.entries(traitFilePaths).map(([trait, filePaths]) => {
      if (!setting.syncColor!.traits.includes(trait)) return getImgDictNormalTrait(imgDict, filePaths);

      return Promise.all(
        filePaths.map(filePath => {
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
                (imgDict[filePath] as ColoredImage)[index] = img;
                return;
              }

              (imgDict[filePath] as ColoredImage)[index] = await loadImage(filePath);
            })
          );
        })
      );
    })
  );

  return imgDict;
}

function getImgDictNormalTrait(imgDict: ImageDictionary, filePaths: string[]) {
  return Promise.all(filePaths.map(async filePath => (imgDict[filePath] = await loadImage(filePath))));
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

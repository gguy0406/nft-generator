import * as _cluster from 'node:cluster';
import {readFile, writeFile} from 'node:fs/promises';
import * as path from 'path';

import {Image, PngConfig, createCanvas, loadImage} from 'canvas';

import {TraitSet} from './set-generator/interface';

import {outputImageDir, outputMetadataDir} from './constant';
import {GeneratorChannel, TraitFilePaths} from './app.interface';
import {ColorSetting} from './generator.interface';
import {setting} from './setting';

type ColoredImage = {[colorSet: number]: Image};
type ImageDictionary = {[filePath: string]: Image | ColoredImage};

(async () => {
  const cluster = _cluster as unknown as _cluster.Cluster;

  if (!cluster.worker) return;

  const worker = cluster.worker;
  const pngConfig = {resolution: setting.resolution};
  const imgSize = setting.imgSize || 1520;
  let imgDict: ImageDictionary;

  worker.on('message', async ({channel, message}: GeneratorChannel) => {
    switch (channel) {
      case 'assign':
        await generateAssets(message.setIndex, message.set, imgDict, pngConfig, imgSize);
        worker.send({channel: 'complete', message: message.setIndex});
        break;
      case 'init':
        imgDict = await getImgDict(message);
        worker.send({channel: 'ready', message: null});
    }
  });
})();

async function generateAssets(
  setIndex: number,
  set: TraitSet,
  imgDict: ImageDictionary,
  pngConfig: PngConfig,
  imgSize: number
) {
  const canvas = createCanvas(imgSize, imgSize);
  const ctx = canvas.getContext('2d');
  const {colorSetIndex, skin} = getColorSet(set);

  for (const layer of Object.values(set.layers)) {
    ctx.drawImage((imgDict[layer] as ColoredImage)[colorSetIndex] || (imgDict[layer] as Image), 0, 0, imgSize, imgSize);
  }

  return Promise.all([
    writeFile(path.join(outputImageDir, `${setIndex + 1}.png`), canvas.toBuffer('image/png', pngConfig)),
    writeFile(
      path.join(outputMetadataDir, `${setIndex + 1}.json`),
      JSON.stringify({...set.traits, Skin: skin}, undefined, 2)
    ),
  ]);
}

function getColorSet(set: TraitSet) {
  if (!setting.syncColor) return {colorSetIndex: 0, skin: ''};

  const colorSets = set.constraint?.Skin
    ? setting.syncColor.colorSets.filter(
        colorSet =>
          !set.constraint!.Skin.disjoin?.includes(colorSet.name) &&
          (!set.constraint!.Skin.join.length || set.constraint!.Skin.join.includes(colorSet.name))
      )
    : setting.syncColor.colorSets;

  if (!setting.raritySetting?.traits.Skin) {
    const randomSet = colorSets[Math.floor(Math.random() * colorSets.length)];
    const randomSetIndex = setting.syncColor.colorSets.findIndex(colorSet => colorSet === randomSet);

    return {colorSetIndex: randomSetIndex, skin: randomSet.name};
  }

  let randomColorSet: ColorSetting['colorSets'][number];

  const totalWeight = colorSets.reduce((total: number, colorSet: ColorSetting['colorSets'][number]) => {
    return (total += setting.raritySetting!.traits.Skin[colorSet.name] || setting.raritySetting!.defaultWeight);
  }, 0);
  const random = Math.floor(Math.random() * totalWeight);
  let sum: number = 0;

  for (const colorSet of colorSets) {
    sum += setting.raritySetting.traits.Skin[colorSet.name] || setting.raritySetting.defaultWeight;

    if (sum < random) continue;

    randomColorSet = colorSet;
    break;
  }

  const colorSetIndex = setting.syncColor.colorSets.findIndex(colorSet => colorSet === randomColorSet);

  return {colorSetIndex: colorSetIndex, skin: randomColorSet!.name};
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

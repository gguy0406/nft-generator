import {Image, createCanvas} from 'canvas';

import {setting} from '../../collection/setting';

import {ImageDictionary, TraitSet} from '../interfaces';

export function generateCanvas(set: TraitSet, imgs: ImageDictionary) {
  const imgSize = setting.imgSize || 512;
  const canvas = createCanvas(imgSize, imgSize);
  const ctx = canvas.getContext('2d');
  const allLayers: {[zIndex: string]: Image} = {};
  const skinColor = setting.syncColor
    ? Math.floor(Math.random() * setting.syncColor.colorSets.length)
    : 0;

  for (const {layers} of Object.values(set)) {
    for (const [zIndex, layer] of Object.entries(layers)) {
      allLayers[zIndex] = imgs[layer][skinColor];
    }
  }

  Object.keys(allLayers)
    .map(zIndex => Number(zIndex))
    .sort((a, b) => a - b)
    .forEach(zIndex => {
      ctx.drawImage(allLayers[zIndex], 0, 0, imgSize, imgSize);
    });

  return canvas;
}

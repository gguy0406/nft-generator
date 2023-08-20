import {Image, createCanvas} from 'canvas';

import {ImageDictionary, TraitSet} from './interface';

export function genCanvas(set: TraitSet, imgs: ImageDictionary, imgSize: number = 512, skinColor: number = 0) {
  const canvas = createCanvas(imgSize, imgSize);
  const ctx = canvas.getContext('2d');
  const allLayers: {[zIndex: string]: Image} = {};

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

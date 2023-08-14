import { Image, createCanvas } from 'canvas';

import { AllElementImage, TraitSet } from '../interfaces';

export function generateCanvas(set: TraitSet, imgs: AllElementImage, imgSize: number = 545) {
  const canvas = createCanvas(imgSize, imgSize);
  const ctx = canvas.getContext('2d');
  const allLayers: {[zIndex: string]: Image} = {};

  for (const [, element] of Object.entries(set)) {
    for (const [zIndex, layer] of Object.entries(element.layers)) {
      allLayers[zIndex] = imgs[layer];
    }

    Object
      .keys(allLayers)
      .map((zIndex) => Number(zIndex))
      .sort()
      .forEach((zIndex) => { ctx.drawImage(allLayers[zIndex], 0, 0, imgSize, imgSize); });
  }

  return canvas;
}

import {Canvas, Image, createCanvas} from 'canvas';
import {writeFile} from 'node:fs/promises';
import * as path from 'path';

import {AllElementImage, TraitSet} from '../interfaces';

export function generateCanvas(
  set: TraitSet,
  imgs: AllElementImage,
  imgSize: number = 545
) {
  const canvas = createCanvas(imgSize, imgSize);
  const ctx = canvas.getContext('2d');
  const allLayers: {[zIndex: string]: Image} = {};

  for (const {layers} of Object.values(set)) {
    for (const [zIndex, layer] of Object.entries(layers)) {
      allLayers[zIndex] = imgs[layer];
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

export async function saveImage(
  directory: string,
  fileName: string,
  canvas: Canvas
) {
  await writeFile(
    path.join(directory, 'output', 'images', fileName),
    canvas.toBuffer()
  );
}

import {Canvas} from 'canvas';

import {AllElementImage, CollectionSetting, TraitSet} from '../interfaces';

import {generateCanvas} from './canvas-generator';

export function generateCanvases(
  sets: TraitSet[],
  imgs: AllElementImage,
  setting: CollectionSetting
) {
  const batchSize = setting.batchSize || 100;
  const batches: TraitSet[][] = [];

  sets.forEach((set, index) => {
    const batch = Math.floor(index / batchSize);

    if (batches[batch]) batches[batch].push(set);
    else batches[batch] = [set];
  });

  const canvases: Canvas[] = [];

  for (const batch of batches) {
    batch.forEach(set => {
      canvases.push(generateCanvas(set, imgs, setting.imgSize));
    });
  }

  return canvases;
}

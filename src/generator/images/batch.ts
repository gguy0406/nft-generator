import {AllElementImage, CollectionSetting, TraitSet} from '../interfaces';

import {generateCanvas, saveImage} from './common';

export async function generateImages(
  directory: string,
  sets: TraitSet[],
  imgs: AllElementImage,
  setting: CollectionSetting
) {
  const batchSize = setting.batchSize || 1000;
  const batches: TraitSet[][] = [];

  sets.forEach((set, index) => {
    const batch = Math.floor(index / batchSize);

    if (batches[batch]) batches[batch].push(set);
    else batches[batch] = [set];
  });

  await batches.reduce(
    async (previousBatch: Promise<void[]>, currentBatch) => {
      if (previousBatch) await previousBatch;

      return Promise.all(
        currentBatch.map(async (set, index) =>
          saveImage(
            directory,
            `${index + 1}.png`,
            generateCanvas(set, imgs, setting.imgSize)
          )
        )
      );
    },
    undefined as unknown as Promise<void[]>
  );
}

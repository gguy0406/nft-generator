import {generateCanvas} from '../canvas';
import {ImageDictionary, CollectionSetting, TraitSet} from '../interfaces';

import {saveImage} from './common';

export async function generateImages(
  sets: TraitSet[],
  imgs: ImageDictionary,
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
          saveImage(`${index + 1}.png`, generateCanvas(set, imgs))
        )
      );
    },
    undefined as unknown as Promise<void[]>
  );
}

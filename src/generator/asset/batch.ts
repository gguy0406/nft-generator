import {TraitSet, genAssetsCallbackfn} from '../interface';

export async function batchGenAssets<T>(
  sets: TraitSet[],
  callbackfn: typeof genAssetsCallbackfn<T>,
  batchSize: number = 1000
) {
  const batches: TraitSet[][] = [];

  sets.forEach((set, index) => {
    const batch = Math.floor(index / batchSize);

    if (batches[batch]) batches[batch].push(set);
    else batches[batch] = [set];
  });

  return batches.reduce(
    async (previousBatch, currentBatch, batchIndex) => {
      await previousBatch;

      return Promise.all(
        currentBatch.map(async (set, setIndex) => callbackfn(set, batchIndex * batchSize + setIndex + 1))
      );
    },
    Promise.all([] as T[])
  );
}

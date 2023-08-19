import {TraitSet} from '../interface';

export async function generateByBatch<T>(
  sets: TraitSet[],
  cb: (set: TraitSet, index: number) => Promise<T>,
  batchSize: number = 1000
) {
  const batches: TraitSet[][] = [];

  sets.forEach((set, index) => {
    const batch = Math.floor(index / batchSize);

    if (batches[batch]) batches[batch].push(set);
    else batches[batch] = [set];
  });

  await batches.reduce(
    async (previousBatch: Promise<T[]>, currentBatch) => {
      if (previousBatch) await previousBatch;

      return Promise.all(currentBatch.map(cb));
    },
    undefined as unknown as Promise<T[]>
  );
}

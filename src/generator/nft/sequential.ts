import {TraitSet} from '../interface';

export async function sequentialGenNfts<T>(sets: TraitSet[], cb: (set: TraitSet, index: number) => Promise<T>) {
  return sets.reduce(
    async (previousSet, currentSet, index) => {
      if (previousSet) await previousSet;

      return cb(currentSet, index);
    },
    undefined as unknown as Promise<T>
  );
}

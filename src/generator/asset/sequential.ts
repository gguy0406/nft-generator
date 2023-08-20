import {TraitSet, genAssetsCallbackfn} from '../interface';

export async function sequentialGenAssets<T>(sets: TraitSet[], callbackfn: typeof genAssetsCallbackfn<T>) {
  return sets.reduce(
    async (previousSet, currentSet, index) => {
      if (previousSet) await previousSet;

      return callbackfn(currentSet, index);
    },
    undefined as unknown as Promise<T>
  );
}

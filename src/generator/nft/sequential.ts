import {TraitSet} from '../interface';

export async function generateSequential<T>(
  sets: TraitSet[],
  cb: (set: TraitSet, index: number) => Promise<T>
) {
  await sets.reduce(
    async (previousSet, currentSet, index) => {
      if (previousSet) await previousSet;

      return cb(currentSet, index);
    },
    undefined as unknown as Promise<T>
  );
}

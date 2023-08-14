import { ElementLayers, TraitSet } from '../interfaces';

export function generateSets(
    traits: string[],
    elements: ElementLayers[][],
    traitIndex: number = 0,
    memoSet: {[trait: string]: TraitSet[]} = {}): TraitSet[] {
  const trait = traits[traitIndex];

  if (memoSet[trait]) return memoSet[trait];

  const currentSet = elements[traitIndex + 1]
    ? elements[traitIndex].reduce((sets: TraitSet[], element) => {
        // TODO: implement element constraint
        generateSets(traits, elements, traitIndex + 1, memoSet)
          .forEach((smallerSet) => sets.push({...smallerSet, [trait]: element}));

        return sets;
      }, [])
    : elements[traitIndex].map((element) => ({[trait]: element}));

  if (traitIndex == 0) return currentSet;

  return (memoSet[trait] ||= currentSet);
}

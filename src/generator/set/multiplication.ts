import {ElementLayers, TraitSet} from '../interface';

export function multiplyTraits(
  traits: string[],
  elements: ElementLayers[][],
  traitIndex: number = 0,
  memoSet: {[trait: string]: TraitSet[]} = {}
): TraitSet[] {
  const trait = traits[traitIndex];

  if (memoSet[trait]) return memoSet[trait];

  let currentSet: TraitSet[];

  if (trait === 'Background' || trait === 'Ear') {
    currentSet = traits[traitIndex + 1] ? multiplyTraits(traits, elements, traitIndex + 1, memoSet) : [];
  } else if (traits[traitIndex + 1]) {
    const smallerSets = multiplyTraits(traits, elements, traitIndex + 1, memoSet);

    // TODO: implement element constraint
    currentSet = smallerSets.length
      ? elements[traitIndex].reduce((sets: TraitSet[], element) => {
          smallerSets.forEach(smallerSet => {
            sets.push({...smallerSet, [trait]: element});
          });

          return sets;
        }, [])
      : elements[traitIndex].map(element => ({[trait]: element}));
  } else {
    currentSet = elements[traitIndex].map(element => ({[trait]: element}));
  }

  if (traitIndex === 0) {
    const bgTraitIndex = traits.findIndex(trait => trait === 'Background');
    const earIndex = traits.findIndex(trait => trait === 'Ear');

    currentSet.map(set => {
      set['Background'] = elements[bgTraitIndex][Math.floor(Math.random() * elements[bgTraitIndex].length)];
      set['Ear'] = elements[earIndex][Math.floor(Math.random() * elements[earIndex].length)];

      return set;
    });

    return currentSet;
  }

  return (memoSet[trait] ||= currentSet);
}

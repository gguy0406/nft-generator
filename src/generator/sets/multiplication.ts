import {ElementLayers, TraitSet} from '../interfaces';

import * as randomization from './randomization';

export function generateSets(
  traits: string[],
  elements: ElementLayers[][],
  traitIndex: number = 0,
  memoSet: {[trait: string]: TraitSet[]} = {}
): TraitSet[] {
  const trait = traits[traitIndex];

  if (memoSet[trait]) return memoSet[trait];

  let currentSet: TraitSet[];

  if (trait === 'Background' || trait === 'Ear') {
    const randomElement =
      elements[traitIndex][
        Math.floor(Math.random() * elements[traitIndex].length)
      ];

    currentSet = elements[traitIndex + 1]
      ? generateSets(traits, elements, traitIndex + 1, memoSet).map(set => ({
          ...set,
          [trait]: randomElement,
        }))
      : [{[trait]: randomElement}];
  }

  currentSet = elements[traitIndex + 1]
    ? elements[traitIndex].reduce((sets: TraitSet[], element) => {
        // TODO: implement element constraint
        generateSets(traits, elements, traitIndex + 1, memoSet).forEach(
          smallerSet => sets.push({...smallerSet, [trait]: element})
        );

        return sets;
      }, [])
    : elements[traitIndex].map(element => ({[trait]: element}));

  if (traitIndex === 0) return currentSet;

  return (memoSet[trait] ||= currentSet);
}

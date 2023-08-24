import {assignRandomElement} from './assign-random-element';
import {ElementLayers, TraitSet} from './interface';

export function multiplyTraits(
  traits: string[],
  elements: ElementLayers[][],
  randomTraits?: string[],
  traitIndex: number = 0,
  memoSet: {[trait: string]: TraitSet[]} = {}
): TraitSet[] {
  const trait = traits[traitIndex];

  if (memoSet[trait]) return memoSet[trait];

  let currentSets: TraitSet[];

  if (randomTraits?.includes(trait)) {
    currentSets = traits[traitIndex + 1] ? multiplyTraits(traits, elements, randomTraits, traitIndex + 1, memoSet) : [];
  } else if (traits[traitIndex + 1]) {
    const smallerSets = multiplyTraits(traits, elements, randomTraits, traitIndex + 1, memoSet);

    // TODO: implement element constraint
    currentSets = smallerSets.length
      ? elements[traitIndex].reduce((sets: TraitSet[], element) => {
          smallerSets.forEach(smallerSet => {
            sets.push({
              traits: {...smallerSet.traits, [trait]: element.name},
              layers: {...smallerSet.layers, ...element.layers},
            });
          });

          return sets;
        }, [])
      : getSmallestSet(trait, elements[traitIndex]);
  } else {
    currentSets = getSmallestSet(trait, elements[traitIndex]);
  }

  if (traitIndex === 0 && randomTraits?.length) {
    randomTraits.forEach(rdTrait => {
      const rdTraitIndex = traits.findIndex(trait => trait === rdTrait);

      if (~rdTraitIndex) return;

      currentSets.forEach(set => {
        assignRandomElement(set, trait, elements[rdTraitIndex]);
      });
    });

    return currentSets;
  }

  return (memoSet[trait] ||= currentSets);
}

function getSmallestSet(trait: string, elements: ElementLayers[]) {
  return elements.map(element => ({traits: {[trait]: element.name}, layers: element.layers}));
}

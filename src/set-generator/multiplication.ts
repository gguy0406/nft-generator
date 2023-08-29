import {addConstraint, assignRandomElement, filterElementConstraint} from './common';
import {ConstraintSetting, ElementLayers, TraitSet} from './interface';

export function multiplyTraits(
  traits: string[],
  elements: ElementLayers[][],
  randomTraits: string[] | undefined,
  traitIndex: number = 0,
  memoSet: {[trait: string]: TraitSet[]} = {}
): TraitSet[] {
  const trait = traits[traitIndex];

  if (memoSet[trait]) return memoSet[trait];

  let currentSets: TraitSet[];

  const getSmallestSet = () =>
    elements[traitIndex].map(element => ({traits: {[trait]: element.name}, layers: element.layers}));
  const getSmallerSet = () => multiplyTraits(traits, elements, randomTraits, traitIndex + 1, memoSet);

  if (randomTraits?.includes(trait)) {
    currentSets = traits[traitIndex + 1] ? getSmallerSet() : [];
  } else if (traits[traitIndex + 1]) {
    const smallerSets = getSmallerSet();

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
      : getSmallestSet();
  } else {
    currentSets = getSmallestSet();
  }

  if (traitIndex !== 0) return (memoSet[trait] ||= currentSets);
  if (!randomTraits?.length) return currentSets;

  randomTraits.forEach(rdTrait => {
    const rdTraitIndex = traits.findIndex(_trait => _trait === rdTrait);

    if (!~rdTraitIndex) return;

    currentSets.forEach(set => assignRandomElement(set, trait, elements[rdTraitIndex]));
  });

  return currentSets;
}

export function multiplyTraitsWithConstraint(
  traits: string[],
  elements: ElementLayers[][],
  constraintSetting: ConstraintSetting,
  randomTraits: string[] | undefined,
  traitIndex: number = 0,
  memoSet: {[trait: string]: Required<TraitSet>[]} = {}
): Required<TraitSet>[] {
  const trait = traits[traitIndex];

  if (memoSet[trait]) return memoSet[trait];

  let currentSets: Required<TraitSet>[];

  const getSmallestSet = () => getSmallestSetWithConstraint(trait, elements[traitIndex], constraintSetting);
  const getSmallerSet = () =>
    multiplyTraitsWithConstraint(traits, elements, constraintSetting, randomTraits, traitIndex + 1, memoSet);

  if (randomTraits?.includes(trait)) {
    currentSets = traits[traitIndex + 1] ? getSmallerSet() : [];
  } else if (traits[traitIndex + 1]) {
    const smallerSets = getSmallerSet();

    currentSets = smallerSets.length
      ? elements[traitIndex].reduce((sets: Required<TraitSet>[], element) => {
          smallerSets.forEach(smallerSet => {
            const constraintTrait = smallerSet.constraint[trait];

            if (
              constraintTrait &&
              (constraintTrait.disjoin.includes(element.name) ||
                (constraintTrait.join.length && !constraintTrait.join.includes(element.name)))
            ) {
              return;
            }

            const newSet = {
              traits: {...smallerSet.traits, [trait]: element.name},
              layers: {...smallerSet.layers, ...element.layers},
              constraint: structuredClone(smallerSet.constraint),
            };

            addConstraint(trait, element, constraintSetting, newSet.constraint);
            sets.push(newSet);
          });

          return sets;
        }, [])
      : getSmallestSet();
  } else {
    currentSets = getSmallestSet();
  }

  if (traitIndex !== 0) return (memoSet[trait] ||= currentSets);
  if (!randomTraits?.length) return currentSets;

  randomTraits.forEach(rdTrait => {
    const rdTraitIndex = traits.findIndex(_trait => _trait === rdTrait);

    if (!~rdTraitIndex) return;

    currentSets.forEach(set => {
      const filteredElement = filterElementConstraint(set, rdTrait, elements[rdTraitIndex], constraintSetting);

      assignRandomElement(set, trait, filteredElement);
    });
  });

  return currentSets;
}

function getSmallestSetWithConstraint(trait: string, elements: ElementLayers[], constraintSetting: ConstraintSetting) {
  return elements.map(element => {
    const constraint = addConstraint(trait, element, constraintSetting);

    return {constraint, traits: {[trait]: element.name}, layers: {...element.layers}};
  });
}

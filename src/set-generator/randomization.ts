import {addConstraint, assignRandomElement, filterElementConstraint} from './common';
import {ConstraintSetting, ElementLayers, RaritySetting, TraitSet} from './interface';

export function randomSets(
  traits: string[],
  elements: ElementLayers[][],
  quantity: number = 1,
  raritySetting: RaritySetting | undefined
): TraitSet[] {
  const sets: TraitSet[] = [];

  for (let i = 1; i <= quantity; i++) {
    sets.push(
      traits.reduce(
        (set: TraitSet, trait, index) => assignRandomElement(set, trait, elements[index], raritySetting).set,
        {
          traits: {},
          layers: {},
        }
      )
    );
  }

  return sets;
}

export function randomSetsWithConstraint(
  traits: string[],
  elements: ElementLayers[][],
  constraintSetting: ConstraintSetting,
  quantity: number = Math.random() * 10,
  raritySetting: RaritySetting | undefined
): TraitSet[] {
  const reversedTraits = traits.reverse();
  const reversedElements = elements.reverse();
  const sets: TraitSet[] = [];

  while (sets.length < quantity) {
    let valid: boolean = true;
    const set = reversedTraits.reduce(
      (set: Required<TraitSet>, trait, index) => {
        if (!valid) return set;

        const filteredElements = filterElementConstraint(set, trait, reversedElements[index], constraintSetting);

        if (!filteredElements.length) {
          valid = false;
          return set;
        }

        const {randomElement} = assignRandomElement(set, trait, filteredElements, raritySetting);

        set.constraint = addConstraint(trait, randomElement, constraintSetting, set.constraint);

        return set;
      },
      {traits: {}, layers: {}, constraint: {}}
    );

    valid && sets.push(set);
  }

  return sets;
}

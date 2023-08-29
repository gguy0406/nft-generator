import {addConstraint, assignRandomElement, filterElementConstraint} from './common';
import {ConstraintSetting, ElementLayers, TraitSet} from './interface';

export function randomSets(traits: string[], elements: ElementLayers[][], quantity: number = 1): TraitSet[] {
  const sets: TraitSet[] = [];

  for (let i = 1; i <= quantity; i++) {
    sets.push(
      traits.reduce((set: TraitSet, trait, index) => assignRandomElement(set, trait, elements[index]).set, {
        traits: {},
        layers: {},
      })
    );
  }

  return sets;
}

export function randomSetsWithConstraint(
  traits: string[],
  elements: ElementLayers[][],
  constraintSetting: ConstraintSetting,
  quantity: number = Math.random() * 10
): TraitSet[] {
  const sets: TraitSet[] = [];

  for (let i = 1; i <= quantity; i++) {
    sets.push(
      traits.reverse().reduce(
        (set: Required<TraitSet>, trait, index) => {
          const filteredElement = filterElementConstraint(set, trait, elements[index], constraintSetting);
          const {randomElement} = assignRandomElement(set, trait, filteredElement);

          set.constraint = addConstraint(trait, randomElement, constraintSetting, set.constraint);

          return set;
        },
        {traits: {}, layers: {}, constraint: {}}
      )
    );
  }

  return sets;
}

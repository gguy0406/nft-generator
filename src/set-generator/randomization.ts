import {assignRandomElement} from './assign-random-element';
import {ElementLayers, TraitSet} from './interface';

export function randomSets(traits: string[], elements: ElementLayers[][], quantity: number = 1): TraitSet[] {
  const sets: TraitSet[] = [];

  for (let i = 1; i <= quantity; i++) {
    sets.push(
      traits.reduce((set: TraitSet, trait, index) => assignRandomElement(set, trait, elements[index]), {
        traits: {},
        layers: {},
      })
    );
  }

  return sets;
}

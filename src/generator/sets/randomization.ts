import {ElementLayers, TraitSet} from '../interfaces';

export function generateSets(
  traits: string[],
  elements: ElementLayers[][],
  quantity: number
): TraitSet[] {
  const sets: TraitSet[] = [];

  for (let i = 0; i < quantity; i++) {
    sets.push(
      traits.reduce((set: TraitSet, trait, index) => {
        // TODO: implement rarity
        set[trait] =
          elements[index][Math.floor(Math.random() * elements[index].length)];

        return set;
      }, {})
    );
  }

  return sets;
}

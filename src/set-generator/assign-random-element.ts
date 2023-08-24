import {ElementLayers, TraitSet} from './interface';

// TODO: implement rarity
export function assignRandomElement(set: TraitSet, trait: string, elements: ElementLayers[]) {
  const randomElement = elements[Math.floor(Math.random() * elements.length)];

  set.traits[trait] = randomElement.name;
  set.layers = {...set.layers, ...randomElement.layers};

  return set;
}

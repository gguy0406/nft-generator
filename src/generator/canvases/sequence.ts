import { AllElementImage, CollectionSetting, TraitSet } from '../interfaces';

import { generateCanvas } from './canvas-generator';

export function generateCanvases(sets: TraitSet[], imgs: AllElementImage, setting: CollectionSetting) {
  return sets.map((set) => generateCanvas(set, imgs, setting.imgSize));
}

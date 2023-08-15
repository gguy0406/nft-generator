import {Canvas} from 'canvas';

import {AllElementImage, CollectionSetting, TraitSet} from '../interfaces';

import {generateCanvas} from './canvas-generator';

export function generateCanvases(
  sets: TraitSet[],
  imgs: AllElementImage,
  setting: CollectionSetting
) {
  return sets.reduce((canvases: Canvas[], set) => {
    canvases.push(generateCanvas(set, imgs, setting.imgSize));
    return canvases;
  }, []);
}

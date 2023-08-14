import { Canvas } from 'canvas';

import { AllElementImage, CollectionSetting, TraitSet } from '../interfaces';

import { generateCanvas } from './canvas-generator';

export function generateCanvases(sets: TraitSet[], imgs: AllElementImage, setting: CollectionSetting) {
  const segmentSize = setting.segmentSize || 100;
  const segments: TraitSet[][] = [];

  sets.forEach((set, index) => {
    const segment = Math.floor(index / segmentSize);

    if (segments[segment]) segments[segment].push(set);
    else segments[segment] = [set];
  });

  const canvases: Canvas[] = [];

  for (const segment of segments) {
    console.time();
    segment.forEach((set) => { canvases.push(generateCanvas(set, imgs, setting.imgSize)); });
    console.timeEnd();
  }

  return canvases;
}

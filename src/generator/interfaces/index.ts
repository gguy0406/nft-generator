import {Image} from 'canvas';

export type ElementLayers = {name: string; layers: Record<string, string>};
export type TraitSet = Record<string, ElementLayers>;
export type AllElementImage = Record<string, Image>;

export interface CollectionSetting {
  imgSize: number;
  setsGenerator: 'multiplication' | 'randomization';
  imagesGenerator: 'batch' | 'sequential';
  randomTimes?: number;
  batchSize?: number;
}

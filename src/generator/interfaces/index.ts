import {Image} from 'canvas';

export type ElementLayers = {name: string; layers: Record<string, string>};
export type TraitSet = Record<string, ElementLayers>;
export type ImageDictionary = Record<string, Record<string, Image>>;

export interface CollectionSetting {
  imgSize?: number;
  randomTimes?: number;
  batchSize?: number;
  setsGenerator?: 'multiplication' | 'randomization';
  imagesGenerator?: 'batch' | 'sequential';
}

export interface ColorSetting {
  types: string[];
  defaultSet: Record<string, string>;
  colorSets: Array<Record<string, string>>;
}

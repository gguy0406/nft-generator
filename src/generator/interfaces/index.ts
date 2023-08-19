import {Image} from 'canvas';

export type ElementLayers = {name: string; layers: Record<string, string>};
export type TraitSet = Record<string, ElementLayers>;
export type ImageDictionary = Record<string, Record<string, Image>>;

export interface CollectionSetting {
  removeOutputs?: boolean;
  indexStep?: number;
  imgSize?: number;
  resolution?: number;
  randomTimes?: number;
  batchSize?: number;
  setsGenerator?: 'multiplication' | 'randomization';
  imgsGenerator?: 'batch' | 'sequential';
  traits?: string[];
  syncColor?: ColorSetting;
}

export interface ColorSetting {
  types: string[];
  defaultSet: Record<ColorSetting['types'][number], string>;
  colorSets: Array<ColorSetting['defaultSet']>;
}

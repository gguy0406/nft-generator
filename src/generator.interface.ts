import {ConstraintSetting, RaritySetting} from './set-generator/interface';

export interface GeneratorSetting {
  resetOutputs?: boolean;
  checkOutputSets?: boolean;
  shuffling?: boolean;
  numWorker?: number;
  indexStep?: number;
  imgSize?: number;
  resolution?: number;
  randomTimes?: number;
  setsGenerator?: 'multiplication' | 'randomization';
  traits?: string[];
  randomTraits?: string[];
  hiddenTraits?: string[];
  canBeEmptyTraits?: string[];
  syncColor?: ColorSetting;
  constraintSetting?: ConstraintSetting;
  raritySetting?: RaritySetting;
}

export interface ColorSetting {
  traits: string[];
  types: string[];
  defaultSet: Record<ColorSetting['types'][number], string>;
  colorSets: Array<ColorSetting['defaultSet'] & {name: string}>;
}

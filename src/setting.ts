import {ConstraintSetting} from './set-generator/interface';

export interface GeneratorSetting {
  rmOutputs?: boolean;
  indexStep?: number;
  imgSize?: number;
  resolution?: number;
  randomTimes?: number;
  setsGenerator?: 'multiplication' | 'randomization';
  traits?: string[];
  randomTraits?: string[];
  syncColor?: ColorSetting;
  constraintSetting?: ConstraintSetting;
}

export interface ColorSetting {
  traits: string[];
  types: string[];
  defaultSet: Record<ColorSetting['types'][number], string>;
  colorSets: Array<ColorSetting['defaultSet']>;
}

export const setting: GeneratorSetting = {
  rmOutputs: true,
  indexStep: 200,
  imgSize: 2000,
  resolution: 150,
  randomTimes: 60,
  setsGenerator: 'multiplication',
  traits: ['Background', 'Body', 'Cloth', 'Hand', 'Self', 'Head', 'Hair', 'Face', 'Ear'],
  randomTraits: ['Background', 'Ear'],
  syncColor: {
    traits: ['Body', 'Hand', 'Head', 'Face', 'Ear'],
    types: ['Main color', 'Shadow color'],
    defaultSet: {'Main color': '#FFC68E', 'Shadow color': '#D18154'},
    colorSets: [
      {'Main color': '#FFC68E', 'Shadow color': '#D18154'},
      {'Main color': '#FFCAB5', 'Shadow color': '#FFA080'},
      {'Main color': '#FFECF1', 'Shadow color': '#FFDAE4'},
      {'Main color': '#9C7828', 'Shadow color': '#5F3806'},
      {'Main color': '#AA4A37', 'Shadow color': '#71150C'},
      {'Main color': '#7C00D9', 'Shadow color': '#3C00B9'},
    ],
  },
  constraintSetting: {
    Ear: {Earrings: {disjoin: {Hand: ['Spinning']}}},
    Face: {
      StarFace: {
        join: {Self: ['Evil', 'Planet']},
        disjoin: {Hair: ['TiffanyCowboy']},
      },
    },
    Hair: {CyanFuzz: {join: {Hand: ['BluePot']}}},
  },
};

import {ConstraintSetting} from './set-generator/interface';

export interface GeneratorSetting {
  resetOutputs?: boolean;
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
  syncColor?: ColorSetting;
  constraintSetting?: ConstraintSetting;
}

export interface ColorSetting {
  traits: string[];
  types: string[];
  defaultSet: Record<ColorSetting['types'][number], string>;
  colorSets: Array<ColorSetting['defaultSet']>;
}

// ch0pch0p c0 setting
export const setting: GeneratorSetting = {
  resetOutputs: true,
  // shuffling: true,
  indexStep: 100,
  imgSize: 595.28,
  resolution: 150,
  randomTimes: 10000,
  setsGenerator: 'randomization',
  traits: ['Background', 'Body', 'Self', 'Head', 'Face', 'Hair', 'Hands', 'Accessories'],
  // randomTraits: ['Background', 'Body'],
  // hiddenTraits: ['Background', 'Body', 'Ear'],
  syncColor: {
    traits: ['Body', 'Head', 'Hands'],
    types: ['Main color', 'Shadow color'],
    defaultSet: {'Main color': '#FEB8B0', 'Shadow color': '#BA828F'},
    colorSets: [
      {'Main color': '#FEB8B0', 'Shadow color': '#BA828F'},
      {'Main color': '#F4CD98', 'Shadow color': '#DBA86B'},
      {'Main color': '#EFAC5E', 'Shadow color': '#C17434'},
      {'Main color': '#A56628', 'Shadow color': '#7F4B1C'},
    ],
  },
  // constraintSetting: {
  //   Ear: {Earrings: {disjoin: {Hand: ['Spinning']}}},
  //   Face: {
  //     StarFace: {
  //       join: {Self: ['Evil', 'Planet']},
  //       disjoin: {Hair: ['TiffanyCowboy']},
  //     },
  //   },
  //   Hair: {CyanFuzz: {join: {Hand: ['BluePot']}}},
  // },
};

// ch0pch0p c1 setting
// export const setting: GeneratorSetting = {
//   resetOutputs: true,
//   shuffling: true,
//   indexStep: 200,
//   imgSize: 2000,
//   resolution: 150,
//   randomTimes: 30,
//   setsGenerator: 'multiplication',
//   traits: ['Background', 'Body', 'Cloth', 'Hand', 'Self', 'Head', 'Hair', 'Face', 'Ear'],
//   randomTraits: ['Background', 'Ear'],
//   hiddenTraits: ['Background', 'Body', 'Ear'],
//   syncColor: {
//     traits: ['Body', 'Hand', 'Head', 'Face', 'Ear'],
//     types: ['Main color', 'Shadow color'],
//     defaultSet: {'Main color': '#FFC68E', 'Shadow color': '#D18154'},
//     colorSets: [
//       {'Main color': '#FFC68E', 'Shadow color': '#D18154'},
//       {'Main color': '#FFCAB5', 'Shadow color': '#FFA080'},
//       {'Main color': '#FFECF1', 'Shadow color': '#FFDAE4'},
//       {'Main color': '#9C7828', 'Shadow color': '#5F3806'},
//       {'Main color': '#AA4A37', 'Shadow color': '#71150C'},
//       {'Main color': '#7C00D9', 'Shadow color': '#3C00B9'},
//     ],
//   },
//   constraintSetting: {
//     Ear: {Earrings: {disjoin: {Hand: ['Spinning']}}},
//     Face: {
//       StarFace: {
//         join: {Self: ['Evil', 'Planet']},
//         disjoin: {Hair: ['TiffanyCowboy']},
//       },
//     },
//     Hair: {CyanFuzz: {join: {Hand: ['BluePot']}}},
//   },
// };

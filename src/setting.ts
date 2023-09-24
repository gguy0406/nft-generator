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
  imgSize: 2000,
  resolution: 150,
  randomTimes: 200,
  setsGenerator: 'randomization',
  traits: ['Background', 'Body', 'Self', 'Head', 'Face', 'Hair', 'Hands', 'Accessories'],
  randomTraits: ['Background', 'Accessories'],
  // hiddenTraits: ['Background', 'Body', 'Ear'],
  syncColor: {
    traits: ['Body', 'Head', 'Face', 'Hands'],
    types: ['Main color', 'Shadow color'],
    defaultSet: {'Main color': '#feb8b0', 'Shadow color': '#ba828f'},
    colorSets: [
      {'Main color': '#feb8b0', 'Shadow color': '#ba828f'},
      {'Main color': '#f4cd98', 'Shadow color': '#dba86b'},
      {'Main color': '#efac5e', 'Shadow color': '#c17434'},
      {'Main color': '#a56628', 'Shadow color': '#7f4b1c'},
    ],
  },
  constraintSetting: {
    Accessories: {
      Crown: {disjoin: {Hair: ['Beanie', 'Blue Messy Hair', 'Grey Bald', 'Orange Hair Horn', 'Orange Messy Hair']}},
      'Kitsune Mask': {
        disjoin: {Self: ['H2O Rubber Duck', 'Web Spider'], Hair: ['Orange Hair Horn'], Hands: ['basketball']},
      },
      Pencil: {disjoin: {Hair: ['Dreadlock 1', 'Long Yellow Hair'], Hands: ['basketball']}},
      Piecings: {disjoin: {Hair: ['Dreadlock 2', 'Bob Hair'], Hands: ['basketball']}},
    },
    Hands: {
      basketball: {disjoin: {Background: ['Rusty Orange']}},
      Coffee: {disjoin: {Hair: ['Dreadlock 2', 'Orange Hair Horn']}},
    },
    Hair: {
      'Blue Messy Hair': {disjoin: {Self: ['H2O Cat', 'H2O Fish', 'H2O Rubber Duck']}},
      'Bob Hair': {disjoin: {Self: ['H2O Cat']}},
    },
    Self: {
      'Web Spider': {disjoin: {Background: ['sky cloud']}},
    },
  },
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

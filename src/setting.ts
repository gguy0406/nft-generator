import {ConstraintSetting, RaritySetting} from './set-generator/interface';

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
  nullableTraits?: string[];
  syncColor?: ColorSetting;
  constraintSetting?: ConstraintSetting;
  raritySetting?: RaritySetting;
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
  randomTimes: 50,
  setsGenerator: 'randomization',
  traits: ['Background', 'Body', 'Self', 'Head', 'Face', 'Hair', 'Accessories', 'Hands'],
  randomTraits: ['Background', 'Accessories'],
  // hiddenTraits: [],
  nullableTraits: ['Accessories'],
  syncColor: {
    traits: ['Body', 'Head', 'Face', 'Hands'],
    types: ['Main color', 'Shadow color'],
    defaultSet: {'Main color': '#fbb5ad', 'Shadow color': '#f99e97'},
    colorSets: [
      {'Main color': '#fbb5ad', 'Shadow color': '#f99e97'},
      {'Main color': '#f4cd98', 'Shadow color': '#dba86b'},
      {'Main color': '#efac5e', 'Shadow color': '#c17434'},
      {'Main color': '#a56628', 'Shadow color': '#7f4b1c'},
    ],
  },
  constraintSetting: {
    Accessories: {
      Crown: {
        disjoin: {
          Hair: [
            'Blue Messy Hair',
            'Half-bald',
            'Bald',
            'Orange Hair',
            'Orange Messy Hair',
            'Purple Beanie',
            'Red Beanie',
            'Dark Caesar',
            'Short Black Dreadlock',
            'Short Blonde Dreadlock',
          ],
        },
      },
      'Angel Halo': {
        disjoin: {
          Hair: ['Half-bald', 'Bald', 'Dark Caesar'],
        },
      },
      'Black Piercing': {
        disjoin: {
          Hair: ['Long Dreadlock', 'Bob Hair'],
          Hands: ['Basketball and Soda', 'MP3 and Beer', 'MP3 and Boba'],
        },
      },
      'Metal Piercing': {
        disjoin: {
          Hands: ['Basketball and Soda', 'MP3 and Beer', 'MP3 and Boba'],
        },
      },
      'Neon Earring': {
        disjoin: {
          Hands: ['MP3 and Beer', 'MP3 and Boba'],
        },
      },
      'Pearl Earring': {
        disjoin: {
          Hands: ['MP3 and Beer', 'MP3 and Boba'],
        },
      },
      'Pink Earring': {
        disjoin: {
          Hands: ['MP3 and Beer', 'MP3 and Boba'],
        },
      },
      'Kitsune Mask': {
        disjoin: {Self: ['Duckie', 'Spider'], Hair: ['Orange Hair'], Hands: ['Basketball and Soda']},
      },
      Pencil: {
        disjoin: {
          Hair: ['Long Yellow Hair', 'Orange Curly Hair', 'Green Curly Hair', 'Green Hair Bun'],
          Hands: ['Basketball and Soda', 'Ice Cream and Strawberry', 'Guitar'],
        },
      },
    },
    Hair: {
      'Blue Messy Hair': {disjoin: {Self: ['Diving Cat', 'Golden Fish', 'Duckie']}},
      'Bob Hair': {disjoin: {Self: ['Diving Cat']}},
    },
    Self: {
      Spider: {disjoin: {Background: ['Blue Sky']}},
    },
  },
  raritySetting: {Body: {Kimono: 100, 'Honey Hoodie': 50}},
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

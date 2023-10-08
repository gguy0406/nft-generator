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

const earAccessories = ['Black Piercing', 'Metal Piercing', 'Neon Earring', 'Pearl Earring', 'Pink Earring'];
const shortHair = ['Bald', 'Half-bald', 'Dark Caesar'];
const boyHair = ['Blonde Quiff', 'Red Mohawk', 'Bald', 'Half-bald', 'Green Messy Hair', 'Orange Messy Hair'];
const girlyAndUnisexHair = [
  // girly
  'Bob Hair',
  'Green Hair Bun',
  'Orange Hair and Horn',
  'Long Blue Hair',
  'Long Yellow Hair',

  // unisex
  'Dark Caesar',
  'Long Dreadlock',
  'Sponge Curl',
  'Purple Beanie',
  'Red Beanie',
  'Green Curly Hair',
  'Orange Curly Hair',
  // 'Short Black Dreadlock',
  'Short Blonde Dreadlock',
  'Black Nerd',
  // 'Blonde Nerd',
];
const longSleevesBody = [
  'Blue Whale Jacket and Deep Aqua Shirt',
  'Hogwarts Uniform',
  'Black Bomber Jacket and Croptop',
  'Purple and Yellow Bomber Jacket and Croptop',
  'Gray Hoodie',
  'Honey Hoodie',
  'Light Blue Puffer Jacket',
  'Orange Puffer Jacket',
  'Navy Blue Suit and Bow',
  'Suit and Tie',
  'Christmas Sweatshirt',
  'Green Sweatshirt',
];

// ch0pch0p c0 setting
export const setting: GeneratorSetting = {
  resetOutputs: true,
  checkOutputSets: true,
  // shuffling: true,
  indexStep: 100,
  imgSize: 2000,
  resolution: 150,
  randomTimes: 10000,
  setsGenerator: 'randomization',
  traits: ['Background', 'Body', 'Self', 'Head', 'Face', 'Hair', 'Accessories', 'Hands'],
  randomTraits: ['Background', 'Accessories'],
  hiddenTraits: ['Head'],
  canBeEmptyTraits: ['Accessories'],
  syncColor: {
    traits: ['Body', 'Head', 'Face', 'Hands'],
    types: ['Main color', 'Shadow color'],
    defaultSet: {'Main color': '#fbb5ad', 'Shadow color': '#f99e97'},
    colorSets: [
      {name: 'Fair', 'Main color': '#fbb5ad', 'Shadow color': '#f99e97'},
      {name: 'Golden', 'Main color': '#efac5e', 'Shadow color': '#dd934a'},
      {name: 'Umber', 'Main color': '#a56628', 'Shadow color': '#935721'},
    ],
  },
  constraintSetting: {
    Hands: {
      'Basketball and Soda': {
        disjoin: {
          Accessories: ['Black Piercing', 'Metal Piercing', 'Kitsune Mask', 'Pencil'],
        },
      },
      Flashlight: {
        join: {
          Accessories: ['Empty'],
        },
      },
      'MP3 and Beer': {
        disjoin: {
          Accessories: earAccessories,
          Body: longSleevesBody,
        },
      },
      'MP3 and Boba': {
        disjoin: {
          Accessories: earAccessories,
        },
      },
      'Ice Cream and Strawberry': {
        disjoin: {
          Accessories: ['Pencil'],
        },
      },
      Guitar: {
        disjoin: {
          Accessories: ['Pencil'],
        },
      },
    },
    Accessories: {
      'Angel Halo': {
        disjoin: {
          Hair: shortHair,
        },
      },
      Crown: {
        disjoin: {
          Hair: [
            ...shortHair,
            'Orange Hair and Horn',
            'Blue Messy Hair',
            'Orange Messy Hair',
            'Purple Beanie',
            'Red Beanie',
            'Short Black Dreadlock',
            'Short Blonde Dreadlock',
          ],
        },
      },
      'Black Piercing': {
        disjoin: {
          Hair: ['Long Dreadlock', 'Bob Hair'],
          Skin: ['Umber'],
        },
      },
      'Kitsune Mask': {
        join: {
          Body: ['Kimono'],
        },
        disjoin: {
          Hair: ['Orange Hair and Horn'],
          Self: ['Duckie', 'Spider'],
        },
      },
      'Pearl Earring': {
        disjoin: {
          Hair: boyHair,
        },
      },
      Pencil: {
        disjoin: {
          Hair: ['Green Hair Bun', 'Long Blue Hair', 'Long Yellow Hair', 'Green Curly Hair', 'Orange Curly Hair'],
        },
      },
      'Pink Earring': {
        disjoin: {
          Hair: boyHair,
        },
      },
    },
    Hair: {
      'Blue Messy Hair': {
        disjoin: {
          Self: ['Diving Cat', 'Golden Fish', 'Duckie'],
        },
      },
      'Bob Hair': {
        disjoin: {
          Self: ['Diving Cat'],
        },
      },
    },
    Self: {
      Spider: {
        disjoin: {
          Background: ['Blue Sky'],
        },
      },
    },
    Body: {
      'Black Bomber Jacket and Croptop': {
        join: {
          Hair: girlyAndUnisexHair,
        },
      },
      Kimono: {
        join: {
          Accessories: ['Empty', 'Kitsune Mask'],
          Hair: girlyAndUnisexHair,
        },
      },
      'Light Blue Puffer Jacket': {
        disjoin: {
          Background: ['Purple Sky'],
        },
      },
      'Pink Dress with Flower': {
        join: {
          Hair: girlyAndUnisexHair,
        },
      },
      'Purple and Yellow Bomber Jacket and Croptop': {
        join: {
          Hair: girlyAndUnisexHair,
        },
      },
      'Purple Dress with Flower': {
        join: {
          Hair: girlyAndUnisexHair,
        },
      },
      'Purple Jumpsuit and White Shirt': {
        join: {
          Hair: girlyAndUnisexHair,
        },
      },
    },
  },
  raritySetting: {
    defaultWeight: 1000,
    traits: {
      Hair: {
        'Half-bald': 200,
      },
      Body: {
        'Christmas Sweatshirt': 200,
      },
      Skin: {
        Umber: 500,
      },
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

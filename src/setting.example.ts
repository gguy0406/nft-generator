import {GeneratorSetting} from './generator.interface';

export const setting: GeneratorSetting = {
  resetOutputs: true,
  // checkOutputSets: true,
  // shuffling: true,
  indexStep: 100,
  imgSize: 2000,
  resolution: 150,
  randomTimes: 100,
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

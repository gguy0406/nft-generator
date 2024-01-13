import {GeneratorSetting} from './generator.interface';

// ch0pch0p c0 setting
// const earAccessories = ['Black Piercing', 'Metal Piercing', 'Neon Earring', 'Pearl Earring', 'Pink Earring'];
// const shortHair = ['Bald', 'Half-bald', 'Dark Caesar'];
// const boyHair = ['Blonde Quiff', 'Red Mohawk', 'Bald', 'Half-bald', 'Green Messy Hair', 'Orange Messy Hair'];
// const girlyAndUnisexHair = [
//   // girly
//   'Bob Hair',
//   'Green Hair Bun',
//   'Orange Hair and Horn',
//   'Long Blue Hair',
//   'Long Yellow Hair',

//   // unisex
//   'Dark Caesar',
//   'Long Dreadlock',
//   'Sponge Curl',
//   'Purple Beanie',
//   'Red Beanie',
//   'Green Curly Hair',
//   'Orange Curly Hair',
//   'Short Black Dreadlock',
//   'Short Blonde Dreadlock',
//   'Black Nerd',
//   'Blonde Nerd',
// ];
// const longSleevesBody = [
//   'Blue Whale Jacket',
//   'Student Clothes',
//   'Black Bomber',
//   'Purple Bomber',
//   'Gray Hoodie',
//   'Honey Hoodie',
//   'Light Blue Puffer',
//   'Orange Puffer',
//   'Suit and Bow',
//   'Suit and Tie',
//   'Christmas Sweatshirt',
//   'Green Sweatshirt',
// ];

// export const setting: GeneratorSetting = {
//   resetOutputs: true,
//   checkOutputSets: true,
//   // shuffling: true,
//   indexStep: 100,
//   imgSize: 2000,
//   resolution: 150,
//   randomTimes: 1000,
//   setsGenerator: 'randomization',
//   traits: ['Background', 'Body', 'Self', 'Head', 'Face', 'Hair', 'Accessories', 'Hands'],
//   randomTraits: ['Background', 'Accessories'],
//   hiddenTraits: ['Head'],
//   canBeEmptyTraits: ['Accessories'],
//   syncColor: {
//     traits: ['Body', 'Head', 'Face', 'Hands'],
//     types: ['Main color', 'Shadow color'],
//     defaultSet: {'Main color': '#fbb5ad', 'Shadow color': '#f99e97'},
//     colorSets: [
//       {name: 'Fair', 'Main color': '#fbb5ad', 'Shadow color': '#f99e97'},
//       {name: 'Golden', 'Main color': '#efac5e', 'Shadow color': '#dd934a'},
//       {name: 'Umber', 'Main color': '#a56628', 'Shadow color': '#935721'},
//     ],
//   },
//   constraintSetting: {
//     Hands: {
//       'Basketball and Soda': {
//         disjoin: {
//           Accessories: ['Black Piercing', 'Metal Piercing', 'Kitsune Mask', 'Pencil'],
//         },
//       },
//       Flashlight: {
//         join: {
//           Accessories: ['Empty'],
//         },
//       },
//       'MP3 and Beer': {
//         disjoin: {
//           Accessories: earAccessories,
//           Body: longSleevesBody,
//         },
//       },
//       'MP3 and Boba': {
//         disjoin: {
//           Accessories: earAccessories,
//         },
//       },
//       'Ice Cream and Strawberry': {
//         disjoin: {
//           Accessories: ['Pencil'],
//         },
//       },
//       Guitar: {
//         disjoin: {
//           Accessories: ['Pencil'],
//         },
//       },
//     },
//     Accessories: {
//       'Angel Halo': {
//         disjoin: {
//           Hair: shortHair,
//         },
//       },
//       Crown: {
//         disjoin: {
//           Hair: [
//             ...shortHair,
//             'Orange Hair and Horn',
//             'Red Mohawk',
//             'Blue Messy Hair',
//             'Orange Messy Hair',
//             'Purple Beanie',
//             'Red Beanie',
//             'Short Black Dreadlock',
//             'Short Blonde Dreadlock',
//           ],
//         },
//       },
//       'Black Piercing': {
//         disjoin: {
//           Hair: ['Long Dreadlock', 'Bob Hair'],
//           Skin: ['Umber'],
//         },
//       },
//       'Kitsune Mask': {
//         join: {
//           Body: ['Kimono'],
//         },
//         disjoin: {
//           Hair: ['Orange Hair and Horn'],
//           Self: ['Duckie', 'Spider'],
//         },
//       },
//       'Pearl Earring': {
//         disjoin: {
//           Hair: boyHair,
//         },
//       },
//       Pencil: {
//         disjoin: {
//           Hair: ['Green Hair Bun', 'Long Blue Hair', 'Long Yellow Hair', 'Green Curly Hair', 'Orange Curly Hair'],
//         },
//       },
//       'Pink Earring': {
//         disjoin: {
//           Hair: boyHair,
//         },
//       },
//     },
//     Hair: {
//       'Blue Messy Hair': {
//         disjoin: {
//           Self: ['Diving Cat', 'Golden Fish', 'Duckie'],
//         },
//       },
//       'Bob Hair': {
//         disjoin: {
//           Self: ['Diving Cat'],
//         },
//       },
//     },
//     Self: {
//       Spider: {
//         disjoin: {
//           Background: ['Blue Sky'],
//         },
//       },
//     },
//     Body: {
//       'Black Bomber': {
//         join: {
//           Hair: girlyAndUnisexHair,
//         },
//       },
//       Kimono: {
//         join: {
//           Accessories: ['Empty', 'Kitsune Mask'],
//           Hair: girlyAndUnisexHair,
//         },
//       },
//       'Light Blue Puffer': {
//         disjoin: {
//           Background: ['Purple Sky'],
//         },
//       },
//       'Pink Dress': {
//         join: {
//           Hair: girlyAndUnisexHair,
//         },
//       },
//       'Purple Bomber': {
//         join: {
//           Hair: girlyAndUnisexHair,
//         },
//       },
//       'Purple Dress': {
//         join: {
//           Hair: girlyAndUnisexHair,
//         },
//       },
//       'Purple Jumpsuit': {
//         join: {
//           Hair: girlyAndUnisexHair,
//         },
//       },
//     },
//   },
//   raritySetting: {
//     defaultWeight: 1000,
//     traits: {
//       Hands: {
//         'Hands up': 2000,
//         'Okie Dokie': 2000,
//         Espresso: 2000,
//         Fck: 2000,
//         Hi: 2000,
//         LFG: 2000,
//       },
//       Accessories: {
//         'Kitsune Mask': 500,
//       },
//       Hair: {
//         'Half-bald': 300,
//       },
//       Body: {
//         'Christmas Sweatshirt': 300,
//         'Red Polo': 500,
//         'Green Polo': 500,
//         'Peace T-shirt': 500,
//         'Stargaze T-Shirt': 500,
//         'ch0pch0p T-Shirt': 500,
//         // Kimono: 100,
//       },
//       Background: {
//         'Blue Sky': 2000,
//         'Columbia Blue': 2000,
//         'Golden Glow': 2000,
//         'Light Salmon': 2000,
//         'Melrose Light': 2000,
//         'Payton Green': 2000,
//         'Saffron Mango': 2000,
//         Grey: 2000,
//       },
//       Skin: {
//         Umber: 500,
//       },
//     },
//   },
// };

// ch0pch0p c1 setting
export const setting: GeneratorSetting = {
  resetOutputs: true,
  // checkOutputSets: true,
  // shuffling: true,
  indexStep: 200,
  imgSize: 2000,
  resolution: 150,
  randomTimes: 1000,
  setsGenerator: 'randomization',
  traits: ['Background', 'Body', 'Clothes', 'Hand', 'Self', 'Head', 'Hair', 'Eyes', 'Ear', 'Nose'],
  // randomTraits: ['Background', 'Accessories'],
  hiddenTraits: ['Ear', 'Nose'],
  // canBeEmptyTraits: ['Accessories'],
  syncColor: {
    traits: ['Body', 'Hand', 'Head', 'Ear', 'Nose'],
    types: ['Main color', 'Shadow color'],
    defaultSet: {'Main color': '#A97400', 'Shadow color': '#703500'},
    colorSets: [
      {name: 'Default', 'Main color': '#A97400', 'Shadow color': '#703500'},
      {name: 'Skin 1', 'Main color': '#FFC68E', 'Shadow color': '#FF9A4F'},
      {name: 'Skin 2', 'Main color': '#AA4A37', 'Shadow color': '#741B11'},
      {name: 'Skin 3', 'Main color': '#FFECF1', 'Shadow color': '#F2C9D6'},
      {name: 'Skin 4', 'Main color': '#7C00D9', 'Shadow color': '#3C00B9'},
      {name: 'Skin 5', 'Main color': '#B8FFEC', 'Shadow color': '#2ED8A7'},
    ],
  },
};

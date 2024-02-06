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
  checkOutputSets: true,
  // shuffling: true,
  indexStep: 100,
  imgSize: 2000,
  resolution: 150,
  randomTimes: 1000,
  setsGenerator: 'randomization',
  traits: ['Background', 'Body', 'Clothes', 'Self', 'Hand', 'Head', 'Hair', 'Face', 'Ear', 'Nose'],
  // randomTraits: ['Background', 'Accessories'],
  hiddenTraits: ['Ear', 'Nose'],
  // canBeEmptyTraits: ['Accessories'],
  syncColor: {
    traits: ['Body', 'Hand', 'Head', 'Ear', 'Nose'],
    types: ['Main color', 'Shadow color'],
    defaultSet: {'Main color': '#A97400', 'Shadow color': '#703500'},
    colorSets: [
      {name: 'Tan', 'Main color': '#A97400', 'Shadow color': '#703500'},
      {name: 'Light', 'Main color': '#FFC68E', 'Shadow color': '#FF9A4F'},
      {name: 'Cocoa', 'Main color': '#AA4A37', 'Shadow color': '#741B11'},
      {name: 'Fair', 'Main color': '#FFECF1', 'Shadow color': '#F2C9D6'},
      {name: 'Lean Addicted', 'Main color': '#7C00D9', 'Shadow color': '#3C00B9'},
      {name: 'Zombie', 'Main color': '#B8FFEC', 'Shadow color': '#2ED8A7'},
    ],
  },
  constraintSetting: {
    Face: {
      'Haunted 1': {
        disjoin: {
          Hair: ['Cap Backward', 'Snap back', 'Scholarly'],
        },
      },
      'Haunted 2': {
        disjoin: {
          Hair: ['Cap Backward', 'Snap back', 'Scholarly'],
        },
      },
    },
  },
  raritySetting: {
    defaultWeight: 1000,
    traits: {
      Background: {
        Bloody: 500,
        'Cheddar Cheese': 500,
        'Dark Ocean': 500,
        'Grand Canyon': 500,
        'Green Ocean': 500,
        'Groovy Purple': 500,
        Heaven: 500,
        Lagoon: 500,
        Lilac: 500,
        'Lover Kiss': 500,
        'Magical Wave': 500,
        Ocean: 500,
        'Purple Witch': 500,
        'Yellow Fever': 500,
      },
      Clothes: {
        'Apron 1': 250,
        Apron: 500,
        'Backpack 1': 250,
        Bartender: 500,
        'Bikini 1': 750,
        Bikini: 750,
        'Bucket Cloth 1': 250,
        'Bucket Cloth': 250,
        "Bud's Robe": 750,
        "Bud's Robe 1": 750,
        'Bulletproof 1': 250,
        Bulletproof: 750,
        'Chad Coat 1': 250,
        'Chad Coat': 250,
        'Cloak 1': 250,
        Cloak: 250,
        'Crop Top 1': 250,
        'Crop Top': 500,
        'Dancewear 1': 500,
        Dancewear: 500,
        Elephant: 250,
        Foxy: 500,
        'Hanbok 1': 500,
        Hanbok: 500,
        'Head Chef': 500,
        'Long Sleeve Shirt': 750,
        'Ninja Coat 1': 750,
        'Ninja Coat': 750,
        Performer: 500,
        'Raincoat 1': 500,
        'Rockstar 1': 250,
        Rockstar: 750,
        'Sailor 1': 500,
        'Savage 1': 500,
        Savage: 500,
        'Scout 1': 250,
        Scout: 250,
        'Sexy Lingerie 1': 250,
        'Sexy Lingerie': 500,
        'Short Sleeve Jacket 1': 500,
        'Stone-age 1': 250,
        'Stone-age': 250,
        'Sweater 1': 250,
        Sweater: 750,
        'T-shirt With Glasses 1': 250,
        'Tank Top 1': 250,
        'Tank Top': 500,
        'Towel 1': 250,
        Towel: 250,
      },
      Face: {
        '3D Glasses 1': 750,
        '3D Glasses 2': 750,
        '@@ 1': 750,
        '@@ 2': 500,
        'Aglow 2': 500,
        'Angry 2': 500,
        'Anti-social 1': 500,
        'Anti-social 2': 500,
        'Frankenstein 1': 250,
        'Frankenstein 2': 250,
        'Girly 2': 250,
        'Goggle 2': 500,
        'Gum Girl 1': 750,
        'Gum Girl 2': 500,
        'Haunted 1': 500,
        'Haunted 2': 500,
        'Hungry 1': 750,
        'Hungry 2': 500,
        'Hypnotized 2': 250,
        'Love 1': 750,
        'Love 2': 250,
        'Pirate 1': 250,
        'Pirate 2': 250,
        'Sad 2': 500,
        'Satisfied 1': 750,
        'Satisfied 2': 750,
        'Scientist 1': 500,
        'Scientist 2': 500,
        'Smoking 1': 750,
        'Smoking 2': 250,
        'Stars 1': 750,
        'Stars 2': 250,
        'Sunglasses 1': 750,
        'Sunglasses 2': 250,
        'XX 2': 250,
        'Yummy 1': 750,
        'Yummy 2': 750,
      },
      Hair: {
        AI: 600,
        Asian: 800,
        'Asymmetrical Bob': 800,
        'Baddest But Green': 400,
        Bandana: 600,
        Beret: 600,
        'Clown Hat': 800,
        'Curly But Red': 600,
        'Double Bangs': 800,
        Egg: 400,
        'Evil Love': 400,
        'Finger Wave': 600,
        'Grim Reaper': 400,
        Masking: 400,
        Master: 600,
        'Maur-Elizabethan': 400,
        Mullet: 800,
        Chad: 800,
        'Night Cap': 800,
        'Purple Bun': 800,
        Rockabilly: 400,
        Saiyan: 600,
        Snapback: 800,
        Strawberry: 600,
        'Three-pronged But Blue': 600,
        Undercut: 800,
        Unicorn: 400,
        Weirdo: 400,
        'Wizard of 0': 600,
        'Yellow Bucket': 600,
      },
      Hand: {
        'Fishing Rod': 400,
        Lance: 800,
        'Magic Wand': 800,
        Pirates: 400,
        Plug: 800,
      },
      Self: {
        Alien: 200,
        Balluice: 200,
        'Bread Scale': 400,
        Broccoli: 400,
        'Chilli Lipstick': 200,
        Cigarrot: 400,
        Cloud: 700,
        Conerrote: 700,
        Cosmos: 400,
        Crownaloe: 400,
        Diamoond: 700,
        Eggcoin: 200,
        'Evil Teeth': 700,
        'Failed Cup': 400,
        Heartookie: 700,
        'Leather Knife': 700,
        'Milk Bag': 400,
        'Mushroom Pot': 700,
        Pilleat: 700,
        Pizzaboard: 700,
        Rubikecream: 700,
        Shurigami: 400,
        'Sickness Liquid': 200,
        Sn_ke: 700,
        Squarearth: 200,
        'Tissue Dispenser': 400,
        'Unfortunate Cookie': 400,
        Wheelvirus: 400,
      },
      Skin: {
        Cocoa: 400,
        'Lean Addicted': 300,
        Tan: 400,
        Zombie: 300,
      },
    },
  },
};

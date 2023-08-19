export interface GeneratorSetting {
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

export const setting: GeneratorSetting = {
  removeOutputs: true,
  imgSize: 2000,
  resolution: 150,
  randomTimes: 10,
  batchSize: 2000,
  setsGenerator: 'randomization',
  imgsGenerator: 'sequential',
  traits: [
    'Background',
    'Body',
    'Cloth',
    'Hand',
    'Self',
    'Head',
    'Hair',
    'Face',
    'Ear',
  ],
  syncColor: {
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
};

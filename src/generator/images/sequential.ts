import {AllElementImage, CollectionSetting, TraitSet} from '../interfaces';

import {generateCanvas, saveImage} from './common';

export async function generateImages(
  directory: string,
  sets: TraitSet[],
  imgs: AllElementImage,
  setting: CollectionSetting
) {
  await sets.reduce(async (previousSet, currentSet, index) => {
    if (previousSet) await previousSet;

    return saveImage(
      directory,
      `${index + 1}.png`,
      generateCanvas(currentSet, imgs, setting.imgSize)
    );
  }, Promise.resolve());
}

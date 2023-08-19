import {generateCanvas} from '../canvas';
import {ImageDictionary, TraitSet} from '../interfaces';

import {saveImage} from './common';

export async function generateImages(sets: TraitSet[], imgs: ImageDictionary) {
  await sets.reduce(async (previousSet, currentSet, index) => {
    if (previousSet) await previousSet;

    return saveImage(`${index + 1}.png`, generateCanvas(currentSet, imgs));
  }, Promise.resolve());
}

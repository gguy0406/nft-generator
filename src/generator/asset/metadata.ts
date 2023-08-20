import {writeFile} from 'node:fs/promises';

import {TraitSet} from '../interface';

export async function genMetadata(filePath: string, set: TraitSet) {
  const metadata: Record<string, string> = {};

  for (const [trait, element] of Object.entries(set)) {
    metadata[trait] = element.name;
  }

  return writeFile(filePath, JSON.stringify(metadata, undefined, 2));
}

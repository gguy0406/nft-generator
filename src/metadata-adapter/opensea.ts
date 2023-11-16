import {readFile, readdir, writeFile} from 'node:fs/promises';
import * as path from 'path';

import {outputMetadataDir} from '../constant';

async function updateMetadata() {
  const files = await readdir(outputMetadataDir);

  files.forEach(async file => {
    const fileContent = await readFile(path.join(outputMetadataDir, file), 'utf-8');
    const metadata: {[traitType: string]: string} = JSON.parse(fileContent);
    const newMetadata: {name: string; attributes: Array<{value: string; trait_type: string; display_type: string}>} = {
      name: path.basename(file, path.extname(file)),
      attributes: [],
    };

    for (const [traitType, value] of Object.entries(metadata!)) {
      newMetadata.attributes.push({value, trait_type: traitType, display_type: 'string'});
    }

    await writeFile(path.join(outputMetadataDir, file), JSON.stringify(newMetadata, undefined, 2), 'utf-8');
  });
}

updateMetadata();

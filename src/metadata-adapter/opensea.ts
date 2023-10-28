import {readFile, readdir, writeFile} from 'node:fs/promises';

import {outputMetadataDir} from '../constant';
import * as path from 'path';

async function updateMetadata() {
  const files = await readdir(outputMetadataDir);

  files.forEach(async file => {
    const fileContent = await readFile(path.join(outputMetadataDir, file), 'utf-8');
    let metadata: {[traitType: string]: string};
    try {
      metadata = JSON.parse(fileContent);
    } catch {
      console.log(file, fileContent);
    }
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

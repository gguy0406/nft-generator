import {readFile, readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import * as path from 'path';

import {outputMetadataDir} from '../constant';

async function checkUnique() {
  const files = await readdir(outputMetadataDir);
  const hash = createHash('sha256');

  const hashedAttributes = await Promise.all(
    files.map(async file => {
      const fileContent = await readFile(path.join(outputMetadataDir, file), 'utf-8');
      const metadata: {[traitType: string]: string} = {};

      for (const attribute of JSON.parse(fileContent).attributes) {
        metadata[attribute['trait_type']] = attribute['value'];
      }

      return hash.copy().update(JSON.stringify(metadata)).digest('hex');
    })
  );

  console.log(hashedAttributes.filter((value, index, array) => array.indexOf(value) === index).length === files.length);
}

checkUnique();

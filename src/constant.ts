import {availableParallelism} from 'os';
import {join as pathJoin} from 'path';

export const numCPUs = availableParallelism() - 2;
export const collectionDir = pathJoin(__dirname, '..', 'collection');
export const traitsDir = pathJoin(collectionDir, 'traits');
export const outputDir = pathJoin(collectionDir, 'output');
export const outputImageDir = pathJoin(outputDir, 'images');
export const outputMetadataDir = pathJoin(outputDir, 'metadata');

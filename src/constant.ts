import {join as pathJoin} from 'path';

export const collectionDir = pathJoin(__dirname, '..', 'collection');
export const traitsDir = pathJoin(collectionDir, 'ch0pch0p c0');
export const fontsDir = pathJoin(collectionDir, 'fonts');
export const outputDir = pathJoin(collectionDir, 'output');
export const outputImageDir = pathJoin(outputDir, 'images');
export const outputMetadataDir = pathJoin(outputDir, 'metadata');

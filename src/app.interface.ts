import {TraitSet} from './set-generator/interface';

export type TraitFilePaths = {[trait: string]: string[]};
export type GeneratorChannel =
  | {channel: 'init'; message: TraitFilePaths}
  | {channel: 'ready'; message: null}
  | {channel: 'assign'; message: {setIndex: number; set: TraitSet}}
  | {channel: 'complete'; message: number};

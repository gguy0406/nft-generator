import {Image} from 'canvas';

export type ElementLayers = {name: string; layers: Record<string, string>};
export type TraitSet = Record<string, ElementLayers>;
export type ImageDictionary = Record<string, Record<string, Image>>;

export declare function genAssetsCallbackfn<T>(set: TraitSet, index: number): Promise<T>;

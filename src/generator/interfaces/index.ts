import { Image } from 'canvas';

export type ElementLayers = {name: string, layers: Record<string, string>};
export type TraitSet = Record<string, ElementLayers>;
export type AllElementImage = Record<string, Image>;

export interface CollectionSetting {
	imgSize: number;
	randomTimes?: number;
	segmentSize?: number;
}

export type ElementLayers = {name: string; layers: {[zIndex: number]: string}};
export type TraitSet = {
  traits: {[trait: string]: string};
  layers: {[zIndex: number]: string};
  constraint?: {[trait: string]: {join: string[]; disjoin: string[]}};
};

export interface ConstraintSetting {
  [trait: string]: {[element: string]: JoinConstraint | DisjoinConstraint | (JoinConstraint & DisjoinConstraint)};
}

export interface JoinConstraint {
  join?: {[trait: string]: string[]};
}

export interface DisjoinConstraint {
  disjoin?: {[trait: string]: string[]};
}

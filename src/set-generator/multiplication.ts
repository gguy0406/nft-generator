import {assignRandomElement} from './assign-random-element';
import {ConstraintSetting, DisjoinConstraint, ElementLayers, JoinConstraint, TraitSet} from './interface';

export function multiplyTraits(
  traits: string[],
  elements: ElementLayers[][],
  randomTraits: string[] | undefined,
  constraintSetting: ConstraintSetting | undefined,
  traitIndex: number = 0,
  memoSet: {[trait: string]: TraitSet[]} = {}
): TraitSet[] {
  const trait = traits[traitIndex];

  if (memoSet[trait]) return memoSet[trait];

  let currentSets: TraitSet[];

  if (randomTraits?.includes(trait)) {
    currentSets = traits[traitIndex + 1]
      ? multiplyTraits(traits, elements, randomTraits, constraintSetting, traitIndex + 1, memoSet)
      : [];
  } else if (traits[traitIndex + 1]) {
    const smallerSets = multiplyTraits(traits, elements, randomTraits, constraintSetting, traitIndex + 1, memoSet);

    currentSets = smallerSets.length
      ? elements[traitIndex].reduce((sets: TraitSet[], element) => {
          smallerSets.forEach(smallerSet => {
            if (!constraintSetting) {
              sets.push({
                traits: {...smallerSet.traits, [trait]: element.name},
                layers: {...smallerSet.layers, ...element.layers},
              });
              return;
            }

            const constraintTrait = smallerSet.constraint![trait];

            if (
              constraintTrait &&
              (constraintTrait.disjoin.includes(element.name) ||
                (constraintTrait.join.length && !constraintTrait.join.includes(element.name)))
            )
              return;

            const newSet = {
              traits: {...smallerSet.traits, [trait]: element.name},
              layers: {...smallerSet.layers, ...element.layers},
              constraint: structuredClone(smallerSet.constraint),
            };

            const constraintElement = constraintSetting[trait]?.[element.name];

            if (!constraintElement) {
              sets.push(newSet);
              return;
            }

            if ((constraintElement as JoinConstraint).join) {
              for (const [trait, joinElements] of Object.entries((constraintElement as JoinConstraint).join!)) {
                if (!newSet.constraint![trait]) newSet.constraint![trait] = {join: [...joinElements], disjoin: []};
                else newSet.constraint![trait].join.push(...joinElements);
              }
            }

            if ((constraintElement as DisjoinConstraint).disjoin) {
              for (const [trait, disjoinElements] of Object.entries(
                (constraintElement as DisjoinConstraint).disjoin!
              )) {
                if (!newSet.constraint![trait]) newSet.constraint![trait] = {join: [], disjoin: [...disjoinElements]};
                else newSet.constraint![trait].disjoin.push(...disjoinElements);
              }
            }

            sets.push(newSet);
          });

          return sets;
        }, [])
      : getSmallestSet(trait, elements[traitIndex], constraintSetting);
  } else {
    currentSets = getSmallestSet(trait, elements[traitIndex], constraintSetting);
  }

  if (traitIndex === 0 && randomTraits?.length) {
    randomTraits.forEach(rdTrait => {
      const rdTraitIndex = traits.findIndex(trait => trait === rdTrait);

      if (~rdTraitIndex) return;

      currentSets.forEach(set => {
        assignRandomElement(set, trait, elements[rdTraitIndex]);
      });
    });

    return currentSets;
  }

  return (memoSet[trait] ||= currentSets);
}

function getSmallestSet(trait: string, elements: ElementLayers[], constraintSetting: ConstraintSetting | undefined) {
  return constraintSetting
    ? elements.map(element => {
        const constraint: TraitSet['constraint'] = {};
        const elementConstraint: ConstraintSetting[string][string] | undefined =
          constraintSetting![trait]?.[element.name];

        if ((elementConstraint as JoinConstraint)?.join) {
          for (const [trait, joinElements] of Object.entries((elementConstraint as JoinConstraint).join!)) {
            constraint[trait] = {join: [...joinElements], disjoin: []};
          }
        }

        if ((elementConstraint as DisjoinConstraint)?.disjoin) {
          for (const [trait, disjoinElements] of Object.entries((elementConstraint as DisjoinConstraint).disjoin!)) {
            if (constraint[trait]) constraint[trait].disjoin = [...disjoinElements];
            else constraint[trait] = {join: [], disjoin: [...disjoinElements]};
          }
        }

        return {constraint, traits: {[trait]: element.name}, layers: element.layers};
      })
    : elements.map(element => ({traits: {[trait]: element.name}, layers: element.layers}));
}

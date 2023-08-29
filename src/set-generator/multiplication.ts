import {assignRandomElement} from './assign-random-element';
import {ConstraintSetting, ElementLayers, TraitSet} from './interface';

export function multiplyTraits(
  traits: string[],
  elements: ElementLayers[][],
  randomTraits: string[] | undefined,
  traitIndex: number = 0,
  memoSet: {[trait: string]: TraitSet[]} = {}
): TraitSet[] {
  const trait = traits[traitIndex];

  if (memoSet[trait]) return memoSet[trait];

  let currentSets: TraitSet[];

  const getSmallestSet = () =>
    elements[traitIndex].map(element => ({traits: {[trait]: element.name}, layers: element.layers}));
  const getSmallerSet = () => multiplyTraits(traits, elements, randomTraits, traitIndex + 1, memoSet);

  if (randomTraits?.includes(trait)) {
    currentSets = traits[traitIndex + 1] ? getSmallerSet() : [];
  } else if (traits[traitIndex + 1]) {
    const smallerSets = getSmallerSet();

    currentSets = smallerSets.length
      ? elements[traitIndex].reduce((sets: TraitSet[], element) => {
          smallerSets.forEach(smallerSet => {
            sets.push({
              traits: {...smallerSet.traits, [trait]: element.name},
              layers: {...smallerSet.layers, ...element.layers},
            });
          });

          return sets;
        }, [])
      : getSmallestSet();
  } else {
    currentSets = getSmallestSet();
  }

  if (traitIndex !== 0) return (memoSet[trait] ||= currentSets);
  if (!randomTraits?.length) return currentSets;

  randomTraits.forEach(rdTrait => {
    const rdTraitIndex = traits.findIndex(_trait => _trait === rdTrait);

    if (!~rdTraitIndex) return;

    currentSets.forEach(set => assignRandomElement(set, trait, elements[rdTraitIndex]));
  });

  return currentSets;
}

export function multiplyTraitsWithConstraint(
  traits: string[],
  elements: ElementLayers[][],
  constraintSetting: ConstraintSetting,
  randomTraits: string[] | undefined,
  traitIndex: number = 0,
  memoSet: {[trait: string]: Required<TraitSet>[]} = {}
): Required<TraitSet>[] {
  const trait = traits[traitIndex];

  if (memoSet[trait]) return memoSet[trait];

  let currentSets: Required<TraitSet>[];

  const getSmallestSet = () => getSmallestSetWithConstraint(trait, elements[traitIndex], constraintSetting);
  const getSmallerSet = () =>
    multiplyTraitsWithConstraint(traits, elements, constraintSetting, randomTraits, traitIndex + 1, memoSet);

  if (randomTraits?.includes(trait)) {
    currentSets = traits[traitIndex + 1] ? getSmallerSet() : [];
  } else if (traits[traitIndex + 1]) {
    const smallerSets = getSmallerSet();

    currentSets = smallerSets.length
      ? elements[traitIndex].reduce((sets: Required<TraitSet>[], element) => {
          smallerSets.forEach(smallerSet => {
            const constraintTrait = smallerSet.constraint[trait];

            if (
              constraintTrait &&
              (constraintTrait.disjoin.includes(element.name) ||
                (constraintTrait.join.length && !constraintTrait.join.includes(element.name)))
            ) {
              return;
            }

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

            if ('join' in constraintElement) {
              for (const [joinTrait, joinElements] of Object.entries(constraintElement.join)) {
                if (newSet.traits[joinTrait] && !joinElements.includes(newSet.traits[joinTrait])) return;

                if (!newSet.constraint[joinTrait])
                  newSet.constraint[joinTrait] = {join: [...joinElements], disjoin: []};
                else newSet.constraint[joinTrait].join.push(...joinElements);
              }
            }

            if ('disjoin' in constraintElement) {
              for (const [disjoinTrait, disjoinElements] of Object.entries(constraintElement.disjoin)) {
                if (disjoinElements.includes(newSet.traits[disjoinTrait])) return;

                if (!newSet.constraint[disjoinTrait])
                  newSet.constraint[disjoinTrait] = {join: [], disjoin: [...disjoinElements]};
                else newSet.constraint[disjoinTrait].disjoin.push(...disjoinElements);
              }
            }

            sets.push(newSet);
          });

          return sets;
        }, [])
      : getSmallestSet();
  } else {
    currentSets = getSmallestSet();
  }

  if (traitIndex !== 0) return (memoSet[trait] ||= currentSets);
  if (!randomTraits?.length) return currentSets;

  randomTraits.forEach(rdTrait => {
    const rdTraitIndex = traits.findIndex(_trait => _trait === rdTrait);

    if (!~rdTraitIndex) return;

    currentSets.forEach(set => {
      const filteredElement = (
        set.constraint[rdTrait]
          ? elements[rdTraitIndex].filter(
              element =>
                !set.constraint[rdTrait].disjoin?.includes(element.name) &&
                (!set.constraint[rdTrait].join || set.constraint[rdTrait].join.includes(element.name))
            )
          : elements[rdTraitIndex]
      ).filter(element => {
        const constraintElement = constraintSetting[rdTrait]?.[element.name];

        return (
          !constraintElement ||
          ((!('join' in constraintElement) ||
            Object.entries(constraintElement.join).every(
              ([joinTrait, joinElements]) => set.traits[joinTrait] && joinElements.includes(set.traits[joinTrait])
            )) &&
            (!('disjoin' in constraintElement) ||
              Object.entries(constraintElement.disjoin).every(
                ([disjoinTrait, disjoinElement]) => !disjoinElement.includes(set.traits[disjoinTrait])
              )))
        );
      });

      assignRandomElement(set, trait, filteredElement);
    });
  });

  return currentSets;
}

function getSmallestSetWithConstraint(trait: string, elements: ElementLayers[], constraintSetting: ConstraintSetting) {
  return elements.map(element => {
    const constraint: TraitSet['constraint'] = {};
    const eleConstr: ConstraintSetting[string][string] | undefined = constraintSetting[trait]?.[element.name];

    if (!eleConstr) return {constraint, traits: {[trait]: element.name}, layers: {...element.layers}};

    if ('join' in eleConstr) {
      for (const [trait, joinElements] of Object.entries(eleConstr.join)) {
        constraint[trait] = {join: [...joinElements], disjoin: []};
      }
    }

    if ('disjoin' in eleConstr) {
      for (const [trait, disjoinElements] of Object.entries(eleConstr.disjoin)) {
        if (constraint[trait]) constraint[trait].disjoin = [...disjoinElements];
        else constraint[trait] = {join: [], disjoin: [...disjoinElements]};
      }
    }

    return {constraint, traits: {[trait]: element.name}, layers: {...element.layers}};
  });
}

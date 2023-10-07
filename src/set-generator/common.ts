import {ConstraintSetting, ElementLayers, RaritySetting, TraitSet} from './interface';

export function assignRandomElement(
  set: TraitSet,
  trait: string,
  elements: ElementLayers[],
  raritySetting: RaritySetting | undefined
) {
  let randomElement: ElementLayers;

  if (!raritySetting?.[trait]) randomElement = elements[Math.floor(Math.random() * elements.length)];
  else {
    const totalWeight = elements.reduce((total: number, element: ElementLayers) => {
      return (total += raritySetting[trait][element.name] || 1);
    }, 0);
    const random = Math.floor(Math.random() * totalWeight);
    let sum: number = 0;

    for (const element of elements) {
      sum += raritySetting[trait][element.name] || 1;

      if (sum < random) continue;

      randomElement = element;
      break;
    }
  }

  set.traits[trait] = randomElement!.name;
  set.layers = {...set.layers, ...randomElement!.layers};

  return {set, randomElement: randomElement!};
}

export function addConstraint(
  trait: string,
  element: ElementLayers,
  constraintSetting: ConstraintSetting,
  constraint: TraitSet['constraint'] = {}
) {
  const eleConstr = constraintSetting[trait]?.[element.name];

  if (!eleConstr) return constraint;

  if ('join' in eleConstr) {
    for (const [joinTrait, joinElements] of Object.entries(eleConstr.join)) {
      if (constraint[joinTrait]) constraint[joinTrait].join.push(...joinElements);
      else constraint[joinTrait] = {join: [...joinElements], disjoin: []};
    }
  }

  if ('disjoin' in eleConstr) {
    for (const [disjoinTrait, disjoinElements] of Object.entries(eleConstr.disjoin)) {
      if (constraint[disjoinTrait]) constraint[disjoinTrait].disjoin.push(...disjoinElements);
      else constraint[disjoinTrait] = {join: [], disjoin: [...disjoinElements]};
    }
  }

  return constraint;
}

export function filterElementConstraint(
  set: Required<TraitSet>,
  trait: string,
  elements: ElementLayers[],
  constraintSetting: ConstraintSetting
) {
  return (
    set.constraint[trait]
      ? elements.filter(
          element =>
            !set.constraint[trait].disjoin?.includes(element.name) &&
            (!set.constraint[trait].join || set.constraint[trait].join.includes(element.name))
        )
      : elements
  ).filter(element => {
    const eleConstr = constraintSetting[trait]?.[element.name];

    return (
      !eleConstr ||
      ((!('join' in eleConstr) ||
        Object.entries(eleConstr.join).every(
          ([joinTrait, joinElements]) => set.traits[joinTrait] && joinElements.includes(set.traits[joinTrait])
        )) &&
        (!('disjoin' in eleConstr) ||
          Object.entries(eleConstr.disjoin).every(
            ([disjoinTrait, disjoinElement]) => !disjoinElement.includes(set.traits[disjoinTrait])
          )))
    );
  });
}

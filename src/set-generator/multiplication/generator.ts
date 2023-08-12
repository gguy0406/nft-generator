export function generateSet(
	traits: string[],
	elements: string[][],
	traitIndex: number = 0,
	memoSet: { [key: string]: TraitSet[] } = {}
): TraitSet[] {
	const trait = traits[traitIndex];

	if (memoSet[trait]) return memoSet[trait];

	const currentSet = elements[traitIndex + 1]
		? elements[traitIndex].reduce((sets: TraitSet[], element) => {
			generateSet(traits, elements, traitIndex + 1, memoSet)
				.forEach((smallerSet) => sets.push({ ...smallerSet, [trait]: element }));

			return sets;
		}, [])
		: elements[traitIndex].map((element) => ({ [trait]: element }));

	if (traitIndex == 0) return currentSet;

	return memoSet[trait] ||= currentSet;
}

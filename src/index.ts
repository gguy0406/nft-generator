import { readFile, readdir } from 'node:fs/promises';
import Path from 'path';

import { generateSet } from './set-generator/multiplication';
import { generateImg } from './img-generator';

const directory = 'collection';

( async () => {
	try {
		console.info('getting collection info...');

		const traits: string[] = JSON.parse(await readFile(`${directory}/ordinal.json`, 'utf-8'));
		console.info(`- ${traits.length} traits`);

		const elements = await getElements(traits);

		const sets = generateSet(traits, elements);

		console.info(`sets:  ${sets.length}`);

		await generateImg(directory, sets);
	} catch (err) {
		console.error(err);
	}
} )();

async function getElements(traits: string[]) {
	let elementCount = 0;
	const elements: string[][] = await Promise.all(traits.map(async (trait) => {
		const _elements: string[] = (await readdir(`${directory}/traits/${trait}`))
			.map((fileName) => Path.parse(fileName).name)
			.filter((element) => !element.includes('.'));

		elementCount += _elements.length;

		return _elements;
	}));

	console.info(`${elementCount} elements`);

	return elements;
}

import { Image, createCanvas, loadImage } from 'canvas';
import { readFile, writeFile } from 'node:fs/promises';

const segmentSize = 100;
const imgs: Record<string, Image> = {};

export async function generateImg(directory: string, sets: TraitSet[]) {
	const ordinal = JSON.parse(await readFile(`${directory}/ordinal.json`, 'utf-8'));
	const segments: TraitSet[][] = [];

	sets.forEach((set, index) => {
		const segment = Math.floor(index / segmentSize);

		if (segments[segment]) segments[segment].push(set);
		else segments[segment] = [set];
	});

	console.log(`sets length ${sets.length}`);
	console.log(`segments length ${segments.length}`);

	for (const [segmentIndex, segment] of segments.entries()) {
		console.log(`segment ${segmentIndex}`);
		console.time();
		await Promise.all(segment.map(async (set, index) => {
			const canvas = createCanvas(2181, 2181);
			const ctx = canvas.getContext('2d');

			for (const [trait] of Object.entries(ordinal)) {
				const filePath = `${directory}/traits/${trait}/${set[trait]}.png`;

				imgs[filePath] ||= await loadImage(filePath);
				ctx.drawImage(imgs[filePath], 0, 0);
				await writeFile(`${directory}/outputs/${segmentIndex * segmentSize + index + 1}.png`, canvas.toBuffer());
			}
		}));
		console.timeEnd();
	}
}

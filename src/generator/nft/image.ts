import {Canvas, PngConfig} from 'canvas';
import {writeFile} from 'node:fs/promises';

export async function generateImage(
  filePath: string,
  canvas: Canvas,
  canvasConfig?: PngConfig
) {
  await writeFile(filePath, canvas.toBuffer('image/png', canvasConfig));
}

import {Canvas, PngConfig} from 'canvas';
import {writeFile} from 'node:fs/promises';

export async function genImg(filePath: string, canvas: Canvas, canvasConfig?: PngConfig) {
  return writeFile(filePath, canvas.toBuffer('image/png', canvasConfig));
}

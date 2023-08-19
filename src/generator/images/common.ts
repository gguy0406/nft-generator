import {Canvas} from 'canvas';
import {writeFile} from 'node:fs/promises';
import * as path from 'path';

import {setting} from '../../collection/setting';

import {outputImageDir} from '../../lib';

export async function saveImage(fileName: string, canvas: Canvas) {
  await writeFile(
    path.join(outputImageDir, fileName),
    canvas.toBuffer('image/png', {resolution: setting.resolution || 150})
  );
}

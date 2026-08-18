import { mkdir, readdir, rm, stat, copyFile } from 'node:fs/promises';
import { resolve, parse } from 'node:path';
import sharp from 'sharp';

const sourceDir = resolve('images');
const targetDir = resolve('public/images');

/**
 * Per-image output budget.
 *
 * `width` is the largest size the image is ever painted at, doubled for 2x
 * displays — not the size it happens to have been exported at. Shipping a
 * 3840px source for a 360px-tall card costs megabytes of transfer and, worse,
 * a multi-hundred-millisecond main-thread decode that lands right when the
 * user is trying to scroll.
 *
 * Anything not listed here is copied through untouched.
 */
const BUDGET = {
  // Hero backdrop, painted full-bleed with background-size: cover.
  'Background.png': { width: 2000, quality: 78 },
  // Contact section backdrop, also cover.
  'Contact.png': { width: 1760, quality: 78 },
  // Masonry texture — tiled at 220px, so it only ever needs a 2x tile.
  'texture2.jpeg': { width: 440, height: 440, quality: 72 },
  // Logo: painted at 64px in the header and 36px in the footer.
  'ArquesStudios.png': { width: 128, quality: 90 },
  // Carousel art: cards cap out at 360px tall (--game-image-height).
  'OneSecond.png': { width: 1200, quality: 80 },
  'Handborne.png': { width: 1200, quality: 80 },
  'Cent-Isle-1.png': { width: 1000, quality: 80 },
  'crownlands_img.jpg': { width: 1200, quality: 80 },
  'game1.jpeg': { width: 900, quality: 80 },
  'game2.jpeg': { width: 900, quality: 80 },
  // About portrait: CSS caps it at 360px wide.
  'about.jpg': { width: 760, quality: 80 },
};

/** Sources no longer referenced anywhere — kept in the repo, left out of the build. */
const UNUSED = new Set(['hero.jpeg', 'kingsCrest.jpg', 'texture.jpg']);

async function directoryExists(dir) {
  try {
    return (await stat(dir)).isDirectory();
  } catch {
    return false;
  }
}

function formatBytes(bytes) {
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(2)} MB`
    : `${Math.round(bytes / 1024)} KB`;
}

async function main() {
  if (!(await directoryExists(sourceDir))) {
    console.warn('No images directory found to optimize. Skipping.');
    return;
  }

  await rm(targetDir, { recursive: true, force: true });
  await mkdir(targetDir, { recursive: true });

  const entries = await readdir(sourceDir, { withFileTypes: true });
  let sourceBytes = 0;
  let outputBytes = 0;

  for (const entry of entries) {
    if (!entry.isFile() || entry.name.startsWith('.')) continue;
    if (UNUSED.has(entry.name)) {
      console.log(`  skip   ${entry.name} (unreferenced)`);
      continue;
    }

    const from = resolve(sourceDir, entry.name);
    const budget = BUDGET[entry.name];
    const before = (await stat(from)).size;
    sourceBytes += before;

    if (!budget) {
      await copyFile(from, resolve(targetDir, entry.name));
      outputBytes += before;
      console.log(`  copy   ${entry.name} (${formatBytes(before)})`);
      continue;
    }

    const outName = `${parse(entry.name).name}.webp`;
    const to = resolve(targetDir, outName);

    await sharp(from)
      .resize({
        width: budget.width,
        height: budget.height,
        fit: budget.height ? 'cover' : 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: budget.quality, effort: 6 })
      .toFile(to);

    const after = (await stat(to)).size;
    outputBytes += after;
    console.log(
      `  build  ${entry.name} -> ${outName}  ${formatBytes(before)} -> ${formatBytes(after)}` +
        `  (-${Math.round((1 - after / before) * 100)}%)`
    );
  }

  console.log(
    `\nImages: ${formatBytes(sourceBytes)} -> ${formatBytes(outputBytes)} ` +
      `(-${Math.round((1 - outputBytes / sourceBytes) * 100)}%)`
  );
}

main().catch((error) => {
  console.error('Failed to optimize static assets:', error);
  process.exitCode = 1;
});

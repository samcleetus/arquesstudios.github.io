import { cp, mkdir, rm, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const sourceDir = resolve('images');
const targetDir = resolve('public/images');

async function directoryExists(dir) {
  try {
    const stats = await stat(dir);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
}

async function main() {
  if (!(await directoryExists(sourceDir))) {
    console.warn('No images directory found to sync. Skipping.');
    return;
  }

  await rm(targetDir, { recursive: true, force: true });
  await mkdir(targetDir, { recursive: true });
  await cp(sourceDir, targetDir, { recursive: true });
  console.log('Synced static images to public/');
}

main().catch((error) => {
  console.error('Failed to sync static assets:', error);
  process.exitCode = 1;
});

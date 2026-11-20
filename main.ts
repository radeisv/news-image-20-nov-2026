// main.ts — the poster is baked at build time; this entrypoint only
// publishes the finished bytes. No network, no drawing at runtime,
// so two runs always write identical output.
import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const source = new URL('./entry.png', import.meta.url);
copyFileSync(source, join(outDir, 'entry.png'));
console.log('wrote entry.png to', outDir);

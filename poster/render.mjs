// render.mjs — renders poster/poster.html in headless Chrome at 1024x1024
// (via CDP: the CLI --screenshot flag captures a short viewport here)
// and quantises the screenshot with Pillow so entry.png stays under 1 MiB.
// Chrome is resolved in order: $CHROME_PATH, a Playwright-managed Chromium
// (~/.cache/ms-playwright), then /opt/meta-chromium/chrome.
// Node 22+ stdlib only (global fetch + WebSocket); no npm packages.
import { execFileSync, spawn } from 'node:child_process';
import { existsSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const repo = dirname(root);
const html = join(root, 'poster.html');
const raw = join(repo, '.raw.png');
const out = join(repo, 'entry.png');

function findChrome() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }
  const cache = join(homedir(), '.cache', 'ms-playwright');
  if (existsSync(cache)) {
    for (const d of readdirSync(cache).sort().reverse()) {
      const p = join(cache, d, 'chrome-linux', 'chrome');
      if (existsSync(p)) return p;
    }
  }
  const meta = '/opt/meta-chromium/chrome';
  if (existsSync(meta)) return meta;
  throw new Error('no Chrome binary found (set CHROME_PATH)');
}

const chrome = findChrome();
console.log('chrome:', chrome);
const port = 9333;
const proc = spawn(chrome, [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
  '--force-device-scale-factor=1', `--remote-debugging-port=${port}`,
  '--user-data-dir=' + join(repo, '.chrome-profile'), 'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target = null;
for (let i = 0; i < 50; i++) {
  await sleep(200);
  try {
    const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    target = list.find((t) => t.type === 'page');
    if (target) break;
  } catch { /* not up yet */ }
}
if (!target) { proc.kill(); throw new Error('chrome devtools did not come up'); }

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
let id = 0;
const pending = new Map();
const send = (method, params = {}) => new Promise((res, rej) => {
  const mid = ++id;
  pending.set(mid, { res, rej });
  ws.send(JSON.stringify({ id: mid, method, params }));
});
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { res, rej } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? rej(new Error(JSON.stringify(msg.error))) : res(msg.result);
  }
};
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', {
  width: 1024, height: 1024, deviceScaleFactor: 1, mobile: false,
});
await send('Page.navigate', { url: `file://${html}` });
await sleep(1500);
const shot = await send('Page.captureScreenshot', {
  format: 'png', captureBeyondViewport: true, fromSurface: true,
});
writeFileSync(raw, Buffer.from(shot.data, 'base64'));
ws.close();
proc.kill();

const py = `
from PIL import Image
im = Image.open(${JSON.stringify(raw)}).convert('RGB')
print('raw', im.size, im.mode)
q = im.quantize(colors=224, method=Image.MEDIANCUT, dither=Image.FLOYDSTEINBERG)
q.save(${JSON.stringify(out)}, optimize=True)
`;
execFileSync('python3', ['-c', py], { stdio: 'inherit' });
console.log('entry.png bytes:', statSync(out).size);
if (!existsSync(out)) throw new Error('entry.png missing');

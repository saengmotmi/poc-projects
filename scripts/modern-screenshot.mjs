#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = parseArgs(process.argv.slice(2));
const width = args.width ?? '1440';
const height = args.height ?? '1200';
const output = resolve(args.output ?? 'artifacts/modern-screenshot.png');
const chrome = findChrome();

if (!chrome) {
  console.error('Could not find Chrome. Set CHROME_BIN or install Google Chrome/Chromium.');
  process.exit(1);
}

let target = args.url;
let label = args.url;

if (args.file) {
  const sourcePath = resolve(args.file);
  const source = readFileSync(sourcePath, 'utf8');
  const htmlPath = resolve('.tmp/modern-screenshot.html');

  mkdirSync(dirname(htmlPath), { recursive: true });
  writeFileSync(htmlPath, renderMarkdownSource(sourcePath, source));

  target = pathToFileURL(htmlPath).href;
  label = args.file;
}

if (!target) {
  console.error('Usage: yarn modern-screenshot --file <path> --output <path>');
  console.error('   or: yarn modern-screenshot --url <url> --output <path>');
  process.exit(1);
}

mkdirSync(dirname(output), { recursive: true });

const result = spawnSync(
  chrome,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    `--window-size=${width},${height}`,
    '--virtual-time-budget=1000',
    `--screenshot=${output}`,
    target,
  ],
  { stdio: 'inherit' },
);

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log(`Captured ${label} -> ${output}`);

function parseArgs(rawArgs) {
  const parsed = {};

  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];

    if (arg === '--file') parsed.file = rawArgs[++index];
    else if (arg === '--url') parsed.url = rawArgs[++index];
    else if (arg === '--output') parsed.output = rawArgs[++index];
    else if (arg === '--width') parsed.width = rawArgs[++index];
    else if (arg === '--height') parsed.height = rawArgs[++index];
  }

  return parsed;
}

function findChrome() {
  const candidates = [
    process.env.CHROME_BIN,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    'google-chrome',
    'google-chrome-stable',
    'chromium',
    'chromium-browser',
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (candidate.includes('/') && existsSync(candidate)) return candidate;
    if (!candidate.includes('/')) {
      const result = spawnSync('which', [candidate], { encoding: 'utf8' });
      if (result.status === 0) return result.stdout.trim();
    }
  }

  return null;
}

function renderMarkdownSource(sourcePath, source) {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(sourcePath)}</title>
  <style>
    :root { color-scheme: light; }
    body {
      margin: 0;
      background: #f6f7f9;
      color: #1f2937;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    main {
      box-sizing: border-box;
      width: min(1080px, calc(100vw - 96px));
      margin: 48px auto;
      padding: 40px 48px;
      border: 1px solid #e5e7eb;
      border-radius: 24px;
      background: white;
      box-shadow: 0 24px 70px rgba(15, 23, 42, 0.10);
    }
    .path {
      margin: 0 0 24px;
      color: #64748b;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    pre {
      margin: 0;
      white-space: pre-wrap;
      word-break: keep-all;
      overflow-wrap: anywhere;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      font-size: 15px;
      line-height: 1.65;
    }
  </style>
</head>
<body>
  <main>
    <p class="path">${escapeHtml(sourcePath)}</p>
    <pre>${escapeHtml(source)}</pre>
  </main>
</body>
</html>`;
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

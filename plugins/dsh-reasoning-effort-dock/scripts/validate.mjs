#!/usr/bin/env node
/**
 * Dependency-free release check for the Reasoning Effort Dock package.
 * Run from the package directory: node scripts/validate.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];

function fail(message) {
  failures.push(message);
}

function read(relativePath) {
  const path = join(root, relativePath);
  if (!existsSync(path)) {
    fail(`missing file: ${relativePath}`);
    return null;
  }
  return readFileSync(path, 'utf8');
}

function readJson(relativePath) {
  const text = read(relativePath);
  if (text === null) return null;
  try {
    return JSON.parse(text);
  } catch (error) {
    fail(`invalid JSON in ${relativePath}: ${error.message}`);
    return null;
  }
}

const pkg = readJson('package.json');
if (pkg) {
  if (pkg.name !== 'dsh-reasoning-effort-dock') fail('package name must be dsh-reasoning-effort-dock');
  if (!/^\d+\.\d+\.\d+$/.test(pkg.version ?? '')) fail('package version must be semver');
  if (pkg.license !== 'MIT') fail('package license must be MIT');
  if (pkg.dsh?.bundle?.patch !== './cordis.patch.yml') fail('dsh.bundle.patch is missing or incorrect');
  if (pkg.dsh?.client?.platform !== 'web') fail('dsh.client.platform must be web');
  if (!pkg.repository || !String(pkg.repository.url).includes('FanXi1230/fanxi.git')) {
    fail('repository.url must point at FanXi1230/fanxi');
  }
  if (pkg.engines?.dsh === undefined) fail('engines.dsh is required');
}

const patch = read('cordis.patch.yml');
if (patch !== null) {
  if (!patch.includes('id: dsh-reasoning-effort-dock')) fail('cordis.patch.yml must insert dsh-reasoning-effort-dock');
  if (!patch.includes('name: dsh-reasoning-effort-dock')) fail('cordis.patch.yml must name dsh-reasoning-effort-dock');
}

const client = read('client.js');
if (client !== null) {
  try {
    new vm.Script(client, { filename: 'client.js' });
  } catch (error) {
    fail(`client.js does not parse: ${error.message}`);
  }
  if (!client.includes("id: 'dsh-reasoning-effort-dock'")) fail('client loader id does not match the package');
  if (!client.includes("name: 'dsh-reasoning-effort-dock'")) fail('client plugin name does not match the package');
  if (!client.includes("'conversation.input.right'")) fail('client does not register in conversation.input.right');
  if (!client.includes("'remote.session'")) fail('client inject list does not include remote.session');
}

for (const locale of ['locale/en.json', 'locale/zh.json']) {
  const dict = readJson(locale);
  if (dict && (!dict.meta || typeof dict.meta.title !== 'string' || typeof dict.meta.description !== 'string')) {
    fail(`${locale} must contain meta.title and meta.description`);
  }
}

for (const file of ['index.js', 'LICENSE', 'README.md', 'README.zh.md', 'CHANGELOG.md', 'icon.svg']) {
  read(file);
}

const screenshots = readJson('screenshots.json');
if (!Array.isArray(screenshots) || screenshots.length === 0 || screenshots.length > 8) {
  fail('screenshots.json must be an array of 1-8 image paths');
} else {
  for (const relativePath of screenshots) {
    if (typeof relativePath !== 'string' || relativePath.startsWith('/') || relativePath.includes('..')) {
      fail(`screenshot path must stay inside the package: ${String(relativePath)}`);
      continue;
    }
    if (!existsSync(join(root, relativePath))) fail(`missing screenshot: ${relativePath}`);
  }
}

for (const file of ['assets/icon-180.png']) {
  if (!existsSync(join(root, file))) fail(`missing published asset: ${file}`);
}

if (failures.length > 0) {
  console.error('Reasoning Effort Dock validation failed:');
  for (const message of failures) console.error(`  - ${message}`);
  process.exit(1);
}

console.log('Reasoning Effort Dock validation passed.');

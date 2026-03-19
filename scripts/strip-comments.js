#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const strip = require('strip-comments');

const ROOT = path.resolve(__dirname, '..');
const TARGET = path.join(ROOT, 'apps');
const BACKUP_DIR = path.join(ROOT, '.comment_backups');

const exts = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.html', '.yaml', '.yml']);

function mkdirp(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.git' || e.name === 'dist' || e.name === '.next') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

function stripYamlComments(content) {
  // remove lines that are only comments (start with optional whitespace and #)
  return content.split('\n').map(line => {
    if (/^\s*#/.test(line)) return '';
    return line;
  }).join('\n');
}

function processFile(file) {
  const rel = path.relative(ROOT, file);
  const ext = path.extname(file).toLowerCase();
  if (!exts.has(ext)) return false;
  try {
    const raw = fs.readFileSync(file, 'utf8');
    let stripped = raw;

    // For YAML/YML do simple # removal
    if (ext === '.yaml' || ext === '.yml') {
      stripped = stripYamlComments(raw);
    } else {
      // Use strip-comments library for code/html/css
      stripped = strip(raw, { preserve_newlines: true });
    }

    // Backup original
    const backupPath = path.join(BACKUP_DIR, rel);
    mkdirp(path.dirname(backupPath));
    fs.writeFileSync(backupPath, raw, 'utf8');

    // Only write if changed
    if (stripped !== raw) {
      fs.writeFileSync(file, stripped, 'utf8');
      return true;
    }
    return false;
  } catch (err) {
    console.error('Failed to process', rel, err.message);
    return false;
  }
}

function main() {
  if (!fs.existsSync(TARGET)) {
    console.error('Target folder not found:', TARGET);
    process.exit(1);
  }
  mkdirp(BACKUP_DIR);
  const files = walk(TARGET);
  let changed = 0;
  let processed = 0;
  for (const f of files) {
    const ok = processFile(f);
    if (ok) changed++;
    // count only considered files
    if (exts.has(path.extname(f).toLowerCase())) processed++;
  }
  console.log(`Processed ${processed} files. Stripped comments from ${changed} files.`);
  console.log(`Backups are in ${path.relative(process.cwd(), BACKUP_DIR)}`);
}

main();

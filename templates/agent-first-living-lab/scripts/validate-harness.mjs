#!/usr/bin/env node
import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = parseArgs(process.argv.slice(2));

if (args.help) {
  console.log(`Usage: node scripts/validate-harness.mjs [--target DIR] [--json] [--html FILE]

Scores a project harness across five subsystems:
  instructions, state, verification, scope, lifecycle

Exit code is 0 when score >= --min-score (default 70).

Subsystem weights (each 0-20, total 100):
  Instructions  — AGENTS.md, CONTEXT.md, definition of done
  State         — feature_list.json, progress tracking
  Verification  — init.sh, tests, lint, type-check
  Scope         — feature dependencies, single-feature-per-session
  Lifecycle     — session handoff, git hygiene, clean restart`);
  process.exit(0);
}

const target = path.resolve(args.target || args._[0] || process.cwd());
const minScore = Number(args.minScore || 70);

const result = await scoreHarness(target);

if (args.html) {
  const htmlPath = path.resolve(args.html);
  await writeText(htmlPath, renderHtml(result, path.basename(target)));
  console.log(`HTML report written to ${htmlPath}`);
}

if (args.json) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(formatReport(result, target));
}

if (result.overall < minScore) {
  console.log(`\nScore ${result.overall} is below minimum ${minScore}.`);
  process.exitCode = 1;
}

// --- Scoring Logic ---

async function scoreHarness(target) {
  const files = await discoverFiles(target);

  const checks = {
    instructions: [
      { name: 'AGENTS.md or CLAUDE.md', pass: !!(files['AGENTS.md'] || files['CLAUDE.md']) },
      { name: 'CONTEXT.md or README.md', pass: !!(files['CONTEXT.md'] || files['README.md']) },
      { name: 'Explicit verification commands', pass: hasContent(files['AGENTS.md'], /verification|test|check|run/) },
      { name: 'Definition of done', pass: hasContent(files['AGENTS.md'], /done|completion|criterion/) },
      { name: 'Startup workflow documented', pass: hasContent(files['AGENTS.md'], /startup|init|first|begin/) },
    ],
    state: [
      { name: 'feature_list.json', pass: !!files['feature_list.json'] },
      { name: 'feature_list.json has valid JSON', pass: tryJson(files['feature_list.json']) },
      { name: 'feature_list.json has dependency chain', pass: hasContent(files['feature_list.json'], /dependencies/) },
      { name: 'feature_list.json has status field', pass: hasContent(files['feature_list.json'], /status/) },
      { name: 'feature_list.json has evidence field', pass: hasContent(files['feature_list.json'], /evidence/) },
    ],
    verification: [
      { name: 'init.sh exists', pass: !!files['init.sh'] },
      { name: 'init.sh is executable', pass: files['init.sh']?._executable || false },
      { name: 'Test framework configured', pass: !!(files['vitest.config.ts'] || files['jest.config.ts'] || files['.mocharc'] || hasContent(files['package.json'], /"test"/)) },
      { name: 'Lint configured', pass: !!(files['eslint.config.js'] || files['.eslintrc'] || files['.eslintrc.json'] || hasContent(files['package.json'], /"lint"/)) },
      { name: 'Type checking configured', pass: !!(files['tsconfig.json'] || files['pyproject.toml'] || hasContent(files['package.json'], /"typecheck|type-check"/)) },
    ],
    scope: [
      { name: 'feature_list.json has dependencies', pass: hasContent(files['feature_list.json'], /dependencies/) },
      { name: 'AGENTS.md says one feature at a time', pass: hasContent(files['AGENTS.md'], /one feature|single feature|one at a time/) },
      { name: 'features have unique IDs', pass: hasContent(files['feature_list.json'], /"id"/) },
      { name: 'Scope boundaries documented', pass: hasContent(files['AGENTS.md'], /scope|out of scope|in scope/) },
      { name: 'Feature status lifecycle clear', pass: hasContent(files['feature_list.json'], /not-started|in-progress|done/) },
    ],
    lifecycle: [
      { name: 'session-handoff.md or handoff doc', pass: !!(files['session-handoff.md'] || files['handoff.md']) },
      { name: '.git directory exists', pass: files['.git']?._isDir || false },
      { name: 'progress.md or run records', pass: !!(files['progress.md'] || files['CLAUDE.md']) },
      { name: 'progress file has current state', pass: hasContent(files['progress.md'] || files['CLAUDE.md'], /current|status|done|progress/) },
      { name: 'AGENTS.md has end-of-session section', pass: hasContent(files['AGENTS.md'], /end of session|clean state|wrap up|next session/) },
    ],
  };

  const scores = {};
  for (const [category, items] of Object.entries(checks)) {
    const passed = items.filter(c => c.pass).length;
    scores[category] = Math.round((passed / items.length) * 20);
  }

  const overall = Object.values(scores).reduce((a, b) => a + b, 0);

  return {
    target,
    generatedAt: new Date().toISOString(),
    overall,
    scores,
    checks,
    recommendation: recommend(scores, overall),
  };
}

function recommend(scores, overall) {
  const lowest = Object.entries(scores).sort((a, b) => a[1] - b[1])[0];
  if (!lowest) return 'Unable to assess.';
  if (lowest[1] < 10) return `Invest in ${lowest[0]} subsystem first (score: ${lowest[1]}/20). This is the weakest link.`;
  if (overall < 70) return `Moderate harness. Strengthen ${lowest[0]} (${lowest[1]}/20) to raise the floor.`;
  return `Good harness (${overall}/100). Fine-tune ${lowest[0]} (${lowest[1]}/20) for polish.`;
}

// --- File Discovery ---

async function discoverFiles(target) {
  const result = {};

  async function addFile(absPath) {
    const rel = path.relative(target, absPath);
    const stat = await tryStat(absPath);
    if (!stat) return;
    result[rel] = { _isDir: stat.isDirectory() };
    if (!stat.isDirectory()) {
      try {
        result[rel].content = await readFile(absPath, 'utf-8');
        result[rel]._executable = !!(stat.mode & 0o111);
      } catch { /* binary or no access */ }
    }
  }

  // Scan critical files at root
  const rootFiles = [
    'AGENTS.md', 'CLAUDE.md', 'CONTEXT.md', 'README.md',
    'feature_list.json', 'feature-list.json', 'init.sh',
    'session-handoff.md', 'handoff.md', 'progress.md',
    'package.json', 'tsconfig.json', 'vitest.config.ts',
    'jest.config.ts', 'eslint.config.js', '.eslintrc',
    '.eslintrc.json', '.mocharc', 'pyproject.toml',
  ];

  for (const f of rootFiles) {
    await addFile(path.join(target, f));
  }

  // Check .git directory
  await addFile(path.join(target, '.git'));

  // Check runs/ directory
  const runsDir = path.join(target, 'harness', 'runs');
  try {
    const runFiles = await readdir(runsDir);
    if (runFiles.length > 0) result['harness/runs/'] = { _isDir: true, _count: runFiles.length };
  } catch { /* no runs dir */ }

  return result;
}

// --- Utilities ---

function hasContent(file, pattern) {
  if (!file || !file.content) return false;
  return pattern.test(file.content);
}

function tryJson(file) {
  if (!file || !file.content) return false;
  try { JSON.parse(file.content); return true; }
  catch { return false; }
}

async function tryStat(p) {
  try { return await access(p).then(() => Promise.resolve({ isDirectory: () => false, mode: 0o644 })); }
  catch { return null; }
}

async function writeText(p, content) {
  const { writeFile } = await import('node:fs/promises');
  await writeFile(p, content, 'utf-8');
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--help') args.help = true;
    else if (argv[i] === '--json') args.json = true;
    else if (argv[i] === '--target') args.target = argv[++i];
    else if (argv[i] === '--html') args.html = argv[++i];
    else if (argv[i] === '--min-score') args.minScore = Number(argv[++i]);
    else args._ = [...(args._ || []), argv[i]];
  }
  return args;
}

function formatReport(result, target) {
  const lines = [];
  lines.push(`Harness Assessment: ${target}`);
  lines.push(`Generated: ${result.generatedAt}`);
  lines.push('');
  lines.push(`  Instructions    ${renderBar(result.scores.instructions)} ${result.scores.instructions}/20`);
  lines.push(`  State           ${renderBar(result.scores.state)} ${result.scores.state}/20`);
  lines.push(`  Verification    ${renderBar(result.scores.verification)} ${result.scores.verification}/20`);
  lines.push(`  Scope           ${renderBar(result.scores.scope)} ${result.scores.scope}/20`);
  lines.push(`  Lifecycle       ${renderBar(result.scores.lifecycle)} ${result.scores.lifecycle}/20`);
  lines.push(`  ─────────────────────────────────────`);
  lines.push(`  Overall         ${renderBar(Math.round(result.overall / 5))} ${result.overall}/100`);
  lines.push('');
  lines.push(`  Recommendation: ${result.recommendation}`);
  return lines.join('\n');
}

function renderBar(score) {
  const filled = Math.round(score / 2);
  return '█'.repeat(filled) + '░'.repeat(10 - filled);
}

function renderHtml(result, title) {
  const bar = (s) => `<div style="background:#e0e0e0;border-radius:4px;height:20px;width:200px"><div style="background:${s > 12 ? '#4caf50' : s > 7 ? '#ff9800' : '#f44336'};width:${s*10}%;height:20px;border-radius:4px"></div></div>`;
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Harness: ${title}</title></head>
<body style="font-family:sans-serif;max-width:600px;margin:40px auto">
<h1>Harness Assessment: ${title}</h1>
<p>Generated: ${result.generatedAt}</p>
<table style="width:100%;border-collapse:collapse">
${Object.entries(result.scores).map(([k,v]) => `<tr><td style="padding:8px;font-weight:bold">${k}</td><td style="padding:8px">${bar(v)}</td><td style="padding:8px">${v}/20</td></tr>`).join('\n')}
<tr style="border-top:2px solid #333"><td style="padding:8px;font-weight:bold">Overall</td><td style="padding:8px">${bar(Math.round(result.overall/5))}</td><td style="padding:8px">${result.overall}/100</td></tr>
</table>
<p><strong>Recommendation:</strong> ${result.recommendation}</p>
</body></html>`;
}

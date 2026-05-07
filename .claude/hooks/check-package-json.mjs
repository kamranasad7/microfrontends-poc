#!/usr/bin/env node
// PreToolUse hook for Write|Edit. When the agent proposes a package.json
// write, parse the new content, extract every dep, and verify each was
// looked up with `pnpm view <pkg>` somewhere in the conversation transcript.
// Block (exit 2) any deps that weren't checked.
//
// Why: enforces the "always check latest version" rule (see
// feedback_lib_versions in user memory) at the tool layer instead of
// relying on the model to self-discipline.

import { readFileSync } from 'node:fs';

function exitOk() { process.exit(0); }
function exitBlock(msg) {
  process.stderr.write(msg + '\n');
  process.exit(2);
}

let payload;
try {
  payload = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  exitOk(); // malformed payload — don't block
}

const filePath = payload?.tool_input?.file_path ?? '';
if (!/(^|[\\/])package\.json$/.test(filePath)) exitOk();

// Read transcript once.
let transcript = '';
try {
  transcript = readFileSync(payload.transcript_path, 'utf8');
} catch {
  // Can't verify — fail closed.
  exitBlock(
    'BLOCKING: could not read transcript to verify version lookups. ' +
    'Run `pnpm view <pkg> version` for every dep in this package.json, ' +
    'then retry.',
  );
}

// Extract deps from proposed content. Write gives full content; Edit gives
// new_string (often a partial). Try to parse as full JSON; if that fails,
// fall back to a regex over the new_string.
const writeContent = payload.tool_input?.content;
const editNewStr = payload.tool_input?.new_string;
const candidate = writeContent ?? editNewStr ?? '';

const depNames = new Set();
try {
  const json = JSON.parse(candidate);
  for (const k of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
    if (json[k]) for (const name of Object.keys(json[k])) depNames.add(name);
  }
} catch {
  // Partial edit — pull dep names from quoted "name": "version" lines.
  const re = /"([^"@\s][^"]*)"\s*:\s*"[\^~]?\d/g;
  let m;
  while ((m = re.exec(candidate)) !== null) depNames.add(m[1]);
}

if (depNames.size === 0) exitOk();

const missing = [];
for (const name of depNames) {
  // Look for `pnpm view <name>` (any subcommand: version, versions, peerDependencies).
  // Escape the name for regex.
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`pnpm view ${escaped}\\b`);
  if (!re.test(transcript)) missing.push(name);
}

if (missing.length === 0) exitOk();

exitBlock(
  'BLOCKING: package.json write missing version checks for:\n' +
  missing.map((d) => `  - ${d}`).join('\n') + '\n' +
  'Per project rule (feedback_lib_versions), every pinned dep must be ' +
  'queried with `pnpm view <pkg> version` first. Run those, then retry the write.',
);

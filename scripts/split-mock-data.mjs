import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const src = path.join(root, 'lib', 'mock-data.ts');
const text = fs.readFileSync(src, 'utf8');
const lines = text.split('\n');

// Export names -> target module
const PUBLIC = new Set([
    'INITIAL_AGENCY_SETTINGS',
    'INITIAL_PROPERTIES',
    'INITIAL_VISITS',
    'DEFAULT_AGENCY_SETTINGS',
    'INITIAL_VISIT_SHEETS',
    'INITIAL_VENDOR_REPORTS',
]);
const COCKPIT = new Set([
    'INITIAL_BUYERS',
    'INITIAL_AUDIT_LOGS',
    'MOCK_DVF_TRANSACTIONS',
    'INITIAL_CONTACT_LEADS',
    'INITIAL_ESTIMATION_LEADS',
    'INITIAL_TRANSACTIONS',
    'INITIAL_PROSPECTING_LEADS',
    'INITIAL_AGENCY_KEYS',
    'INITIAL_AGENCY_SIGNBOARDS',
    'INITIAL_MANDATE_AVENANTS',
    'INITIAL_PROPOSALS',
]);

// The header import line (line index 0)
const header = lines[0];

// Find top-level export blocks. Each block starts at a line matching
// /^export const (\w+)/ and ends at a line that is exactly '];' or '};'
// at column 0 (top-level array/object literal close).
const blocks = [];
let i = 1; // skip header
while (i < lines.length) {
    const m = lines[i].match(/^export const (\w+)/);
    if (m) {
        const name = m[1];
        const start = i;
        // Single-line export (e.g. `export const X = Y;`) — ends on the same line.
        if (lines[i].trimEnd().endsWith(';')) {
            blocks.push({ name, start, end: i });
            i++;
            continue;
        }
        let j = i + 1;
        // find matching close at column 0 (strip possible trailing \r from CRLF)
        while (j < lines.length) {
            const trimmed = lines[j].replace(/\r$/, '');
            if (trimmed === '];' || trimmed === '};') {
                break;
            }
            j++;
        }
        if (j >= lines.length) {
            throw new Error(`Could not find closing for ${name} at line ${i + 1}`);
        }
        blocks.push({ name, start, end: j });
        i = j + 1;
    } else {
        i++;
    }
}

// Validate all expected names found
const found = new Set(blocks.map((b) => b.name));
for (const n of [...PUBLIC, ...COCKPIT]) {
    if (!found.has(n)) {
        throw new Error(`Missing export block for ${n}`);
    }
}

function extractBlock(block) {
    return lines.slice(block.start, block.end + 1).join('\n');
}

function buildModule(names) {
    const parts = [];
    for (const b of blocks) {
        if (names.has(b.name)) {
            parts.push(extractBlock(b));
        }
    }
    return parts.join('\n\n');
}

// Build the type import line for each module based on the types used.
// We reuse the original header import but only keep referenced types is complex;
// simplest: keep the full original type import in both modules (types are erased at compile,
// so they don't affect the runtime bundle). This is safe.
const typeImport = header;

const publicBody = buildModule(PUBLIC);
const cockpitBody = buildModule(COCKPIT);

const publicFile = `${typeImport}\n\n${publicBody}\n`;
const cockpitFile = `${typeImport}\n\n${cockpitBody}\n`;

fs.writeFileSync(path.join(root, 'lib', 'mock-data-public.ts'), publicFile);
fs.writeFileSync(path.join(root, 'lib', 'mock-data-cockpit.ts'), cockpitFile);

// Rewrite mock-data.ts as a barrel re-exporting both modules.
const barrel = `// Barrel re-export — keeps backward compatibility for existing imports.
// Data is physically split so the public bundle never pulls cockpit-only datasets.
export * from './mock-data-public';
export * from './mock-data-cockpit';
`;
fs.writeFileSync(src, barrel);

console.log('Split complete.');
console.log('Public exports:', [...PUBLIC].join(', '));
console.log('Cockpit exports:', [...COCKPIT].join(', '));

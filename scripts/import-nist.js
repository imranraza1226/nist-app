#!/usr/bin/env node
/**
 * NIST JSON Import Script
 *
 * Transforms official NIST JSON files into the app's nistData.ts schema.
 *
 * Supported input formats:
 *   - OSCAL Catalog (SP 800-53 Rev 5, SP 800-171 Rev 2)
 *     Download: https://github.com/usnistgov/oscal-content
 *   - NIST CSF 2.0 JSON
 *     Download: https://www.nist.gov/cyberframework/csf-20-data
 *
 * Usage:
 *   node scripts/import-nist.js \
 *     --input  ./path/to/nist.json \
 *     --framework sp80053 \
 *     --output ./src/data/nistData.ts
 *
 * Flags:
 *   --input      <path>   Path to the source NIST JSON file (required)
 *   --framework  <id>     One of: csf2 | sp80053 | sp800171  (required)
 *   --output     <path>   Output .ts file (default: ./src/data/nistData.ts)
 *   --dry-run            Print first 5 controls and exit without writing
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------
function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      args[key] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
    }
  }
  return args;
}

const args = parseArgs(process.argv);

if (!args.input || !args.framework) {
  console.error(
    'Usage: node scripts/import-nist.js --input <file> --framework <csf2|sp80053|sp800171> [--also-input <file> --also-framework <id>] [--output <file>] [--dry-run]'
  );
  process.exit(1);
}

const VALID_FRAMEWORKS = ['csf2', 'sp80053', 'sp800171'];
if (!VALID_FRAMEWORKS.includes(args.framework)) {
  console.error(`--framework must be one of: ${VALID_FRAMEWORKS.join(', ')}`);
  process.exit(1);
}
if (args['also-framework'] && !VALID_FRAMEWORKS.includes(args['also-framework'])) {
  console.error(`--also-framework must be one of: ${VALID_FRAMEWORKS.join(', ')}`);
  process.exit(1);
}

const inputPath = path.resolve(args.input);
const framework = args.framework;
const alsoInputPath = args['also-input'] ? path.resolve(args['also-input']) : null;
const alsoFramework = args['also-framework'] || null;
const outputPath = path.resolve(args.output || './src/data/nistData.ts');
const dryRun = args['dry-run'] === true;

// ---------------------------------------------------------------------------
// Read input
// ---------------------------------------------------------------------------
if (!fs.existsSync(inputPath)) {
  console.error(`Input file not found: ${inputPath}`);
  process.exit(1);
}

console.log(`Reading: ${inputPath}`);
const raw = fs.readFileSync(inputPath, 'utf8');
let source;
try {
  source = JSON.parse(raw);
} catch (e) {
  console.error('Failed to parse JSON:', e.message);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Strip OSCAL parameter placeholders: {{ insert: param, ... }} */
function stripOscalParams(str = '') {
  return str
    .replace(/\{\{[^}]*\}\}/g, '')  // remove {{ ... }}
    .replace(/\s{2,}/g, ' ')        // collapse extra spaces
    .replace(/\(\s*\)/g, '')        // remove empty parens left behind
    .replace(/:\s*;/g, ';')         // clean up orphaned colons
    .replace(/:\s*\./g, '.')
    .trim();
}

/** Extract text from an OSCAL parts array for a given part name. */
function getOscalPartText(parts = [], name) {
  for (const part of parts) {
    if (part.name === name) {
      if (part.prose) return part.prose.trim();
      // Some parts nest further
      if (part.parts) {
        const nested = part.parts.map((p) => p.prose || '').join(' ');
        if (nested.trim()) return nested.trim();
      }
    }
    // Recurse into sub-parts
    if (part.parts) {
      const result = getOscalPartText(part.parts, name);
      if (result) return result;
    }
  }
  return '';
}

/** Extract related control IDs from OSCAL links array. */
function getOscalRelatedControls(links = []) {
  return links
    .filter((l) => l.rel === 'related')
    .map((l) => {
      // href is like "#ac-2" or "https://...#ac-2"
      const href = l.href || '';
      const hash = href.split('#').pop();
      // Normalise to uppercase with dash, e.g. "ac-2" → "AC-2"
      return hash.replace(/-/g, '-').toUpperCase();
    })
    .filter(Boolean);
}

/** Derive tags from family title, function category, and control ID. */
function deriveTags(family, functionCategory, controlId) {
  const tags = new Set();
  if (functionCategory) {
    tags.add(functionCategory.toLowerCase().replace(/\s+/g, '-'));
  }
  // Family → slug
  if (family) {
    family
      .toLowerCase()
      .split(/[\s,/&]+/)
      .filter((w) => w.length > 2)
      .forEach((w) => tags.add(w));
  }
  // Prefix from control ID (e.g. "AC" from "AC-2", "GV" from "GV.OC-01")
  const prefix = controlId.split(/[-.]/).shift().toLowerCase();
  if (prefix) tags.add(prefix);
  return [...tags].slice(0, 6); // keep it concise
}

/** Normalise OSCAL control ID to uppercase with dash. "ac-2" → "AC-2" */
function normaliseOscalId(id) {
  return id.toUpperCase();
}

// ---------------------------------------------------------------------------
// Parsers
// ---------------------------------------------------------------------------

/**
 * Parse OSCAL Catalog format (SP 800-53, SP 800-171).
 * Top-level shape: { catalog: { groups: [ { id, title, controls: [...] } ] } }
 */
function parseOscalCatalog(data, fw) {
  const catalog = data.catalog;
  if (!catalog) throw new Error('Expected top-level "catalog" key — is this an OSCAL catalog file?');

  const controls = [];

  function processControl(ctrl, familyTitle, functionCat) {
    const controlId = normaliseOscalId(ctrl.id || '');
    const title = ctrl.title || '';
    const description = stripOscalParams(
      getOscalPartText(ctrl.parts, 'statement') ||
      getOscalPartText(ctrl.parts, 'overview') ||
      title
    );
    const implementationGuidance = stripOscalParams(
      getOscalPartText(ctrl.parts, 'guidance') ||
      getOscalPartText(ctrl.parts, 'implementation') ||
      ''
    );
    const relatedControls = getOscalRelatedControls(ctrl.links);
    const tags = deriveTags(familyTitle, functionCat, controlId);

    controls.push({
      control_id: controlId,
      title,
      description,
      implementation_guidance: implementationGuidance,
      framework: fw,
      function_category: functionCat,
      family: familyTitle,
      related_controls: relatedControls,
      tags,
    });

    // Process enhancements (sub-controls)
    if (Array.isArray(ctrl.controls)) {
      for (const sub of ctrl.controls) {
        processControl(sub, familyTitle, functionCat);
      }
    }
  }

  // SP 800-53 uses groups as families
  if (Array.isArray(catalog.groups)) {
    for (const group of catalog.groups) {
      const family = group.title || group.id || '';
      for (const ctrl of group.controls || []) {
        processControl(ctrl, family, family);
      }
    }
  }

  // Some catalogs use a flat controls array at the top level
  if (Array.isArray(catalog.controls)) {
    for (const ctrl of catalog.controls) {
      const family = ctrl.title || ctrl.id || '';
      processControl(ctrl, family, family);
    }
  }

  return controls;
}

/**
 * Parse CSF 2.0 OSCAL Catalog.
 * 3-level structure: groups=Functions → controls=Categories → controls=Subcategories
 * e.g. GOVERN → Organizational Context (GV.OC) → GV.OC-01
 */
function parseCsf2Oscal(data) {
  const catalog = data.catalog;
  if (!catalog) throw new Error('Expected top-level "catalog" key.');

  const controls = [];

  // Capitalise first letter only: "GOVERN" → "Govern"
  function titleCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  for (const group of catalog.groups || []) {
    const functionCat = titleCase(group.title || group.id || '');

    for (const category of group.controls || []) {
      const family = category.title || category.id || '';

      // The subcategories are the actual controls
      for (const sub of category.controls || []) {
        const controlId = normaliseOscalId(sub.id || '');
        const description = stripOscalParams(
          getOscalPartText(sub.parts, 'statement') ||
          getOscalPartText(sub.parts, 'overview') ||
          ''
        );
        const implementationGuidance = stripOscalParams(
          getOscalPartText(sub.parts, 'implementation-examples') ||
          getOscalPartText(sub.parts, 'guidance') ||
          ''
        );
        const relatedControls = getOscalRelatedControls(sub.links);

        controls.push({
          control_id: controlId,
          title: `${family} — ${controlId}`,
          description: description || family,
          implementation_guidance: implementationGuidance,
          framework: 'csf2',
          function_category: functionCat,
          family,
          related_controls: relatedControls,
          tags: deriveTags(family, functionCat, controlId),
        });
      }
    }
  }

  return controls;
}

/**
 * Parse NIST CSF 2.0 JSON.
 *
 * NIST publishes CSF 2.0 in several JSON shapes. This handles the most common:
 *
 * Shape A (nist.gov download):
 * { "model": { "functions": [ { "id": "GV", "title": "GOVERN",
 *   "categories": [ { "id": "GV.OC", "title": "...",
 *     "subcategories": [ { "id": "GV.OC-01", "statement": "..." } ] } ] } ] } }
 *
 * Shape B (flat array):
 * { "subcategories": [ { "id": "GV.OC-01", "function": "GOVERN",
 *   "category": "Organizational Context", "statement": "..." } ] }
 */
function parseCsf2(data) {
  const controls = [];

  // --- Shape A ---
  const model = data.model || data;
  if (Array.isArray(model.functions)) {
    for (const fn of model.functions) {
      const functionCat = fn.title || fn.id || '';
      for (const cat of fn.categories || []) {
        const family = cat.title || cat.id || '';
        for (const sub of cat.subcategories || []) {
          const controlId = sub.id || '';
          const statement = sub.statement || sub.description || '';
          const guidance = sub['implementation-examples'] || sub.guidance || '';
          const related = Array.isArray(sub.related) ? sub.related : [];
          controls.push({
            control_id: controlId,
            title: `${family} — ${controlId}`,
            description: statement,
            implementation_guidance: Array.isArray(guidance)
              ? guidance.join(' ')
              : guidance,
            framework: 'csf2',
            function_category: functionCat,
            family,
            related_controls: related,
            tags: deriveTags(family, functionCat, controlId),
          });
        }
      }
    }
    return controls;
  }

  // --- Shape B (flat) ---
  const flat = data.subcategories || data.controls || data.items;
  if (Array.isArray(flat)) {
    for (const item of flat) {
      const controlId = item.id || item.subcategory_id || '';
      controls.push({
        control_id: controlId,
        title: item.title || `${item.category || ''} — ${controlId}`,
        description: item.statement || item.description || '',
        implementation_guidance: item.implementation_examples || item.guidance || '',
        framework: 'csf2',
        function_category: item.function || item.function_category || '',
        family: item.category || '',
        related_controls: Array.isArray(item.related) ? item.related : [],
        tags: deriveTags(item.category || '', item.function || '', controlId),
      });
    }
    return controls;
  }

  throw new Error(
    'Could not detect CSF 2.0 JSON structure.\n' +
      'Expected { model: { functions: [...] } } or { subcategories: [...] }.\n' +
      'Check the file and update the parseCsf2() function if needed.'
  );
}

// ---------------------------------------------------------------------------
// Dispatch
// ---------------------------------------------------------------------------
function parseSource(data, fw) {
  if (fw === 'csf2') {
    if (data.catalog) {
      console.log('Parsing as CSF 2.0 OSCAL Catalog...');
      return parseCsf2Oscal(data);
    }
    console.log('Parsing as NIST CSF 2.0 JSON...');
    return parseCsf2(data);
  }
  console.log(`Parsing as OSCAL Catalog (${fw})...`);
  return parseOscalCatalog(data, fw);
}

let controls;
try {
  controls = parseSource(source, framework);

  if (alsoInputPath && alsoFramework) {
    if (!fs.existsSync(alsoInputPath)) {
      console.error(`--also-input file not found: ${alsoInputPath}`);
      process.exit(1);
    }
    console.log(`Reading: ${alsoInputPath}`);
    const alsoRaw = fs.readFileSync(alsoInputPath, 'utf8');
    const alsoSource = JSON.parse(alsoRaw);
    const alsoControls = parseSource(alsoSource, alsoFramework);
    console.log(`Parsed ${alsoControls.length} additional controls (${alsoFramework}).`);
    controls = controls.concat(alsoControls);
  }
} catch (e) {
  console.error('Parse error:', e.message);
  process.exit(1);
}

console.log(`Total controls: ${controls.length}`);

if (controls.length === 0) {
  console.error('No controls extracted. Check the input file format.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Dry-run preview
// ---------------------------------------------------------------------------
if (dryRun) {
  console.log('\n--- DRY RUN: first 5 controls ---\n');
  controls.slice(0, 5).forEach((c) => console.log(JSON.stringify(c, null, 2)));
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Render TypeScript output
// ---------------------------------------------------------------------------
function escapeTs(str) {
  return (str || '').replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

function renderControl(c) {
  const related = JSON.stringify(c.related_controls);
  const tags = JSON.stringify(c.tags);
  return `  {
    control_id: \`${escapeTs(c.control_id)}\`,
    title: \`${escapeTs(c.title)}\`,
    description: \`${escapeTs(c.description)}\`,
    implementation_guidance: \`${escapeTs(c.implementation_guidance)}\`,
    framework: '${c.framework}',
    function_category: \`${escapeTs(c.function_category)}\`,
    family: \`${escapeTs(c.family)}\`,
    related_controls: ${related},
    tags: ${tags},
  }`;
}

const sources = alsoInputPath
  ? `${path.basename(inputPath)} + ${path.basename(alsoInputPath)}`
  : path.basename(inputPath);
const frameworks = alsoFramework ? `${framework} + ${alsoFramework}` : framework;

const ts = `// AUTO-GENERATED by scripts/import-nist.js — do not edit by hand.
// Source: ${sources}
// Frameworks: ${frameworks}
// Controls: ${controls.length}
// Generated: ${new Date().toISOString()}

import { Control } from '../types';

export const NIST_CONTROLS: Omit<Control, 'id'>[] = [
${controls.map(renderControl).join(',\n')}
];
`;

// ---------------------------------------------------------------------------
// Write output
// ---------------------------------------------------------------------------
const outDir = path.dirname(outputPath);
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(outputPath, ts, 'utf8');
console.log(`Written: ${outputPath}`);

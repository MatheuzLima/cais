// Collects user-visible English strings from the frontend sources so they can
// be added to the translation dictionaries.
//
// Usage: node scripts/i18n/extract-strings.mjs > strings.json
//
// The output is a sorted JSON array of strings that are not yet keys in
// translations/pt-BR/translation.json.
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '../..');
const APP = path.join(ROOT, 'app');

// Screens that Cais does not offer (see enableKubernetes in app/branding.json)
const SKIP_DIRS = ['app/kubernetes', 'app/react/kubernetes', 'app/azure', 'app/react/azure', 'app/react/portainer/generated-api', 'app/setup-tests'];

const TEXT_PROPS = new Set([
  'aria-label',
  'buttonText',
  'confirmButtonText',
  'description',
  'emptyContentLabel',
  'emptyMessage',
  'header',
  'heading',
  'helpText',
  'inlineDescription',
  'label',
  'loadingText',
  'message',
  'noDataMessage',
  'noItemsMessage',
  'placeholder',
  'subtitle',
  'text',
  'title',
  'tooltip',
  'valueExplanation',
]);

const MESSAGE_CALLS = new Set([
  'notifySuccess',
  'notifyError',
  'notifyWarning',
  'notifyInfo',
  'success',
  'error',
  'warning',
  'confirm',
  'confirmDelete',
  'confirmDestructive',
  'confirmWebEditorDiscard',
  'buildConfirmButton',
  'required',
  'min',
  'max',
  'matches',
  'typeError',
  'email',
  'url',
  'integer',
  'positive',
  'moreThan',
  'lessThan',
  'length',
  'test',
  'oneOf',
  'notOneOf',
  't',
]);

// props such as addLabel, emptyMessage or confirmButtonText
const TEXT_PROP_SUFFIX = /(Label|Text|Title|Message|Tooltip|Description|Placeholder|Heading)$/;

function isTextProp(name) {
  return TEXT_PROPS.has(name) || TEXT_PROP_SUFFIX.test(name);
}

const strings = new Set();

function looksLikeText(raw) {
  const s = raw.replace(/\s+/g, ' ').trim();
  if (s.length < 2 || !/[A-Za-z]{2}/.test(s)) return null;
  if (/^(https?:|\/|#|@|\$|!|\?|&\w+;)/.test(s)) return null;
  if (/^\./.test(s) && !/^\.\s/.test(s)) return null; // file names, but keep ". Next sentence"
  if (/^'.*'$/.test(s)) return null; // AngularJS expression, captured unquoted elsewhere
  if (/^[a-z0-9!:[\]-]+( [a-z0-9!:[\]-]+)+$/.test(s) && s.includes('-')) return null; // css classes
  // identifiers, css classes, routes, keys, file names
  if (!s.includes(' ')) {
    if (/[._/:=<>{}()[\]]/.test(s)) return null;
    if (/^[a-z]/.test(s) && /[A-Z_-]/.test(s)) return null; // camelCase / kebab
    if (/^[a-z]+$/.test(s) && s.length > 12) return null;
  }
  if (/^[\w-]+(\s+[\w-]+)*$/.test(s) && /(^|\s)(btn|col|form|text|flex|mr|ml|mt|mb|px|py|w|h)-/.test(s)) return null;
  if (/^[A-Z0-9_]+$/.test(s)) return null; // CONSTANTS
  return s;
}

function add(raw) {
  const s = looksLikeText(raw);
  if (s) strings.add(s);
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(ROOT, full).replaceAll('\\', '/');
    if (SKIP_DIRS.some((d) => rel === d || rel.startsWith(`${d}/`))) continue;
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(tsx?|js|html)$/.test(entry.name) && !/\.(test|stories)\./.test(entry.name)) out.push(full);
  }
  return out;
}

function propName(node) {
  if (!node) return '';
  if (ts.isIdentifier(node) || ts.isStringLiteral(node)) return node.text;
  return '';
}

function calleeName(expr) {
  if (ts.isIdentifier(expr)) return expr.text;
  if (ts.isPropertyAccessExpression(expr)) return expr.name.text;
  return '';
}

function isStringNode(node) {
  return ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node);
}

function scanTs(file) {
  const src = fs.readFileSync(file, 'utf8');
  const kind = file.endsWith('x') ? ts.ScriptKind.TSX : file.endsWith('.js') ? ts.ScriptKind.JS : ts.ScriptKind.TS;
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, kind);

  function visit(node) {
    if (ts.isJsxText(node)) {
      add(node.text);
    } else if (ts.isJsxAttribute(node) && node.initializer) {
      const name = node.name.getText(sf);
      if (isTextProp(name)) {
        const init = node.initializer;
        if (ts.isStringLiteral(init)) add(init.text);
        else if (ts.isJsxExpression(init) && init.expression && isStringNode(init.expression)) add(init.expression.text);
      }
    } else if (ts.isPropertyAssignment(node) && isTextProp(propName(node.name)) && isStringNode(node.initializer)) {
      add(node.initializer.text);
    } else if (ts.isBindingElement(node) && node.initializer && isStringNode(node.initializer) && isTextProp(propName(node.name))) {
      // default values of destructured props: `addLabel = 'Add item'`
      add(node.initializer.text);
    } else if (ts.isCallExpression(node) && MESSAGE_CALLS.has(calleeName(node.expression))) {
      node.arguments.forEach((arg) => {
        if (isStringNode(arg)) add(arg.text);
        if (ts.isObjectLiteralExpression(arg)) {
          arg.properties.forEach((p) => {
            if (ts.isPropertyAssignment(p) && TEXT_PROPS.has(propName(p.name)) && isStringNode(p.initializer)) add(p.initializer.text);
          });
        }
      });
    } else if (ts.isConditionalExpression(node) && ts.isJsxExpression(node.parent)) {
      [node.whenTrue, node.whenFalse].forEach((n) => isStringNode(n) && add(n.text));
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
}

function scanHtml(file) {
  const src = fs.readFileSync(file, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
  // text between tags; Angular interpolations become __n__ placeholders
  for (const m of src.matchAll(/>([^<>]+)</g)) {
    let i = 0;
    const text = m[1].replace(/\{\{[^}]*\}\}/g, () => `__${i++}__`);
    if (/\|\s*translate/.test(m[1])) continue;
    if (text.replace(/__\d+__/g, '').trim().length) add(text);
  }
  // static attributes and string literals bound to component inputs
  for (const m of src.matchAll(/\s(placeholder|title|aria-label)="([^"{']+)"/g)) add(m[2]);
  for (const m of src.matchAll(/\s[\w-]+="'([^'"]+)'"/g)) add(m[1]);
}

for (const file of walk(APP)) {
  if (file.endsWith('.html')) scanHtml(file);
  else scanTs(file);
}

const dict = JSON.parse(fs.readFileSync(path.join(ROOT, 'translations/pt-BR/translation.json'), 'utf8'));
const missing = [...strings].filter((s) => !(s in dict)).sort((a, b) => a.localeCompare(b));
process.stdout.write(`${JSON.stringify(missing, null, 2)}\n`);

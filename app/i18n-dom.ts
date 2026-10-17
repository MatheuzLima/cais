import { APP_NAME } from './branding';
import i18n, { getCurrentLanguage } from './i18n';

/**
 * Translates text that is rendered without going through `t()`.
 *
 * Most of the inherited UI writes English strings straight into JSX and
 * AngularJS templates. Instead of wrapping each of them, this watches the DOM
 * and replaces any text node (or placeholder/title/aria-label attribute) whose
 * whole content is a key of the active dictionary. Keys that contain
 * `__0__`, `__1__`... placeholders match any value in that position, which
 * covers AngularJS interpolations such as `{{ count }} selected`.
 *
 * It also replaces the upstream product name with APP_NAME in every language,
 * including messages that come from the server.
 */

const UPSTREAM_BRAND = /\bPortainer\b/g;

const TRANSLATED_ATTRIBUTES = ['placeholder', 'title', 'aria-label', 'alt'];

// content that is data or code, not UI copy
const SKIP_SELECTOR = [
  'script',
  'style',
  'code',
  'pre',
  'textarea',
  '[contenteditable]',
  '.cm-editor',
  '.CodeMirror',
  '.xterm',
  '[data-no-translate]',
].join(',');

interface Pattern {
  regex: RegExp;
  value: string;
}

let exact = new Map<string, string>();
let patterns: Pattern[] = [];

// remembers what we wrote so our own mutations are not processed again
const written = new WeakMap<Node, string>();

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function loadDictionary() {
  exact = new Map();
  patterns = [];

  if (getCurrentLanguage() === 'en') {
    return;
  }

  const dictionary = i18n.getResourceBundle(
    getCurrentLanguage(),
    'translation'
  ) as Record<string, string> | undefined;

  Object.entries(dictionary ?? {}).forEach(([key, value]) => {
    if (!value || value === key) {
      return;
    }

    if (/__\d+__/.test(key)) {
      const source = escapeRegExp(key).replace(/__(\d+)__/g, '(?<p$1>.+?)');
      patterns.push({ regex: new RegExp(`^${source}$`), value });
    } else {
      exact.set(key, value);
    }
  });
}

function translateText(text: string): string | null {
  const trimmed = text.replace(/\s+/g, ' ').trim();
  if (!trimmed || !/[A-Za-z]/.test(trimmed)) {
    return null;
  }

  let result = exact.get(trimmed);

  if (result === undefined) {
    const match = patterns.find((p) => p.regex.test(trimmed));
    if (match) {
      const groups = match.regex.exec(trimmed)?.groups ?? {};
      result = match.value.replace(
        /__(\d+)__/g,
        (_, index) => groups[`p${index}`] ?? ''
      );
    }
  }

  const branded = (result ?? trimmed).replace(UPSTREAM_BRAND, APP_NAME);
  if (result === undefined && branded === trimmed) {
    return null;
  }

  // keep the surrounding whitespace, it often separates inline elements
  const leading = text.match(/^\s*/)?.[0] ?? '';
  const trailing = text.match(/\s*$/)?.[0] ?? '';
  return `${leading}${branded}${trailing}`;
}

function shouldSkip(element: Element | null) {
  return !element || !!element.closest(SKIP_SELECTOR);
}

function translateTextNode(node: Text) {
  const current = node.nodeValue ?? '';
  if (written.get(node) === current || shouldSkip(node.parentElement)) {
    return;
  }

  const translated = translateText(current);
  if (translated !== null && translated !== current) {
    node.replaceData(0, node.length, translated);
  }
  written.set(node, node.nodeValue ?? '');
}

function translateAttributes(element: Element) {
  if (shouldSkip(element)) {
    return;
  }

  TRANSLATED_ATTRIBUTES.forEach((name) => {
    const current = element.getAttribute(name);
    if (!current) {
      return;
    }

    const translated = translateText(current);
    if (translated !== null && translated !== current) {
      element.setAttribute(name, translated);
    }
  });
}

function translateTree(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root as Text);
    return;
  }

  if (root.nodeType !== Node.ELEMENT_NODE) {
    return;
  }

  translateAttributes(root as Element);

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT
  );
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.nodeType === Node.TEXT_NODE) {
      translateTextNode(node as Text);
    } else {
      translateAttributes(node as Element);
    }
  }
}

function start() {
  loadDictionary();
  translateTree(document.body);

  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(translateTree);
      } else if (mutation.type === 'characterData') {
        translateTextNode(mutation.target as Text);
      } else if (mutation.target.nodeType === Node.ELEMENT_NODE) {
        translateAttributes(mutation.target as Element);
      }
    });
  }).observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: TRANSLATED_ATTRIBUTES,
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}

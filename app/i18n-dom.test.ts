import { vi } from 'vitest';

import './i18n-dom';

vi.mock('./i18n', () => ({
  default: {
    getResourceBundle: () => ({
      Containers: 'Contêineres',
      'Back up Portainer': 'Backup do Portainer',
      'No log line matching the __0__ filter':
        'Nenhuma linha corresponde ao filtro __0__',
    }),
  },
  getCurrentLanguage: () => 'pt-BR',
}));

async function render(html: string) {
  const root = document.createElement('div');
  root.innerHTML = html;
  document.body.appendChild(root);
  // MutationObserver callbacks run as microtasks
  await Promise.resolve();
  return root;
}

afterEach(() => {
  document.body.innerHTML = '';
});

test('translates text that matches a dictionary key', async () => {
  const root = await render('<span> Containers </span>');

  expect(root.querySelector('span')?.textContent).toBe(' Contêineres ');
});

test('fills placeholders from the rendered text', async () => {
  const root = await render('<p>No log line matching the nginx filter</p>');

  expect(root.textContent).toBe('Nenhuma linha corresponde ao filtro nginx');
});

test('replaces the upstream name with the app name', async () => {
  const root = await render(
    '<h1>Back up Portainer</h1><p>Welcome to Portainer</p>'
  );

  expect(root.querySelector('h1')?.textContent).toBe('Backup do Cais');
  expect(root.querySelector('p')?.textContent).toBe('Welcome to Cais');
});

test('translates attributes', async () => {
  const root = await render('<input placeholder="Containers" />');

  expect(root.querySelector('input')?.getAttribute('placeholder')).toBe(
    'Contêineres'
  );
});

test('leaves code and unknown text untouched', async () => {
  const root = await render(
    '<code>Containers</code><span>my-container</span><span>portainer/agent</span>'
  );

  expect(root.textContent).toBe('Containersmy-containerportainer/agent');
});

test('translates text that changes after rendering', async () => {
  const root = await render('<span>loading</span>');
  const span = root.querySelector('span')!;

  span.firstChild!.nodeValue = 'Containers';
  await Promise.resolve();

  expect(span.textContent).toBe('Contêineres');
});

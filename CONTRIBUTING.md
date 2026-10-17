# Contribuindo com o Cais

Obrigado pelo interesse! PRs em português ou inglês são bem-vindos.
Não sabe por onde começar? Veja o [ROADMAP.md](ROADMAP.md): cada item diz onde mexer e o tamanho do esforço.

## Fluxo

1. Para mudanças maiores, abra antes uma [issue](https://github.com/MatheuzLima/cais/issues) para combinar a abordagem.
2. Faça um fork e crie um branch a partir de `main`, no formato `<tipo>/<descricao-curta>`
   (ex.: `feat/container-webhook`, `fix/123-traducao-login`).
3. Abra o PR para `main`. A CI precisa passar e o mantenedor revisa (ver [`.github/CODEOWNERS`](.github/CODEOWNERS)).

## Ambiente de desenvolvimento

Requisitos: Node 22+, pnpm 10 (`corepack enable`), Docker. Go 1.26 só é necessário para rodar o backend fora do Docker.

```bash
pnpm install
pnpm dev            # frontend em http://localhost:8999, com proxy de /api para :9000
```

Para ter a API em `:9000`, suba uma imagem do Cais (a publicada ou uma feita do seu branch):

```bash
docker build -f build/cais/Dockerfile -t cais:dev .
docker run -d --name cais-dev -p 9000:9000 -v /var/run/docker.sock:/var/run/docker.sock cais:dev
```

## Antes de abrir o PR

A CI ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) roda o mesmo que você pode rodar localmente:

```bash
pnpm typecheck
pnpm exec eslint "./**/*.{js,jsx,ts,tsx}"
pnpm test
go vet ./api/... ./pkg/...
go test ./api/... ./pkg/...
```

Formate o código com `pnpm format` (frontend) e `gofmt` (backend).

## Regras do projeto

### Textos e tradução

- Todo texto novo da interface precisa de tradução em [`translations/pt-BR/translation.json`](translations/pt-BR/translation.json).
  A chave é o próprio texto em inglês.
- Textos inteiros escritos direto no JSX/HTML são traduzidos automaticamente na tela por [`app/i18n-dom.ts`](app/i18n-dom.ts);
  basta adicioná-los ao dicionário. Frases com partes variáveis devem usar `t()` com interpolação.
- `node scripts/i18n/extract-strings.mjs` lista o que ainda não tem tradução.
- Detalhes em [README.md → Translating](README.md#translating).

### Nome do produto

- Não escreva "Portainer" em textos da interface. Use `APP_NAME` de [`app/branding.ts`](app/branding.ts).
- Nome, links e cor do projeto ficam em [`app/branding.json`](app/branding.json).

### Recursos do Business Edition

- O Cais não mostra iscas de recursos pagos: o que não está implementado fica oculto.
- Para implementar um desses recursos, siga o passo a passo no [ROADMAP.md](ROADMAP.md#2-recursos-do-business-edition-não-existem-no-código-aberto).

### Manter o merge com o upstream viável

O código vem do Portainer CE e continua recebendo atualizações dele (`git fetch upstream`). Por isso:

- Prefira mudanças centralizadas (componentes compartilhados, flags, dicionário) a editar muitos arquivos.
- Evite renomear arquivos, pacotes ou rotas herdados sem necessidade.
- Código novo e exclusivo do Cais deve ficar em arquivos próprios sempre que possível.

## Mensagens de commit

```
<tipo>(<escopo>): <resumo>
```

- **Tipos:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `i18n` (traduções).
- **Escopo:** a área afetada, como `containers`, `stacks`, `auth`, `i18n` ou `build`.
- O resumo vai no imperativo, com no máximo 72 caracteres por linha.

Exemplos:

```
feat(containers): add container webhooks
fix(i18n): translate the registry form
i18n(settings): review backup texts
```

## Código de conduta

Ao participar, você concorda com o [Código de Conduta](CODE_OF_CONDUCT.md).

## Licença

As contribuições são licenciadas sob a mesma licença do projeto (zlib, ver [LICENSE](LICENSE)).

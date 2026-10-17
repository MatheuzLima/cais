<!--
Obrigado por contribuir com o Cais! Leia o CONTRIBUTING.md antes de abrir o PR.
Thanks for contributing! English is welcome too.
-->

Closes #<!-- número da issue, se houver -->

### O que muda

<!-- Descreva a mudança e o motivo. Para mudanças visuais, anexe prints antes/depois. -->

### Como testar

<!-- Passos para quem for revisar reproduzir e validar. -->

### Checklist

- [ ] `pnpm typecheck`, `pnpm test` e o lint passam (a CI roda tudo isso)
- [ ] Mudanças no backend têm testes e passam em `go test ./api/... ./pkg/...`
- [ ] Textos novos na interface têm tradução em `translations/pt-BR/translation.json`
- [ ] Não escrevi "Portainer" em textos da interface (use `APP_NAME` de `app/branding.ts`)
- [ ] Se desbloqueia algo do [ROADMAP.md](../ROADMAP.md), atualizei o item lá

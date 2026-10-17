# Roadmap do Cais

O que ainda falta melhorar, traduzir ou desbloquear. Cada item diz **onde mexer** para quem quiser abrir um PR.
Ao concluir um item, atualize este arquivo no mesmo PR.

Legenda de esforço: 🟢 pequeno (horas) · 🟡 médio (dias) · 🔴 grande (semanas)

---

## 1. Plataformas escondidas

O Cais é focado em Docker. Kubernetes e Azure continuam no código, mas ficam fora da interface enquanto
`"enableKubernetes": false` em [`app/branding.json`](app/branding.json).

| Plataforma                                     | Situação                                                                                                | Para liberar                                                                                                                                                                                                                                             |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Kubernetes**                                 | Funciona como no Portainer CE. Escondido no assistente de ambientes, nas configurações e no painel Helm | 1. `enableKubernetes: true`. 2. Traduzir as telas (o extrator pula `app/kubernetes` e `app/react/kubernetes`; tire-os de `SKIP_DIRS` em [`scripts/i18n/extract-strings.mjs`](scripts/i18n/extract-strings.mjs)). 3. Testar com um cluster (k3s/kind). 🟡 |
| **Helm**                                       | Parte do Kubernetes. O painel de certificado CA do Helm é recurso pago e fica oculto                    | Libera junto com o Kubernetes                                                                                                                                                                                                                            |
| **Azure ACI**                                  | Escondido pelo mesmo flag                                                                               | Separar em um flag próprio (`enableAzure`) em vez de reaproveitar `enableKubernetes`, traduzir `app/azure` e `app/react/azure`. 🟢                                                                                                                       |
| **KubeSolo / Criar cluster Kubernetes / KaaS** | Recursos pagos; não existem no código aberto                                                            | Implementação nova no backend. 🔴                                                                                                                                                                                                                        |

---

## 2. Recursos do Business Edition (não existem no código aberto)

O código público só tem as telas "isca" desses recursos. No Cais elas ficam **ocultas** (não aparecem com cadeado).
Para liberar um recurso:

1. Implementar o backend em Go (`api/`).
2. Em [`app/react/portainer/feature-flags/feature-flags.service.ts`](app/react/portainer/feature-flags/feature-flags.service.ts), trocar o recurso de `Edition.BE` para `Edition.CE`.
3. Revisar a tela: algumas também checam `isBE` diretamente (`grep -rn "isBE" app/react`).

Já liberados: **forçar redeploy** e **baixar imagem novamente** no GitOps (o backend já suportava).

### Úteis para Docker (prioridade)

| Recurso                                                        | FeatureId                                                   | O que existe hoje                                                                                                                                                                                                   | Esforço |
| -------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| Indicador "imagem desatualizada" em containers/serviços/stacks | `IMAGE_UP_TO_DATE_INDICATOR`                                | O cálculo já existe em [`api/docker/images/status.go`](api/docker/images/status.go), mas nenhuma rota HTTP o expõe. Falta a rota e liberar `ImageStatus.tsx` / `TableColumnHeaderImageUpToDate.tsx` (checam `isBE`) | 🟢      |
| Webhook de container (recriar com imagem nova)                 | `CONTAINER_WEBHOOK`                                         | Webhooks só aceitam serviços Swarm (`api/http/handler/webhooks/webhook_create.go`). A recriação já existe em `api/http/handler/docker/containers/recreate.go`                                                       | 🟡      |
| Webhook de stack sem Git                                       | `STACK_WEBHOOK`                                             | Só stacks Git têm webhook (`api/http/handler/stacks/webhook_invoke.go`)                                                                                                                                             | 🟡      |
| Banner na tela de login                                        | `CUSTOM_LOGIN_BANNER`                                       | Formulário pronto; falta o campo nas configurações do backend e exibir no login                                                                                                                                     | 🟢      |
| Ocultar login interno quando há OAuth/LDAP                     | `HIDE_INTERNAL_AUTH`, `HIDE_INTERNAL_AUTHENTICATION_PROMPT` | Falta a configuração no backend e a lógica na tela de login                                                                                                                                                         | 🟢      |
| Ocultar "Docker Hub (anônimo)"                                 | `HIDE_DOCKER_HUB_ANONYMOUS`                                 | Botão pronto; falta o endpoint de configurações                                                                                                                                                                     | 🟢      |
| Backup automático em S3 e restauração do S3                    | `S3_BACKUP_SETTING`, `S3_RESTORE`                           | Formulários prontos. O backup em arquivo já existe em `api/http/handler/backup`; falta agendar e enviar ao S3                                                                                                       | 🟡      |
| Navegar no conteúdo de registries (repositórios/tags)          | `REGISTRY_MANAGEMENT`                                       | Falta o proxy da API v2 de registry no backend                                                                                                                                                                      | 🟡      |
| Janela de mudanças do GitOps                                   | `HIDE_AUTO_UPDATE_WINDOW`                                   | Falta guardar a janela e respeitá-la no agendador de deploy                                                                                                                                                         | 🟡      |
| Logs de atividade e de autenticação                            | `ACTIVITY_AUDIT`                                            | Telas existem (hoje com dados de exemplo em `useActivityLogs.ts`); falta registrar e guardar os eventos                                                                                                             | 🟡      |

### Autenticação e permissões

| Recurso                                                                                                | FeatureId            | Esforço |
| ------------------------------------------------------------------------------------------------------ | -------------------- | ------- |
| Presets OpenLDAP e Microsoft Active Directory, grupos de admin, teste de login, exibir usuários/grupos | `EXTERNAL_AUTH_LDAP` | 🟡      |
| Papéis RBAC (Operator, Helpdesk, Read-only...) e seletor de papel no controle de acesso                | `RBAC_ROLES`         | 🔴      |
| Líderes de equipe / associação a equipes                                                               | `TEAM_MEMBERSHIP`    | 🟡      |

### Kubernetes (só fazem sentido depois do item 1)

`K8S_ANNOTATIONS`, `K8S_EDIT_YAML`, `K8S_ROLLING_RESTART`, `K8S_RESOURCE_POOL_LB_QUOTA`,
`K8S_RESOURCE_POOL_STORAGE_QUOTA`, `K8S_CREATE_FROM_KUBECONFIG`, `K8S_SETUP_DEFAULT`,
`K8S_ADM_ONLY_USR_INGRESS_DEPLY`, `K8S_ADM_ONLY_SECRETS`, `ENFORCE_DEPLOYMENT_OPTIONS`,
`K8S_REQUIRE_NOTE_ON_APPLICATIONS`, `POD_SECURITY_POLICY_CONSTRAINT`, `CA_FILE`.

### Outros recursos pagos checados por `isBE`

Atualizações escalonadas de stacks Edge, criação automática de ambientes Edge, agendamento de
atualização/rollback de agentes Edge, autocompletar branches/arquivos do Git, variáveis em templates
personalizados, credenciais compartilhadas e recursos experimentais.

---

## 3. Tradução

- [x] Interface Docker, Swarm, configurações, autenticação e Edge em pt-BR (~2.800 textos).
- [ ] Revisar a interface navegando em português e adicionar o que faltar. Liste os textos pendentes com
      `node scripts/i18n/extract-strings.mjs`.
- [ ] Frases montadas a partir de pedaços (número no meio da frase etc.) precisam de `t()` com interpolação;
      o tradutor automático só casa textos inteiros.
- [ ] Mensagens de erro do backend chegam em inglês (só o nome do produto é trocado).
- [ ] Telas de Kubernetes e Azure (ver item 1).
- [ ] Novos idiomas: pasta em `translations/` e entrada em `supportedLanguages` (`app/i18n.ts`).

---

## 4. Identidade própria

- [ ] **Templates de aplicativos**: o padrão ainda é `github.com/portainer/templates`. Criar um repositório
      de templates do Cais (com textos em pt-BR) e trocar o padrão no backend.
- [ ] **Agente**: ambientes remotos usam a imagem `portainer/agent`. Funciona, mas o nome aparece nos comandos
      de instalação. Opção: publicar um fork do agente.
- [ ] **Avisos de nova versão**: o aviso do Portainer foi removido. Fazer um que consulte as releases do
      `MatheuzLima/cais`.
- [ ] **Documentação**: os links de ajuda apontam para o repositório. Criar páginas de ajuda próprias (wiki ou site).
- [ ] O binário e caminhos internos ainda se chamam `portainer` (`/portainer`, módulo Go
      `github.com/portainer/portainer`). Renomear só vale a pena se a sincronização com o upstream for abandonada.

---

## 5. Infraestrutura e qualidade

- [x] CI em PRs: typecheck, lint e testes do frontend; vet e testes do backend; build da imagem.
- [x] Publicação no Docker Hub por tag (`v*`), amd64 + arm64.
- [ ] Configurar os secrets `DOCKERHUB_USERNAME` e `DOCKERHUB_TOKEN` no GitHub para a publicação automática.
- [ ] Teste instável: `app/react/kubernetes/helm/HelmApplicationView/HelmRevisionItem.test.tsx` às vezes falha
      quando a suíte inteira roda sob carga (passa isolado).
- [ ] Testes ponta a ponta (Playwright) dos fluxos principais: login, criar container, stack, troca de idioma.
- [ ] Dependabot ou Renovate para dependências, com cuidado para não divergir demais do upstream.

---

## 6. Sincronização com o Portainer

O Portainer continua evoluindo. Para trazer correções de segurança e recursos novos:

```bash
git fetch upstream
git merge upstream/develop
```

Para os merges continuarem viáveis, prefira mudanças **centralizadas** (componentes compartilhados, flags,
dicionário de tradução) a edições espalhadas em centenas de arquivos. Depois de cada merge, rode a CI,
`node scripts/i18n/extract-strings.mjs` para achar textos novos e revise se apareceu alguma isca do Business Edition.

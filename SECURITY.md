# Política de segurança

## Versões com suporte

Apenas a versão mais recente do Cais (tag `latest` no Docker Hub e branch `main`) recebe correções de segurança.

## Como relatar uma vulnerabilidade

**Não abra issues públicas para falhas de segurança.**

Use o botão **Report a vulnerability** na aba **Security** deste repositório
(https://github.com/MatheuzLima/cais/security/advisories/new). Isso cria um relatório privado, visível só para o mantenedor.

Inclua, se possível:

- versão do Cais e plataforma (Docker, Swarm ou Podman);
- passos para reproduzir;
- impacto esperado.

O retorno inicial acontece em até 7 dias. Depois da correção, a falha é publicada com crédito a quem relatou, se a pessoa quiser.

## Falhas herdadas do Portainer

O Cais é baseado no Portainer CE. Se a falha também existe no projeto original, relate ao Portainer pelo processo
deles (https://github.com/portainer/portainer/security) e avise aqui para trazermos a correção.

## Recomendações de instalação

O Cais tem acesso ao socket do Docker, o que equivale a acesso root no servidor. Ao instalar:

- Publique a interface somente por um proxy com HTTPS (Caddy, Traefik, Nginx) e mantenha a porta 9000 presa a
  `127.0.0.1`, como no exemplo do [README](README.md#run).
- Crie o usuário administrador logo após subir o container. Por segurança, a configuração inicial expira em poucos minutos.
- Use senhas fortes e, se possível, uma camada extra de acesso, como o Cloudflare Access ou uma VPN.
- Mantenha a imagem atualizada.

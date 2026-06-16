# Database Architecture

PostgreSQL acessado por Prisma.

## Persistencia Central

- Identidades: `User`, `Agent`, `Admin`.
- Operacao: `Ping`.
- Registo financeiro interno: `Transaction`.
- Reputacao: `AgentRating`.

## Riscos

- Estados e tipos como strings livres.
- Sem indices geoespaciais.
- Sem jobs de expiracao.


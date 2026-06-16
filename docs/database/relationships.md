# Relationships

- `User` 1:N `Ping`.
- `Agent` 1:N `Ping`.
- `Ping` 1:N `Transaction` no schema, mas `Transaction.pingId` e unique, tornando relacao pratica 1:0/1.
- `User` 1:N `Transaction`.
- `Agent` 1:N `Transaction`.
- `Ping` 1:N `AgentRating`.
- `User` 1:N `AgentRating`.
- `Agent` 1:N `AgentRating`.

## Regras

- `Ping.userId` obrigatorio.
- `Ping.agentId` opcional no schema, mas requerido na criacao pela API.
- `Transaction.agentId` obrigatorio.


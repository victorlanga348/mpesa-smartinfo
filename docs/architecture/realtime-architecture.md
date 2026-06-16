# Realtime Architecture

Socket.io roda no mesmo HTTP server do Express.

## Salas

- `map`
- `admin`
- `agent:{agentId}`
- `client:{clientId}`
- `joinRoom` arbitraria

## Eventos

Agentes, pings, reservas, metricas e agentes temporarios.

## Risco

Nao ha autenticacao/autorizacao de salas Socket.io.


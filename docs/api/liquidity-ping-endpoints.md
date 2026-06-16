# Liquidity Ping Endpoints

## Criacao

`POST /api/ping`

Body: `{ latitude, longitude, agentId, amount, operationType }`.

## Consulta

- `GET /api/ping/active`: pings activos.
- `GET /api/ping/:pingId`: detalhe.
- `GET /api/ping/agent/pending`: pendentes do agente autenticado.
- `GET /api/ping/agent/queue`: fila do agente autenticado.

## Mutacoes

- `PUT /api/ping/:pingId/accept`
- `PUT /api/ping/:pingId/reject`
- `PUT /api/ping/:pingId/complete`
- `PUT /api/ping/:pingId/cancel`
- `PUT /api/ping/:pingId/arrive`
- `PUT /api/ping/:pingId/status`

Ver regras detalhadas em `../specs/liquidity-pings/ping-lifecycle.md`.


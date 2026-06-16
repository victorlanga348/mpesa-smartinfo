# ping:arrived

Emitido quando cliente marca chegada ou agente define status `ARRIVED`.

## Origem

- `PUT /api/ping/:id/arrive`
- `PUT /api/ping/:id/status`

## Destino

`client:{userId}` e `agent:{agentId}`.


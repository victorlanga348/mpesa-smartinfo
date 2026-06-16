# reservation:expired

Emitido quando endpoint generico muda ping para `EXPIRED` ou `REJECTED`.

## Origem

`PUT /api/ping/:id/status`.

## Destino

`client:{userId}` e `agent:{agentId}`.

## Observacao

Nao ha expiracao automatica.


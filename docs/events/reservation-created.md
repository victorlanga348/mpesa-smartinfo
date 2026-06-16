# reservation:created

Emitido quando endpoint generico muda ping para `WAITING_LIST`.

## Origem

`PUT /api/ping/:id/status`.

## Destino

`client:{userId}` e `agent:{agentId}`.

## Observacao

Aceitar ping cria token de reserva, mas nao emite `reservation:created`.


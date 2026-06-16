# Token de Reserva

## Objectivo
Identificar uma reserva/atendimento aceite.

## Contexto
Campo `reservationToken` em `Ping`.

## Entidades Envolvidas
`Ping`.

## Regras de Negocio
- Token real e numero aleatorio de 6 digitos.
- Gerado em accept e em transicao para `WAITING_LIST`.
- Fallback frontend usa `MPESA-*`.

## Fluxo Principal
Backend gera token e devolve no ping.

## Fluxos Alternativos
Sem token real, UI usa fallback.

## Eventos Disparados
Incluido nos payloads de ping/reserva.

## Endpoints Relacionados
`PUT /api/ping/:id/accept`, `GET /api/ping/:id`.

## Dependências
`Math.random`, `PingService`.

## Estados Possíveis
Com token, sem token.

## Casos de Borda
Nao ha garantia criptografica forte; e token aleatorio simples.

## Observações
Token nao tem tabela propria.


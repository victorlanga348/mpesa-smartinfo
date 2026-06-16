# Expiracao de Reserva

## Objectivo
Encerrar reserva apos tempo limite.

## Contexto
Parcial no sistema actual.

## Entidades Envolvidas
`Ping.reservationExpires`, `Reservation`.

## Regras de Negocio
- Backend guarda data de expiracao.
- Backend so emite `reservation:expired` quando status e alterado para `EXPIRED` ou `REJECTED` pelo endpoint generico.
- Nao ha scheduler para expirar automaticamente.
- Frontend expira visualmente pelo timer.

## Fluxo Principal
Nao ha fluxo backend automatico.

## Fluxos Alternativos
Agente pode setar `EXPIRED` via endpoint generico de status.

## Eventos Disparados
`reservation:expired`, `ping:expired` se status for alterado.

## Endpoints Relacionados
`PUT /api/ping/:id/status`.

## Dependências
`ReservationTimer`, `PingController.updatePingStatus`.

## Estados Possíveis
Activa, expirada local, `EXPIRED` backend.

## Casos de Borda
Frontend pode mostrar expirado enquanto backend permanece `ACCEPTED` ou `WAITING_LIST`.

## Observações
Parcial.


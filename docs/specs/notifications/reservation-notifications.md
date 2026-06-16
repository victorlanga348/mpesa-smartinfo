# Notificacoes de Reserva

## Objectivo
Avisar criacao/expiracao de reserva.

## Contexto
Eventos emitidos apenas no endpoint generico de status.

## Entidades Envolvidas
`Ping`.

## Regras de Negocio
- `WAITING_LIST` emite `reservation:created`.
- `EXPIRED` ou `REJECTED` emitem `reservation:expired`.
- Accept direto emite `ping:accepted`, mas nao `reservation:created`.

## Fluxo Principal
Agente altera status para `WAITING_LIST`.

## Fluxos Alternativos
Aceite direto cria token, mas evento de reserva nao e disparado.

## Eventos Disparados
`reservation:created`, `reservation:expired`.

## Endpoints Relacionados
`PUT /api/ping/:id/status`, `PUT /api/ping/:id/accept`.

## Dependências
`PingController.updatePingStatus`.

## Estados Possíveis
Criada, expirada.

## Casos de Borda
Inconsistencia entre token criado no accept e evento de reserva criado so no status generico.

## Observações
Parcial.


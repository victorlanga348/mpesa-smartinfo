# Chegada do Cliente

## Objectivo
Permitir ao cliente avisar que chegou ao agente.

## Contexto
Endpoint `PUT /api/ping/:pingId/arrive`.

## Entidades Envolvidas
`Ping`, `Transaction`.

## Regras de Negocio
- Requer role `user`.
- Apenas cliente dono pode marcar chegada.
- Permitido apenas em `ACCEPTED` ou `WAITING_LIST`.
- Status vira `ARRIVED`.
- Marca `arrivedAt`.
- Actualiza transacao.

## Fluxo Principal
Cliente clica "Marcar cheguei"; agente recebe evento e UI remove da fila principal.

## Fluxos Alternativos
Status errado retorna erro.

## Eventos Disparados
`ping:arrived`, `admin:metrics-updated`.

## Endpoints Relacionados
`PUT /api/ping/:pingId/arrive`.

## Dependências
`PingService.markArrived`.

## Estados Possíveis
De `ACCEPTED` ou `WAITING_LIST` para `ARRIVED`.

## Casos de Borda
Dashboard do agente remove `ARRIVED` da lista por evento, embora tenha UI que contemplava chegada em `queueList`.

## Observações
Chegada nao conclui atendimento; conclusao e acao do agente.


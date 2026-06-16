# Estados do Ping

## Objectivo
Listar estados reconhecidos pelo codigo.

## Contexto
Enum TypeScript `PingStatus`.

## Entidades Envolvidas
`Ping`, `Transaction`.

## Regras de Negocio
- Estados validos na API de status: `PENDING`, `ACCEPTED`, `WAITING_LIST`, `IN_SERVICE`, `ON_MY_WAY`, `ARRIVED`, `CANCELLED`, `REJECTED`, `EXPIRED`, `COMPLETED`.
- Pings activos: `PENDING`, `ACCEPTED`, `WAITING_LIST`, `IN_SERVICE`, `ON_MY_WAY`.
- Fila do agente: `ACCEPTED`, `WAITING_LIST`.
- Pendentes do agente: `PENDING`.

## Fluxo Principal
Status muda por endpoints de accept/reject/cancel/arrive/complete/status.

## Fluxos Alternativos
Status invalido retorna 400.

## Eventos Disparados
Cada status mapeia para evento `ping:*` quando atualizado por endpoint generico.

## Endpoints Relacionados
`PUT /api/ping/:pingId/status`.

## Dependências
`PingStatus`, `PingTimingService`.

## Estados Possíveis
Os dez estados listados.

## Casos de Borda
Banco nao impede status fora da lista se alterado externamente.

## Observações
Frontend reduz alguns estados para labels locais.


# Metricas Operacionais

## Objectivo
Medir actividade basica do sistema.

## Contexto
Backend calcula metricas em `AdminService.getStats`.

## Entidades Envolvidas
`User`, `Agent`, `Ping`, `Transaction`.

## Regras de Negocio
- `totalUsers`: count de User.
- `totalAgents`: count de Agent.
- `activeAgents`: agentes `ONLINE` ou `ON_MY_WAY`.
- `totalPings`: count total.
- `pendingPings`: pings `PENDING`.
- `completedPings`: pings `COMPLETED`.
- `successfulRequests`: igual a `completedPings`.
- `failedRequests`: `CANCELLED`, `REJECTED`, `EXPIRED`.
- `requestsByType`: agrupamento de `Transaction.operationType`; defaults withdrawal/deposit/payment/info = 0.

## Fluxo Principal
Admin dashboard carrega metricas e renderiza.

## Fluxos Alternativos
Frontend usa localStorage/mocks se API falhar.

## Eventos Disparados
`admin:metrics-updated`.

## Endpoints Relacionados
`GET /api/admin/stats`.

## Dependências
`TransactionService.getRequestsByType`.

## Estados Possíveis
Com dados, sem dados suficientes.

## Casos de Borda
Operacoes tipo `transfer` podem existir em transacoes mas nao estao nos defaults do frontend.

## Observações
`avgResponseTime` nao e calculado pelo backend actual.


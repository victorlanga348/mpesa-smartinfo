# Rejeitar Ping

## Objectivo
Permitir que agente negue pedido pendente.

## Contexto
Endpoint `PUT /api/ping/:pingId/reject`.

## Entidades Envolvidas
`Ping`, `Transaction`.

## Regras de Negocio
- Requer role `agent`.
- Apenas agente associado pode rejeitar.
- Apenas `PENDING` pode ser rejeitado.
- Status vira `REJECTED`.
- Marca `rejectedAt`.
- Actualiza transacao.

## Fluxo Principal
Agente rejeita; cliente recebe aviso.

## Fluxos Alternativos
Agente errado ou status diferente retorna erro.

## Eventos Disparados
`ping:rejected`, `admin:metrics-updated`.

## Endpoints Relacionados
`PUT /api/ping/:pingId/reject`.

## Dependências
`PingService.rejectPing`.

## Estados Possíveis
De `PENDING` para `REJECTED`.

## Casos de Borda
Se ping foi criado sem `agentId`, rejeicao falha para qualquer agente.

## Observações
No fluxo principal, pings sao criados com agentId.


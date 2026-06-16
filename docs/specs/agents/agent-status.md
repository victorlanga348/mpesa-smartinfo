# Estado do Agente

## Objectivo
Indicar disponibilidade operacional do agente.

## Contexto
Status e string no banco, controlada por enum TypeScript.

## Entidades Envolvidas
`Agent`.

## Regras de Negocio
- Status valido: `ONLINE`, `OFFLINE`, `ON_MY_WAY`.
- API rejeita status fora do enum.
- Frontend traduz `online`, `offline`, `busy` para valores backend.
- Alterar status emite eventos para mapa, admin e lista global.
- Ao mudar ping para `IN_SERVICE`, backend muda agente para `ON_MY_WAY`.
- Ao concluir ping, backend muda agente para `ONLINE`.

## Fluxo Principal
Agente no dashboard escolhe estado; API actualiza e Socket.io propaga.

## Fluxos Alternativos
Socket `agent:status-update` tambem pode actualizar status sem passar por REST.

## Eventos Disparados
`agent:online`, `agent:offline`, `agent:status-updated`, `admin:metrics-updated`, `agents:list-updated`.

## Endpoints Relacionados
`PUT /api/agent/status`, `PUT /api/ping/:pingId/status`, `PUT /api/ping/:pingId/complete`.

## Dependências
`AgentController.updateStatus`, `PingService.updatePingStatus`.

## Estados Possíveis
`ONLINE`, `OFFLINE`, `ON_MY_WAY`.

## Casos de Borda
O label `Com cliente` no frontend corresponde a `ON_MY_WAY`, nao necessariamente deslocacao real.

## Observações
Sem enum no banco, dados invalidos poderiam existir se inseridos fora da API.


# Notificacoes Admin

## Objectivo
Recarregar metricas administrativas em tempo real.

## Contexto
Evento `admin:metrics-updated`.

## Entidades Envolvidas
Metricas admin.

## Regras de Negocio
- Emitido em alteracoes de agente, ping e rating.
- Dashboard admin escuta e chama novamente `getMetrics`.

## Fluxo Principal
Mutacao ocorre; admin recebe evento; frontend recarrega metricas.

## Fluxos Alternativos
Se socket cair, metricas nao actualizam ate reload.

## Eventos Disparados
`admin:metrics-updated`.

## Endpoints Relacionados
`GET /api/admin/stats`.

## Dependências
Socket.io, adminService.

## Estados Possíveis
Online/reconectando/offline.

## Casos de Borda
Evento nao carrega payload de metricas, apenas sinaliza refresh.

## Observações
Implementado.


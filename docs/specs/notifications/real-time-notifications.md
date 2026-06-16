# Notificacoes em Tempo Real

## Objectivo
Propagar mudancas operacionais sem refresh manual.

## Contexto
Socket.io no backend e frontend.

## Entidades Envolvidas
`Agent`, `Ping`, `AdminMetrics`.

## Regras de Negocio
- Clientes entram em salas por mapa, agente, cliente ou admin.
- Eventos de agente actualizam mapa/admin/lista.
- Eventos de ping actualizam cliente/agente/admin.
- Admin recarrega metricas ao receber `admin:metrics-updated`.

## Fluxo Principal
Mutacao REST ou evento socket actualiza dados e emite evento para salas.

## Fluxos Alternativos
Frontend tambem faz polling de pings no dashboard do agente.

## Eventos Disparados
Todos em `events/`.

## Endpoints Relacionados
Mutacoes de agentes, pings e ratings.

## Dependências
Socket.io server/client.

## Estados Possíveis
Socket online, reconectando, offline.

## Casos de Borda
Nao ha autenticacao nas salas Socket.io.

## Observações
Tempo real implementado, mas com pouca seguranca de canal.


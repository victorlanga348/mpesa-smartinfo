# Dashboard do Agente

## Objectivo
Permitir que o agente controle status, localizacao, referencia e pedidos.

## Contexto
Implementado em `/app/agent-dashboard`.

## Entidades Envolvidas
`Agent`, `Ping`, `Request`, browser geolocation.

## Regras de Negocio
- Apenas utilizador local com `role: agent` entra; caso contrario redirecciona.
- Dashboard carrega agentes e encontra agente por `user.id`.
- Carrega pings activos e filtra por `agentId`.
- Pendentes podem ser aceites ou rejeitados.
- Aceites/lista de espera podem ser finalizados/removidos.
- Pedidos `arrived`, `cancelled`, `rejected`, `completed`, `expired` sao removidos da lista local por evento.
- Refresca pings activos a cada 5 segundos.

## Fluxo Principal
1. Agente entra.
2. Entra na sala `agent:{id}`.
3. Actualiza status/localizacao.
4. Recebe `ping:created`.
5. Aceita, rejeita ou conclui pedido.

## Fluxos Alternativos
Se perfil nao for encontrado na listagem, mostra erro.

## Eventos Disparados
Emite `join:agent`, `agent:location-update`, `agent:status-update`; recebe eventos `ping:*`.

## Endpoints Relacionados
`GET /api/ping/active`, `PUT /api/ping/:id/accept`, `PUT /api/ping/:id/reject`, `PUT /api/ping/:id/complete`, `PUT /api/agent/status`, `PUT /api/agent/location`, `PUT /api/agent/reference`.

## Dependências
`agentService`, `useSocket`, `useGeolocation`, `authService`.

## Estados Possíveis
Carregando, agente nao encontrado, online/offline/busy, pedidos pendentes, fila.

## Casos de Borda
Botao finalizar chama `complete`; nao ha botao dedicado para `IN_SERVICE`.

## Observações
Dashboard declara que nao mostra saldo nem liquidez total.


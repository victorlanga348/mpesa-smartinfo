# Experiencia do Cliente no Mapa

## Objectivo
Encontrar agentes proximos e iniciar pedido.

## Contexto
Implementada em `/app/map`, `MapComponent`, `useLiveAgents` e `AgentBottomSheet`.

## Entidades Envolvidas
`Agent`, `Ping`, `Reservation`, `LocalRequest`.

## Regras de Negocio
- Agentes sao carregados de `/api/agent`; se falhar, usa `MOCK_AGENTS`.
- Agentes sem latitude/longitude sao filtrados.
- Com localizacao do cliente, agentes sao ordenados por status online primeiro e distancia depois.
- Status backend `ONLINE` vira frontend `online`; `ON_MY_WAY` vira `busy`; demais viram `offline`.
- Marcadores: verde online, amarelo busy, cinzento offline.

## Fluxo Principal
1. Cliente abre mapa.
2. Mapa solicita localizacao.
3. Lista agentes reais ou mockados.
4. Cliente selecciona agente.
5. Bottom sheet permite escolher operacao e valor.

## Fluxos Alternativos
Sem API, frontend continua com mocks.

## Eventos Disparados
Cliente entra em `join:map`; recebe `agent:*`, `agents:list-updated`, `temporary-agent:available`.

## Endpoints Relacionados
`GET /api/agent`, `POST /api/ping`.

## Dependências
Leaflet, OpenStreetMap, `useLiveAgents`, `agentService`.

## Estados Possíveis
Carregando, com agentes, sem localizacao, socket online/reconectando/offline.

## Casos de Borda
Mocks podem mostrar saldo, mas o backend nao possui saldo de agente.

## Observações
O mapa e a principal experiencia publica do cliente.


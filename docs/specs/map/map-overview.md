# Visao Geral do Mapa

## Objectivo
Mostrar agentes M-Pesa e permitir iniciar atendimento.

## Contexto
Implementado com Leaflet e tiles OpenStreetMap.

## Entidades Envolvidas
`Agent`, coordenadas do cliente, `Ping`.

## Regras de Negocio
- Centro inicial vem de `MAPUTO_CENTER`.
- Agentes sao obtidos via API ou mocks.
- Agentes sem coordenadas sao omitidos.
- Cliente e mostrado com marcador azul quando geolocalizacao funciona.
- Agentes sao actualizados por eventos Socket.io.

## Fluxo Principal
Mapa carrega, pede localizacao, lista agentes, permite seleccionar agente.

## Fluxos Alternativos
Sem permissao de localizacao, mostra mensagem e campo de pesquisa manual sem geocoding.

## Eventos Disparados
`join:map`; recebe `agent:online`, `agent:offline`, `agent:location-updated`, `agent:status-updated`, `agents:list-updated`, `temporary-agent:available`.

## Endpoints Relacionados
`GET /api/agent`.

## Dependências
Leaflet, OpenStreetMap, `useLiveAgents`, `useGeolocation`.

## Estados Possíveis
Loading, socket online/reconectando/offline, geolocalizado, permissao negada.

## Casos de Borda
O fallback mock pode mostrar agentes que nao existem na base de dados.

## Observações
Mapa nao calcula rota; calcula distancia Haversine para ordenacao.


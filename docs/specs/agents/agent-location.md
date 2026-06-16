# Localizacao do Agente

## Objectivo
Actualizar e mostrar a posicao do agente no mapa.

## Contexto
Dashboard do agente usa geolocalizacao quando o servico esta activo.

## Entidades Envolvidas
`Agent`, browser geolocation, mapa.

## Regras de Negocio
- `latitude` e `longitude` sao obrigatorias.
- Dashboard envia localizacao por REST e tambem por Socket.io.
- Hook de geolocalizacao envia quando move pelo menos 20m ou passa 7s.
- Actualizacao emite eventos para mapa/admin/lista.

## Fluxo Principal
1. Agente fica em servico.
2. Browser obtem coordenadas.
3. Frontend chama `PUT /api/agent/location`.
4. Frontend emite `agent:location-update`.
5. Mapa recebe `agent:location-updated`.

## Fluxos Alternativos
Socket `agentLocationUpdate` legado tambem actualiza localizacao.

## Eventos Disparados
`agent:location-update`, `agentLocationUpdate`, `agent:location-updated`, `admin:metrics-updated`, `agents:list-updated`.

## Endpoints Relacionados
`PUT /api/agent/location`.

## Dependências
`useGeolocation`, `AgentService.updateLocation`.

## Estados Possíveis
Localizacao activa, por definir, erro/permissao negada.

## Casos de Borda
REST e Socket podem duplicar actualizacao da mesma posicao.

## Observações
Agentes sem coordenadas nao aparecem no mapa frontend.


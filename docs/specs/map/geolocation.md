# Geolocalizacao

## Objectivo
Obter coordenadas do browser para cliente e agente.

## Contexto
Hook `useGeolocation`.

## Entidades Envolvidas
Browser geolocation, `Agent`, `User`, `Ping`.

## Regras de Negocio
- Usa `enableHighAccuracy`.
- Timeout 12s e cache maxima 8s.
- Watch activo por defeito.
- Callback `onLocation` executa quando movimenta pelo menos 20m ou passa intervalo minimo de 7s.

## Fluxo Principal
Hook pede posicao actual, inicia watch e devolve coords/erro.

## Fluxos Alternativos
Permissao negada marca `permissionDenied`.

## Eventos Disparados
Para agentes, dashboard pode emitir `agent:location-update`.

## Endpoints Relacionados
`PUT /api/agent/location`, `PUT /api/user/location`.

## Dependências
Navigator Geolocation API.

## Estados Possíveis
Coords disponiveis, erro, permissao negada.

## Casos de Borda
Sem suporte de geolocation, retorna erro textual.

## Observações
O hook e reutilizado por cliente e agente.


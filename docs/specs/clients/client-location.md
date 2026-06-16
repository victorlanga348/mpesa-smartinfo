# Localizacao do Cliente

## Objectivo
Guardar ou usar a localizacao do cliente para mapa e pings.

## Contexto
Backend permite actualizar `User.latitude` e `User.longitude`; frontend guarda tambem `smartinfo_client_location`.

## Entidades Envolvidas
`User`, `Ping`, browser geolocation.

## Regras de Negocio
- `latitude` e `longitude` sao obrigatorias para actualizar no backend.
- Valores sao convertidos com `Number`.
- Mapa usa geolocalizacao do browser com alta precisao.
- Frontend limita chamadas de geolocalizacao por 20m ou 7s no hook.
- Ao criar ping, frontend usa localizacao guardada ou coordenadas do agente como fallback.

## Fluxo Principal
1. Browser solicita localizacao.
2. Mapa grava coordenadas em localStorage.
3. Ping usa coordenadas do cliente.

## Fluxos Alternativos
Se permissao falhar, UI mostra campo de pesquisa manual, mas a pesquisa nao altera coordenadas no codigo actual.

## Eventos Disparados
Nenhum evento de cliente para localizacao.

## Endpoints Relacionados
`PUT /api/user/location`, `POST /api/ping`.

## Dependências
`useGeolocation`, `UserService.updateLocation`.

## Estados Possíveis
Localizado, permissao negada, erro, sem suporte de geolocation.

## Casos de Borda
Pesquisa manual e visual/local, sem geocoding implementado.

## Observações
Localizacao do cliente e usada mais no frontend do que persistida.


# Score de Confianca

## Objectivo
Mostrar reputacao do agente.

## Contexto
Nao existe score separado; frontend usa media de ratings.

## Entidades Envolvidas
`AgentRating`, `Agent`.

## Regras de Negocio
- Backend calcula `AVG(rating)` e `COUNT(*)` por agente.
- Listagem de agentes inclui `ratingAverage` e `ratingCount`.
- Frontend mostra badges: excelencia se media >= 4.8 e count > 0; muito bem avaliado se media >= 4.5 e count > 0.

## Fluxo Principal
Ratings acumulados aparecem na listagem/mapa/bottom sheet.

## Fluxos Alternativos
Sem ratings, frontend mostra `Sem dados` ou rating 0.

## Eventos Disparados
`agent:rating-updated`, `agents:list-updated`.

## Endpoints Relacionados
`GET /api/agent`, `POST /api/ping/:id/rating`.

## Dependências
`RatingService.getAverageRatingsByAgent`.

## Estados Possíveis
Sem dados, media calculada.

## Casos de Borda
Nao ha ponderacao por volume alem do count exibido.

## Observações
"Trust score" como entidade propria nao existe.


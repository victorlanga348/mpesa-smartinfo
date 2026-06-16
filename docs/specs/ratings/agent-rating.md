# Avaliacao do Agente

## Objectivo
Permitir que cliente avalie atendimento concluido.

## Contexto
Endpoint `POST /api/ping/:pingId/rating`.

## Entidades Envolvidas
`AgentRating`, `Ping`, `User`, `Agent`.

## Regras de Negocio
- Requer role `user`.
- Rating deve ser inteiro entre 1 e 5.
- Ping deve existir.
- Apenas cliente dono pode avaliar.
- Ping deve estar `COMPLETED`.
- Ping precisa ter `agentId`.
- Cada par `pingId,userId` so pode avaliar uma vez.
- Comentario e opcional e trimado.

## Fluxo Principal
Cliente recebe atendimento concluido, abre avaliacao, escolhe estrelas e envia.

## Fluxos Alternativos
Duplicado retorna erro e frontend marca como ja avaliado se mensagem indicar.

## Eventos Disparados
`agent:rating-updated`, `admin:metrics-updated`, `agents:list-updated`.

## Endpoints Relacionados
`POST /api/ping/:pingId/rating`.

## Dependências
`RatingService`, raw SQL para insert/check.

## Estados Possíveis
Nao avaliado, avaliado, erro.

## Casos de Borda
Service usa SQL bruto em vez de Prisma client para rating.

## Observações
Implementado no backend.


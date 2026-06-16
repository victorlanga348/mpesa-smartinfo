# Estou a Caminho

## Objectivo
Representar deslocacao/ocupacao no fluxo.

## Contexto
Parcial. Existem estado backend `ON_MY_WAY`, status de agente `ON_MY_WAY` e textos na UI, mas nao ha endpoint especifico do cliente para "estou a caminho".

## Entidades Envolvidas
`Ping`, `Agent`, `LocalRequest`.

## Regras de Negocio
- `ON_MY_WAY` e estado valido de ping.
- `AgentStatus.ON_MY_WAY` e usado como ocupado/busy.
- Frontend tem estado local `customer_on_way`, mas nao e persistido.
- Endpoint generico de status poderia definir `ON_MY_WAY`, mas exige role `agent`.

## Fluxo Principal
Nao ha fluxo principal completo implementado.

## Fluxos Alternativos
Agente pode mudar ping para `ON_MY_WAY` via `PUT /api/ping/:id/status`.

## Eventos Disparados
`ping:on-the-way` se status for actualizado pelo endpoint generico.

## Endpoints Relacionados
`PUT /api/ping/:pingId/status`.

## Dependências
`PingStatus.ON_MY_WAY`, UI local.

## Estados Possíveis
`ON_MY_WAY`, `customer_on_way` local.

## Casos de Borda
Texto do produto menciona "Estou a caminho", mas comportamento real principal e "Marcar cheguei".

## Observações
Parcial.


# Ciclo de Vida do Ping

## Objectivo
Controlar pedido de atendimento/liquidez entre cliente e agente.

## Contexto
`Ping` e a entidade central do fluxo operacional.

## Entidades Envolvidas
`Ping`, `User`, `Agent`, `Transaction`, `AgentRating`.

## Regras de Negocio
- Criacao exige cliente autenticado.
- Campos obrigatorios: latitude, longitude, agentId, amount, operationType.
- Novo ping inicia `PENDING`.
- Criacao pode criar `Transaction` se operacao for financeira.
- Aceitar exige `PENDING`, gera token e expiracao de 10 minutos.
- Rejeitar exige agente associado e `PENDING`.
- Cancelar exige cliente dono e status `PENDING`, `ACCEPTED` ou `WAITING_LIST`.
- Chegada exige cliente dono e status `ACCEPTED` ou `WAITING_LIST`.
- Status generico exige agente associado.
- `WAITING_LIST` gera token/expiracao se ainda nao existia.
- `IN_SERVICE` muda agente para `ON_MY_WAY`.
- `COMPLETED` muda agente para `ONLINE`.
- Timestamps sao marcados uma vez com `COALESCE`.

## Fluxo Principal
1. Cliente cria ping.
2. Agente recebe `ping:created`.
3. Agente aceita ou rejeita.
4. Cliente acompanha estado.
5. Cliente marca chegada ou cancela.
6. Agente conclui atendimento.
7. Cliente pode avaliar.

## Fluxos Alternativos
- Agente rejeita.
- Cliente cancela.
- Status pode ser actualizado genericamente para varios estados.
- Expiracao existe como estado, mas nao ha job automatico.

## Eventos Disparados
`ping:created`, `ping:accepted`, `ping:rejected`, `ping:cancelled`, `ping:arrived`, `ping:completed`, `ping:on-the-way`, `ping:waiting-list`, `ping:in-service`, `ping:expired`, `reservation:created`, `reservation:expired`, `admin:metrics-updated`.

## Endpoints Relacionados
Todos os endpoints `/api/ping`.

## Dependências
`PingService`, `TransactionService`, `PingTimingService`, Socket.io.

## Estados Possíveis
`PENDING`, `ACCEPTED`, `WAITING_LIST`, `IN_SERVICE`, `ON_MY_WAY`, `ARRIVED`, `CANCELLED`, `REJECTED`, `EXPIRED`, `COMPLETED`.

## Casos de Borda
`ON_MY_WAY` existe no enum, mas nao ha endpoint especifico do cliente para "estou a caminho".

## Observações
Estados sao strings no banco.


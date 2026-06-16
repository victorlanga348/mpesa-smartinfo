# Criar Ping

## Objectivo
Criar pedido de disponibilidade/liquidez.

## Contexto
Endpoint `POST /api/ping`.

## Entidades Envolvidas
`User`, `Agent`, `Ping`, `Transaction`.

## Regras de Negocio
- Requer role `user`.
- `latitude`, `longitude`, `agentId`, `amount`, `operationType` obrigatorios.
- `operationType` e normalizado com trim/lowercase.
- `amount` aceita string com virgula ou numero e deve ser maior que zero.
- Valor e arredondado a 2 casas.
- Status inicial: `PENDING`.

## Fluxo Principal
Cliente autenticado envia pedido; backend cria ping e transacao se aplicavel.

## Fluxos Alternativos
Valor invalido ou campos ausentes retornam 400.

## Eventos Disparados
`ping:created` para `agent:{agentId}` e `admin:metrics-updated`.

## Endpoints Relacionados
`POST /api/ping`.

## Dependências
`PingService.createPing`, `TransactionService.createForPing`.

## Estados Possíveis
`PENDING`.

## Casos de Borda
Operacao `info` cria ping, mas nao cria `Transaction`.

## Observações
Backend nao verifica se agente esta online antes de criar ping.


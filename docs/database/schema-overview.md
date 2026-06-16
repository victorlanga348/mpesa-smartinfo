# Schema Overview

Banco configurado para PostgreSQL via Prisma.

## Modelos

- `User`: cliente.
- `Admin`: administrador.
- `Agent`: agente M-Pesa.
- `Ping`: pedido de atendimento/liquidez.
- `Transaction`: registo financeiro interno de pedido financeiro.
- `AgentRating`: avaliacao de agente apos atendimento.

## Observacoes

- Estados sao `String`, nao enums Prisma.
- `Transaction.amount` usa Decimal(12,2).
- `AgentRating` tem unique composto por `pingId,userId`.


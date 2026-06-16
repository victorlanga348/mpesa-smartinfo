# Tipos de Ping

## Objectivo
Representar a operacao pretendida pelo cliente.

## Contexto
Campo `operationType` em `Ping` e `Transaction`.

## Entidades Envolvidas
`Ping`, `Transaction`.

## Regras de Negocio
- Backend aceita qualquer string nao vazia como `operationType` para ping.
- Apenas `withdrawal`, `deposit`, `payment`, `transfer` criam transacao.
- Frontend principal do mapa oferece `withdrawal` e `deposit`.
- Tipos frontend tambem incluem `payment` e `info`.

## Fluxo Principal
Cliente escolhe tipo; backend normaliza e guarda.

## Fluxos Alternativos
Tipo nao financeiro cria apenas ping.

## Eventos Disparados
Eventos de ping carregam o tipo no payload.

## Endpoints Relacionados
`POST /api/ping`.

## Dependências
`TransactionService.isFinancialOperation`.

## Estados Possíveis
Tipos livres; financeiros conhecidos conforme acima.

## Casos de Borda
Nao ha enum/constraint para tipos.

## Observações
Documentar tipos como abertos no estado actual.


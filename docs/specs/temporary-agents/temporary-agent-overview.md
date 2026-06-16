# Agentes Temporarios

## Objectivo
Representar reforco temporario de cobertura.

## Contexto
Existe apenas como eventos Socket.io repassados.

## Entidades Envolvidas
Payload livre de Socket.io.

## Regras de Negocio
- `temporary-agent:requested` recebido pelo servidor e emitido para `admin` e `map`.
- `temporary-agent:accepted` emitido para `admin` e `map`.
- `temporary-agent:available` emitido para `map` e `admin`.
- Nao ha validacao, persistencia, endpoint ou schema.

## Fluxo Principal
Cliente/socket envia evento; servidor repassa para salas.

## Fluxos Alternativos
Payload vazio ou invalido nao e bloqueado.

## Eventos Disparados
`temporary-agent:requested`, `temporary-agent:accepted`, `temporary-agent:available`.

## Endpoints Relacionados
Nenhum.

## Dependências
`pingHandler.ts`.

## Estados Possíveis
Requested, accepted, available, apenas por evento.

## Casos de Borda
Ao recarregar a pagina, informacao temporaria desaparece.

## Observações
Parcial/simulado.


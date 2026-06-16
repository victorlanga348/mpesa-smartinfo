# Solicitar Agente Temporario

## Objectivo
Sinalizar necessidade de reforco.

## Contexto
Evento Socket.io sem origem UI clara encontrada.

## Entidades Envolvidas
Payload livre.

## Regras de Negocio
Servidor repassa payload para `admin` e `map`.

## Fluxo Principal
Emitir `temporary-agent:requested`.

## Fluxos Alternativos
Nenhum persistido.

## Eventos Disparados
`temporary-agent:requested`.

## Endpoints Relacionados
Nenhum.

## Dependências
Socket.io.

## Estados Possíveis
Requested.

## Casos de Borda
Sem validacao.

## Observações
Nao implementado como regra persistida.


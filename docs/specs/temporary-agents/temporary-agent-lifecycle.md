# Ciclo de Vida do Agente Temporario

## Objectivo
Descrever lifecycle temporario actual.

## Contexto
Sem banco/API.

## Entidades Envolvidas
Eventos Socket.io.

## Regras de Negocio
Estados so existem como eventos: requested, accepted, available.

## Fluxo Principal
Requested -> accepted -> available.

## Fluxos Alternativos
Eventos podem ser emitidos fora de ordem.

## Eventos Disparados
`temporary-agent:requested`, `temporary-agent:accepted`, `temporary-agent:available`.

## Endpoints Relacionados
Nenhum.

## Dependências
Socket.io.

## Estados Possíveis
Requested, accepted, available.

## Casos de Borda
Nao ha validacao, autenticacao especifica ou persistencia.

## Observações
Simulado/parcial.


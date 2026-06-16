# Marcar Agente Temporario Disponivel

## Objectivo
Informar mapa/admin de agente temporario disponivel.

## Contexto
Evento Socket.io usado pelo frontend do mapa como upsert de agente.

## Entidades Envolvidas
Payload esperado similar a `Agent`, mas nao validado.

## Regras de Negocio
Servidor repassa para `map` e `admin`.

## Fluxo Principal
Emitir `temporary-agent:available`; mapa tenta inserir/actualizar como agente.

## Fluxos Alternativos
Payload incompleto pode quebrar consistencia visual.

## Eventos Disparados
`temporary-agent:available`.

## Endpoints Relacionados
Nenhum.

## Dependências
Socket.io, `useLiveAgents`.

## Estados Possíveis
Available.

## Casos de Borda
Nao sobrevive a reload.

## Observações
Parcial.


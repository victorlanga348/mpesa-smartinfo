# Gestao de Reforco

## Objectivo
Gerir reforco em zonas criticas.

## Contexto
Nao existe modulo persistido de reforco. Apenas eventos de agentes temporarios.

## Entidades Envolvidas
Eventos `temporary-agent:*`.

## Regras de Negocio
- Sem API REST.
- Sem tabelas.
- Sem regras de atribuicao.
- Eventos sao apenas repassados.

## Fluxo Principal
Nao implementado como fluxo administrativo completo.

## Fluxos Alternativos
Pode haver eventos Socket.io manuais.

## Eventos Disparados
`temporary-agent:requested`, `temporary-agent:accepted`, `temporary-agent:available`.

## Endpoints Relacionados
Nenhum.

## Dependências
Socket.io.

## Estados Possíveis
Requested, accepted, available.

## Casos de Borda
Sem historico ou auditoria.

## Observações
Nao implementado alem de eventos.


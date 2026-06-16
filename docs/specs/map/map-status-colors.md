# Cores de Estado no Mapa

## Objectivo
Padronizar leitura visual de disponibilidade.

## Contexto
Usado no mapa e dicas da UI.

## Entidades Envolvidas
`Agent.status`.

## Regras de Negocio
- Verde: disponivel/online.
- Amarelo: ocupado/busy/`ON_MY_WAY`.
- Cinzento: offline.

## Fluxo Principal
Status backend e normalizado no frontend e convertido em cor.

## Fluxos Alternativos
Status desconhecido vira offline.

## Eventos Disparados
Nao aplicavel.

## Endpoints Relacionados
`GET /api/agent`.

## Dependências
`normalizeAgent`, `createAgentIcon`.

## Estados Possíveis
Online, busy, offline.

## Casos de Borda
`ON_MY_WAY` pode significar ocupado, nao necessariamente a caminho.

## Observações
Status e visual, nao prova capacidade financeira.


# Marcadores de Agente

## Objectivo
Representar visualmente estado e posicao dos agentes.

## Contexto
Criados em `MapComponent` com `L.divIcon`.

## Entidades Envolvidas
`Agent`.

## Regras de Negocio
- Verde: `online`.
- Amarelo: `busy`.
- Cinzento: `offline`.
- Offline usa opacidade menor.
- Popup mostra nome, status, local, distancia se calculada e avaliacao.

## Fluxo Principal
Cada agente vira marcador; clique selecciona agente.

## Fluxos Alternativos
Marcadores removidos quando agente sai da lista activa.

## Eventos Disparados
Nenhum no clique alem de estado React local.

## Endpoints Relacionados
`GET /api/agent`.

## Dependências
Leaflet.

## Estados Possíveis
Online, ocupado, offline.

## Casos de Borda
Popup usa HTML string.

## Observações
Nao ha clustering de marcadores.


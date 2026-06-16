# OpenStreetMap

## Objectivo
Fornecer tiles de mapa.

## Contexto
Leaflet usa `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`.

## Entidades Envolvidas
Mapa e coordenadas.

## Regras de Negocio
- Atribuicao a OpenStreetMap e configurada.
- Zoom maximo 19.
- Nao ha geocoding.
- Nao ha roteamento.

## Fluxo Principal
Mapa inicializa Leaflet e carrega tiles.

## Fluxos Alternativos
Se tiles falharem, mapa pode ficar sem base.

## Eventos Disparados
Nenhum.

## Endpoints Relacionados
Servico externo de tiles OSM.

## Dependências
Leaflet, rede externa para tiles.

## Estados Possíveis
Mapa carregado, falha de tiles.

## Casos de Borda
Uso em producao pode exigir politica propria de tiles.

## Observações
Implementado no frontend.


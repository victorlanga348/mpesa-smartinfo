# Pesquisa de Localizacao

## Objectivo
Oferecer alternativa quando geolocalizacao falha.

## Contexto
Campo aparece no mapa se permissao for negada ou houver erro.

## Entidades Envolvidas
Estado local `manualSearch`.

## Regras de Negocio
- Campo apenas armazena texto local.
- Nao existe geocoding, filtro, chamada API ou reposicionamento do mapa.

## Fluxo Principal
Utilizador digita bairro; nenhuma accao persistida e executada.

## Fluxos Alternativos
Nenhum.

## Eventos Disparados
Nenhum.

## Endpoints Relacionados
Nenhum.

## Dependências
React state.

## Estados Possíveis
Vazio ou preenchido.

## Casos de Borda
Funcionalidade visual sem efeito operacional.

## Observações
Parcial.


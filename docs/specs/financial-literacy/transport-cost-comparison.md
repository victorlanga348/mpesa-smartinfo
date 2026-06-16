# Comparacao de Custo de Transporte

## Objectivo
Comparar deslocacao fisica com pagamento digital.

## Contexto
Parte da calculadora.

## Entidades Envolvidas
`transportCost`, `travelTime`, `amount`.

## Regras de Negocio
- Custo de transporte e input manual.
- Tempo de viagem e input manual.
- Pagamento digital tem custo estimado zero e tempo fixo de 1 minuto.

## Fluxo Principal
Utilizador insere transporte/tempo e calcula.

## Fluxos Alternativos
Valores vazios viram 0.

## Eventos Disparados
Nenhum.

## Endpoints Relacionados
Nenhum.

## Dependências
Calculadora.

## Estados Possíveis
Calculado/nao calculado.

## Casos de Borda
Nao ha integracao com mapas para custo real.

## Observações
Simulacao educativa.


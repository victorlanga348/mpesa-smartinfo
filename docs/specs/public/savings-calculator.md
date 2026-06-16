# Calculadora de Poupanca

## Objectivo
Comparar custo de levantar dinheiro com custo de pagar digitalmente.

## Contexto
Implementada em `SmartSavingsCalculator`.

## Entidades Envolvidas
Valores locais: montante, distancia, transporte, tempo.

## Regras de Negocio
- Taxa estimada de levantamento: `max(2, round(amount * 0.01))`.
- Custo em dinheiro: `amount + transportCost + withdrawalFee`.
- Custo digital: `amount`.
- Tempo digital fixo: 1 minuto.
- Poupanca monetaria: `max(0, cashTotal - digitalTotal)`.
- Tempo poupado: `max(0, travelTime - 1)`.
- Nivel: alta se poupanca >= 50, media se >= 20, baixa abaixo disso.
- Campo distancia existe, mas nao entra no calculo actual.

## Fluxo Principal
1. Utilizador informa valores.
2. Clica calcular.
3. UI mostra poupanca, comparacao e mensagem educativa.

## Fluxos Alternativos
Valores invalidos digitados viram `0` no estado do componente.

## Eventos Disparados
Nenhum.

## Endpoints Relacionados
Nenhum.

## Dependencias
React state/memo, framer-motion.

## Estados Possiveis
Nao calculado, calculado.

## Casos de Borda
Distancia e visual, nao usada no resultado.

## Observacoes
Calculadora e client-side e nao persiste resultados.


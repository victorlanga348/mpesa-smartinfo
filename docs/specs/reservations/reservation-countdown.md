# Contagem Regressiva da Reserva

## Objectivo
Mostrar tempo restante da reserva.

## Contexto
Componente `ReservationTimer`.

## Entidades Envolvidas
`Reservation.expiresAt`.

## Regras de Negocio
- Timer actualiza a cada 1 segundo.
- Se diferenca chega a zero, marca expirado localmente e chama `onExpired`.
- Se status for `completed`, mostra transacao completada.
- Se restam ate 2 minutos, usa alerta vermelho.
- Ate 5 minutos, amarelo.
- Acima disso, azul.

## Fluxo Principal
Componente recebe reserva e renderiza tempo restante.

## Fluxos Alternativos
Reserva completada ou expirada mostra estado final.

## Eventos Disparados
Nenhum Socket.io.

## Endpoints Relacionados
Nenhum.

## Dependências
React interval.

## Estados Possíveis
Activa, completada, expirada.

## Casos de Borda
Expiracao local nao actualiza backend.

## Observações
Comportamento visual.


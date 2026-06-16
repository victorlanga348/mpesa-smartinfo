# Ciclo de Vida da Reserva

## Objectivo
Dar ao cliente uma referencia temporaria apos confirmacao do agente.

## Contexto
Reserva nao tem tabela propria; vive em campos do `Ping`.

## Entidades Envolvidas
`Ping.reservationToken`, `Ping.reservationExpires`, `Reservation` frontend.

## Regras de Negocio
- Aceitar ping gera token numerico de 6 digitos.
- Aceitar ping define expiracao para 10 minutos.
- Mudar status para `WAITING_LIST` tambem gera token/expiracao se ainda nao estava nesse estado.
- Frontend permite escolher 5, 10, 15, 20, 30 ou 45 minutos, mas backend mantem 10 minutos quando cria token.
- Expiracao visual no frontend pode remover/ocultar reserva sem persistir `EXPIRED`.
- Evento `reservation:created` e emitido quando status vira `WAITING_LIST`.
- Evento `reservation:expired` e emitido quando status vira `EXPIRED` ou `REJECTED` via endpoint generico.

## Fluxo Principal
1. Agente aceita ping.
2. Backend gera token e expiracao.
3. Cliente constroi `Reservation` a partir do ping.
4. Timer mostra contagem regressiva.
5. Cliente marca chegada ou cancela.

## Fluxos Alternativos
Se API falhar, frontend cria reserva local com codigo `MPESA-*`.

## Eventos Disparados
`ping:accepted`, `reservation:created`, `reservation:expired`.

## Endpoints Relacionados
`PUT /api/ping/:id/accept`, `PUT /api/ping/:id/status`, `GET /api/ping/:id`.

## Dependências
`PingService`, `ReservationTimer`, `reservationService`.

## Estados Possíveis
Frontend: `active`, `completed`, `expired`. Backend: campos em `Ping` e status do ping.

## Casos de Borda
Nao ha job que detecte `reservationExpires` e mude status para `EXPIRED`.

## Observações
Implementacao parcial.


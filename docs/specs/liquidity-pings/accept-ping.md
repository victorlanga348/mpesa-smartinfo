# Aceitar Ping

## Objectivo
Confirmar que agente aceita atender pedido.

## Contexto
Endpoint `PUT /api/ping/:pingId/accept`.

## Entidades Envolvidas
`Ping`, `Agent`, `Transaction`.

## Regras de Negocio
- Requer role `agent`.
- Ping deve existir.
- Ping deve estar `PENDING`.
- Agente deve existir.
- Status vira `ACCEPTED`.
- `agentId` e gravado/confirmado.
- Gera `reservationToken` de 6 digitos.
- `reservationExpires` = agora + 10 minutos.
- Marca `acceptedAt`.
- Actualiza transacao para `ACCEPTED`.

## Fluxo Principal
Agente clica aceitar no dashboard; cliente e agente recebem evento.

## Fluxos Alternativos
Ping ja aceite/expirado retorna erro.

## Eventos Disparados
`ping:accepted`, `admin:metrics-updated`.

## Endpoints Relacionados
`PUT /api/ping/:pingId/accept`.

## Dependências
`PingService.acceptPing`.

## Estados Possíveis
De `PENDING` para `ACCEPTED`.

## Casos de Borda
Service nao verifica se o `agentId` original do ping era diferente antes de aceitar; actualiza para o agente autenticado.

## Observações
Reserva real do backend e sempre 10 minutos.


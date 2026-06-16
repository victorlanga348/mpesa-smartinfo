# Fluxo de Pedido do Cliente

## Objectivo
Permitir que o cliente consulte disponibilidade/liquidez de um agente.

## Contexto
O fluxo e executado no bottom sheet do agente.

## Entidades Envolvidas
`User`, `Agent`, `Ping`, `Transaction`, `Reservation`, `LocalRequest`.

## Regras de Negocio
- Operacoes principais na UI: `withdrawal` e `deposit`.
- Valor deve ser maior que zero no frontend e backend.
- Cliente sem sessao valida pode ser registado automaticamente com nome gerado.
- Ping criado fica `PENDING`.
- Pedido local e guardado em `smartinfo_requests`.
- Cliente pode cancelar em `PENDING`, `ACCEPTED`, `WAITING_LIST`.
- Cliente pode marcar chegada em `ACCEPTED`, `WAITING_LIST`.
- Cliente pode avaliar depois de `COMPLETED`.

## Fluxo Principal
1. Cliente selecciona agente.
2. Escolhe operacao e valor.
3. Frontend garante sessao de cliente.
4. Cria ping via API.
5. Fica a aguardar resposta do agente.
6. Recebe eventos de aceite/rejeicao/conclusao.

## Fluxos Alternativos
- Falha de token remove sessao local e redirecciona.
- Falha de API pode gerar fallback local em alguns services.

## Eventos Disparados
Recebe `ping:accepted`, `ping:waiting-list`, `ping:arrived`, `ping:completed`, `ping:rejected`, `ping:expired`, `ping:cancelled`.

## Endpoints Relacionados
`POST /api/ping`, `GET /api/ping/:pingId`, `PUT /api/ping/:pingId/cancel`, `PUT /api/ping/:pingId/arrive`, `POST /api/ping/:pingId/rating`.

## Dependências
`AgentBottomSheet`, `requestService`, `reservationService`.

## Estados Possíveis
`pending`, `accepted`, `waiting_list`, `arrived`, `in_service`, `completed`, `rejected`, `cancelled`, alem de `customer_on_way` apenas local.

## Casos de Borda
O estado local `customer_on_way` nao tem endpoint/backend correspondente.

## Observações
O fluxo mistura backend real com estado local para manter a UI responsiva.


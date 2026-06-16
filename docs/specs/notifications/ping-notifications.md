# Notificacoes de Ping

## Objectivo
Avisar cliente e agente sobre mudancas no pedido.

## Contexto
Controllers de ping emitem eventos.

## Entidades Envolvidas
`Ping`.

## Regras de Negocio
- Criacao notifica sala do agente.
- Aceite notifica cliente e agente.
- Rejeicao/cancelamento/chegada/conclusao notificam cliente e agente.
- Toda mutacao relevante notifica admin.

## Fluxo Principal
Endpoint altera ping e emite evento.

## Fluxos Alternativos
Endpoint generico escolhe evento por status.

## Eventos Disparados
`ping:*`, `admin:metrics-updated`.

## Endpoints Relacionados
`/api/ping`.

## Dependências
Socket.io.

## Estados Possíveis
Todos os status de ping.

## Casos de Borda
Se cliente nao entrou em `join:client`, nao recebe evento.

## Observações
Frontend sincroniza tambem por polling eventual.


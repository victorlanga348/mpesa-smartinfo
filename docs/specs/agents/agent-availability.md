# Disponibilidade do Agente

## Objectivo
Permitir que cliente saiba se um agente pode atender.

## Contexto
Disponibilidade e inferida por status do agente e resposta ao ping.

## Entidades Envolvidas
`Agent.status`, `Ping.status`.

## Regras de Negocio
- Mapa mostra online/busy/offline por status do agente.
- O agente confirma disponibilidade aceitando o ping.
- Rejeicao indica indisponibilidade para aquele pedido.
- Nao ha verificacao automatica de saldo real.

## Fluxo Principal
Cliente cria ping; agente aceita ou rejeita.

## Fluxos Alternativos
Agente offline ainda pode aparecer, mas UI avisa/limita accoes em algumas telas.

## Eventos Disparados
`ping:accepted`, `ping:rejected`, `agent:status-updated`.

## Endpoints Relacionados
`POST /api/ping`, `PUT /api/ping/:id/accept`, `PUT /api/ping/:id/reject`.

## Dependências
Mapa, dashboard do agente, Socket.io.

## Estados Possíveis
Disponivel, ocupado, offline, pedido pendente, aceite, rejeitado.

## Casos de Borda
Saldo mockado em `MOCK_AGENTS` pode influenciar UI legada, mas nao existe no backend.

## Observações
Disponibilidade real depende da acao manual do agente.


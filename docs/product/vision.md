# Visao do Produto

O M-Pesa SmartInfo e uma plataforma digital para reduzir incerteza antes de um cliente se deslocar a um agente M-Pesa.

Pelo codigo actual, o produto permite encontrar agentes no mapa, consultar disponibilidade por pedido, acompanhar estados do atendimento, manter uma reserva temporaria, comunicar por chat local simulado e dar visibilidade operacional basica ao administrador.

## Implementado

- Landing page publica.
- Mapa de agentes com OpenStreetMap.
- Registo/login de cliente.
- Login de agente/admin.
- Pedido de atendimento/liquidez via `Ping`.
- Dashboard do agente.
- Dashboard admin basico.
- Tempo real para agentes, pings e metricas.
- Calculadora de poupanca.
- Ajuda/FAQ.

## Parcial ou Simulado

- Chat cliente-agente: localStorage e resposta automatica, sem backend.
- Reservas: token e expiracao existem, mas nao ha expiracao automatica persistida.
- Zonas criticas: backend calcula por pings pendentes; frontend admin usa mocks como fallback/estrutura.
- Agentes temporarios: apenas eventos Socket.io, sem tabela/API.
- SMS/USSD e API M-Pesa: nao implementados.


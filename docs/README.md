# M-Pesa SmartInfo Documentation

Esta pasta documenta o comportamento actual do projecto M-Pesa SmartInfo conforme encontrado no codigo.

Esta documentacao nao define funcionalidades novas. Quando uma capacidade aparece apenas no frontend, em mocks, em localStorage, ou apenas como evento Socket.io sem persistencia, isso e marcado explicitamente.

## Estado Global

- Produto funcional em formato demonstracao/prototipo tecnico.
- Backend real: Express, Prisma, PostgreSQL, JWT e Socket.io.
- Frontend real: Next.js, React, Leaflet, Socket.io client, localStorage e mocks.
- Persistencia real: `User`, `Admin`, `Agent`, `Ping`, `Transaction`, `AgentRating`.
- Mocks/simulacoes: chat, agentes fallback, zonas criticas frontend, algumas metricas admin, reservas fallback, SMS/USSD e integracao M-Pesa.

## Fonte da Verdade Actual

- Regras persistidas: `backend/src/services/*`, `backend/src/controllers/*`, `backend/prisma/schema.prisma`.
- Regras de interface e fallback: `frontend/lib/services.ts`, `frontend/lib/services/*`, `frontend/components/map/agent-bottom-sheet.tsx`.
- Eventos em tempo real: `backend/src/sockets/pingHandler.ts`, controllers backend e hooks/componentes frontend.

## Indice Principal

- [Produto](product/vision.md)
- [Arquitectura](architecture/system-overview.md)
- [API](api/api-overview.md)
- [Base de Dados](database/schema-overview.md)
- [Autenticacao](specs/auth/session-management.md)
- [Mapa](specs/map/map-overview.md)
- [Pings e Liquidez](specs/liquidity-pings/ping-lifecycle.md)
- [Reservas](specs/reservations/reservation-lifecycle.md)
- [Chat](specs/chat/chat-overview.md)
- [Dashboard do Agente](specs/agents/agent-dashboard.md)
- [Dashboard Admin](specs/admin/admin-dashboard.md)
- [Eventos](events/liquidity-ping-created.md)
- [Workflows](workflows/client-registration-flow.md)
- [Glossario](glossary/business-terms.md)

## Convencoes

- **Implementado**: existe ligacao real ao backend ou comportamento local executavel no frontend.
- **Parcial**: existe parte da regra, mas falta persistencia, endpoint, job, validacao ou integracao.
- **Simulado**: comportamento mantido por mocks, localStorage ou resposta automatica.
- **Nao implementado**: referenciado no produto/UI/contexto, mas sem codigo funcional correspondente.


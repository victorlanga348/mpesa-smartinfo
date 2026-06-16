# System Overview

M-Pesa SmartInfo e uma aplicacao full stack com:

- Frontend Next.js em `frontend/`.
- Backend Express em `backend/`.
- PostgreSQL via Prisma.
- Socket.io para actualizacoes em tempo real.
- OpenStreetMap/Leaflet para mapa.

## Fluxo Alto Nivel

1. Cliente usa frontend para encontrar agente.
2. Frontend chama API REST para agentes e pings.
3. Backend persiste dados via Prisma.
4. Backend emite eventos Socket.io.
5. Dashboards de agente/admin e mapa actualizam em tempo real.

## Limites

- Chat, SMS/USSD, agentes temporarios persistidos e API M-Pesa nao existem como backend real.


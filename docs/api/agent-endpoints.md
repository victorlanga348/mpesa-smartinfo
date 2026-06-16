# Agent Endpoints

- `POST /api/agent/register`: regista agente.
- `POST /api/agent/login`: autentica agente.
- `GET /api/agent`: lista agentes com metricas de tempo/rating.
- `GET /api/agent/profile`: requer `agent`.
- `PUT /api/agent/status`: requer `agent`, status em `ONLINE`, `OFFLINE`, `ON_MY_WAY`.
- `PUT /api/agent/location`: requer `agent`, latitude/longitude.
- `PUT /api/agent/reference`: requer `agent`, referencia textual.
- `GET /api/ping/agent/pending`: pings `PENDING` do agente.
- `GET /api/ping/agent/queue`: pings `ACCEPTED` e `WAITING_LIST`.
- `PUT /api/ping/:id/accept`: aceita.
- `PUT /api/ping/:id/reject`: rejeita.
- `PUT /api/ping/:id/complete`: conclui.
- `PUT /api/ping/:id/status`: altera status.


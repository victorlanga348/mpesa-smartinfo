# Admin Endpoints

- `POST /api/admin/login`: login publico.
- `POST /api/admin/register`: cria admin, requer admin autenticado.
- `GET /api/admin/stats`: retorna metricas operacionais.
- `GET /api/admin/critical-zones`: retorna clusters de pings pendentes.

Metricas admin emitem/recebem actualizacoes via `admin:metrics-updated`.


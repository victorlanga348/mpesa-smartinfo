# API Overview

Base URL default: `http://localhost:5000/api`.

## Health

- `GET /health`: retorna `{ status: "healthy", timestamp }`.

## Autenticacao

Rotas protegidas usam `Authorization: Bearer <token>`. Tokens JWT expiram em 24h.

## Endpoints

| Metodo | Rota | Role | Descricao |
| --- | --- | --- | --- |
| POST | `/api/user/register` | Publico | Regista cliente |
| POST | `/api/user/login` | Publico | Login cliente |
| GET | `/api/user/profile` | user | Perfil cliente |
| PUT | `/api/user/location` | user | Localizacao cliente |
| GET | `/api/user/pings` | user | Historico cliente |
| POST | `/api/agent/register` | Publico | Regista agente |
| POST | `/api/agent/login` | Publico | Login agente |
| GET | `/api/agent` | Publico | Lista agentes |
| GET | `/api/agent/profile` | agent | Perfil agente |
| PUT | `/api/agent/status` | agent | Actualiza status |
| PUT | `/api/agent/location` | agent | Actualiza localizacao |
| PUT | `/api/agent/reference` | agent | Actualiza referencia |
| POST | `/api/admin/register` | admin | Cria admin |
| POST | `/api/admin/login` | Publico | Login admin |
| GET | `/api/admin/stats` | admin | Metricas |
| GET | `/api/admin/critical-zones` | admin | Zonas criticas |
| POST | `/api/ping` | user | Cria ping |
| GET | `/api/ping/active` | Publico | Pings activos |
| GET | `/api/ping/agent/pending` | agent | Pings pendentes do agente |
| GET | `/api/ping/agent/queue` | agent | Fila do agente |
| GET | `/api/ping/:pingId` | Publico | Detalhe do ping |
| PUT | `/api/ping/:pingId/accept` | agent | Aceita ping |
| PUT | `/api/ping/:pingId/reject` | agent | Rejeita ping |
| PUT | `/api/ping/:pingId/complete` | agent | Conclui ping |
| PUT | `/api/ping/:pingId/cancel` | user | Cancela ping |
| PUT | `/api/ping/:pingId/arrive` | user | Marca chegada |
| PUT | `/api/ping/:pingId/status` | agent | Actualiza status |
| POST | `/api/ping/:pingId/rating` | user | Avalia agente |

## Observacoes

- `GET /api/ping/active` e `GET /api/ping/:pingId` sao publicos no backend actual.
- Varios endpoints retornam erro 400 com `{ error }` para erros de negocio.
- Nao ha versionamento de API.


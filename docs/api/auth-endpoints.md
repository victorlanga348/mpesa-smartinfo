# Auth Endpoints

## Cliente

- `POST /api/user/register`: body `{ name, phone? }`; retorna `{ token, user }`.
- `POST /api/user/login`: body `{ name, code }`; retorna `{ token, user }`.

## Agente

- `POST /api/agent/register`: body `{ name, phone, code }`; retorna agente sem password.
- `POST /api/agent/login`: body `{ name, code }`; retorna `{ token, agent }`.

## Admin

- `POST /api/admin/login`: body `{ email, password }`; retorna `{ token, user }`.
- `POST /api/admin/register`: protegido por admin; body `{ name, email, password }`.

## Regras

- JWT expira em 24h.
- Passwords/codigos de agente/admin sao bcrypt.
- Cliente nao tem password; usa codigo unico.


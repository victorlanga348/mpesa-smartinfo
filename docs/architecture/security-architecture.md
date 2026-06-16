# Security Architecture

## Implementado

- JWT Bearer.
- Roles no backend.
- bcrypt para agent/admin.
- CORS com origens locais e redes privadas.

## Riscos

- Fallback fixo para JWT secret.
- Algumas leituras de ping sao publicas.
- Socket.io sem autenticar salas.
- Frontend usa localStorage para sessao.
- Sem rate limiting.


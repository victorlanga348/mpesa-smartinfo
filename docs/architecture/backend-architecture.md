# Backend Architecture

## Camadas

- `server.ts`: Express, HTTP server, CORS, Socket.io e rotas.
- `routes/index.ts`: declaracao das rotas REST.
- `controllers/*`: validacao basica de request/response e emissao de eventos.
- `services/*`: regras de negocio e Prisma.
- `middlewares/auth.ts`: JWT e roles.
- `sockets/pingHandler.ts`: eventos Socket.io.
- `lib/prisma.ts`: Prisma client.

## Regras

Controllers nao concentram a regra principal; services fazem validacoes de dominio.


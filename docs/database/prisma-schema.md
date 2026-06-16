# Prisma Schema

Fonte: `backend/prisma/schema.prisma`.

## Datasource

`postgresql`, URL em `DATABASE_URL`.

## Generator

`prisma-client-js`.

## Modelos Persistidos

Ver `tables.md` e `relationships.md`.

## Estados

Embora o TypeScript defina `AgentStatus` e `PingStatus`, o Prisma guarda esses campos como `String`.


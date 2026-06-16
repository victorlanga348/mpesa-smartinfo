# Dependencias de Terceiros

## Objectivo
Listar dependencias arquitecturais relevantes.

## Contexto
Package files backend/frontend.

## Entidades Envolvidas
Runtime e bibliotecas.

## Regras de Negocio
- Backend depende de Express, Prisma, PostgreSQL, JWT, bcryptjs, Socket.io.
- Frontend depende de Next.js, React, Leaflet, socket.io-client, axios, Radix UI, lucide-react, framer-motion.
- Tiles OSM dependem de rede externa.

## Fluxo Principal
Aplicacao usa essas bibliotecas para executar funcionalidades.

## Fluxos Alternativos
Sem backend, frontend usa mocks em varias telas.

## Eventos Disparados
Nao aplicavel.

## Endpoints Relacionados
Nao aplicavel.

## Dependências
`backend/package.json`, `frontend/package.json`.

## Estados Possíveis
Dependencias instaladas ou ausentes.

## Casos de Borda
Versoes modernas: Next 16 e React 19.

## Observações
Nao foram alteradas dependencias.


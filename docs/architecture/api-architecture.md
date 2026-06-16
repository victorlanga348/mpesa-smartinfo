# API Architecture

API REST sob `/api`, sem versionamento.

## Autenticacao

JWT Bearer em rotas protegidas.

## Erros

Controllers normalmente retornam `{ error }` com status 400 para erros de negocio, 401/403 para auth.

## Tempo Real

Mutacoes REST relevantes emitem Socket.io apos persistencia.


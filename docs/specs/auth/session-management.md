# Gestao de Sessao

## Objectivo
Manter sessoes autenticadas para cliente, agente e admin.

## Contexto
O backend usa JWT. O frontend guarda o token em `localStorage` sob `smartinfo_user`.

## Entidades Envolvidas
`User`, `Agent`, `Admin`, `AuthPayload`, `smartinfo_user`.

## Regras de Negocio
- Token deve vir no header `Authorization: Bearer <token>`.
- JWT expira em 24 horas.
- Payload precisa de `id` e `role`.
- Roles aceites no backend: `user`, `agent`, `admin`.
- O frontend guarda clientes como `role: customer`, embora o backend emita `role: user`; isso e uma inconsistencia real.
- Se token faltar, a API retorna 401.
- Se role nao for aceite pela rota, a API retorna 403.

## Fluxo Principal
1. Utilizador faz login ou registo.
2. Backend devolve token.
3. Frontend grava token em `localStorage`.
4. Serviços frontend adicionam header Authorization.
5. Middleware valida token e role.

## Fluxos Alternativos
- Token invalido ou expirado retorna erro.
- Frontend pode redireccionar para `/auth` ou `/login`.
- Em algumas rotas publicas, como `/app/map`, o layout permite acesso sem autenticacao previa.

## Eventos Disparados
Nenhum evento Socket.io e disparado directamente pela criacao de sessao.

## Endpoints Relacionados
`POST /api/user/register`, `POST /api/user/login`, `POST /api/agent/login`, `POST /api/admin/login`.

## Dependencias
`jsonwebtoken`, `authMiddleware`, `requireRole`, `localStorage`, `authHeaders`.

## Estados Possiveis
Autenticado, nao autenticado, token invalido, permissao insuficiente.

## Casos de Borda
- Segredo JWT default se `JWT_SECRET` nao for configurado.
- Nome `req.agent` e usado tambem para user/admin.
- Frontend modular e frontend principal usam abordagens diferentes de autenticacao.

## Observacoes
Sessao e implementada, mas a seguranca depende fortemente de configuracao correcta do ambiente.


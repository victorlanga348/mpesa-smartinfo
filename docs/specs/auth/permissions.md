# Permissoes

## Objectivo
Controlar acesso a rotas por perfil.

## Contexto
Backend aplica `authMiddleware` e `requireRole`.

## Entidades Envolvidas
`AuthPayload`, `User`, `Agent`, `Admin`.

## Regras de Negocio
- User: perfil, localizacao, historico e criacao/cancelamento/chegada/rating de pings.
- Agent: perfil, status, localizacao, referencia e alteracoes operacionais de ping.
- Admin: estatisticas, zonas criticas e criacao de admin.
- Listagem de agentes e leitura de pings activos/id especifico sao publicas no backend actual.

## Fluxo Principal
1. Middleware verifica token.
2. `requireRole` compara `req.auth.role` com roles permitidas.
3. Rota executa ou retorna 403.

## Fluxos Alternativos
Token ausente: 401. Role errada: 403.

## Eventos Disparados
Eventos sao disparados por controllers apos mutacoes autorizadas.

## Endpoints Relacionados
Todos os endpoints protegidos listados em `api/api-overview.md`.

## Dependencias
`backend/src/middlewares/auth.ts`.

## Estados Possiveis
Permitido, nao autenticado, proibido.

## Casos de Borda
Frontend usa roles `customer`, `agent`, `admin`; backend usa `user`, `agent`, `admin`.

## Observacoes
Permissoes frontend sao apenas experiencia de UI, nao seguranca.


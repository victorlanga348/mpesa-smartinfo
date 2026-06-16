# Login de Admin

## Objectivo
Permitir acesso ao painel administrativo.

## Contexto
Admin usa email e palavra-passe.

## Entidades Envolvidas
`Admin`, `smartinfo_user`.

## Regras de Negocio
- `email` e `password` sao obrigatorios.
- Email e unico no banco.
- Password e validada com bcrypt.
- Token inclui `role: admin`.
- Criacao de novo admin exige admin autenticado.

## Fluxo Principal
1. Admin informa email e palavra-passe.
2. Frontend chama `POST /api/admin/login`.
3. Backend valida email e bcrypt.
4. Frontend grava token e redirecciona para `/app/admin-dashboard`.

## Fluxos Alternativos
- Credenciais invalidas retornam erro generico.
- Se nao houver `smartinfo_user` admin, dashboard redirecciona para `/login`.

## Eventos Disparados
Nenhum no login.

## Endpoints Relacionados
`POST /api/admin/login`, `POST /api/admin/register`.

## Dependencias
`AdminService`, `bcryptjs`, `jsonwebtoken`.

## Estados Possiveis
Autenticado, nao autenticado, permissao insuficiente.

## Casos de Borda
README e seed divergem nas credenciais de demonstracao.

## Observacoes
Seed actual cria `admin.dev@smartinfo.co.mz / AdminDev123!`.


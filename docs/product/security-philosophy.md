# Filosofia de Seguranca

## Implementado

- Password/codigo de agente e admin guardado com bcrypt.
- Cliente usa codigo unico de 6 digitos.
- JWT com expiracao de 24 horas.
- Middleware de roles para rotas protegidas.
- Frontend declara que o sistema nao mostra saldo dos agentes.

## Riscos Actuais

- `JWT_SECRET` tem fallback fixo em codigo.
- `GET /api/ping/active` e `GET /api/ping/:pingId` nao exigem autenticacao.
- Estados sensiveis sao strings livres no banco.
- Frontend confia em localStorage para permissao visual.
- Chat nao tem backend nem auditoria.


# Login de Agente

## Objectivo
Permitir que agentes acedam ao dashboard operacional.

## Contexto
Agentes fazem login com nome e codigo.

## Entidades Envolvidas
`Agent`, `smartinfo_user`.

## Regras de Negocio
- `name` e `code` sao obrigatorios.
- Backend procura agentes com o nome exacto informado.
- Codigo e validado com bcrypt contra `Agent.password`.
- Ao autenticar, retorna token e dados do agente.
- Token inclui `role: agent`.

## Fluxo Principal
1. Agente abre `/login`.
2. Informa nome e codigo.
3. Frontend chama `POST /api/agent/login`.
4. Backend valida bcrypt.
5. Frontend grava agente e token em `localStorage`.
6. Agente e enviado para `/app/agent-dashboard`.

## Fluxos Alternativos
- Nome/codigo ausente retorna erro.
- Credenciais invalidas retornam erro.

## Eventos Disparados
Nenhum no login. Eventos comecam quando dashboard faz `join:agent` ou actualiza status/localizacao.

## Endpoints Relacionados
`POST /api/agent/login`.

## Dependencias
`AgentService.login`, `bcryptjs`, `jsonwebtoken`, `authService.loginAgent`.

## Estados Possiveis
Autenticado, nao autenticado, credenciais invalidas.

## Casos de Borda
Nomes duplicados sao possiveis; o service tenta todos os agentes com o mesmo nome ate encontrar codigo valido.

## Observacoes
O texto do frontend fala em credenciais fornecidas pela equipa do piloto.


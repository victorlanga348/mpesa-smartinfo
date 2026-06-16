# Perfil do Cliente

## Objectivo
Consultar dados basicos do cliente autenticado.

## Contexto
Backend expõe perfil de `User`; frontend usa sobretudo `localStorage`.

## Entidades Envolvidas
`User`, `smartinfo_user`.

## Regras de Negocio
- Perfil exige token com role `user`.
- Retorna `id`, `name`, `code`, `phone`, `latitude`, `longitude`.
- Historico de pings e ordenado por `createdAt desc`.

## Fluxo Principal
Cliente autenticado chama perfil ou historico.

## Fluxos Alternativos
Se token faltar retorna 401; se user nao existir retorna 404.

## Eventos Disparados
Nenhum.

## Endpoints Relacionados
`GET /api/user/profile`, `GET /api/user/pings`.

## Dependências
`UserService.getProfile`, `UserService.getPingHistory`.

## Estados Possíveis
Autenticado, nao autorizado, nao encontrado.

## Casos de Borda
Frontend principal nao usa extensivamente estes endpoints.

## Observações
Perfil de cliente nao tem password.


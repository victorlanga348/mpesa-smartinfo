# Cadastro Simples do Cliente

## Objectivo
Criar uma identidade de cliente sem password.

## Contexto
Backend cria `User` e gera codigo de 6 digitos; frontend tambem tem rotas legadas com localStorage.

## Entidades Envolvidas
`User`, `smartinfo_user`.

## Regras de Negocio
- Backend exige `name`.
- `phone` e opcional no backend, embora muitas telas o peçam.
- Codigo e unico e numerico com 6 digitos.
- Registo retorna token e dados do utilizador.
- Frontend grava cliente como `role: customer`.

## Fluxo Principal
1. Cliente informa nome e opcionalmente telefone.
2. API cria utilizador com codigo unico.
3. API devolve token e codigo.
4. Frontend guarda sessao.

## Fluxos Alternativos
- Nome ausente retorna 400.
- Rotas legadas podem criar utilizador apenas em memoria/localStorage.

## Eventos Disparados
Nenhum.

## Endpoints Relacionados
`POST /api/user/register`.

## Dependencias
`UserService.register`, `authService.registerClient`.

## Estados Possiveis
Registado, erro de validacao.

## Casos de Borda
Nao ha validacao de formato de telefone.

## Observacoes
O codigo gerado deve ser guardado pelo cliente para login futuro.


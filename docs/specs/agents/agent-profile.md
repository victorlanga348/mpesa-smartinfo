# Perfil do Agente

## Objectivo
Representar agente M-Pesa no sistema.

## Contexto
Agente e persistido em `Agent`.

## Entidades Envolvidas
`Agent`, `Ping`, `Transaction`, `AgentRating`.

## Regras de Negocio
- `phone` e unico.
- Codigo de acesso e guardado em `password` com bcrypt.
- Novo agente registado pela API inicia `OFFLINE`.
- Perfil retorna dados publicos e operacionais, nunca password.
- Listagem inclui media de tempo de atendimento e media de rating.

## Fluxo Principal
Agente e registado, autentica-se e aparece na listagem se tiver coordenadas no frontend.

## Fluxos Alternativos
Telefone duplicado retorna erro.

## Eventos Disparados
Alteracoes de agente podem emitir `agent:*` e `agents:list-updated`.

## Endpoints Relacionados
`POST /api/agent/register`, `GET /api/agent`, `GET /api/agent/profile`.

## Dependências
`AgentService`, `PingTimingService`, `RatingService`.

## Estados Possíveis
`ONLINE`, `OFFLINE`, `ON_MY_WAY`.

## Casos de Borda
Frontend mostra `busy` para `ON_MY_WAY`.

## Observações
Nao existe campo de saldo no backend.


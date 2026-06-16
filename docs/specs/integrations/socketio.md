# Socket.io

## Objectivo
Dar tempo real ao mapa, agente, cliente e admin.

## Contexto
Servidor Socket.io partilha o HTTP server Express.

## Entidades Envolvidas
`Agent`, `Ping`, salas Socket.io.

## Regras de Negocio
- URL default socket: `http://<hostname>:5000`.
- Reconexao infinita no cliente.
- Transportes: websocket e polling.
- Salas: `map`, `admin`, `agent:{id}`, `client:{id}` e sala arbitraria `joinRoom`.
- Eventos nao validam token.

## Fluxo Principal
Cliente conecta, entra em sala e recebe eventos operacionais.

## Fluxos Alternativos
Se socket cair, UI mostra offline/reconectando e alguns dados usam polling.

## Eventos Disparados
Ver `events/`.

## Endpoints Relacionados
Nao REST; servidor Socket.io.

## Dependências
`socket.io`, `socket.io-client`.

## Estados Possíveis
Online, reconnecting, offline.

## Casos de Borda
Qualquer cliente pode tentar entrar em salas se souber ids.

## Observações
Implementado, mas seguranca de canal e limitada.


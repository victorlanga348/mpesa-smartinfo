# Client Endpoints

- `POST /api/user/register`: cria cliente e codigo.
- `POST /api/user/login`: valida nome e codigo.
- `GET /api/user/profile`: requer `user`.
- `PUT /api/user/location`: requer `user`, body `{ latitude, longitude }`.
- `GET /api/user/pings`: requer `user`, retorna pings com agente.
- `POST /api/ping`: requer `user`, cria pedido.
- `PUT /api/ping/:id/cancel`: requer dono do ping.
- `PUT /api/ping/:id/arrive`: requer dono do ping.
- `POST /api/ping/:id/rating`: requer dono e ping concluido.


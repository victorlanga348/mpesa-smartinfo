# Frontend Architecture

## Estrutura

- `app/`: paginas Next.js.
- `components/`: UI, mapa, chat, calculadora, layout.
- `hooks/`: socket, geolocalizacao, agentes vivos.
- `lib/`: tipos, socket, services, mocks.

## Observacoes

- Ha services duplicados: `lib/services.ts` e `lib/services/*`.
- O frontend mistura API real com fallback local/mock.
- `/app/map` e permitido publicamente pelo layout.
- Dashboards dependem de `smartinfo_user` no localStorage.


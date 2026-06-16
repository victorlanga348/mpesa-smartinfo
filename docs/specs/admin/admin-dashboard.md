# Dashboard Administrativo

## Objectivo
Mostrar estado operacional do sistema.

## Contexto
Implementado em `/app/admin-dashboard` com metricas da API e fallback local/mock.

## Entidades Envolvidas
`User`, `Agent`, `Ping`, `Transaction`, `AdminMetrics`, `CriticalZone`.

## Regras de Negocio
- Requer utilizador local admin para entrar.
- Chama `GET /api/admin/stats`.
- Escuta `admin:metrics-updated` e recarrega metricas.
- Mostra utilizadores, agentes, pedidos concluidos e estado operacional.
- Pedidos por tipo vem de `Transaction`.
- Zonas criticas frontend podem vir de mocks se API nao fornecer `activeZones`.

## Fluxo Principal
Admin entra, junta-se a sala `admin`, carrega metricas e actualiza em tempo real.

## Fluxos Alternativos
Se nao for admin, redirecciona para `/login`.

## Eventos Disparados
Emite `join:admin`; recebe `admin:metrics-updated`.

## Endpoints Relacionados
`GET /api/admin/stats`, `GET /api/admin/critical-zones`.

## Dependências
`AdminService`, `adminService` frontend, Socket.io.

## Estados Possíveis
Carregando, com metricas, erro/sem metricas.

## Casos de Borda
Frontend admin nao usa directamente `GET /api/admin/critical-zones` na pagina analisada.

## Observações
Parcialmente real, parcialmente fallback/mock.


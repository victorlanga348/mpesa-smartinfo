# Cobertura por Bairro

## Objectivo
Representar cobertura operacional por zona.

## Contexto
Nao ha entidade de bairro no banco. Cobertura e inferida por coordenadas ou mocks.

## Entidades Envolvidas
`Agent`, `CriticalZone`.

## Regras de Negocio
- Backend nao calcula cobertura por bairro nominal.
- Frontend `CRITICAL_ZONES` contem nomes como Centro de Maputo, Xipamanine e Boane.
- Admin mostra zonas com densidade mockada quando usa fallback.

## Fluxo Principal
Dashboard mostra zonas activas se existirem em metricas/fallback.

## Fluxos Alternativos
Sem dados, mostra estado vazio.

## Eventos Disparados
`admin:metrics-updated`.

## Endpoints Relacionados
`GET /api/admin/stats`, `GET /api/admin/critical-zones`.

## Dependências
Mocks frontend e service admin.

## Estados Possíveis
Com zonas, sem zonas.

## Casos de Borda
Bairro textual do cadastro legado nao e persistido no backend real.

## Observações
Parcial.


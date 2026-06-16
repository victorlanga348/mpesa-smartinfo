# Zonas Criticas

## Objectivo
Identificar concentracoes de pings pendentes.

## Contexto
Backend calcula zonas por arredondamento de coordenadas.

## Entidades Envolvidas
`Ping`.

## Regras de Negocio
- Considera apenas pings com status `PENDING`.
- Arredonda latitude/longitude para 3 casas.
- Agrupa por coordenada arredondada.
- Severidade: `HIGH` se count > 5, `MEDIUM` se count > 2, caso contrario `LOW`.
- Ordena por count decrescente.

## Fluxo Principal
Admin chama endpoint e recebe lista de clusters.

## Fluxos Alternativos
Sem pings pendentes, retorna lista vazia.

## Eventos Disparados
Mutacoes de agentes/pings emitem `admin:metrics-updated`.

## Endpoints Relacionados
`GET /api/admin/critical-zones`.

## Dependências
`AdminService.getCriticalZones`.

## Estados Possíveis
LOW, MEDIUM, HIGH.

## Casos de Borda
Frontend `CriticalZone` espera campos diferentes (`id`, `name`, `priority`, `agentsDensity`) dos retornados pelo backend (`latitude`, `longitude`, `count`, `severity`).

## Observações
Ha inconsistencia de contrato backend/frontend.


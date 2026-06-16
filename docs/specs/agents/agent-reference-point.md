# Ponto de Referencia do Agente

## Objectivo
Guardar descricao textual do local do agente.

## Contexto
Dashboard permite editar referencia.

## Entidades Envolvidas
`Agent.reference`.

## Regras de Negocio
- Campo `reference` e obrigatorio no body, mas pode virar `null` se vazio apos trim.
- Frontend limita input a 120 caracteres.
- Alteracao emite evento de localizacao actualizada.

## Fluxo Principal
Agente digita referencia e guarda; mapa/admin/lista recebem actualizacao.

## Fluxos Alternativos
String vazia remove a referencia.

## Eventos Disparados
`agent:location-updated`, `admin:metrics-updated`, `agents:list-updated`.

## Endpoints Relacionados
`PUT /api/agent/reference`.

## Dependências
`AgentService.updateReference`.

## Estados Possíveis
Com referencia, sem referencia.

## Casos de Borda
Backend nao limita tamanho.

## Observações
Frontend mostra fallback `Localizacao actual`.


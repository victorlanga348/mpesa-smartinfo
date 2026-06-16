# Chat Cliente-Agente

## Objectivo
Permitir contacto textual antes do pedido.

## Contexto
Pagina `/app/chat/[id]` e componente `ChatBox`.

## Entidades Envolvidas
`Agent`, `Message`, `Reservation`.

## Regras de Negocio
- Pagina carrega agente por id a partir de lista de agentes.
- Se agente offline, mostra aviso.
- Se saldo mockado for zero, mostra aviso, mas saldo nao existe no backend.
- Botao de disponibilidade cria request `info` sem valor explicito, o que pode falhar no backend porque amount e obrigatorio em alguns fluxos.

## Fluxo Principal
Cliente abre chat, conversa localmente e pode acionar disponibilidade.

## Fluxos Alternativos
Agente nao encontrado mostra erro.

## Eventos Disparados
Nenhum para mensagens.

## Endpoints Relacionados
Pode chamar `POST /api/ping` indiretamente via service.

## Dependências
`agentService`, `ChatBox`, `ReservationTimer`.

## Estados Possíveis
Carregando, agente encontrado, agente offline, reserva activa.

## Casos de Borda
Fluxo de chat esta menos alinhado ao backend que o bottom sheet do mapa.

## Observações
Simulado/parcial.


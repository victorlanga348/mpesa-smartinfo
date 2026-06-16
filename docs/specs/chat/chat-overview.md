# Chat

## Objectivo
Permitir conversa simples cliente-agente.

## Contexto
Implementado apenas no frontend com localStorage e resposta automatica.

## Entidades Envolvidas
`Message`, `smartinfo_messages`.

## Regras de Negocio
- Mensagens sao agrupadas por chave ordenada `userId-agentId`.
- Envio exige texto nao vazio e utilizador local.
- Mensagem do cliente e gravada localmente.
- Apos 700ms, e criada resposta automatica do agente.
- Nao existe tabela, API ou evento Socket.io de chat.

## Fluxo Principal
Cliente abre chat, escreve mensagem, recebe resposta automatica.

## Fluxos Alternativos
Sem utilizador local, chat nao carrega mensagens.

## Eventos Disparados
Nenhum.

## Endpoints Relacionados
Nenhum.

## Dependências
`ChatBox`, `localStorage`.

## Estados Possíveis
Sem mensagens, carregando, conversa local.

## Casos de Borda
Mensagens nao sincronizam entre browsers/dispositivos.

## Observações
Simulado.


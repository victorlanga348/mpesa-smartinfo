# Mensagens de Chat

## Objectivo
Persistir mensagens locais da conversa.

## Contexto
Chave `smartinfo_messages` no localStorage.

## Entidades Envolvidas
`Message`.

## Regras de Negocio
- `id` gerado com timestamp.
- `senderId`, `receiverId`, `text`, `timestamp`, `read` sao mantidos localmente.
- `read` nao e actualizado no fluxo actual.

## Fluxo Principal
Enviar mensagem adiciona ao array local.

## Fluxos Alternativos
JSON invalido nao e tratado em `ChatBox`.

## Eventos Disparados
Nenhum.

## Endpoints Relacionados
Nenhum.

## Dependências
localStorage.

## Estados Possíveis
Lida/nao lida no tipo, mas sem regra real de leitura.

## Casos de Borda
Timestamp salvo como Date serializado pode voltar string.

## Observações
Sem backend.


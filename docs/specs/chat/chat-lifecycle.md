# Ciclo de Vida do Chat

## Objectivo
Descrever estados da conversa local.

## Contexto
Sem backend.

## Entidades Envolvidas
`Message`.

## Regras de Negocio
- Conversa inicia vazia.
- Envio de cliente persiste mensagem.
- Resposta automatica do agente e adicionada 700ms depois.
- Fechar pagina nao apaga mensagens locais.

## Fluxo Principal
Abrir, enviar, persistir local, responder automaticamente.

## Fluxos Alternativos
Sem user local, conversa nao e inicializada.

## Eventos Disparados
Nenhum.

## Endpoints Relacionados
Nenhum.

## Dependências
localStorage e setTimeout.

## Estados Possíveis
Vazio, com mensagens.

## Casos de Borda
Sem sincronizacao multi-dispositivo.

## Observações
Nao e chat real em tempo real.


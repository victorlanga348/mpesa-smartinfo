# Ajuda / FAQ

## Objectivo
Responder perguntas frequentes e dar orientacoes de seguranca.

## Contexto
Pagina implementada em `frontend/app/app/help/page.tsx`.

## Entidades Envolvidas
FAQ local, problemas comuns, formulario visual de suporte.

## Regras de Negocio
- Pesquisa filtra FAQs client-side.
- Formulario de suporte nao envia dados para API.
- Estado do sistema e texto estatico.
- Dicas reforcam que PIN nao deve ser partilhado e saldo do agente nao e mostrado.

## Fluxo Principal
Utilizador abre ajuda, pesquisa pergunta ou selecciona problema comum.

## Fluxos Alternativos
Sem resultado mostra mensagem local.

## Eventos Disparados
Nenhum.

## Endpoints Relacionados
Nenhum.

## Dependencias
Componentes UI, estado React local.

## Estados Possiveis
FAQ filtrada, problema seleccionado.

## Casos de Borda
Botao de contacto e `type="button"` sem submissao real.

## Observacoes
Implementado como conteudo local.


# Acesso Offline

## Objectivo
Permitir uso sem internet.

## Contexto
Nao implementado como capacidade offline real.

## Entidades Envolvidas
localStorage para alguns dados frontend.

## Regras de Negocio
- Frontend tem fallbacks para mocks/localStorage quando API falha.
- Isso nao equivale a sincronizacao offline.
- Pings reais exigem API.

## Fluxo Principal
Sem API, algumas telas continuam com dados mockados.

## Fluxos Alternativos
Pedidos podem ser simulados localmente em alguns services.

## Eventos Disparados
Nenhum offline.

## Endpoints Relacionados
Nenhum offline.

## Dependências
localStorage.

## Estados Possíveis
Online, fallback local.

## Casos de Borda
Dados locais podem divergir do backend.

## Observações
Parcial/simulado.


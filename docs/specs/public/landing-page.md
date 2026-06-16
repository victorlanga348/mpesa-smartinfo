# Landing Page

## Objectivo
Apresentar o produto e encaminhar para mapa, login, ajuda e calculadora.

## Contexto
Implementada em `frontend/app/page.tsx`.

## Entidades Envolvidas
Componentes `Navbar`, `HeroSection`, secoes estaticas.

## Regras de Negocio
- Nao consome API.
- Descreve fluxo de uso, poupanca e acesso de agentes.
- Link de agente/admin aponta para `/login`.
- Link de mapa aponta para `/app/map`.

## Fluxo Principal
Utilizador abre `/`, le conteudo e navega para mapa, ajuda ou login.

## Fluxos Alternativos
Nenhum fluxo persistido.

## Eventos Disparados
Nenhum.

## Endpoints Relacionados
Nenhum.

## Dependencias
Next.js, componentes compartilhados e lucide-react.

## Estados Possiveis
Pagina estatica renderizada.

## Casos de Borda
Texto descreve capacidades que podem estar parciais, como comunicacao e reservas.

## Observacoes
E uma pagina informativa, nao fonte operacional.


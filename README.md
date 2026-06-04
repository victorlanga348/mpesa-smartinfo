# M-Pesa SmartInfo

> Plataforma full stack para aproximar clientes e agentes M-Pesa, reduzir deslocacoes desnecessarias e dar visibilidade operacional sobre disponibilidade, pedidos e zonas de maior procura.

![Status](https://img.shields.io/badge/status-demo%20tecnica-red)
![Frontend](https://img.shields.io/badge/frontend-Next.js-black)
![Backend](https://img.shields.io/badge/backend-Express%20%2B%20Prisma-green)
![License](https://img.shields.io/badge/licenca-proprietaria-lightgrey)

## Visao geral

O **M-Pesa SmartInfo** e uma solucao digital desenhada para melhorar a experiencia de quem procura servicos M-Pesa e dar aos agentes uma forma mais organizada de receber pedidos. A aplicacao combina mapa, pedidos em tempo real, autenticacao por perfil e painel administrativo para apoiar decisoes operacionais.

O projeto esta dividido em:

- **Frontend:** aplicacao Next.js com experiencia para cliente, agente e administrador.
- **Backend:** API Express em TypeScript com Prisma, PostgreSQL, JWT e Socket.IO.
- **Dados:** modelos para utilizadores, agentes, administradores e pedidos/pings.

## Principais funcionalidades

- Localizacao de agentes M-Pesa no mapa.
- Pedido de atendimento para levantamento/deposito.
- Estados de agente: online, offline e em deslocacao.
- Reserva com token e tempo de expiracao.
- Historico de pedidos por utilizador.
- Login e registo para clientes, agentes e administradores.
- Painel administrativo com metricas e zonas criticas.
- Atualizacoes em tempo real via WebSocket.
- Modo de demonstracao com dados mockados no frontend quando a API nao esta disponivel.

## Stack tecnica

| Camada | Tecnologias |
| --- | --- |
| Frontend | Next.js, React, TypeScript, Tailwind CSS, Radix UI, Leaflet, Socket.IO Client |
| Backend | Node.js, Express, TypeScript, Prisma, PostgreSQL, JWT, Socket.IO |
| Dados | Prisma ORM, PostgreSQL |
| UI | Componentes reutilizaveis, lucide-react, shadcn-style components |

## Estrutura do projeto

```text
mpesa-smartinfo/
+-- backend/
|   +-- prisma/
|   |   +-- schema.prisma
|   |   +-- seed.ts
|   |   +-- migrations/
|   +-- src/
|       +-- controllers/
|       +-- middlewares/
|       +-- routes/
|       +-- services/
|       +-- sockets/
|       +-- server.ts
+-- frontend/
|   +-- app/
|   +-- components/
|   +-- hooks/
|   +-- lib/
|   +-- public/
+-- LICENSE
+-- README.md
```

## Requisitos

- Node.js 20 ou superior.
- PostgreSQL acessivel localmente ou remotamente.
- npm, pnpm ou outro gestor compativel com o projeto.

## Configuracao do backend

Entre na pasta do backend:

```bash
cd backend
npm install
```

Crie um ficheiro `.env` em `backend/`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
JWT_SECRET="troque-este-segredo-em-producao"
PORT=5000
HOST=0.0.0.0
CLIENT_URL="http://localhost:3000"
```

Prepare a base de dados:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

Inicie a API:

```bash
npm run dev
```

Por padrao, a API fica disponivel em:

```text
http://localhost:5000
http://localhost:5000/api
http://localhost:5000/health
```

## Configuracao do frontend

Entre na pasta do frontend:

```bash
cd frontend
npm install
```

Crie um ficheiro `.env.local` em `frontend/`:

```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
NEXT_PUBLIC_SOCKET_URL="http://localhost:5000"
```

Inicie a aplicacao:

```bash
npm run dev
```

Por padrao, o frontend fica disponivel em:

```text
http://localhost:3000
```

## Credenciais de demonstracao

O seed cria os seguintes dados para testes:

| Perfil | Credencial |
| --- | --- |
| Cliente | Nome: `Maria Joaquina` |
| Cliente | Codigo: `123456` |
| Admin | Email: `admin@smartinfo.co.mz` |
| Admin | Senha: `admin123` |

Agentes podem ser registados pela propria aplicacao ou pela rota da API.

## Rotas principais da API

| Metodo | Rota | Descricao |
| --- | --- | --- |
| POST | `/api/user/register` | Regista cliente |
| POST | `/api/user/login` | Autentica cliente |
| GET | `/api/user/profile` | Perfil do cliente autenticado |
| GET | `/api/user/pings` | Historico de pedidos do cliente |
| POST | `/api/agent/register` | Regista agente |
| POST | `/api/agent/login` | Autentica agente |
| GET | `/api/agent` | Lista agentes |
| PUT | `/api/agent/status` | Atualiza estado do agente |
| PUT | `/api/agent/location` | Atualiza localizacao do agente |
| POST | `/api/admin/login` | Autentica administrador |
| GET | `/api/admin/stats` | Retorna metricas administrativas |
| GET | `/api/admin/critical-zones` | Retorna zonas criticas |
| POST | `/api/ping` | Cria pedido de atendimento |
| GET | `/api/ping/active` | Lista pedidos ativos |
| PUT | `/api/ping/:pingId/accept` | Agente aceita pedido |
| PUT | `/api/ping/:pingId/status` | Atualiza estado do pedido |

## Scripts uteis

Backend:

```bash
npm run dev
npm run build
npm run start
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

Frontend:

```bash
npm run dev
npm run dev:lan
npm run build
npm run start
npm run lint
```

## Estado do projeto

Este repositorio representa uma demonstracao tecnica/prototipo funcional. Algumas areas ainda podem depender de dados simulados, especialmente no frontend quando o backend esta indisponivel.

Antes de qualquer uso em producao, recomenda-se:

- rever seguranca de autenticacao e autorizacao;
- substituir segredos padrao por variaveis seguras;
- validar fluxos de permissao por perfil;
- configurar observabilidade, logs e tratamento de erros;
- reforcar testes automatizados;
- rever conformidade legal, marca e privacidade de dados.

## Aviso sobre marca

Este projeto usa o nome **M-Pesa** como referencia ao contexto funcional da solucao. Salvo indicacao expressa em contrario, este repositorio nao declara afiliacao, patrocinio, endosso ou propriedade sobre marcas de terceiros.

## Licenca

Este repositorio e publico apenas para demonstracao, avaliacao e transparencia tecnica. O codigo, design, documentacao, arquitetura, fluxos e logica de negocio permanecem proprietarios.

Consulte [LICENSE](LICENSE) para os termos completos.

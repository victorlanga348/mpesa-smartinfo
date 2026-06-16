# Temporary Agent Endpoints

Nao ha endpoints REST para agentes temporarios.

O comportamento actual existe apenas via eventos Socket.io:

- `temporary-agent:requested`
- `temporary-agent:accepted`
- `temporary-agent:available`

Nao ha persistencia, autenticacao especifica ou validacao de payload.


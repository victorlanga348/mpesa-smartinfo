# Indexes

Indices e constraints encontrados:

- `User.code` unique.
- `Admin.email` unique.
- `Agent.phone` unique.
- `Transaction.pingId` unique.
- `AgentRating` unique composto: `[pingId, userId]`.
- `AgentRating.agentId` index.

Nao ha indices geoespaciais.


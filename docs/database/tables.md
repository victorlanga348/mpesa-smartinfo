# Tables

## User

Campos principais: `id`, `name`, `code`, `phone`, `latitude`, `longitude`, timestamps.

## Admin

Campos principais: `id`, `name`, `email`, `password`, timestamps.

## Agent

Campos principais: `id`, `name`, `phone`, `password`, `status`, `latitude`, `longitude`, `reference`, timestamps.

## Ping

Campos principais: `id`, `status`, `amount`, `operationType`, `userId`, `agentId`, `reservationToken`, `reservationExpires`, coordenadas, timestamps de lifecycle.

## Transaction

Campos principais: `id`, `pingId`, `userId`, `agentId`, `operationType`, `amount`, `status`.

## AgentRating

Campos principais: `id`, `pingId`, `userId`, `agentId`, `rating`, `comment`.


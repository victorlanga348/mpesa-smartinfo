# Reservation Endpoints

Nao ha endpoints dedicados de reserva.

Reservas sao representadas por campos do `Ping`:

- `reservationToken`
- `reservationExpires`

Endpoints que afectam reserva:

- `PUT /api/ping/:id/accept`
- `PUT /api/ping/:id/status`
- `GET /api/ping/:id`


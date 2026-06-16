# Liquidity Ping Flow

1. Cliente selecciona agente.
2. Informa tipo e valor.
3. Frontend garante sessao.
4. API cria `Ping` `PENDING`.
5. Agente recebe evento.
6. Agente aceita ou rejeita.
7. Cliente cancela, marca chegada ou aguarda conclusao.
8. Agente conclui.
9. Cliente avalia.


# Find Agent Flow

1. Mapa carrega agentes via `/api/agent`.
2. Se API falhar, usa `MOCK_AGENTS`.
3. Geolocalizacao tenta obter posicao do cliente.
4. Agentes sao ordenados por online e distancia.
5. Cliente selecciona marcador ou lista.


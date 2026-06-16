# Geolocation Architecture

Frontend usa browser Geolocation API.

## Cliente

Mapa guarda coordenadas em `smartinfo_client_location` para criar pings.

## Agente

Dashboard actualiza localizacao por REST e Socket.io enquanto em servico.

## Mapa

Leaflet mostra marcadores e calcula distancia Haversine para ordenacao.


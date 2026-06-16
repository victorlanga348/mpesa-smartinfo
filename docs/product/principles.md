# Principios

- Mostrar disponibilidade antes da deslocacao.
- Nao expor saldo real do agente.
- Usar localizacao apenas para descoberta operacional.
- Separar perfis de cliente, agente e admin por role.
- Preferir eventos em tempo real para mudancas operacionais.
- Manter fallback de demonstracao no frontend quando a API falha.

## Limites Actuais

- O frontend pode esconder falhas reais por usar mocks/localStorage.
- O backend nao tem politica detalhada de privacidade alem de nao expor passwords e nao mostrar saldo real.
- A autenticacao depende de JWT com segredo configuravel, mas ha fallback inseguro em codigo.


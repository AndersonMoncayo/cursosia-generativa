# stripe-migration/

Esta carpeta está preparada para la futura migración desde Stripe a Paddle (o viceversa).

## Estructura prevista (Fase 3)

```
stripe-migration/
├── README.md              ← Este archivo
├── config.ts              ← Configuración de proveedores
├── adapters/
│   ├── paddle.adapter.ts  ← Adapter para Paddle
│   └── stripe.adapter.ts  ← Adapter para Stripe (legacy)
└── utils/
    └── currency.ts        ← Normalización de monedas
```

## Principio de diseño

Los componentes de pago deben depender de interfaces, no implementaciones concretas.
Esto permite cambiar de proveedor sin afectar el resto del código.

## Estado actual

- [ ] Fase 3: Integrar Paddle Checkout embebido
- [ ] Paddle webhooks con verificación criptográfica
- [ ] Portal de cliente 
- [ ] Idempotencia por event_id

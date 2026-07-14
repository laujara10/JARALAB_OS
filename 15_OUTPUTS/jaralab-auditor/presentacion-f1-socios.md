---
title: "JaraLab Cash Control AI — Cierre de F0 y camino a F1"
type: presentacion
status: draft
owner: "Laura Jaramillo"
created: 2026-07-12
updated: 2026-07-12
version: 1.0
tags: [jaralab-auditor, cash-control-ai, f0, f1, presentacion, socios]
related: ["../../04_PRODUCTS/jaralab-auditor/MILESTONE-F0.md", "../../04_PRODUCTS/jaralab-auditor/spec.md", "roadmap-f1.md"]
---

# JaraLab Cash Control AI
### Cierre de F0 y camino a F1

*Línea de marca: Marketing (B2B/estrategia) — primario `#127475`.*

---

## El problema

Un restaurante independiente factura por tres o cuatro canales distintos —POS, transferencias, Nequi, QR— y el banco los recibe todos mezclados, sin decir de qué venta viene cada uno. Hoy, esa conciliación la hace una persona, a mano, mirando dos pantallas al mismo tiempo. Cuando algo no cuadra, se descubre tarde, o no se descubre nunca.

Pikeo, nuestro propio laboratorio, tenía exactamente ese problema. No un problema teórico: un problema que Laura vivía cada semana.

## Qué construimos

JaraLab Cash Control AI es un copiloto financiero diario. Un comando cruza las ventas del POS contra los movimientos bancarios del día y responde una sola pregunta antes que cualquier otra: **¿puedo estar tranquila hoy?**

Nunca dice "todo bien" sin evidencia. Si algo no cuadra, lo muestra con el número de factura real y la acción exacta para resolverlo. Si no hay ventas ese día, lo dice — no inventa un 100% de conciliación sobre cero datos.

## Resultado validado con datos reales de Pikeo

Primera ejecución real, un día completo de operación de Pikeo: **84.5% de conciliación automática**, sin que Laura tuviera que revisar una sola venta a mano para llegar ahí.

El número importa menos que cómo se consiguió. La primera corrida real dio 41.7% — y en vez de aceptarlo, auditamos cada excepción una por una. El hallazgo: el motor de matching funcionaba perfecto. El problema era que el sistema no reconocía todas las formas reales en que el banco describe un ingreso — "PAGO QR", una transferencia abreviada como "TRANSF". Corregimos la clasificación completa, no un parche puntual, y el número saltó a 84.5% sin tocar el algoritmo.

Esa es la tesis del producto: **el cuello de botella real no es la inteligencia artificial, es la calidad de los datos de entrada.** Y esa calidad solo se consigue operando contra datos reales — no se puede diseñar desde un documento de requisitos.

## Por qué esto es defendible

JaraLab nunca ofrece un sistema a un cliente externo sin validarlo primero en un laboratorio propio. Pikeo es ese laboratorio. Cada regla de clasificación, cada decisión de negocio (qué monto es el oficial, cómo se pool­ean dos cuentas bancarias, qué hacer con una fecha objetivo) nació de una operación real, no de una suposición. Eso es difícil de copiar sin pasar por el mismo camino: operar primero, construir después.

## Qué sigue: F1

F0 demostró que el algoritmo ya funciona. F1 ya no busca subir el porcentaje corrigiendo bugs de clasificación — busca **reducir cuántas decisiones humanas quedan**, dándole al sistema el contexto operativo que un motor exacto, por diseño, no puede resolver solo: cuándo un pago simplemente está en tránsito, y cuándo una decisión ya tomada por Laura debe convertirse en una regla que el sistema nunca vuelve a preguntar.

Detalle completo de objetivos y tiempos en `roadmap-f1.md`.

## Siguiente paso

*[Laura: completa esta sección según el propósito específico de la conversación — inversión, retroalimentación estratégica, o una introducción concreta. El resto del documento está listo; esta línea depende de qué le vas a pedir a la persona que lo lea.]*

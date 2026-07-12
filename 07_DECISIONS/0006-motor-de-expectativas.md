---
title: "ADR-0006 — El motor administra expectativas, no concilia el pasado"
type: decision
status: active
owner: "Laura Jaramillo"
created: 2026-07-08
updated: 2026-07-11
version: 1.0
tags: [jaralab-auditor, arquitectura, matching, expectativas]
related: ["../04_PRODUCTS/jaralab-auditor/spec.md", "../04_PRODUCTS/jaralab-auditor/blueprint-arquitectura.md", "0001-nucleo-determinista-ia-en-los-bordes.md"]
---

# ADR-0006 — El motor administra expectativas, no concilia el pasado

## Contexto

Un motor que compara "lo que pasó en el POS" contra "lo que pasó en el banco" marca como pendiente toda venta con tarjeta de ayer, porque los settlements de datáfono llegan T+1/T+2. El reporte generaría ruido legítimo todos los días, el gerente aprendería a ignorarlo, y un reporte ignorado es el peor destino posible para un producto que vende tranquilidad.

## Decisión

Cada venta POS electrónica genera una **expectativa de ingreso**: monto neto esperado (descontando comisión estimada por franquicia) y fecha de vencimiento según el ciclo del adquirente. El matching resuelve expectativas contra eventos bancarios. El reporte distingue tres estados: **conciliado** (llegó), **esperado aún-no-vence** (en tránsito, no molesta) y **vencido sin llegar** (la única alarma real). Tabla `expectations` en el modelo canónico.

## Alternativas descartadas

Matching retrospectivo puro: falsas alarmas diarias por dinero en tránsito. Ampliar la ventana de matching a 3 días sin estados: elimina el ruido pero también la señal — no distingue "viene en camino" de "ya debió llegar y no llegó", que es exactamente lo que el gerente compra.

## Consecuencias

El modelo de comisión y ciclo por franquicia/adquirente pasa de ser un detalle de F2 a un requisito del motor: se aprende del histórico y vive en el libro de reglas (ADR-0005). Aprobada por Laura el 2026-07-08.

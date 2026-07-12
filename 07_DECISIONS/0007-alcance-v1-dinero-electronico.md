---
title: "ADR-0007 — Alcance v1: solo dinero electrónico, con cobertura declarada"
type: decision
status: active
owner: "Laura Jaramillo"
created: 2026-07-08
updated: 2026-07-11
version: 1.0
tags: [jaralab-auditor, alcance, efectivo, producto]
related: ["../04_PRODUCTS/jaralab-auditor/spec.md", "../04_PRODUCTS/jaralab-auditor/blueprint-arquitectura.md", "0004-alcance-mvp-un-solo-canal.md"]
---

# ADR-0007 — Alcance v1: solo dinero electrónico, con cobertura declarada

## Contexto

El efectivo puede ser una porción importante de la venta de un restaurante colombiano, pero no llega al banco venta a venta: se consigna agregado, se usa para pagos menores o se queda en caja. Sin un registro de arqueo diario como fuente, el Auditor no puede auditarlo — y decir "todo cuadró" cubriendo solo una parte de la plata sería una promesa rota.

## Decisión

V1 audita exclusivamente dinero electrónico: transferencias, datáfonos, PSE, débitos y consignaciones. El reporte diario declara de forma explícita qué porcentaje de la venta del día está bajo auditoría, para que la cobertura parcial sea información y no engaño. El arqueo de caja entra como cuarta fuente en F3+, cuando el motor ya esté validado.

## Alternativas descartadas

Incluir arqueo de caja desde v1: agrega una cuarta fuente humana de baja calidad en la fase donde necesitamos validar el motor con las fuentes más limpias. Ignorar el tema sin declararlo: destruye la confianza el día que el gerente descubra el hueco.

## Consecuencias

El esquema ya contempla `kind = venta_efectivo` y `consignacion`, así que incorporar el arqueo en F3 es agregar un adaptador y reglas, no rediseñar. Riesgo comercial aceptado y conocido: la promesa de v1 es cobertura parcial honesta. Aprobada por Laura el 2026-07-08.

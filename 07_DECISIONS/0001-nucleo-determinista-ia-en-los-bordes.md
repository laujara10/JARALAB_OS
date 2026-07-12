---
title: "ADR-0001 — Núcleo determinista, IA en los bordes"
type: decision
status: active
owner: "Laura Jaramillo"
created: 2026-07-08
updated: 2026-07-11
version: 1.0
tags: [jaralab-auditor, arquitectura, ia, matching]
related: ["../04_PRODUCTS/jaralab-auditor/spec.md", "../04_PRODUCTS/jaralab-auditor/blueprint-arquitectura.md"]
---

# ADR-0001 — Núcleo determinista, IA en los bordes

## Contexto

El brief de JaraLab Auditor pide un "motor de matching inteligente" con porcentajes de confianza. La tentación natural es que un LLM decida las conciliaciones. Pero el producto vende confianza sobre dinero: cada resultado debe ser reproducible y explicable ante un contador o un auditor humano.

## Decisión

El núcleo del sistema — normalización, matching, auditoría de gastos — es código determinista: mismo input, mismo output, con traza de evidencia por cada match. La confianza es un score calculado de señales medibles (monto, tiempo, referencia, contraparte), calibrado con datos reales. El LLM participa solo en tres bordes: onboarding asistido de formatos nuevos, redacción de explicaciones en lenguaje humano, y capa conversacional sobre datos ya conciliados.

## Alternativas descartadas

LLM como motor de matching: no reproducible, "confianza" no calibrada, imposible de auditar, costo por corrida. Matching puramente exacto sin score: no resuelve pagos partidos, tolerancias ni settlements — el 30% del problema real.

## Consecuencias

Más trabajo inicial de ingeniería en el motor. A cambio: resultados auditables, costo marginal por día cercano a cero, y el sistema no se degrada si cambia el proveedor de IA — coherente con el principio del repositorio de que el conocimiento no depende del modelo.

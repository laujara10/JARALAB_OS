---
title: "ADR-0005 — Aprendizaje como libro de reglas explícito"
type: decision
status: active
owner: "Laura Jaramillo"
created: 2026-07-08
updated: 2026-07-11
version: 1.0
tags: [jaralab-auditor, aprendizaje, reglas, memoria]
related: ["../04_PRODUCTS/jaralab-auditor/spec.md", "../04_PRODUCTS/jaralab-auditor/blueprint-arquitectura.md", "0001-nucleo-determinista-ia-en-los-bordes.md"]
---

# ADR-0005 — Aprendizaje como libro de reglas explícito

## Contexto

El brief pide que el agente "aprenda" y "construya memoria": si el usuario ya validó que "Laura Jaramillo" equivale a "Bancolombia Transferencia", no debe volver a preguntar. La pregunta de diseño es dónde vive ese conocimiento.

## Decisión

El aprendizaje se materializa como una tabla `rules` en la base de datos: alias de contrapartes, tolerancias validadas, patrones recurrentes y tasas de comisión aprendidas. Cada regla registra de qué match nació, quién la validó y cuándo, y puede desactivarse. Las reglas se aplican antes del scoring en cada corrida. Cada confirmación manual de una sugerencia puede generar una regla nueva — así el sistema pregunta cada cosa una sola vez.

## Alternativas descartadas

Memoria implícita del LLM (contexto largo, memoria del proveedor): no inspeccionable, no portable entre modelos, no auditable — incompatible con el principio rector de JARALAB_OS y con la naturaleza del producto. Fine-tuning: costo y opacidad injustificables.

## Consecuencias

El conocimiento acumulado de cada restaurante es un activo en datos propios de JaraLab, exportable e inspeccionable. Un contador puede revisar el libro de reglas completo. Migrar de modelo de IA no pierde nada de lo aprendido.

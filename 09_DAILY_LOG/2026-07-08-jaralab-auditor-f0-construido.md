---
title: "Daily Log — F0 construido: ingesta, normalización y deduplicación"
type: log
status: active
owner: "Laura Jaramillo"
created: 2026-07-08
updated: 2026-07-08
version: 1.0
tags: [jaralab-auditor, f0, build-log, sprint-1]
related: ["../04_PRODUCTS/jaralab-auditor/plan-de-ejecucion.md"]
---

# 2026-07-08 — Sprint 1: F0 construido y en verde

## Qué se construyó

Repositorio `jaralab-auditor-code/` (junto a JARALAB_OS, código separado del conocimiento). Implementado: esquema SQLite completo del blueprint (5 tablas, restaurant_id en todas), tres adaptadores deterministas (Loggro, Bancolombia, gastos) con contrato de falla ruidosa, detección de fuente por contenido del archivo, normalización a eventos canónicos con clasificación conservadora de kind (lo dudoso queda `desconocido`, nunca se adivina), deduplicación por hash con soporte de re-ingesta y archivos solapados, CLI con `init`/`ingest`/`status`. 34 tests en verde cubriendo los casos A y B de la batería más el flujo end-to-end.

## Decisión de sesión

Los adaptadores se construyeron contra formatos asumidos documentados en cada archivo (los reales aún no llegan). Bug real encontrado y corregido por los tests: celdas vacías de pandas llegan como NaN y rompían la detección de vacíos y el hash de deduplicación — exactamente la clase de falla silenciosa que el diseño busca eliminar.

## Estado al cierre

F0 código-completo con datos sintéticos. **F0 NO está cerrado:** su criterio de aceptación exige validación contra un día real de Pikeo conciliado a mano. Pendiente de Laura: los tres archivos reales. Al recibirlos: recalibrar adaptadores, reemplazar fixtures sintéticos, crear el primer golden day, y solo entonces cerrar F0 con su learning en 08_LEARNINGS.

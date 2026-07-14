---
title: "ADR-0009 — Ingesta con fecha objetivo obligatoria"
type: decision
status: active
owner: "Laura Jaramillo"
created: 2026-07-12
updated: 2026-07-12
version: 1.0
tags: [jaralab-auditor, cash-control-ai, ingesta, bancolombia, hallazgo-operacional]
related: ["../04_PRODUCTS/jaralab-auditor/spec.md", "../04_PRODUCTS/jaralab-auditor/blueprint-arquitectura.md", "0002-adaptadores-por-fuente.md"]
---

# ADR-0009 — Ingesta con fecha objetivo obligatoria

## Contexto

Hallazgo operacional real, validado por Laura: Bancolombia no permite descargar un extracto de un solo día. Para auditar el 3 de julio, el banco obliga a descargar un rango (por ejemplo, del 3 al 4). Hasta ahora el sistema asumía que todo lo que llegaba en un archivo pertenecía a la corrida del día que se estaba auditando — supuesto que la operación real de Pikeo ya invalidó.

## Decisión

El usuario siempre indica explícitamente la fecha que quiere auditar (`--dia` en `ingest` y en `run`). Durante la ingesta, el sistema importa únicamente los movimientos cuya fecha pertenece al día solicitado; todos los movimientos de otras fechas presentes en el mismo archivo se ignoran por completo para esa corrida. No generan error ni advertencia — no están mal, simplemente pertenecen a otra auditoría que se hará otro día, con su propio comando.

Esta regla aplica a las tres fuentes (Loggro, banco, gastos) por igual, no solo a Bancolombia: cualquier archivo puede en principio traer más de un día de información, y el sistema nunca debe asumir que debe procesarlo todo.

## Alternativas descartadas

Procesar todos los días presentes en el archivo automáticamente: revive el riesgo exacto que ADR-0002 ya rechazó para el parser — el sistema "adivinando" alcance en vez de que el usuario lo declare, con el agravante de que aquí el error sería silencioso (datos de un día no solicitado entrando a la base sin que nadie lo pidiera). Advertir pero igual descartar los días fuera de rango: agrega ruido a una ingesta que debe sentirse limpia; el archivo trayendo más de un día es la norma operativa del banco, no una anomalía que merezca alarmar cada vez.

## Consecuencias

`ingest` deja de poder correrse sin `--dia` — es un cambio incompatible hacia atrás, deliberado. El mismo archivo de rango puede reutilizarse el día siguiente (con un `--dia` distinto) sin duplicar nada, gracias al dedupe ya existente (casos B2/B4). La arquitectura de eventos canónicos no cambia: el filtro ocurre antes de insertar, no es una regla nueva del modelo de datos, es una restricción de la orquestación de ingesta.

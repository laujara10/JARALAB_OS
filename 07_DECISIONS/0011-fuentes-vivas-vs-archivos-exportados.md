---
title: "ADR-0011 — Fuentes de datos vivas vs. archivos exportados: Google Sheets como fuente permanente"
type: decision
status: active
owner: "Laura Jaramillo"
created: 2026-07-12
updated: 2026-07-12
version: 1.0
tags: [jaralab-auditor, cash-control-ai, arquitectura, gastos, google-sheets, roadmap]
related: ["../04_PRODUCTS/jaralab-auditor/spec.md", "../04_PRODUCTS/jaralab-auditor/blueprint-arquitectura.md", "0002-adaptadores-por-fuente.md"]
---

# ADR-0011 — Fuentes de datos vivas vs. archivos exportados: Google Sheets como fuente permanente

## Contexto

El registro de gastos de Pikeo vive en un Google Sheets financiero — un documento vivo que se actualiza continuamente, no un reporte que alguien genera una vez al día. El diseño de v1 lo trataba como si fuera igual a un extracto bancario o una exportación de Loggro: un archivo que el usuario exporta y suelta en la carpeta de ingesta. Ese supuesto está mal de raíz, no es un detalle de implementación — un Sheet vivo es más parecido a una base de datos que a un archivo, y el producto debería tratarlo así incluso si v1 todavía no lee la API.

## Decisión

El Google Sheets financiero se reclasifica como **fuente de datos permanente**, no como archivo de exportación diaria. La exportación manual a CSV/Excel sigue siendo válida como mecanismo de entrada para el MVP — no se bloquea nada hoy — pero la arquitectura no debe asumir que seguirá siendo así. Sustituir la exportación manual por lectura directa del Sheet (API o sincronización) debe ser, cuando llegue el momento, un cambio pequeño y localizado, no un rediseño.

Esto ya es coherente con la arquitectura existente sin cambios de código: el adaptador de gastos (`gastos_sheet.py`) ya expone un contrato de "fila cruda → evento canónico" (`RawRow`) desacoplado de si el origen es un archivo local o una respuesta de API — el pipeline de normalización, matching y cierre nunca supo ni le importó de dónde vino la fila. La preparación real no es escribir código nuevo hoy: es no tomar decisiones futuras (nombres, esquemas, contratos) que asuman que siempre habrá un archivo de por medio.

Se adopta como principio general de JaraLab, no solo de este producto:

> **Nunca automatices un paso manual si puedes eliminarlo por completo.** Exportar un Google Sheet todos los días es un paso manual. La mejor automatización no es hacerlo más rápido — es hacer que desaparezca.

## Tabla de evolución de fuentes (MVP → versión final)

| Fuente | MVP | Versión final |
|---|---|---|
| Loggro | Exportación manual (`reporte_facturas`) | API o integración directa |
| Bancolombia | Extracto manual, por rango | Open Finance o integración si el banco la ofrece |
| Google Sheets (gastos) | Exportación manual a CSV/Excel | Lectura directa del Sheet (API) — el copiloto siempre ve la versión más reciente |

## Alternativas descartadas

Construir la integración con la API de Google Sheets ahora: retrasa el MVP por una automatización que no es indispensable para demostrar el producto — el objetivo de esta fase es la demo, no la integración. Diseñar el adaptador de gastos como "parser de CSV" en vez de "traductor a evento canónico": hubiera sido más rápido de escribir hoy, pero habría atado el contrato a la existencia de un archivo, exactamente lo que esta decisión evita.

## Consecuencias

Ningún cambio de código en esta ronda. Cuando se construya la lectura directa del Sheet, el trabajo real es una función nueva que produce `RawRow` a partir de la API en vez de un archivo — el resto del pipeline (normalización, dedupe, matching, cierre, Ritual Diario) no se entera del cambio. La misma lógica aplica en el futuro a Loggro y Bancolombia si alguna vez ofrecen integración directa: el patrón ya está validado con esta decisión, no hay que redescubrirlo.

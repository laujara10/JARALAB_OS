---
title: "Daily Log — Primer cierre real exitoso del Ritual Diario (F0 validado)"
type: log
status: active
owner: "Laura Jaramillo"
created: 2026-07-12
updated: 2026-07-12
version: 1.0
tags: [jaralab-auditor, cash-control-ai, milestone, f0, datos-reales, build-log]
related: ["../04_PRODUCTS/jaralab-auditor/spec.md", "../04_PRODUCTS/jaralab-auditor/MILESTONE-F0.md", "2026-07-12-validacion-datos-reales-pikeo.md", "2026-07-12-hallazgo-bancolombia-ingesta-fecha-objetivo.md"]
---

# 2026-07-12 — Primer cierre real exitoso del Ritual Diario (F0 validado)

## Qué se pidió

Correr por primera vez el copiloto contra la base de datos real de Pikeo (`auditor.db`), guiado paso a paso sin asumir conocimiento técnico, resolviendo cualquier error antes de continuar, hasta lograr una ejecución real completa del Ritual Diario.

## Qué pasó

Dos intentos. El primero falló silenciosamente en la parte de banco: los dos extractos de Bancolombia (`MovimientosTusCuentasBancolombia12Jul2026-4.xlsx` y `...-5.xlsx`) no traían "pikeo" ni "carolina" en el nombre de archivo, así que la detección de cuenta los rechazó con error — el resultado fue 0% de conciliación, no porque el motor fallara sino porque los movimientos bancarios nunca entraron a la base. Se diagnosticó con una consulta de solo lectura contra `auditor.db` (sin tocar nada) y se confirmó comparando `data/inbox/` contra `data/processed/`.

Laura renombró los archivos (`pikeo.xlsx`, y en un segundo ajuste `carolina.xlsx` — el primer intento `caro.xlsx` tampoco calzaba con la palabra completa que exige la detección). Con eso, y con el bug ya corregido de "factura ?" en el reporte de excepciones (la clave real del Loggro recalibrado es "factura no.", no "factura"), la segunda corrida fue limpia:

```
python3 -m auditor --config config/pikeo.yaml run --dia 2026-07-03
```

- Bancolombia Pikeo: 26 movimientos nuevos ingeridos.
- Bancolombia Carolina: 0 nuevos (los del día ya estaban de la corrida anterior).
- Loggro (reporte de facturas): 26 ventas reales del 2026-07-03.
- Matching: 7 exactos automáticos, 8 pendientes de decisión humana.
- Cierre: $4.300.305 vendido, $1.289.464 conciliado (41.7% de la venta electrónica), cobertura del 72% de la venta bajo auditoría.
- Ritual Diario mostró las 8 excepciones con número de factura real y el comando exacto de resolución para cada una.

Sin errores, sin datos sintéticos — Pikeo real, banco real, POS real.

## Por qué importa

Es la primera vez que el producto se ejecuta contra su propio caso de uso real, no contra fixtures. Cierra la puerta de F0 tal como la define `spec.md` §11 y confirma en producción tres decisiones de negocio que hasta ahora solo se habían validado por inspección de archivos (ADR-0009, ADR-0010) o por diseño (pooling de las dos cuentas Bancolombia).

## Qué no se hizo

No se implementó nada nuevo en esta sesión — los dos ajustes (nombre de archivo, bug de "factura ?") ya estaban corregidos de sesiones anteriores. El hito se documenta en `04_PRODUCTS/jaralab-auditor/MILESTONE-F0.md`, que además propone el objetivo de F1 sin empezar a construirlo.

## Aprendizaje

La detección de cuenta por nombre de archivo (excepción deliberada a ADR-0002, documentada en `banco_bancolombia.py`) es la pieza más frágil de la ingesta real: depende de que Laura nombre el archivo correctamente cada vez, y el sistema falla de forma ruidosa pero no obvia si el error scrollea fuera de una terminal pequeña. Vale la pena revisar en F1 si conviene relajar la coincidencia (aceptar abreviaciones como "caro") o si es preferible mantenerla estricta y solo mejorar la visibilidad del error.

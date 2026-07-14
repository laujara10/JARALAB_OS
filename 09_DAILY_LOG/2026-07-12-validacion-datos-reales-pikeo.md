---
title: "Daily Log — Primera validación contra datos reales de Pikeo"
type: log
status: active
owner: "Laura Jaramillo"
created: 2026-07-12
updated: 2026-07-12
version: 1.0
tags: [jaralab-auditor, cash-control-ai, validacion, datos-reales, build-log]
related: ["../04_PRODUCTS/jaralab-auditor/spec.md", "../07_DECISIONS/0010-calibracion-real-ventas-pos-fuente-de-verdad-del-monto.md", "../07_DECISIONS/0011-fuentes-vivas-vs-archivos-exportados.md"]
---

# 2026-07-12 — Primera validación contra datos reales de Pikeo

## Qué se encontró

Laura dejó por primera vez archivos reales de Pikeo en `data/inbox/` (dos extractos Bancolombia — Pikeo y Carolina — y un reporte de facturas). Se inspeccionaron sin tocar la base de datos real ni mover los archivos originales.

**Bancolombia:** columnas exactas a lo asumido, pero la fecha real trae hora (`2026-07-04 05:00:00`, no `DD/MM/YYYY`) — corregido, ambos formatos aceptados.

**Ventas POS (`reporte_facturas`):** estructura completamente distinta a lo asumido en F0. Se identificaron dos ambigüedades reales — dos fechas por factura y dos montos por factura — que Laura resolvió: fecha de referencia = "Fecha de pago", monto de conciliación = "Valor del pago" (no "Total"), con las diferencias entre ambos preservadas explícitamente, nunca perdidas.

## Qué se hizo

1. `banco_bancolombia.py` — acepta fecha con hora del extracto real, sin romper el formato provisional anterior.
2. `loggro.py` — reescrito completo contra el formato real (`Fecha de pago`, `Factura No.`, `Medio de pago`, `Valor del pago`, `Total`). Diferencias entre Total y Valor del pago se guardan en el evento (`_diferencia_total_vs_valor_pago`).
3. `07_DECISIONS/0010` — ADR de la calibración de ventas POS.
4. `07_DECISIONS/0011` — ADR de una decisión de arquitectura más amplia, planteada por Laura: Google Sheets es una fuente viva, no un archivo de exportación diaria. Sin implementación todavía; la arquitectura de adaptadores ya soporta el cambio sin rediseño cuando llegue el momento.
5. `spec.md` → v1.3, `blueprint-arquitectura.md` → v1.4.
6. Fixtures sintéticas (`LOGGRO_CSV`) recalibradas al formato real, manteniendo los mismos montos para no invalidar la cobertura de pruebas del motor de matching. Tests nuevos para la preservación de diferencias.
7. Validación directa contra los archivos reales (en copias temporales, sin tocar el `auditor.db` real de Laura): el extracto Bancolombia parsea limpio y confirma el rango de dos días; el reporte de facturas parsea 26 ventas reales del 3 de julio, con 6 diferencias reales entre Total y Valor del pago — la ambigüedad no era teórica.

## Qué no se hizo

No se tocó el `auditor.db` real ni se movieron los archivos originales de `data/inbox/` — siguen ahí, sin ingerir, esperando una corrida real cuando Laura lo decida. No se implementó ninguna integración con la API de Google Sheets (decisión explícita de Laura: preparar la arquitectura, no construirla todavía).

## Aprendizaje

El formato "provisional" documentado desde F0 fue efectivamente provisional en los dos sentidos que importaban: Bancolombia estaba cerca (un ajuste de formato de fecha) pero el POS estaba lejos (columnas completamente distintas, con dos ambigüedades de negocio reales que solo el archivo real reveló). Ninguna de las dos se hubiera encontrado sin datos reales — confirma la razón de ser de F0 en el plan de ejecución original: absorber esta sorpresa antes de construir el motor sobre datos limpios asumidos.

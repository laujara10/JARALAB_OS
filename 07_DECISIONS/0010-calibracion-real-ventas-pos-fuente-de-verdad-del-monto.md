---
title: "ADR-0010 — Calibración real de ventas POS: fuente de verdad del monto y la fecha"
type: decision
status: active
owner: "Laura Jaramillo"
created: 2026-07-12
updated: 2026-07-12
version: 1.0
tags: [jaralab-auditor, cash-control-ai, ingesta, ventas-pos, hallazgo-operacional]
related: ["../04_PRODUCTS/jaralab-auditor/spec.md", "../04_PRODUCTS/jaralab-auditor/blueprint-arquitectura.md", "0002-adaptadores-por-fuente.md", "0009-ingesta-con-fecha-objetivo-obligatoria.md"]
---

# ADR-0010 — Calibración real de ventas POS: fuente de verdad del monto y la fecha

## Contexto

El formato de ventas POS asumido en F0 (`Fecha, Hora, Factura, Medio de pago, Subtotal, Impoconsumo, Propina, Total`) nunca se validó contra un archivo real. El archivo real de Pikeo (`reporte_facturas`, validado 2026-07-12) trae una estructura distinta y dos ambigüedades que el formato asumido no tenía: dos fechas por factura (`Fecha Creación` vs `Fecha de pago`) y dos montos por factura (`Total` vs `Valor del pago`), que no siempre coinciden.

## Decisión

**Fecha de referencia: "Fecha de pago".** Es cuándo efectivamente se cobró, no cuándo se abrió la mesa — es lo que debe cuadrar contra el momento en que el banco recibe la plata.

**Monto de conciliación: "Valor del pago".** Es lo que quedó registrado como cobrado, y es el monto que se compara contra el banco. `Total` (el valor de la factura) se preserva íntegro en el evento para trazabilidad y análisis comercial — nunca se descarta, nunca se usa para conciliar.

**Diferencias entre ambos montos se preservan, nunca se pierden.** Cuando `Total` y `Valor del pago` difieren (descuentos, propinas, ajustes u otra razón de negocio — no necesariamente un error), el adaptador registra la diferencia explícitamente (`_diferencia_total_vs_valor_pago`) en el evento. No es una alarma ni un hallazgo de auditoría todavía (ese motor es F2) — es un dato conservado, disponible para cuando exista.

Validado contra el archivo real: 26 ventas del 2026-07-03, 6 de ellas con diferencia entre Total y Valor del pago — confirma que esta no era una ambigüedad teórica, es una situación real y frecuente en la operación de Pikeo.

## Alternativas descartadas

Usar "Total" como monto de conciliación: es el valor de la factura, no necesariamente lo que el banco recibió — hubiera generado falsos "no concilia" en las 6 facturas reales donde ya sabemos que difieren. Descartar la diferencia cuando existe: viola el principio de "nada se pierde" del repositorio (`00_IDENTITY/principios.md`) y le quita a JaraLab la posibilidad de analizar después por qué existen esas diferencias.

## Consecuencias

El adaptador de ventas POS (`loggro.py`) se reescribió completo contra el formato real; el fixture sintético (`LOGGRO_CSV`) se recalibró para reflejarlo, manteniendo los mismos montos que ya validaban el motor de matching para no invalidar esa cobertura de pruebas. Cuando exista el motor de auditoría (F2), la diferencia ya preservada en cada evento es la base para convertirla en un hallazgo visible del Ritual Diario, sin tener que volver a tocar el adaptador.

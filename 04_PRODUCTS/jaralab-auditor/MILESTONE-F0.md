---
title: "MILESTONE F0 — Cierre oficial"
type: milestone
status: closed
owner: "Laura Jaramillo"
created: 2026-07-12
updated: 2026-07-12
version: 2.0
tags: [jaralab-auditor, cash-control-ai, milestone, f0, datos-reales, cierre-oficial]
related: ["spec.md", "blueprint-arquitectura.md", "product-vision.md", "plan-de-ejecucion.md", "../../09_DAILY_LOG/2026-07-12-primer-cierre-real-exitoso-f0.md", "../../09_DAILY_LOG/2026-07-12-tabla-clasificacion-bancolombia.md", "../../07_DECISIONS/0009-ingesta-con-fecha-objetivo-obligatoria.md", "../../07_DECISIONS/0010-calibracion-real-ventas-pos-fuente-de-verdad-del-monto.md", "../../07_DECISIONS/0011-fuentes-vivas-vs-archivos-exportados.md"]
---

# MILESTONE F0 — Cierre oficial

**2026-07-12. F0 (fundación de datos) queda cerrado.** Primera ejecución real y completa de JaraLab Cash Control AI (`jaralab-auditor`) sobre datos reales de Pikeo, de punta a punta, con un solo comando. El resultado inicial (41.7% de auto-conciliación) se auditó a fondo, se corrigió la causa raíz encontrada, y se cerró con **84.5%** sobre el mismo día real.

## Checklist de cierre

- [x] Primera ejecución real sobre datos de Pikeo (Bancolombia Pikeo + Carolina, ventas POS Loggro reales del 2026-07-03).
- [x] Auditoría completa del matching: las 8 excepciones iniciales se diagnosticaron una por una, no se asumió el porcentaje.
- [x] Clasificación bancaria validada y corregida a raíz — el problema no era el motor de matching, era la clasificación de ingresos.
- [x] Tabla de patrones Bancolombia construida a partir de un inventario completo de los 38 movimientos bancarios reales del día (no de casos aislados).
- [x] 45/45 pruebas exitosas, incluida cobertura de regresión para cada patrón real corregido.
- [x] 84.5% de auto-conciliación alcanzado sobre el mismo día real, sin tocar el algoritmo de matching.
- [x] Las 4 pendientes restantes quedan formalmente reclasificadas como casos de negocio, no como bugs (ver sección dedicada).

## Qué ya funciona

- **Un solo comando ejecuta todo el pipeline**: `auditor run --dia YYYY-MM-DD` hace ingesta → matching → cierre → Ritual Diario en una sola corrida.
- **Ingesta con fecha objetivo obligatoria** (ADR-0009): cada corrida declara el día que audita; movimientos de otras fechas en el mismo archivo se ignoran sin error ni advertencia, sin importar la fuente.
- **Ingesta idempotente**: volver a soltar el mismo archivo no duplica datos (`dedupe_hash`).
- **Pooling automático de las dos cuentas Bancolombia** (Pikeo + Carolina) como un solo destino de recaudo, vía detección de cuenta por nombre de archivo — excepción deliberada y documentada a la regla general de "nunca detectar por nombre" (ADR-0002).
- **Adaptador de ventas POS calibrado contra el formato real de Loggro** (ADR-0010): usa "Valor del pago" como monto de conciliación y "Fecha de pago" como fecha de referencia; toda diferencia contra "Total" se preserva en el evento, nunca se pierde.
- **Clasificación bancaria de ingresos, calibrada contra datos reales**: transferencia (forma completa, "PAGO QR", y la abreviatura real "TRANSF"), consignación, reverso y rendimiento financiero cada uno con su propia etiqueta honesta — y solo transferencia/consignación pueden competir por un match de venta, nunca un reverso o un interés de cuenta.
- **Motor de matching exacto** (slice mínimo de F1): empareja ventas contra movimientos bancarios por monto exacto y mismo día.
- **Excepciones con evidencia real y accionables**: cada venta pendiente aparece con su número de factura real y el comando exacto para resolverla (`auditor detail`, `auditor resolve`).
- **Decisiones humanas sobreviven a recomputar**: un match ya confirmado o rechazado por Laura no se borra ni se recalcula en corridas futuras.
- **Ritual Diario honesto**: nunca reporta "todo bien" en falso — si no hay ventas del día, lo dice explícitamente; si hay excepciones, las muestra todas con evidencia, nunca las oculta.
- **Cobertura declarada**: el reporte siempre indica qué % de la venta está bajo auditoría (solo dinero electrónico en v1), nunca implica cobertura total cuando es parcial (ADR-0007).

## Qué datos reales fueron utilizados

- **Extracto Bancolombia, cuenta Pikeo** (`pikeo.xlsx`) — 26 movimientos reales del 2026-07-03.
- **Extracto Bancolombia, cuenta Carolina** (`carolina.xlsx`) — 12 movimientos reales del mismo día.
- **Reporte de facturas Loggro** (`reporte_facturas-3.xlsx`) — 26 ventas reales de Pikeo del 2026-07-03 (15 electrónicas, 11 en efectivo), con 6 mostrando diferencia real entre "Total" y "Valor del pago".

## Resultado final del cierre (2026-07-03)

| Métrica | Corrida original | Cierre F0 |
|---|---|---|
| % auto-conciliación | 41.7% | **84.5%** |
| Conciliado | $1.289.464 | **$2.613.213** |
| Matches automáticos | 7 | **11** |
| Pendientes | 8 | **4** |
| Vendido total | $4.300.305 | $4.300.305 |
| Cobertura bajo auditoría | 72% | 72% |

## Qué decisiones de negocio quedaron validadas

- **ADR-0009 — Fecha objetivo obligatoria**: confirmada en producción real; Bancolombia efectivamente nunca entrega un extracto de un solo día, y el filtro por fecha funcionó sin intervención manual.
- **ADR-0010 — Valor del pago como monto de conciliación**: confirmada contra el archivo real; 6 de 26 facturas reales tenían diferencia entre Total y Valor del pago, validando que la ambigüedad no era teórica.
- **Pooling de las dos cuentas Bancolombia**: confirmado en producción — los eventos de ambas cuentas se suman naturalmente en el cierre sin lógica adicional.
- **Clasificación bancaria de ingresos**: el salto de 41.7% a 84.5% sin tocar el algoritmo de matching demuestra que el cuello de botella real de F0 era la calidad de la clasificación de datos de entrada, no el motor. Queda validada la tabla de patrones construida a partir del inventario completo de los 38 movimientos reales del día.
- **Detección de cuenta por nombre de archivo**: funciona, pero es frágil — requiere que el nombre del archivo contenga la palabra completa ("pikeo" o "carolina"). Confirmado con un error real durante la sesión (`caro.xlsx` no fue reconocido, `carolina.xlsx` sí). Queda anotado como riesgo abierto, no corregido en F0.

ADR-0011 (Google Sheets como fuente viva) no se validó en esta corrida — sigue como arquitectura preparada, no implementada.

## Casos de negocio pendientes de investigación (no bugs — entran a F1)

Las 4 excepciones que quedaron después del cierre de F0 se investigaron una por una y ninguna tiene un patrón de clasificación bancaria sin reconocer detrás — se revisaron los 38 movimientos reales del día y ninguno calza, ni exacto ni parecido, con estos montos. Por eso dejan de tratarse como un problema del sistema y pasan a ser hipótesis de negocio para F1:

| Factura | Valor | Hipótesis principal | Confianza |
|---|---|---|---|
| PK688 | $123.100 | Liquidación con demora (no alcanzó a aparecer en el extracto del día) | Media |
| PK690 | $54.800 | Liquidación con demora | Media |
| PK691 | $253.866 (incluye propina $23.466) | Liquidación con demora; la propina como componente separado es una variable nueva a vigilar | Media-baja |
| "405" | $49.400 | Liquidación con demora; numeración de factura corta (sin prefijo "PK") distinta al resto — posible terminal o módulo distinto en Loggro, a confirmar con el proveedor | Media-baja |

Ninguna de las cuatro se resuelve escribiendo más código de clasificación — se resuelven con más días reales de datos y, eventualmente, con el motor de expectativas que distinga "en tránsito" de "vencida" (ADR-0006).

## Qué todavía NO hace el sistema

- **No hay tolerancia en el matching**: solo empareja por monto exacto. No maneja pagos partidos, comisiones de datáfono, ni desfases de monto por cualquier motivo.
- **No hay motor de expectativas** (ADR-0006): el sistema no distingue todavía entre "en tránsito, no vencida" y "vencida sin llegar" — toda venta no conciliada aparece como pendiente de decisión, sin ese matiz temporal.
- **No hay settlements de datáfono**: liquidaciones agrupadas de tarjeta no se reconocen como un caso especial.
- **No hay libro de reglas aprendidas** (ADR-0005): cada resolución es manual; el sistema no recuerda ni aplica automáticamente una decisión similar en el futuro.
- **No se auditan gastos ni efectivo**: el adaptador de gastos (Google Sheets) y el arqueo de caja no formaron parte de esta corrida.
- **No hay integración viva con Google Sheets**: la arquitectura está preparada (ADR-0011) pero no construida.
- **No hay interfaz más allá de la terminal**: el Ritual Diario se renderiza como texto plano en CLI, no hay dashboard web.
- **No se ha validado en Callejero**: solo Pikeo tiene datos reales probados.
- **No hay ejecución automática**: Laura debe correr el comando manualmente cada día.

## Qué riesgos siguen abiertos

- **Un solo día real probado.** El criterio de salida de F1 en `spec.md` (≥70% de auto-conciliación sobre 5 días reales consecutivos) todavía no tiene evidencia de varios días — hoy hay un único dato-punto, aunque ya en 84.5%.
- **Fragilidad de la detección de cuenta por nombre de archivo.** Ya causó un fallo real durante esta sesión. Sigue sin corregirse — queda como candidato de F1, no urgente.
- **Tiempos de liquidación bancaria reales desconocidos.** Sin el motor de expectativas, un pago con demora legítima se ve igual que una venta que nunca va a llegar — exactamente el problema que hoy tienen las 4 pendientes restantes.
- **Google Sheets de gastos sigue sin probarse en producción real.**
- **La tabla de clasificación bancaria es una lista fija, no un clasificador que aprende.** Cubre lo observado hasta hoy; un patrón nuevo en un día futuro puede volver a aparecer como "desconocido" — mitigado por el hábito ya establecido de auditar el matching en vez de asumir el porcentaje.

## Objetivo de F1 — cambio de enfoque

**F0 demostró que el problema principal no era el algoritmo — era la calidad de los datos de entrada.** Con la clasificación bancaria corregida, el matching exacto ya llega a 84.5% sin ningún cambio al motor. Esto cambia el objetivo de F1: **F1 ya no busca subir el % de auto-conciliación arreglando bugs de clasificación — busca reducir cuántas decisiones humanas quedan, incorporando reglas de negocio y contexto operativo real que el motor exacto, por diseño, no puede resolver solo.**

Concretamente, F1 debería:

1. **Motor de expectativas** (ADR-0006): clasificar cada venta no conciliada en "en tránsito, no vencida" vs. "vencida sin llegar", usando un umbral de tiempo calibrado con datos reales de liquidación — así una venta que solo tarda en aparecer deja de verse igual que una que realmente se perdió.
2. **Correr 5 días reales consecutivos de Pikeo** para tener evidencia real de cuánto de las pendientes restantes se resuelve solo con tiempo (liquidación) y cuánto necesita una regla de negocio explícita.
3. **Libro de reglas de negocio** (ADR-0005): cuando Laura resuelva manualmente un caso como las 4 pendientes de hoy, esa decisión debe quedar registrada como una regla reutilizable — el sistema no debería volver a preguntar por el mismo tipo de caso una vez ya tiene contexto operativo sobre él.
4. **Investigar las 4 hipótesis de negocio abiertas hoy** (tabla arriba) con más días de datos — sin escribir código de clasificación nuevo mientras no haya evidencia de que es, de nuevo, un problema de datos y no de negocio.
5. **Decidir si hace falta tolerancia** (comisiones de datáfono, ajustes menores) — solo si la evidencia de los 5 días lo pide, no por anticipado.

Explícitamente fuera de F1: gastos, efectivo, pagos partidos, Callejero, dashboard web — eso sigue en F2/F3 según `plan-de-ejecucion.md`. Y explícitamente fuera del *método* de F1: seguir cazando bugs de clasificación uno por uno cada corrida — F0 ya demostró que ese ciclo se cierra con un inventario completo, no con parches sucesivos.

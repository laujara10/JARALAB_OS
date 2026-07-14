---
title: "Daily Log — Tabla de clasificación completa de ingresos Bancolombia"
type: log
status: active
owner: "Laura Jaramillo"
created: 2026-07-12
updated: 2026-07-12
version: 1.0
tags: [jaralab-auditor, cash-control-ai, f0, bug-fix, clasificacion, bancolombia, build-log]
related: ["../04_PRODUCTS/jaralab-auditor/spec.md", "../04_PRODUCTS/jaralab-auditor/MILESTONE-F0.md", "2026-07-12-primer-cierre-real-exitoso-f0.md"]
---

# 2026-07-12 — Tabla de clasificación completa de ingresos Bancolombia

## Qué se pidió

La corrección puntual de "PAGO QR" confirmó que el 41.7% inicial no era un límite del motor de matching sino un problema de clasificación — pero destapó un segundo patrón real no reconocido ("TRANSF DE [nombre]", forma abreviada). Laura pidió parar de corregir patrón por patrón: construir un inventario completo de las descripciones bancarias reales de Pikeo y Carolina, agruparlas por texto y frecuencia, y proponer de una vez una tabla de clasificación completa antes de considerar F0 cerrado.

## Qué se hizo

1. **Inventario completo**, por consulta de solo lectura contra `auditor.db` real: 38 movimientos bancarios del 2026-07-03 (ambas cuentas), agrupados por descripción normalizada y frecuencia.
2. **Tabla de clasificación de ingresos** (`auditor/core/normalize.py`), en orden de evaluación:
   - `reverso` — reversos de un cargo o cobro previo (`REV COMPRA INTERNACIONAL DEBIT`, `REV IMPTO GOBIERNO 4X1000`). Dinero real, nunca el pago de una venta.
   - `rendimiento_financiero` — intereses de la cuenta (`ABONO INTERESES AHORROS`). Tampoco es una venta.
   - `consignacion` (sin cambios).
   - `transferencia` — ahora cubre forma completa, `PAGO QR [nombre]`, y la abreviatura real `TRANSF [nombre]` (`\btransf\b`, sin capturar por accidente "transferencia").
3. Dos kinds nuevos agregados al vocabulario canónico (`auditor/models.py`): `reverso`, `rendimiento_financiero`. Deliberadamente **no** se agregaron a `BANCO_KINDS_INGRESO` en `match.py` — nunca deben competir por un match de venta, sin importar que el monto coincida por azar.
4. Tests: batería completa de los 7 patrones reales observados, más una prueba explícita de que `reverso` y `rendimiento_financiero` están excluidos del pool de matching. 45/45 tests pasan.
5. Re-ejecución completa desde cero de `run --dia 2026-07-03` contra los mismos tres archivos reales, con el código corregido.

## Resultado

| | Con solo "PAGO QR" corregido | Con la tabla completa |
|---|---|---|
| % auto-conciliación | 50.1% | **84.5%** |
| Conciliado | $1.551.413 | **$2.613.213** |
| Matches automáticos | 10 | **11** |
| Pendientes | 5 | **4** |

Las 4 pendientes restantes (PK688 $123.100, PK690 $54.800, PK691 $253.866, factura "405" $49.400) no tienen ninguna descripción bancaria asociada en ningún patrón conocido — no aparecen en ningún extracto ingerido, ni exacto ni parecido. No son un problema de clasificación: son ventas para las que, hoy, no existe ningún movimiento bancario que revisar.

## Qué no se hizo

No se tocó la clasificación de egresos (`direction='out'`) más allá de lo que ya existía — no afecta al motor de matching, que solo mira ingresos. Tampoco se implementó ningún mecanismo genérico de aprendizaje de patrones (eso es ADR-0005, F2): esta tabla es una lista fija basada en los datos reales vistos hasta hoy, no un clasificador que se auto-actualiza.

## Aprendizaje

El primer bug ("PAGO QR") no era un caso aislado — era el primer síntoma visible de que la clasificación de ingresos se había escrito contra el formato asumido de F0, nunca contra datos reales. Corregir un patrón a la vez habría significado seguir descubriendo uno nuevo cada corrida real. El inventario completo, aunque tomó más tiempo que el parche puntual, es lo que de verdad cierra F0: la clasificación ya no depende de qué tan parecidos sean los próximos días a este, sino de que la tabla cubra la variedad real ya observada.

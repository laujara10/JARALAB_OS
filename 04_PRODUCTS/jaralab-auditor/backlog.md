---
title: "JaraLab Cash Control AI — Backlog"
type: backlog
status: active
owner: "Laura Jaramillo"
created: 2026-07-08
updated: 2026-07-11
version: 1.1
tags: [jaralab-auditor, cash-control-ai, backlog, epicas, tareas]
related: ["spec.md", "plan-de-ejecucion.md", "blueprint-arquitectura.md", "casos-de-prueba.md"]
---

# JaraLab Cash Control AI — Backlog

Las historias de usuario de cada épica viven en `spec.md` sección 5 (mismo ID de épica). Este documento contiene solo tareas ejecutables, prioridad, dependencias y estimación.

Prioridad: P0 = sin esto no hay producto · P1 = necesario para la fase indicada · P2 = valioso, no bloqueante. Estimación en sesiones de trabajo (~2–3h Laura + IA). Riesgo: qué tan probable es que esta pieza nos sorprenda.

## E1 — Ingesta y adaptadores (F0)

_Historia de usuario: ver `spec.md` sección 5._

| ID | Tarea | Prio | Depende de | Est. | Riesgo |
|----|-------|------|-----------|------|--------|
| E1.1 | Inspección documentada de los 3 formatos reales (columnas, encoding, rarezas) | P0 | Archivos reales | 0.5 | Alto — aquí aparecen las sorpresas |
| E1.2 | Contrato base de adaptador (`base.py`): parse, validate, falla ruidosa | P0 | E1.1 | 0.5 | Bajo |
| E1.3 | Adaptador Loggro + test de contrato | P0 | E1.2 | 1 | Medio |
| E1.4 | Adaptador banco + test de contrato | P0 | E1.2 | 1 | Alto — formatos bancarios son los más sucios |
| E1.5 | Adaptador registro de gastos + test de contrato | P0 | E1.2 | 0.5 | Medio — entrada humana |
| E1.6 | Detección de fuente por contenido (no por nombre de archivo) | P1 | E1.3–E1.5 | 0.5 | Bajo |
| E1.7 | Carpeta inbox vigilada + movido a processed con timestamp | P1 | E1.6 | 0.5 | Bajo |

## E2 — Modelo canónico y persistencia (F0)

_Historia de usuario: ver `spec.md` sección 5._

| ID | Tarea | Prio | Depende de | Est. | Riesgo |
|----|-------|------|-----------|------|--------|
| E2.1 | Esquema SQLite: events, expectations, matches, rules, daily_close (todas con restaurant_id) | P0 | — | 0.5 | Bajo |
| E2.2 | Dataclasses en models.py + config por restaurante (pikeo.yaml) | P0 | E2.1 | 0.5 | Bajo |
| E2.3 | Normalización filas crudas → eventos + clasificación kind | P0 | E1.3–E1.5, E2.2 | 1 | Medio |
| E2.4 | dedupe_hash e ingesta idempotente (re-subir no duplica) | P0 | E2.3 | 0.5 | Medio — diseño del hash es delicado |
| E2.5 | CLI: `auditor ingest`, `auditor status --dia` | P0 | E2.4 | 0.5 | Bajo |

## E3 — Motor de expectativas (F1) — ADR-0006

_Historia de usuario: ver `spec.md` sección 5._

| ID | Tarea | Prio | Depende de | Est. | Riesgo |
|----|-------|------|-----------|------|--------|
| E3.1 | Generación de expectativas por venta electrónica (monto neto + fecha de vencimiento) | P0 | E2, config franquicias | 1 | Medio |
| E3.2 | Ciclo T+n y comisión esperada por franquicia desde config (aprendida en F2) | P0 | E3.1 | 0.5 | Alto — datos reales dirán si el modelo aguanta |
| E3.3 | Vencimiento diario de expectativas y estados (abierta/conciliada/vencida) | P0 | E3.1 | 0.5 | Bajo |

## E4 — Motor de matching (F1 pasadas 1–3, F2 pasadas 4–6)

_Historia de usuario: ver `spec.md` sección 5._

| ID | Tarea | Prio | Depende de | Est. | Riesgo |
|----|-------|------|-----------|------|--------|
| E4.1 | Score de confianza con desglose de evidencia (score.py) | P0 | E2 | 1 | Medio |
| E4.2 | Pasada exactos: monto idéntico + fecha ±1 hábil + referencia/contraparte | P0 | E4.1 | 0.5 | Bajo |
| E4.3 | Pasada tolerancia con explicación de diferencia (GMF exacto, comisión, redondeo) | P0 | E4.2 | 1 | Medio |
| E4.4 | Umbrales: ≥95 auto / 70–94 sugerido / <70 excepción, configurables | P0 | E4.1 | 0.5 | Medio — se calibran en shadow mode |
| E4.5 | (F2) Pagos partidos: subset-sum acotado k≤4, ventana 72h, poda por contraparte | P1 | E4.3 | 1.5 | Alto — combinatoria y ambigüedad |
| E4.6 | (F2) Settlements datáfono: agrupar por franquicia/día, neto esperado vs depósito | P1 | E3.2, E4.3 | 1.5 | Alto — el caso más duro del dominio |
| E4.7 | (F2) Resolución de conflictos: un evento pertenece a un solo match; orden de pasadas | P1 | E4.5, E4.6 | 0.5 | Medio |

## E5 — Auditoría de gastos (F2)

_Historia de usuario: ver `spec.md` sección 5._

| ID | Tarea | Prio | Depende de | Est. | Riesgo |
|----|-------|------|-----------|------|--------|
| E5.1 | Débitos vs registro de gastos con período de gracia 48–72h configurable | P0 | E2, E4.1 | 1 | Medio |
| E5.2 | Detección de pagos duplicados a proveedor (mismo monto+contraparte en ventana) | P0 | E5.1 | 0.5 | Medio |
| E5.3 | Clasificación automática de cobros bancarios: GMF, comisiones, impuestos | P1 | E5.1 | 0.5 | Bajo |
| E5.4 | Cola de tareas para el gerente ("registra estos 3 gastos") separada de alertas | P1 | E5.1 | 0.5 | Bajo |

## E6 — Libro de reglas (F2) — ADR-0005

_Historia de usuario: ver `spec.md` sección 5._

| ID | Tarea | Prio | Depende de | Est. | Riesgo |
|----|-------|------|-----------|------|--------|
| E6.1 | Tabla rules + aplicación de alias/patrones antes del scoring | P0 | E4.3 | 1 | Medio |
| E6.2 | Creación de regla desde confirmación manual de una sugerencia | P0 | E6.1 | 0.5 | Bajo |
| E6.3 | Comisión por franquicia aprendida del histórico → regla | P1 | E4.6 | 1 | Medio |
| E6.4 | Desactivación y precedencia de reglas (auditables, con origen) | P1 | E6.1 | 0.5 | Bajo |

## E7 — Reporte diario (v1 en F1, completo en F2)

_Historia de usuario: ver `spec.md` sección 5._

| ID | Tarea | Prio | Depende de | Est. | Riesgo |
|----|-------|------|-----------|------|--------|
| E7.1 | Cálculo de daily_close (vendido, conciliado, en tránsito, vencido, cobertura %) | P0 | E3, E4 | 0.5 | Bajo |
| E7.2 | Reporte HTML autocontenido: KPIs + 3 estados + % de venta auditada (ADR-0007) | P0 | E7.1 | 1 | Bajo |
| E7.3 | Bandeja de excepciones con evidencia y acción sugerida por ítem | P0 | E7.2 | 1 | Medio |
| E7.4 | (F2) Confirmación de sugerencias desde el reporte → alimenta reglas | P1 | E7.3, E6.2 | 1 | Medio |

## E8 — Anomalías (F3)

_Historia de usuario: ver `spec.md` sección 5._

| ID | Tarea | Prio | Depende de | Est. | Riesgo |
|----|-------|------|-----------|------|--------|
| E8.1 | Baselines por día de semana desde daily_close (30+ días de histórico) | P1 | E7.1 acumulando | 1 | Medio |
| E8.2 | Señales v1 de alta precisión: débito inusual de alto valor, caída de transferencias, ingreso duplicado | P1 | E8.1 | 1 | Alto — ruido erosiona confianza |

## E9 — Bordes de IA (F3) — ADR-0001

_Historia de usuario: ver `spec.md` sección 5._

| ID | Tarea | Prio | Depende de | Est. | Riesgo |
|----|-------|------|-----------|------|--------|
| E9.1 | Explicaciones LLM redactadas desde la evidencia determinista, nunca contra ella | P1 | E4, E5 | 1 | Medio |
| E9.2 | Canal Telegram: reporte diario + preguntas sobre la base de datos | P1 | E9.1 | 1.5 | Medio |
| E9.3 | (Post-F3) Onboarding asistido de adaptadores nuevos (ADR-0002) | P2 | E1 | 1.5 | Medio |

## E10 — Calidad y operación (transversal, desde F0)

| ID | Tarea | Prio | Depende de | Est. | Riesgo |
|----|-------|------|-----------|------|--------|
| E10.1 | Golden days: días reales completos con resultado esperado, corren como regresión | P0 | E2.5 | 0.5 + continuo | Bajo |
| E10.2 | Protocolo shadow mode: comparación diaria Auditor vs humano, registro de discrepancias | P0 | E7.2 | continuo | Bajo |
| E10.3 | Anonimización de fixtures antes de entrar a git | P0 | E1 | 0.5 | Bajo |
| E10.4 | Learning en 08_RESEARCH + log en 09_DAILY_LOG al cierre de cada fase | P0 | — | continuo | Bajo |

## Resumen de carga estimada

F0: ~4 sesiones · F1: ~6 · F2: ~6 · F3: ~5. Total ~21 sesiones de trabajo efectivo, sin contar los días calendario del shadow mode (que corren solos). Las estimaciones de E4.5, E4.6 y E8.2 son las menos confiables — son los ítems de riesgo alto y se re-estiman al llegar.

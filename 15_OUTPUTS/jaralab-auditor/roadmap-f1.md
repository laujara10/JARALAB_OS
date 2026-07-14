---
title: "Roadmap F1 — JaraLab Cash Control AI"
type: roadmap
status: draft
owner: "Laura Jaramillo"
created: 2026-07-12
updated: 2026-07-12
version: 1.0
tags: [jaralab-auditor, cash-control-ai, f1, roadmap]
related: ["../../04_PRODUCTS/jaralab-auditor/MILESTONE-F0.md", "../../04_PRODUCTS/jaralab-auditor/spec.md", "../../04_PRODUCTS/jaralab-auditor/plan-de-ejecucion.md", "presentacion-f1-socios.md"]
---

# Roadmap F1 — JaraLab Cash Control AI

Las estimaciones de tiempo son calendario, no esfuerzo puro — asumen que este proyecto avanza en paralelo a la operación real de Pikeo y no es dedicación de tiempo completo. Son un punto de partida, no un compromiso: no hay todavía velocidad histórica del equipo (Laura + Claude) sobre este producto para calibrarlas mejor.

## Objetivo de F1

**Reducir cuántas decisiones humanas quedan pendientes cada día, no subir el % de matching corrigiendo bugs.** F0 ya demostró que el motor exacto funciona: 84.5% de auto-conciliación sin cambiar el algoritmo, solo corrigiendo la calidad de los datos de entrada. Lo que falta ahora es contexto operativo que un motor de coincidencia exacta, por diseño, no puede tener solo.

## Puerta de salida de F1 (criterio de aceptación, `spec.md` §11)

- ≥70% de auto-conciliación en dinero sobre 5 días reales consecutivos.
- Cero falsos positivos.
- Ninguna venta en tránsito genera alarma.
- Todo match automático muestra su evidencia.

## Workstreams

### 1. Motor de expectativas (ADR-0006)
**Estimación: 1–2 semanas.**
Clasificar cada venta no conciliada en dos estados honestos: "en tránsito, no vencida" vs. "vencida sin llegar", con un umbral de tiempo calibrado contra datos reales de liquidación bancaria. Es el cambio que evita que un pago que simplemente tarda un día se vea igual que uno que realmente se perdió — hoy las 4 pendientes que quedaron de F0 caen exactamente en esa ambigüedad.

### 2. Correr 5 días reales consecutivos de Pikeo
**Estimación: 1 semana calendario** (corre en paralelo a los demás workstreams — es tiempo de operación real, no de desarrollo).
El criterio de salida de F1 exige evidencia de varios días, no de uno. Cada corrida real es también la fuente de datos para calibrar el umbral del motor de expectativas y para confirmar o descartar las hipótesis de negocio abiertas.

### 3. Libro de reglas de negocio (ADR-0005)
**Estimación: 1–2 semanas.**
Cuando Laura resuelve manualmente una excepción, esa decisión debe quedar registrada como una regla reutilizable, con su origen (de qué match nació), quién la validó y cuándo — y debe poder desactivarse sin borrarse. Sin esto, el sistema le va a preguntar a Laura por el mismo tipo de caso una y otra vez, que es exactamente lo que F1 busca evitar.

### 4. Investigar las hipótesis de negocio abiertas en el cierre de F0
**Estimación: continuo durante los 5 días** (no es un bloque de trabajo aparte).
Las 4 pendientes que quedaron el 2026-07-03 (PK688, PK690, PK691, factura "405") no tienen ningún patrón de clasificación bancaria sin reconocer detrás — se auditaron una por una. La hipótesis principal es liquidación con demora; con más días reales se confirma o se descarta, y solo entonces se decide si necesitan una regla de negocio propia.

### 5. Decisión sobre tolerancia en el matching
**Estimación: evaluación de medio día, al final del workstream 2** (no es una implementación por adelantado).
Solo si la evidencia de los 5 días reales lo pide — por ejemplo, si aparece un patrón consistente de comisión de datáfono fija — se decide si vale la pena una primera forma acotada de tolerancia. No se implementa por anticipado.

## Estimación total

**3–4 semanas calendario**, con los workstreams 1 y 3 corriendo en paralelo al workstream 2 (los 5 días reales), y el workstream 5 como cierre condicional al final.

## Explícitamente fuera de alcance de F1

- Gastos (Google Sheets) y efectivo — siguen en F2/F3.
- Pagos partidos y settlements de datáfono — F2.
- Validación en Callejero (segundo laboratorio) — después de cerrar F1 en Pikeo.
- Dashboard web — evolución natural del CLI, sin fecha todavía.
- Seguir corrigiendo patrones de clasificación uno por uno — F0 ya cerró ese ciclo con un inventario completo; si aparece un patrón nuevo en F1, se trata primero como pregunta ("¿es un caso nuevo o el mismo patrón con otro nombre?"), no como parche inmediato.

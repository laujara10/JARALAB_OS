---
title: "Daily Log — Hallazgo operacional Bancolombia: ingesta con fecha objetivo obligatoria"
type: log
status: active
owner: "Laura Jaramillo"
created: 2026-07-12
updated: 2026-07-12
version: 1.0
tags: [jaralab-auditor, cash-control-ai, bancolombia, ingesta, hallazgo-operacional, build-log]
related: ["../04_PRODUCTS/jaralab-auditor/spec.md", "../07_DECISIONS/0009-ingesta-con-fecha-objetivo-obligatoria.md"]
---

# 2026-07-12 — Hallazgo operacional Bancolombia: ingesta con fecha objetivo obligatoria

## Qué se pidió

Laura validó operando de verdad que Bancolombia no permite descargar un extracto de un solo día — siempre entrega un rango (ej. 3 y 4 de julio juntos). Pidió convertir esto en una regla permanente del producto: el usuario declara la fecha objetivo de cada auditoría, y el sistema solo importa los movimientos de ese día, ignorando el resto sin error ni advertencia. Pidió explícitamente que no fuera un parche para la demo sino un cambio de especificación y de código.

## Qué se hizo

1. `07_DECISIONS/0009-ingesta-con-fecha-objetivo-obligatoria.md` — nuevo ADR con contexto, decisión, alternativas descartadas y consecuencias.
2. `spec.md` → v1.1 — nueva regla de negocio (sección 9) y ajuste al paso de ingesta del flujo funcional (sección 6), ambos citando ADR-0009. Historial actualizado.
3. `blueprint-arquitectura.md` → v1.3 — el párrafo de "ingesta operativa v1" ya no puede sugerir que se procesa "todo lo que traiga el archivo"; ahora refleja la fecha objetivo obligatoria.
4. Código (`jaralab-auditor-code`): `cmd_ingest` exige `--dia` y filtra los eventos normalizados a esa fecha antes de insertar — el filtro aplica por igual a las tres fuentes (Loggro, banco, gastos), no solo a Bancolombia. `cmd_run` propaga el `--dia` que ya recibía. Cambio incompatible hacia atrás en el CLI.
5. Tests: los 5 usos existentes de `ingest` en `test_cli.py` se actualizaron con `--dia`. Se agregaron dos tests nuevos: uno prueba exactamente el caso real (extracto con dos días, solo uno entra, sin error) y otro prueba que el mismo archivo de rango se puede reutilizar en corridas de días distintos sin pisar datos.

## Qué no cambió

El modelo de datos canónico no cambió — el filtro ocurre en la orquestación de ingesta (`cli.py`), no en el esquema. Ningún ADR anterior se contradijo; ADR-0002 (adaptadores por fuente, nunca por nombre) queda intacto y de hecho es la base de la alternativa descartada en ADR-0009.

## Aprendizaje

El diseño de matching/close ya filtraba eventos por día en las consultas (`events_for_day`), lo cual ocultó este problema hasta que Laura probó con la restricción real del banco: el motor podía "ver" solo un día aunque la base tuviera varios, pero la base sí estaba acumulando días que nadie había pedido auditar todavía. La disciplina de declarar el alcance en la ingesta, no solo en la consulta, es la que evita que datos de un día no solicitado entren silenciosamente al sistema.

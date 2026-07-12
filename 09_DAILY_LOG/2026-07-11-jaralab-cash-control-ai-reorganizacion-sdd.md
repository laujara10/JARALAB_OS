---
title: "Daily Log — Reorganización a Spec-Driven Development y adopción de JaraLab Cash Control AI"
type: log
status: active
owner: "Laura Jaramillo"
created: 2026-07-11
updated: 2026-07-11
version: 1.0
tags: [jaralab-auditor, cash-control-ai, spec-driven-development, reorganizacion, build-log]
related: ["../04_PRODUCTS/jaralab-auditor/spec.md", "../04_PRODUCTS/jaralab-auditor/propuesta-reorganizacion-sdd.md", "../07_DECISIONS/0008-nombre-de-mercado-cash-control-ai.md"]
---

# 2026-07-11 — Reorganización a Spec-Driven Development y adopción de "JaraLab Cash Control AI"

## Qué se pidió

Laura pidió crear una spec para "JaraLab Cash Control AI". Antes de escribir nada se detectó que el producto ya existía documentado como `jaralab-auditor` (blueprint v1.1, backlog, plan de ejecución, 40 casos de prueba, 7 ADRs, F0 construido con datos sintéticos). Laura confirmó que es el mismo producto y pidió evolucionarlo, no duplicarlo, adoptando formalmente Spec-Driven Development (SDD).

## Qué se hizo

1. Se redactó y presentó `propuesta-reorganizacion-sdd.md` con diagnóstico, mapeo de roles SDD y plan de cambios. Aprobada por Laura sin modificaciones.
2. Se creó `spec.md` v1.0 — fuente única de verdad del producto: objetivo, contexto, alcance, usuarios, historias de usuario, flujo funcional, requisitos funcionales y no funcionales, reglas de negocio, casos borde (por referencia), criterios de aceptación, riesgos, métricas de éxito y extensiones futuras.
3. Se creó `07_DECISIONS/0008-nombre-de-mercado-cash-control-ai.md`: el nombre de mercado pasa a "JaraLab Cash Control AI"; el nombre interno `jaralab-auditor` y el slug del repositorio no cambian.
4. Se editó `blueprint-arquitectura.md` → v1.2: se retiró la sección "Tesis del producto" (movida a `spec.md`), queda como plan puramente técnico, con nota de redirección y `related` actualizado.
5. Se editó `backlog.md` → v1.1: se retiraron las líneas "Historia:" de las 9 épicas (movidas a `spec.md` sección 5), queda como tareas ejecutables puras.
6. Se actualizó `related` en `plan-de-ejecucion.md`, `casos-de-prueba.md` y en los ADRs 0001–0007 para apuntar a `spec.md`, sin tocar el contenido de ninguna decisión.

## Qué no cambió

Ningún ADR cambió su decisión, contexto, alternativas o consecuencias. No se tocó código. No se renombró la carpeta `jaralab-auditor` ni el repositorio de código. No se avanzó ninguna fase del roadmap (sigue en F0, pendiente de los archivos reales de Pikeo).

## Arquitectura documental resultante

`spec.md` (qué y por qué) → `07_DECISIONS/0001–0008` (no negociables) → `blueprint-arquitectura.md` (cómo, arquitectura) → `backlog.md` (en qué orden, tareas) → `plan-de-ejecucion.md` (roadmap por fases) → `casos-de-prueba.md` (validación). Todo enlazado por `related` en el frontmatter.

## Aprendizaje

La spec como documento separado no era trabajo nuevo — era información que ya existía pero estaba repartida sin un punto de entrada único. El costo de adoptar SDD aquí fue de reorganización, no de investigación: la disciplina de documentación que JARALAB_OS ya exige (ADRs, versionado, `related`) hizo el mapeo casi mecánico.

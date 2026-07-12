---
title: "ADR-0008 — Nombre de mercado: JaraLab Cash Control AI"
type: decision
status: active
owner: "Laura Jaramillo"
created: 2026-07-11
updated: 2026-07-11
version: 1.0
tags: [jaralab-auditor, cash-control-ai, naming, producto, spec-driven-development]
related: ["../04_PRODUCTS/jaralab-auditor/spec.md", "../04_PRODUCTS/jaralab-auditor/blueprint-arquitectura.md", "../04_PRODUCTS/jaralab-auditor/propuesta-reorganizacion-sdd.md"]
---

# ADR-0008 — Nombre de mercado: JaraLab Cash Control AI

## Contexto

El producto se documentó originalmente bajo el nombre de mercado "JaraLab Auditor" (nombre interno "Finance Agent 001", slug de repositorio `jaralab-auditor`). Laura solicitó adoptar "JaraLab Cash Control AI" como nombre de mercado y formalizar la adopción de Spec-Driven Development para el producto. Se confirmó explícitamente que no se trata de un producto nuevo: es la evolución del mismo sistema ya documentado en `04_PRODUCTS/jaralab-auditor/`, con blueprint, backlog, plan de ejecución, batería de casos de prueba y F0 ya construido con datos sintéticos.

## Decisión

El nombre de mercado pasa de "JaraLab Auditor" a **"JaraLab Cash Control AI"**. El nombre interno (`jaralab-auditor`, "Finance Agent 001") y el slug de carpeta/repositorio de código no cambian, para no romper los enlaces relativos ya existentes en los ADRs 0001–0007, los daily logs de kickoff y construcción de F0, y el repositorio de código `jaralab-auditor-code`. `spec.md` es la nueva fuente única de verdad del producto y usa el nombre de mercado vigente.

## Alternativas descartadas

Renombrar también la carpeta a `jaralab-cash-control`: obliga a reescribir las rutas relativas de 7 ADRs y 3 daily logs, y desalinea el nombre del repositorio de código real del nombre del repositorio de conocimiento — costo de fricción sin beneficio, dado que el cambio es de posicionamiento comercial, no de arquitectura ni de identidad técnica del sistema.

## Consecuencias

Toda mención futura de "JaraLab Cash Control AI" en materiales de mercado, propuestas comerciales o comunicación externa se refiere a este mismo producto. El repositorio de conocimiento y el de código conservan `jaralab-auditor` como identificador técnico estable, evitando reescritura de historial. Este ADR se cita si en el futuro se reabre la pregunta de renombrar la carpeta.

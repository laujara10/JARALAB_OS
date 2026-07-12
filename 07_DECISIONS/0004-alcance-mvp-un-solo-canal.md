---
title: "ADR-0004 — Alcance MVP: un solo canal de salida"
type: decision
status: active
owner: "Laura Jaramillo"
created: 2026-07-08
updated: 2026-07-11
version: 1.0
tags: [jaralab-auditor, mvp, alcance, producto]
related: ["../04_PRODUCTS/jaralab-auditor/spec.md", "../04_PRODUCTS/jaralab-auditor/blueprint-arquitectura.md"]
---

# ADR-0004 — Alcance MVP: un solo canal de salida

## Contexto

El brief pide interfaz web, Telegram y capa conversacional desde el flujo ideal. Tres interfaces antes de validar el motor es construir fachada sin edificio, y multiplica la superficie de mantenimiento para una persona sola.

## Decisión

El MVP tiene una sola salida: el reporte diario HTML con KPIs del cierre y bandeja de excepciones. Telegram y la capa conversacional entran en F3, después de que el motor demuestre ≥85% de auto-conciliación y cero falsos positivos en Pikeo y Callejero. La arquitectura ya los habilita: todos los eventos y matches viven en una base de datos consultable por un LLM, así que agregar conversación después es un borde, no una reescritura.

## Alternativas descartadas

Telegram como canal primario del MVP: agrega gestión de bot, estados de conversación y autenticación antes de tener algo confiable que comunicar. Web app desde v1: mismo argumento.

## Consecuencias

El MVP se enfoca en la única pregunta que importa: ¿el motor concilia bien? Riesgo aceptado: la demo es menos vistosa durante las primeras semanas. Este ADR se cita cada vez que aparezca la tentación de agregar un canal antes de F3.

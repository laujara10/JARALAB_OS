---
title: "ADR-0002 — Adaptadores por fuente, no parser universal"
type: decision
status: active
owner: "Laura Jaramillo"
created: 2026-07-08
updated: 2026-07-11
version: 1.0
tags: [jaralab-auditor, ingesta, parsers]
related: ["../04_PRODUCTS/jaralab-auditor/spec.md", "../04_PRODUCTS/jaralab-auditor/blueprint-arquitectura.md", "0001-nucleo-determinista-ia-en-los-bordes.md"]
---

# ADR-0002 — Adaptadores por fuente, no parser universal

## Contexto

El brief pide leer "automáticamente todos los archivos, sin configuración manual, reconociendo formatos diferentes". Un parser universal basado en IA puede leer mal una columna un día y reportar cifras incorrectas sin avisar — el peor modo de falla posible para un auditor financiero.

## Decisión

Un adaptador determinista por fuente (Loggro, banco, registro de gastos), con tests de contrato que fallan ruidosamente si el formato cambia. Para fuentes nuevas, el LLM analiza el archivo y propone el adaptador; un humano lo valida contra un día conocido; desde ahí es código determinista. La experiencia del usuario se mantiene ("le das el archivo y lo entiende") sin apostar la confiabilidad del núcleo.

## Alternativas descartadas

Parser universal con LLM en producción: falla silenciosa, costo por archivo, no auditable. Configuración manual de columnas por el usuario: fricción de onboarding que mata la promesa del producto.

## Consecuencias

Agregar un banco o POS nuevo toma horas, no cero — es el precio de que nunca se lea mal un extracto. El catálogo de adaptadores se vuelve un activo acumulable de JaraLab (cada banco soportado es una barrera de entrada más).

---
title: "ADR-0003 — Stack: monolito modular Python + SQLite"
type: decision
status: active
owner: "Laura Jaramillo"
created: 2026-07-08
updated: 2026-07-11
version: 1.0
tags: [jaralab-auditor, stack, infraestructura]
related: ["../04_PRODUCTS/jaralab-auditor/spec.md", "../04_PRODUCTS/jaralab-auditor/blueprint-arquitectura.md"]
---

# ADR-0003 — Stack: monolito modular Python + SQLite

## Contexto

El sistema lo construye y mantiene Laura con asistencia de IA, sin equipo de ingeniería. La decisión de stack debe optimizar para mantenibilidad por una persona, no para una escala que aún no existe.

## Decisión

Monolito modular en Python 3.12 con pandas, SQLite como base de datos, pdfplumber solo como último recurso (preferencia dura por exports CSV/Excel), reporte HTML autocontenido como única salida, operado por CLI. Sin cloud, sin Docker, sin servidor en v1. El repositorio completo debe caber en el contexto de un agente de IA.

## Alternativas descartadas

Microservicios / cloud desde el inicio: sobre-ingeniería sin usuarios. Low-code (n8n/Make): rápido al inicio pero el motor de matching con subset-sum, scoring y settlements no se expresa bien en nodos, y el conocimiento quedaría atrapado en una plataforma — contra el principio del repositorio. Postgres desde el día uno: administración innecesaria para 1–2 restaurantes.

## Consecuencias

Ruta de escala definida y barata: SQLite→Postgres con 3+ restaurantes, HTML→panel web con demanda real, CLI→servicio programado. Ningún componente de v1 se tira para crecer; se reemplazan bordes. Límite conocido: sin interfaz multiusuario en v1 — aceptable porque los usuarios de v1 son los laboratorios propios.

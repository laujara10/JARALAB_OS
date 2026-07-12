---
title: "Propuesta — Reorganización a Spec-Driven Development y adopción de 'JaraLab Cash Control AI'"
type: proposal
status: implemented
owner: "Laura Jaramillo"
created: 2026-07-11
updated: 2026-07-11
version: 1.0
tags: [jaralab-auditor, cash-control-ai, spec-driven-development, reorganizacion, propuesta]
related: ["blueprint-arquitectura.md", "backlog.md", "plan-de-ejecucion.md", "casos-de-prueba.md", "../../07_DECISIONS/0001-nucleo-determinista-ia-en-los-bordes.md", "../../07_DECISIONS/0002-adaptadores-por-fuente.md", "../../07_DECISIONS/0003-stack-monolito-python-sqlite.md", "../../07_DECISIONS/0004-alcance-mvp-un-solo-canal.md", "../../07_DECISIONS/0005-aprendizaje-como-libro-de-reglas.md", "../../07_DECISIONS/0006-motor-de-expectativas.md", "../../07_DECISIONS/0007-alcance-v1-dinero-electronico.md"]
---

# Propuesta — Reorganización a Spec-Driven Development y adopción de "JaraLab Cash Control AI"

Este documento no ejecuta cambios todavía. Es la propuesta que pediste antes de tocar archivos `status: active`. Nada de lo que sigue borra o reemplaza trabajo existente — el principio de este repositorio es que nada se borra y el conocimiento perecedero se marca, no se destruye.

## 1. Punto de partida

"JaraLab Cash Control AI" no es un producto nuevo: es `jaralab-auditor` (nombre interno "Finance Agent 001"), ya documentado en `04_PRODUCTS/jaralab-auditor/` con blueprint de arquitectura v1.1, backlog de 10 épicas, plan de ejecución en 4 fases (F0–F3), batería de 40 casos de prueba, 7 ADRs activos y F0 ya construido con datos sintéticos (pendiente de validar con datos reales de Pikeo). Confirmaste que quieres evolucionar esto, no duplicarlo.

## 2. Qué es Spec-Driven Development y por qué encaja aquí

SDD trata la especificación — qué debe hacer el sistema y por qué — como la fuente de verdad, separada de cómo se construye. El código y la arquitectura se derivan de la spec y se validan contra ella; cuando algo cambia, se actualiza primero la spec y desde ahí se propaga. Tres roles se mantienen separados y enlazados: **spec** (qué/por qué — intención, requisitos, criterios de aceptación), **plan** (cómo — arquitectura, stack, estructura técnica) y **tasks** (en qué orden — backlog ejecutable).

El diagnóstico honesto: el proyecto ya practica una versión artesanal de esto (el propio `plan-de-ejecucion.md` dice "fuente de verdad: blueprint + ADRs"), pero el rol de **spec** está disperso — la tesis del producto vive en el blueprint, las historias de usuario en el backlog, los criterios de aceptación repartidos en el plan de ejecución, los edge cases en su propio archivo, y las reglas de negocio implícitas dentro de cada ADR. No existe un documento único que alguien sin contexto previo pueda leer para entender **qué** construye el producto y **por qué**, sin tener que leer arquitectura. Esa es la brecha que esta propuesta cierra.

## 3. Inventario actual

| Archivo | Rol real hoy | Estado |
|---|---|---|
| `blueprint-arquitectura.md` v1.1 | Tesis de producto + arquitectura técnica mezcladas | Activo |
| `backlog.md` v1.0 | Historias de usuario + tareas ejecutables mezcladas | Activo |
| `plan-de-ejecucion.md` v1.0 | Roadmap de fases + criterios de aceptación por fase | Activo |
| `casos-de-prueba.md` v1.0 | Edge cases y batería de pruebas (40 casos, A–J) | Activo |
| `07_DECISIONS/0001`–`0007` | Decisiones de arquitectura y alcance, con contexto/alternativas/consecuencias | Activos |
| `09_DAILY_LOG/2026-07-08-*` (3 archivos) | Bitácora de kickoff y construcción de F0 | Activos |
| — | **Spec unificada (qué/por qué, para un lector sin contexto técnico)** | **No existe** |

## 4. Mapeo propuesto a roles SDD

| Rol SDD | Archivo | Acción propuesta |
|---|---|---|
| **Spec** (qué y por qué) | `spec.md` — nuevo | Crear. Consolida objetivo, contexto del problema, alcance, usuarios, historias de usuario, flujo funcional, requisitos funcionales y no funcionales, reglas de negocio (extraídas de los ADRs, citándolos), edge cases (por referencia a `casos-de-prueba.md`, sin duplicar el detalle), criterios de aceptación (extraídos de `plan-de-ejecucion.md`), riesgos, métricas de éxito, extensiones futuras. Se convierte en la puerta de entrada al proyecto. |
| **Constitution** (no negociables) | `07_DECISIONS/0001`–`0007` | Sin cambios de contenido. Se referencian desde `spec.md` como las reglas que ninguna decisión futura puede contradecir sin ADR nuevo — ya es su función hoy, solo se hace explícita la etiqueta. |
| **Plan** (cómo, arquitectura) | `blueprint-arquitectura.md` | Se mantiene como plan técnico. Se le retira la sección "Tesis del producto" (se mueve a `spec.md`, con nota de redirección) para que quede puramente arquitectura: pipeline, stack, estructura del repositorio de código. |
| **Tasks** (backlog ejecutable) | `backlog.md` | Se mantiene. Se le retiran las líneas "Historia:" de cada épica (se mueven a `spec.md` como historias de usuario formales) y quedan solo tareas, prioridad, dependencias y estimación. |
| **Test spec** (casos borde y aceptación) | `casos-de-prueba.md` | Sin cambios de contenido, solo se referencia desde `spec.md` en la sección de casos borde en vez de duplicarse. |
| **Roadmap ejecutable** | `plan-de-ejecucion.md` | Se mantiene como está — roadmap por fases con entregables y validación. Se referencia desde `spec.md` en criterios de aceptación de alto nivel; el detalle fase por fase sigue viviendo aquí. |
| **Historial de decisiones de nombre** | `07_DECISIONS/0008-...` — nuevo | Registrar el cambio de nombre de mercado, ver sección 5. |

Ningún archivo existente se elimina ni pierde información — se redistribuye contenido que hoy está mezclado, y cada archivo que pierde una sección deja una nota de redirección hacia dónde se movió.

## 5. Naming: qué se renombra y qué no

Propuesta: mantener `jaralab-auditor` como **slug interno** (nombre de carpeta, nombre del repositorio de código `jaralab-auditor-code`, tags existentes) para no romper enlaces relativos en 7 ADRs y 3 daily logs, ni desincronizar el nombre del repo de código real. Cambiar únicamente el **nombre de mercado**: donde el blueprint dice hoy "Nombre de mercado: JaraLab Auditor", pasa a decir "Nombre de mercado: JaraLab Cash Control AI". Se registra como ADR-0008 (contexto: por qué cambia el nombre; decisión; consecuencia: el slug interno no cambia, solo el nombre externo).

Alternativa descartada: renombrar la carpeta a `jaralab-cash-control`. Implicaría reescribir las rutas relativas `related` de los 7 ADRs y 3 daily logs, y desalinear el nombre del repo de código (`jaralab-auditor-code`) del nombre del repo de conocimiento — más fricción que valor para un cambio que es de posicionamiento, no de arquitectura.

## 6. Cambios concretos que ejecutaría, con tu aprobación

1. Crear `04_PRODUCTS/jaralab-auditor/spec.md` v1.0 (contenido descrito en sección 4), con "JaraLab Cash Control AI" como título y nombre de mercado.
2. Crear `07_DECISIONS/0008-nombre-de-mercado-cash-control-ai.md`.
3. Editar `blueprint-arquitectura.md`: retirar sección 1 "Tesis del producto" → nota de redirección a `spec.md`, subir a v1.2, actualizar `related` para incluir `spec.md`.
4. Editar `backlog.md`: retirar líneas "Historia:" de cada épica → nota de redirección a `spec.md`, subir a v1.1, actualizar `related`.
5. Actualizar `related` en `plan-de-ejecucion.md` y `casos-de-prueba.md` para incluir `spec.md`.
6. Entrada nueva en `09_DAILY_LOG` documentando esta reorganización (por qué, qué se movió, qué no cambió).
7. No se toca código, no se toca `07_DECISIONS/0001`–`0007` en su contenido de decisión (solo se les agrega `spec.md` a `related` si corresponde).

## 7. Lo que esta propuesta no hace

No escribe código. No cierra F0 ni avanza fases del roadmap. No cambia ninguna decisión de arquitectura ya tomada (ADR-0001 a 0007 siguen vigentes tal cual). No renombra el repositorio de código ni la carpeta de conocimiento.

## 8. Siguiente paso

Con tu aprobación, ejecuto los 6 cambios de la sección 6 en este mismo repositorio. Si prefieres ajustar el mapeo (por ejemplo, mantener las historias de usuario también en `backlog.md` además de en `spec.md`, o no tocar `blueprint-arquitectura.md`), lo ajusto antes de escribir nada.


## Estado de ejecución

Aprobada por Laura el 2026-07-11 y ejecutada el mismo día. Los 6 cambios de la sección 6 se implementaron tal como se propusieron. Detalle en `09_DAILY_LOG/2026-07-11-jaralab-cash-control-ai-reorganizacion-sdd.md`.

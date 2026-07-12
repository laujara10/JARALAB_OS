---
title: "JARALAB_OS — README"
type: index
status: active
owner: "Laura Jaramillo"
created: 2026-07-08
updated: 2026-07-10
version: 2.0
tags: [meta, governance, onboarding]
related: []
---

# JARALAB_OS

Este repositorio es el Sistema Operativo de Conocimiento de JaraLab. No es una carpeta de archivos: es la memoria permanente de la empresa — independiente de qué humano o qué modelo de IA la esté leyendo hoy.

## 1. Qué es esto

JaraLab construye sistemas que ayudan a restaurantes a tomar mejores decisiones a través de estrategia, datos, operación, marketing e IA. Este repositorio existe para que ese conocimiento sobreviva a cualquier herramienta: si mañana dejamos de usar Claude y usamos ChatGPT, Gemini, o lo que venga después, este conocimiento sigue siendo válido y utilizable sin pérdida.

Principio rector: **el conocimiento es propiedad de JaraLab, no del modelo de IA que lo procesa.** Ningún documento debe depender de la sintaxis, memoria o convenciones propias de un asistente específico. Todo debe ser Markdown plano, legible por humano y por cualquier LLM.

## 2. Misión de JaraLab

Construir sistemas que ayuden a restaurantes a vender más, operar mejor y decidir con datos — combinando estrategia de marketing, growth, automatización, IA, CRM, business intelligence, fidelización y rentabilidad.

No vendemos servicios, vendemos transformación. No vendemos dashboards, vendemos claridad. No vendemos automatizaciones, vendemos tiempo.

Detalle completo en `00_IDENTITY/misión.md`, `00_IDENTITY/visión.md` y `00_IDENTITY/principios.md`.

## 3. Mapa del repositorio

| Carpeta | Contenido |
|---|---|
| `00_IDENTITY` | Quiénes somos: misión, visión, principios. Verdad fundacional. |
| `01_STRATEGY` | Hacia dónde vamos: visión de mediano plazo, roadmap, objetivos, North Star, dirección estratégica. |
| `02_BRANDS` | Marcas de JaraLab: **Pikeo**, **Callejero**, **Caja de Belleza** y **Soy Lau Jara** (ver sección 5). |
| `03_CLIENTS` | Un subfolder por cliente externo. Nunca archivos sueltos en la raíz. |
| `04_PRODUCTS` | Productos digitales, herramientas, MVPs y soluciones de JaraLab (ej. **jaralab-auditor**). |
| `05_SYSTEMS` | Arquitectura de herramientas, automatizaciones y stacks técnicos. |
| `06_OPERATIONS` | SOPs, playbooks y workflows operativos, repetibles, paso a paso. |
| `07_DECISIONS` | Registro de decisiones (formato ADR): contexto, decisión, alternativas descartadas, consecuencias. |
| `08_RESEARCH` | Investigación, experimentos, benchmarking, hallazgos y postmortems. Todo proyecto cierra generando aprendizaje reutilizable aquí. |
| `09_DAILY_LOG` | Bitácora cronológica de la operación. |
| `10_PROMPTS` | Prompts maestros reutilizables, versionados. |
| `11_SKILLS` | Skills instalables (`.skill`) y skills en construcción. |
| `12_AGENTS` | Agentes de IA de JaraLab: definiciones y configuración. |
| `13_TEMPLATES` | Plantillas: hipótesis, learning, postmortem, `estado.md`, documento de decisión. |
| `14_DOCUMENTATION` | Documentación técnica y funcional de referencia de sistemas ya construidos. |
| `15_OUTPUTS` | Entregables finales, en subcarpeta por proyecto. |
| `99_ARCHIVE` | Todo lo que ya no está activo pero no se borra. |

Cada carpeta tiene su propio `README.md` con el detalle de su propósito y sus convenciones.

## 4. Conocimiento organizacional por encima de la tarea

Este repositorio no es una lista de pendientes ni un historial de conversaciones. Antes de guardar algo aquí, la pregunta correcta es: **¿esto le sirve a JaraLab dentro de un año, sin importar quién lo lea?** Si la respuesta es no, no pertenece a este repositorio — pertenece a una tarea puntual y se descarta al terminar.

Toda tarea ejecutada (una campaña, una automatización, un proyecto de cliente) tiene una obligación de cierre: dejar al menos un aprendizaje documentado en `08_RESEARCH`. Ejecutar sin documentar el aprendizaje es dejar el trabajo a medias.

## 5. Comunicación como parte del sistema operativo

**Soy Lau Jara** no es una cuenta de redes sociales aparte del negocio — es parte de la infraestructura de JaraLab. Documenta el recorrido, convierte la ejecución real en contenido, construye autoridad y atrae oportunidades. Vive dentro de `02_BRANDS/SoyLauJara` con el mismo nivel de rigor documental que cualquier otro sistema: qué se comunicó, por qué, y qué resultado generó.

## 6. Pikeo y Callejero como laboratorios vivos

Pikeo y Callejero son los laboratorios de JaraLab: ahí se validan los sistemas — de datos, de marketing, de operación, de IA — antes de ofrecerlos a clientes externos. Todo lo que se prueba en estos proyectos y funciona se documenta como aprendizaje reutilizable en `08_RESEARCH`, y si se convierte en una oferta replicable, se formaliza como sistema en `05_SYSTEMS` o como SOP en `06_OPERATIONS`. Ningún sistema se vende a un cliente antes de haber sido validado en un laboratorio propio.

## 7. Cómo debe navegar este repositorio un agente de IA

Este repositorio está diseñado para ser compartido por múltiples agentes especializados de IA (estrategia, growth, datos, operación, contenido, CRM), todos operando sobre la misma base de conocimiento. Modelo o plataforma nunca son excusa para desconocer el contexto acumulado.

Todo agente — sea Claude, ChatGPT, Gemini u otro — debe seguir esta secuencia antes de actuar:

1. Leer este `README.md` completo.
2. Leer `00_IDENTITY` y `01_STRATEGY` en su totalidad — es contexto no negociable.
3. Revisar `07_DECISIONS` relacionado al tema antes de proponer algo nuevo, para no contradecir decisiones ya tomadas.
4. Seguir el campo `related` del frontmatter de cualquier archivo que abra, en vez de tratarlo como aislado.
5. Nunca sobrescribir un archivo con `status: active` sin registrar el cambio en `07_DECISIONS` o subir su `version`.
6. Al cerrar cualquier tarea o proyecto, verificar si corresponde una entrada en `08_RESEARCH`.

## 8. Estándares de documentación

- **Header de metadata:** todo `.md` lleva frontmatter YAML con `title, type, status, owner, created, updated, version, tags, related`.
- **Nombres de archivo:** `kebab-case`, sin espacios ni acentos; documentos atemporales sin fecha, documentos fechados con prefijo `YYYY-MM-DD-`; decisiones con prefijo correlativo `0001-`.
- **Una idea por archivo.** Se escribe para quien no tiene contexto — ni tú en seis meses, ni un agente nuevo.
- **Versionado:** semántico simple (`1.0`, `1.1`, `2.0`). Nada se borra; lo obsoleto se marca `status: deprecated` y enlaza a su reemplazo en `related`.
- **Carpetas raíz cerradas:** no se crean carpetas nuevas en el nivel raíz sin aprobación explícita de Laura.

## 9. Historial de cambios estructurales

El 2026-07-10 se amplió la arquitectura de 11 a 17 carpetas raíz (`00`–`15` + `99`) y se renombraron `01_VISION→01_STRATEGY`, `04_PROJECTS→04_PRODUCTS`, `06_SOPS→06_OPERATIONS`, `08_LEARNINGS→08_RESEARCH`, además de añadir `12_AGENTS` y `14_DOCUMENTATION` como carpetas nuevas. Detalle completo en `CHANGELOG.md`. Los `09_DAILY_LOG` fechados antes de esa fecha conservan los nombres de carpeta vigentes en el momento en que se escribieron — son registro histórico, no se editan retroactivamente.

## 10. Estado de este documento

Este README es la versión de gobierno vigente del sistema. Se actualiza cada vez que cambien las reglas de gobierno del repositorio — ese cambio se versiona aquí y se registra en `07_DECISIONS`.

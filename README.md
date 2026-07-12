---
title: "JARALAB_OS — README"
type: index
status: active
owner: "Laura Jaramillo"
created: 2026-07-08
updated: 2026-07-11
version: 3.0
tags: [meta, governance, onboarding]
related: ["CHANGELOG.md", "00_IDENTITY/principios.md", "05_SYSTEMS/jaralab-os-constitucion-tecnica.md"]
---

# JARALAB_OS

Sistema Operativo de Conocimiento de JaraLab.

> El conocimiento es propiedad de JaraLab, no del modelo de IA que lo procesa hoy.

---

## ¿Qué es JARALAB_OS?

JARALAB_OS es la memoria permanente e institucional de JaraLab. No es una carpeta de archivos ni un historial de conversaciones: es el sistema que garantiza que el conocimiento estratégico, operativo y técnico de la empresa sobreviva a cualquier herramienta, modelo o persona.

Todo se escribe en Markdown plano — legible por cualquier humano y por cualquier LLM — para que este repositorio siga siendo válido y utilizable sin importar qué plataforma lo procese mañana.

---

## Objetivo

Centralizar el conocimiento de JaraLab de forma estructurada, versionada y agnóstica a herramientas, de modo que:

- Ningún aprendizaje se pierda al cambiar de herramienta o de modelo de IA.
- Cualquier agente o colaborador pueda operar con contexto completo leyendo este repositorio.
- Las decisiones tomadas queden registradas con su contexto y alternativas descartadas.
- El conocimiento acumulado sea reutilizable por la empresa dentro de un año, sin importar quién lo lea.

---

## Arquitectura general

El repositorio está organizado en **17 carpetas raíz numeradas**, cada una con un propósito exclusivo y su propio `README.md`. Las carpetas raíz son cerradas: no se crean nuevas sin aprobación explícita de Laura.

La arquitectura sigue esta lógica:

```
Identidad → Estrategia → Marcas → Clientes → Productos → Sistemas → Operación
→ Decisiones → Investigación → Bitácora diaria → Prompts → Skills → Agentes
→ Plantillas → Documentación → Outputs → Archivo
```

Las decisiones estructurales del repositorio se registran como ADRs en `07_DECISIONS/`.

---

## Estructura de carpetas

| Carpeta | Contenido |
|---|---|
| `00_IDENTITY` | Misión, visión y principios de JaraLab. Verdad fundacional — no se edita sin consenso explícito. |
| `01_STRATEGY` | North Star, roadmap y dirección estratégica de mediano plazo. |
| `02_BRANDS` | Marcas de JaraLab: **Pikeo**, **Callejero**, **Caja de Belleza**, **SoyLauJara**. |
| `03_CLIENTS` | Un subfolder por cliente externo. Nunca archivos sueltos en la raíz. |
| `04_PRODUCTS` | Productos digitales, herramientas y MVPs (ej. `jaralab-auditor`). |
| `05_SYSTEMS` | Arquitectura técnica, stacks y automatizaciones. |
| `06_OPERATIONS` | SOPs, playbooks y workflows operativos paso a paso. |
| `07_DECISIONS` | Registro de decisiones en formato ADR: contexto, decisión, alternativas descartadas, consecuencias. |
| `08_RESEARCH` | Investigación, experimentos, benchmarking, hallazgos y postmortems. |
| `09_DAILY_LOG` | Bitácora cronológica de la operación (archivos con prefijo `YYYY-MM-DD-`). |
| `10_PROMPTS` | Prompts maestros reutilizables, versionados. |
| `11_SKILLS` | Skills instalables (`.skill`) para agentes de IA, organizadas por dominio. |
| `12_AGENTS` | Definiciones y configuración de agentes de IA de JaraLab. |
| `13_TEMPLATES` | Plantillas reutilizables: hipótesis, learning, postmortem, `estado.md`, ADR. |
| `14_DOCUMENTATION` | Documentación técnica y funcional de sistemas ya construidos. |
| `15_OUTPUTS` | Entregables finales, en subcarpeta por proyecto. |
| `99_ARCHIVE` | Todo lo que ya no está activo pero no se elimina. |

---

## Cómo abrir el proyecto

Este repositorio es un vault de [Obsidian](https://obsidian.md/). Para abrirlo:

1. Instala Obsidian en tu equipo.
2. Selecciona **Abrir carpeta como vault** y elige la carpeta `JARALAB_OS`.
3. Obsidian leerá la estructura de carpetas y los enlaces `[[wikilinks]]` automáticamente.

También puede abrirse directamente en cualquier editor de texto o IDE — todos los archivos son Markdown plano.

---

## Cómo colaborar

### Antes de actuar

Lee en este orden:

1. Este `README.md` completo.
2. `00_IDENTITY/` — misión, visión y principios. Contexto no negociable.
3. `07_DECISIONS/` relevante al tema — para no contradecir decisiones ya tomadas.
4. El `estado.md` del proyecto activo, si aplica.

### Reglas de gobierno

- **No sobrescribas** un archivo con `status: active` sin registrar el cambio en `07_DECISIONS` o incrementar su `version`.
- **No contradigas** un ADR activo sin proponer formalmente su reemplazo.
- **No ejecutes** gasto, envío ni publicación sin aprobación humana explícita.
- **No crees** carpetas nuevas en el nivel raíz sin aprobación explícita de Laura.
- **No guardes** conocimiento de JaraLab en memoria propietaria de ningún proveedor de IA.

### Estándares de documentación

Todo archivo `.md` lleva frontmatter YAML:

```yaml
---
title: ""
type: ""         # index | decision | log | identity | spec | research | prompt
status: ""       # active | draft | deprecated | archived
owner: ""
created: YYYY-MM-DD
updated: YYYY-MM-DD
version: "1.0"
tags: []
related: []
---
```

**Nombres de archivo:** `kebab-case`, sin espacios ni acentos.
- Documentos atemporales: sin fecha en el nombre.
- Entradas de bitácora: prefijo `YYYY-MM-DD-`.
- ADRs: prefijo correlativo `0001-`.

**Una idea por archivo.** Se escribe para quien no tiene contexto.

**Versionado semántico simple:** `1.0`, `1.1`, `2.0`. Lo obsoleto se marca `status: deprecated` y enlaza a su reemplazo en `related`. Nada se borra.

---

## Convenciones de commits

Se usa el formato [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>: <descripción corta en minúsculas>
```

| Tipo | Cuándo usarlo |
|---|---|
| `feat` | Nuevo contenido o documento significativo |
| `fix` | Corrección de error, dato incorrecto o enlace roto |
| `docs` | Mejoras a documentación existente |
| `chore` | Cambios de infraestructura (`.gitignore`, estructura, renombrados) |
| `adr` | Nueva decisión registrada en `07_DECISIONS` |
| `log` | Entrada nueva en `09_DAILY_LOG` |
| `refactor` | Reorganización sin cambio de contenido |

**Ejemplos:**

```
feat: agregar spec inicial de jaralab-auditor
adr: registrar decisión sobre stack monolito Python/SQLite
log: bitácora 2026-07-11 — reorganización SDD
chore: ignorar .obsidian/ en .gitignore
```

---

## Flujo de trabajo con Claude Code

Este repositorio está diseñado para operar con [Claude Code](https://claude.ai/code) como asistente principal. El archivo `CLAUDE.md` en la raíz define las instrucciones que Claude lee antes de actuar.

### Secuencia estándar antes de actuar

Todo agente — humano o IA — sigue esta secuencia:

1. Leer `README.md` completo.
2. Leer `00_IDENTITY/` en su totalidad.
3. Revisar `07_DECISIONS/` relacionado al tema.
4. Seguir el campo `related` del frontmatter de cualquier archivo abierto.
5. Leer el `estado.md` del proyecto activo, si existe.

### Directivas específicas para Claude Code

- Inspeccionar y entender antes de actuar.
- Minimizar conocimiento duplicado.
- Preguntar cuando la incertidumbre afecta materialmente la solución.
- Preferir lo legible y mantenible sobre lo ingenioso.
- No guardar conocimiento de JaraLab en memoria propietaria del proveedor.
- No ejecutar commits, push, gasto ni publicación sin aprobación explícita.

---

## Licencia

Repositorio **privado**. Todo el contenido de este repositorio es propiedad exclusiva de JaraLab / Laura Jaramillo Velásquez.

Queda prohibida su reproducción, distribución o uso sin autorización expresa por escrito de la propietaria.

---

*Última actualización estructural: 2026-07-11 — v3.0. Historial de cambios en `CHANGELOG.md`.*

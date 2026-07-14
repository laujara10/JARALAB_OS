---
title: "CHANGELOG — Reorganización JARALAB_OS"
type: log
status: active
owner: "Laura Jaramillo"
created: 2026-07-10
updated: 2026-07-12
version: 1.2
tags: [changelog, reorganizacion]
related: ["README.md"]
---

# Changelog — Reorganización 2026-07-10

## 1. Carpetas nuevas creadas

- `11_SKILLS/`, `12_AGENTS/` (creada primero como `12_AI_AGENTS`, renombrada), `13_TEMPLATES/`, `15_OUTPUTS/`, `99_ARCHIVE/`
- `14_DOCUMENTATION/` (creada primero como `14_DOCS`, renombrada)
- `02_BRANDS/Pikeo/`, `02_BRANDS/Callejero/`, `02_BRANDS/Caja de Belleza/`, `02_BRANDS/SoyLauJara/`
- `11_SKILLS/decision-lab/`, `11_SKILLS/architecture/`, `11_SKILLS/growth/`, `11_SKILLS/cfo/` (estructura mínima: README.md + instrucciones-base.md, sin metodología completa)

## 2. Carpetas renombradas (con cambio de alcance, no solo de nombre)

| Antes | Después | Alcance nuevo |
|---|---|---|
| `01_VISION` | `01_STRATEGY` | Visión, roadmap, objetivos, North Star, dirección estratégica |
| `04_PROJECTS` | `04_PRODUCTS` | Productos digitales, herramientas, MVPs y soluciones |
| `06_SOPS` | `06_OPERATIONS` | SOPs + procesos operativos, playbooks y workflows |
| `08_LEARNINGS` | `08_RESEARCH` | Investigación, experimentos, benchmarking, hallazgos y documentación técnica |

Contenido existente de cada carpeta se preservó intacto durante el renombrado (mismo contenido, nueva ubicación).

## 3. Archivos movidos

- `brainstorm.skill` (raíz) → `11_SKILLS/brainstorm.skill`. **Nota:** el archivo original en la raíz no pudo eliminarse — el sistema de archivos del entorno lo bloqueó ("Operation not permitted") a pesar de tener los mismos permisos que el resto de archivos de la raíz. Quedó duplicado en ambas ubicaciones. Recomendación: borrar manualmente `brainstorm.skill` de la raíz de `JARALAB_OS/` desde Finder o terminal local.

## 4. Archivos nuevos con contenido real (no plantillas vacías)

- `00_IDENTITY/misión.md`, `visión.md`, `principios.md`
- `01_STRATEGY/roadmap.md`, `north_star.md`

Redactados a partir del contenido ya existente en `README.md` (versión anterior) y `05_SYSTEMS/jaralab-os-constitucion-tecnica.md` — sin inventar información nueva.

## 5. READMEs de carpeta creados

Un `README.md` nuevo en cada una de las 17 carpetas raíz (`00`–`15`, `99`) y en las 4 subcarpetas de `02_BRANDS`, explicando propósito y convenciones. Las descripciones de marca (Pikeo, Callejero, Soy Lau Jara, Caja de Belleza) usan exactamente el texto provisto por Laura.

## 6. README.md principal

Reescrito (v1.0 → v2.0) para reflejar el mapa completo de 17 carpetas raíz y los renombres de la sección 2. Se agregó una sección 9 ("Historial de cambios estructurales") que documenta este cambio dentro del propio README.

## 7. Referencias actualizadas (para evitar enlaces rotos)

Se corrigieron rutas de `01_VISION`, `04_PROJECTS`, `06_SOPS`, `08_LEARNINGS` a sus nuevos nombres en:

- `05_SYSTEMS/jaralab-os-constitucion-tecnica.md`
- `07_DECISIONS/0001` a `0007` (campo `related` del frontmatter)
- `04_PRODUCTS/jaralab-auditor/*.md` (blueprint, plan de ejecución, backlog)
- `00_IDENTITY/*.md` y `01_STRATEGY/*.md` (archivos nuevos de este cambio)

**No se modificó** el contenido narrativo (cuerpo del texto) de `09_DAILY_LOG/*.md`: son registros históricos fechados y deben conservar los nombres de carpeta vigentes en el momento en que se escribieron. Solo se actualizó el campo `related` de su frontmatter donde apuntaba a `04_PROJECTS`, para que el enlace siga funcionando.

`CLAUDE.md` no requirió cambios: solo referencia `00_IDENTITY` y `07_DECISIONS`, ninguno renombrado.

## 8. Verificación

Se corrió una verificación automática de los 78 enlaces `.md` encontrados en frontmatter y cuerpo de texto de todo el repositorio. Resultado: 0 enlaces rotos tras las correcciones de la sección 7.

## 9. Nada se eliminó

Ningún archivo de contenido existente (proyectos, ADRs, bitácoras, constitución técnica) fue borrado o alterado en su contenido sustantivo — solo se movieron de carpeta o se corrigieron rutas de referencia.

---

# Changelog — 2026-07-12: Primer cierre real exitoso (F0)

## Qué pasó

Primera ejecución real y completa del Ritual Diario de JaraLab Cash Control AI (`jaralab-auditor`) sobre datos reales de Pikeo, sin errores, de punta a punta con un solo comando:

```
python3 -m auditor --config config/pikeo.yaml run --dia 2026-07-03
```

Ingesta de extracto Bancolombia (cuenta Pikeo + cuenta Carolina) y del reporte de facturas Loggro real del 2026-07-03. Resultado: $4.300.305 vendido, $1.289.464 conciliado automáticamente (41.7% de la venta electrónica), cobertura del 72% de la venta bajo auditoría, 8 excepciones mostradas con evidencia real (número de factura) y comandos de resolución.

## Por qué importa

Cierra F0 (fundación de datos) tal como lo define `spec.md` §11: un día real de Pikeo se ingiere con un comando, sin duplicar, con falla ruidosa ante formato inesperado. Detalle completo del hito en `04_PRODUCTS/jaralab-auditor/MILESTONE-F0.md`.

## Referencia

Ver `09_DAILY_LOG/2026-07-12-primer-cierre-real-exitoso-f0.md` para la bitácora completa del día, y `04_PRODUCTS/jaralab-auditor/MILESTONE-F0.md` para el hito documentado con propuesta de objetivo de F1.

---

# Changelog — 2026-07-12: Cierre oficial de F0

## Qué pasó

Se auditó a fondo el resultado de la primera corrida real (41.7% de auto-conciliación) en vez de aceptarlo como dado. Se encontró que la causa no era el motor de matching sino la clasificación de ingresos bancarios: pagos por "PAGO QR" y transferencias abreviadas ("TRANSF") ya estaban en el banco pero el sistema no los reconocía. Se construyó una tabla de clasificación completa a partir de un inventario de los 38 movimientos bancarios reales del día (no de casos aislados), agregando además dos categorías nuevas (`reverso`, `rendimiento_financiero`) explícitamente excluidas del motor de matching.

**Resultado:** 41.7% → **84.5%** de auto-conciliación sobre el mismo día real, sin tocar el algoritmo. 45/45 pruebas pasan. Las 4 excepciones restantes se investigaron una por una y ninguna corresponde a un patrón bancario sin reconocer — quedan reclasificadas oficialmente como hipótesis de negocio para F1, no como bugs.

## Por qué importa

F0 (fundación de datos) queda formalmente cerrado. Detalle completo, checklist y objetivo revisado de F1 en `04_PRODUCTS/jaralab-auditor/MILESTONE-F0.md` (v2.0).

## Referencia

`09_DAILY_LOG/2026-07-12-tabla-clasificacion-bancolombia.md`, `04_PRODUCTS/jaralab-auditor/spec.md` (v1.4), `04_PRODUCTS/jaralab-auditor/MILESTONE-F0.md` (v2.0).

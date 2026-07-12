---
title: "Principios de JaraLab"
type: identity
status: active
owner: "Laura Jaramillo"
created: 2026-07-10
updated: 2026-07-10
version: 1.0
tags: [identidad, principios, gobernanza]
related: ["misión.md", "visión.md", "../07_DECISIONS"]
---

# Principios

Extraídos del gobierno documentado en README.md raíz y en `05_SYSTEMS/jaralab-os-constitucion-tecnica.md`. No se inventa nada aquí: son las reglas ya vigentes del repositorio, reunidas en un solo lugar.

## Sobre el conocimiento

- El conocimiento es propiedad de JaraLab, no del modelo de IA que lo procesa. Nada depende de la sintaxis o memoria propia de un asistente específico.
- Todo se escribe en Markdown plano, legible por humano y por cualquier LLM.
- Antes de guardar algo: ¿le sirve a JaraLab dentro de un año, sin importar quién lo lea? Si no, es una tarea puntual — no pertenece al repositorio.
- Nada se borra. Lo obsoleto se marca `status: deprecated` y enlaza a su reemplazo en `related`.
- La memoria muerta es peor que la memoria vacía, porque se lee con confianza. Por eso el conocimiento perecedero declara `review_by` y se revisa trimestralmente.

## Sobre la validación

- Ningún sistema se ofrece a un cliente externo sin haberse validado antes en un laboratorio propio (Pikeo o Callejero).
- Todo proyecto cierra generando al menos un aprendizaje documentado en `08_RESEARCH`. Ejecutar sin documentar el aprendizaje es dejar el trabajo a medias.
- Los fracasos documentados valen más que los éxitos: son los que evitan repetir el costo.

## Sobre la gobernanza

- No se sobrescribe un archivo `status: active` sin registrar el cambio en `07_DECISIONS` o subir su `version`.
- No se contradice un ADR activo sin proponer formalmente su reemplazo.
- No se ejecuta gasto, envío ni publicación sin aprobación humana explícita.
- Carpetas raíz cerradas: no se crean carpetas nuevas en el nivel raíz sin aprobación explícita de Laura.

Fuente: README.md raíz (secciones 4, 7, 8) y `05_SYSTEMS/jaralab-os-constitucion-tecnica.md`.

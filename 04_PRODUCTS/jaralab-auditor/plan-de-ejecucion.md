---
title: "JaraLab Auditor — Plan de Ejecución"
type: plan
status: active
owner: "Laura Jaramillo"
created: 2026-07-08
updated: 2026-07-11
version: 1.0
tags: [jaralab-auditor, ejecucion, roadmap, sprint, validacion]
related: ["spec.md", "blueprint-arquitectura.md", "backlog.md", "casos-de-prueba.md"]
---

# JaraLab Auditor — Plan de Ejecución

Fuente de verdad: `blueprint-arquitectura.md` v1.1 y los ADRs 0001–0007. Este plan no replantea arquitectura; la convierte en trabajo ejecutable. La arquitectura solo se reabre ante un riesgo crítico de confiabilidad, escalabilidad o mantenibilidad, y ese cambio se registraría como ADR nuevo.

## 1. Reglas de trabajo del equipo

Construir → Probar → Validar con datos reales de Pikeo/Callejero → Documentar el aprendizaje → Mejorar. Nunca avanzar sin validar. Cada fase termina con una parada obligatoria: qué construimos, qué validamos, qué aprendimos, qué riesgos encontramos — y la aprobación explícita de Laura antes de continuar. Ninguna fase inicia con la anterior a medias. Todo cierre de fase genera una entrada en `08_RESEARCH` y una en `09_DAILY_LOG`. Cambios de diseño → ADR. El código se construye en iteraciones pequeñas: ningún incremento supera lo que se puede probar en la misma sesión.

Unidad de estimación: **sesión de trabajo** (~2–3 horas de Laura + IA). Las estimaciones asumen que los archivos reales están disponibles.

## 2. Roadmap técnico

### F0 — Fundación de datos (Sprint 1, ~4 sesiones)

**Objetivo:** un día real de Pikeo leído, normalizado y persistido sin intervención manual, verificado contra conteo a mano.

**Entregables:** esqueleto del repositorio (sección 3), esquema SQLite con las 5 tablas del blueprint, adaptadores Loggro + banco + gastos con tests de contrato, normalización con deduplicación, CLI con `auditor ingest` y `auditor status`.

**Criterios de aceptación:** (1) los tres archivos de un día real se ingieren con un comando; (2) los totales por fuente coinciden al peso con el conteo manual de Laura; (3) re-ingerir cualquier archivo no duplica un solo evento; (4) un archivo con formato inesperado falla ruidosamente en la ingesta con mensaje claro, nunca entra sucio a la base.

**Qué probar:** casos A y B de la batería (`casos-de-prueba.md`): encoding, separadores, fechas, filas basura, dedupe en todas sus variantes.

**Datos necesarios:** exportación Loggro, extracto bancario (CSV/Excel) y registro de gastos de un mismo día de Pikeo — ideal un día ya conciliado a mano. Es el único bloqueante externo del proyecto.

**Riesgos:** formatos más sucios de lo previsto (probable — por eso F0 existe); extracto solo disponible en PDF (mitigación: verificar con el banco el export estructurado antes de escribir el parser).

**Aprendizaje esperado:** la distancia entre los formatos reales y lo asumido en el blueprint. Se documenta en `08_RESEARCH` como primer learning del proyecto.

### F1 — Motor de matching v1 + expectativas (~6 sesiones)

**Objetivo:** el motor concilia automáticamente los casos de certeza alta y administra expectativas; arranca el shadow mode.

**Entregables:** generación de expectativas (ADR-0006) con ciclo por franquicia, pasadas 1–3 del motor (dedupe, exactos, tolerancia con explicación GMF/comisión), score de confianza con evidencia, reporte diario HTML v1 (tres estados: conciliado / en tránsito / vencido), `auditor run --dia`.

**Criterios de aceptación:** (1) ≥70% de auto-conciliación en dinero sobre 5 días reales consecutivos; (2) cero falsos positivos — ningún match automático que el shadow mode desmienta; (3) ninguna venta en tránsito T+1/T+2 aparece como alarma; (4) todo match automático muestra su evidencia desglosada.

**Qué probar:** casos C, D y G de la batería. Cada día del shadow mode se compara conclusión por conclusión contra el proceso manual.

**Datos necesarios:** 5–10 días consecutivos de los tres archivos de Pikeo, con su conciliación manual como verdad conocida.

**Riesgos:** umbrales mal calibrados (mitigación: el shadow mode existe para esto; umbrales arrancan conservadores); comisiones de datáfono más variables de lo esperado.

**Aprendizaje esperado:** distribución real de scores — dónde está la frontera natural entre "auto" y "sugerido" en datos de restaurante colombiano.

### F2 — Los casos duros (~6 sesiones)

**Objetivo:** el motor resuelve pagos partidos y settlements de datáfono; el sistema aprende; el gerente opera en <10 minutos.

**Entregables:** pasada de pagos partidos (subset-sum acotado), pasada de settlements por franquicia con comisión aprendida del histórico, auditoría de gastos con período de gracia, libro de reglas activo (cada confirmación puede generar regla), reporte completo con bandeja de excepciones accionable.

**Criterios de aceptación:** (1) ≥85% de auto-conciliación en dinero; (2) 10 días consecutivos operando en un laboratorio con <10 min/día del gerente; (3) una pregunta ya respondida no se vuelve a preguntar (regla creada y aplicada); (4) cero falsos positivos sostenido; (5) el caso 180.000 = 80+50+50 y el settlement multi-día pasan en datos reales.

**Qué probar:** casos E, F, H e I de la batería, más regresión completa de F1 (nada de lo que funcionaba se rompe).

**Datos necesarios:** 15+ días acumulados de Pikeo y arranque de Callejero como segundo laboratorio (valida que la configuración por restaurante funciona de verdad).

**Riesgos:** explosión combinatoria en pagos partidos (mitigación: k≤4, ventana 72h, poda por contraparte); reglas que se contradicen entre sí (mitigación: las reglas tienen precedencia por fecha de validación y se pueden desactivar).

**Aprendizaje esperado:** tasa real de excepciones por categoría — el insumo para saber qué automatizar después y qué vale la pena explicarle mejor al gerente.

### F3 — Inteligencia visible (~5 sesiones, alcance final se define al cerrar F2)

**Objetivo:** el Auditor se siente como un analista senior: detecta lo inusual, explica en lenguaje humano, y el gerente abandona su proceso manual.

**Entregables:** detección de anomalías contra el histórico de `daily_close`, explicaciones redactadas por LLM sobre la evidencia determinista (ADR-0001: el LLM redacta, no decide), canal Telegram para recibir el reporte y preguntar, fin del shadow mode.

**Criterios de aceptación:** (1) el gerente de Pikeo o Callejero dejó de hacer el proceso manual — medido en comportamiento, no en opinión; (2) las anomalías señaladas son relevantes a juicio del gerente en ≥80% de los casos; (3) ninguna explicación LLM contradice la evidencia determinista subyacente.

**Qué probar:** caso J de la batería; verificación humana de explicaciones contra evidencia.

**Datos necesarios:** 30+ días de histórico en `daily_close` (se acumulan solos durante F1–F2).

**Riesgos:** anomalías ruidosas que erosionan confianza (mitigación: arrancar con pocas señales de alta precisión); dependencia del proveedor LLM (mitigación: la capa es un borde reemplazable por diseño).

**Aprendizaje esperado:** qué preguntas hace realmente un gerente — el insumo del producto conversacional y de la oferta comercial a clientes externos.

**Puerta de salida a mercado:** solo después de F3 validado en ambos laboratorios se ofrece a un cliente externo (regla del repositorio, sección 6 del README).

## 3. Estructura definitiva del repositorio de código

El código vive en su propio repositorio (`jaralab-auditor-code`, fuera de JARALAB_OS que es conocimiento, no código). Cada archivo con responsabilidad única y nombre específico:

```
jaralab-auditor-code/
├── README.md                     # Qué es, cómo instalar, cómo correr un día, mapa del repo
├── pyproject.toml                # Dependencias fijadas: pandas, jinja2, pyyaml, pytest
├── .gitignore                    # Excluye data/ completo (datos financieros nunca en git)
│
├── auditor/                      # Paquete principal
│   ├── __init__.py
│   ├── cli.py                    # Comandos: ingest, run, status, report, rules, close
│   ├── config.py                 # Carga y valida config/<restaurante>.yaml
│   ├── db.py                     # Conexión SQLite, creación de esquema, migraciones incrementales
│   ├── models.py                 # Dataclasses: Event, Expectation, Match, Rule, DailyClose
│   │
│   ├── adapters/
│   │   ├── __init__.py           # Registro de adaptadores y detección de fuente por contenido
│   │   ├── base.py               # Contrato: parse() → filas crudas; validate() → falla ruidosa
│   │   ├── loggro.py             # Export de ventas Loggro → filas crudas
│   │   ├── banco_<nombre>.py     # Se nombra al ver el archivo real (ej: banco_bancolombia.py)
│   │   └── gastos_sheet.py       # Registro de gastos (Sheets/Excel) → filas crudas
│   │
│   ├── core/
│   │   ├── normalize.py          # Filas crudas → eventos canónicos; dedupe_hash; clasificación kind
│   │   ├── expect.py             # Genera expectativas por venta electrónica; ciclo T+n y comisión por franquicia; vence expectativas
│   │   ├── match.py              # Orquesta las pasadas 1–6 del motor en orden de certeza
│   │   ├── score.py              # Score 0–100 con desglose de evidencia (monto, tiempo, referencia, contraparte)
│   │   ├── combos.py             # Subset-sum acotado para pagos partidos (k≤4, ventana 72h)
│   │   ├── settle.py             # Agrupación de ventas por franquicia/día y matching contra depósitos netos
│   │   ├── audit.py              # Gastos vs débitos, período de gracia, GMF, comisiones, duplicados
│   │   ├── rules.py              # Libro de reglas: aplicar, crear desde confirmación, desactivar
│   │   └── anomaly.py            # (F3) Señales contra histórico de daily_close
│   │
│   ├── report/
│   │   ├── build.py              # Calcula daily_close y arma los datos del reporte
│   │   └── template.html         # Reporte diario autocontenido (Jinja2): KPIs, 3 estados, bandeja de excepciones
│   │
│   └── llm/                      # (F3) Bordes de IA — nada del core importa de aquí
│       ├── explain.py            # Redacta explicaciones desde la evidencia determinista
│       └── ask.py                # Capa conversacional sobre la base de datos
│
├── config/
│   ├── pikeo.yaml                # Cuentas, franquicias, ciclos T+n, comisiones, tolerancias, gracia
│   └── callejero.yaml            # (F2) Segundo laboratorio
│
├── tests/
│   ├── contracts/                # Un test por adaptador contra archivo de muestra real anonimizado
│   ├── fixtures/                 # Archivos reales anonimizados, organizados por caso de prueba
│   ├── golden/                   # Días completos con resultado esperado validado a mano
│   ├── test_normalize.py         # Casos A y B de la batería
│   ├── test_expect.py            # Caso G
│   ├── test_match.py             # Casos C, D, E
│   ├── test_settle.py            # Caso F
│   ├── test_audit.py             # Casos H, I
│   └── test_golden_days.py       # Corre días completos y compara contra el resultado conocido
│
└── data/                         # Gitignored — datos reales, nunca versionados
    ├── inbox/                    # Carpeta vigilada: aquí se sueltan los archivos del día
    ├── processed/                # Archivos ya ingeridos, renombrados con timestamp
    └── auditor.db                # SQLite
```

La documentación de conocimiento (decisiones, aprendizajes, este plan) sigue viviendo en JARALAB_OS — el código referencia a JARALAB_OS, nunca al revés.

## 4. Sprint 1 (= F0 completo)

Lo mínimo que produce un resultado real: **ver un día completo de Pikeo convertido en una línea de tiempo financiera confiable.** Sin matching todavía — primero demostramos que leemos la realidad sin errores.

**Sesión 0 (bloqueante, Laura):** subir los tres archivos de un día ya conciliado a mano de Pikeo, con el resultado de esa conciliación manual (será el primer golden day).

**Sesión 1:** inspección documentada de los tres formatos reales (columnas, encoding, rarezas) → esqueleto del repo → esquema de base de datos → adaptador Loggro con test de contrato.

**Sesión 2:** adaptador del banco + adaptador de gastos, cada uno con test de contrato y falla ruidosa ante formato inesperado.

**Sesión 3:** normalización a eventos canónicos, clasificación `kind`, dedupe_hash, `auditor ingest` idempotente sobre la carpeta inbox.

**Sesión 4:** `auditor status --dia` con totales por fuente y por kind → **validación contra el conteo manual de Laura** → learning de F0 en `08_RESEARCH` → parada obligatoria y revisión de fase.

Definición de hecho del sprint: los 4 criterios de aceptación de F0 en verde, con los archivos reales, delante de Laura.

## 5. Estrategia de validación

El laboratorio es el negocio real: todos los criterios de aceptación se miden sobre datos de Pikeo y Callejero, nunca sobre datos inventados. Los datos sintéticos se permiten en un solo lugar: fixtures de tests unitarios para casos límite que aún no aparecen en los datos reales (ej: transposición de dígitos) — y cuando el caso real aparezca, reemplaza al sintético.

Tres capas de validación permanentes: (1) **tests de contrato** por adaptador — protegen contra cambios de formato; (2) **golden days** — días reales completos con resultado validado a mano que corren como regresión antes de cada avance; (3) **shadow mode** desde F1 — el proceso manual sigue vivo y cada discrepancia entre el Auditor y el humano se investiga hasta la causa raíz: o es bug (se corrige) o es error humano (se documenta como evidencia del valor del producto).

Anonimización: los fixtures que entren a git llevan contrapartes y referencias reemplazadas; los montos y patrones temporales se conservan porque son la sustancia del matching.

## 6. Sistema de documentación

Ya está montado sobre JARALAB_OS y este proyecto lo usa sin inventar nada nuevo: decisiones → `07_DECISIONS` (ADR); aprendizajes → `08_RESEARCH` al cierre de cada fase, obligatorio; bitácora → `09_DAILY_LOG` por sesión de construcción; cambios al blueprint → nueva versión + ADR que lo justifica. La prueba de fuego del sistema: cualquier persona o agente debe poder retomar el proyecto en cinco años leyendo README → blueprint → ADRs → learnings, en ese orden.

## 7. Estado y siguiente acción

Fase actual: **F0, Sesión 0.** Bloqueante único: los tres archivos reales de un día conciliado de Pikeo. Todo lo demás de este plan está listo para ejecutarse en cuanto lleguen.

---
title: "JaraLab Cash Control AI — Blueprint de Arquitectura"
type: blueprint
status: active
owner: "Laura Jaramillo"
created: 2026-07-08
updated: 2026-07-12
version: 1.4
tags: [jaralab-auditor, cash-control-ai, arquitectura, finanzas, conciliacion, producto]
related: ["spec.md", "../../07_DECISIONS/0001-nucleo-determinista-ia-en-los-bordes.md", "../../07_DECISIONS/0002-adaptadores-por-fuente.md", "../../07_DECISIONS/0003-stack-monolito-python-sqlite.md", "../../07_DECISIONS/0004-alcance-mvp-un-solo-canal.md", "../../07_DECISIONS/0005-aprendizaje-como-libro-de-reglas.md", "../../07_DECISIONS/0006-motor-de-expectativas.md", "../../07_DECISIONS/0007-alcance-v1-dinero-electronico.md", "../../07_DECISIONS/0008-nombre-de-mercado-cash-control-ai.md", "../../07_DECISIONS/0009-ingesta-con-fecha-objetivo-obligatoria.md", "../../07_DECISIONS/0010-calibracion-real-ventas-pos-fuente-de-verdad-del-monto.md", "../../07_DECISIONS/0011-fuentes-vivas-vs-archivos-exportados.md"]
---

# JaraLab Cash Control AI — Blueprint de Arquitectura

Nombre interno: Finance Agent 001 / `jaralab-auditor`. Nombre de mercado: JaraLab Cash Control AI (ADR-0008). Laboratorios de validación: Pikeo y Callejero, según la regla del repositorio de que ningún sistema se vende antes de validarse en casa.

Este documento es el **plan técnico** (arquitectura, stack, estructura de código). El objetivo de producto, las historias de usuario y los criterios de aceptación viven en `spec.md`, la fuente única de verdad del producto.

## 1. Tesis del producto

Movida a `spec.md` sección 1 ("Objetivo") y sección 2 ("Contexto del problema") como parte de la adopción de Spec-Driven Development (2026-07-11, ver ADR-0008 y `propuesta-reorganizacion-sdd.md`). Se mantiene aquí solo el eco necesario para entender las decisiones de arquitectura que siguen: la métrica que mata el producto no es un match que se escapó, sino un falso "todo bien" — toda la arquitectura de este blueprint está sesgada a levantar la mano ante la duda, nunca a bajarla.

## 2. Lo que cuestiono del brief

El brief es correcto en la visión y en el naming. Estas son mis objeciones como CTO, con la decisión formal de cada una registrada en `07_DECISIONS`:

**2.1 "Leer cualquier formato automáticamente, sin configuración" es la promesa equivocada para v1.** Un parser universal basado en IA que interpreta cualquier extracto es exactamente el tipo de componente que falla en silencio: lee mal una columna un día y el Auditor reporta cifras incorrectas con total seguridad. En dinero, la lectura de archivos debe ser determinista. La propuesta: adaptadores por fuente (Loggro, Bancolombia, el Sheets de gastos), escritos como código probado con tests de contrato. La IA sí participa, pero en el onboarding: cuando llega un banco nuevo, el LLM analiza el archivo, propone el adaptador, un humano lo valida contra un día conocido, y desde ahí es código determinista para siempre. El resultado para el usuario es casi el mismo ("le das el archivo y lo entiende") sin apostar la confiabilidad del núcleo. Decisión: ADR-0002.

**2.2 El matching no debe decidirlo un LLM.** El brief pide porcentajes de confianza; un LLM no produce porcentajes reales, produce números que parecen porcentajes. El motor de matching debe ser determinista y explicable: mismo input, mismo output, con una traza de evidencia que cualquier contador pueda auditar ("estos tres abonos suman la factura, llegaron dentro de 48h, la referencia comparte el NIT"). La confianza sale de un score calibrado con datos reales, no de la intuición de un modelo. El LLM entra en los bordes: redactar la explicación de cada excepción en lenguaje humano, responder preguntas sobre datos ya conciliados, y asistir el onboarding de formatos. Decisión: ADR-0001.

**2.3 El brief subestima el problema más difícil: los settlements de datáfono.** Las transferencias partidas (180.000 = 80+50+50) son un problema resuelto con búsqueda de combinaciones. El problema duro en Colombia es que las ventas con tarjeta nunca llegan al banco una a una: Redeban/CredibanCo las agrupa por día y franquicia, descuenta comisión más IVA, y deposita un agregado neto uno o dos días después. Conciliar eso exige agrupar ventas POS por fecha y medio de pago, modelar la comisión esperada y tolerar el desfase T+1/T+2. Lo mismo con el efectivo: no aparece en el banco por venta, aparece como consignaciones agregadas (si aparece). Este caso es de primera clase en el motor desde el diseño, no un edge case para después.

**2.4 Telegram, web y conversación en el MVP es dispersión.** Tres interfaces antes de tener un motor validado es construir fachada sin edificio. El MVP tiene una sola salida: el reporte diario HTML con su bandeja de excepciones. La conversación llega casi gratis después, porque todos los eventos y matches viven en una base de datos que un LLM puede consultar — pero llega cuando el motor ya demostró ≥85% de auto-conciliación en Pikeo y Callejero. Decisión: ADR-0004.

**2.5 "Debe aprender" — sí, pero como libro de reglas, no como memoria implícita.** Que "Laura Jaramillo" equivale a "Bancolombia Transferencia" no debe vivir en la memoria difusa de un modelo: debe ser una fila en una tabla de reglas — quién la creó, cuándo se validó, si sigue activa. Un auditor cuyas reglas no se pueden inspeccionar no es un auditor. Además esto hace el conocimiento portable entre modelos, coherente con el principio rector de JARALAB_OS. Decisión: ADR-0005.

**2.6 Sobre el naming, de acuerdo y un matiz.** JaraLab Auditor es el nombre correcto. El matiz: el momento de consumo también es producto. Propongo anclar la promesa a un ritual con hora — "tu cierre auditado, todos los días a las 7am" — porque la tranquilidad se vende mejor como hábito que como funcionalidad.

## 3. Arquitectura propuesta

Monolito modular en Python con un pipeline de seis etapas. Cada etapa es un módulo con entrada y salida definidas, lo que permite reemplazar cualquier pieza (nuevo banco, nuevo POS, nuevo país) sin tocar el resto.

```
INGESTA          adapters/ — un adaptador por fuente (loggro, bancolombia, gastos_sheet)
   ↓               salida: filas crudas + metadata de origen
NORMALIZACIÓN    core/normalize.py — todo se convierte al evento financiero canónico
   ↓               salida: tabla events (la línea de tiempo del día)
EXPECTATIVAS     core/expect.py — cada venta POS genera una expectativa de ingreso
   ↓               con monto neto esperado y fecha de vencimiento (ADR-0006)
MATCHING         core/match.py — motor determinista que resuelve expectativas contra
   ↓               eventos bancarios; salida: matches con evidencia y confianza
AUDITORÍA        core/audit.py — gastos vs débitos, duplicados, sin soporte, GMF/comisiones
   ↓               salida: hallazgos clasificados
ANOMALÍAS        core/anomaly.py — comparación contra el histórico del restaurante
   ↓               salida: alertas priorizadas
REPORTE          report/ — HTML autocontenido + bandeja de excepciones
```

La IA (Claude vía API) toca el sistema en exactamente tres puntos, todos en los bordes: generación asistida de adaptadores nuevos (onboarding), redacción de explicaciones de excepciones y anomalías en lenguaje de gerente, y más adelante la capa conversacional que consulta la base de datos. El núcleo — normalizar, matchear, auditar — nunca depende de un LLM para producir un número.

## 4. Modelo de datos canónico

Cinco tablas sostienen todo el sistema. Todas llevan `restaurant_id` desde el día uno, aunque v1 corra para un solo restaurante — el costo hoy es cero y la migración posterior sería dolorosa.

**events** — cada movimiento de cualquier fuente se vuelve un evento: `event_id`, `source` (loggro | banco | gastos), `source_ref`, `occurred_at`, `posted_at`, `direction` (in | out), `amount`, `currency`, `counterparty_raw`, `counterparty_norm`, `kind` (venta_pos, venta_efectivo, settlement_datafono, transferencia, consignacion, pago_proveedor, gmf, comision, impuesto, movimiento_interno, desconocido), `raw` (JSON del registro original, siempre se conserva), `dedupe_hash`.

**expectations** — el corazón del motor según ADR-0006: cada venta POS electrónica genera una expectativa de ingreso futuro: `expectation_id`, `origin_event_ids` (las ventas que la componen), `expected_amount` (neto de comisión estimada por franquicia), `expected_by` (fecha de vencimiento según T+1/T+2 del adquirente), `status` (abierta | conciliada | vencida | cancelada), `matched_event_ids`. El reporte diario se lee de esta tabla: lo conciliado tranquiliza, lo esperado-aún-no-vence no molesta, y solo lo **vencido sin llegar** alarma.

**matches** — `match_id`, `type` (exacto | tolerancia | partido | settlement | manual), `confidence` (0–100), `event_ids`, `evidence` (JSON con el desglose del score: monto, fecha, referencia, contraparte), `status` (auto | sugerido | confirmado | rechazado | pendiente).

**rules** — el libro de reglas del ADR-0005: `rule_id`, `type` (alias_contraparte | tolerancia | recurrente | clasificacion), `pattern`, `created_from` (el match que la originó), `validated_at`, `active`.

**daily_close** — un registro por día con los totales del reporte: vendido, conciliado, pendiente, hallazgos, minutos estimados ahorrados. Es el histórico contra el que corre la detección de anomalías.

## 5. Motor de matching

El motor corre en pasadas ordenadas de mayor a menor certeza, y cada evento solo puede pertenecer a un match:

1. **Deduplicación** por hash (mismo monto, fecha, referencia y fuente).
2. **Matches exactos**: monto idéntico, misma fecha ±1 día hábil, referencia o contraparte compatible.
3. **Matches con tolerancia**: diferencia ≤ un umbral configurable por tipo. Antes de aceptar, intenta explicar la diferencia con causas conocidas: GMF (exactamente 0.4% del monto), comisión de transferencia, redondeo. Una diferencia explicada sube la confianza; una inexplicada la baja.
4. **Pagos partidos**: búsqueda de combinaciones (subset-sum acotado: máximo 4 eventos, ventana de 72h, misma contraparte normalizada cuando exista). El caso 180.000 = 80.000 + 50.000 + 50.000 se resuelve aquí.
5. **Settlements de datáfono**: agrupa ventas POS por fecha y franquicia, calcula el neto esperado (bruto − comisión% − IVA sobre comisión − retenciones si aplican) y lo compara contra depósitos agregados en T+1/T+2. La tasa de comisión por franquicia se aprende del propio histórico y se guarda como regla.
6. **Aplicación del libro de reglas**: alias validados y patrones recurrentes se aplican antes del scoring para no volver a preguntar lo ya respondido.

El score de confianza es una suma ponderada de señales deterministas — cercanía de monto, cercanía temporal, similitud de referencia, contraparte conocida — calibrada contra los archivos reales de Pikeo y Callejero. Umbrales de arranque conservadores: ≥95 se auto-concilia, 70–94 se presenta como sugerencia con un clic de confirmación (cada confirmación puede generar una regla), <70 es excepción abierta. Los umbrales se relajan solo con evidencia: cuando una categoría lleva N días sin un falso positivo.

## 6. Realidad colombiana que el motor trata como ciudadano de primera clase

GMF/4x1000 identificado por fórmula exacta, no por heurística. Comisiones de datáfono entre ~1.5% y 3.5% más IVA según franquicia y adquirente. Desfase T+1/T+2 en tarjetas, absorbido por el motor de expectativas (ADR-0006) para que un ingreso en tránsito nunca genere falsa alarma. Referencias bancarias inútiles tipo "PAGO PSE 4832991" que obligan a matchear por monto+tiempo+historial en vez de por texto. Propinas e impoconsumo que hacen que el total POS no sea el total esperado en banco. Cada uno de estos tiene un lugar explícito en el motor; ninguno es un caso raro.

**Alcance del efectivo (ADR-0007):** v1 audita exclusivamente dinero electrónico — transferencias, datáfonos, PSE, débitos. El efectivo no llega al banco venta a venta y sin un registro de arqueo de caja no es auditable con honestidad. En vez de fingir cobertura total, el reporte diario declara explícitamente qué porcentaje de la venta del día está bajo auditoría ("hoy auditamos el 64% de tu venta; el efectivo aún no está cubierto"). El arqueo de caja como cuarta fuente entra en F3+.

**El registro de gastos es fuente de baja confianza por diseño.** Lo llena un humano, tarde y con errores. El motor le aplica un período de gracia configurable (48–72h): un débito bancario sin soporte no alarma de inmediato, se devuelve al gerente como tarea ("registra estos 3 gastos") y solo escala a alerta si vence la gracia. Rigor de extracto bancario para el banco; tolerancia realista para lo humano.

**El Sheets de gastos es una fuente viva, no un archivo diario, aunque v1 lo consuma como archivo.** Cada adaptador ya traduce su fuente a `RawRow` — un contrato que nunca supo ni le importó si el origen era un archivo local o una respuesta de API. Por diseño, no por casualidad: sustituir la exportación manual del Sheet por lectura directa (API o sincronización) es agregar una función que produce `RawRow` desde la API, no rediseñar el pipeline (ADR-0011). El mismo patrón aplica a Loggro y Bancolombia si algún día ofrecen integración directa.

**Ingesta operativa v1:** hoy alguien exporta los archivos a mano cada día. La v1 reduce esa fricción al mínimo viable sin construir integraciones: una carpeta vigilada (Google Drive o carpeta local) donde el gerente suelta los archivos y el Auditor hace el resto — detecta la fuente por el contenido (no por el nombre del archivo), procesa de forma idempotente (re-subir un extracto o subir el mensual encima del diario no duplica eventos, gracias al dedupe_hash) y confirma qué recibió y qué falta. La ingesta siempre corre contra una fecha objetivo declarada por el usuario, nunca contra "todo lo que traiga el archivo": Bancolombia solo entrega extractos por rango, nunca de un solo día, así que un mismo archivo puede traer movimientos de varios días — solo los del día pedido entran a la base, el resto se ignora sin error (ADR-0009). Eliminar la exportación manual por completo (correo del banco, API de Loggro) es la mejora de mayor impacto en adopción y se investiga en paralelo a F1.

## 7. Stack técnico

Definido por una restricción real: lo construye y mantiene Laura con asistencia de IA, sin equipo de ingeniería. Eso descarta microservicios, colas, Docker y cloud en v1.

Python 3.12, pandas para manipulación, SQLite como base de datos (un archivo, cero administración, migrable a Postgres cuando haya 3+ restaurantes), pdfplumber solo si el banco no ofrece export a Excel/CSV — la regla operativa es pedir siempre el formato estructurado y dejar el PDF como último recurso. La salida es un reporte HTML autocontenido, abrible en cualquier navegador y enviable por WhatsApp, con los KPI del cierre y la bandeja de excepciones. La interfaz de operación en v1 es un comando: `auditor run --dia 2026-07-08`. Todo vive en un repositorio que Claude Code puede mantener completo en contexto. Decisión: ADR-0003.

Escalabilidad sin sobre-ingeniería: los adaptadores aíslan las fuentes, el modelo canónico aísla el motor de los formatos, SQLite→Postgres es una migración conocida, y el reporte HTML se convierte en panel web cuando exista demanda real. Nada del diseño v1 hay que tirarlo para crecer; solo hay que reemplazar bordes.

## 8. Roadmap

**F0 — Fundación (esta semana).** Con los archivos reales que sube Laura: adaptadores Loggro + banco + gastos, modelo canónico, deduplicación. Criterio de salida: un día real completo de Pikeo o Callejero leído y normalizado sin intervención manual, verificado contra conteo a mano.

**F1 — Matching v1 (semanas 2–3).** Pasadas 1–3 del motor: exactos, tolerancia, GMF y comisiones, más la generación de expectativas. Criterio de salida: ≥70% de auto-conciliación en dinero sobre 5 días reales, cero falsos positivos. Desde F1 el sistema corre en **shadow mode**: el proceso manual del restaurante sigue vivo y cada conclusión del Auditor se compara contra la del humano — así se calibran los umbrales de confianza con verdad conocida, no con intuición. El shadow mode solo se apaga cuando F2 cumple su criterio de salida.

**F2 — Los casos duros (semanas 4–5).** Pagos partidos, settlements de datáfono, libro de reglas, reporte diario HTML completo. Criterio de salida: ≥85% de auto-conciliación, el gerente resuelve el día en menos de 10 minutos, 10 días consecutivos operando en un laboratorio.

**F3 — Inteligencia visible (semana 6+).** Detección de anomalías contra el histórico de daily_close, explicaciones redactadas por LLM, y solo entonces el canal Telegram. Criterio de salida: el gerente de Pikeo o Callejero prefiere el reporte del Auditor a su proceso manual — medido en que dejó de hacer el proceso manual.

Solo después de F3 validado en ambos laboratorios se ofrece a un cliente externo, conforme a la regla del repositorio.

## 9. Métricas del sistema

Tasa de auto-conciliación en dinero (no en número de movimientos: conciliar el 90% de los movimientos que representan el 40% de la plata es fracasar). Falsos positivos con meta cero absoluto. Minutos diarios del gerente. Días consecutivos sin intervención técnica. Excepciones que generaron regla (mide si el sistema aprende de verdad).

## 10. Riesgos

El banco cambia el formato del export: tests de contrato por adaptador que fallan ruidosamente en la ingesta, nunca en silencio en el reporte. PDF mal extraído: preferencia dura por CSV/Excel. Sobre-confianza temprana en el auto-match: umbrales conservadores y relajación solo con evidencia. Scope creep de canales e integraciones: el ADR-0004 existe para citarlo cuando aparezca la tentación. Dependencia de una sola persona: el repositorio mismo (este documento, los ADRs, los learnings) es el plan de mitigación — cualquier dev o agente futuro puede reconstruir el contexto.

## 11. Próximos pasos

1. Laura sube los archivos reales: exportación de ventas Loggro, extracto bancario (ideal Excel/CSV), registro de gastos.
2. Se construye F0 sobre esos archivos y se valida contra un día contado a mano.
3. Al cerrar F0, se documenta el primer aprendizaje en `08_RESEARCH` (qué tan sucios venían los datos reales vs lo asumido aquí) y se actualiza este blueprint a v1.1 si algo del diseño no sobrevivió el contacto con los datos.

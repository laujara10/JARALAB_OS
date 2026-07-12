---
title: "JaraLab Cash Control AI — Spec"
type: spec
status: active
owner: "Laura Jaramillo"
created: 2026-07-11
updated: 2026-07-11
version: 1.0
tags: [jaralab-auditor, cash-control-ai, spec, spec-driven-development, finanzas, conciliacion, producto]
related: ["blueprint-arquitectura.md", "backlog.md", "plan-de-ejecucion.md", "casos-de-prueba.md", "../../07_DECISIONS/0001-nucleo-determinista-ia-en-los-bordes.md", "../../07_DECISIONS/0002-adaptadores-por-fuente.md", "../../07_DECISIONS/0003-stack-monolito-python-sqlite.md", "../../07_DECISIONS/0004-alcance-mvp-un-solo-canal.md", "../../07_DECISIONS/0005-aprendizaje-como-libro-de-reglas.md", "../../07_DECISIONS/0006-motor-de-expectativas.md", "../../07_DECISIONS/0007-alcance-v1-dinero-electronico.md", "../../07_DECISIONS/0008-nombre-de-mercado-cash-control-ai.md"]
---

# JaraLab Cash Control AI — Spec

Nombre interno: `jaralab-auditor` (Finance Agent 001). Nombre de mercado: **JaraLab Cash Control AI**. Este documento es la fuente única de verdad de **qué** construye el producto y **por qué**. El **cómo** (arquitectura, stack, estructura de código) vive en `blueprint-arquitectura.md`; **en qué orden** (tareas ejecutables) vive en `backlog.md`; los **no negociables** de diseño ya decididos viven en `07_DECISIONS/0001`–`0008`. Ningún requisito de este documento contradice un ADR activo — si algo aquí y un ADR entran en conflicto, el ADR gana hasta que se reemplace formalmente.

Laboratorios de validación: Pikeo y Callejero. Ningún sistema se ofrece a un cliente externo sin validarse primero en un laboratorio propio (principio de JARALAB_OS).

## 1. Objetivo

Automatizar la conciliación financiera diaria de un restaurante independiente: comparar las ventas registradas (POS/Sheets) contra el dinero que efectivamente llegó al banco, detectar diferencias y excepciones, y entregar cada mañana un reporte que le diga al gerente si ayer cuadró la plata o qué necesita revisar — sin que él tenga que hacer el cruce a mano.

## 2. Contexto del problema

El gerente de un restaurante independiente hoy concilia a mano con hojas de cálculo que no entiende del todo: cruza ventas de POS contra extractos bancarios, absorbe a ojo las comisiones de datáfono, los desfases T+1/T+2 de los adquirentes, los pagos partidos y los gastos sin soporte. El proceso es lento, propenso a error humano, y no escala más allá de un restaurante. El gerente no compra conciliación bancaria — compra la certeza de que ayer no se perdió plata, entregada sin esfuerzo. Ver `blueprint-arquitectura.md` sección 1 para la tesis de producto completa.

## 3. Alcance

**Dentro de alcance v1:** conciliación de dinero electrónico — transferencias, datáfonos, PSE, débitos y consignaciones (ADR-0007). Ingesta desde adaptadores deterministas por fuente: POS/Loggro, extracto bancario, registro de gastos en Sheets (ADR-0002). Salida única: reporte diario HTML autocontenido (ADR-0004).

**Fuera de alcance v1, con extensión planeada:** arqueo de caja / efectivo (entra en F3+, ADR-0007), canal Telegram y capa conversacional (entran en F3, ADR-0004), OCR de comprobantes de pago, dashboards interactivos multiusuario. Ver sección 12.

**Cobertura declarada, no oculta:** mientras el efectivo no esté auditado, el reporte declara explícitamente qué porcentaje de la venta del día está bajo auditoría — la cobertura parcial es información, nunca una promesa implícita rota (ADR-0007).

## 4. Usuarios

- **Gerente/administrador de restaurante** (usuario principal): recibe el reporte diario, revisa la bandeja de excepciones, confirma o corrige sugerencias, registra gastos pendientes. Hoy: Pikeo y Callejero (laboratorios propios). Después de validación: clientes externos de JaraLab.
- **Sistema (rol interno):** ingiere, normaliza, concilia y audita sin intervención humana salvo excepciones.
- **Laura (owner/operadora técnica):** mantiene el sistema, valida adaptadores nuevos, aprueba cambios de arquitectura.

## 5. Historias de usuario

Trazabilidad: cada historia corresponde a una épica de `backlog.md` (mismo ID).

| ID | Historia |
|---|---|
| E1 | Como administradora, quiero soltar los archivos del día en una carpeta y que el sistema los entienda solo, para no configurar nada nunca. |
| E2 | Como sistema, necesito que todo movimiento de cualquier fuente se vuelva un evento canónico único e irrepetible, para que el motor nunca trabaje sobre datos ambiguos. |
| E3 | Como gerente, quiero que el dinero en tránsito (datáfono T+1/T+2) no me genere alarmas, y que lo vencido sin llegar me alarme siempre. |
| E4 | Como gerente, quiero que todo lo obvio se concilie solo con evidencia visible, para revisar únicamente excepciones. |
| E5 | Como gerente, quiero saber qué plata salió sin soporte y qué proveedor se pagó dos veces, sin que un gasto registrado tarde me genere falsas alarmas. |
| E6 | Como gerente, quiero que lo que ya confirmé una vez no se me vuelva a preguntar nunca. |
| E7 | Como gerente, quiero abrir un solo reporte cada mañana y saber en 2 minutos si todo cuadró y qué necesita mi ojo. |
| E8 | Como gerente, quiero que me avisen cuando algo se sale del patrón histórico de mi restaurante, antes de que yo lo note. |
| E9 | Como gerente, quiero preguntarle al sistema "¿por qué esta diferencia?" y recibir la respuesta de un analista senior. |

## 6. Flujo funcional

Pipeline de seis etapas, cada una con entrada y salida definidas (detalle técnico completo en `blueprint-arquitectura.md` sección 3):

```
INGESTA → NORMALIZACIÓN → EXPECTATIVAS → MATCHING → AUDITORÍA → ANOMALÍAS → REPORTE
```

1. **Ingesta:** un adaptador por fuente lee el archivo del día y produce filas crudas con metadata de origen.
2. **Normalización:** las filas crudas se convierten en eventos financieros canónicos, deduplicados.
3. **Expectativas:** cada venta electrónica genera una expectativa de ingreso (monto neto esperado, fecha de vencimiento según ciclo del adquirente).
4. **Matching:** el motor resuelve expectativas contra eventos bancarios en pasadas de certeza creciente (exacto, tolerancia, partidos, settlements).
5. **Auditoría:** gastos vs débitos, duplicados, cobros bancarios (GMF, comisiones).
6. **Anomalías (F3):** comparación contra el histórico del restaurante.
7. **Reporte:** HTML autocontenido con KPIs del cierre y bandeja de excepciones accionable.

## 7. Requisitos funcionales

| ID | Requisito | Fase |
|---|---|---|
| RF1 | Ingesta multi-fuente por adaptadores deterministas (POS/Loggro, banco, gastos) con detección de fuente por contenido | F0 |
| RF2 | Normalización a evento canónico único + deduplicación idempotente (re-ingerir no duplica) | F0 |
| RF3 | Motor de expectativas por venta electrónica, con ciclo T+n y comisión estimada por franquicia (ADR-0006) | F1 |
| RF4 | Motor de matching multi-pasada: exacto, con tolerancia explicada, pagos partidos, settlements de datáfono agregados | F1–F2 |
| RF5 | Auditoría de gastos: débitos sin soporte con período de gracia, pagos duplicados a proveedor, clasificación de cobros bancarios | F2 |
| RF6 | Libro de reglas: alias de contraparte, tolerancias y comisiones aprendidas, cada una auditable y desactivable (ADR-0005) | F2 |
| RF7 | Reporte diario HTML: KPIs del cierre, tres estados (conciliado / en tránsito / vencido), % de cobertura auditada, bandeja de excepciones con evidencia | F1–F2 |
| RF8 | Detección de anomalías contra baseline histórico por día de semana | F3 |
| RF9 | Explicaciones en lenguaje humano generadas por LLM sobre evidencia determinista, nunca contra ella (ADR-0001) | F3 |
| RF10 | Canal conversacional (Telegram) para recibir el reporte y preguntar sobre datos ya conciliados | F3 |

## 8. Requisitos no funcionales

- **Determinismo y reproducibilidad del núcleo:** mismo input, mismo output, con traza de evidencia por cada resultado (ADR-0001).
- **Auditabilidad:** cualquier match, excepción o regla debe poder explicarse a un contador humano.
- **Falla ruidosa, nunca silenciosa:** un formato inesperado detiene la ingesta con mensaje claro; nunca entra dato sucio a la base (ADR-0002).
- **Mantenibilidad por una sola persona + IA:** monolito modular Python + SQLite, sin cloud ni Docker ni servidor en v1, operado por CLI (ADR-0003).
- **Portabilidad del conocimiento:** nada del sistema depende de la memoria propietaria de un proveedor de IA específico (principio rector de JARALAB_OS).
- **Privacidad de datos financieros:** los datos reales nunca se versionan en git; los fixtures que sí entran a git van anonimizados en contrapartes y referencias.
- **Costo marginal bajo:** el costo por corrida diaria debe mantenerse cercano a cero; la IA solo participa en bordes, no en el núcleo de cada corrida.

## 9. Reglas de negocio

- Solo dinero electrónico está en alcance de auditoría en v1; el reporte declara siempre el % de cobertura (ADR-0007).
- Un evento bancario pertenece a un único match; nunca se asigna dos veces.
- Una expectativa tiene exactamente tres estados posibles — conciliada, en tránsito (no vencida) y vencida sin llegar — y solo el tercero genera alarma (ADR-0006).
- Toda regla aprendida queda registrada con su origen (de qué match nació), quién la validó y cuándo, y puede desactivarse sin borrarse (ADR-0005).
- El indicador que nunca se negocia: **cero falsos "todo bien"**. Ante la duda, el sistema levanta la mano — se prefiere una excepción de más que una alarma de menos (criterio transversal, `casos-de-prueba.md`).
- Ningún sistema se ofrece a un cliente externo sin haberse validado antes en Pikeo y/o Callejero.

## 10. Casos borde

La batería completa de 40 casos borde (categorías A–J: normalización, deduplicación, matching exacto, tolerancias, pagos partidos, settlements de datáfono, expectativas, auditoría de gastos, errores humanos y duplicados bancarios, anomalías) vive en `casos-de-prueba.md` y no se duplica aquí. Regla general de esa batería: cada caso se prueba primero contra el resultado esperado incluyendo su evidencia, no solo el match.

## 11. Criterios de aceptación

Detalle completo por fase en `plan-de-ejecucion.md`. Resumen de las puertas de fase:

- **F0 (fundación de datos):** un día real de Pikeo se ingiere con un comando; los totales por fuente coinciden al peso con el conteo manual; re-ingerir no duplica; un formato inesperado falla ruidosamente. *(Código-completo con datos sintéticos; pendiente de validar con archivos reales de Pikeo — ver `09_DAILY_LOG/2026-07-08-jaralab-auditor-f0-construido.md`.)*
- **F1 (matching v1 + expectativas):** ≥70% de auto-conciliación en dinero sobre 5 días reales consecutivos; cero falsos positivos; ninguna venta en tránsito genera alarma; todo match automático muestra su evidencia.
- **F2 (casos duros):** ≥85% de auto-conciliación; 10 días consecutivos con <10 min/día de gerente; una pregunta respondida una vez no se repite; cero falsos positivos sostenido.
- **F3 (inteligencia visible):** el gerente abandona su proceso manual (medido en comportamiento); ≥80% de anomalías señaladas son relevantes a juicio del gerente; ninguna explicación LLM contradice la evidencia determinista.
- **Puerta de salida a mercado:** solo después de F3 validado en ambos laboratorios se ofrece el producto a un cliente externo.

## 12. Riesgos

| Riesgo | Fase | Mitigación |
|---|---|---|
| Formatos reales más sucios de lo previsto | F0 | F0 existe específicamente para absorber esta sorpresa antes de construir sobre datos limpios asumidos |
| Extracto bancario solo disponible en PDF | F0 | Verificar con el banco la existencia de un export estructurado antes de escribir el parser |
| Umbrales de score mal calibrados | F1 | Shadow mode desde F1; umbrales arrancan conservadores |
| Comisiones de datáfono más variables de lo esperado | F1 | Se aprenden del histórico real vía libro de reglas |
| Explosión combinatoria en pagos partidos | F2 | Poda acotada k≤4, ventana 72h, poda por contraparte |
| Reglas aprendidas que se contradicen entre sí | F2 | Precedencia por fecha de validación; toda regla es desactivable |
| Anomalías ruidosas que erosionan confianza | F3 | Arrancar con pocas señales de alta precisión |
| Dependencia del proveedor LLM | F3 | La capa de IA es un borde reemplazable por diseño (ADR-0001); el núcleo nunca depende de un LLM |
| Un falso "todo bien" (el riesgo que mata el producto) | Transversal | Toda la arquitectura está sesgada a levantar la mano ante la duda, nunca a bajarla |

## 13. Métricas de éxito

- % de auto-conciliación en dinero: ≥70% (F1) → ≥85% (F2).
- Falsos positivos: cero, sostenido, medido contra shadow mode.
- Tiempo del gerente en el proceso: <10 min/día (F2).
- % de anomalías relevantes a juicio del gerente: ≥80% (F3).
- Abandono medible del proceso manual por el gerente (F3), no solo opinión favorable.
- % de cobertura de venta bajo auditoría, visible cada día en el reporte (ADR-0007).

## 14. Posibles extensiones futuras

- **Arqueo de caja (efectivo)** como cuarta fuente de auditoría, ya contemplada en el esquema de datos (`kind = venta_efectivo`, `consignacion`) — entra en F3+ cuando el motor ya esté validado (ADR-0007).
- **OCR de comprobantes de pago y facturas**, para reducir la dependencia de registros manuales en Sheets — sin ADR propio todavía; requiere blueprint y decisión de arquitectura antes de construirse, siguiendo la misma disciplina de núcleo determinista con IA en los bordes (ADR-0001).
- **Dashboards / panel web interactivo multiusuario**, evolución natural del reporte HTML + CLI cuando exista demanda real de varios restaurantes o varios usuarios por restaurante (ruta de escala definida en ADR-0003).
- **Escala a múltiples restaurantes** con migración de SQLite a Postgres cuando haya 3+ restaurantes activos (ADR-0003).
- **Capa conversacional y canal Telegram**, ya planeada formalmente para F3 (ADR-0004), no es extensión especulativa sino roadmap comprometido.

## 15. Historial

- **v1.0 (2026-07-11):** primera versión. Consolida la tesis de producto, historias de usuario y criterios de aceptación que antes vivían dispersos en `blueprint-arquitectura.md`, `backlog.md` y `plan-de-ejecucion.md`, en el marco de la adopción formal de Spec-Driven Development para este producto (ver `propuesta-reorganizacion-sdd.md` y ADR-0008).

---
title: "JaraLab Cash Control AI — Visión de Producto"
type: vision
status: active
owner: "Laura Jaramillo"
created: 2026-07-12
updated: 2026-07-12
version: 1.0
tags: [jaralab-auditor, cash-control-ai, vision, producto, estrategia]
related: ["spec.md", "blueprint-arquitectura.md", "../../01_STRATEGY/north_star.md", "../../07_DECISIONS/0007-alcance-v1-dinero-electronico.md", "../../07_DECISIONS/0008-nombre-de-mercado-cash-control-ai.md"]
---

# JaraLab Cash Control AI — Visión de Producto

Nombre interno: `jaralab-auditor` (Finance Agent 001). Nombre de mercado: **JaraLab Cash Control AI**. Este documento responde una pregunta que `spec.md` no responde: no qué construye v1 y por qué, sino **hacia dónde va este producto en 2–3 años y por qué eso le importa a JaraLab**. Es el North Star de este producto específico, hijo del North Star de la empresa (`01_STRATEGY/north_star.md`). No repite alcance, requisitos ni fases de v1 — esos viven en `spec.md` y `blueprint-arquitectura.md` y ningún contenido de ese nivel se duplica aquí.

## 1. La apuesta de fondo

El restaurante independiente latinoamericano no tiene un problema de honestidad, tiene un problema de visibilidad. Nadie roba a propósito la mayoría de las veces; el dinero se pierde en el desfase entre lo que el POS dice que se vendió y lo que el banco confirma que llegó, y ese desfase hoy solo lo puede ver alguien que sepa hacer conciliación bancaria a mano. La mayoría de los dueños no sabe, no tiene tiempo, o paga a un contador que revisa una vez al mes cuando el hueco ya lleva treinta días abierto.

La apuesta de JaraLab Cash Control AI es que **la conciliación diaria y automática se convierte en la puerta de entrada financiera de un restaurante** — el primer sistema que un operador independiente adopta antes de cualquier ERP, CRM o BI, porque resuelve la pregunta más ansiosa de todas ("¿ayer se perdió plata?") sin pedirle nada a cambio salvo soltar unos archivos en una carpeta.

## 2. Por qué esto y no otra cosa

JaraLab ya vende growth, marketing y automatización. Cash Control AI no es una línea de negocio nueva desconectada de esa tesis: es la que abre la puerta. Un dueño de restaurante no confía sus datos de ventas a un proveedor de marketing hasta que ese proveedor le demuestra que entiende su plata mejor que su propio Excel. Cash Control AI es ese primer acto de confianza — y una vez instalado, JaraLab tiene una razón legítima para estar todos los días dentro del negocio del cliente, lo que hace natural vender después growth, fidelización o BI sobre la misma base de datos ya limpia.

Esto también invierte el orden habitual de adquisición en SaaS B2B para restaurantes independientes: en vez de vender una promesa de crecimiento (difícil de probar en 90 días), se vende una promesa de control (verificable todas las mañanas). El control genera la confianza que el crecimiento necesita para venderse después.

## 3. A quién le duele esto y por qué paga

El comprador no es un CFO ni un contador — es el dueño-operador que hoy hace de contador a las 11pm con una hoja de cálculo que no termina de entender, o el gerente que le rinde cuentas a ese dueño. No compra "conciliación bancaria": compra la certeza de dormir tranquilo sabiendo que ayer no se perdió plata, entregada sin esfuerzo, todos los días a la misma hora — un ritual, no una funcionalidad (la promesa de posicionamiento ya identificada en `blueprint-arquitectura.md` sección 2.6: *"tu cierre auditado, todos los días a las 7am"*).

Esto importa para pricing y para producto: el valor no escala con features, escala con **confianza acumulada**. Cada día que el reporte acierta sin falsos positivos, el dueño delega un poco más y revisa un poco menos — y ese es el verdadero producto: tiempo y tranquilidad devueltos, no un dashboard más.

## 4. Categoría: por qué "Cash Control AI" y no "software de conciliación"

El mercado de conciliación bancaria existe y está ocupado por herramientas contables genéricas (multi-país, multi-moneda, pensadas para un contador que ya sabe lo que busca). JaraLab no compite ahí. La categoría que este producto busca crear es distinta: **control de caja auditado por IA, diseñado para el operador que no sabe de contabilidad**, con la realidad colombiana (GMF, comisiones de datáfono por franquicia, desfases T+1/T+2, referencias bancarias inservibles) tratada como ciudadana de primera clase desde el diseño, no como un caso raro que un producto genérico ignora.

Ganar esta categoría significa que dentro de 2–3 años, cuando un operador de restaurante en Colombia diga "necesito controlar mi caja", JaraLab Cash Control AI sea la respuesta obvia — igual que "Conciliación bancaria de restaurante" hoy no tiene un líder claro porque nadie ha construido específicamente para este comprador.

## 5. El foso (moat), no el feature

Tres cosas hacen este producto difícil de copiar con el tiempo, ninguna de ellas es el matching en sí — el matching determinista es reproducible por cualquier competidor con tiempo suficiente:

**El libro de reglas por restaurante** (ADR-0005) es conocimiento acumulado y auditable que crece con el uso: alias de contraparte, tolerancias aprendidas, comisiones calibradas por franquicia. Migrar un restaurante a otro proveedor significa perder ese historial silencioso que hoy le ahorra minutos cada mañana — es un costo de cambio real, no artificial.

**La calibración con datos reales colombianos** (comisiones por franquicia y adquirente, patrones de desfase, formatos de banco) es un activo que solo se construye operando de verdad en el mercado, no leyendo documentación pública. Cada restaurante nuevo que se conecta mejora la calibración para el siguiente — un efecto de red modesto pero real dentro del mismo país y segmento.

**La disciplina de núcleo determinista con IA en los bordes** (ADR-0001) es una ventaja de confianza, no de tecnología: un competidor que use un LLM para decidir el matching va a fallar en silencio antes o después, y en dinero eso destruye la categoría entera, no solo a un competidor. JaraLab puede señalar esa disciplina como diferenciador explícito frente a cualquier "AI bookkeeping" genérico que aparezca.

## 6. Cómo se ve ganar, más allá del roadmap de v1

`spec.md` define las puertas de F0 a F3 y el criterio de salida a mercado (validado en Pikeo y Callejero antes de ofrecerse a un cliente externo). Esta sección no repite eso: describe qué significa que el producto haya ganado, no que haya cumplido una fase.

Ganar significa que el dueño de un restaurante deja de abrir su hoja de cálculo de conciliación — no porque se le pidió, sino porque genuinamente confía más en el reporte de las 7am. Significa que el % de cobertura declarada (hoy limitado a dinero electrónico, ADR-0007) sube porque el arqueo de caja se incorporó y el reporte audita prácticamente toda la venta del día, no una porción honesta pero parcial. Significa que un restaurante nuevo se conecta y llega a auto-conciliación alta en días, no semanas, porque el motor ya viene calibrado con el conocimiento de los restaurantes anteriores. Y significa, más adelante, que el mismo modelo de datos que hoy solo concilia empieza a responder preguntas de negocio ("¿qué día de la semana se me va más plata en comisiones?") — la capa conversacional de F3 es el primer paso de esa expansión, no el techo.

## 7. Expansión natural: de conciliar a decidir

El modelo de datos canónico (`events`, `expectations`, `matches`, `rules`, `daily_close`, ver `blueprint-arquitectura.md` sección 4) no se construyó solo para conciliar — se construyó como la línea de tiempo financiera completa del restaurante. Eso habilita, en orden de cercanía a lo ya construido y no como compromiso de roadmap sino como dirección:

Primero, cerrar la cobertura con el arqueo de caja (ya contemplado en el esquema, `kind = venta_efectivo`), para que la promesa de "ayer cuadró la plata" cubra el 100% de la venta, no solo el dinero electrónico. Segundo, convertir el `daily_close` histórico en inteligencia hacia adelante: no solo detectar anomalías contra el patrón del restaurante, sino proyectar flujo de caja y alertar de riesgos antes de que ocurran. Tercero, escalar de un restaurante a una cadena pequeña o a un grupo de restaurantes independientes con el mismo dueño, migrando de SQLite a Postgres (ruta ya definida en ADR-0003) sin rediseñar el núcleo. Cuarto, el panel web multiusuario reemplaza al reporte HTML cuando exista demanda real de varios usuarios por restaurante — evolución de interfaz, no de motor.

Cada uno de estos pasos reutiliza el mismo núcleo determinista. Nada de lo construido en v1 se descarta para crecer — es la ventaja de haber empezado por el modelo de datos correcto en vez de por la interfaz más vistosa.

## 8. Riesgos que matarían la visión, no solo la fase

`spec.md` documenta los riesgos tácticos de construir v1 (formatos sucios, umbrales mal calibrados, PDF en vez de export estructurado). A nivel de visión, los riesgos son otros: que un falso "todo bien" ocurra una sola vez con un cliente externo real y destruya en un día la confianza que tomó meses construir — por eso la regla de no vender sin validar en Pikeo y Callejero no es burocracia, es la única defensa real de esta categoría. Que JaraLab se distraiga vendiendo esto como "software de conciliación" genérico en vez de como control de caja auditado para el operador que no sabe de contabilidad, y pierda el posicionamiento que lo diferencia de las herramientas contables ya establecidas. Y que la expansión de features (sección 7) se adelante a la validación del núcleo — el mismo error que el blueprint ya rechazó una vez al descartar Telegram, web y conversación en el MVP (ADR-0004).

## 9. Qué significa "éxito" a 2–3 años

No una lista de métricas de fase — esas viven en `spec.md` sección 13. A nivel de visión: que JaraLab Cash Control AI sea, dentro de la categoría que crea, la razón por la que un restaurante independiente entra a la órbita de JaraLab; que el conocimiento acumulado en el libro de reglas y en la calibración por restaurante sea un activo que un competidor no puede replicar simplemente copiando la interfaz; y que el mismo modelo de datos que hoy resuelve "¿cuadró la plata?" sea, sin haber sido rediseñado, la base sobre la que se responde "¿cómo le está yendo al negocio?".

## 10. Historial

- **v1.0 (2026-07-12):** primera versión. Se creó como capa estratégica separada de `spec.md` (que ya cubre exhaustivamente el qué y el por qué táctico de v1) a solicitud explícita de Laura, tras confirmar que no existía previamente un documento de visión de producto de largo plazo — solo la visión de empresa en `01_STRATEGY/north_star.md` y el "qué construye v1" en `spec.md`.

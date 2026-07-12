---
title: "JARALAB_OS — Constitución Técnica del Cerebro Permanente"
type: blueprint
status: draft
owner: "Laura Jaramillo"
created: 2026-07-09
updated: 2026-07-09
version: 0.1
tags: [jaralab-os, arquitectura, ia, memoria, agentes, gobernanza]
related: ["../README.md", "../07_DECISIONS/0001-nucleo-determinista-ia-en-los-bordes.md", "../07_DECISIONS/0003-stack-monolito-python-sqlite.md", "../07_DECISIONS/0005-aprendizaje-como-libro-de-reglas.md"]
---

# JARALAB_OS — Constitución Técnica del Cerebro Permanente

Este documento diseña el sistema que hace que la inteligencia de JaraLab viva en JaraLab y no en el modelo de turno. Los LLM son motores de razonamiento intercambiables; todo lo que importa — identidad, memoria, criterio, evidencia, método — debe sobrevivir a cualquier cambio de proveedor sin pérdida.

No parte de cero, y esa es la primera afirmación importante: el repositorio JARALAB_OS ya es el embrión de este cerebro, y las decisiones tomadas para el Auditor (ADR-0001 a 0007) contienen, en pequeño, casi todos los principios correctos. Este documento hace tres cosas: eleva esos principios de "decisiones de un producto" a "leyes de la empresa", completa las piezas que faltan, y desmonta las partes del brief que llevarían a construir el sistema equivocado.

---

## Parte I — Lo que cuestiono del brief

Pediste que no protegiera tus ideas. Estas son las cinco objeciones, con la reconstrucción de cada una en la Parte II.

**1.1 El cerebro no es un software que hay que construir. Es una disciplina que hay que sostener.** El brief habla de "diseñar el cerebro" como si fuera un sistema por programar: orquestador, agentes, capas. La versión que funciona para una empresa de una persona es más incómoda: el cerebro es el repositorio más un conjunto de protocolos que se cumplen todos los días. El 80% del valor está en Markdown bien gobernado, datos en SQLite y prompts versionados; el 20% restante es automatización que se gana por etapas. Si esto se aborda como proyecto de software, en el mes tres habrá una plataforma a medio construir y cero clientes nuevos. Si se aborda como disciplina, en el mes tres habrá un sistema vivo que ya trabajó en proyectos reales.

**1.2 Los once agentes con nombres de C-suite son un organigrama de fantasía.** CEO, CMO, CFO, Growth, Contenido, Ads, Consultoría, Auditor, Data, CRM, Operaciones: once agentes para una empresa de una fundadora es replicar la burocracia de una corporación sin tener la corporación. Peor: los títulos ejecutivos inducen un error de diseño. Un "agente CEO" sugiere autoridad para decidir, y ningún LLM debe tener autoridad para decidir en JaraLab — eso contradice tu propio ADR-0001. Los agentes correctos se definen por capacidad y por contrato de entrada/salida, no por jerarquía humana. En la Parte II reduzco los once a cinco roles que cubren todas las funciones listadas, y explico a cuál se asigna cada una.

**1.3 Vectores y grafos son respuestas a un problema que JaraLab no tiene todavía.** El módulo 6 del brief pone Markdown, JSON, SQLite, vectores y graph como opciones al mismo nivel. No lo están. Un vector store se justifica cuando el corpus ya no cabe en el contexto de trabajo de un modelo — el canon de JaraLab hoy cabe entero, y va a caber durante muchos meses. Un grafo de conocimiento formal se justifica cuando hay miles de entidades interrelacionadas que se consultan por sus relaciones — el campo `related` del frontmatter ya es un grafo suficiente y gratis. Adoptar cualquiera de los dos hoy agrega infraestructura que mantener, un formato más del que depender, y cero capacidad nueva. Defino en el módulo 6 el disparador objetivo para adoptarlos, para que la decisión no sea de moda sino de umbral.

**1.4 El orquestador automático multi-agente es la pieza más peligrosa del brief.** Agentes que colaboran, negocian conflictos e intercambian memoria entre sí suena a arquitectura seria y es, hoy, la principal fuente de sistemas caros, frágiles e inauditables. Cuando dos LLM negocian sin árbitro, el resultado no es deliberación: es ruido con formato de acuerdo. El orquestador v1 de JaraLab eres tú ejecutando un protocolo de sesión escrito, y esto no es una carencia — es la versión auditable. La automatización de orquestación llega después, como pipelines con artefactos intermedios (el patrón que el Auditor ya usa), nunca como conversación agente-a-agente en tiempo real.

**1.5 Seis meses construyendo el cerebro es el riesgo comercial más grande de este plan.** JaraLab tiene hoy dos apuestas con camino a caja: la Radiografía de Rentabilidad y el Auditor en F0. Un roadmap de 26 semanas dedicado al sistema operativo compite por las mismas horas. La regla que propongo, y que el roadmap del módulo 10 respeta: **el OS solo avanza acoplado al negocio.** Cada pieza del cerebro se construye porque un proyecto real la necesita esa semana, y se valida usándola en ese proyecto. Un sistema operativo construido en abstracto es la forma más elegante de procrastinación que existe.

---

## Parte II — Arquitectura

### Módulo 1 — La Constitución

La constitución es lo que ningún proyecto, ningún agente y ningún modelo puede modificar en la operación diaria. Vive en `00_IDENTITY` como tres archivos, porque mezcla tres cosas que cambian a velocidades distintas:

**`identidad.md` — quiénes somos (cambia casi nunca).** Misión: sistemas para que restaurantes independientes de Latinoamérica vendan más, operen mejor y decidan con datos. Posición: español primero, sin dependencia de POS, diseñado para el operador independiente que hoy tiene hojas de cálculo que no entiende — no para la cadena que ya tiene BI. Filosofía comercial: transformación en vez de servicios, claridad en vez de dashboards, tiempo en vez de automatizaciones. Regla de origen: ningún sistema se ofrece a un cliente sin haberse validado en Pikeo o Callejero.

**`epistemologia.md` — cómo sabemos lo que sabemos (cambia poco, con enmienda formal).** Es la pieza que el brief pide cuando pregunta qué significa evidencia, validar, experimentar y "no sabemos". Definiciones operativas, no filosóficas:

- **Evidencia** es un dato observable con fuente, fecha y contexto de obtención. "Los reels convierten mejor" no es evidencia; "el reel X del 2026-06-12 en la cuenta de Pikeo generó 43 clics al link y 2 ventas de la Radiografía, contra una media de 11 clics" sí lo es. Toda cifra que circule por el sistema lleva su fuente o lleva la etiqueta explícita de estimación.
- **Jerarquía de evidencia**, de mayor a menor peso: (1) datos propios medidos en Pikeo/Callejero o en clientes, (2) resultado documentado de un experimento del laboratorio, (3) dato externo de fuente identificable y fechada, (4) patrón observado sin medición, (5) opinión — incluida la del modelo de IA, que pesa exactamente igual que una opinión: nada, hasta que se convierte en hipótesis y se prueba.
- **Validar** significa que una hipótesis pasó por el flujo del módulo 5 y alcanzó al menos nivel de confianza C2 (definido abajo). "Me funcionó una vez" no valida; "lo probé, medí, y el resultado superó el criterio de éxito que escribí antes de probar" valida.
- **Experimentar** exige tres cosas escritas *antes* de ejecutar: la hipótesis falsable, el criterio de éxito con número, y el costo máximo aceptable (plata y horas). Un experimento sin criterio previo es una anécdota con presupuesto.
- **"No sabemos"** es una respuesta de primera clase, no un fracaso. Es obligatoria cuando no existe evidencia de nivel 1–3 sobre la afirmación, y su formato correcto es: "no sabemos, esta es la hipótesis, este es el experimento más barato para averiguarlo".

**`conducta.md` — cómo se comporta cualquier agente de JaraLab (puede evolucionar más rápido).** Cómo responde siempre: como consultora senior — problema antes que solución, número antes que adjetivo, próxima acción antes que teoría; con desacuerdo explícito cuando lo hay, porque la cortesía que oculta objeciones es un defecto del sistema. Y la lista de prohibiciones absolutas:

1. Nunca presentar una cifra sin fuente ni etiqueta de estimación.
2. Nunca presentar una opinión del modelo como hallazgo de JaraLab.
3. Nunca prometer a un cliente algo no validado en laboratorio (nivel C2 o superior).
4. Nunca contradecir un ADR activo sin proponer formalmente su reemplazo.
5. Nunca borrar conocimiento: lo obsoleto se marca `deprecated` y se enlaza a su reemplazo.
6. Nunca guardar conocimiento de JaraLab en la memoria propietaria de un proveedor de IA.
7. Nunca ejecutar un gasto, envío o publicación sin aprobación humana explícita.

**Mecanismo de enmienda.** Una constitución sin proceso de cambio se vuelve dogma o se vuelve letra muerta; las dos cosas la matan. Cualquier cambio a `00_IDENTITY` exige un ADR en `07_DECISIONS` que registre contexto, alternativa descartada y consecuencias, más el incremento de versión del archivo. Lo que no tiene ADR no cambió.

### Módulo 2 — Memoria permanente

La memoria permanente es el repositorio, y la decisión estructural ya está tomada y es correcta: Markdown plano con frontmatter YAML, legible por humano y por cualquier LLM, propiedad de JaraLab. Lo que falta no es estructura sino criterio de admisión, formato de las piezas clave y reglas contra la podredumbre.

**Criterio de admisión.** El README ya lo dice y se eleva a ley: entra lo que sirve dentro de un año sin importar quién lo lea. En la práctica: clientes (un folder por cliente: contexto, acuerdos, resultados medidos, aprendizajes), playbooks y SOPs (módulo 6), hallazgos y patrones validados (`08_RESEARCH`), hipótesis vivas (laboratorio, módulo 5), errores y postmortems (los fracasos documentados valen más que los éxitos: son los que evitan repetir el costo), decisiones (`07_DECISIONS`), y versiones de todo lo anterior.

**Formato de un learning.** Cada archivo de `08_RESEARCH` lleva en el frontmatter, además del estándar del repo: `confidence` (C0–C4, ver módulo 5), `evidence` (enlaces a los datos o experimentos que lo sostienen), `scope` (dónde aplica: Pikeo, Callejero, clientes, general) y `expires` o `review_by` (fecha en la que deja de ser confiable si nadie lo revalida — un hallazgo de marketing de 2026 no es verdad eterna). Un learning sin evidencia enlazada no puede tener confianza mayor que C1.

**Errores como ciudadanos de primera.** Carpeta `08_RESEARCH` admite `type: postmortem` con formato fijo: qué se intentó, qué se esperaba, qué pasó, causa raíz, qué regla o cambio se deriva. La obligación de cierre del README (todo proyecto deja al menos un learning) se precisa: si el proyecto falló, el learning es obligatorio y es un postmortem.

**Contra la podredumbre.** La memoria muerta es peor que la memoria vacía, porque se lee con confianza. Tres defensas: cada archivo declara `review_by` cuando su contenido caduca; quien abra un documento vencido tiene la obligación de marcarlo `status: stale` en el momento (agente incluido — es una edición permitida sin ADR); y una revisión trimestral de una hora recorre los `stale` y decide revalidar, actualizar o deprecar.

**Datos operativos no viven en Markdown.** Reglas del Auditor, resultados de experimentos con sus números, métricas de campañas: eso es SQLite, dentro del sistema que los produce (ADR-0003, ADR-0005). El repositorio guarda el veredicto y el enlace; la base de datos guarda la evidencia cruda. Markdown para conocimiento, SQLite para datos: esa frontera evita tanto el repo-hoja-de-cálculo como la base-de-datos-de-prosa.

### Módulo 3 — Memoria operativa

La memoria operativa es la de un proyecto mientras está vivo, y su regla central es que **nace para morir**: al cierre del proyecto se destila lo permanente hacia el repositorio y el resto se descarta sin culpa. Confundir memoria operativa con permanente produce un repositorio lleno de pendientes viejos, que es exactamente lo que el README prohíbe.

Cada proyecto activo en `04_PRODUCTS/<nombre>/` mantiene tres artefactos:

- **`estado.md`** — el único archivo que un agente necesita leer para retomar el proyecto en frío: fase actual, decisiones tomadas (enlaces a ADRs), pendientes con dueño, bloqueos, y qué se hace después. Se actualiza al final de cada sesión de trabajo; una sesión que no actualiza el estado no terminó.
- **`experimentos.md`** — los experimentos del proyecto en curso con su estado (diseñado, corriendo, cerrado) y enlace al laboratorio.
- **Bitácora en `09_DAILY_LOG`** — lo cronológico: qué se hizo, qué se encontró, qué se conversó. Es memoria de contexto, no de verdad; nadie cita una bitácora como evidencia.

Las conversaciones con modelos de IA no son memoria. Lo que una sesión produjo de valor se destila a `estado.md` o a un learning antes de cerrar; lo que no se destiló, se acepta como perdido. Esta regla es dura a propósito: es la que garantiza que cambiar de modelo — o simplemente abrir sesión nueva — nunca pierda nada que importe.

**Protocolo de arranque en frío** (la secuencia del README, precisada): un agente que entra a trabajar lee, en orden, `00_IDENTITY` completo, el `estado.md` del proyecto, los ADRs que el estado referencia, y solo entonces actúa. Costo: minutos. Beneficio: cualquier modelo, hoy o en tres años, arranca con el mismo cerebro.

### Módulo 4 — Motor de decisiones

Aquí está la corrección conceptual más importante del diseño: **el motor de decisiones no es el LLM.** Es un protocolo escrito que cualquier LLM ejecuta y que deja traza. Tu ADR-0001 ya estableció esto para el Auditor — núcleo determinista, IA en los bordes — y se eleva a ley de empresa: la IA prepara decisiones, recomienda con evidencia enlazada y ejecuta lo aprobado; las decisiones con consecuencias (plata, clientes, marca, alcance) las toma Laura sobre material preparado según este protocolo.

**Orden de consulta obligatorio.** Ante cualquier pregunta, un agente consulta en este orden, y cita qué encontró en cada nivel: (1) la constitución — ¿hay un principio que ya decide esto?; (2) `07_DECISIONS` — ¿ya se decidió algo relacionado? contradecirlo exige proponer un ADR nuevo, no ignorarlo; (3) `08_RESEARCH` y playbooks — ¿qué sabemos ya, y con qué confianza?; (4) los datos — SQLite del sistema relevante, números de laboratorio; (5) el mundo exterior — búsqueda, benchmarks, siempre con fuente fechada. Solo después de ese recorrido puede opinar, y su opinión llega etiquetada como opinión.

**Ponderación de evidencia.** La jerarquía del módulo 1 se aplica con una regla de desempate simple: dato propio le gana a dato externo, medido le gana a observado, reciente le gana a viejo, y dos fuentes independientes le ganan a una. Cuando la evidencia disponible es solo de niveles 4–5, la respuesta correcta no es la mejor conjetura disfrazada de análisis: es el formato "no sabemos" del módulo 1, con el experimento más barato propuesto.

**Contra la alucinación, mecánica y no buenas intenciones.** Tres reglas verificables: toda afirmación factual lleva enlace a su fuente dentro del repo o al exterior; toda cifra sin fuente lleva el prefijo explícito "estimación:"; y todo entregable importante pasa por el rol Crítico (módulo 7) con una sola pregunta: ¿qué afirmaciones de este documento no tienen respaldo? Las alucinaciones sobreviven en los sistemas donde nadie tiene el trabajo de buscarlas.

**Detección de incertidumbre.** Cada recomendación termina con dos campos obligatorios: nivel de confianza (C0–C4, la misma escala del laboratorio, para no tener dos vocabularios) y "qué me haría cambiar de opinión" — la evidencia concreta que invalidaría la recomendación. Un agente que no puede nombrar qué lo refutaría no está razonando; está redactando.

**Umbral de "no tengo suficiente evidencia".** Obligatorio cuando la decisión es irreversible o cara y la evidencia es de nivel 4–5; cuando dos fuentes de nivel 1–3 se contradicen sin explicación; o cuando la pregunta cae fuera del alcance validado de los playbooks disponibles. En esos casos el agente entrega la mejor formulación de la pregunta, no una respuesta.

### Módulo 5 — El laboratorio (sistema de validación)

Todo aprendizaje entra al canon por una sola puerta: el laboratorio. Pikeo y Callejero ya cumplen ese rol para productos; esto lo formaliza para cualquier tipo de conocimiento — marketing, pricing, operación, contenido, IA.

**El flujo completo:**

1. **Hipótesis** — archivo en `04_PRODUCTS/laboratorio/hipotesis/`, formato fijo: enunciado falsable, por qué creemos esto (evidencia previa enlazada), criterio de éxito con número definido *antes* de ejecutar, costo máximo (plata y horas), fecha límite de veredicto. Sin fecha límite, las hipótesis se vuelven inmortales y el backlog del laboratorio se vuelve un cementerio.
2. **Experimento** — el diseño mínimo que puede refutar la hipótesis al menor costo. La pregunta de diseño es siempre "¿cuál es la versión más barata de descubrir que estoy equivocada?", no "¿cómo pruebo que tengo razón?".
3. **Resultado** — los números crudos van a la base de datos o planilla del sistema que corresponda; el archivo de la hipótesis se actualiza con el resultado y el enlace.
4. **Veredicto** — tres salidas posibles, todas dignas: **validada** (cumplió el criterio → nace o sube de nivel un learning en `08_RESEARCH`), **refutada** (no lo cumplió → nace un learning igual, con `type: refutacion` — saber qué no funciona es conocimiento comprado y pagado), o **no concluyente** (el experimento no pudo responder → se documenta por qué, para no repetir el mismo diseño malo).

**Escala de confianza C0–C4**, transversal a todo el sistema:

| Nivel | Significado | Qué se puede hacer con esto |
|---|---|---|
| C0 | Idea u opinión, sin evidencia | Solo convertirse en hipótesis |
| C1 | Patrón observado, no medido | Priorizar experimentos; no citar como hallazgo |
| C2 | Validado una vez en laboratorio propio | Usarlo en Pikeo/Callejero; base para playbook interno |
| C3 | Replicado (2+ contextos o 2+ períodos) | Usarlo con clientes; entra a playbook comercial |
| C4 | Sistemáticamente confirmado, con datos acumulados | Tratarlo como regla de operación; solo se revisa si algo lo contradice |

La regla de degradación importa tanto como la de ascenso: un learning C3 cuyo contexto cambió (plataforma, algoritmo, temporada, país) baja a C1 hasta revalidarse. La confianza es un estado, no un trofeo.

**Almacenamiento de la evidencia.** Veredicto y enlace en el learning; datos crudos en el sistema de origen; y el archivo de hipótesis nunca se borra — el historial de qué se creyó, cuándo y por qué es la memoria epistémica de la empresa, y es exactamente lo que un modelo nuevo necesita leer para razonar como JaraLab.

### Módulo 6 — Playbooks y representación del conocimiento

La decisión de formato, con su porqué:

**Markdown con frontmatter YAML es el formato canónico del conocimiento.** Porque es el único formato que leen con fluidez nativa un humano, cualquier LLM presente y previsiblemente cualquier LLM futuro; porque se versiona con git; porque no tiene proveedor; y porque degrada bien — un playbook de JaraLab impreso en papel sigue siendo un playbook. El frontmatter (`title, type, status, confidence, related, review_by...`) es la capa máquina: suficiente estructura para indexar, filtrar y navegar sin sacrificar legibilidad.

**Estructura fija de un playbook** (en `06_OPERATIONS` si es procedimiento, en `05_SYSTEMS` si es arquitectura): cuándo aplica y cuándo no (el límite de alcance es la mitad del valor), prerrequisitos, pasos con el criterio de verificación de cada uno, errores conocidos con su síntoma, métricas de éxito, y nivel de confianza heredado de los learnings que lo sostienen. Un playbook es conocimiento C2+ empaquetado para ejecución; las ideas C0–C1 no tienen derecho a ser playbook.

**SQLite para datos operativos**, ya decidido (ADR-0003, ADR-0005) y correcto: reglas aprendidas, eventos, resultados de experimentos, métricas. **JSON** no es formato de almacenamiento sino de intercambio: aparece en exports y en las costuras entre sistemas, nunca como fuente de verdad.

**Vectores: no todavía, con disparador definido.** Se adopta un índice semántico el día en que se cumpla una de dos condiciones: el canon relevante para una tarea típica supera lo que cabe cómodamente en el contexto del modelo de trabajo, o la búsqueda por estructura (carpetas, tags, grep) falla de forma medida y repetida en encontrar conocimiento que sí existe. Cuando llegue, será un índice derivado y desechable que apunta a los archivos Markdown — la fuente de verdad no se muda jamás al vector store, porque los embeddings sí dependen del proveedor y esa es precisamente la dependencia que este sistema existe para evitar.

**Graph: el frontmatter `related` ya es el grafo.** Pobre, manual y suficiente. Un grafo formal (Neo4j o similar) se reconsidera solo si algún día JaraLab opera decenas de clientes con cientos de entidades cruzadas y las preguntas relacionales se vuelven frecuentes. Hoy sería infraestructura de museo.

### Módulo 7 — Agentes

Reconstrucción del organigrama del brief. Un agente en JaraLab es exactamente esto: **un prompt maestro versionado en `10_PROMPTS` + un subconjunto declarado del repositorio que carga como contexto + un contrato de entradas y salidas.** No es un software, no es una persona, no tiene autoridad. Cinco roles cubren las once funciones del brief:

**El Estratega** (absorbe CEO, CFO, Consultoría, y la cabeza de Growth). Responsabilidad: preparar decisiones — evaluar oportunidades, modelar negocio, desafiar planes, aplicar el marco Problema→Solución→MVP→Validación→Modelo→Escalabilidad→Riesgos→Próximos pasos. Entradas: la pregunta o el plan, constitución, ADRs, learnings, números del negocio. Salidas: documento de decisión con opciones, evidencia citada, confianza declarada y recomendación — en `04_PRODUCTS` o como borrador de ADR. Lo que nunca hace: decidir.

**El Analista** (absorbe Data, CFO-operativo, BI, la medición de Growth). Responsabilidad: convertir datos en respuestas con intervalo de honestidad — qué dice el número, qué no alcanza a decir, qué haría falta medir. Entradas: SQLite de los sistemas, exports, resultados de experimentos. Salidas: análisis reproducible (el cálculo se puede repetir), hallazgos candidatos a learning con nivel de confianza propuesto. Lo que nunca hace: presentar una correlación como causa, o un número sin su contexto de captura.

**El Productor** (absorbe Contenido, Ads, y la ejecución de CRM). Responsabilidad: producir los artefactos de comunicación — contenido de Soy Lau Jara, campañas, secuencias, copys — siempre desde playbooks y learnings existentes, con objetivo, hook, desarrollo, CTA y conversión esperada declarados. Entradas: brief, playbooks de contenido, learnings de canal, voz de marca (`02_BRANDS`). Salidas: piezas listas para aprobación humana, jamás autopublicadas (prohibición 7). Lo que nunca hace: inventar un claim sobre resultados de clientes o de los laboratorios.

**El Crítico** (absorbe Auditor-interno; distinto del producto JaraLab Auditor). Responsabilidad: destruir antes de que destruya el mercado. Revisa todo entregable importante buscando afirmaciones sin respaldo, contradicciones con ADRs, promesas no validadas, costos ocultos y el riesgo que nadie nombró. Entradas: el entregable y el canon completo. Salidas: lista de objeciones con severidad, cada una accionable. Regla de oro: el Crítico corre en sesión o modelo distinto del que produjo el trabajo — un modelo revisándose a sí mismo en la misma conversación hereda sus propios sesgos y su misma lectura del contexto.

**El Bibliotecario** (absorbe Operaciones-documental y el mantenimiento de CRM/memoria). Responsabilidad: que el cerebro no se pudra. Destila cierres de proyecto en learnings, verifica frontmatter y enlaces `related`, detecta documentos vencidos y contradicciones entre archivos, propone consolidaciones. Entradas: el repositorio. Salidas: ediciones de mantenimiento (las permitidas sin ADR) y un reporte corto de salud del canon. Es el rol menos glamoroso y el que decide si este sistema sigue vivo en 2028.

Las funciones del brief que no aparecen como agente propio: **CRM** es un sistema (datos + reglas, como el Auditor) que el Productor y el Analista consultan, no un agente; **Operaciones** de restaurante es dominio de los playbooks y del producto Auditor; **Growth** es la suma de Estratega (dirección) + Analista (medición) + Productor (ejecución) + laboratorio (validación) — convertirlo en agente separado solo crearía un cuarto lugar donde buscar la misma responsabilidad.

**La interfaz entre agentes es siempre un artefacto en el repositorio** — un archivo con frontmatter, nunca un chat. El Estratega deja un documento de decisión; el Crítico deja objeciones sobre ese documento; el Productor deja piezas. Esto hace cada eslabón auditable, reanudable por cualquier modelo, y elimina el acoplamiento entre sesiones que hace frágiles a los sistemas multi-agente.

### Módulo 8 — Orquestador

**v1 (hoy): el orquestador es Laura ejecutando un protocolo.** Una sesión de trabajo tipo: elegir el rol que la tarea necesita → cargar su prompt maestro de `10_PROMPTS` → el agente ejecuta su protocolo de arranque en frío (módulo 3) → produce su artefacto → si el entregable es importante, sesión aparte con el Crítico → Laura decide → `estado.md` y bitácora se actualizan → si algo se aprendió, se destila. Esto ya es orquestación multi-agente; solo que el bus de mensajes es el repositorio y el árbitro es humano. Es la versión correcta mientras el volumen lo permita, y además es la única versión cuyo funcionamiento entiendes completo — condición no negociable para una empresa de una persona.

**v2 (cuando una rutina se repita idéntica 10+ veces): pipelines programados.** El patrón del Auditor generalizado: procesos que corren solos en secuencia fija, cada etapa consume y produce artefactos, la IA participa en los bordes de cada etapa, y el humano aprueba en los puntos marcados. Ejemplos naturales: el cierre semanal de métricas (Analista corre → Crítico valida → reporte a bitácora), o el ciclo de contenido (Productor propone lote → Laura aprueba → programación). La orquestación se gana rutina por rutina, con la regla de que solo se automatiza lo que ya funcionó a mano las suficientes veces como para aburrirse.

**Intercambio de memoria:** no existe como problema separado. Todos los agentes leen el mismo canon y escriben artefactos al mismo repositorio; la "memoria compartida" es el filesystem. Cualquier diseño donde los agentes se pasan contexto entre sí por fuera del repo crea una segunda memoria invisible, y las memorias invisibles son las que se pierden en las migraciones.

**Delegación:** un agente que encuentra trabajo fuera de su contrato no lo hace — deja un pendiente tipado en `estado.md` ("necesita Analista: medir X antes de decidir Y"). La delegación es asíncrona y por escrito, como en cualquier equipo remoto serio.

**Conflictos:** se resuelven por jerarquía documental, no por negociación: constitución > ADR activo > learning (gana el de mayor confianza; a igual confianza, el más reciente) > playbook > opinión de agente. Si dos fuentes del mismo rango se contradicen, eso no es un conflicto a resolver en caliente: es un hallazgo — se registra, y el Bibliotecario o un ADR lo salda. Dos agentes nunca "discuten hasta acordar"; producen sus artefactos en desacuerdo y el desacuerdo sube a Laura con la evidencia de cada lado.

### Módulo 9 — Capa de IA (independencia de modelo)

La portabilidad no se declara; se construye con cuatro piezas y se prueba con un simulacro.

**Pieza 1 — Conocimiento portable por diseño.** Ya cubierto: todo en Markdown/SQLite/git, nada en memorias propietarias, proyectos, GPTs, ni features de plataforma (prohibición 6). El costo real de esta regla es renunciar a comodidades del proveedor de turno — se paga con gusto, porque esas comodidades son exactamente el mecanismo del lock-in.

**Pieza 2 — Prompts maestros como contratos, en `10_PROMPTS`.** Cada rol del módulo 7 es un archivo versionado con: identidad del rol, protocolo de arranque (qué carga del repo, en qué orden), reglas de conducta heredadas de la constitución, formato de salida, y prohibiciones. Se escriben en lenguaje natural neutro — sin sintaxis exclusiva de un proveedor, sin depender de herramientas que solo existen en una plataforma. Donde un proveedor ofrezca algo único y valioso (ej. skills, herramientas nativas), se usa, pero como *acelerador* declarado en un anexo del prompt, nunca como *dependencia* del contrato base.

**Pieza 3 — Suite de evaluación: el examen de ingreso de cualquier modelo.** Quince a veinte tareas doradas con salida esperada o rúbrica de corrección, guardadas en `05_SYSTEMS/eval-suite/`: normalizar un día del Auditor y comparar contra verdad conocida; responder tres preguntas cuya respuesta exige citar ADRs correctos; producir un documento de decisión sobre un caso pasado y compararlo con lo que se decidió y lo que pasó; detectar el error plantado en un análisis; redactar una pieza y verificar reglas de marca; y al menos una trampa de humildad — una pregunta cuya respuesta correcta es "no sabemos". Migrar de modelo = correr la suite con el candidato ejecutando los mismos prompts maestros sobre el mismo repo, y comparar. Sin esto, "el modelo nuevo funciona bien" es una vibra, no una medición.

**Pieza 4 — Adaptador técnico delgado.** Para el código que llama LLMs por API (Auditor y lo que venga): un módulo único `llm.py` con interfaz propia (`generate(prompt, contexto) → respuesta`), proveedores como implementaciones intercambiables detrás, y logging de cada llamada (prompt, modelo, costo) en SQLite. Cambiar de proveedor en código = escribir un adaptador nuevo y correr los tests. Son ~100 líneas; no se adopta un framework de orquestación de terceros para esto, porque el framework es otro proveedor del cual depender.

**El simulacro de migración** es la prueba de fuego y va en el roadmap: un día completo de trabajo real usando un modelo distinto al habitual, con los mismos prompts y el mismo repo, más la eval suite. Lo que se rompa ese día es la lista exacta de dependencias ocultas. Un plan de portabilidad que nunca se ensayó es una esperanza con formato de plan.

### Módulo 10 — Roadmap: 26 semanas, una pieza por semana

Ordenado por una lógica de tres reglas: primero lo que todos los demás módulos necesitan (constitución y protocolos), después lo que convierte disciplina en activo (laboratorio y evals), al final lo que automatiza lo ya probado (pipelines). Y siempre acoplado al negocio: las piezas se validan usándolas en el Auditor, la Radiografía y Soy Lau Jara, que siguen siendo el trabajo principal — el OS se construye en las horas de margen, no al revés.

**Mes 1 — Fundación (el cerebro mínimo viable).**
S1: `identidad.md` + `epistemologia.md` + `conducta.md` en `00_IDENTITY`. Todo lo demás los cita; sin ellos, cada prompt reinventa la empresa.
S2: `01_STRATEGY` (objetivo 2026, tesis, north star) + protocolo de arranque en frío como archivo en `06_OPERATIONS`. Es la semana que hace que cualquier sesión nueva arranque igual.
S3: plantillas: hipótesis, learning (con `confidence`), postmortem, `estado.md`, documento de decisión. Diez minutos de plantilla ahorran la fricción que mata la disciplina.
S4: migrar lo que ya sabe JaraLab a formato learning: Radiografía (qué validó su lanzamiento), hallazgos de Pikeo/Callejero, los ADRs del Auditor citados desde learnings donde aplique. El cerebro arranca con contenido real, no vacío.

**Mes 2 — Los dos primeros agentes y el examen.**
S5: prompt maestro del Estratega, probado en una decisión real de esa semana.
S6: prompt maestro del Crítico + su primer uso sobre un entregable real (este documento es candidato).
S7: eval suite v1 — las primeras 10 tareas doradas con respuestas esperadas.
S8: **simulacro de migración #1** con un modelo alterno. Se hace temprano a propósito: descubrir dependencias ocultas en la semana 8 cuesta poco; descubrirlas en la 30, caro.

**Mes 3 — El laboratorio en marcha.**
S9: `04_PRODUCTS/laboratorio/` formalizado + las 3 primeras hipótesis reales escritas (habrá candidatas obvias del lanzamiento de la Radiografía).
S10: primer ciclo completo hipótesis→experimento→veredicto→learning, de punta a punta, aunque el experimento sea pequeño. El flujo se depura usándolo, no diseñándolo más.
S11: prompt maestro del Analista, conectado a los datos reales del Auditor (que para entonces está en F2–F3) y de la Radiografía.
S12: revisión trimestral #1 del canon (el ritual del Bibliotecario, ejecutado a mano la primera vez) + retro del propio OS: qué del sistema se usó de verdad y qué fue teatro. Lo que nadie usó en 12 semanas se depreca sin duelo.

**Mes 4 — Producción con reglas.**
S13: voz de marca y reglas de contenido en `02_BRANDS` (base del Productor).
S14: prompt maestro del Productor + primer lote real para Soy Lau Jara pasando por el Crítico.
S15: playbook #1 formalizado desde un learning C2+ (el candidato natural: lanzamiento de producto digital, con lo aprendido de la Radiografía).
S16: estructura de `03_CLIENTS` + política de datos de clientes (anonimización, qué puede tocar un proveedor de IA y qué no — riesgo R7, abajo).

**Mes 5 — Memoria dura y primer pipeline.**
S17: adaptador `llm.py` + logging de llamadas, refactorizando lo que el Auditor ya usa.
S18: índice del canon: un `INDEX.md` generado (script simple sobre los frontmatter) con título, tipo, confianza y estado de cada archivo — la defensa barata contra el crecimiento del canon, muy anterior a cualquier vector store.
S19: pipeline #1 automatizado: cierre semanal de métricas (Analista → Crítico → bitácora), la rutina que para entonces ya se habrá hecho a mano 10+ veces.
S20: prompt maestro del Bibliotecario + su primera corrida real de mantenimiento.

**Mes 6 — Prueba de fuego y cierre.**
S21: eval suite v2 (20 tareas, incluyendo las trampas de humildad y un caso de cliente anonimizado).
S22: **simulacro de migración #2**, esta vez completo: un día entero operando con otro modelo, eval suite incluida. El resultado se documenta como ADR.
S23: pipeline #2: ciclo de contenido semi-automatizado con aprobación humana.
S24: postmortem del semestre como learning mayor: qué partes del OS pagaron su costo y cuáles no.
S25: versión 1.0 de este documento, enmendada con seis meses de realidad.
S26: colchón — porque un roadmap de 26 semanas sin holgura es una mentira con buena tipografía.

Qué quedó deliberadamente fuera de los seis meses: vector store, grafo, orquestación agente-a-agente, interfaces web del OS, y cualquier agente adicional. Cada uno tiene su disparador definido en los módulos; ninguno lo cumple todavía.

---

## Parte III — Destrucción del diseño

Los riesgos reales de lo que acabo de proponer, en orden de probabilidad de que mate el sistema:

**R1 — El impuesto burocrático.** El riesgo #1 no es técnico: es que este sistema exige que una persona que también vende, opera dos restaurantes, produce contenido y construye el Auditor, además documente con disciplina. Si el costo por sesión supera ~10 minutos, la disciplina muere en semanas y el repo queda como monumento. Mitigación en el diseño: plantillas (S3), un solo archivo obligatorio por sesión (`estado.md`), el Bibliotecario absorbiendo el mantenimiento, y una regla de mínimos honesta — bitácora de tres líneas vale, learning de diez líneas vale; el enemigo de este sistema no es la brevedad, es el silencio.

**R2 — La memoria podrida.** Peor que no tener canon es tener canon vencido que se lee con confianza: un learning de junio sobre alcance de reels puede ser mentira en noviembre y un agente lo citará con toda la autoridad del frontmatter. Mitigación: `review_by` obligatorio en conocimiento perecedero, degradación de confianza por cambio de contexto, revisión trimestral. Riesgo residual real: la revisión trimestral es la primera cita que se cancela cuando hay afán. Por eso es un ritual de una hora y no un proyecto.

**R3 — El canon supera el contexto.** Hoy cabe entero en una sesión; en 2027 no cabrá. Cuando eso pase sin preparación, los agentes cargarán subconjuntos arbitrarios y razonarán con cerebro parcial sin saberlo. Mitigación: presupuesto de contexto declarado en cada prompt maestro (qué carga cada rol), `INDEX.md` en S18, y el disparador de vector store definido en el módulo 6 — la respuesta está diseñada antes de necesitarla.

**R4 — La constitución como dogma.** Un principio escrito en julio de 2026 puede ser un error en enero de 2027, y un sistema que venera sus documentos fundacionales deja de aprender — la anti-tesis exacta del laboratorio. Mitigación: el mecanismo de enmienda por ADR y la retro de S12/S24 donde el propio OS es objeto de postmortem. La constitución define cómo se cambia a sí misma; eso la separa del dogma.

**R5 — Teatro de evaluación.** Una eval suite diseñada por el mismo sistema que evalúa tiende a medir lo que el sistema ya hace bien. Veinte tareas doradas pueden dar confianza de laboratorio a una migración que falla en el trabajo real. Mitigación: las tareas doradas nacen de trabajo real pasado (con respuesta conocida porque ya ocurrió), incluyen trampas, y el simulacro de migración es un día real completo, no solo la suite.

**R6 — Factor bus.** Todo esto depende de una persona. Si Laura para un mes, el sistema no produce nada — aunque, a diferencia del status quo, tampoco se pierde nada, que es precisamente la mejora. El riesgo agravado es sutil: que el conocimiento tácito de *cómo operar el OS* viva solo en su cabeza. Mitigación: el protocolo de arranque en frío se escribe como si el lector fuera un desconocido competente, y la prueba es real — si un colaborador futuro (o un modelo nuevo) no puede arrancar solo con el repo, el protocolo está mal escrito.

**R7 — Datos de clientes en cerebros ajenos.** `03_CLIENTS` contendrá finanzas de restaurantes reales. Cada consulta a un LLM comercial envía contexto a un tercero; un descuido y los márgenes de un cliente entrenan el modelo de alguien más o quedan en logs de un proveedor. Mitigación: política de datos en S16 — qué se anonimiza antes de tocar una API externa, qué no sale nunca del entorno local, y revisión de los términos de retención de datos del proveedor activo. Este riesgo crece con cada cliente; la política llega antes que el cliente externo, no después.

**R8 — El OS como procrastinación de lujo.** Nombrado en la Parte I y merece estar en la lista formal porque es el modo de falla más probable de fundadores sistemáticos: construir la catedral del conocimiento se siente como progreso y no factura un peso. Mitigación estructural: la regla de acoplamiento (cada pieza se construye porque un proyecto real la necesita esa semana) y una métrica explícita de la retro trimestral — si el OS creció y la caja no, el OS pierde su presupuesto de horas.

**R9 — Deriva y contradicción entre documentos.** Con cientos de archivos, aparecerán learnings que se contradicen y playbooks que divergen de los ADRs que los originaron. Mitigación: jerarquía documental del módulo 8 (la contradicción tiene regla de resolución), el Bibliotecario la busca activamente, y la contradicción detectada se trata como hallazgo, no como vergüenza.

**R10 — Lock-in por la puerta de atrás.** El lock-in no llegará como una decisión sino como mil comodidades: un formato de skill propietario aquí, una herramienta de plataforma allá, atajos que un día suman una dependencia que nadie eligió. Mitigación: la distinción acelerador/dependencia de la Pieza 2, y los simulacros de migración — cuya función profunda es exactamente hacer visible la dependencia acumulada antes de que sea estructural.

---

## Parte IV — Reconstrucción: el cerebro mínimo viable

Después de la destrucción, lo que queda en pie — la versión que recomiendo por encima de la versión completa del brief:

El cerebro permanente de JaraLab es **un repositorio gobernado + cinco protocolos + un examen**. El repositorio ya existe y su gobierno ya está escrito en el README. Los cinco protocolos son la constitución (cómo pensamos), el arranque en frío (cómo empieza cualquier sesión), el laboratorio (cómo entra conocimiento al canon), el motor de decisiones (cómo se prepara una decisión) y el cierre (cómo una sesión deja rastro). El examen es la eval suite más el simulacro de migración, que convierten "somos independientes del modelo" de eslogan a propiedad verificada dos veces por año.

Los agentes son cinco prompts maestros sobre ese repositorio — no once, no software, no organigrama. El orquestador es Laura con un protocolo, hasta que la repetición justifique pipelines. Los vectores, el grafo y la orquestación automática tienen disparadores definidos y ninguno está activo.

Y la ley que ordena todo lo demás, elevada desde tu propio ADR-0001 a primera ley de la empresa: **el conocimiento en archivos abiertos, el criterio en protocolos escritos, los datos en bases propias, y los modelos — todos, el actual y los que vengan — de paso.**

**Próximos pasos** (si este documento se aprueba): (1) revisión crítica tuya, módulo por módulo — en particular la reducción de agentes y la regla de acoplamiento del roadmap, que son las dos decisiones más opinables; (2) ADR-0008 registrando la adopción de esta arquitectura y sus alternativas descartadas; (3) ejecutar S1 esta misma semana: los tres archivos de `00_IDENTITY`, que hoy está vacía y es la carpeta de la que todo lo demás cuelga.

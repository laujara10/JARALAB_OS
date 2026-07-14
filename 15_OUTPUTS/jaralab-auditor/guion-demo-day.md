---
title: "JaraLab Cash Control AI — Guion de Demo Day"
type: prompt
status: active
owner: "Laura Jaramillo"
created: 2026-07-12
updated: 2026-07-12
version: 1.0
tags: [jaralab-auditor, cash-control-ai, demo-day, pitch, presentacion]
related: ["../../04_PRODUCTS/jaralab-auditor/spec.md", "../../04_PRODUCTS/jaralab-auditor/product-vision.md"]
---

# JaraLab Cash Control AI — Guion de Demo Day

Duración objetivo: 3:30–4:45 min de demo + margen para preguntas. Todo lo que sigue asume que el MVP técnico ya está congelado (alcance F0–F1, matching exacto, pool de dos cuentas Bancolombia, Ritual Diario). Este documento no toca código — es guion y logística de presentación.

## 1. La narrativa (léela primero, es la columna vertebral de todo lo demás)

No se presenta un motor de conciliación. Se presenta una noche que ya no existe.

**Antes:** todas las noches, después de cerrar Pikeo, alguien se sienta con el celular del datáfono, el extracto del banco y una hoja de cálculo que nadie entiende del todo, tratando de responder una sola pregunta: *¿ayer se perdió plata?* Es lento, es propenso a error, y la respuesta nunca se siente del todo confiable.

**Ahora:** cada mañana, antes de que el dueño abra el restaurante, un copiloto ya hizo ese cruce. No hay que buscar nada — el copiloto ya soltó los archivos, ya comparó las ventas contra el banco, y espera con una sola respuesta lista.

**El giro que hace memorable la demo:** no es una demo de software, es una demo de una pregunta respondida. Todo el guion está construido para que la audiencia sienta, en carne propia, lo que se siente pasar de la incertidumbre de las 11pm a la certeza de las 7am — y que eso tome menos de un minuto real.

Frase ancla, para repetir al menos dos veces durante la demo:

> "Esto no es un dashboard. Es un compañero de trabajo que revisa el negocio antes que el dueño, y responde primero una sola pregunta: ¿puedo estar tranquilo hoy?"

## 2. El guion completo (con tiempos)

### 0:00–0:25 — El gancho (sin pantalla todavía)

> "Todas las noches, en algún restaurante independiente de Bogotá, alguien se queda después de cerrar tratando de responder una pregunta que le quita el sueño: ¿ayer se perdió plata? Lo hace con el celular del datáfono en una mano y el extracto del banco en la otra, cruzando números en una hoja de cálculo que nunca termina de cuadrar del todo.
>
> Este restaurante existe. Es Pikeo, uno de los dos laboratorios propios de JaraLab. Y desde hace unas semanas, esa pregunta ya no la responde una persona a las 11pm. La responde un copiloto, a las 7am, antes de que alguien tenga que preguntarla."

### 0:25–0:55 — Qué es (sin pantalla todavía)

> "Esto es JaraLab Cash Control AI. No es un sistema de contabilidad y no es un dashboard. Es un copiloto financiero diario: cada mañana revisa el negocio antes que el dueño, y responde primero una sola pregunta — ¿puedo estar tranquilo hoy? — antes de mostrar cualquier número.
>
> Se los voy a mostrar corriendo sobre los datos reales de Pikeo, mi propio restaurante."

**Qué NO decir aquí:** nada de arquitectura, nada de "SQLite", nada de "matching determinista". Todavía no. Este es el momento de la historia, no de la ingeniería.

### 0:55–1:40 — El comando único (pantalla visible)

Abrir terminal con fuente grande (mínimo 18pt), ya parada dentro de la carpeta del proyecto.

**Comando a ejecutar:**
```
python3 -m auditor --config config/pikeo.yaml run --dia 2026-07-08
```

**Qué decir mientras corre (es casi instantáneo, así que esto se narra en tiempo real, no antes):**

> "Este es el único comando que existe. Lee las ventas del POS, lee las dos cuentas bancarias donde Pikeo recibe plata, cruza todo, y arma el reporte del día. Nada de esto lo toco yo — corre solo, todas las mañanas."

**Qué aparece en pantalla** (las líneas de ingesta/matching/cierre pasan rápido — no las leas en voz alta, deja que se vean y sigue hablando por encima):
```
OK  extracto_carolina.csv → ...
OK  extracto_pikeo.csv → ...
OK  gastos.csv → ...
OK  ventas_loggro.csv → ...
[pikeo] 2026-07-08: 4 matches exactos, 1 pendientes de tu decisión.
[pikeo] Cierre de 2026-07-08: vendido 424,960.00 · conciliado 288,200.00 · ...
```

**Qué NO explicar:** qué es un "match exacto", qué significa "en tránsito", por qué hay dos archivos de extracto (eso viene después, solo si preguntan). Deja que esas líneas pasen como ruido de fondo — el protagonismo es lo que viene abajo.

### 1:40–2:40 — El Ritual Diario (la pantalla que importa)

**Qué aparece en pantalla** (esto sí se lee, despacio, señalando con el cursor o el dedo):
```
Buenos días, Laura 👋

Hoy hay 1 cosa que necesita tu decisión.

  ✓ 75.9% de tus ventas electrónicas ya cuadraron solas
  ✓ Cobertura de hoy bajo auditoría: 89.3% de tu venta

  🟡 [match 5] Una venta de $91,400 (Mastercard, factura FV-1003) aún no aparece en el banco

[ Revisar · 29 seg ]
```

**Qué decir:**

> "Esto es lo que veo yo cada mañana. No una tabla, no un gráfico. Un saludo, y la respuesta a la única pregunta que importa. Hoy el sistema ya cuadró solo el 76% de mis ventas electrónicas sin que yo tocara nada. Y me dice, sin rodeos, que solo hay una cosa que necesita mi ojo — y cuánto tiempo me va a tomar revisarla: 29 segundos."

Señalar la línea de cobertura sin profundizar:

> "Esta línea de cobertura es honesta a propósito: hoy el sistema audita el dinero electrónico, todavía no el efectivo — y en vez de fingir que lo cubre todo, te dice exactamente qué porcentaje de tu venta está mirando."

**Qué NO explicar salvo que pregunten:** por qué el efectivo no está cubierto todavía, qué es ADR-0007, la hoja de ruta de F2/F3. Si preguntan, respuesta corta: "el efectivo llega distinto al banco, y preferimos decir la verdad parcial que fingir que vemos todo."

### 2:40–3:40 — Resolver la excepción (el momento "menos de un minuto")

**Comandos a ejecutar, uno tras otro:**
```
python3 -m auditor --config config/pikeo.yaml detail --match-id 5
```
**Qué aparece:**
```
Qué pasó:
  Una venta de $91,400 (Mastercard, factura FV-1003) aún no aparece en el banco

Por qué importa:
  Mientras no la veamos en el banco, no podemos confirmar que esa plata ya es tuya de verdad.

Acción recomendada:
  Si fue con datáfono, es normal que tarde 1–2 días en llegar — no hagas nada hoy...

[ Confirmar ]  auditor resolve --match-id 5 --accion confirmar
[ Corregir  ]  auditor resolve --match-id 5 --accion corregir
```

**Qué decir:**

> "No me pide que investigue nada. Ya me dice qué pasó, por qué importa, y qué hacer. Yo solo confirmo."

```
python3 -m auditor --config config/pikeo.yaml resolve --match-id 5 --accion confirmar
python3 -m auditor --config config/pikeo.yaml home --dia 2026-07-08
```

**Qué aparece (el cierre perfecto de la demo):**
```
Buenos días, Laura 👋

Pikeo está bajo control.

  ✓ 100.0% de tus ventas electrónicas ya cuadraron solas
  ✓ Cobertura de hoy bajo auditoría: 89.3% de tu venta

No necesitas revisar nada más. Mañana a las 7am tienes el siguiente.
```

**Qué decir:**

> "Y así se ve un día resuelto. Nada más que revisar hasta mañana a las 7am."

**Qué NO explicar:** que "confirmar" técnicamente actualiza una fila en una base de datos, que el sistema recalcula el cierre automáticamente. Es plomería — la audiencia solo necesita ver que la pantalla cambió de amarillo a verde.

### 3:40–4:15 — Zoom out (sin pantalla, o con la pantalla congelada en el veredicto verde)

> "Esto lleva unas semanas corriendo sobre mi propio restaurante. No es un mockup. Antes de ofrecérselo a nadie más, tiene que funcionar impecable acá — esa es la regla de JaraLab: nada sale al mercado sin validarse primero en un laboratorio propio.
>
> Lo que están viendo es la puerta de entrada. Una vez que un restaurante confía en que este copiloto entiende su plata mejor que su propio Excel, ahí se abre la conversación de todo lo demás: growth, fidelización, decisiones con datos. Pero primero, control. Primero, tranquilidad."

### 4:15–4:45 — Cierre

> "La promesa no es una funcionalidad más. Es una pregunta, respondida todas las mañanas, en menos de un minuto: ¿puedo estar tranquilo hoy? Hoy, para Pikeo, la respuesta ya la tengo antes de abrir el restaurante."

*(pausa, sostener la pantalla en verde, no seguir hablando)*

## 3. Versión con datos sintéticos vs. versión con datos reales de Pikeo

| | Sintética (respaldo) | Real de Pikeo |
|---|---|---|
| **Cuándo usarla** | Como plan B si los archivos reales fallan, o si aún no los has validado 24h antes | Como versión principal, si ya la ensayaste al menos una vez sin sorpresas |
| **Origen de los datos** | `tests/conftest.py` — ya usados en 39 tests automáticos, comportamiento 100% conocido | Exportación real de Loggro + extracto Bancolombia (Pikeo y Carolina) + Sheet de gastos, de un día real ya cerrado |
| **Preparación** | Ninguna — ya están en el repo | Copiar los 4 archivos del día elegido a `data/inbox/`, con los extractos nombrados incluyendo "pikeo" o "carolina" |
| **Riesgo** | Ninguno conocido | El parser de Bancolombia/Loggro está marcado "formato provisional" — puede rechazar el archivo si las columnas reales no coinciden |
| **Base de datos** | `data/auditor.db` de prueba, se puede borrar y recrear sin costo | Usa una base de datos **dedicada para la demo** (no la de operación diaria), para que un `resolve` de ensayo no contamine tus datos reales |

**Regla de oro:** nunca uses datos reales por primera vez en vivo. Corre la versión real al menos una vez, en privado, antes del Demo Day. Si funciona limpio dos veces seguidas, es tu versión principal. Si falla aunque sea una vez, usas la sintética y no lo mencionas como excusa — simplemente es la demo.

## 4. Riesgos de la demo en vivo y cómo mitigarlos

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| El extracto real de Bancolombia no calza con el parser ("formato provisional") | Media-alta si no se ensayó antes | Ensayar con datos reales mínimo 24h antes; si falla, usar la versión sintética sin dudar |
| Error de "disk I/O" si el proyecto vive en una carpeta sincronizada (iCloud/Drive/Dropbox) | Media | Antes del Demo Day, correr `init` una vez y confirmar que no falla; si falla, mover `db_path` fuera de la carpeta sincronizada |
| Escribir mal un comando en vivo (typo bajo presión) | Alta si se escribe a mano | Preparar un script `demo.sh` que corra los comandos exactos en orden, para no depender de teclear en vivo |
| El estado de la base de datos no es el esperado (una excepción ya resuelta de un ensayo anterior) | Alta si se reusa la misma base | Usar una base de datos dedicada para la demo y **borrarla y recrearla** justo antes de salir a presentar |
| Pantalla/proyector con letra muy pequeña | Media | Subir el tamaño de fuente de la terminal a 18–20pt antes de empezar, probarlo desde el fondo de la sala si es posible |
| Silencio incómodo mientras corre el comando | Baja (el comando es casi instantáneo) | Narrar *durante* la ejecución, no antes ni después — el guion de la sección 2 ya está diseñado así |
| Pregunta técnica difícil en medio de la demo ("¿usa IA?", "¿qué pasa con el efectivo?") | Media | Tener listas las dos respuestas cortas ya escritas en este documento (secciones 2 y 5) — responder en una frase y volver al guion, no abrir una discusión técnica ahí |
| Que el día elegido para la demo tenga 0 excepciones (no hay nada que "resolver" en vivo) | Media si se usa el día real más reciente sin revisar antes | Elegir a propósito, con antelación, un día que tenga exactamente 1 excepción clara — ni 0 (no enseña nada) ni muchas (asusta) |

## 5. Plan B por paso — qué hacer si algo falla en el momento

| Si falla... | Alternativa segura |
|---|---|
| `run` con datos reales | Cambiar a `--config config/pikeo.yaml` apuntando al inbox sintético ya preparado, o tener una segunda terminal con la versión sintética ya lista para alternar con un clic |
| Cualquier comando tarda visiblemente o cuelga | No hay llamadas a internet ni APIs externas — todo es local. Si algo cuelga, es la terminal, no una dependencia externa: cerrar y usar una terminal de respaldo con el mismo comando ya en el historial (flecha arriba) |
| El terminal no se ve bien en el proyector | Tener capturas de pantalla de respaldo (screenshots del `run` y el `home`) como última red de seguridad, mostradas desde una presentación simple si la terminal falla del todo |
| Preguntan algo que no sabes responder en el momento | "Buena pregunta — te la respondo justo después de la demo con el detalle técnico" y seguir. No hay que resolverlo todo en el escenario |

## 6. Checklist de la última hora antes de salir a presentar

- Base de datos de demo borrada y recreada limpia (`rm` + `init`)
- Los 4 archivos del día elegido ya están en `data/inbox/` (real o sintético, ya decidido)
- Corrida completa de ensayo hecha **una vez más**, hoy mismo, con éxito
- Fuente de terminal en 18–20pt
- Segunda terminal (o `demo.sh`) lista como respaldo
- Capturas de pantalla de `run` y `home` guardadas como última red de seguridad
- Reloj o cronómetro visible para no pasarte de los 5 minutos

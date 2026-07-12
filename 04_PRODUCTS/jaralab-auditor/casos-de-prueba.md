---
title: "JaraLab Auditor — Batería de Casos de Prueba"
type: test-plan
status: active
owner: "Laura Jaramillo"
created: 2026-07-08
updated: 2026-07-11
version: 1.0
tags: [jaralab-auditor, testing, calidad, casos-limite]
related: ["spec.md", "plan-de-ejecucion.md", "backlog.md", "blueprint-arquitectura.md"]
---

# JaraLab Auditor — Batería de Casos de Prueba

Regla general: cada caso se implementa primero con el fixture disponible (real anonimizado si existe, sintético si no) y se reemplaza por el caso real de Pikeo/Callejero en cuanto aparezca. Montos en COP. El resultado esperado de cada caso incluye no solo el match sino el **estado y la evidencia** — probamos que el motor sepa explicarse, no solo acertar.

## A. Normalización y lectura (F0)

- **A1.** Archivo con encoding Latin-1 y tildes en contrapartes → eventos con texto correcto, sin caracteres rotos.
- **A2.** Montos con separador de miles colombiano ("1.250.000,50") → 1250000.50 exacto, nunca 1.25.
- **A3.** Fechas ambiguas (03/07 vs 07/03) → el adaptador declara el formato de su fuente; un archivo con fechas imposibles (mes 13) falla ruidosamente.
- **A4.** Extracto con filas basura: encabezados repetidos, subtotales, "SALDO ANTERIOR" → se descartan sin generar eventos.
- **A5.** Columna esperada ausente (el banco cambió el formato) → la ingesta se detiene con mensaje claro; cero eventos parciales en la base.
- **A6.** Archivo vacío o de otro banco soltado en inbox → detectado y rechazado con explicación, no procesado por el adaptador equivocado.
- **A7.** Venta Loggro con propina e impoconsumo desglosados → el evento conserva el desglose en raw y el monto correcto según configuración.

## B. Deduplicación e idempotencia (F0)

- **B1.** El mismo extracto ingerido dos veces → cero eventos nuevos la segunda vez.
- **B2.** Extracto mensual subido encima de los diarios ya procesados → solo se agregan los días faltantes.
- **B3.** Dos ventas legítimas idénticas (mismo monto, mismo minuto, dos mesas) → NO se deduplican; el hash incluye la referencia única de la fuente.
- **B4.** El mismo movimiento presente en el extracto de hoy y en el de mañana (solapamiento de fechas del banco) → un solo evento.

## C. Matching exacto (F1)

- **C1.** Transferencia recibida 150.000, factura POS 150.000, mismo día, referencia compatible → match automático, confianza ≥95, evidencia con los 4 factores.
- **C2.** Mismo monto pero 3 días de diferencia y sin referencia común → NO auto-match; sugerido o excepción según score.
- **C3.** Dos facturas de 80.000 el mismo día y un solo abono de 80.000 → una concilia, la otra queda pendiente; nunca doble asignación.

## D. Tolerancia y diferencias explicables (F1)

- **D1.** Factura 100.000, banco 99.600 → diferencia = exactamente 0.4% → explicación "GMF 4x1000", confianza alta.
- **D2.** Factura 100.000, banco 99.800 → diferencia 200 compatible con comisión de transferencia → sugerido con explicación "posible comisión bancaria".
- **D3.** Factura 100.000, banco 98.000 → diferencia sin causa conocida → excepción, nunca auto-conciliado.
- **D4.** GMF aplicado sobre monto no redondo (venta 137.450 → GMF 549.8) → la fórmula exacta lo identifica.

## E. Pagos partidos (F2)

- **E1.** Factura 180.000; banco: 80.000 + 50.000 + 50.000 en 48h, misma contraparte → match partido con evidencia de la suma.
- **E2.** Factura 180.000; banco: 80.000 + 50.000 + 50.000 pero de tres contrapartes distintas sin relación → NO auto-match; sugerido con score bajo.
- **E3.** Combinación ambigua: dos facturas de 100.000 y tres abonos (60.000 + 40.000 + 100.000) → el motor asigna la solución de mayor score global y nunca usa un abono en dos matches.
- **E4.** Partido que excede la ventana (abono llega al día 4) → los primeros abonos quedan como match parcial visible, la expectativa sigue abierta hasta vencer.
- **E5.** Límite combinatorio: día con 200 movimientos → la pasada de partidos termina en tiempo acotado (poda k≤4, ventana, contraparte).

## F. Settlements de datáfono (F2)

- **F1.** 40 ventas Visa del lunes → un depósito neto el miércoles = bruto − comisión − IVA sobre comisión → conciliación agregada con desglose por venta.
- **F2.** Franquicias con tasas distintas (Visa 2.2%, Amex 3.5%) mismo día → dos settlements independientes correctamente separados.
- **F3.** Settlement que agrupa ventas de dos días (fin de semana) → el motor prueba agrupaciones multi-día antes de declarar excepción.
- **F4.** Depósito de datáfono con retención adicional inesperada → diferencia no explicada por comisión conocida → excepción con el cálculo mostrado.
- **F5.** Primera vez con un adquirente (sin tasa aprendida) → el motor usa rango plausible, concilia como sugerido, y la confirmación crea la regla de tasa.

## G. Expectativas (F1) — ADR-0006

- **G1.** Venta con tarjeta ayer, hoy es T+1 y no ha llegado → estado "en tránsito", cero alarmas en el reporte.
- **G2.** Expectativa vencida (T+2 + 1 día de gracia) sin depósito → alarma "vencido sin llegar", prioridad máxima del reporte.
- **G3.** Depósito parcial contra una expectativa (llegó 60% del neto esperado) → conciliación parcial visible + diferencia como excepción.
- **G4.** Venta anulada en Loggro después de generar expectativa → la expectativa se cancela, no vence ni alarma.

## H. Auditoría de gastos (F2)

- **H1.** Débito bancario de 300.000 sin gasto registrado, hace 12 horas → tarea para el gerente ("registra este gasto"), no alerta.
- **H2.** El mismo débito, 80 horas después, sin registro → escala a alerta "salida sin soporte".
- **H3.** Proveedor pagado dos veces: dos débitos idénticos (mismo monto, misma contraparte) con 2 días de diferencia → alerta de posible pago duplicado con ambos movimientos citados.
- **H4.** Gasto registrado en Sheets sin débito bancario correspondiente → clasificado como posible pago en efectivo (fuera de alcance v1 por ADR-0007), informado sin alarma.
- **H5.** Gasto registrado con monto levemente distinto al débito (150.000 vs 149.500) → match con tolerancia y explicación, no dos huérfanos.

## I. Errores humanos y duplicados bancarios (F2)

- **I1.** Transferencia duplicada real del banco (mismo remitente envió dos veces) → NO se deduplica (son dos movimientos reales); el motor la marca como posible ingreso duplicado a verificar.
- **I2.** Error de digitación en gastos: registrado 1.520.000, débito 1.250.000 → detectado como posible transposición, sugerido con explicación.
- **I3.** Gasto registrado con fecha equivocada (ayer en vez de hoy) → el período de gracia y la ventana temporal lo absorben; match con nota.
- **I4.** Contraparte escrita de tres formas distintas ("Distribuidora La 70", "DIST LA 70 SAS", "La 70") → tras la primera confirmación, el alias vive en el libro de reglas y las siguientes concilian solas.

## J. Anomalías (F3)

- **J1.** Martes con 8 transferencias cuando el histórico de martes promedia 25 → señal de volumen inusualmente bajo.
- **J2.** Débito de 4.000.000 a contraparte nunca vista → señal de alto valor no habitual, prioridad máxima.
- **J3.** Semana con crecimiento gradual de pagos pequeños a una misma cuenta nueva → señal de patrón acumulativo (el caso clásico de fuga hormiga).
- **J4.** Variación fuerte pero explicable (día festivo, cierre del restaurante) → el baseline por día de semana y calendario la absorbe; cero ruido.

## Criterio transversal de éxito

Un caso pasa cuando: el resultado es el esperado, la **evidencia** registrada permite a un humano verificar el razonamiento, y el caso corre en la regresión de golden days sin romper ningún caso anterior. El indicador que nunca se negocia: **cero falsos "todo bien"** — preferimos una excepción de más que una alarma de menos.

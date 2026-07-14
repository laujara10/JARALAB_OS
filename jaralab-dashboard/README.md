# JaraLab Dashboard — v0.1 MVP

Interfaz de inteligencia financiera para restaurantes. Construida sobre el Design System oficial de JaraLab.

## Qué es

MVP navegable del panel de control de JaraLab. Consume datos mock coherentes para un restaurante llamado Pikeo. Diseñado como la capa visual que eventualmente consumirá la API del Auditor Python (`jaralab-auditor`).

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Lenguaje**: TypeScript estricto
- **Estilos**: CSS Modules + CSS custom properties (sin Tailwind, sin librerías de componentes)
- **Design System**: tokens `oklch()`, tipografía Geist Sans / Geist Mono / Newsreader
- **Íconos**: Lucide React

## Pantallas incluidas (v0.1)

| Pantalla | Ruta | Descripción |
|---|---|---|
| Overview | `/dashboard` | Quote editorial, KPIs del CEO, sparklines, alertas, próximas acciones |
| Revenue | `/dashboard/revenue` | Tendencia semanal/diaria, por canal, por método de pago, top días |
| Costs | `/dashboard/costs` | Food cost % vs target, vendor spend, varianzas por proveedor |
| Labor | `/dashboard/labor` | Horas actuales vs programadas, staff table con payroll semanal |
| Restaurant Auditor | `/auditor` | Upload de archivos, pipeline de auditoría, score ring, hallazgos |
| AI Copilot | `/dashboard/copilot` | Chat interface con historial, preguntas sugeridas, fuentes activas |
| Decision Lab | `/labs/decision` | Decisiones registradas con estado, impacto y filtros |
| Growth Lab | `/labs/growth` | Experimentos con hipótesis, métricas, resultados y win rate |
| CFO Lab | `/labs/cfo` | Placeholder — v0.2 |

## Componentes reutilizables

```
src/components/
  layout/
    Sidebar.tsx       — navegación principal con secciones y avatar
    Topbar.tsx        — barra superior con selector de rango y acciones
  ui/
    core/
      Badge.tsx       — 6 tones: neutral, success, warning, danger, info, gold
      Button.tsx      — primary, secondary, ghost · sm, md, lg · icon support
      Card.tsx        — contenedor de superficie con padding configurable
      LabPlaceholder  — pantalla de "próximamente" para labs sin implementar
    data/
      StatCard.tsx    — KPI con valor, delta, tone y caption
      Sparkline.tsx   — línea SVG con área degradada
      BarChart.tsx    — barras simples o agrupadas (comparación)
      Table.tsx       — tabla genérica con soporte a JSX en celdas
    navigation/
      Tabs.tsx        — tabs controlados sin librerías
```

## Design System

Los tokens están en `src/styles/tokens/`:

- `colors.css` — paleta completa en `oklch()` con aliases semánticos
- `typography.css` — escala tipográfica, peso, tracking
- `spacing.css` — escala de espaciado + radios + durations
- `fonts.css` — carga de Geist y Newsreader vía `next/font`

Reglas no negociables:
- Todo valor monetario usa `--font-mono` con `tabular-nums`
- Serif (Newsreader) solo para momentos editoriales — nunca en tablas ni datos
- Sin degradados, sin texturas en pantallas de datos
- Sin emoji

## Correr en local

```bash
npm install
npm run dev
# http://localhost:3000
```

```bash
npm run build   # build de producción
npx tsc --noEmit  # verificación de tipos
```

## Relación con jaralab-auditor

Este frontend está diseñado para consumir el backend Python que vive en `JARALAB_OS/04_PRODUCTS/jaralab-auditor/`. La especificación de integración está en `JARALAB_OS/00_IDENTITY/DESIGN_SYSTEM/frontend-spec.md`.

En v0.1, todos los datos son mock. En v0.2 se conectará a la API real del Auditor.

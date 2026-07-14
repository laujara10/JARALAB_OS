---
title: "JaraLab Frontend — Especificación Técnica"
type: blueprint
status: active
owner: "Laura Jaramillo"
created: 2026-07-13
updated: 2026-07-13
version: 1.0
tags: [frontend, design-system, react, nextjs, arquitectura]
related:
  - "../../../05_SYSTEMS/jaralab-os-constitucion-tecnica.md"
  - "../../../07_DECISIONS/0003-stack-monolito-python-sqlite.md"
  - "../../../07_DECISIONS/0004-alcance-mvp-un-solo-canal.md"
source: "00_IDENTITY/DESIGN_SYSTEM/JaraLab Design System-handoff.zip"
---

# JaraLab Frontend — Especificación Técnica

Este documento define la arquitectura y el sistema de diseño del frontend React/Next.js
que consumirá el backend Python del JaraLab Auditor. Es la fuente de verdad visual y
técnica para cualquier desarrollador o agente que construya interfaces de JaraLab.

No modifica ni reemplaza ninguna decisión del Auditor (ADR-0001 a 0007). El backend
sigue siendo Python + SQLite; este documento especifica la capa de presentación.

---

## 1. Stack recomendado

| Decisión | Elección | Razón |
|---|---|---|
| Framework | **Next.js 14+ (App Router)** | SSR nativo para reportes, routing por segmentos, RSC disponibles para capas de datos |
| UI layer | **React 18+** | El Design System está en JSX; componentes reutilizables directo del bundle |
| Estilos | **CSS Modules + CSS custom properties** | Los tokens ya son variables CSS; sin dependencia de Tailwind ni CSS-in-JS |
| Iconos | **Lucide React** | El DS usa Lucide; versión React del mismo set, sin CDN en producción |
| Fuentes | **next/font (Google Fonts)** | Geist, Geist Mono, Newsreader — carga optimizada, sin FOUT |
| HTTP client | **fetch nativo / SWR** | El Auditor expone una API REST; SWR para polling del reporte diario |
| TypeScript | **Sí** | Los `.d.ts` del DS ya están generados; se usan directamente |

---

## 2. Tokens de diseño

El DS entrega los tokens como CSS custom properties en cuatro archivos. En Next.js
se importan una vez en el layout raíz y están disponibles globalmente.

### 2.1 Colores

```css
/* Paleta base — warm paper/ink, nunca pure #000/#fff */
--neutral-0   → oklch(0.995 0.002 80)   /* bg-canvas: blanco cálido */
--neutral-25  → oklch(0.98  0.004 75)   /* bg-page: fondo general */
--neutral-900 → oklch(0.18 0.009 45)    /* fg-primary: tinta principal */

/* Primario — forest green */
--primary-600 → oklch(0.42 0.088 163)   /* accent-primary: CTA, links, activos */
--primary-700 → oklch(0.35 0.075 162)   /* accent-primary-hover */
--primary-800 → oklch(0.28 0.06 161)    /* accent-primary-active */

/* Secundario — muted gold */
--gold-500    → oklch(0.62 0.125 64)    /* accent-gold: premium, editorial */
--gold-600    → oklch(0.52 0.11 60)     /* gold-hover */

/* Semánticos */
--success-500 / --success-100
--warning-500 / --warning-100
--danger-500  / --danger-100
--info-500    / --info-100
```

**Aliases semánticos** (usar estos en componentes, nunca el valor crudo):

```
--bg-page          → fondo de página
--bg-canvas        → fondo de canvas/modal
--bg-surface       → superficie de card
--bg-surface-2     → superficie secundaria (hover row, etc.)
--fg-primary       → texto principal
--fg-secondary     → texto secundario
--fg-tertiary      → placeholder, captions
--fg-accent        → texto de acento (links, labels activos)
--border-subtle    → borde hairline (separadores)
--border-default   → borde de inputs en reposo
--border-accent    → borde activo/seleccionado
```

### 2.2 Tipografía

Tres familias con roles distintos:

| Variable | Familia | Rol |
|---|---|---|
| `--font-sans` | Geist | Todo UI, body, headings, botones, labels |
| `--font-mono` | Geist Mono | Cifras financieras, porcentajes, timestamps, código |
| `--font-serif` | Newsreader | Solo momentos editoriales: pull quotes, stat hero, portadas de reporte |

**Regla crítica:** `--font-mono` con `font-variant-numeric: tabular-nums` en **toda** cifra monetaria o porcentaje. Los dígitos deben alinearse en columnas.

Escala de texto relevante para dashboards:

```
--text-display-md     → 600 2.25rem / 1.15   (hero stat)
--text-editorial-md   → 500 1.75rem / 1.30   (serif, insight headline)
--text-heading-lg     → 600 1.375rem / 1.30  (section title)
--text-heading-md     → 600 1.125rem / 1.35  (card title)
--text-body-md        → 400 0.9375rem / 1.55 (body)
--text-label-md       → 500 0.8125rem / 1.30 (labels, nav)
--text-label-sm       → 500 0.6875rem / 1.30 (kickers uppercase)
--text-mono-lg        → 500 1.5rem / 1.20    (cifra grande en StatCard)
--text-mono-md        → 500 0.875rem / 1.40  (cifra en tabla)
--text-caption        → 400 0.75rem / 1.40   (caption, metadata)
```

### 2.3 Espaciado

Escala 4px derivada (`--space-1` = 0.25rem … `--space-32` = 8rem).

Densidades por contexto:
- **Entre elementos dentro de una card:** `--space-4` a `--space-6`
- **Entre secciones del dashboard:** `--space-8` a `--space-12`
- **Padding de página:** `--space-8` horizontal, `--space-6` vertical

### 2.4 Radios, sombras y movimiento

```
--radius-sm  → 6px   (inputs, botones, nav items)
--radius-md  → 10px  (cards, dropdowns)
--radius-lg  → 14px  (modales, sidesheets)
--radius-full → 999px (pills, avatars)

--shadow-xs  → reposo de card (apenas perceptible)
--shadow-sm  → card en hover
--shadow-md  → dropdown, popover
--shadow-lg  → modal
--shadow-focus → ring de foco (3px, primary-tinted)

--duration-fast     → 120ms  (hover, toggle)
--duration-standard → 200ms  (panel, dialog)
--ease-standard → cubic-bezier(0.4, 0, 0.2, 1)
--ease-out      → cubic-bezier(0.16, 1, 0.3, 1)
```

---

## 3. Biblioteca de componentes

El DS entrega 18 componentes en JSX con sus `.d.ts`. Se migran a TypeScript puro
y se organizan en `src/components/ui/` siguiendo la misma taxonomía del bundle.

### 3.1 Inventario

**Core** — `Badge`, `Button`, `Card`, `Icon`, `IconButton`, `Tag`

**Data** — `StatCard`, `Table`, `Sparkline`

**Forms** — `Checkbox`, `Input`, `Radio`, `Select`, `Switch`

**Feedback** — `Dialog`, `Toast`, `Tooltip`

**Navigation** — `Tabs`

### 3.2 Estructura de carpetas

```
src/
├── app/
│   ├── layout.tsx          ← importa globals.css (tokens + fuentes)
│   ├── (dashboard)/
│   │   ├── layout.tsx      ← Sidebar + Topbar
│   │   ├── page.tsx        ← DashboardScreen (Overview)
│   │   ├── revenue/
│   │   ├── costs/
│   │   ├── labor/
│   │   └── copilot/
│   └── (marketing)/
│       └── page.tsx
├── components/
│   ├── ui/                 ← DS components migrados a TS
│   │   ├── core/
│   │   ├── data/
│   │   ├── forms/
│   │   ├── feedback/
│   │   └── navigation/
│   └── auditor/            ← Componentes específicos del Auditor
│       ├── DailyReport.tsx
│       ├── ExceptionBadge.tsx
│       ├── MatchRow.tsx
│       └── ConciliationTable.tsx
├── styles/
│   ├── globals.css         ← @import tokens/*
│   └── tokens/             ← copia exacta del DS (colors, fonts, spacing, typography)
└── lib/
    └── auditor-api.ts      ← cliente HTTP hacia el backend Python
```

### 3.3 Migración de componentes del DS a TypeScript

Cada componente del DS (`.jsx` + `.d.ts`) se convierte en `.tsx`. Regla:
no se cambia el comportamiento ni los estilos, solo el tipo.

```tsx
// Ejemplo: src/components/ui/data/StatCard.tsx
import type { StatCardProps } from './StatCard.d'

export function StatCard({ label, value, delta, deltaTone = 'success', caption }: StatCardProps) {
  // mismo JSX que el DS, sin modificación
}
```

---

## 4. Layout del dashboard

El layout del Auditor replica el patrón del UI kit `dashboard/`:

```
┌─────────────────────────────────────────────────────┐
│  Topbar (60px, sticky, backdrop-blur)               │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ Sidebar  │  Content area (scroll independiente)    │
│ (220px)  │                                          │
│ fixed    │  ┌────────────────────────────────────┐  │
│          │  │  Editorial insight (serif italic)  │  │
│ Nav:     │  └────────────────────────────────────┘  │
│ Overview │                                          │
│ Revenue  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│ Costs    │  │ Stat │ │ Stat │ │ Stat │ │ Stat │   │
│ Labor    │  └──────┘ └──────┘ └──────┘ └──────┘   │
│ Reports  │                                          │
│ Copilot  │  ┌────────────────────────────────────┐  │
│          │  │  Sparkline card                    │  │
│ [Avatar] │  └────────────────────────────────────┘  │
│          │                                          │
│          │  ┌────────────────────────────────────┐  │
│          │  │  Table (excepciones / transacciones)│  │
└──────────┴──┴────────────────────────────────────┴──┘
```

**Topbar** — fondo translúcido (`bg-page / 0.85` + `backdrop-filter: blur(8px)`),
sticky. Contiene: título de sección, selector de rango de fecha (Select), IconButtons
de notificaciones y ajustes.

**Sidebar** — 220px fija, `--bg-surface`, borde derecho `--border-subtle`. Nav items:
16px Lucide icon + label 13px. Active state: `--primary-50` bg + `--primary-700` text.
Footer: avatar + nombre del restaurante.

---

## 5. Pantallas del Auditor

El Auditor en F0 genera un reporte diario HTML. La interfaz web expone ese mismo
reporte en formato interactivo. Pantallas mínimas del MVP frontend:

### 5.1 Overview (página principal)

1. **Insight editorial** — frase generada por el LLM en serif italic (`--font-serif`,
   `--text-editorial-md`). Ej: *"Your food cost is up 3.2% this week. Produce is the driver."*
2. **4 StatCards en grid** — Revenue, Food cost %, Labor %, Net margin. Valores en
   `--font-mono` `--text-mono-lg`. Deltas con colores semánticos.
3. **Sparkline card** — tendencia de la métrica principal, últimas 8 semanas.
4. **Tabla de excepciones** — transacciones sin match, ordenadas por monto. Columnas:
   Fecha, Descripción, Monto (mono, align right), Estado (Badge semántico).

### 5.2 Reporte de cierre diario

Equivalente interactivo del reporte HTML actual. Secciones colapsables:
- Resumen ejecutivo (4 StatCards)
- Matches automáticos (Table con evidencia)
- Excepciones que requieren revisión (Table + Badge `danger`/`warning`)
- Anomalías detectadas (Badge `info` + descripción LLM)

### 5.3 AI Copilot

Chat interface basada en el UI kit `copilot/`. El usuario hace preguntas sobre
los datos ya conciliados que viven en SQLite. El backend responde consultando
la base y formateando con el LLM (mismo patrón ADR-0001: IA en los bordes).

---

## 6. Integración con el backend Python

El Auditor expone una API REST. El cliente frontend vive en `src/lib/auditor-api.ts`.

Endpoints mínimos que el backend debe implementar (se documenta como ADR cuando
se decida el framework HTTP):

```
GET  /api/reports/daily?date=YYYY-MM-DD   → reporte del día
GET  /api/reports/summary?range=7d|30d|q  → métricas agregadas
GET  /api/exceptions?status=open|resolved → tabla de excepciones
POST /api/exceptions/:id/resolve          → marcar como revisada
GET  /api/copilot/query?q=...             → respuesta del LLM
```

Los datos financieros (montos, porcentajes) se reciben como strings formateados
desde el backend (`"$84,210"`, `"+4.8%"`) para evitar lógica de formato en el
frontend. El frontend solo presenta, nunca recalcula.

---

## 7. Reglas visuales no negociables

Estas reglas derivan directamente del readme del DS y definen el comportamiento
de cualquier pantalla que se construya:

1. **Sin gradientes, sin texturas, sin ilustraciones en dashboards.** Fondo plano
   `--bg-page`. Fotografía solo en marketing/hero, nunca en pantallas de datos.

2. **Toda cifra monetaria o porcentaje usa `--font-mono` + `tabular-nums`.** Sin
   excepción. Los números que no se alinean en columnas son un error de diseño.

3. **Sin emoji en la UI.** El producto es finance-adjacent; el emoji socava autoridad.

4. **Sentence case en todo.** Títulos, botones, labels de nav, headers de tabla.
   La única excepción son kickers de sección (eyebrow labels): uppercase tracked-out,
   pequeño, usado muy poco.

5. **Hover sin escala, sin bounce.** El estado hover cambia background un paso en
   la rampa neutral. El estado active suma 1px de translate vertical. Sin spring
   animations.

6. **Focus ring siempre visible.** `--shadow-focus` en todos los elementos interactivos.
   Nunca `outline: none` sin reemplazo.

7. **Newsreader (serif) solo para momentos editoriales.** Una frase de insight, un
   número hero, una portada de reporte. Nunca en botones, nav, tablas, o cuerpo
   de dashboard.

8. **Cards: sin borde de acento de color lateral.** El patrón de "borde izquierdo
   de color" está explícitamente prohibido en el DS. El estado de alerta se comunica
   mediante Badge, no mediante el contenedor.

---

## 8. Fuentes de verdad

| Artefacto | Ubicación | Uso |
|---|---|---|
| Tokens CSS | `00_IDENTITY/DESIGN_SYSTEM/` (tokens/) | Copiar verbatim a `src/styles/tokens/` |
| Componentes DS | `00_IDENTITY/DESIGN_SYSTEM/` (components/) | Migrar a `.tsx` sin alterar estilos |
| UI Kits de referencia | `00_IDENTITY/DESIGN_SYSTEM/` (ui_kits/) | Referencia visual, no copiar código |
| API del Auditor | `04_PROJECTS/jaralab-auditor/` | Contrato de integración backend |
| ADRs activos | `07_DECISIONS/` | Restricciones arquitectónicas que el frontend hereda |

---

## 9. Lo que queda pendiente antes de iniciar desarrollo

1. **ADR-0008** — Registrar la decisión de adoptar Next.js como framework frontend
   y documentar las alternativas descartadas (Remix, Vite SPA).
2. **Endpoints de la API** — El backend Python necesita una capa HTTP. Decidir entre
   FastAPI y Flask y registrar como ADR-0009.
3. **Logo oficial** — El DS usa wordmark en texto plano como sustituto. En cuanto
   exista el archivo, reemplazar en `00_IDENTITY/DESIGN_SYSTEM/assets/`.
4. **Fuentes propietarias** — El DS usa Geist + Newsreader de Google Fonts como
   sustitutos. Si JaraLab tiene fuentes licenciadas, reemplazar en `tokens/fonts.css`
   y en la configuración de `next/font`.
5. **`estado.md` del proyecto frontend** — Crear en `04_PROJECTS/jaralab-frontend/`
   cuando se inicie el desarrollo, siguiendo el protocolo del módulo 3 de la Constitución.

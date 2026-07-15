/**
 * JaraLab OS — Mapa de rutas centralizado
 *
 * Convención:
 *   - Rutas de primer nivel: /hoy, /resumen, /ventas, /costos, /personal
 *   - Herramientas: /auditor, /copilot
 *   - Labs: /labs/decision, /labs/growth, /labs/cfo
 *
 * Dev-toggle:
 *   Añadir ?dev=true a CUALQUIER ruta activa para ver el panel de estados.
 *   Ejemplo: /resumen?dev=true, /hoy?dev=true
 *   Nunca visible en producción (NODE_ENV === 'production' ignora el param).
 *
 * Cambio de nomenclatura respecto a la estructura Next.js en disco:
 *   - /dashboard  → se expone como /resumen (alias via redirect en next.config)
 *   - /dashboard/revenue → /ventas
 *   - /dashboard/costs   → /costos
 *   - /dashboard/labor   → /personal
 *   Los archivos siguen viviendo en src/app/dashboard/* para no romper
 *   el layout compartido de Next.js. La ruta pública es la de abajo.
 */

export const ROUTES = {
  // ── Pantallas principales ────────────────────────────────────────────────
  hoy:      '/hoy',       // Pantalla 1: Decisiones del día
  resumen:  '/dashboard', // Pantalla 2: KPIs y salud general (alias público: /resumen)
  ventas:   '/dashboard/revenue', // Pantalla 3: Detalle de ventas
  costos:   '/dashboard/costs',   // Pantalla 4: Detalle de costos
  personal: '/dashboard/labor',   // Pantalla 5: Detalle de personal

  // ── Herramientas ─────────────────────────────────────────────────────────
  auditor:  '/auditor',           // Restaurant Auditor (conciliación)
  copilot:  '/dashboard/copilot', // AI Copilot

  // ── Labs (próximamente) ───────────────────────────────────────────────────
  decisionLab: '/labs/decision',
  growthLab:   '/labs/growth',
  cfoLab:      '/labs/cfo',
} as const

export type AppRoute = typeof ROUTES[keyof typeof ROUTES]

/** Añade ?dev=true para activar el panel de estados en desarrollo */
export function devRoute(route: AppRoute): string {
  return `${route}?dev=true`
}

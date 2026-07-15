'use client'
import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Sparkline } from '@/components/ui/data/Sparkline'
import {
  TrendingUp, TrendingDown, Minus, AlertTriangle,
  WifiOff, RefreshCw, ChevronRight, Info, CircleDashed,
} from 'lucide-react'

// ─── JSON CONTRACT ─────────────────────────────────────────────────────────────
// Shape expected from GET /api/resumen?periodo=hoy|semana|mes
// {
//   periodo: {
//     tipo: 'hoy' | 'semana' | 'mes',
//     fecha_inicio: string,   // ISO 8601
//     fecha_fin: string,      // ISO 8601
//   },
//   kpi_destacado: 'ventas' | 'ticket_promedio' | 'cmv_pct' | 'margen_bruto_pct',
//                  // el motor Python decide cuál destacar según anomalía del día
//   kpis: {
//     ventas:          { valor: number | null, moneda: string, variacion_pct: number | null, confidence: 'confirmado' | 'estimado' },
//     ticket_promedio: { valor: number | null, variacion_pct: number | null, confidence: 'confirmado' | 'estimado' },
//     cmv_pct:         { valor: number | null, variacion_pct: number | null, confidence: 'confirmado' | 'estimado' },
//     margen_bruto_pct:{ valor: number | null, variacion_pct: number | null, confidence: 'confirmado' | 'estimado' },
//   },
//   alertas_activas: { urgentes: number, revisar: number, info: number },
//   tendencia_ventas: Array<{ fecha: string, valor: number }>,
//   status: 'ok' | 'atencion' | 'sin_datos',
//   estado_pipeline: 'completado' | 'corriendo' | 'error',
// }

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Periodo = 'hoy' | 'semana' | 'mes'
type Confidence = 'confirmado' | 'estimado'
type PipelineEstado = 'completado' | 'corriendo' | 'error'
type Status = 'ok' | 'atencion' | 'sin_datos'
type UiEstado = 'normal' | 'vacio' | 'error' | 'carga'
type KpiKey = 'ventas' | 'ticket_promedio' | 'cmv_pct' | 'margen_bruto_pct'

interface KpiField {
  valor: number | null
  moneda?: string
  variacion_pct: number | null
  confidence: Confidence
}

interface ResumenData {
  periodo: { tipo: Periodo; fecha_inicio: string; fecha_fin: string }
  kpi_destacado: KpiKey
  kpis: {
    ventas: KpiField
    ticket_promedio: KpiField
    cmv_pct: KpiField
    margen_bruto_pct: KpiField
  }
  alertas_activas: { urgentes: number; revisar: number; info: number }
  tendencia_ventas: Array<{ fecha: string; valor: number }>
  status: Status
  estado_pipeline: PipelineEstado
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const MOCK_NORMAL: ResumenData = {
  periodo: { tipo: 'semana', fecha_inicio: '2026-07-07', fecha_fin: '2026-07-13' },
  kpi_destacado: 'cmv_pct', // motor detectó anomalía: CMV subió 1.4pt
  kpis: {
    ventas:           { valor: 588470, moneda: 'COP', variacion_pct: 6.2,  confidence: 'confirmado' },
    ticket_promedio:  { valor: 42300,  moneda: 'COP', variacion_pct: -1.4, confidence: 'confirmado' },
    cmv_pct:          { valor: 29.8,   variacion_pct: 1.4,  confidence: 'estimado'   },
    margen_bruto_pct: { valor: 68.1,   variacion_pct: -0.9, confidence: 'estimado'   },
  },
  alertas_activas: { urgentes: 1, revisar: 2, info: 1 },
  tendencia_ventas: [
    { fecha: '2026-07-07', valor: 71200 },
    { fecha: '2026-07-08', valor: 68400 },
    { fecha: '2026-07-09', valor: 95300 },
    { fecha: '2026-07-10', valor: 88100 },
    { fecha: '2026-07-11', valor: 76200 },
    { fecha: '2026-07-12', valor: 102800 },
    { fecha: '2026-07-13', valor: 86470 },
  ],
  status: 'atencion',
  estado_pipeline: 'completado',
}

const MOCK_VACIO: ResumenData = {
  periodo: { tipo: 'hoy', fecha_inicio: '2026-07-14', fecha_fin: '2026-07-14' },
  kpi_destacado: 'ventas',
  kpis: {
    ventas:           { valor: null, moneda: 'COP', variacion_pct: null, confidence: 'confirmado' },
    ticket_promedio:  { valor: null, variacion_pct: null, confidence: 'confirmado' },
    cmv_pct:          { valor: null, variacion_pct: null, confidence: 'confirmado' },
    margen_bruto_pct: { valor: null, variacion_pct: null, confidence: 'confirmado' },
  },
  alertas_activas: { urgentes: 0, revisar: 0, info: 0 },
  tendencia_ventas: [],
  status: 'sin_datos',
  estado_pipeline: 'completado',
}

const MOCK_ERROR: ResumenData = {
  periodo: { tipo: 'semana', fecha_inicio: '2026-07-07', fecha_fin: '2026-07-13' },
  kpi_destacado: 'ventas',
  kpis: {
    ventas:           { valor: 588470, moneda: 'COP', variacion_pct: 6.2,  confidence: 'confirmado' },
    ticket_promedio:  { valor: 42300,  moneda: 'COP', variacion_pct: -1.4, confidence: 'confirmado' },
    cmv_pct:          { valor: null,   variacion_pct: null, confidence: 'estimado' },
    margen_bruto_pct: { valor: null,   variacion_pct: null, confidence: 'estimado' },
  },
  alertas_activas: { urgentes: 0, revisar: 1, info: 0 },
  tendencia_ventas: [
    { fecha: '2026-07-07', valor: 71200 },
    { fecha: '2026-07-08', valor: 68400 },
    { fecha: '2026-07-09', valor: 95300 },
  ],
  status: 'sin_datos',
  estado_pipeline: 'error',
}

const MOCK_CARGA: ResumenData = {
  periodo: { tipo: 'semana', fecha_inicio: '2026-07-07', fecha_fin: '2026-07-13' },
  kpi_destacado: 'ventas',
  kpis: {
    ventas:           { valor: null, moneda: 'COP', variacion_pct: null, confidence: 'confirmado' },
    ticket_promedio:  { valor: null, variacion_pct: null, confidence: 'confirmado' },
    cmv_pct:          { valor: null, variacion_pct: null, confidence: 'confirmado' },
    margen_bruto_pct: { valor: null, variacion_pct: null, confidence: 'confirmado' },
  },
  alertas_activas: { urgentes: 0, revisar: 0, info: 0 },
  tendencia_ventas: [],
  status: 'sin_datos',
  estado_pipeline: 'corriendo',
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const PERIODO_LABELS: Record<Periodo, string> = {
  hoy: 'Hoy',
  semana: 'Esta semana',
  mes: 'Este mes',
}

const ESTADO_LABELS: Record<UiEstado, string> = {
  normal: 'Normal',
  vacio:  'Sin datos',
  error:  'Error fuente',
  carga:  'Cargando',
}

function formatCOP(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000)     return `$${Math.round(v / 1_000)}K`
  return `$${v.toLocaleString('es-CO')}`
}

function formatPct(v: number): string {
  return `${v.toFixed(1)}%`
}

// v3: texto-solo, sin fondo relleno
function DeltaChip({ pct, inverse = false }: { pct: number | null; inverse?: boolean }) {
  if (pct === null) return null
  const positive = inverse ? pct < 0 : pct > 0
  const neutral = pct === 0
  const color = neutral ? 'var(--ink-30)' : positive ? 'var(--success-fg)' : 'var(--urgente)'
  const Icon  = neutral ? Minus : positive ? TrendingUp : TrendingDown
  const sign  = pct > 0 ? '+' : ''

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      fontSize: '0.6875rem', fontWeight: 500, fontFamily: 'var(--font-sans)',
      color, padding: '2px 0',
    }}>
      <Icon size={10} />
      {sign}{Math.abs(pct).toFixed(1)}%
    </span>
  )
}

function EstimadoMark() {
  return (
    <span title="Dato estimado — puede variar cuando lleguen todos los archivos" style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      fontSize: '0.625rem', fontWeight: 500, fontFamily: 'var(--font-sans)',
      color: 'var(--ink-55)', background: 'transparent',
      padding: '1px 0',
      border: 'none',
    }}>
      <CircleDashed size={9} />
      estimado
    </span>
  )
}

// ─── KPI CONFIG ───────────────────────────────────────────────────────────────

const KPI_META: Record<KpiKey, { label: string; format: (v: number) => string; invertDelta: boolean; cautionThreshold?: number }> = {
  ventas:           { label: 'Ventas',        format: formatCOP,  invertDelta: false },
  ticket_promedio:  { label: 'Ticket prom.',  format: formatCOP,  invertDelta: false },
  cmv_pct:          { label: 'CMV%',          format: formatPct,  invertDelta: true, cautionThreshold: 32 },
  margen_bruto_pct: { label: 'Margen bruto',  format: formatPct,  invertDelta: false },
}

// ─── KPI DESTACADO (grande, arriba) ───────────────────────────────────────────

function KpiDestacado({ kpiKey, kpi }: { kpiKey: KpiKey; kpi: KpiField }) {
  const meta = KPI_META[kpiKey]
  const noData = kpi.valor === null
  const overThreshold = meta.cautionThreshold !== undefined && kpi.valor !== null && kpi.valor > meta.cautionThreshold

  return (
    <div style={{
      background: 'var(--panel)',
      border: '1px solid var(--hairline)',
      borderLeft: `4px solid ${overThreshold ? 'var(--warning-fg)' : 'var(--terracota)'}`,
      padding: '24px 28px',
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{
        fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', fontWeight: 500,
        color: 'var(--ink-55)', textTransform: 'uppercase', letterSpacing: '0.08em',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        ↑ Métrica principal hoy
        {kpi.confidence === 'estimado' && <EstimadoMark />}
      </div>

      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--fg-tertiary)', fontWeight: 500 }}>
        {meta.label}
      </div>

      {noData ? (
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', color: 'var(--fg-tertiary)', fontStyle: 'italic' }}>
          Sin datos disponibles para este período.
        </div>
      ) : (
        <>
          <div style={{
            fontFamily: 'var(--font-sans)', fontSize: '2.25rem', fontWeight: 800,
            color: overThreshold ? 'var(--warning-fg)' : 'var(--ink)',
            lineHeight: 1, letterSpacing: '-0.02em',
          }}>
            {meta.format(kpi.valor!)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <DeltaChip pct={kpi.variacion_pct} inverse={meta.invertDelta} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--fg-tertiary)' }}>
              vs período anterior
            </span>
          </div>
        </>
      )}
    </div>
  )
}

// ─── KPI CARD SECUNDARIO (pequeño, fila) ──────────────────────────────────────

function KpiCard({ kpiKey, kpi }: { kpiKey: KpiKey; kpi: KpiField }) {
  const meta = KPI_META[kpiKey]
  const noData = kpi.valor === null
  const overThreshold = meta.cautionThreshold !== undefined && kpi.valor !== null && kpi.valor > meta.cautionThreshold

  return (
    <div style={{
      background: 'var(--panel)',
      border: '1px solid var(--hairline)',
      borderLeft: overThreshold ? '3px solid var(--warning-fg)' : '1px solid var(--hairline)',
      padding: '14px 16px',
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{
        fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', fontWeight: 500,
        color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em',
        display: 'flex', alignItems: 'center', gap: 5,
      }}>
        {meta.label}
        {kpi.confidence === 'estimado' && <EstimadoMark />}
      </div>

      {noData ? (
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--fg-tertiary)', fontStyle: 'italic' }}>
          Sin datos
        </div>
      ) : (
        <>
          <div style={{
            fontFamily: 'var(--font-sans)', fontSize: '1.125rem', fontWeight: 700,
            color: overThreshold ? 'var(--warning-500)' : 'var(--fg-primary)',
            lineHeight: 1, letterSpacing: '-0.01em',
          }}>
            {meta.format(kpi.valor!)}
          </div>
          <DeltaChip pct={kpi.variacion_pct} inverse={meta.invertDelta} />
        </>
      )}
    </div>
  )
}

// ─── ALERTAS BLOCK ────────────────────────────────────────────────────────────

function AlertasBlock({ alertas }: { alertas: ResumenData['alertas_activas'] }) {
  const total = alertas.urgentes + alertas.revisar + alertas.info
  if (total === 0) return null

  return (
    <Link href="/hoy" style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'var(--panel)',
        border: '1px solid var(--hairline)',
        borderLeft: `3px solid ${alertas.urgentes > 0 ? 'var(--urgente)' : 'var(--warning-fg)'}`,
        padding: '14px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        cursor: 'pointer',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <AlertTriangle size={16} color={alertas.urgentes > 0 ? 'var(--urgente)' : 'var(--warning-fg)'} style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--fg-primary)' }}>
              {total === 1 ? '1 alerta activa' : `${total} alertas activas`} que requieren atención
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 3 }}>
              {alertas.urgentes > 0 && (
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--urgente)', fontWeight: 500 }}>
                  {alertas.urgentes} urgente{alertas.urgentes > 1 ? 's' : ''}
                </span>
              )}
              {alertas.revisar > 0 && (
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--warning-fg)', fontWeight: 500 }}>
                  {alertas.revisar} a revisar
                </span>
              )}
              {alertas.info > 0 && (
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--ink-55)', fontWeight: 500 }}>
                  {alertas.info} informativas
                </span>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--fg-secondary)', whiteSpace: 'nowrap', flexShrink: 0 }}>
          Ver en Hoy <ChevronRight size={14} />
        </div>
      </div>
    </Link>
  )
}

// ─── TENDENCIA CHART ──────────────────────────────────────────────────────────

function TendenciaChart({ puntos, periodo }: { puntos: ResumenData['tendencia_ventas']; periodo: Periodo }) {
  if (puntos.length < 2) return null
  const valores = puntos.map(p => p.valor)
  const labels  = puntos.map(p => {
    const d = new Date(p.fecha)
    return periodo === 'mes'
      ? d.getDate().toString()
      : d.toLocaleDateString('es-CO', { weekday: 'short' }).slice(0, 3)
  })

  return (
    <div style={{
      background: 'var(--panel)',
      border: '1px solid var(--hairline)',
      padding: '18px 20px',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16,
      }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--fg-primary)' }}>
          Tendencia de ventas — {PERIODO_LABELS[periodo].toLowerCase()}
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--fg-secondary)' }}>
          {formatCOP(Math.max(...valores))} pico
        </div>
      </div>

      <div style={{ width: '100%', overflowX: 'hidden' }}>
        <Sparkline data={valores} width={640} height={72} />
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', marginTop: 8,
        paddingLeft: 4, paddingRight: 4,
      }}>
        {labels.map((l, i) => (
          <span key={i} style={{
            fontFamily: 'var(--font-sans)', fontSize: '0.625rem',
            color: 'var(--fg-tertiary)', textTransform: 'capitalize',
          }}>
            {l}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── LOADING STATE ────────────────────────────────────────────────────────────

function EstadoCarga() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: 340, gap: 20,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        border: '3px solid var(--primary-100)',
        borderTop: '3px solid var(--primary-600)',
        animation: 'spin 0.9s linear infinite',
      }} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--fg-primary)', marginBottom: 4 }}>
          Calculando el resumen…
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--fg-tertiary)' }}>
          Consolidando ventas, costos y márgenes del período
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────

function EstadoVacio({ periodo }: { periodo: Periodo }) {
  const msg: Record<Periodo, string> = {
    hoy:    'El día acaba de empezar — los datos del POS se consolidan a medida que avanza el servicio.',
    semana: 'No hay suficientes datos para esta semana todavía. Si Pikeo lleva menos de 3 días operando, esto es normal.',
    mes:    'El mes aún no tiene transacciones suficientes para mostrar tendencias confiables.',
  }
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: 300, gap: 14, textAlign: 'center', padding: '40px 0',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        background: 'var(--bg-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Info size={22} color="var(--fg-tertiary)" />
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--fg-primary)', marginBottom: 6 }}>
          Aún no hay datos para este período
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--fg-secondary)', maxWidth: 360, lineHeight: 1.65 }}>
          {msg[periodo]}
        </div>
      </div>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontFamily: 'var(--font-sans)', fontSize: '0.75rem',
        color: 'var(--fg-tertiary)', background: 'var(--bg-surface-2)',
        padding: '5px 12px', borderRadius: 'var(--radius-full)',
      }}>
        <Info size={11} />
        Sin datos no es un error — es el período sin información todavía.
      </div>
    </div>
  )
}

// ─── ERROR STATE ──────────────────────────────────────────────────────────────

function EstadoError({ kpis }: { kpis: ResumenData['kpis'] }) {
  const faltantes = Object.entries(kpis)
    .filter(([, v]) => v.valor === null)
    .map(([k]) => ({ ventas: 'Ventas', ticket_promedio: 'Ticket promedio', cmv_pct: 'CMV%', margen_bruto_pct: 'Margen bruto' }[k]))
  return (
    <div style={{
      background: 'var(--panel)', border: '1px solid var(--hairline)',
      borderLeft: '3px solid var(--urgente)', padding: '16px 20px',
      display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 20,
    }}>
      <WifiOff size={16} color="var(--urgente)" style={{ marginTop: 1, flexShrink: 0 }} />
      <div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--fg-primary)', marginBottom: 4 }}>
          Algunos datos no pudieron sincronizarse
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--fg-secondary)', lineHeight: 1.55 }}>
          Las métricas disponibles se muestran abajo. Los campos marcados como "Sin datos" necesitan que se vuelva a cargar la fuente (Loggro o el archivo maestro de gastos).
        </div>
        {faltantes.length > 0 && (
          <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {faltantes.map(f => (
              <span key={f} style={{
                fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', fontWeight: 500,
                color: 'var(--urgente)',
                padding: '2px 0',
                border: 'none', background: 'transparent',
              }}>
                {f} — sin datos
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── PERIOD SELECTOR ─────────────────────────────────────────────────────────

function PeriodoSelector({ value, onChange }: { value: Periodo; onChange: (p: Periodo) => void }) {
  return (
    <div style={{ display: 'flex', gap: 2, border: '1px solid var(--hairline)', padding: 2 }}>
      {(['hoy', 'semana', 'mes'] as Periodo[]).map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          style={{
            fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 500,
            padding: '6px 14px', borderRadius: 'calc(var(--radius-sm) - 2px)',
            background: value === p ? 'var(--ink)' : 'transparent',
            color: value === p ? '#ffffff' : 'var(--ink-55)',
            border: 'none',
            cursor: 'pointer', transition: 'all 0.12s ease',
          }}
        >
          {PERIODO_LABELS[p]}
        </button>
      ))}
    </div>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

function ResumenPageInner() {
  const searchParams = useSearchParams()
  const isDevMode = searchParams.get('dev') === 'true'

  const [uiEstado, setUiEstado] = useState<UiEstado>('normal')
  const [periodo, setPeriodo] = useState<Periodo>('semana')

  const data = uiEstado === 'normal' ? MOCK_NORMAL
    : uiEstado === 'vacio'  ? MOCK_VACIO
    : uiEstado === 'error'  ? MOCK_ERROR
    : MOCK_CARGA

  const isLoading  = data.estado_pipeline === 'corriendo'
  const isError    = data.estado_pipeline === 'error'
  const isEmpty    = data.estado_pipeline === 'completado' && data.status === 'sin_datos' && !isError
  const hasData    = data.estado_pipeline === 'completado' && data.status !== 'sin_datos'

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-page)' }}>

      {/* Dev switcher — /dashboard?dev=true only */}
      {isDevMode && (
        <div style={{
          position: 'sticky', top: 0, zIndex: 10,
          background: 'var(--neutral-950)', padding: '8px 28px',
          display: 'flex', alignItems: 'center', gap: 10,
          borderBottom: '1px solid var(--neutral-800)',
        }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', color: 'var(--neutral-400)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Estado · DEV
          </span>
          {(Object.keys(ESTADO_LABELS) as UiEstado[]).map(e => (
            <button key={e} onClick={() => setUiEstado(e)} style={{
              fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 500,
              padding: '4px 10px', borderRadius: 'var(--radius-full)',
              background: uiEstado === e ? 'var(--primary-600)' : 'var(--neutral-800)',
              color: uiEstado === e ? 'white' : 'var(--neutral-400)',
              border: 'none', cursor: 'pointer', transition: 'background 0.15s',
            }}>
              {ESTADO_LABELS[e]}
            </button>
          ))}
        </div>
      )}

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 28px 60px' }}>

        {/* ── HEADER ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-sans)', fontSize: '1.375rem', fontWeight: 700,
              color: 'var(--fg-primary)', margin: '0 0 4px',
            }}>
              Resumen
            </h1>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--fg-tertiary)' }}>
              Salud general de Pikeo — {PERIODO_LABELS[periodo].toLowerCase()}
            </div>
          </div>
          <PeriodoSelector value={periodo} onChange={setPeriodo} />
        </div>

        {/* ── ALERTAS ACTIVAS (siempre arriba si hay) ── */}
        {!isLoading && data.alertas_activas.urgentes + data.alertas_activas.revisar + data.alertas_activas.info > 0 && (
          <div style={{ marginBottom: 20 }}>
            <AlertasBlock alertas={data.alertas_activas} />
          </div>
        )}

        {/* ── BANNER ERROR FUENTE ── */}
        {isError && <EstadoError kpis={data.kpis} />}

        {/* ── LOADING ── */}
        {isLoading && <EstadoCarga />}

        {/* ── EMPTY ── */}
        {isEmpty && <EstadoVacio periodo={periodo} />}

        {/* ── KPI GRID (normal + error parcial) ── */}
        {(hasData || isError) && !isLoading && (
          <>
            {/* KPI destacado — arriba, grande */}
            <div style={{ marginBottom: 16 }}>
              <KpiDestacado kpiKey={data.kpi_destacado} kpi={data.kpis[data.kpi_destacado]} />
            </div>

            {/* KPIs secundarios — fila */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 10, marginBottom: 20,
            }}>
              {(Object.keys(data.kpis) as KpiKey[])
                .filter(k => k !== data.kpi_destacado)
                .map(k => (
                  <KpiCard key={k} kpiKey={k} kpi={data.kpis[k]} />
                ))
              }
            </div>

            {/* ── TENDENCIA CHART ── */}
            {data.tendencia_ventas.length >= 2 && (
              <div style={{ marginBottom: 20 }}>
                <TendenciaChart puntos={data.tendencia_ventas} periodo={periodo} />
              </div>
            )}

            {/* ── FOOTER CONTEXT ── */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--fg-tertiary)',
            }}>
              <RefreshCw size={12} />
              Último análisis: hoy a las 08:05 · Fuentes: Loggro, Bancolombia, Archivo maestro
            </div>
          </>
        )}

      </div>
    </div>
  )
}

export default function ResumenPage() {
  return (
    <React.Suspense fallback={null}>
      <ResumenPageInner />
    </React.Suspense>
  )
}

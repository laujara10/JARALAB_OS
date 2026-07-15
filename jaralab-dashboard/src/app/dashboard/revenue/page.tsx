'use client'
import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Sparkline } from '@/components/ui/data/Sparkline'
import { BarChart } from '@/components/ui/data/BarChart'
import { Table, Column } from '@/components/ui/data/Table'
import { Badge } from '@/components/ui/core/Badge'
import { Topbar } from '@/components/layout/Topbar'
import {
  TrendingUp, TrendingDown, Minus, WifiOff, RefreshCw,
  Users, Utensils, CreditCard, Info,
} from 'lucide-react'

// ─── JSON CONTRACT ────────────────────────────────────────────────────────────
// GET /api/ventas?periodo=hoy|semana|mes
// {
//   periodo: { tipo: 'hoy'|'semana'|'mes', fecha_inicio: string, fecha_fin: string },
//   resumen: {
//     ventas_total: number | null,
//     moneda: string,
//     variacion_pct: number | null,
//     cubiertos: number | null,
//     ticket_promedio: number | null,
//     ticket_variacion_pct: number | null,
//     confidence: 'confirmado' | 'estimado',
//   },
//   tendencia: Array<{ fecha: string; valor: number }>,
//   por_canal: Array<{ canal: string; valor: number; pct: number }>,
//   por_metodo: Array<{ metodo: string; valor: number; pct: number }>,
//   mejores_dias: Array<{
//     label: string; ventas: number; cubiertos: number;
//     ticket_promedio: number; variacion_pct: number | null;
//   }>,
//   insight: string | null,   // frase clave generada por el motor Python
//   estado_pipeline: 'completado' | 'corriendo' | 'error',
//   status: 'ok' | 'atencion' | 'sin_datos',
// }

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Periodo = 'hoy' | 'semana' | 'mes'
type UiEstado = 'normal' | 'vacio' | 'error' | 'carga'
type Confidence = 'confirmado' | 'estimado'

interface VentasResumen {
  ventas_total: number | null
  moneda: string
  variacion_pct: number | null
  cubiertos: number | null
  ticket_promedio: number | null
  ticket_variacion_pct: number | null
  confidence: Confidence
}

interface MejorDia {
  label: string
  ventas: number
  cubiertos: number
  ticket_promedio: number
  variacion_pct: number | null
}

interface VentasData {
  periodo: { tipo: Periodo; fecha_inicio: string; fecha_fin: string }
  resumen: VentasResumen
  tendencia: Array<{ fecha: string; valor: number }>
  por_canal: Array<{ canal: string; valor: number; pct: number }>
  por_metodo: Array<{ metodo: string; valor: number; pct: number }>
  mejores_dias: MejorDia[]
  insight: string | null
  estado_pipeline: 'completado' | 'corriendo' | 'error'
  status: 'ok' | 'atencion' | 'sin_datos'
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const MOCK_NORMAL: VentasData = {
  periodo: { tipo: 'semana', fecha_inicio: '2026-07-07', fecha_fin: '2026-07-13' },
  resumen: {
    ventas_total: 588470,
    moneda: 'COP',
    variacion_pct: 6.2,
    cubiertos: 1428,
    ticket_promedio: 42300,
    ticket_variacion_pct: -1.4,
    confidence: 'confirmado',
  },
  tendencia: [
    { fecha: '2026-07-07', valor: 71200 },
    { fecha: '2026-07-08', valor: 68400 },
    { fecha: '2026-07-09', valor: 95300 },
    { fecha: '2026-07-10', valor: 88100 },
    { fecha: '2026-07-11', valor: 76200 },
    { fecha: '2026-07-12', valor: 102800 },
    { fecha: '2026-07-13', valor: 86470 },
  ],
  por_canal: [
    { canal: 'Mesa',        valor: 318013, pct: 54 },
    { canal: 'Domicilio',   valor: 176541, pct: 30 },
    { canal: 'Para llevar', valor: 70616,  pct: 12 },
    { canal: 'Bar',         valor: 23300,  pct: 4  },
  ],
  por_metodo: [
    { metodo: 'Tarjeta',       valor: 388389, pct: 66 },
    { metodo: 'Efectivo',      valor: 117694, pct: 20 },
    { metodo: 'Transferencia', valor: 82387,  pct: 14 },
  ],
  mejores_dias: [
    { label: 'Sábado 12 jul',   ventas: 102800, cubiertos: 286, ticket_promedio: 47200, variacion_pct: 12.4  },
    { label: 'Jueves 9 jul',    ventas: 95300,  cubiertos: 264, ticket_promedio: 46100, variacion_pct: 8.1   },
    { label: 'Viernes 10 jul',  ventas: 88100,  cubiertos: 238, ticket_promedio: 43800, variacion_pct: -1.2  },
    { label: 'Domingo 13 jul',  ventas: 86470,  cubiertos: 212, ticket_promedio: 42800, variacion_pct: 3.6   },
    { label: 'Lunes 7 jul',     ventas: 71200,  cubiertos: 182, ticket_promedio: 40100, variacion_pct: -4.1  },
  ],
  insight: 'El sábado 12 rompió el récord semanal. El ticket promedio bajó 1.4% — revisar si domicilio está arrastrando el promedio.',
  estado_pipeline: 'completado',
  status: 'atencion',
}

const MOCK_VACIO: VentasData = {
  periodo: { tipo: 'hoy', fecha_inicio: '2026-07-14', fecha_fin: '2026-07-14' },
  resumen: { ventas_total: null, moneda: 'COP', variacion_pct: null, cubiertos: null, ticket_promedio: null, ticket_variacion_pct: null, confidence: 'confirmado' },
  tendencia: [],
  por_canal: [],
  por_metodo: [],
  mejores_dias: [],
  insight: null,
  estado_pipeline: 'completado',
  status: 'sin_datos',
}

const MOCK_ERROR: VentasData = {
  periodo: { tipo: 'semana', fecha_inicio: '2026-07-07', fecha_fin: '2026-07-13' },
  resumen: { ventas_total: 588470, moneda: 'COP', variacion_pct: 6.2, cubiertos: null, ticket_promedio: null, ticket_variacion_pct: null, confidence: 'estimado' },
  tendencia: [
    { fecha: '2026-07-07', valor: 71200 },
    { fecha: '2026-07-08', valor: 68400 },
    { fecha: '2026-07-09', valor: 95300 },
  ],
  por_canal: [],
  por_metodo: [],
  mejores_dias: [],
  insight: null,
  estado_pipeline: 'error',
  status: 'atencion',
}

const MOCK_CARGA: VentasData = {
  periodo: { tipo: 'semana', fecha_inicio: '2026-07-07', fecha_fin: '2026-07-13' },
  resumen: { ventas_total: null, moneda: 'COP', variacion_pct: null, cubiertos: null, ticket_promedio: null, ticket_variacion_pct: null, confidence: 'confirmado' },
  tendencia: [],
  por_canal: [],
  por_metodo: [],
  mejores_dias: [],
  insight: null,
  estado_pipeline: 'corriendo',
  status: 'sin_datos',
}

const MOCK_MAP: Record<UiEstado, VentasData> = {
  normal: MOCK_NORMAL,
  vacio: MOCK_VACIO,
  error: MOCK_ERROR,
  carga: MOCK_CARGA,
}

const ESTADO_LABELS: Record<UiEstado, string> = {
  normal: 'Normal',
  vacio:  'Sin datos',
  error:  'Error fuente',
  carga:  'Cargando',
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const PERIODO_LABELS: Record<Periodo, string> = {
  hoy: 'Hoy', semana: 'Esta semana', mes: 'Este mes',
}

function formatCOP(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000)     return `$${Math.round(v / 1_000)}K`
  return `$${v.toLocaleString('es-CO')}`
}

function formatPct(v: number | null, sign = true): string {
  if (v === null) return '—'
  const prefix = sign && v > 0 ? '+' : ''
  return `${prefix}${v.toFixed(1)}%`
}

function deltaColor(v: number | null, invert = false): string {
  if (v === null || v === 0) return 'var(--ink-30)'
  const good = invert ? v < 0 : v > 0
  return good ? 'var(--success-fg)' : 'var(--urgente)'
}

function deltaIcon(v: number | null, invert = false) {
  if (v === null || v === 0) return <Minus size={11} />
  const good = invert ? v < 0 : v > 0
  return good ? <TrendingUp size={11} /> : <TrendingDown size={11} />
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function PeriodoSelector({ value, onChange }: { value: Periodo; onChange: (p: Periodo) => void }) {
  return (
    <div style={{ display: 'flex', gap: 2, border: '1px solid var(--hairline)', padding: 2 }}>
      {(['hoy', 'semana', 'mes'] as Periodo[]).map(p => (
        <button key={p} onClick={() => onChange(p)} style={{
          fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 500,
          padding: '6px 14px', border: 'none',
          background: value === p ? 'var(--ink)' : 'transparent',
          color: value === p ? '#fff' : 'var(--ink-55)',
          cursor: 'pointer', transition: 'all 0.12s ease',
        }}>
          {PERIODO_LABELS[p]}
        </button>
      ))}
    </div>
  )
}

// Hero KPI — número grande en Fraunces, momento editorial de la pantalla
function HeroVentas({ resumen, periodo }: { resumen: VentasResumen; periodo: Periodo }) {
  const noData = resumen.ventas_total === null
  return (
    <div style={{
      background: 'var(--panel)', border: '1px solid var(--hairline)',
      padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{
        fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', fontWeight: 500,
        color: 'var(--ink-55)', textTransform: 'uppercase', letterSpacing: '0.08em',
      }}>
        Ventas — {PERIODO_LABELS[periodo].toLowerCase()}
        {resumen.confidence === 'estimado' && (
          <span style={{ marginLeft: 8, color: 'var(--ink-30)' }}>· estimado</span>
        )}
      </div>

      {noData ? (
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: '3rem', fontStyle: 'italic',
          color: 'var(--ink-30)', lineHeight: 1,
        }}>
          Sin datos
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '3.5rem', fontStyle: 'italic',
            color: 'var(--ink)', lineHeight: 1, letterSpacing: '-0.01em',
          }}>
            {formatCOP(resumen.ventas_total!)}
          </div>
          {resumen.variacion_pct !== null && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4,
              color: deltaColor(resumen.variacion_pct),
              fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', fontWeight: 500,
            }}>
              {deltaIcon(resumen.variacion_pct)}
              {formatPct(resumen.variacion_pct)} vs período anterior
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function KpiRow({ resumen }: { resumen: VentasResumen }) {
  const items = [
    {
      label: 'Cubiertos',
      value: resumen.cubiertos !== null ? resumen.cubiertos.toLocaleString('es-CO') : '—',
      icon: <Users size={14} color="var(--ink-30)" />,
    },
    {
      label: 'Ticket promedio',
      value: resumen.ticket_promedio !== null ? formatCOP(resumen.ticket_promedio) : '—',
      delta: resumen.ticket_variacion_pct,
      icon: <Utensils size={14} color="var(--ink-30)" />,
    },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
      {items.map(it => (
        <div key={it.label} style={{
          background: 'var(--panel)', border: '1px solid var(--hairline)',
          padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 500,
            color: 'var(--ink-55)', textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            {it.icon}
            {it.label}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '1.375rem', fontWeight: 600,
              color: 'var(--ink)', fontVariantNumeric: 'tabular-nums',
            }}>
              {it.value}
            </span>
            {'delta' in it && it.delta !== undefined && it.delta !== null && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 3,
                fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 500,
                color: deltaColor(it.delta, it.label === 'CMV%'),
              }}>
                {deltaIcon(it.delta)}
                {formatPct(it.delta)}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function TendenciaSection({ puntos, periodo }: { puntos: VentasData['tendencia']; periodo: Periodo }) {
  if (puntos.length < 2) return null
  const valores = puntos.map(p => p.valor)
  const labels = puntos.map(p => {
    const d = new Date(p.fecha)
    return periodo === 'mes'
      ? d.getDate().toString()
      : d.toLocaleDateString('es-CO', { weekday: 'short' }).slice(0, 3)
  })
  const pico = Math.max(...valores)
  const picoDia = labels[valores.indexOf(pico)]

  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--hairline)', padding: '20px 24px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 18,
      }}>
        <div style={{
          fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 600,
          color: 'var(--ink)',
        }}>
          Tendencia de ventas
        </div>
        <div style={{
          fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--ink-55)',
        }}>
          Pico: <strong style={{ color: 'var(--ink)' }}>{formatCOP(pico)}</strong> ({picoDia})
        </div>
      </div>
      <Sparkline data={valores} width={760} height={80} />
      <div style={{
        display: 'flex', justifyContent: 'space-between', marginTop: 8,
        paddingLeft: 4, paddingRight: 4,
      }}>
        {labels.map((l, i) => (
          <span key={i} style={{
            fontFamily: 'var(--font-sans)', fontSize: '0.625rem',
            color: 'var(--ink-30)', textTransform: 'capitalize',
          }}>
            {l}
          </span>
        ))}
      </div>
    </div>
  )
}

function DesgloseCanal({ canal, metodo }: { canal: VentasData['por_canal']; metodo: VentasData['por_metodo'] }) {
  if (!canal.length && !metodo.length) return null

  function BarList({ items, color }: { items: { label: string; valor: number; pct: number }[]; color: string }) {
    const max = Math.max(...items.map(i => i.valor))
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(it => (
          <div key={it.label}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              marginBottom: 5,
            }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--ink-55)' }}>
                {it.label}
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.8125rem',
                color: 'var(--ink)', fontVariantNumeric: 'tabular-nums',
              }}>
                {formatCOP(it.valor)} <span style={{ color: 'var(--ink-30)', fontSize: '0.75rem' }}>({it.pct}%)</span>
              </span>
            </div>
            <div style={{ height: 4, background: 'var(--hairline)' }}>
              <div style={{
                height: '100%',
                width: `${(it.valor / max) * 100}%`,
                background: color,
                transition: 'width 0.4s var(--ease-out)',
              }} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {canal.length > 0 && (
        <div style={{ background: 'var(--panel)', border: '1px solid var(--hairline)', padding: '20px 24px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20,
            fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink)',
          }}>
            <Utensils size={14} color="var(--ink-30)" />
            Por canal
          </div>
          <BarList items={canal.map(c => ({ label: c.canal, valor: c.valor, pct: c.pct }))} color="var(--terracota)" />
        </div>
      )}
      {metodo.length > 0 && (
        <div style={{ background: 'var(--panel)', border: '1px solid var(--hairline)', padding: '20px 24px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20,
            fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink)',
          }}>
            <CreditCard size={14} color="var(--ink-30)" />
            Por método de pago
          </div>
          <BarList items={metodo.map(m => ({ label: m.metodo, valor: m.valor, pct: m.pct }))} color="var(--teal)" />
        </div>
      )}
    </div>
  )
}

interface DiaRow { label: string; ventas: string; cubiertos: string; ticket: string; var_pct: React.ReactNode; [key: string]: React.ReactNode }

function MejoresDiasTable({ dias }: { dias: MejorDia[] }) {
  if (!dias.length) return null

  const rows: DiaRow[] = dias.map(d => ({
    label: d.label,
    ventas: formatCOP(d.ventas),
    cubiertos: d.cubiertos.toString(),
    ticket: formatCOP(d.ticket_promedio),
    var_pct: (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 3,
        fontFamily: 'var(--font-sans)', fontSize: '0.8125rem',
        color: deltaColor(d.variacion_pct),
      }}>
        {deltaIcon(d.variacion_pct)}
        {formatPct(d.variacion_pct)}
      </span>
    ),
  }))

  const cols: Column<DiaRow>[] = [
    { key: 'label',    label: 'Día' },
    { key: 'ventas',   label: 'Ventas',         align: 'right', mono: true },
    { key: 'cubiertos',label: 'Cubiertos',      align: 'right', mono: true },
    { key: 'ticket',   label: 'Ticket prom.',   align: 'right', mono: true },
    { key: 'var_pct',  label: 'vs. anterior',   align: 'right' },
  ]

  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--hairline)' }}>
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid var(--hairline)',
        fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink)',
      }}>
        Mejores días del período
      </div>
      <Table columns={cols} rows={rows} />
    </div>
  )
}

function InsightBlock({ text }: { text: string }) {
  return (
    <div style={{
      background: 'var(--panel)', border: '1px solid var(--hairline)',
      borderLeft: '3px solid var(--terracota)',
      padding: '14px 20px',
      display: 'flex', alignItems: 'flex-start', gap: 10,
    }}>
      <Info size={14} color="var(--terracota)" style={{ marginTop: 2, flexShrink: 0 }} />
      <div style={{
        fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--ink)',
        lineHeight: 1.6,
      }}>
        {text}
      </div>
    </div>
  )
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────

function EstadoVacio({ periodo }: { periodo: Periodo }) {
  const msg: Record<Periodo, string> = {
    hoy:    'El servicio de hoy aún no tiene transacciones registradas. Los datos del POS se consolidan a medida que avanza el día.',
    semana: 'No hay datos de ventas para esta semana todavía.',
    mes:    'El mes aún no tiene suficientes transacciones para mostrar tendencias.',
  }
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: 300, gap: 14, textAlign: 'center', padding: '48px 0',
    }}>
      <div style={{
        width: 48, height: 48,
        border: '1px solid var(--hairline)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <TrendingUp size={20} color="var(--ink-30)" />
      </div>
      <div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontStyle: 'italic',
          color: 'var(--ink)', marginBottom: 8,
        }}>
          Sin ventas para este período
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--ink-55)', maxWidth: 380, lineHeight: 1.65 }}>
          {msg[periodo]}
        </div>
      </div>
    </div>
  )
}

// ─── ERROR STATE ──────────────────────────────────────────────────────────────

function ErrorBanner() {
  return (
    <div style={{
      background: 'var(--panel)', border: '1px solid var(--hairline)',
      borderLeft: '3px solid var(--urgente)',
      padding: '14px 20px', marginBottom: 20,
      display: 'flex', gap: 10, alignItems: 'flex-start',
    }}>
      <WifiOff size={14} color="var(--urgente)" style={{ marginTop: 2, flexShrink: 0 }} />
      <div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>
          Datos de desglose no disponibles
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--ink-55)', lineHeight: 1.55 }}>
          Las ventas totales se muestran abajo. Cubiertos, canal y método de pago requieren que se vuelva a cargar el reporte de Loggro.
        </div>
      </div>
    </div>
  )
}

// ─── LOADING STATE ────────────────────────────────────────────────────────────

function EstadoCarga() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: 320, gap: 20,
    }}>
      <div style={{
        width: 44, height: 44,
        border: '2px solid var(--hairline)',
        borderTop: '2px solid var(--terracota)',
        borderRadius: '50%',
        animation: 'spin 0.9s linear infinite',
      }} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
          Consolidando ventas…
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--ink-55)' }}>
          Cruzando Loggro con el extracto bancario
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

function VentasPageInner() {
  const searchParams = useSearchParams()
  const isDevMode = searchParams.get('dev') === 'true'

  const [uiEstado, setUiEstado] = useState<UiEstado>('normal')
  const [periodo, setPeriodo] = useState<Periodo>('semana')

  const data = MOCK_MAP[uiEstado]
  const isLoading = data.estado_pipeline === 'corriendo'
  const isError   = data.estado_pipeline === 'error'
  const isEmpty   = data.estado_pipeline === 'completado' && data.status === 'sin_datos'
  const hasData   = data.estado_pipeline === 'completado' && data.status !== 'sin_datos'

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)' }}>
      <Topbar title="Ventas" />

      {/* Dev switcher */}
      {isDevMode && (
        <div style={{
          background: 'var(--ink)', padding: '8px 28px',
          display: 'flex', alignItems: 'center', gap: 10,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Estado · DEV
          </span>
          {(Object.keys(ESTADO_LABELS) as UiEstado[]).map(e => (
            <button key={e} onClick={() => setUiEstado(e)} style={{
              fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 500,
              padding: '4px 10px',
              background: uiEstado === e ? 'var(--terracota)' : 'rgba(255,255,255,0.08)',
              color: uiEstado === e ? '#fff' : 'rgba(255,255,255,0.5)',
              border: 'none', cursor: 'pointer',
            }}>
              {ESTADO_LABELS[e]}
            </button>
          ))}
        </div>
      )}

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 28px 60px' }}>

        {/* ── HEADER ── */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          gap: 16, marginBottom: 24, flexWrap: 'wrap',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-sans)', fontSize: '0.75rem',
              color: 'var(--ink-55)', marginBottom: 4,
            }}>
              {data.periodo.fecha_inicio} — {data.periodo.fecha_fin}
            </div>
          </div>
          <PeriodoSelector value={periodo} onChange={setPeriodo} />
        </div>

        {/* ── LOADING ── */}
        {isLoading && <EstadoCarga />}

        {/* ── ERROR BANNER ── */}
        {isError && <ErrorBanner />}

        {/* ── EMPTY ── */}
        {isEmpty && <EstadoVacio periodo={periodo} />}

        {/* ── CONTENIDO PRINCIPAL ── */}
        {(hasData || isError) && !isLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* HERO número de ventas */}
            <HeroVentas resumen={data.resumen} periodo={periodo} />

            {/* KPIs secundarios */}
            <KpiRow resumen={data.resumen} />

            {/* Insight del motor */}
            {data.insight && <InsightBlock text={data.insight} />}

            {/* Tendencia */}
            {data.tendencia.length >= 2 && (
              <TendenciaSection puntos={data.tendencia} periodo={periodo} />
            )}

            {/* Desglose canal + método */}
            <DesgloseCanal canal={data.por_canal} metodo={data.por_metodo} />

            {/* Tabla mejores días */}
            <MejoresDiasTable dias={data.mejores_dias} />

            {/* Fuente */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--ink-30)',
              paddingTop: 4,
            }}>
              <RefreshCw size={11} />
              Último análisis: hoy a las 08:05 · Fuente: Loggro + Bancolombia
            </div>

          </div>
        )}

      </div>
    </div>
  )
}

export default function VentasPage() {
  return (
    <React.Suspense fallback={null}>
      <VentasPageInner />
    </React.Suspense>
  )
}

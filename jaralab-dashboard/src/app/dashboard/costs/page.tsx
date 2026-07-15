'use client'
import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Sparkline } from '@/components/ui/data/Sparkline'
import { Table, Column } from '@/components/ui/data/Table'
import { Topbar } from '@/components/layout/Topbar'
import {
  TrendingUp, TrendingDown, Minus, WifiOff,
  RefreshCw, AlertTriangle, ShoppingCart, Users2, Info,
} from 'lucide-react'

// ─── JSON CONTRACT ────────────────────────────────────────────────────────────
// GET /api/costos?periodo=hoy|semana|mes
// {
//   periodo: { tipo: 'hoy'|'semana'|'mes', fecha_inicio: string, fecha_fin: string },
//   resumen: {
//     cmv_pct: number | null,           // Costo materia prima / ventas
//     cmv_pct_objetivo: number | null,
//     personal_pct: number | null,      // Nómina / ventas
//     personal_pct_objetivo: number | null,
//     ocupacion_pct: number | null,     // Arriendo + servicios / ventas
//     prime_cost_pct: number | null,    // cmv_pct + personal_pct
//     ventas_base: number | null,       // ventas del período (para calcular %s)
//     confidence: 'confirmado' | 'estimado',
//   },
//   tendencia_cmv: Array<{ fecha: string; valor: number }>,      // % semanal 8 semanas
//   tendencia_personal: Array<{ fecha: string; valor: number }>, // % semanal 8 semanas
//   proveedores: Array<{
//     nombre: string;
//     categoria: string;
//     gastado: number;
//     presupuesto: number | null;
//     varianza: number | null;          // gastado - presupuesto
//   }>,
//   por_categoria: Array<{ categoria: string; valor: number; pct: number }>,
//   alertas: Array<{ mensaje: string; tipo: 'urgente'|'atencion'|'info' }>,
//   insight: string | null,
//   estado_pipeline: 'completado' | 'corriendo' | 'error',
//   status: 'ok' | 'atencion' | 'sin_datos',
// }

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Periodo = 'hoy' | 'semana' | 'mes'
type UiEstado = 'normal' | 'vacio' | 'error' | 'carga'
type Confidence = 'confirmado' | 'estimado'

interface CostosResumen {
  cmv_pct: number | null
  cmv_pct_objetivo: number | null
  personal_pct: number | null
  personal_pct_objetivo: number | null
  ocupacion_pct: number | null
  prime_cost_pct: number | null
  ventas_base: number | null
  confidence: Confidence
}

interface Proveedor {
  nombre: string
  categoria: string
  gastado: number
  presupuesto: number | null
  varianza: number | null
}

interface CostosAlerta {
  mensaje: string
  tipo: 'urgente' | 'atencion' | 'info'
}

interface CostosData {
  periodo: { tipo: Periodo; fecha_inicio: string; fecha_fin: string }
  resumen: CostosResumen
  tendencia_cmv: Array<{ fecha: string; valor: number }>
  tendencia_personal: Array<{ fecha: string; valor: number }>
  proveedores: Proveedor[]
  por_categoria: Array<{ categoria: string; valor: number; pct: number }>
  alertas: CostosAlerta[]
  insight: string | null
  estado_pipeline: 'completado' | 'corriendo' | 'error'
  status: 'ok' | 'atencion' | 'sin_datos'
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const MOCK_NORMAL: CostosData = {
  periodo: { tipo: 'mes', fecha_inicio: '2026-07-01', fecha_fin: '2026-07-13' },
  resumen: {
    cmv_pct: 29.8, cmv_pct_objetivo: 28.0,
    personal_pct: 31.2, personal_pct_objetivo: 32.0,
    ocupacion_pct: 8.2,
    prime_cost_pct: 61.0,
    ventas_base: 588470,
    confidence: 'estimado',
  },
  tendencia_cmv:      [
    { fecha: '2026-05-26', valor: 27.2 },
    { fecha: '2026-06-02', valor: 27.8 },
    { fecha: '2026-06-09', valor: 28.4 },
    { fecha: '2026-06-16', valor: 28.1 },
    { fecha: '2026-06-23', valor: 28.9 },
    { fecha: '2026-06-30', valor: 29.2 },
    { fecha: '2026-07-07', valor: 29.8 },
  ],
  tendencia_personal: [
    { fecha: '2026-05-26', valor: 33.1 },
    { fecha: '2026-06-02', valor: 32.8 },
    { fecha: '2026-06-09', valor: 32.1 },
    { fecha: '2026-06-16', valor: 31.8 },
    { fecha: '2026-06-23', valor: 31.5 },
    { fecha: '2026-06-30', valor: 31.4 },
    { fecha: '2026-07-07', valor: 31.2 },
  ],
  proveedores: [
    { nombre: 'Local Farms Co-op', categoria: 'Verduras',  gastado: 6120, presupuesto: 5000, varianza: 1120  },
    { nombre: 'Sysco Colombia',    categoria: 'Proteínas', gastado: 4280, presupuesto: 4500, varianza: -220  },
    { nombre: 'Alpina',            categoria: 'Lácteos',   gastado: 3210, presupuesto: 3200, varianza: 10    },
    { nombre: 'Distribuidora X',   categoria: 'Secos',     gastado: 2910, presupuesto: 3000, varianza: -90   },
    { nombre: 'Bavaria',           categoria: 'Bebidas',   gastado: 2180, presupuesto: 2000, varianza: 180   },
  ],
  por_categoria: [
    { categoria: 'Verduras',  valor: 6120, pct: 22 },
    { categoria: 'Proteínas', valor: 4280, pct: 16 },
    { categoria: 'Lácteos',   valor: 3210, pct: 12 },
    { categoria: 'Secos',     valor: 2910, pct: 11 },
    { categoria: 'Bebidas',   valor: 2180, pct: 8  },
    { categoria: 'Otros',     valor: 1840, pct: 7  },
  ],
  alertas: [
    { mensaje: 'CMV 1.8 puntos sobre objetivo — verduras y bebidas sobrepasaron presupuesto.', tipo: 'atencion' },
  ],
  insight: 'El prime cost está en 61% — dentro del rango estándar para restaurantes (55-65%). El CMV lleva 7 semanas subiendo; el driver es verduras. Personal, en cambio, bajó 1.9pt desde mayo.',
  estado_pipeline: 'completado',
  status: 'atencion',
}

const MOCK_VACIO: CostosData = {
  periodo: { tipo: 'hoy', fecha_inicio: '2026-07-14', fecha_fin: '2026-07-14' },
  resumen: { cmv_pct: null, cmv_pct_objetivo: 28.0, personal_pct: null, personal_pct_objetivo: 32.0, ocupacion_pct: null, prime_cost_pct: null, ventas_base: null, confidence: 'confirmado' },
  tendencia_cmv: [], tendencia_personal: [], proveedores: [], por_categoria: [], alertas: [],
  insight: null, estado_pipeline: 'completado', status: 'sin_datos',
}

const MOCK_ERROR: CostosData = {
  periodo: { tipo: 'mes', fecha_inicio: '2026-07-01', fecha_fin: '2026-07-13' },
  resumen: { cmv_pct: 29.8, cmv_pct_objetivo: 28.0, personal_pct: null, personal_pct_objetivo: 32.0, ocupacion_pct: null, prime_cost_pct: null, ventas_base: 588470, confidence: 'estimado' },
  tendencia_cmv: [
    { fecha: '2026-06-30', valor: 29.2 },
    { fecha: '2026-07-07', valor: 29.8 },
  ],
  tendencia_personal: [], proveedores: [], por_categoria: [], alertas: [],
  insight: null, estado_pipeline: 'error', status: 'atencion',
}

const MOCK_CARGA: CostosData = {
  periodo: { tipo: 'mes', fecha_inicio: '2026-07-01', fecha_fin: '2026-07-13' },
  resumen: { cmv_pct: null, cmv_pct_objetivo: 28.0, personal_pct: null, personal_pct_objetivo: 32.0, ocupacion_pct: null, prime_cost_pct: null, ventas_base: null, confidence: 'confirmado' },
  tendencia_cmv: [], tendencia_personal: [], proveedores: [], por_categoria: [], alertas: [],
  insight: null, estado_pipeline: 'corriendo', status: 'sin_datos',
}

const MOCK_MAP: Record<UiEstado, CostosData> = {
  normal: MOCK_NORMAL, vacio: MOCK_VACIO, error: MOCK_ERROR, carga: MOCK_CARGA,
}

const ESTADO_LABELS: Record<UiEstado, string> = {
  normal: 'Normal', vacio: 'Sin datos', error: 'Error fuente', carga: 'Cargando',
}

const PERIODO_LABELS: Record<Periodo, string> = {
  hoy: 'Hoy', semana: 'Esta semana', mes: 'Este mes',
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function fmt(v: number | null, suffix = ''): string {
  if (v === null) return '—'
  return `${v.toFixed(1)}${suffix}`
}

function fmtCOP(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000)     return `$${Math.round(v / 1_000)}K`
  return `$${v.toLocaleString('es-CO')}`
}

function deltaColor(v: number | null, invert = false): string {
  if (v === null || v === 0) return 'var(--ink-30)'
  const good = invert ? v < 0 : v > 0
  return good ? 'var(--success-fg)' : 'var(--urgente)'
}

function DeltaText({ v, invert = false, suffix = 'pt' }: { v: number | null; invert?: boolean; suffix?: string }) {
  if (v === null) return null
  const color = deltaColor(v, invert)
  const sign = v > 0 ? '+' : ''
  const Icon = v === 0 ? Minus : (invert ? v < 0 : v > 0) ? TrendingDown : TrendingUp
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color, fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 500 }}>
      <Icon size={11} />{sign}{v.toFixed(1)}{suffix}
    </span>
  )
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

// Tres métricas clave en fila: CMV%, Personal%, Prime Cost
function MetricasRow({ r }: { r: CostosResumen }) {
  const cmvDelta = r.cmv_pct !== null && r.cmv_pct_objetivo !== null
    ? parseFloat((r.cmv_pct - r.cmv_pct_objetivo).toFixed(1)) : null
  const persDelta = r.personal_pct !== null && r.personal_pct_objetivo !== null
    ? parseFloat((r.personal_pct - r.personal_pct_objetivo).toFixed(1)) : null

  const items = [
    {
      label: 'CMV%',
      value: fmt(r.cmv_pct, '%'),
      objetivo: r.cmv_pct_objetivo !== null ? `obj. ${r.cmv_pct_objetivo}%` : null,
      delta: cmvDelta,
      invert: true, // para CMV, subir es malo
      icon: <ShoppingCart size={14} color="var(--ink-30)" />,
      acento: cmvDelta !== null && cmvDelta > 0 ? 'var(--urgente)' : 'var(--hairline)',
    },
    {
      label: 'Personal%',
      value: fmt(r.personal_pct, '%'),
      objetivo: r.personal_pct_objetivo !== null ? `obj. ${r.personal_pct_objetivo}%` : null,
      delta: persDelta,
      invert: true,
      icon: <Users2 size={14} color="var(--ink-30)" />,
      acento: persDelta !== null && persDelta > 0 ? 'var(--urgente)' : 'var(--hairline)',
    },
    {
      label: 'Prime Cost',
      value: fmt(r.prime_cost_pct, '%'),
      objetivo: 'ref. <65%',
      delta: null,
      invert: false,
      icon: null,
      acento: r.prime_cost_pct !== null && r.prime_cost_pct > 65 ? 'var(--urgente)' : 'var(--hairline)',
    },
    {
      label: 'Ocupación',
      value: fmt(r.ocupacion_pct, '%'),
      objetivo: 'arriendo + servicios',
      delta: null,
      invert: false,
      icon: null,
      acento: 'var(--hairline)',
    },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
      {items.map(it => (
        <div key={it.label} style={{
          background: 'var(--panel)',
          border: '1px solid var(--hairline)',
          borderLeft: `3px solid ${it.acento}`,
          padding: '16px 18px',
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', fontWeight: 500,
            color: 'var(--ink-55)', textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            {it.icon}{it.label}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '2rem', fontStyle: 'italic',
            color: 'var(--ink)', lineHeight: 1,
          }}>
            {it.value}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {it.delta !== null && <DeltaText v={it.delta} invert={it.invert} />}
            {it.objetivo && (
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', color: 'var(--ink-30)' }}>
                {it.objetivo}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function AlertaBanner({ alertas }: { alertas: CostosAlerta[] }) {
  if (!alertas.length) return null
  const urgente = alertas.find(a => a.tipo === 'urgente')
  const mostrar = urgente ?? alertas[0]
  const acento = mostrar.tipo === 'urgente' ? 'var(--urgente)' : mostrar.tipo === 'atencion' ? 'var(--warning-fg)' : 'var(--ink-55)'
  return (
    <div style={{
      background: 'var(--panel)', border: '1px solid var(--hairline)',
      borderLeft: `3px solid ${acento}`, padding: '14px 20px',
      display: 'flex', alignItems: 'flex-start', gap: 10,
    }}>
      <AlertTriangle size={14} color={acento} style={{ marginTop: 2, flexShrink: 0 }} />
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--ink)', lineHeight: 1.55 }}>
        {mostrar.mensaje}
      </span>
    </div>
  )
}

function InsightBlock({ text }: { text: string }) {
  return (
    <div style={{
      background: 'var(--panel)', border: '1px solid var(--hairline)',
      borderLeft: '3px solid var(--teal)', padding: '14px 20px',
      display: 'flex', alignItems: 'flex-start', gap: 10,
    }}>
      <Info size={14} color="var(--teal)" style={{ marginTop: 2, flexShrink: 0 }} />
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--ink)', lineHeight: 1.6 }}>
        {text}
      </span>
    </div>
  )
}

function TendenciaSection({ cmv, personal }: { cmv: CostosData['tendencia_cmv']; personal: CostosData['tendencia_personal'] }) {
  if (cmv.length < 2 && personal.length < 2) return null
  const semanas = cmv.map((p, i) => {
    const d = new Date(p.fecha)
    return i === 0 ? 'hace 6s' : i === cmv.length - 1 ? 'esta sem.' : `sem. ${i}`
  })

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {cmv.length >= 2 && (
        <div style={{ background: 'var(--panel)', border: '1px solid var(--hairline)', padding: '18px 20px' }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>
            CMV% — tendencia 7 semanas
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', color: 'var(--ink-30)', marginBottom: 14 }}>
            Línea objetivo: 28.0%
          </div>
          <Sparkline data={cmv.map(p => p.valor)} width={380} height={70} color="var(--urgente)" />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            {semanas.map((s, i) => (
              <span key={i} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.5625rem', color: 'var(--ink-30)' }}>{s}</span>
            ))}
          </div>
        </div>
      )}
      {personal.length >= 2 && (
        <div style={{ background: 'var(--panel)', border: '1px solid var(--hairline)', padding: '18px 20px' }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>
            Personal% — tendencia 7 semanas
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', color: 'var(--ink-30)', marginBottom: 14 }}>
            Línea objetivo: 32.0%
          </div>
          <Sparkline data={personal.map(p => p.valor)} width={380} height={70} color="var(--teal)" />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            {semanas.map((s, i) => (
              <span key={i} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.5625rem', color: 'var(--ink-30)' }}>{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Barras horizontales por categoría
function CategoriasList({ items }: { items: CostosData['por_categoria'] }) {
  if (!items.length) return null
  const max = Math.max(...items.map(i => i.valor))
  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--hairline)', padding: '20px 24px' }}>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink)', marginBottom: 18 }}>
        Costo de materias primas por categoría
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(it => (
          <div key={it.categoria}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--ink-55)' }}>{it.categoria}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>
                {fmtCOP(it.valor)} <span style={{ color: 'var(--ink-30)', fontSize: '0.75rem' }}>({it.pct}%)</span>
              </span>
            </div>
            <div style={{ height: 4, background: 'var(--hairline)' }}>
              <div style={{ height: '100%', width: `${(it.valor / max) * 100}%`, background: 'var(--terracota)', transition: 'width 0.4s var(--ease-out)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Tabla proveedores
interface ProvRow { nombre: string; categoria: string; gastado: string; presupuesto: string; varianza: React.ReactNode; [key: string]: React.ReactNode }

function ProveedoresTable({ proveedores }: { proveedores: Proveedor[] }) {
  if (!proveedores.length) return null

  const rows: ProvRow[] = proveedores.map(p => {
    const vColor = p.varianza === null ? 'var(--ink-30)'
      : p.varianza > 0 ? 'var(--urgente)' : 'var(--success-fg)'
    const vSign  = p.varianza !== null && p.varianza > 0 ? '+' : ''
    return {
      nombre: p.nombre,
      categoria: p.categoria,
      gastado: fmtCOP(p.gastado),
      presupuesto: p.presupuesto !== null ? fmtCOP(p.presupuesto) : '—',
      varianza: p.varianza !== null ? (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: vColor, fontVariantNumeric: 'tabular-nums' }}>
          {vSign}{fmtCOP(Math.abs(p.varianza))}
        </span>
      ) : <span style={{ color: 'var(--ink-30)' }}>—</span>,
    }
  })

  const cols: Column<ProvRow>[] = [
    { key: 'nombre',      label: 'Proveedor' },
    { key: 'categoria',   label: 'Categoría' },
    { key: 'gastado',     label: 'Gastado',      align: 'right', mono: true },
    { key: 'presupuesto', label: 'Presupuesto',  align: 'right', mono: true },
    { key: 'varianza',    label: 'Varianza',     align: 'right' },
  ]

  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--hairline)' }}>
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid var(--hairline)',
        fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink)',
      }}>
        Gasto proveedores — {MOCK_NORMAL.periodo.fecha_inicio.slice(0, 7)}
      </div>
      <Table columns={cols} rows={rows} />
    </div>
  )
}

// ─── EMPTY / ERROR / LOADING ──────────────────────────────────────────────────

function EstadoVacio({ periodo }: { periodo: Periodo }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: 300, gap: 14, textAlign: 'center', padding: '48px 0',
    }}>
      <div style={{ width: 48, height: 48, border: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ShoppingCart size={20} color="var(--ink-30)" />
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontStyle: 'italic', color: 'var(--ink)', marginBottom: 8 }}>
          Sin datos de costos
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--ink-55)', maxWidth: 360, lineHeight: 1.65 }}>
          {periodo === 'hoy'
            ? 'Los costos del día se consolidan al cerrar el servicio.'
            : 'No hay datos de costos para este período todavía. Carga el archivo maestro de gastos en el Auditor.'}
        </div>
      </div>
    </div>
  )
}

function ErrorBanner() {
  return (
    <div style={{
      background: 'var(--panel)', border: '1px solid var(--hairline)',
      borderLeft: '3px solid var(--urgente)', padding: '14px 20px',
      display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 16,
    }}>
      <WifiOff size={14} color="var(--urgente)" style={{ marginTop: 2, flexShrink: 0 }} />
      <div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>
          Datos de costos parciales
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--ink-55)', lineHeight: 1.55 }}>
          CMV% disponible. Personal%, ocupación y desglose por proveedor requieren el archivo maestro de gastos. Cárgalo en el Auditor.
        </div>
      </div>
    </div>
  )
}

function EstadoCarga() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, gap: 20 }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        border: '2px solid var(--hairline)', borderTop: '2px solid var(--terracota)',
        animation: 'spin 0.9s linear infinite',
      }} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
          Calculando costos…
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--ink-55)' }}>
          Cruzando gastos con ventas del período
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

function CostosPageInner() {
  const searchParams = useSearchParams()
  const isDevMode = searchParams.get('dev') === 'true'

  const [uiEstado, setUiEstado] = useState<UiEstado>('normal')
  const [periodo, setPeriodo] = useState<Periodo>('mes')

  const data = MOCK_MAP[uiEstado]
  const isLoading = data.estado_pipeline === 'corriendo'
  const isError   = data.estado_pipeline === 'error'
  const isEmpty   = data.estado_pipeline === 'completado' && data.status === 'sin_datos'
  const hasData   = data.estado_pipeline === 'completado' && data.status !== 'sin_datos'

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)' }}>
      <Topbar title="Costos" />

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
              padding: '4px 10px', border: 'none',
              background: uiEstado === e ? 'var(--terracota)' : 'rgba(255,255,255,0.08)',
              color: uiEstado === e ? '#fff' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
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
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--ink-55)' }}>
            {data.periodo.fecha_inicio} — {data.periodo.fecha_fin}
            {data.resumen.confidence === 'estimado' && (
              <span style={{ marginLeft: 8, color: 'var(--ink-30)' }}>· estimado</span>
            )}
          </div>
          <PeriodoSelector value={periodo} onChange={setPeriodo} />
        </div>

        {isLoading && <EstadoCarga />}
        {isError && <ErrorBanner />}
        {isEmpty && <EstadoVacio periodo={periodo} />}

        {(hasData || isError) && !isLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Alertas */}
            {data.alertas.length > 0 && <AlertaBanner alertas={data.alertas} />}

            {/* 4 métricas clave */}
            <MetricasRow r={data.resumen} />

            {/* Insight */}
            {data.insight && <InsightBlock text={data.insight} />}

            {/* Tendencias CMV + Personal */}
            <TendenciaSection cmv={data.tendencia_cmv} personal={data.tendencia_personal} />

            {/* Categorías */}
            {data.por_categoria.length > 0 && <CategoriasList items={data.por_categoria} />}

            {/* Tabla proveedores */}
            {data.proveedores.length > 0 && <ProveedoresTable proveedores={data.proveedores} />}

            {/* Fuente */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--ink-30)', paddingTop: 4,
            }}>
              <RefreshCw size={11} />
              Último análisis: hoy a las 08:05 · Fuentes: Sistema POS, archivo maestro de gastos
            </div>

          </div>
        )}

      </div>
    </div>
  )
}

export default function CostosPage() {
  return (
    <React.Suspense fallback={null}>
      <CostosPageInner />
    </React.Suspense>
  )
}

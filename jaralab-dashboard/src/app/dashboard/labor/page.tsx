'use client'
import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Sparkline } from '@/components/ui/data/Sparkline'
import { Table, Column } from '@/components/ui/data/Table'
import { Topbar } from '@/components/layout/Topbar'
import {
  TrendingDown, TrendingUp, Minus, WifiOff,
  RefreshCw, AlertTriangle, Users2, Clock, Info,
} from 'lucide-react'

// ─── JSON CONTRACT ────────────────────────────────────────────────────────────
// GET /api/personal?periodo=hoy|semana|mes
// {
//   periodo: { tipo: 'hoy'|'semana'|'mes', fecha_inicio: string, fecha_fin: string },
//   resumen: {
//     personal_pct: number | null,          // nómina / ventas
//     personal_pct_objetivo: number | null,
//     costo_total: number | null,           // COP
//     horas_total: number | null,
//     horas_extra: number | null,
//     ventas_base: number | null,
//     confidence: 'confirmado' | 'estimado',
//   },
//   horas_por_dia: Array<{
//     dia: string;             // abrev. ej. 'Lun'
//     real: number;
//     programado: number;
//   }>,
//   tendencia_pct: Array<{ fecha: string; valor: number }>,   // % semanal últimas 8
//   desglose_area: Array<{ area: string; pct: number; costo: number }>,
//   staff: Array<{
//     nombre: string;
//     cargo: string;
//     horas: number;
//     horas_programadas: number;
//     tarifa: number;          // COP/hora
//     costo_total: number;
//     estado: 'en_horario' | 'horas_extra' | 'flex' | 'ausente';
//   }>,
//   alertas: Array<{ mensaje: string; tipo: 'urgente'|'atencion'|'info' }>,
//   insight: string | null,
//   estado_pipeline: 'completado' | 'corriendo' | 'error',
//   status: 'ok' | 'atencion' | 'sin_datos',
// }

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Periodo = 'hoy' | 'semana' | 'mes'
type UiEstado = 'normal' | 'vacio' | 'error' | 'carga'
type EstadoStaff = 'en_horario' | 'horas_extra' | 'flex' | 'ausente'

interface PersonalResumen {
  personal_pct: number | null
  personal_pct_objetivo: number | null
  costo_total: number | null
  horas_total: number | null
  horas_extra: number | null
  ventas_base: number | null
  confidence: 'confirmado' | 'estimado'
}

interface StaffMember {
  nombre: string
  cargo: string
  horas: number
  horas_programadas: number
  tarifa: number
  costo_total: number
  estado: EstadoStaff
}

interface PersonalData {
  periodo: { tipo: Periodo; fecha_inicio: string; fecha_fin: string }
  resumen: PersonalResumen
  horas_por_dia: Array<{ dia: string; real: number; programado: number }>
  tendencia_pct: Array<{ fecha: string; valor: number }>
  desglose_area: Array<{ area: string; pct: number; costo: number }>
  staff: StaffMember[]
  alertas: Array<{ mensaje: string; tipo: 'urgente' | 'atencion' | 'info' }>
  insight: string | null
  estado_pipeline: 'completado' | 'corriendo' | 'error'
  status: 'ok' | 'atencion' | 'sin_datos'
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const MOCK_NORMAL: PersonalData = {
  periodo: { tipo: 'semana', fecha_inicio: '2026-07-07', fecha_fin: '2026-07-13' },
  resumen: {
    personal_pct: 31.2,
    personal_pct_objetivo: 32.0,
    costo_total: 183581,
    horas_total: 308,
    horas_extra: 18,
    ventas_base: 588470,
    confidence: 'confirmado',
  },
  horas_por_dia: [
    { dia: 'Lun', real: 48, programado: 44 },
    { dia: 'Mar', real: 44, programado: 44 },
    { dia: 'Mié', real: 50, programado: 44 },
    { dia: 'Jue', real: 52, programado: 44 },
    { dia: 'Vie', real: 68, programado: 60 },
    { dia: 'Sáb', real: 72, programado: 60 },
    { dia: 'Dom', real: 56, programado: 52 },
  ],
  tendencia_pct: [
    { fecha: '2026-05-26', valor: 32.4 },
    { fecha: '2026-06-02', valor: 31.8 },
    { fecha: '2026-06-09', valor: 32.1 },
    { fecha: '2026-06-16', valor: 31.4 },
    { fecha: '2026-06-23', valor: 30.9 },
    { fecha: '2026-06-30', valor: 31.4 },
    { fecha: '2026-07-07', valor: 31.2 },
  ],
  desglose_area: [
    { area: 'Cocina',         pct: 18.4, costo: 108318 },
    { area: 'Sala',           pct: 8.6,  costo: 50608  },
    { area: 'Administración', pct: 4.2,  costo: 24715  },
  ],
  staff: [
    { nombre: 'Carlos M.',    cargo: 'Chef principal',   horas: 48, horas_programadas: 44, tarifa: 18000, costo_total: 864000, estado: 'en_horario'  },
    { nombre: 'Valentina R.', cargo: 'Sous chef',        horas: 44, horas_programadas: 44, tarifa: 14000, costo_total: 616000, estado: 'en_horario'  },
    { nombre: 'Miguel A.',    cargo: 'Gerente de sala',  horas: 52, horas_programadas: 44, tarifa: 13000, costo_total: 676000, estado: 'horas_extra' },
    { nombre: 'Sofía L.',     cargo: 'Mesera',           horas: 38, horas_programadas: 40, tarifa: 9000,  costo_total: 342000, estado: 'en_horario'  },
    { nombre: 'Andrés P.',    cargo: 'Mesero',           horas: 42, horas_programadas: 40, tarifa: 9000,  costo_total: 378000, estado: 'flex'        },
    { nombre: 'Isabel C.',    cargo: 'Cajera',           horas: 40, horas_programadas: 40, tarifa: 8000,  costo_total: 320000, estado: 'en_horario'  },
    { nombre: 'Luis G.',      cargo: 'Auxiliar cocina',  horas: 44, horas_programadas: 44, tarifa: 8000,  costo_total: 352000, estado: 'en_horario'  },
  ],
  alertas: [
    { mensaje: 'Miguel A. lleva 2 semanas con horas extra. Revisar programación o autorizar el pago adicional antes del cierre de nómina.', tipo: 'atencion' },
  ],
  insight: 'Personal en 31.2% — 0.8 puntos bajo el objetivo. La eficiencia mejoró desde mayo. El miércoles y jueves tienen sobrecarga sistemática; considerar reforzar con 1 persona más esos días.',
  estado_pipeline: 'completado',
  status: 'atencion',
}

const MOCK_VACIO: PersonalData = {
  periodo: { tipo: 'hoy', fecha_inicio: '2026-07-14', fecha_fin: '2026-07-14' },
  resumen: { personal_pct: null, personal_pct_objetivo: 32.0, costo_total: null, horas_total: null, horas_extra: null, ventas_base: null, confidence: 'confirmado' },
  horas_por_dia: [], tendencia_pct: [], desglose_area: [], staff: [], alertas: [],
  insight: null, estado_pipeline: 'completado', status: 'sin_datos',
}

const MOCK_ERROR: PersonalData = {
  periodo: { tipo: 'semana', fecha_inicio: '2026-07-07', fecha_fin: '2026-07-13' },
  resumen: { personal_pct: null, personal_pct_objetivo: 32.0, costo_total: 183581, horas_total: 308, horas_extra: 18, ventas_base: null, confidence: 'estimado' },
  horas_por_dia: [
    { dia: 'Lun', real: 48, programado: 44 },
    { dia: 'Mar', real: 44, programado: 44 },
    { dia: 'Mié', real: 50, programado: 44 },
  ],
  tendencia_pct: [], desglose_area: [], staff: [], alertas: [],
  insight: null, estado_pipeline: 'error', status: 'atencion',
}

const MOCK_CARGA: PersonalData = {
  periodo: { tipo: 'semana', fecha_inicio: '2026-07-07', fecha_fin: '2026-07-13' },
  resumen: { personal_pct: null, personal_pct_objetivo: 32.0, costo_total: null, horas_total: null, horas_extra: null, ventas_base: null, confidence: 'confirmado' },
  horas_por_dia: [], tendencia_pct: [], desglose_area: [], staff: [], alertas: [],
  insight: null, estado_pipeline: 'corriendo', status: 'sin_datos',
}

const MOCK_MAP: Record<UiEstado, PersonalData> = {
  normal: MOCK_NORMAL, vacio: MOCK_VACIO, error: MOCK_ERROR, carga: MOCK_CARGA,
}

const ESTADO_LABELS: Record<UiEstado, string> = {
  normal: 'Normal', vacio: 'Sin datos', error: 'Error fuente', carga: 'Cargando',
}

const PERIODO_LABELS: Record<Periodo, string> = {
  hoy: 'Hoy', semana: 'Esta semana', mes: 'Este mes',
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function fmtCOP(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000)     return `$${Math.round(v / 1_000)}K`
  return `$${v.toLocaleString('es-CO')}`
}

function fmtHoras(v: number): string {
  return `${v}h`
}

const ESTADO_CFG: Record<EstadoStaff, { label: string; color: string }> = {
  en_horario:  { label: 'En horario',   color: 'var(--success-fg)' },
  horas_extra: { label: 'Horas extra',  color: 'var(--urgente)'   },
  flex:        { label: 'Flex',         color: 'var(--ink-55)'    },
  ausente:     { label: 'Ausente',      color: 'var(--ink-30)'    },
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

// Hero % personal + KPIs secundarios
function HeroPersonal({ r, periodo }: { r: PersonalResumen; periodo: Periodo }) {
  const delta = r.personal_pct !== null && r.personal_pct_objetivo !== null
    ? parseFloat((r.personal_pct - r.personal_pct_objetivo).toFixed(1)) : null
  // Para personal%, estar bajo el objetivo es BUENO
  const deltaColor = delta === null ? 'var(--ink-30)'
    : delta < 0 ? 'var(--success-fg)' : delta > 0 ? 'var(--urgente)' : 'var(--ink-30)'
  const DeltaIcon = delta === null ? null : delta < 0 ? TrendingDown : delta > 0 ? TrendingUp : Minus

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
      {/* Métrica principal */}
      <div style={{
        background: 'var(--panel)', border: '1px solid var(--hairline)',
        borderLeft: `3px solid ${delta !== null && delta > 0 ? 'var(--urgente)' : 'var(--hairline)'}`,
        padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 8,
        gridColumn: '1',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', fontWeight: 500,
          color: 'var(--ink-55)', textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          <Users2 size={13} color="var(--ink-30)" />
          Personal% — {PERIODO_LABELS[periodo].toLowerCase()}
          {r.confidence === 'estimado' && <span style={{ color: 'var(--ink-30)' }}>· est.</span>}
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: '3rem', fontStyle: 'italic',
          color: r.personal_pct === null ? 'var(--ink-30)' : 'var(--ink)', lineHeight: 1,
        }}>
          {r.personal_pct !== null ? `${r.personal_pct.toFixed(1)}%` : '—'}
        </div>
        {delta !== null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: deltaColor, fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 500 }}>
            {DeltaIcon && <DeltaIcon size={12} />}
            {Math.abs(delta).toFixed(1)}pt {delta < 0 ? 'bajo' : 'sobre'} objetivo ({r.personal_pct_objetivo}%)
          </div>
        )}
      </div>

      {/* Costo total */}
      <div style={{ background: 'var(--panel)', border: '1px solid var(--hairline)', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', fontWeight: 500, color: 'var(--ink-55)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Costo nómina
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.625rem', fontWeight: 600, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>
          {r.costo_total !== null ? fmtCOP(r.costo_total) : '—'}
        </div>
        {r.ventas_base !== null && r.costo_total !== null && (
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--ink-30)' }}>
            de {fmtCOP(r.ventas_base)} en ventas
          </div>
        )}
      </div>

      {/* Horas */}
      <div style={{ background: 'var(--panel)', border: '1px solid var(--hairline)', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', fontWeight: 500, color: 'var(--ink-55)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 5 }}>
          <Clock size={12} color="var(--ink-30)" />
          Horas trabajadas
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.625rem', fontWeight: 600, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>
          {r.horas_total !== null ? fmtHoras(r.horas_total) : '—'}
        </div>
        {r.horas_extra !== null && r.horas_extra > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--urgente)' }}>
            <AlertTriangle size={11} />
            {r.horas_extra}h extra esta semana
          </div>
        )}
      </div>
    </div>
  )
}

function AlertaBanner({ alertas }: { alertas: Array<{ mensaje: string; tipo: string }> }) {
  if (!alertas.length) return null
  const a = alertas[0]
  const acento = a.tipo === 'urgente' ? 'var(--urgente)' : a.tipo === 'atencion' ? 'var(--warning-fg)' : 'var(--ink-55)'
  return (
    <div style={{
      background: 'var(--panel)', border: '1px solid var(--hairline)',
      borderLeft: `3px solid ${acento}`, padding: '14px 20px',
      display: 'flex', alignItems: 'flex-start', gap: 10,
    }}>
      <AlertTriangle size={14} color={acento} style={{ marginTop: 2, flexShrink: 0 }} />
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--ink)', lineHeight: 1.55 }}>
        {a.mensaje}
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

// Barras reales vs programado
function HorasChart({ dias }: { dias: PersonalData['horas_por_dia'] }) {
  if (!dias.length) return null
  const max = Math.max(...dias.flatMap(d => [d.real, d.programado])) * 1.1

  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--hairline)', padding: '20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink)' }}>
          Horas trabajadas vs. programadas
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {[{ label: 'Real', color: 'var(--terracota)' }, { label: 'Programado', color: 'var(--hairline)' }].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--ink-55)' }}>
              <span style={{ width: 10, height: 10, background: l.color, display: 'inline-block' }} />
              {l.label}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 120 }}>
        {dias.map(d => {
          const realH   = (d.real / max) * 110
          const progH   = (d.programado / max) * 110
          const overrun = d.real > d.programado
          return (
            <div key={d.dia} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end', gap: 2, height: 110 }}>
                {/* Programado — fondo hairline */}
                <div style={{ flex: 1, height: progH, background: 'var(--hairline)' }} />
                {/* Real — terracota, urgente si supera */}
                <div style={{ flex: 1, height: realH, background: overrun ? 'var(--urgente)' : 'var(--terracota)' }} />
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', color: 'var(--ink-30)' }}>{d.dia}</div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.6875rem',
                color: overrun ? 'var(--urgente)' : 'var(--ink-55)',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {d.real}h
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TendenciaYDesglose({ tendencia, desglose }: { tendencia: PersonalData['tendencia_pct']; desglose: PersonalData['desglose_area'] }) {
  if (!tendencia.length && !desglose.length) return null

  return (
    <div style={{ display: 'grid', gridTemplateColumns: tendencia.length >= 2 && desglose.length ? '3fr 2fr' : '1fr', gap: 10 }}>
      {tendencia.length >= 2 && (
        <div style={{ background: 'var(--panel)', border: '1px solid var(--hairline)', padding: '20px 24px' }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>
            Personal% — tendencia 7 semanas
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', color: 'var(--ink-30)', marginBottom: 14 }}>
            Objetivo: 32.0%
          </div>
          <Sparkline data={tendencia.map(p => p.valor)} width={420} height={70} color="var(--teal)" />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            {['hace 6s', '', '', '', '', '', 'esta sem.'].map((s, i) => (
              <span key={i} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.5625rem', color: 'var(--ink-30)' }}>{s}</span>
            ))}
          </div>
        </div>
      )}
      {desglose.length > 0 && (
        <div style={{ background: 'var(--panel)', border: '1px solid var(--hairline)', padding: '20px 24px' }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink)', marginBottom: 18 }}>
            Por área
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {desglose.map(a => (
              <div key={a.area}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--ink-55)' }}>{a.area}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>
                    {a.pct.toFixed(1)}% <span style={{ color: 'var(--ink-30)', fontSize: '0.75rem' }}>({fmtCOP(a.costo)})</span>
                  </span>
                </div>
                <div style={{ height: 4, background: 'var(--hairline)' }}>
                  <div style={{ height: '100%', width: `${(a.pct / 32) * 100}%`, background: 'var(--teal)', transition: 'width 0.4s var(--ease-out)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Tabla staff
interface StaffRow { nombre: string; cargo: React.ReactNode; horas: React.ReactNode; tarifa: React.ReactNode; total: React.ReactNode; estado: React.ReactNode; [key: string]: React.ReactNode }

function StaffTable({ staff, nominaTotal }: { staff: StaffMember[]; nominaTotal: number | null }) {
  if (!staff.length) return null

  const rows: StaffRow[] = staff.map(s => {
    const cfg = ESTADO_CFG[s.estado]
    const overrun = s.horas > s.horas_programadas
    return {
      nombre: s.nombre,
      cargo: s.cargo,
      horas: (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontVariantNumeric: 'tabular-nums', color: overrun ? 'var(--urgente)' : 'var(--ink)' }}>
          {fmtHoras(s.horas)}
          {overrun && <span style={{ color: 'var(--ink-30)', fontSize: '0.75rem' }}> / {s.horas_programadas}h</span>}
        </span>
      ) as React.ReactNode,
      tarifa: fmtCOP(s.tarifa) + '/h',
      total: fmtCOP(s.costo_total),
      estado: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: cfg.color, fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 500 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.color, display: 'inline-block' }} />
          {cfg.label}
        </span>
      ),
    }
  })

  const cols: Column<StaffRow>[] = [
    { key: 'nombre', label: 'Empleado' },
    { key: 'cargo',  label: 'Cargo' },
    { key: 'horas',  label: 'Horas',  align: 'right' },
    { key: 'tarifa', label: 'Tarifa', align: 'right', mono: true },
    { key: 'total',  label: 'Total',  align: 'right', mono: true },
    { key: 'estado', label: 'Estado', align: 'right' },
  ]

  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--hairline)' }}>
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid var(--hairline)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink)' }}>
          Personal — esta semana
        </div>
        {nominaTotal !== null && (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--ink-55)', fontVariantNumeric: 'tabular-nums' }}>
            Nómina total: <strong style={{ color: 'var(--ink)' }}>{fmtCOP(nominaTotal)}</strong>
          </div>
        )}
      </div>
      <Table columns={cols} rows={rows} />
    </div>
  )
}

// ─── EMPTY / ERROR / LOADING ──────────────────────────────────────────────────

function EstadoVacio({ periodo }: { periodo: Periodo }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 14, textAlign: 'center', padding: '48px 0' }}>
      <div style={{ width: 48, height: 48, border: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Users2 size={20} color="var(--ink-30)" />
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontStyle: 'italic', color: 'var(--ink)', marginBottom: 8 }}>
          Sin datos de personal
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--ink-55)', maxWidth: 360, lineHeight: 1.65 }}>
          {periodo === 'hoy'
            ? 'Los datos de personal se consolidan al cerrar el servicio del día.'
            : 'No hay registros de nómina para este período. Asegúrate de que el sistema de nómina esté integrado.'}
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
          Personal% no disponible
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--ink-55)', lineHeight: 1.55 }}>
          Las horas sí se registraron. El porcentaje no se puede calcular sin los datos de ventas del período. Recarga el pipeline en el Auditor.
        </div>
      </div>
    </div>
  )
}

function EstadoCarga() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, gap: 20 }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid var(--hairline)', borderTop: '2px solid var(--teal)', animation: 'spin 0.9s linear infinite' }} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>Calculando nómina…</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--ink-55)' }}>Cruzando horas con tarifas del período</div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

function PersonalPageInner() {
  const searchParams = useSearchParams()
  const isDevMode = searchParams.get('dev') === 'true'

  const [uiEstado, setUiEstado] = useState<UiEstado>('normal')
  const [periodo, setPeriodo] = useState<Periodo>('semana')

  const data = MOCK_MAP[uiEstado]
  const isLoading = data.estado_pipeline === 'corriendo'
  const isError   = data.estado_pipeline === 'error'
  const isEmpty   = data.estado_pipeline === 'completado' && data.status === 'sin_datos'
  const hasData   = data.estado_pipeline === 'completado' && data.status !== 'sin_datos'

  const nominaTotal = data.staff.length
    ? data.staff.reduce((acc, s) => acc + s.costo_total, 0)
    : null

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)' }}>
      <Topbar title="Personal" />

      {isDevMode && (
        <div style={{ background: 'var(--ink)', padding: '8px 28px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Estado · DEV
          </span>
          {(Object.keys(ESTADO_LABELS) as UiEstado[]).map(e => (
            <button key={e} onClick={() => setUiEstado(e)} style={{
              fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 500,
              padding: '4px 10px', border: 'none',
              background: uiEstado === e ? 'var(--teal)' : 'rgba(255,255,255,0.08)',
              color: uiEstado === e ? '#fff' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
            }}>
              {ESTADO_LABELS[e]}
            </button>
          ))}
        </div>
      )}

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 28px 60px' }}>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--ink-55)' }}>
            {data.periodo.fecha_inicio} — {data.periodo.fecha_fin}
            {data.resumen.confidence === 'estimado' && <span style={{ marginLeft: 8, color: 'var(--ink-30)' }}>· estimado</span>}
          </div>
          <PeriodoSelector value={periodo} onChange={setPeriodo} />
        </div>

        {isLoading && <EstadoCarga />}
        {isError && <ErrorBanner />}
        {isEmpty && <EstadoVacio periodo={periodo} />}

        {(hasData || isError) && !isLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {data.alertas.length > 0 && <AlertaBanner alertas={data.alertas} />}

            <HeroPersonal r={data.resumen} periodo={periodo} />

            {data.insight && <InsightBlock text={data.insight} />}

            {data.horas_por_dia.length > 0 && <HorasChart dias={data.horas_por_dia} />}

            <TendenciaYDesglose tendencia={data.tendencia_pct} desglose={data.desglose_area} />

            {data.staff.length > 0 && <StaffTable staff={data.staff} nominaTotal={nominaTotal} />}

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--ink-30)', paddingTop: 4 }}>
              <RefreshCw size={11} />
              Último análisis: hoy a las 08:05 · Fuentes: Sistema POS, nómina
            </div>

          </div>
        )}

      </div>
    </div>
  )
}

export default function PersonalPage() {
  return (
    <React.Suspense fallback={null}>
      <PersonalPageInner />
    </React.Suspense>
  )
}

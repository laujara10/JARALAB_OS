'use client'
import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Upload, X, CheckCircle2, AlertTriangle, Info,
  Sparkles, RefreshCw, ChevronRight, ArrowRight,
  FileText, Landmark, ShoppingCart, TrendingUp,
} from 'lucide-react'
import { Topbar } from '@/components/layout/Topbar'
import {
  auditService,
  saveAuditResult,
  formatCOP,
  type AuditResult,
  type AuditPeriod,
  type AuditRequest,
  type AuditFinding,
  type AuditTransaction,
} from '@/lib/services/audit.service'

// ─── Types ───────────────────────────────────────────────────────────────────

type Phase = 'setup' | 'processing' | 'result' | 'error'
type PeriodoTipo = AuditPeriod['tipo']
interface LocalFile { name: string; size_kb: number }

// ─── Constants ───────────────────────────────────────────────────────────────

const PERIODOS: { value: PeriodoTipo; label: string; sub: string }[] = [
  { value: 'hoy',        label: 'Hoy',           sub: 'Último cierre' },
  { value: 'semana',     label: 'Esta semana',    sub: 'Lun – Dom' },
  { value: 'mes',        label: 'Este mes',       sub: 'Mes en curso' },
  { value: 'ultimos_30', label: 'Últimos 30 días',sub: 'Período móvil' },
]

const PIPELINE_STEPS = [
  'Leyendo archivos',
  'Organizando movimientos',
  'Cruzando ventas y transferencias',
  'Detectando diferencias',
  'Preparando recomendaciones',
]
const STEP_MS = 1080

const SEVERIDAD_CFG = {
  urgente: { color: 'var(--urgente)',    label: 'Urgente' },
  revisar: { color: 'var(--warning-fg)', label: 'Revisar' },
  info:    { color: 'var(--ink-30)',     label: 'Info' },
}

const ESTADO_CFG = {
  conciliado:           { color: 'var(--success-fg)', label: 'Conciliado' },
  posible_coincidencia: { color: 'var(--warning-fg)', label: 'Posible coincidencia' },
  requiere_revision:    { color: 'var(--urgente)',     label: 'Requiere revisión' },
  sin_evidencia:        { color: 'var(--ink-30)',      label: 'Sin evidencia' },
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildPeriodo(tipo: PeriodoTipo): AuditPeriod {
  const now = new Date()
  const iso = (d: Date) => d.toISOString().slice(0, 10)
  if (tipo === 'hoy') return { tipo, fecha_inicio: iso(now), fecha_fin: iso(now) }
  if (tipo === 'semana') {
    const day = now.getDay() === 0 ? 6 : now.getDay() - 1
    const inicio = new Date(now); inicio.setDate(now.getDate() - day)
    return { tipo, fecha_inicio: iso(inicio), fecha_fin: iso(now) }
  }
  if (tipo === 'mes') {
    return { tipo, fecha_inicio: iso(new Date(now.getFullYear(), now.getMonth(), 1)), fecha_fin: iso(now) }
  }
  const inicio = new Date(now); inicio.setDate(now.getDate() - 29)
  return { tipo, fecha_inicio: iso(inicio), fecha_fin: iso(now) }
}

function Dot({ color }: { color: string }) {
  return <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
}

// ─── Period selector ─────────────────────────────────────────────────────────

function PeriodoSelector({ value, onChange }: { value: PeriodoTipo; onChange: (v: PeriodoTipo) => void }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 500, color: 'var(--ink-30)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
        Período
      </div>
      <div style={{ display: 'flex' }}>
        {PERIODOS.map((p, i) => {
          const active = value === p.value
          return (
            <button key={p.value} onClick={() => onChange(p.value)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
              padding: '10px 16px',
              background: active ? 'var(--ink)' : 'var(--panel)',
              color: active ? '#fff' : 'var(--ink)',
              border: '1px solid var(--hairline)',
              borderLeft: i > 0 ? 'none' : '1px solid var(--hairline)',
              cursor: 'pointer', fontFamily: 'var(--font-sans)',
            }}>
              <span style={{ fontSize: '0.875rem', fontWeight: active ? 600 : 400 }}>{p.label}</span>
              <span style={{ fontSize: '0.6875rem', opacity: active ? 0.7 : 0.45 }}>{p.sub}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Upload zone ─────────────────────────────────────────────────────────────

function UploadZone({ label, hint, icon, required, file, onFile, onClear, disabled }: {
  label: string; hint: string; icon: React.ReactNode; required: boolean
  file: LocalFile | null; onFile: (f: LocalFile) => void; onClear: () => void; disabled?: boolean
}) {
  const [drag, setDrag] = React.useState(false)
  const ref = React.useRef<HTMLInputElement>(null)

  function handleFiles(list: FileList | null) {
    if (!list?.length) return
    const f = list[0]
    onFile({ name: f.name, size_kb: Math.round(f.size / 1024) })
  }

  return (
    <div style={{
      border: drag ? '1px solid var(--terracota)' : '1px solid var(--hairline)',
      background: drag ? 'rgba(192,90,62,0.03)' : 'var(--panel)',
      padding: '18px 20px', opacity: disabled ? 0.45 : 1, transition: 'border-color 0.1s',
    }}
      onDragOver={e => { e.preventDefault(); if (!disabled) setDrag(true) }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); if (!disabled) handleFiles(e.dataTransfer.files) }}
    >
      {file ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <CheckCircle2 size={16} color="var(--success-fg)" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--ink)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--ink-30)', marginTop: 2 }}>{file.size_kb} KB</div>
          </div>
          {!disabled && (
            <button onClick={onClear} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--ink-30)' }}>
              <X size={14} />
            </button>
          )}
        </div>
      ) : (
        <div onClick={() => !disabled && ref.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: disabled ? 'default' : 'pointer' }}>
          <div style={{ color: 'var(--ink-30)', flexShrink: 0 }}>{icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--ink)', fontWeight: 500 }}>{label}</span>
              {required && (
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', color: 'var(--terracota)', border: '1px solid var(--terracota)', padding: '1px 5px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Requerido</span>
              )}
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--ink-30)', marginTop: 2 }}>{hint}</div>
          </div>
          <Upload size={14} color="var(--ink-30)" style={{ flexShrink: 0 }} />
        </div>
      )}
      <input ref={ref} type="file" accept=".xlsx,.csv,.pdf" style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
    </div>
  )
}

// ─── Processing view ─────────────────────────────────────────────────────────

function ProcessingView({ step }: { step: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '48px 24px', gap: 40 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.75rem', color: 'var(--ink)', marginBottom: 8 }}>Revisando el negocio</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--ink-55)' }}>Esto toma menos de un minuto</div>
      </div>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {PIPELINE_STEPS.map((label, i) => {
          const done = i < step; const active = i === step
          return (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 0',
              borderBottom: i < PIPELINE_STEPS.length - 1 ? '1px solid var(--hairline)' : 'none',
              opacity: i > step ? 0.3 : 1, transition: 'opacity 0.3s',
            }}>
              <div style={{ width: 20, height: 20, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {done
                  ? <CheckCircle2 size={16} color="var(--success-fg)" />
                  : active
                  ? <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--terracota)', animation: 'pdot 1s ease-in-out infinite' }} />
                  : <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--hairline)' }} />}
              </div>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: done ? 'var(--ink-55)' : active ? 'var(--ink)' : 'var(--ink-30)', fontWeight: active ? 500 : 400 }}>
                {label}
              </span>
            </div>
          )
        })}
      </div>
      <style>{`@keyframes pdot{0%,100%{opacity:.4;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  )
}

// ─── Finding card ─────────────────────────────────────────────────────────────

function FindingCard({ finding }: { finding: AuditFinding }) {
  const cfg = SEVERIDAD_CFG[finding.severidad]
  return (
    <div style={{ border: '1px solid var(--hairline)', borderLeft: `3px solid ${cfg.color}`, background: 'var(--panel)', padding: '16px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
            <Dot color={cfg.color} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', color: cfg.color, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{cfg.label}</span>
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>{finding.titulo}</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--ink-55)', lineHeight: 1.65, marginBottom: 10 }}>{finding.descripcion}</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--ink-55)', padding: '8px 12px', background: 'var(--bg)', border: '1px solid var(--hairline)' }}>
            <strong style={{ color: 'var(--ink)' }}>Recomendación:</strong> {finding.accion_sugerida}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.125rem', fontWeight: 600, color: finding.severidad === 'urgente' ? 'var(--urgente)' : 'var(--ink)' }}>
            {formatCOP(finding.monto)}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Transaction row ──────────────────────────────────────────────────────────

function TxRow({ tx }: { tx: AuditTransaction }) {
  const cfg = ESTADO_CFG[tx.estado]
  return (
    <tr style={{ borderBottom: '1px solid var(--hairline)' }}>
      <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ink-55)', whiteSpace: 'nowrap' }}>{tx.fecha.slice(5)}</td>
      <td style={{ padding: '10px 12px', fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--ink)' }}>{tx.referencia}</td>
      <td style={{ padding: '10px 12px', fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--ink-55)' }}>{tx.cuenta}</td>
      <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--ink)', textAlign: 'right' }}>{tx.venta_pos != null ? formatCOP(tx.venta_pos) : '—'}</td>
      <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--ink)', textAlign: 'right' }}>{tx.movimiento_bancario != null ? formatCOP(tx.movimiento_bancario) : '—'}</td>
      <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: tx.diferencia > 0 ? 'var(--urgente)' : 'var(--success-fg)' }}>
        {tx.diferencia > 0 ? `+${formatCOP(tx.diferencia)}` : '—'}
      </td>
      <td style={{ padding: '10px 12px' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: cfg.color }}>
          <Dot color={cfg.color} /> {cfg.label}
        </span>
      </td>
    </tr>
  )
}

// ─── Result view ─────────────────────────────────────────────────────────────

function ResultView({ result, onReset, onCopilot }: { result: AuditResult; onReset: () => void; onCopilot: () => void }) {
  const [tab, setTab] = React.useState<'hallazgos' | 'detalle'>('hallazgos')
  const { kpis, metricas_secundarias, hallazgos_positivos, hallazgos_atencion, detalle } = result
  const urgentes = hallazgos_atencion.filter(h => h.severidad === 'urgente').length

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)' }}>

      {/* Banner */}
      <div style={{ background: 'var(--ink)', color: '#fff', padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.5rem', marginBottom: 4 }}>Auditoría completada</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)' }}>
            {hallazgos_atencion.length > 0
              ? `Hoy hay ${hallazgos_atencion.length} cosa${hallazgos_atencion.length > 1 ? 's' : ''} que requier${hallazgos_atencion.length > 1 ? 'en' : 'e'} tu decisión.`
              : 'Todo concilió limpio. Sin elementos pendientes.'}
          </div>
        </div>
        <button onClick={onCopilot} style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 500,
          padding: '10px 18px', background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.25)', color: '#fff', cursor: 'pointer',
        }}>
          <Sparkles size={14} /> Hablar con el Copiloto
        </button>
      </div>

      <div style={{ padding: '28px' }}>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, marginBottom: 20 }}>
          {[
            { label: 'Ventas reportadas',    m: kpis.ventas_reportadas,    alert: false },
            { label: 'Recaudo identificado', m: kpis.recaudo_identificado, alert: false },
            { label: 'Monto conciliado',     m: kpis.monto_conciliado,     alert: false },
            { label: 'Diferencia pendiente', m: kpis.diferencia_pendiente, alert: kpis.diferencia_pendiente.valor > 0 },
          ].map(k => (
            <div key={k.label} style={{
              background: 'var(--panel)',
              border: '1px solid var(--hairline)',
              borderLeft: k.alert ? '3px solid var(--urgente)' : '1px solid var(--hairline)',
              padding: '16px 18px',
            }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', color: 'var(--ink-30)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>{k.label}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 600, color: k.alert ? 'var(--urgente)' : 'var(--ink)' }}>
                {formatCOP(k.m.valor)}
              </div>
              {k.m.confidence === 'estimado' && (
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', color: 'var(--ink-30)', marginTop: 3 }}>estimado</div>
              )}
            </div>
          ))}
        </div>

        {/* Métricas secundarias */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--ink-55)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--ink)' }}>{metricas_secundarias.cobertura_auditoria_pct}%</span>{' '}bajo auditoría
          </div>
          <div style={{ width: 1, height: 14, background: 'var(--hairline)' }} />
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--ink-55)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--success-fg)' }}>{metricas_secundarias.conciliacion_automatica_pct}%</span>{' '}conciliación automática
          </div>
          {urgentes > 0 && (
            <>
              <div style={{ width: 1, height: 14, background: 'var(--hairline)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--urgente)' }}>
                <AlertTriangle size={13} /> {urgentes} urgente{urgentes > 1 ? 's' : ''}
              </div>
            </>
          )}
        </div>

        {/* Lo que está bien */}
        {hallazgos_positivos.length > 0 && (
          <div style={{ background: 'var(--panel)', border: '1px solid var(--hairline)', borderLeft: '3px solid var(--success-fg)', padding: '14px 18px', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <CheckCircle2 size={13} color="var(--success-fg)" />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 500, color: 'var(--success-fg)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Lo que está bien</span>
            </div>
            <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {hallazgos_positivos.map((h, i) => (
                <li key={i} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--ink-55)', lineHeight: 1.55 }}>{h}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--hairline)', marginBottom: 20 }}>
          {(['hallazgos', 'detalle'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 500,
              padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
              color: tab === t ? 'var(--ink)' : 'var(--ink-30)',
              borderBottom: tab === t ? '2px solid var(--terracota)' : '2px solid transparent',
              marginBottom: -1,
            }}>
              {t === 'hallazgos'
                ? `Requiere atención${hallazgos_atencion.length > 0 ? ` (${hallazgos_atencion.length})` : ''}`
                : `Movimientos (${detalle.length})`}
            </button>
          ))}
        </div>

        {tab === 'hallazgos' && (
          hallazgos_atencion.length === 0
            ? <div style={{ padding: '40px 0', textAlign: 'center', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--ink-55)' }}>Sin hallazgos pendientes esta semana.</div>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{hallazgos_atencion.map((f, i) => <FindingCard key={i} finding={f} />)}</div>
        )}

        {tab === 'detalle' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid var(--hairline)' }}>
              <thead>
                <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--hairline)' }}>
                  {['Fecha','Referencia','Cuenta','Venta POS','Banco','Diferencia','Estado'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', fontWeight: 500, color: 'var(--ink-30)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: ['Venta POS','Banco','Diferencia'].includes(h) ? 'right' : 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>{detalle.map((tx, i) => <TxRow key={i} tx={tx} />)}</tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--hairline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--ink-30)' }}>Fuentes: Extracto bancario · Sistema POS</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onReset} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-sans)', fontSize: '0.875rem', padding: '9px 16px', background: 'var(--panel)', border: '1px solid var(--hairline)', color: 'var(--ink)', cursor: 'pointer' }}>
              <RefreshCw size={13} /> Nueva auditoría
            </button>
            <button onClick={onCopilot} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 500, padding: '9px 16px', background: 'var(--ink)', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <Sparkles size={13} /> Hablar con el Copiloto <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Error view ───────────────────────────────────────────────────────────────

function ErrorView({ mensaje, onRetry }: { mensaje: string; onRetry: () => void }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, gap: 20, textAlign: 'center' }}>
      <AlertTriangle size={32} color="var(--urgente)" />
      <div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 600, color: 'var(--ink)', marginBottom: 8 }}>Hubo un problema al procesar</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--ink-55)' }}>{mensaje}</div>
      </div>
      <button onClick={onRetry} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-sans)', fontSize: '0.875rem', padding: '10px 20px', background: 'var(--ink)', border: 'none', color: '#fff', cursor: 'pointer' }}>
        <RefreshCw size={13} /> Reintentar
      </button>
    </div>
  )
}

// ─── Dev toggle ───────────────────────────────────────────────────────────────

function DevBar({ phase, onPhase }: { phase: Phase; onPhase: (p: Phase) => void }) {
  const phases: Phase[] = ['setup', 'processing', 'result', 'error']
  return (
    <div style={{ background: '#1a1310', padding: '6px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'rgba(255,255,255,0.4)' }}>DEV</span>
      {phases.map(p => (
        <button key={p} onClick={() => onPhase(p)} style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', padding: '3px 10px',
          background: phase === p ? 'var(--terracota)' : 'transparent',
          border: `1px solid ${phase === p ? 'var(--terracota)' : 'rgba(255,255,255,0.15)'}`,
          color: phase === p ? '#fff' : 'rgba(255,255,255,0.5)', cursor: 'pointer',
        }}>{p}</button>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function AuditorPageInner() {
  const router = useRouter()
  const params = useSearchParams()
  const isDev = params.get('dev') === 'true'

  const [phase,        setPhase]        = React.useState<Phase>('setup')
  const [periodo,      setPeriodo]      = React.useState<PeriodoTipo>('semana')
  const [bankFile,     setBankFile]     = React.useState<LocalFile | null>(null)
  const [posFile,      setPosFile]      = React.useState<LocalFile | null>(null)
  const [gastosFile,   setGastosFile]   = React.useState<LocalFile | null>(null)
  const [pipelineStep, setPipelineStep] = React.useState(0)
  const [result,       setResult]       = React.useState<AuditResult | null>(null)
  const [errorMsg,     setErrorMsg]     = React.useState('')

  const canStart = bankFile !== null && posFile !== null

  async function startAudit() {
    setPhase('processing')
    setPipelineStep(0)
    for (let i = 0; i < PIPELINE_STEPS.length; i++) {
      await new Promise(r => setTimeout(r, STEP_MS))
      setPipelineStep(i + 1)
    }
    const request: AuditRequest = {
      periodo: buildPeriodo(periodo),
      restaurantId: 'pikeo',
      archivos: [
        { nombre: bankFile!.name,  tipo: 'xlsx', tamano_kb: bankFile!.size_kb,  estado: 'valido' },
        { nombre: posFile!.name,   tipo: 'xlsx', tamano_kb: posFile!.size_kb,   estado: 'valido' },
        ...(gastosFile ? [{ nombre: gastosFile.name, tipo: 'xlsx', tamano_kb: gastosFile.size_kb, estado: 'valido' as const }] : []),
      ],
    }
    try {
      const res = await auditService.run(request)
      setResult(res); saveAuditResult(res); setPhase('result')
    } catch {
      setErrorMsg('No fue posible procesar los archivos. Verifica que estén en el formato correcto e intenta de nuevo.')
      setPhase('error')
    }
  }

  function reset() {
    setPhase('setup'); setBankFile(null); setPosFile(null); setGastosFile(null)
    setPipelineStep(0); setResult(null); setErrorMsg('')
  }

  function goToCopilot() { router.push('/dashboard/copilot') }

  function forcePhase(p: Phase) {
    setPhase(p)
    if (p === 'result' && !result) {
      const req: AuditRequest = { periodo: buildPeriodo('semana'), restaurantId: 'pikeo', archivos: [
        { nombre: 'extracto_demo.xlsx', tipo: 'xlsx', tamano_kb: 48, estado: 'valido' },
        { nombre: 'ventas_demo.xlsx',   tipo: 'xlsx', tamano_kb: 31, estado: 'valido' },
      ]}
      auditService.run(req).then(r => { setResult(r); saveAuditResult(r) })
    }
    if (p === 'error') setErrorMsg('Error de demo — modo dev.')
    if (p === 'setup') reset()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      <Topbar title="Restaurant Auditor" />
      {isDev && <DevBar phase={phase} onPhase={forcePhase} />}

      {phase === 'setup' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 28px' }}>
          <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 32 }}>
            <PeriodoSelector value={periodo} onChange={setPeriodo} />
            <div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 500, color: 'var(--ink-30)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Archivos</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <UploadZone label="Extracto bancario"  hint="PDF, Excel o CSV exportado del banco"          icon={<Landmark size={18} />}    required file={bankFile}   onFile={setBankFile}   onClear={() => setBankFile(null)} />
                <UploadZone label="Reporte de ventas"  hint="Exportación diaria del sistema POS"            icon={<ShoppingCart size={18} />} required file={posFile}    onFile={setPosFile}    onClear={() => setPosFile(null)} />
                <UploadZone label="Maestro de gastos"  hint="Opcional — mejora la clasificación de débitos" icon={<FileText size={18} />}    required={false} file={gastosFile} onFile={setGastosFile} onClear={() => setGastosFile(null)} />
              </div>
              {!canStart && (
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--ink-30)', marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Info size={12} /> Carga el extracto bancario y el reporte de ventas para continuar.
                </div>
              )}
            </div>
            <div>
              <button onClick={startAudit} disabled={!canStart} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', fontWeight: 500,
                padding: '13px 24px',
                background: canStart ? 'var(--ink)' : 'var(--hairline)',
                border: 'none',
                color: canStart ? '#fff' : 'var(--ink-30)',
                cursor: canStart ? 'pointer' : 'not-allowed',
              }}>
                <TrendingUp size={16} /> Iniciar auditoría
              </button>
            </div>
          </div>
        </div>
      )}

      {phase === 'processing' && <ProcessingView step={pipelineStep} />}
      {phase === 'result' && result && <ResultView result={result} onReset={reset} onCopilot={goToCopilot} />}
      {phase === 'error' && <ErrorView mensaje={errorMsg} onRetry={reset} />}
    </div>
  )
}

export default function AuditorPage() {
  return (
    <React.Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'var(--font-sans)', color: 'var(--ink-30)' }}>Cargando…</div>}>
      <AuditorPageInner />
    </React.Suspense>
  )
}

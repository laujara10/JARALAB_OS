'use client'
import React from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { Card } from '@/components/ui/core/Card'
import { Badge } from '@/components/ui/core/Badge'
import { Button } from '@/components/ui/core/Button'
import { Table, Column } from '@/components/ui/data/Table'
import { StatCard } from '@/components/ui/data/StatCard'
import {
  Upload, CheckCircle2, AlertTriangle, XCircle,
  FileText, Landmark, ShoppingCart, ArrowRight, RefreshCw,
} from 'lucide-react'

function ScoreRing({ score }: { score: number }) {
  const r = 44
  const circ = 2 * Math.PI * r
  const filled = (score / 100) * circ
  const color = score >= 80 ? 'oklch(0.42 0.11 152)' : score >= 60 ? 'oklch(0.55 0.13 70)' : 'oklch(0.48 0.18 25)'
  return (
    <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
      <svg width={120} height={120} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={60} cy={60} r={r} fill="none" stroke="var(--neutral-100)" strokeWidth={8} />
        <circle cx={60} cy={60} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={`${filled} ${circ - filled}`} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--fg-primary)', lineHeight: 1 }}>
          {score}
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-widest)', marginTop: 2 }}>
          Puntuación
        </div>
      </div>
    </div>
  )
}

function UploadZone({ label, icon, accepted, badge }: { label: string; icon: React.ReactNode; accepted: string; badge?: React.ReactNode }) {
  const [drag, setDrag] = React.useState(false)
  return (
    <div
      onDragOver={e => { e.preventDefault(); setDrag(true) }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false) }}
      style={{
        border: `1.5px dashed ${drag ? 'var(--border-accent)' : 'var(--border-default)'}`,
        borderRadius: 'var(--radius-md)',
        background: drag ? 'var(--bg-accent-soft)' : 'var(--bg-surface)',
        padding: 'var(--space-6)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)',
        transition: 'all var(--duration-standard) var(--ease-standard)',
        cursor: 'pointer',
      }}
    >
      <div style={{ color: 'var(--fg-tertiary)' }}>{icon}</div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.875rem', color: 'var(--fg-primary)', marginBottom: 4 }}>
          {label}
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--fg-tertiary)' }}>
          {accepted}
        </div>
      </div>
      {badge && badge}
      <Button variant="secondary" size="sm" icon={<Upload size={13} />}>
        Seleccionar archivo
      </Button>
    </div>
  )
}

interface Finding { type: React.ReactNode; description: string; amount: string; action: React.ReactNode; [key: string]: React.ReactNode }
const FINDINGS: Finding[] = [
  { type: <Badge tone="danger" dot>Excepción</Badge>, description: 'Consignación efectivo 10 jul — sin crédito bancario encontrado', amount: '$1,200', action: <Button variant="ghost" size="sm" iconRight={<ArrowRight size={12} />}>Revisar</Button> },
  { type: <Badge tone="warning" dot>Revisar</Badge>,  description: 'Transferencia a "Sysco SA" — sin factura correspondiente',     amount: '$4,280', action: <Button variant="ghost" size="sm" iconRight={<ArrowRight size={12} />}>Revisar</Button> },
  { type: <Badge tone="warning" dot>Revisar</Badge>,  description: 'Liquidación Redeban difiere del esperado en $12.40',           amount: '$12.40', action: <Button variant="ghost" size="sm" iconRight={<ArrowRight size={12} />}>Revisar</Button> },
  { type: <Badge tone="info" dot>Info</Badge>,        description: 'Impuesto GMF deducido — dentro del rango esperado',            amount: '$84.20', action: <Button variant="ghost" size="sm">Descartar</Button> },
]
const FINDING_COLS: Column<Finding>[] = [
  { key: 'type',        label: 'Tipo' },
  { key: 'description', label: 'Hallazgo' },
  { key: 'amount',      label: 'Monto',  align: 'right', mono: true },
  { key: 'action',      label: '',       align: 'right' },
]

const RECOMMENDATIONS = [
  { icon: <CheckCircle2 size={15} color="oklch(0.42 0.11 152)" />, text: 'Exige recibos físicos para todas las consignaciones en efectivo superiores a $500.' },
  { icon: <CheckCircle2 size={15} color="oklch(0.42 0.11 152)" />, text: 'Estandariza los nombres de beneficiarios en Loggro para que coincidan con el extracto bancario.' },
  { icon: <CheckCircle2 size={15} color="oklch(0.42 0.11 152)" />, text: 'Revisa la asignación de costos de alimentos — el presupuesto de verduras requiere ajuste para Q3.' },
]

export default function AuditorPage() {
  return (
    <>
      <Topbar title="Restaurant Auditor" />
      <main style={{ padding: 'var(--space-8) var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: 1100 }}>

        <div>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--fg-primary)', marginBottom: 4 }}>
            Cargar archivos
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--fg-secondary)', marginBottom: 'var(--space-4)' }}>
            Carga el extracto bancario y la exportación de ventas de Loggro para ejecutar la auditoría del día.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
            <UploadZone
              label="Extracto bancario"
              icon={<Landmark size={28} />}
              accepted=".pdf, .csv, .xlsx — Bancolombia"
              badge={<Badge tone="success" dot>Procesado — 12 jul</Badge>}
            />
            <UploadZone
              label="Exportación de ventas Loggro"
              icon={<ShoppingCart size={28} />}
              accepted=".xlsx — exportación diaria"
              badge={<Badge tone="success" dot>Procesado — 12 jul</Badge>}
            />
            <UploadZone
              label="Hoja de gastos"
              icon={<FileText size={28} />}
              accepted=".xlsx — opcional"
            />
          </div>
        </div>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <CheckCircle2 size={20} color="oklch(0.42 0.11 152)" />
              <div>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--fg-primary)' }}>
                  Análisis completado — 12 jul, 2026
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--fg-secondary)', marginTop: 2 }}>
                  147 transacciones procesadas · 143 conciliadas automáticamente · 4 requieren revisión
                </div>
              </div>
            </div>
            <Button variant="secondary" size="sm" icon={<RefreshCw size={13} />}>
              Ejecutar de nuevo
            </Button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 'var(--space-2)', marginTop: 'var(--space-5)' }}>
            {['Ingesta', 'Normalización', 'Expectativas', 'Conciliación', 'Auditoría', 'Reporte'].map((step) => (
              <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--success-100)', border: '1px solid oklch(0.82 0.06 152)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CheckCircle2 size={14} color="oklch(0.42 0.11 152)" />
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', color: 'var(--fg-secondary)', textAlign: 'center' }}>
                  {step}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr 1fr', gap: 'var(--space-4)', alignItems: 'stretch' }}>
          <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)', minWidth: 160 }}>
            <ScoreRing score={87} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.875rem', color: 'var(--fg-primary)' }}>Puntuación general</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--fg-secondary)', marginTop: 2 }}>12 jul, 2026</div>
            </div>
          </Card>
          <StatCard label="Conciliado automáticamente" value="97.3%"  delta="+2.1pt" deltaTone="success" caption="de transacciones" />
          <StatCard label="Excepciones"                value="4"      delta="−1"     deltaTone="success" caption="vs. ayer" />
          <StatCard label="Ventas auditadas"           value="$84,210" caption="100% cobertura" />
          <StatCard label="Anomalías"                  value="1"      delta="GMF"    deltaTone="neutral"  caption="dentro del rango" />
        </div>

        <Card padding="0">
          <div style={{ padding: 'var(--space-5) var(--space-5) var(--space-4)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--fg-primary)' }}>
              Hallazgos
            </div>
            <Badge tone="warning">4 elementos requieren atención</Badge>
          </div>
          <div style={{ padding: '0 var(--space-2)' }}>
            <Table columns={FINDING_COLS} rows={FINDINGS} />
          </div>
        </Card>

        <Card>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--fg-primary)', marginBottom: 'var(--space-4)' }}>
            Recomendaciones
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {RECOMMENDATIONS.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                <span style={{ marginTop: 1, flexShrink: 0 }}>{r.icon}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--fg-primary)', lineHeight: 1.55 }}>
                  {r.text}
                </span>
              </div>
            ))}
          </div>
        </Card>

      </main>
    </>
  )
}

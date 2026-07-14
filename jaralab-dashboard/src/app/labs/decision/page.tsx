'use client'
import React from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { Card } from '@/components/ui/core/Card'
import { Badge } from '@/components/ui/core/Badge'
import { Button } from '@/components/ui/core/Button'
import { CheckCircle2, Clock, XCircle, ChevronRight } from 'lucide-react'

interface Decision {
  id: string
  title: string
  status: 'approved' | 'in-review' | 'rejected' | 'open'
  category: string
  impact: 'high' | 'medium' | 'low'
  owner: string
  date: string
  summary: string
}

const DECISIONS: Decision[] = [
  {
    id: 'D-008',
    title: 'Cambiar proveedor de verduras — reemplazar Local Farms Co-op por AgroMar',
    status: 'in-review',
    category: 'Compras',
    impact: 'high',
    owner: 'Laura J.',
    date: '12 jul, 2026',
    summary: 'La factura de Local Farms supera el presupuesto en $1,120 este mes. AgroMar ofrece calidad comparable a un 14% menor en tomates y hortalizas. Riesgo: confiabilidad de entrega desconocida.',
  },
  {
    id: 'D-007',
    title: 'Agregar servicio de brunch los domingos — 10 a.m. a 2 p.m.',
    status: 'approved',
    category: 'Operaciones',
    impact: 'high',
    owner: 'Laura J.',
    date: '28 jun, 2026',
    summary: 'Piloto de 4 domingos en julio. Meta: $4,000 adicionales en ventas semanales. Requiere 3 horas adicionales de personal por sesión. Decisión aprobada en revisión de operaciones.',
  },
  {
    id: 'D-006',
    title: 'Aumentar precios del menú en 5% en la categoría mesa',
    status: 'approved',
    category: 'Precios',
    impact: 'high',
    owner: 'Laura J.',
    date: '15 jun, 2026',
    summary: 'La presión inflacionaria en insumos justificó una revisión de precios. El ticket promedio subió de $54 a $57.40. Sin caída medible en cubiertos en las primeras 3 semanas.',
  },
  {
    id: 'D-005',
    title: 'Eliminar menú de precio fijo en el almuerzo de días hábiles',
    status: 'rejected',
    category: 'Precios',
    impact: 'medium',
    owner: 'Carlos M.',
    date: '1 jun, 2026',
    summary: 'Rechazada: el almuerzo de precio fijo genera el 28% de los cubiertos en días hábiles. El margen es menor pero el volumen lo compensa. Revisar en Q4 si los cubiertos caen por debajo de 80/día.',
  },
  {
    id: 'D-004',
    title: 'Estandarizar códigos de producto en Loggro para todas las categorías',
    status: 'approved',
    category: 'Operaciones',
    impact: 'low',
    owner: 'Laura J.',
    date: '20 may, 2026',
    summary: 'Los nombres inconsistentes de productos causaban fallas en la conciliación del audit. 23 códigos de SKU estandarizados. La tasa de conciliación automática mejoró de 89% a 97.3%.',
  },
]

const STATUS_CONFIG = {
  approved:    { tone: 'success' as const, label: 'Aprobada' },
  'in-review': { tone: 'warning' as const, label: 'En revisión' },
  rejected:    { tone: 'danger'  as const, label: 'Rechazada' },
  open:        { tone: 'neutral' as const, label: 'Abierta' },
}

const IMPACT_LABEL = { high: 'alto', medium: 'medio', low: 'bajo' }
const IMPACT_TONE  = { high: 'danger', medium: 'warning', low: 'neutral' } as const

function DecisionCard({ d }: { d: Decision }) {
  const s = STATUS_CONFIG[d.status]
  return (
    <Card style={{ cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--fg-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{d.id}</span>
            <Badge tone={s.tone}>{s.label}</Badge>
            <Badge tone="neutral">{d.category}</Badge>
            <Badge tone={IMPACT_TONE[d.impact]}>Impacto: {IMPACT_LABEL[d.impact]}</Badge>
          </div>
          <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--fg-primary)', marginBottom: 'var(--space-2)', lineHeight: 1.4 }}>{d.title}</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--fg-secondary)', lineHeight: 1.55 }}>{d.summary}</div>
          <div style={{ marginTop: 'var(--space-3)', fontSize: '0.75rem', color: 'var(--fg-tertiary)', display: 'flex', gap: 'var(--space-4)' }}>
            <span>Responsable: {d.owner}</span>
            <span>{d.date}</span>
          </div>
        </div>
        <ChevronRight size={16} color="var(--fg-tertiary)" style={{ marginTop: 4, flexShrink: 0 }} />
      </div>
    </Card>
  )
}

export default function DecisionLabPage() {
  const [filter, setFilter] = React.useState<string>('all')

  const counts = {
    all: DECISIONS.length,
    'in-review': DECISIONS.filter(d => d.status === 'in-review').length,
    approved: DECISIONS.filter(d => d.status === 'approved').length,
    rejected: DECISIONS.filter(d => d.status === 'rejected').length,
  }

  const filtered = filter === 'all' ? DECISIONS : DECISIONS.filter(d => d.status === filter)

  const FILTERS = [
    { key: 'all',       label: 'Todas' },
    { key: 'in-review', label: 'En revisión' },
    { key: 'approved',  label: 'Aprobadas' },
    { key: 'rejected',  label: 'Rechazadas' },
  ]

  return (
    <>
      <Topbar title="Decision Lab" />
      <main style={{ padding: 'var(--space-8) var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: 900 }}>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--fg-primary)', marginBottom: 4, fontStyle: 'italic' }}>
              Cada decisión importante, registrada y revisada.
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--fg-secondary)' }}>
              Las decisiones son el sistema operativo de tu restaurante. Registra qué se decidió, por qué y si funcionó.
            </div>
          </div>
          <Button variant="primary" size="sm">+ Nueva decisión</Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
          {[
            { label: 'Total',        value: counts.all },
            { label: 'En revisión',  value: counts['in-review'] },
            { label: 'Aprobadas',    value: counts.approved },
            { label: 'Rechazadas',   value: counts.rejected },
          ].map(s => (
            <Card key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 700, color: 'var(--fg-primary)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)', marginTop: 6, textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)' }}>{s.label}</div>
            </Card>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: '6px 14px', borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: filter === f.key ? 'var(--primary-700)' : 'var(--border-default)',
                background: filter === f.key ? 'var(--primary-700)' : 'transparent',
                color: filter === f.key ? 'white' : 'var(--fg-secondary)',
                fontSize: '0.8125rem', cursor: 'pointer', fontFamily: 'var(--font-sans)',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {filtered.map(d => <DecisionCard key={d.id} d={d} />)}
        </div>

      </main>
    </>
  )
}

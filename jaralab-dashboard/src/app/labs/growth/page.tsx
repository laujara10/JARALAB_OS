'use client'
import React from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { Card } from '@/components/ui/core/Card'
import { Badge } from '@/components/ui/core/Badge'
import { Button } from '@/components/ui/core/Button'
import { TrendingUp, TrendingDown, Plus } from 'lucide-react'

interface Experiment {
  id: string
  hypothesis: string
  status: 'running' | 'won' | 'lost' | 'draft'
  channel: string
  startDate: string
  endDate?: string
  metric: string
  baseline: string
  result?: string
  lift?: number
  confidence?: number
  summary: string
}

const EXPERIMENTS: Experiment[] = [
  {
    id: 'EXP-006',
    hypothesis: 'Agregar fotos de postres en la carta aumenta la tasa de venta de postres en un 15%.',
    status: 'running',
    channel: 'Mesa',
    startDate: '7 jul, 2026',
    metric: 'Tasa de venta de postres',
    baseline: '18%',
    summary: 'Carta visual actualizada el 7 jul. Medición diaria. Muestra actual: 4 días, 1.248 cubiertos.',
  },
  {
    id: 'EXP-005',
    hypothesis: 'Ofrecer happy hour (6–7 p.m., mar–jue) aumentará las ventas del bar en un 20%.',
    status: 'won',
    channel: 'Bar',
    startDate: '2 jun, 2026',
    endDate: '29 jun, 2026',
    metric: 'Ventas del bar (mar–jue, 6–7 p.m.)',
    baseline: '$410/semana',
    result: '$680/semana',
    lift: 65.9,
    confidence: 94,
    summary: 'Happy hour funcionó 4 semanas. Ventas del bar en los días objetivo subieron 66%. Decisión: hacer permanente desde el 1 jul.',
  },
  {
    id: 'EXP-004',
    hypothesis: 'Ofrecer una tarjeta de sellos de fidelización aumenta la tasa de visitas repetidas en 60 días.',
    status: 'running',
    channel: 'Todos',
    startDate: '15 jun, 2026',
    metric: 'Tasa de visita repetida (ventana de 60 días)',
    baseline: '31%',
    summary: 'Tarjetas de sellos distribuidas a 210 clientes. Se alcanzó la marca de 45 días. Datos preliminares muestran 38% de tasa de retorno — 7 puntos por encima de la referencia, pero la muestra aún madura.',
  },
  {
    id: 'EXP-003',
    hypothesis: 'Capacitar a los meseros en maridaje de vinos aumenta el ticket promedio en $8.',
    status: 'won',
    channel: 'Mesa',
    startDate: '10 may, 2026',
    endDate: '7 jun, 2026',
    metric: 'Ticket promedio (mesa)',
    baseline: '$54.00',
    result: '$57.40',
    lift: 6.3,
    confidence: 88,
    summary: 'Guión de maridaje entrenado con todo el equipo de sala. Ticket promedio subió $3.40. Menor de lo esperado, pero validado. Integrado al onboarding.',
  },
  {
    id: 'EXP-002',
    hypothesis: 'Los pedidos de domicilio por catálogo de WhatsApp convierten mejor que los pedidos por teléfono.',
    status: 'lost',
    channel: 'Domicilio',
    startDate: '1 abr, 2026',
    endDate: '28 abr, 2026',
    metric: 'Tasa de conversión de pedidos domicilio',
    baseline: '68%',
    result: '61%',
    lift: -10.3,
    confidence: 91,
    summary: 'La adopción del catálogo de WhatsApp fue baja (solo el 34% de los clientes lo usó). Los pedidos por teléfono convierten mejor. El catálogo sigue en uso para claridad del menú — no como herramienta principal de conversión.',
  },
  {
    id: 'EXP-001',
    hypothesis: 'Publicar video de preparación de cocina los sábados en Instagram aumenta las reservas del sábado.',
    status: 'draft',
    channel: 'Redes sociales',
    startDate: '14 jul, 2026',
    metric: 'Cubiertos del sábado',
    baseline: '290 prom.',
    summary: 'Hipótesis redactada. Pendiente creación de contenido. Inicio previsto: 14 jul.',
  },
]

const STATUS_CONFIG = {
  running: { tone: 'info'    as const, label: 'En curso' },
  won:     { tone: 'success' as const, label: 'Ganado' },
  lost:    { tone: 'danger'  as const, label: 'Perdido' },
  draft:   { tone: 'neutral' as const, label: 'Borrador' },
}

function LiftIndicator({ lift }: { lift: number }) {
  const color = lift > 0 ? 'oklch(0.42 0.11 152)' : 'oklch(0.48 0.18 25)'
  const Icon = lift > 0 ? TrendingUp : TrendingDown
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color, fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
      <Icon size={14} />
      {lift > 0 ? '+' : ''}{lift.toFixed(1)}%
    </div>
  )
}

function ExperimentCard({ e }: { e: Experiment }) {
  const s = STATUS_CONFIG[e.status]
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--fg-tertiary)' }}>{e.id}</span>
            <Badge tone={s.tone}>{s.label}</Badge>
            <Badge tone="neutral">{e.channel}</Badge>
          </div>
          <div style={{ fontWeight: 500, fontSize: '0.9375rem', color: 'var(--fg-primary)', lineHeight: 1.45, fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
            "{e.hypothesis}"
          </div>
        </div>
        {e.lift !== undefined && <LiftIndicator lift={e.lift} />}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
        <div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', marginBottom: 2 }}>Métrica</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--fg-primary)' }}>{e.metric}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', marginBottom: 2 }}>Referencia</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--fg-primary)', fontVariantNumeric: 'tabular-nums' }}>{e.baseline}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', marginBottom: 2 }}>Resultado</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: e.result ? 'var(--fg-primary)' : 'var(--fg-tertiary)', fontVariantNumeric: 'tabular-nums' }}>
            {e.result ?? '—'}
          </div>
        </div>
      </div>

      <div style={{ fontSize: '0.8125rem', color: 'var(--fg-secondary)', lineHeight: 1.55, marginBottom: 'var(--space-3)' }}>{e.summary}</div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--fg-tertiary)' }}>
        <span>Inicio {e.startDate}{e.endDate ? ` · Fin ${e.endDate}` : ''}</span>
        {e.confidence !== undefined && (
          <span style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>{e.confidence}% confianza</span>
        )}
      </div>
    </Card>
  )
}

export default function GrowthLabPage() {
  const [filter, setFilter] = React.useState<string>('all')

  const counts = {
    all: EXPERIMENTS.length,
    running: EXPERIMENTS.filter(e => e.status === 'running').length,
    won: EXPERIMENTS.filter(e => e.status === 'won').length,
    lost: EXPERIMENTS.filter(e => e.status === 'lost').length,
  }

  const filtered = filter === 'all' ? EXPERIMENTS : EXPERIMENTS.filter(e => e.status === filter)
  const wonRate = Math.round((counts.won / (counts.won + counts.lost)) * 100)

  const FILTERS = [
    { key: 'all',     label: 'Todos' },
    { key: 'running', label: 'En curso' },
    { key: 'won',     label: 'Ganados' },
    { key: 'lost',    label: 'Perdidos' },
    { key: 'draft',   label: 'Borradores' },
  ]

  return (
    <>
      <Topbar title="Growth Lab" />
      <main style={{ padding: 'var(--space-8) var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: 960 }}>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--fg-primary)', marginBottom: 4, fontStyle: 'italic' }}>
              Primero la hipótesis. Luego los datos. Al final, la convicción.
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--fg-secondary)' }}>
              Cada idea de crecimiento se ejecuta como un experimento medible. Sin escalar por intuición — solo apuestas validadas.
            </div>
          </div>
          <Button variant="primary" size="sm" icon={<Plus size={13} />}>Nuevo experimento</Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
          {[
            { label: 'Total experimentos', value: counts.all },
            { label: 'En curso',           value: counts.running },
            { label: 'Tasa de acierto',    value: `${wonRate}%` },
            { label: 'Experimentos ganados',value: counts.won },
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
          {filtered.map(e => <ExperimentCard key={e.id} e={e} />)}
        </div>

      </main>
    </>
  )
}

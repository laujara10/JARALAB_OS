'use client'
import React from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { StatCard } from '@/components/ui/data/StatCard'
import { Sparkline } from '@/components/ui/data/Sparkline'
import { BarChart } from '@/components/ui/data/BarChart'
import { Table, Column } from '@/components/ui/data/Table'
import { Badge } from '@/components/ui/core/Badge'
import { Card } from '@/components/ui/core/Card'
import { Tabs } from '@/components/ui/navigation/Tabs'

const WEEKLY = [58200, 61400, 63800, 59900, 68200, 72100, 76400, 84210]
const DAILY  = [10200, 14800, 12100, 9400, 13600, 16200, 7910]

const BY_CHANNEL: { label: string; value: number }[] = [
  { label: 'Mesa',       value: 42105 },
  { label: 'Domicilio',  value: 25263 },
  { label: 'Para llevar',value: 12632 },
  { label: 'Bar',        value: 4210  },
]

const BY_METHOD: { label: string; value: number }[] = [
  { label: 'Tarjeta',      value: 58947 },
  { label: 'Efectivo',     value: 16842 },
  { label: 'Transferencia',value: 8421  },
]

interface TopItem { day: string; revenue: string; covers: string; avg_ticket: string; vs_prev: React.ReactNode; [key: string]: React.ReactNode }
const TOP_DAYS: TopItem[] = [
  { day: 'Sábado 12 jul',   revenue: '$18,420', covers: '312', avg_ticket: '$59', vs_prev: <Badge tone="success" dot>+12%</Badge> },
  { day: 'Viernes 11 jul',  revenue: '$16,100', covers: '278', avg_ticket: '$58', vs_prev: <Badge tone="success" dot>+8%</Badge> },
  { day: 'Domingo 6 jul',   revenue: '$14,800', covers: '264', avg_ticket: '$56', vs_prev: <Badge tone="neutral" dot>+1%</Badge> },
  { day: 'Jueves 10 jul',   revenue: '$11,200', covers: '196', avg_ticket: '$57', vs_prev: <Badge tone="danger" dot>−4%</Badge> },
  { day: 'Miércoles 9 jul', revenue: '$9,400',  covers: '168', avg_ticket: '$56', vs_prev: <Badge tone="neutral" dot>+0%</Badge> },
]

const TOP_COLS: Column<TopItem>[] = [
  { key: 'day',        label: 'Día' },
  { key: 'revenue',    label: 'Ventas',          align: 'right', mono: true },
  { key: 'covers',     label: 'Cubiertos',       align: 'right', mono: true },
  { key: 'avg_ticket', label: 'Ticket promedio', align: 'right', mono: true },
  { key: 'vs_prev',    label: 'vs. anterior',    align: 'right' },
]

export default function RevenuePage() {
  const [tab, setTab] = React.useState('weekly')

  return (
    <>
      <Topbar title="Ventas" />
      <main style={{ padding: 'var(--space-8) var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: 1200 }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
          <StatCard label="Este mes"        value="$84,210" delta="+4.8%"  deltaTone="success" caption="vs. mes anterior" />
          <StatCard label="Esta semana"     value="$21,400" delta="+6.2%"  deltaTone="success" caption="vs. semana anterior" />
          <StatCard label="Hoy"             value="$7,910"  delta="−2.1%"  deltaTone="danger"  caption="vs. ayer" />
          <StatCard label="Ticket promedio" value="$57.40"  delta="+$2.10" deltaTone="success" caption="por cubierto" />
        </div>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--fg-primary)' }}>Tendencia de ventas</div>
            <Tabs tabs={[{ label: 'Semanal', value: 'weekly' }, { label: 'Diario', value: 'daily' }]} value={tab} onChange={setTab} />
          </div>
          <Sparkline data={tab === 'weekly' ? WEEKLY : DAILY} width={900} height={100} />
          <div style={{ display: 'flex', gap: 'var(--space-8)', marginTop: 'var(--space-4)' }}>
            {[
              { label: 'Día pico',     value: 'Sábado',    sub: '$18,420 prom.' },
              { label: 'Hora pico',    value: '8 – 9 pm',  sub: '22% de ventas diarias' },
              { label: 'Día más lento',value: 'Martes',    sub: '$6,200 prom.' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)', marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--fg-primary)', fontSize: '1rem', fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--fg-secondary)', marginTop: 2 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <Card>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--fg-primary)', marginBottom: 'var(--space-5)' }}>Por canal</div>
            <BarChart data={BY_CHANNEL} height={140} formatValue={v => `$${(v / 1000).toFixed(1)}k`} />
            <div style={{ marginTop: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {BY_CHANNEL.map((d, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--fg-secondary)' }}>{d.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-primary)' }}>
                    ${d.value.toLocaleString()} <span style={{ color: 'var(--fg-tertiary)', fontSize: '0.75rem' }}>({Math.round(d.value / 84210 * 100)}%)</span>
                  </span>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--fg-primary)', marginBottom: 'var(--space-5)' }}>Por método de pago</div>
            <BarChart data={BY_METHOD} height={140} color="var(--gold-500)" formatValue={v => `$${(v / 1000).toFixed(1)}k`} />
            <div style={{ marginTop: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {BY_METHOD.map((d, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--fg-secondary)' }}>{d.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-primary)' }}>
                    ${d.value.toLocaleString()} <span style={{ color: 'var(--fg-tertiary)', fontSize: '0.75rem' }}>({Math.round(d.value / 84210 * 100)}%)</span>
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card padding="0">
          <div style={{ padding: 'var(--space-5) var(--space-5) var(--space-4)', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--fg-primary)' }}>Mejores días de ventas — este mes</div>
          </div>
          <div style={{ padding: '0 var(--space-2)' }}>
            <Table columns={TOP_COLS} rows={TOP_DAYS} />
          </div>
        </Card>

      </main>
    </>
  )
}

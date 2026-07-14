'use client'
import React from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { StatCard } from '@/components/ui/data/StatCard'
import { BarChart } from '@/components/ui/data/BarChart'
import { Table, Column } from '@/components/ui/data/Table'
import { Badge } from '@/components/ui/core/Badge'
import { Card } from '@/components/ui/core/Card'
import { Sparkline } from '@/components/ui/data/Sparkline'

const HOURS_BY_DAY: { label: string; value: number; value2?: number }[] = [
  { label: 'Lun', value: 48, value2: 44 },
  { label: 'Mar', value: 44, value2: 44 },
  { label: 'Mié', value: 50, value2: 44 },
  { label: 'Jue', value: 52, value2: 44 },
  { label: 'Vie', value: 68, value2: 60 },
  { label: 'Sáb', value: 72, value2: 60 },
  { label: 'Dom', value: 56, value2: 52 },
]

const LABOR_TREND = [32.4, 31.8, 32.1, 31.4, 30.9, 31.2, 31.8, 31.2]

interface StaffRow { name: string; role: React.ReactNode; hours: string; rate: string; total: string; status: React.ReactNode; [key: string]: React.ReactNode }
const STAFF: StaffRow[] = [
  { name: 'Carlos M.',    role: <Badge tone="neutral">Chef principal</Badge>,    hours: '48h', rate: '$18/h', total: '$864', status: <Badge tone="success" dot>En horario</Badge> },
  { name: 'Valentina R.', role: <Badge tone="neutral">Sous chef</Badge>,        hours: '44h', rate: '$14/h', total: '$616', status: <Badge tone="success" dot>En horario</Badge> },
  { name: 'Miguel A.',    role: <Badge tone="neutral">Gerente de sala</Badge>,  hours: '52h', rate: '$13/h', total: '$676', status: <Badge tone="warning" dot>Horas extra ×2</Badge> },
  { name: 'Sofía L.',     role: <Badge tone="neutral">Mesera</Badge>,           hours: '38h', rate: '$9/h',  total: '$342', status: <Badge tone="success" dot>En horario</Badge> },
  { name: 'Andrés P.',    role: <Badge tone="neutral">Mesero</Badge>,           hours: '42h', rate: '$9/h',  total: '$378', status: <Badge tone="neutral" dot>+4h flex</Badge>   },
  { name: 'Isabel C.',    role: <Badge tone="neutral">Cajera</Badge>,           hours: '40h', rate: '$8/h',  total: '$320', status: <Badge tone="success" dot>En horario</Badge> },
  { name: 'Luis G.',      role: <Badge tone="neutral">Auxiliar cocina</Badge>,  hours: '44h', rate: '$8/h',  total: '$352', status: <Badge tone="success" dot>En horario</Badge> },
]
const STAFF_COLS: Column<StaffRow>[] = [
  { key: 'name',   label: 'Empleado' },
  { key: 'role',   label: 'Cargo' },
  { key: 'hours',  label: 'Horas',   align: 'right', mono: true },
  { key: 'rate',   label: 'Tarifa',  align: 'right', mono: true },
  { key: 'total',  label: 'Total',   align: 'right', mono: true },
  { key: 'status', label: 'Estado',  align: 'right' },
]

export default function LaborPage() {
  return (
    <>
      <Topbar title="Personal" />
      <main style={{ padding: 'var(--space-8) var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: 1200 }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
          <StatCard label="% Personal"       value="31.2%"   delta="−0.4pt" deltaTone="success" caption="objetivo: 32%" />
          <StatCard label="Costo total personal" value="$26,280" delta="+1.8%" deltaTone="danger" caption="este mes" />
          <StatCard label="Total horas"      value="308h"    caption="esta semana" />
          <StatCard label="Horas extra"      value="18h"     delta="Miguel A." deltaTone="neutral" caption="esta semana" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-4)' }}>
          <Card>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--fg-primary)', marginBottom: 4 }}>Horas trabajadas vs. programadas — esta semana</div>
            <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--fg-secondary)' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--accent-primary)', display: 'inline-block' }} />
                Real
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--fg-secondary)' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--accent-primary)', opacity: 0.35, display: 'inline-block' }} />
                Programado
              </div>
            </div>
            <BarChart data={HOURS_BY_DAY} height={140} color="var(--accent-primary)" color2="var(--primary-200)" formatValue={v => `${v}h`} />
          </Card>
          <Card>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--fg-primary)', marginBottom: 4 }}>% Personal — 8 semanas</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)', marginBottom: 'var(--space-4)' }}>Objetivo 32.0%</div>
            <Sparkline data={LABOR_TREND} width={280} height={80} />
            <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[
                { label: 'Cocina',         value: '18.4%' },
                { label: 'Sala',           value: '8.6%'  },
                { label: 'Administración', value: '4.2%'  },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--fg-secondary)' }}>{r.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-primary)' }}>{r.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card padding="0">
          <div style={{ padding: 'var(--space-5) var(--space-5) var(--space-4)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--fg-primary)' }}>Personal — esta semana</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--fg-secondary)', fontVariantNumeric: 'tabular-nums' }}>
              Nómina total: <strong style={{ color: 'var(--fg-primary)' }}>$3,548</strong>
            </div>
          </div>
          <div style={{ padding: '0 var(--space-2)' }}>
            <Table columns={STAFF_COLS} rows={STAFF} />
          </div>
        </Card>

      </main>
    </>
  )
}

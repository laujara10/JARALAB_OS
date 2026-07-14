'use client'
import React from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { StatCard } from '@/components/ui/data/StatCard'
import { Sparkline } from '@/components/ui/data/Sparkline'
import { Table, Column } from '@/components/ui/data/Table'
import { Badge } from '@/components/ui/core/Badge'
import { Card } from '@/components/ui/core/Card'
import { Button } from '@/components/ui/core/Button'
import { Tabs } from '@/components/ui/navigation/Tabs'
import { AlertTriangle, CheckCircle2, Clock, ArrowRight, TrendingUp, Receipt } from 'lucide-react'

const REVENUE_DATA = [62000, 68000, 65000, 71000, 76000, 74000, 80000, 84210]
const COST_DATA    = [18600, 20400, 19500, 20590, 22040, 21460, 23200, 24278]

interface ActivityRow { date: string; event: React.ReactNode; amount: string; status: React.ReactNode; [key: string]: React.ReactNode }
const ACTIVITY: ActivityRow[] = [
  { date: '12 jul', event: 'Conciliación Bancolombia',        amount: '$84,210', status: <Badge tone="success" dot>Conciliado</Badge> },
  { date: '12 jul', event: 'Exportación ventas Loggro',       amount: '$84,210', status: <Badge tone="success" dot>Procesado</Badge> },
  { date: '11 jul', event: 'Transferencia — Sysco',           amount: '$4,280',  status: <Badge tone="warning" dot>Pendiente</Badge> },
  { date: '11 jul', event: 'Liquidación tarjeta — Redeban',   amount: '$2,940',  status: <Badge tone="success" dot>Conciliado</Badge> },
  { date: '10 jul', event: 'Consignación en efectivo',        amount: '$1,200',  status: <Badge tone="danger" dot>Excepción</Badge> },
]

const ACTIVITY_COLS: Column<ActivityRow>[] = [
  { key: 'date',   label: 'Fecha' },
  { key: 'event',  label: 'Evento' },
  { key: 'amount', label: 'Monto', align: 'right', mono: true },
  { key: 'status', label: 'Estado', align: 'right' },
]

interface AlertItem { tone: 'warning' | 'danger' | 'info'; icon: React.ReactNode; title: string; desc: string }
const ALERTS: AlertItem[] = [
  { tone: 'danger',  icon: <AlertTriangle size={14} />, title: 'Excepción en efectivo',       desc: 'Consignación del 10 jul de $1,200 sin crédito bancario correspondiente.' },
  { tone: 'warning', icon: <AlertTriangle size={14} />, title: 'Costo de alimentos +3.2%',    desc: 'Gasto en verduras excede el presupuesto en $1,840 esta semana.' },
  { tone: 'info',    icon: <Clock size={14} />,         title: 'Liquidación pendiente',       desc: 'Redeban T+1 del 12 jul — esperada el 13 jul.' },
]

interface ActionItem { label: string; cta: string }
const ACTIONS: ActionItem[] = [
  { label: 'Revisar 3 transacciones sin conciliar', cta: 'Ver excepciones' },
  { label: 'Aprobar informe de costos de julio',    cta: 'Revisar' },
  { label: 'Programar pago proveedor — Sysco',      cta: 'Programar' },
]

export default function DashboardOverview() {
  const [tab, setTab] = React.useState('overview')

  return (
    <>
      <Topbar title="Resumen" />

      <main style={{ padding: 'var(--space-8) var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: 1200 }}>

        <div>
          <div style={{
            fontFamily: 'var(--font-serif)', fontSize: '1.75rem',
            fontStyle: 'italic', color: 'var(--fg-primary)', lineHeight: 1.3,
            marginBottom: 6,
          }}>
            "El costo de alimentos subió 3.2% esta semana. Las verduras son el factor principal."
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--fg-tertiary)' }}>
            JaraLab AI · generado con los datos de esta semana · 12 jul, 2026
          </div>
        </div>

        <Tabs
          tabs={[
            { label: 'Resumen',  value: 'overview' },
            { label: 'Ventas',   value: 'revenue' },
            { label: 'Costos',   value: 'costs' },
            { label: 'Personal', value: 'labor' },
          ]}
          value={tab}
          onChange={setTab}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
          <StatCard label="Ventas"          value="$84,210" delta="+4.8%"  deltaTone="success" caption="vs. mes anterior" />
          <StatCard label="% Costo alimentos" value="28.4%" delta="+1.1pt" deltaTone="danger"  caption="vs. mes anterior" />
          <StatCard label="% Personal"      value="31.2%"   delta="-0.4pt" deltaTone="success" caption="vs. mes anterior" />
          <StatCard label="Margen neto"     value="14.6%"   delta="+0.6pt" deltaTone="success" caption="vs. mes anterior" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-4)' }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--fg-primary)' }}>
                Ventas, últimas 8 semanas
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--fg-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                $84,210 <span style={{ color: 'oklch(0.42 0.11 152)' }}>+4.8%</span>
              </div>
            </div>
            <Sparkline data={REVENUE_DATA} width={600} height={80} />
          </Card>
          <Card>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--fg-primary)', marginBottom: 'var(--space-4)' }}>
              Costo de alimentos, últimas 8 semanas
            </div>
            <Sparkline data={COST_DATA} width={240} height={80} color="var(--danger-500)" />
            <div style={{ marginTop: 'var(--space-3)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--fg-tertiary)', fontVariantNumeric: 'tabular-nums' }}>
              28.4% ratio costo alimentos
            </div>
          </Card>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <Card padding="0">
            <div style={{ padding: 'var(--space-5) var(--space-5) var(--space-3)', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--fg-primary)' }}>
                Alertas
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {ALERTS.map((a, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 'var(--space-3)',
                  padding: 'var(--space-4) var(--space-5)',
                  borderBottom: i < ALERTS.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                }}>
                  <span style={{ color: a.tone === 'danger' ? 'var(--danger-500)' : a.tone === 'warning' ? 'var(--warning-500)' : 'var(--info-500)', marginTop: 1, flexShrink: 0 }}>
                    {a.icon}
                  </span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.8125rem', color: 'var(--fg-primary)', marginBottom: 2 }}>
                      {a.title}
                    </div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--fg-secondary)', lineHeight: 1.5 }}>
                      {a.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="0">
            <div style={{ padding: 'var(--space-5) var(--space-5) var(--space-3)', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--fg-primary)' }}>
                Próximas acciones
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {ACTIONS.map((a, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)',
                  padding: 'var(--space-4) var(--space-5)',
                  borderBottom: i < ACTIONS.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                }}>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--fg-primary)' }}>
                    {a.label}
                  </div>
                  <Button variant="ghost" size="sm" iconRight={<ArrowRight size={13} />}>
                    {a.cta}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card padding="0">
          <div style={{ padding: 'var(--space-5) var(--space-5) var(--space-4)', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--fg-primary)' }}>
              Actividad reciente
            </div>
          </div>
          <div style={{ padding: '0 var(--space-2)' }}>
            <Table columns={ACTIVITY_COLS} rows={ACTIVITY} />
          </div>
        </Card>

      </main>
    </>
  )
}

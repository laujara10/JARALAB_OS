'use client'
import React from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { StatCard } from '@/components/ui/data/StatCard'
import { Sparkline } from '@/components/ui/data/Sparkline'
import { BarChart } from '@/components/ui/data/BarChart'
import { Table, Column } from '@/components/ui/data/Table'
import { Badge } from '@/components/ui/core/Badge'
import { Card } from '@/components/ui/core/Card'
import { Button } from '@/components/ui/core/Button'
import { AlertTriangle, ArrowRight } from 'lucide-react'

const FOOD_TREND  = [24.8, 25.1, 26.2, 25.8, 27.1, 26.9, 27.8, 28.4]
const LABOR_TREND = [31.8, 32.1, 31.4, 30.9, 31.2, 31.8, 30.8, 31.2]

const VENDOR_DATA: { label: string; value: number }[] = [
  { label: 'Verduras',  value: 9820 },
  { label: 'Proteínas', value: 7640 },
  { label: 'Lácteos',   value: 3210 },
  { label: 'Secos',     value: 2910 },
  { label: 'Bebidas',   value: 2180 },
  { label: 'Otros',     value: 1840 },
]

interface VendorRow { vendor: string; category: React.ReactNode; spent: string; budget: string; variance: React.ReactNode; [key: string]: React.ReactNode }
const VENDORS: VendorRow[] = [
  { vendor: 'Local Farms Co-op', category: <Badge tone="neutral">Verduras</Badge>,  spent: '$6,120', budget: '$5,000', variance: <Badge tone="danger"  dot>+$1,120</Badge> },
  { vendor: 'Sysco Colombia',    category: <Badge tone="neutral">Proteínas</Badge>, spent: '$4,280', budget: '$4,500', variance: <Badge tone="success" dot>−$220</Badge>  },
  { vendor: 'Alpina',            category: <Badge tone="neutral">Lácteos</Badge>,   spent: '$3,210', budget: '$3,200', variance: <Badge tone="neutral" dot>+$10</Badge>   },
  { vendor: 'US Foods',          category: <Badge tone="neutral">Secos</Badge>,     spent: '$2,910', budget: '$3,000', variance: <Badge tone="success" dot>−$90</Badge>   },
  { vendor: 'Bavaria',           category: <Badge tone="neutral">Bebidas</Badge>,   spent: '$2,180', budget: '$2,000', variance: <Badge tone="warning" dot>+$180</Badge>  },
]
const VENDOR_COLS: Column<VendorRow>[] = [
  { key: 'vendor',   label: 'Proveedor' },
  { key: 'category', label: 'Categoría' },
  { key: 'spent',    label: 'Gastado',      align: 'right', mono: true },
  { key: 'budget',   label: 'Presupuesto',  align: 'right', mono: true },
  { key: 'variance', label: 'Varianza',     align: 'right' },
]

export default function CostsPage() {
  return (
    <>
      <Topbar title="Costos" />
      <main style={{ padding: 'var(--space-8) var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: 1200 }}>

        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)',
          background: 'var(--warning-100)', border: '1px solid oklch(0.85 0.08 80)',
          borderRadius: 'var(--radius-md)', padding: 'var(--space-4) var(--space-5)',
        }}>
          <AlertTriangle size={16} color="oklch(0.55 0.13 70)" style={{ marginTop: 1, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--fg-primary)', marginBottom: 2 }}>
              Costo de alimentos por encima del objetivo
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--fg-secondary)' }}>
              Costo de alimentos en 28.4% — 1.4 puntos por encima del objetivo del 27%. Las verduras son el principal factor (+$1,120 sobre presupuesto este mes).
            </div>
          </div>
          <Button variant="secondary" size="sm" iconRight={<ArrowRight size={12} />}>Revisar</Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
          <StatCard label="% Costo alimentos" value="28.4%" delta="+1.4pt" deltaTone="danger"  caption="objetivo: 27.0%" />
          <StatCard label="% Personal"        value="31.2%" delta="−0.4pt" deltaTone="success" caption="objetivo: 32.0%" />
          <StatCard label="Ocupación"         value="8.2%"  caption="arriendo + servicios" />
          <StatCard label="COGS total"        value="$55,340" delta="+3.1%" deltaTone="danger" caption="de $84,210 en ventas" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <Card>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--fg-primary)', marginBottom: 4 }}>% Costo alimentos — 8 semanas</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)', marginBottom: 'var(--space-4)' }}>Objetivo 27.0%</div>
            <Sparkline data={FOOD_TREND} width={460} height={80} color="var(--danger-500)" />
          </Card>
          <Card>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--fg-primary)', marginBottom: 4 }}>% Personal — 8 semanas</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)', marginBottom: 'var(--space-4)' }}>Objetivo 32.0%</div>
            <Sparkline data={LABOR_TREND} width={460} height={80} color="var(--accent-primary)" />
          </Card>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '5fr 3fr', gap: 'var(--space-4)' }}>
          <Card padding="0">
            <div style={{ padding: 'var(--space-5) var(--space-5) var(--space-4)', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--fg-primary)' }}>Gasto proveedores este mes</div>
            </div>
            <div style={{ padding: '0 var(--space-2)' }}>
              <Table columns={VENDOR_COLS} rows={VENDORS} />
            </div>
          </Card>

          <Card>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--fg-primary)', marginBottom: 'var(--space-5)' }}>Costo de alimentos por categoría</div>
            <BarChart data={VENDOR_DATA} height={160} formatValue={v => `$${(v / 1000).toFixed(1)}k`} />
            <div style={{ marginTop: 'var(--space-5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--fg-tertiary)', marginBottom: 'var(--space-2)' }}>
                <span>COGS total alimentos</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>$27,600</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--fg-tertiary)' }}>
                <span>% de ventas</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'oklch(0.48 0.18 25)' }}>28.4%</span>
              </div>
            </div>
          </Card>
        </div>

      </main>
    </>
  )
}

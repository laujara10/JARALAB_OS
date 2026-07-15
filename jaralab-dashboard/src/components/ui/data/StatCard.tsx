import React from 'react'

type DeltaTone = 'success' | 'danger' | 'neutral'

interface StatCardProps {
  label: string
  value: string
  delta?: string
  deltaTone?: DeltaTone
  caption?: string
  style?: React.CSSProperties
}

// v3: panel + hairline, sin sombra, delta texto-solo
const deltaColors: Record<DeltaTone, string> = {
  success: 'var(--success-fg)',
  danger:  'var(--urgente)',
  neutral: 'var(--ink-30)',
}

export function StatCard({ label, value, delta, deltaTone = 'success', caption, style }: StatCardProps) {
  return (
    <div style={{
      background: 'var(--panel)',
      border: '1px solid var(--hairline)',
      padding: 'var(--space-5)',
      minWidth: 160,
      ...style,
    }}>
      <div style={{ fontSize: '0.75rem', color: 'var(--ink-55)', marginBottom: 6, fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '1.625rem', fontWeight: 600,
          color: 'var(--ink)', fontVariantNumeric: 'tabular-nums',
        }}>
          {value}
        </div>
        {delta && (
          <span style={{
            fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 500,
            color: deltaColors[deltaTone],
          }}>
            {delta}
          </span>
        )}
      </div>
      {caption && (
        <div style={{ fontSize: '0.75rem', color: 'var(--ink-30)', marginTop: 4 }}>
          {caption}
        </div>
      )}
    </div>
  )
}

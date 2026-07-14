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

const deltaColors: Record<DeltaTone, string> = {
  success: 'oklch(0.42 0.11 152)',
  danger:  'oklch(0.48 0.18 25)',
  neutral: 'var(--fg-tertiary)',
}

export function StatCard({ label, value, delta, deltaTone = 'success', caption, style }: StatCardProps) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-5)',
      boxShadow: 'var(--shadow-xs)',
      minWidth: 160,
      ...style,
    }}>
      <div style={{ fontSize: '0.8125rem', color: 'var(--fg-secondary)', marginBottom: 8, fontFamily: 'var(--font-sans)' }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 600,
          color: 'var(--fg-primary)', fontVariantNumeric: 'tabular-nums',
        }}>
          {value}
        </div>
        {delta && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 500,
            color: deltaColors[deltaTone],
          }}>
            {delta}
          </span>
        )}
      </div>
      {caption && (
        <div style={{ fontSize: '0.75rem', color: 'var(--fg-tertiary)', marginTop: 6 }}>
          {caption}
        </div>
      )}
    </div>
  )
}

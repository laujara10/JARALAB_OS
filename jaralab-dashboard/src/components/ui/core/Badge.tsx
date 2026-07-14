'use client'
import React from 'react'

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'gold'

interface BadgeProps {
  children: React.ReactNode
  tone?: Tone
  dot?: boolean
  style?: React.CSSProperties
}

const toneStyles: Record<Tone, { bg: string; color: string; border: string }> = {
  neutral: { bg: 'var(--neutral-100)', color: 'var(--fg-secondary)', border: 'var(--neutral-200)' },
  success: { bg: 'var(--success-100)', color: 'oklch(0.42 0.11 152)', border: 'oklch(0.82 0.06 152)' },
  warning: { bg: 'var(--warning-100)', color: 'oklch(0.55 0.13 70)', border: 'oklch(0.85 0.08 80)' },
  danger:  { bg: 'var(--danger-100)',  color: 'oklch(0.48 0.18 25)',  border: 'oklch(0.82 0.08 25)' },
  info:    { bg: 'var(--info-100)',    color: 'oklch(0.42 0.10 240)', border: 'oklch(0.80 0.05 240)' },
  gold:    { bg: 'var(--gold-100)',    color: 'var(--fg-gold)',        border: 'var(--gold-200)' },
}

export function Badge({ children, tone = 'neutral', dot, style }: BadgeProps) {
  const t = toneStyles[tone]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 8px', borderRadius: 'var(--radius-full)',
      background: t.bg, color: t.color,
      border: `1px solid ${t.border}`,
      fontFamily: 'var(--font-sans)', fontSize: '0.6875rem',
      fontWeight: 500, letterSpacing: 'var(--tracking-wide)',
      whiteSpace: 'nowrap',
      ...style,
    }}>
      {dot && (
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: t.color, flexShrink: 0 }} />
      )}
      {children}
    </span>
  )
}

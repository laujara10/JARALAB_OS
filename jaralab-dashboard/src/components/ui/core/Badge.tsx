'use client'
import React from 'react'

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'gold'

interface BadgeProps {
  children: React.ReactNode
  tone?: Tone
  dot?: boolean
  style?: React.CSSProperties
}

// v3: SIN fondo relleno — texto en color de severidad + punto opcional
const toneColor: Record<Tone, string> = {
  neutral: 'var(--ink-55)',
  success: 'var(--success-fg)',
  warning: 'var(--warning-fg)',
  danger:  'var(--urgente)',
  info:    'var(--teal)',
  gold:    'var(--fg-gold)',
}

export function Badge({ children, tone = 'neutral', dot, style }: BadgeProps) {
  const color = toneColor[tone]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 0',
      color,
      fontFamily: 'var(--font-sans)', fontSize: '0.6875rem',
      fontWeight: 500, letterSpacing: '0.04em',
      whiteSpace: 'nowrap',
      ...style,
    }}>
      {dot && (
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
      )}
      {children}
    </span>
  )
}

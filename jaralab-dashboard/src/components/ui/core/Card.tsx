import React from 'react'

interface CardProps {
  children: React.ReactNode
  style?: React.CSSProperties
  padding?: string
  elevated?: boolean
}

export function Card({ children, style, padding = 'var(--space-6)', elevated }: CardProps) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      boxShadow: elevated ? 'var(--shadow-sm)' : 'var(--shadow-xs)',
      padding,
      ...style,
    }}>
      {children}
    </div>
  )
}

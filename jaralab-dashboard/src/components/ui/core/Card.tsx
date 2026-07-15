import React from 'react'

interface CardProps {
  children: React.ReactNode
  style?: React.CSSProperties
  padding?: string
  elevated?: boolean
}

// v3: fondo --panel, borde --hairline, sin sombra, sin radius
export function Card({ children, style, padding = 'var(--space-6)' }: CardProps) {
  return (
    <div style={{
      background: 'var(--panel)',
      border: '1px solid var(--hairline)',
      padding,
      ...style,
    }}>
      {children}
    </div>
  )
}

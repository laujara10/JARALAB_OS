'use client'
import React from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: React.ReactNode
  iconRight?: React.ReactNode
}

const sizes: Record<Size, React.CSSProperties> = {
  sm: { padding: '0 var(--space-3)', height: 30, fontSize: '0.8125rem', gap: 6 },
  md: { padding: '0 var(--space-4)', height: 36, fontSize: '0.875rem',  gap: 8 },
  lg: { padding: '0 var(--space-5)', height: 44, fontSize: '0.9375rem', gap: 8 },
}

// v3: primary = --ink fill (ink-on-white), secondary = outline, ghost = transparent
function variantBase(v: Variant, disabled: boolean): React.CSSProperties {
  if (disabled) return { background: 'var(--hairline)', color: 'var(--ink-30)', border: '1px solid transparent' }
  switch (v) {
    case 'secondary': return { background: 'transparent', color: 'var(--ink)', border: '1px solid var(--hairline)' }
    case 'ghost':     return { background: 'transparent', color: 'var(--ink-55)', border: '1px solid transparent' }
    case 'danger':    return { background: 'var(--urgente)', color: '#fff', border: '1px solid var(--urgente)' }
    case 'gold':      return { background: 'transparent', color: 'var(--ink)', border: '1px solid var(--hairline)' }
    default:          return { background: 'var(--ink)', color: '#fff', border: '1px solid var(--ink)' }
  }
}

export function Button({ children, variant = 'primary', size = 'md', icon, iconRight, disabled, onClick, style, ...rest }: ButtonProps) {
  const [hover, setHover] = React.useState(false)
  const [active, setActive] = React.useState(false)
  const base = variantBase(variant, !!disabled)
  let overrides: React.CSSProperties = {}
  if (!disabled && hover) {
    if (variant === 'primary')    overrides = { background: 'rgba(26,19,16,0.82)' }
    if (variant === 'secondary')  overrides = { background: 'var(--bg)' }
    if (variant === 'ghost')      overrides = { background: 'var(--hairline)' }
  }
  if (!disabled && active && variant === 'primary') overrides = { background: 'rgba(26,19,16,0.95)' }

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false) }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-sans)', fontWeight: 500,
        borderRadius: 0, cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background var(--duration-fast) var(--ease-standard)',
        transform: active && !disabled ? 'translateY(1px)' : 'none',
        ...sizes[size], ...base, ...overrides,
        ...style,
      }}
      {...rest}
    >
      {icon}{children}{iconRight}
    </button>
  )
}

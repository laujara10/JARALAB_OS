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
  md: { padding: '0 var(--space-4)', height: 36, fontSize: '0.875rem', gap: 8 },
  lg: { padding: '0 var(--space-5)', height: 44, fontSize: '0.9375rem', gap: 8 },
}

function variantBase(v: Variant, disabled: boolean): React.CSSProperties {
  if (disabled) return { background: 'var(--neutral-100)', color: 'var(--neutral-400)', border: '1px solid var(--neutral-100)' }
  switch (v) {
    case 'secondary': return { background: 'var(--bg-surface)', color: 'var(--fg-primary)', border: '1px solid var(--border-default)' }
    case 'ghost':     return { background: 'transparent', color: 'var(--fg-primary)', border: '1px solid transparent' }
    case 'danger':    return { background: 'var(--danger-500)', color: 'var(--fg-inverse)', border: '1px solid var(--danger-500)' }
    case 'gold':      return { background: 'var(--accent-gold)', color: 'var(--neutral-900)', border: '1px solid var(--accent-gold)' }
    default:          return { background: 'var(--accent-primary)', color: 'var(--fg-inverse)', border: '1px solid var(--accent-primary)' }
  }
}

export function Button({ children, variant = 'primary', size = 'md', icon, iconRight, disabled, onClick, style, ...rest }: ButtonProps) {
  const [hover, setHover] = React.useState(false)
  const [active, setActive] = React.useState(false)
  const base = variantBase(variant, !!disabled)
  let bg = base.background as string
  if (!disabled && hover) {
    if (variant === 'primary') bg = 'var(--accent-primary-hover)'
    else if (variant === 'secondary' || variant === 'ghost') bg = 'var(--neutral-50)'
    else if (variant === 'danger') bg = 'oklch(0.48 0.20 25)'
    else if (variant === 'gold') bg = 'var(--gold-600)'
  }
  if (!disabled && active && variant === 'primary') bg = 'var(--accent-primary-active)'

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
        borderRadius: 'var(--radius-sm)', cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background var(--duration-fast) var(--ease-standard)',
        transform: active && !disabled ? 'translateY(1px)' : 'none',
        ...sizes[size], ...base, background: bg,
        ...style,
      }}
      {...rest}
    >
      {icon}{children}{iconRight}
    </button>
  )
}

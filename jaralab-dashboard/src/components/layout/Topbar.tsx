'use client'
import React from 'react'
import { Bell, Settings } from 'lucide-react'

interface TopbarProps {
  title: string
}

function IconBtn({ children, label }: { children: React.ReactNode; label: string }) {
  const [hover, setHover] = React.useState(false)
  return (
    <button
      aria-label={label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 32, height: 32, border: 'none', borderRadius: 'var(--radius-sm)',
        background: hover ? 'var(--bg-surface-2)' : 'transparent',
        color: 'var(--fg-secondary)', cursor: 'pointer',
        transition: 'background var(--duration-fast) var(--ease-standard)',
      }}
    >
      {children}
    </button>
  )
}

export function Topbar({ title }: TopbarProps) {
  const [range, setRange] = React.useState('30d')

  return (
    <div style={{
      height: 60, flex: '0 0 auto',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 var(--space-6)',
      background: 'oklch(0.995 0.002 80 / 0.85)',
      backdropFilter: 'blur(8px)',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div style={{
        fontFamily: 'var(--font-sans)', fontWeight: 600,
        fontSize: '1.0625rem', color: 'var(--fg-primary)',
      }}>
        {title}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <select
          value={range}
          onChange={e => setRange(e.target.value)}
          style={{
            fontFamily: 'var(--font-sans)', fontSize: '0.8125rem',
            color: 'var(--fg-primary)', background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)',
            padding: '0 var(--space-3)', height: 32, cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="7d">Últimos 7 días</option>
          <option value="30d">Últimos 30 días</option>
          <option value="q">Este trimestre</option>
        </select>
        <IconBtn label="Notificaciones"><Bell size={16} /></IconBtn>
        <IconBtn label="Configuración"><Settings size={16} /></IconBtn>
      </div>
    </div>
  )
}

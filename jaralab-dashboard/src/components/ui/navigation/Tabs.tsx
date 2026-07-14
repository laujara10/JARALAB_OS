'use client'
import React from 'react'

interface Tab { label: string; value: string }

interface TabsProps {
  tabs: Tab[]
  value: string
  onChange: (v: string) => void
}

export function Tabs({ tabs, value, onChange }: TabsProps) {
  return (
    <div style={{
      display: 'flex', gap: 0,
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      {tabs.map(t => {
        const active = t.value === value
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            style={{
              padding: '8px var(--space-4)',
              background: 'none', border: 'none',
              borderBottom: active ? '2px solid var(--accent-primary)' : '2px solid transparent',
              color: active ? 'var(--fg-accent)' : 'var(--fg-secondary)',
              fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 500,
              cursor: 'pointer',
              transition: 'color var(--duration-fast) var(--ease-standard)',
              marginBottom: -1,
            }}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}

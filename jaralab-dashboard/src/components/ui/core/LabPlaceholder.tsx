import React from 'react'
import { Topbar } from '@/components/layout/Topbar'

interface LabPlaceholderProps {
  name: string
  description: string
  icon: React.ReactNode
  capabilities: string[]
}

export function LabPlaceholder({ name, description, icon, capabilities }: LabPlaceholderProps) {
  return (
    <>
      <Topbar title={name} />
      <main style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 'var(--space-16)', gap: 'var(--space-6)', textAlign: 'center',
      }}>
        <div style={{ color: 'var(--fg-tertiary)' }}>{icon}</div>
        <div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontStyle: 'italic', color: 'var(--fg-primary)', marginBottom: 'var(--space-3)' }}>
            {name}
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', color: 'var(--fg-secondary)', maxWidth: 480, lineHeight: 1.6 }}>
            {description}
          </div>
        </div>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 14px', borderRadius: 'var(--radius-full)',
          background: 'var(--gold-100)', border: '1px solid var(--gold-200)',
          fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 500,
          color: 'var(--fg-gold)',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--fg-gold)', display: 'inline-block' }} />
          En desarrollo — validado primero en Pikeo & Callejero
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)',
          maxWidth: 640, width: '100%', marginTop: 'var(--space-4)',
        }}>
          {capabilities.map((cap, i) => (
            <div key={i} style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)', padding: 'var(--space-4)',
              fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--fg-secondary)',
              lineHeight: 1.5, boxShadow: 'var(--shadow-xs)',
            }}>
              {cap}
            </div>
          ))}
        </div>
      </main>
    </>
  )
}

import React from 'react'
import { Topbar } from '@/components/layout/Topbar'

interface LabPlaceholderProps {
  name: string
  description: string
  icon: React.ReactNode
  capabilities: string[]
}

// v3: badge outline+dot terracota, capability cards hairline sin sombra
export function LabPlaceholder({ name, description, icon, capabilities }: LabPlaceholderProps) {
  return (
    <>
      <Topbar title={name} />
      <main style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 'var(--space-16)', gap: 'var(--space-6)', textAlign: 'center',
      }}>
        <div style={{ color: 'var(--ink-30)' }}>{icon}</div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontStyle: 'italic', color: 'var(--ink)', marginBottom: 'var(--space-3)' }}>
            {name}
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', color: 'var(--ink-55)', maxWidth: 480, lineHeight: 1.6 }}>
            {description}
          </div>
        </div>

        {/* Badge v3: outline + punto terracota */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '5px 12px',
          background: 'transparent', border: '1px solid var(--hairline)',
          fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 500,
          color: 'var(--ink-55)',
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--terracota)', display: 'inline-block', flexShrink: 0 }} />
          En desarrollo — validado primero en Pikeo &amp; Callejero
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)',
          maxWidth: 640, width: '100%', marginTop: 'var(--space-4)',
        }}>
          {capabilities.map((cap, i) => (
            <div key={i} style={{
              background: 'var(--panel)', border: '1px solid var(--hairline)',
              padding: 'var(--space-4)',
              fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--ink-55)',
              lineHeight: 1.5,
            }}>
              {cap}
            </div>
          ))}
        </div>
      </main>
    </>
  )
}

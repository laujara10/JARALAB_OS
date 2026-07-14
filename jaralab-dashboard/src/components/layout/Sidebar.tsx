'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutGrid, TrendingUp, Receipt, Users, FileText,
  Sparkles, FlaskConical, BrainCircuit, BarChart3, ChevronRight,
} from 'lucide-react'

const NAV_DASHBOARD = [
  { key: 'overview', label: 'Resumen',  icon: LayoutGrid, href: '/dashboard' },
  { key: 'revenue',  label: 'Ventas',   icon: TrendingUp, href: '/dashboard/revenue' },
  { key: 'costs',    label: 'Costos',   icon: Receipt,    href: '/dashboard/costs' },
  { key: 'labor',    label: 'Personal', icon: Users,      href: '/dashboard/labor' },
]

const NAV_TOOLS = [
  { key: 'auditor', label: 'Restaurant Auditor', icon: FileText, href: '/auditor' },
  { key: 'copilot', label: 'AI Copilot',         icon: Sparkles, href: '/dashboard/copilot' },
]

const NAV_LABS = [
  { key: 'decision', label: 'Decision Lab', icon: BrainCircuit, href: '/labs/decision' },
  { key: 'growth',   label: 'Growth Lab',   icon: TrendingUp,   href: '/labs/growth' },
  { key: 'cfo',      label: 'CFO Lab',      icon: BarChart3,    href: '/labs/cfo' },
]

interface SidebarProps {
  restaurantName?: string
  restaurantInitials?: string
}

export function Sidebar({ restaurantName = "Pikeo", restaurantInitials = "PK" }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div style={{
      width: 220, flex: '0 0 auto',
      borderRight: '1px solid var(--border-subtle)',
      background: 'var(--bg-surface)',
      display: 'flex', flexDirection: 'column',
      padding: 'var(--space-5) var(--space-3)',
      height: '100vh', position: 'sticky', top: 0, overflowY: 'auto',
    }}>
      {/* Brand block */}
      <div style={{
        paddingTop: 'var(--space-5)',
        paddingBottom: 'var(--space-8)',
        paddingLeft: 'var(--space-2)',
        paddingRight: 'var(--space-2)',
      }}>
        {/*
          The PNG is 1081×1081 with ~33% whitespace margin around the actual mark.
          fill + cover + objectPosition crops the padding so the wordmark fills the container.
          Container: 180×62 → rendered image 180×180 → visible window y:340–712 of source
          = the full JaraLab rocket + wordmark, no empty space.
        */}
        <div style={{ position: 'relative', width: 180, height: 62, overflow: 'hidden' }}>
          <Image
            src="/jaralab-logo.png"
            alt="JaraLab"
            fill
            style={{ objectFit: 'cover', objectPosition: 'left 48%' }}
            priority
          />
        </div>
        <div style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: '0.75rem',
          color: 'var(--neutral-400)',
          letterSpacing: '0.01em',
          marginTop: 'var(--space-2)',
        }}>
          Restaurant Intelligence OS
        </div>
      </div>

      {/* Nav divider */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', marginBottom: 'var(--space-5)' }} />

      {/* Dashboard nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_DASHBOARD.map(n => {
          const Icon = n.icon
          const isActive = pathname === n.href || (n.href !== '/dashboard' && pathname.startsWith(n.href))
          return (
            <Link key={n.key} href={n.href} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 10px', borderRadius: 'var(--radius-sm)',
              background: isActive ? 'var(--primary-50)' : 'transparent',
              color: isActive ? 'var(--primary-700)' : 'var(--fg-secondary)',
              fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 500,
              textDecoration: 'none', transition: 'background var(--duration-fast) var(--ease-standard)',
            }}>
              <Icon size={16} color={isActive ? 'var(--primary-700)' : 'var(--fg-tertiary)'} />
              {n.label}
            </Link>
          )
        })}
      </nav>

      {/* Tools section */}
      <div style={{ marginTop: 'var(--space-5)' }}>
        <div style={{
          fontSize: '0.625rem', fontWeight: 500, color: 'var(--fg-tertiary)',
          letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase',
          padding: '0 10px', marginBottom: 'var(--space-2)',
        }}>
          Herramientas
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_TOOLS.map(n => {
            const Icon = n.icon
            const isActive = pathname === n.href || pathname.startsWith(n.href + '/')
            return (
              <Link key={n.key} href={n.href} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 'var(--radius-sm)',
                background: isActive ? 'var(--primary-50)' : 'transparent',
                color: isActive ? 'var(--primary-700)' : 'var(--fg-secondary)',
                fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 500,
                textDecoration: 'none', transition: 'background var(--duration-fast) var(--ease-standard)',
              }}>
                <Icon size={16} color={isActive ? 'var(--primary-700)' : 'var(--fg-tertiary)'} />
                {n.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Labs section */}
      <div style={{ marginTop: 'var(--space-5)' }}>
        <div style={{
          fontSize: '0.625rem', fontWeight: 500, color: 'var(--fg-tertiary)',
          letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase',
          padding: '0 10px', marginBottom: 'var(--space-2)',
        }}>
          Labs
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_LABS.map(n => {
            const Icon = n.icon
            const isActive = pathname.startsWith(n.href)
            return (
              <Link key={n.key} href={n.href} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 10px', borderRadius: 'var(--radius-sm)',
                background: isActive ? 'var(--primary-50)' : 'transparent',
                color: isActive ? 'var(--primary-700)' : 'var(--fg-secondary)',
                fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 500,
                textDecoration: 'none',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon size={16} color={isActive ? 'var(--primary-700)' : 'var(--fg-tertiary)'} />
                  {n.label}
                </span>
                <span style={{
                  fontSize: '0.625rem', background: 'var(--neutral-100)',
                  color: 'var(--fg-tertiary)', padding: '1px 5px',
                  borderRadius: 'var(--radius-full)', fontWeight: 500,
                }}>
                  Próximo
                </span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Restaurant account footer */}
      <div style={{ marginTop: 'auto' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: 10, borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'var(--neutral-800)', color: 'var(--neutral-0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-sans)',
            flexShrink: 0,
          }}>
            {restaurantInitials}
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', overflow: 'hidden' }}>
            <div style={{ fontWeight: 500, color: 'var(--fg-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {restaurantName}
            </div>
            <div style={{ color: 'var(--fg-tertiary)' }}>Propietario</div>
          </div>
        </div>
      </div>
    </div>
  )
}

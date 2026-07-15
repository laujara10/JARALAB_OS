'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutGrid, TrendingUp, Receipt, Users, FileText,
  Sparkles, FlaskConical, BrainCircuit, BarChart3,
  CalendarCheck,
} from 'lucide-react'

import { ROUTES } from '@/lib/routes'

const NAV_DASHBOARD = [
  { key: 'hoy',      label: 'Hoy',      icon: CalendarCheck, href: ROUTES.hoy      },
  { key: 'overview', label: 'Resumen',  icon: LayoutGrid,    href: ROUTES.resumen  },
  { key: 'revenue',  label: 'Ventas',   icon: TrendingUp,    href: ROUTES.ventas   },
  { key: 'costs',    label: 'Costos',   icon: Receipt,       href: ROUTES.costos   },
  { key: 'labor',    label: 'Personal', icon: Users,         href: ROUTES.personal },
]

const NAV_TOOLS = [
  { key: 'auditor', label: 'Restaurant Auditor', icon: FileText, href: ROUTES.auditor },
  { key: 'copilot', label: 'AI Copilot',         icon: Sparkles, href: ROUTES.copilot },
]

const NAV_LABS = [
  { key: 'decision', label: 'Decision Lab', icon: BrainCircuit, href: ROUTES.decisionLab },
  { key: 'growth',   label: 'Growth Lab',   icon: TrendingUp,   href: ROUTES.growthLab   },
  { key: 'cfo',      label: 'CFO Lab',      icon: BarChart3,    href: ROUTES.cfoLab      },
]

interface SidebarProps {
  restaurantName?: string
  restaurantInitials?: string
}

// v3: ítem activo = borde izquierdo terracota + peso 600, sin fondo relleno
export function Sidebar({ restaurantName = "Pikeo", restaurantInitials = "PK" }: SidebarProps) {
  const pathname = usePathname()

  function navItem(href: string, label: string, Icon: React.ElementType, exactMatch = false) {
    const isActive = exactMatch
      ? pathname === href
      : pathname === href || pathname.startsWith(href + '/')
    return (
      <Link key={href} href={href} style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 10px',
        borderLeft: isActive ? '2px solid var(--terracota)' : '2px solid transparent',
        paddingLeft: isActive ? 8 : 8,
        background: 'transparent',
        color: isActive ? 'var(--ink)' : 'var(--ink-55)',
        fontFamily: 'var(--font-sans)', fontSize: '0.8125rem',
        fontWeight: isActive ? 600 : 400,
        textDecoration: 'none',
        transition: 'color var(--duration-fast) var(--ease-standard)',
      }}>
        <Icon size={16} color={isActive ? 'var(--terracota)' : 'var(--ink-30)'} />
        {label}
      </Link>
    )
  }

  return (
    <div style={{
      width: 220, flex: '0 0 auto',
      borderRight: '1px solid var(--hairline)',
      background: 'var(--panel)',
      display: 'flex', flexDirection: 'column',
      padding: 'var(--space-5) var(--space-3)',
      height: '100vh', position: 'sticky', top: 0, overflowY: 'auto',
    }}>
      {/* Brand block */}
      <div style={{
        paddingTop: 'var(--space-5)', paddingBottom: 'var(--space-8)',
        paddingLeft: 'var(--space-2)', paddingRight: 'var(--space-2)',
      }}>
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
          color: 'var(--ink-30)',
          letterSpacing: '0.01em',
          marginTop: 'var(--space-2)',
        }}>
          Restaurant Intelligence OS
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--hairline)', marginBottom: 'var(--space-5)' }} />

      {/* Dashboard nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItem(ROUTES.hoy,     'Hoy',     CalendarCheck, true)}
        {navItem(ROUTES.resumen, 'Resumen', LayoutGrid,    true)}
        {navItem(ROUTES.ventas,  'Ventas',  TrendingUp)}
        {navItem(ROUTES.costos,  'Costos',  Receipt)}
        {navItem(ROUTES.personal,'Personal',Users)}
      </nav>

      {/* Tools section */}
      <div style={{ marginTop: 'var(--space-5)' }}>
        <div style={{
          fontSize: '0.625rem', fontWeight: 500, color: 'var(--ink-30)',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          padding: '0 10px', marginBottom: 'var(--space-2)',
        }}>
          Herramientas
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItem(ROUTES.auditor, 'Restaurant Auditor', FileText)}
          {navItem(ROUTES.copilot, 'AI Copilot',         Sparkles)}
        </nav>
      </div>

      {/* Labs section */}
      <div style={{ marginTop: 'var(--space-5)' }}>
        <div style={{
          fontSize: '0.625rem', fontWeight: 500, color: 'var(--ink-30)',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          padding: '0 10px', marginBottom: 'var(--space-2)',
        }}>
          Labs
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_LABS.map(n => {
            const isActive = pathname.startsWith(n.href)
            return (
              <Link key={n.key} href={n.href} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 10px',
                borderLeft: isActive ? '2px solid var(--terracota)' : '2px solid transparent',
                background: 'transparent',
                color: isActive ? 'var(--ink)' : 'var(--ink-55)',
                fontFamily: 'var(--font-sans)', fontSize: '0.8125rem',
                fontWeight: isActive ? 600 : 400,
                textDecoration: 'none',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <n.icon size={16} color={isActive ? 'var(--terracota)' : 'var(--ink-30)'} />
                  {n.label}
                </span>
                <span style={{
                  fontSize: '0.625rem',
                  color: 'var(--ink-30)', padding: '1px 5px',
                  border: '1px solid var(--hairline)',
                  fontWeight: 500, background: 'transparent',
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
          padding: 10,
          border: '1px solid var(--hairline)',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'var(--ink)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-sans)',
            flexShrink: 0,
          }}>
            {restaurantInitials}
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', overflow: 'hidden' }}>
            <div style={{ fontWeight: 500, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {restaurantName}
            </div>
            <div style={{ color: 'var(--ink-55)' }}>Propietario</div>
          </div>
        </div>
      </div>
    </div>
  )
}

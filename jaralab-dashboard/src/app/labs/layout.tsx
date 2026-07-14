import React from 'react'
import { Sidebar } from '@/components/layout/Sidebar'

export default function LabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-page)' }}>
      <Sidebar restaurantName="Pikeo" restaurantInitials="PK" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {children}
      </div>
    </div>
  )
}

import React from 'react'

export interface Column<T = Record<string, React.ReactNode>> {
  key: keyof T
  label: string
  align?: 'left' | 'right' | 'center'
  mono?: boolean
}

interface TableProps<T = Record<string, React.ReactNode>> {
  columns: Column<T>[]
  rows: T[]
  onRowClick?: (row: T) => void
}

export function Table<T extends Record<string, React.ReactNode>>({ columns, rows, onRowClick }: TableProps<T>) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)' }}>
      <thead>
        <tr>
          {columns.map(c => (
            <th key={String(c.key)} style={{
              textAlign: c.align || 'left',
              padding: '8px 12px',
              fontSize: '0.6875rem', fontWeight: 500,
              color: 'var(--fg-tertiary)',
              textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)',
              borderBottom: '1px solid var(--border-default)',
            }}>
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr
            key={i}
            onClick={() => onRowClick?.(r)}
            style={{
              borderBottom: '1px solid var(--border-subtle)',
              cursor: onRowClick ? 'pointer' : 'default',
              transition: 'background var(--duration-fast) var(--ease-standard)',
            }}
            onMouseEnter={e => { if (onRowClick) (e.currentTarget as HTMLElement).style.background = 'var(--bg-surface-2)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '' }}
          >
            {columns.map(c => (
              <td key={String(c.key)} style={{
                textAlign: c.align || 'left',
                padding: '10px 12px',
                fontSize: '0.8125rem',
                color: 'var(--fg-primary)',
                fontFamily: c.mono ? 'var(--font-mono)' : 'inherit',
                fontVariantNumeric: c.mono ? 'tabular-nums' : 'normal',
              }}>
                {r[c.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

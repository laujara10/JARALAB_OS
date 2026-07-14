'use client'
import React from 'react'

interface BarChartProps {
  data: { label: string; value: number; value2?: number }[]
  height?: number
  color?: string
  color2?: string
  formatValue?: (v: number) => string
  unit?: string
}

export function BarChart({ data, height = 160, color = 'var(--accent-primary)', color2, formatValue, unit = '' }: BarChartProps) {
  const max = Math.max(...data.flatMap(d => [d.value, d.value2 ?? 0]))
  const fmt = formatValue ?? ((v: number) => v.toLocaleString())

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: color2 ? 2 : 6, height, paddingBottom: 24, position: 'relative' }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 2, height: '100%', position: 'relative' }}>
            <div
              title={`${d.label}: ${fmt(d.value)}${unit}`}
              style={{
                flex: 1, borderRadius: '3px 3px 0 0',
                background: color,
                height: `${(d.value / max) * 100}%`,
                minHeight: 2,
                transition: 'height 0.3s ease',
                cursor: 'default',
                opacity: 0.85,
              }}
            />
            {color2 && d.value2 !== undefined && (
              <div
                title={`${d.label}: ${fmt(d.value2)}${unit}`}
                style={{
                  flex: 1, borderRadius: '3px 3px 0 0',
                  background: color2,
                  height: `${(d.value2 / max) * 100}%`,
                  minHeight: 2,
                  opacity: 0.7,
                }}
              />
            )}
            <div style={{
              position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)',
              fontSize: '0.6875rem', color: 'var(--fg-tertiary)', whiteSpace: 'nowrap',
              fontFamily: 'var(--font-sans)',
            }}>
              {d.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

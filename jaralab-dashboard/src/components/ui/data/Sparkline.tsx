'use client'
import React from 'react'

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
}

export function Sparkline({ data, width = 200, height = 60, color = 'var(--accent-primary)' }: SparklineProps) {
  if (data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pad = 4
  const w = width - pad * 2
  const h = height - pad * 2

  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * w
    const y = pad + h - ((v - min) / range) * h
    return `${x},${y}`
  })
  const d = `M ${points.join(' L ')}`

  const areaPoints = [
    `${pad},${pad + h}`,
    ...data.map((v, i) => {
      const x = pad + (i / (data.length - 1)) * w
      const y = pad + h - ((v - min) / range) * h
      return `${x},${y}`
    }),
    `${pad + w},${pad + h}`,
  ]
  const areaD = `M ${areaPoints.join(' L ')} Z`

  return (
    <svg width={width} height={height} style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#spark-grad)" />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

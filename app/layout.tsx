import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JARALAB OS — AI Operating System for Independent Restaurants',
  description: 'JARALAB OS convierte datos financieros, operativos y comerciales en decisiones accionables para restaurantes independientes.',
  openGraph: {
    title: 'JARALAB OS',
    description: 'AI Operating System for Independent Restaurants',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}

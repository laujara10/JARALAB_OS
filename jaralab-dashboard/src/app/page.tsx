import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JaraLab — Restaurant Intelligence',
  description: 'Tu restaurante produce información todos los días. JaraLab convierte esa información en la claridad que necesitas para decidir.',
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 48px', height: 64,
      background: 'rgba(253,251,248,0.92)', backdropFilter: 'blur(8px)',
      borderBottom: '1px solid rgba(26,19,16,0.08)',
    }}>
      <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: '1.125rem', fontWeight: 500, color: '#1a1310', letterSpacing: '-0.01em' }}>
        JaraLab
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        {['Cómo funciona', 'JaraLab OS', 'Nuestra forma de trabajar'].map(item => (
          <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '-')}`} style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', color: 'rgba(26,19,16,0.55)', textDecoration: 'none' }}>
            {item}
          </a>
        ))}
        <Link href="/hoy" style={{
          fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', fontWeight: 500,
          color: '#1a1310', textDecoration: 'none',
          border: '1px solid rgba(26,19,16,0.20)', padding: '7px 18px',
        }}>
          Entrar
        </Link>
      </div>
    </nav>
  )
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const section: React.CSSProperties = {
  padding: '96px 48px',
  maxWidth: 1080,
  margin: '0 auto',
}

const eyebrow: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: '0.75rem',
  fontWeight: 500,
  color: '#C05A3E',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginBottom: 20,
}

const h2: React.CSSProperties = {
  fontFamily: "'Fraunces', Georgia, serif",
  fontSize: 'clamp(2rem, 4vw, 3rem)',
  fontWeight: 400,
  color: '#1a1310',
  lineHeight: 1.15,
  letterSpacing: '-0.02em',
  marginBottom: 24,
}

const body: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: '1.0625rem',
  color: 'rgba(26,19,16,0.65)',
  lineHeight: 1.75,
  maxWidth: 620,
}

const hairline = '1px solid rgba(26,19,16,0.10)'

// ─── Sections ─────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section style={{ padding: '160px 48px 96px', maxWidth: 1080, margin: '0 auto' }}>
      <div style={{ ...eyebrow }}>JaraLab · Restaurant Intelligence</div>
      <h1 style={{
        fontFamily: "'Fraunces', Georgia, serif",
        fontSize: 'clamp(2.75rem, 6vw, 4.5rem)',
        fontWeight: 400,
        color: '#1a1310',
        lineHeight: 1.08,
        letterSpacing: '-0.025em',
        marginBottom: 28,
        maxWidth: 720,
      }}>
        Tu restaurante no necesita más información.
        {' '}<em style={{ fontStyle: 'italic', color: '#C05A3E' }}>Necesita claridad.</em>
      </h1>
      <p style={{ ...body, fontSize: '1.125rem', marginBottom: 40 }}>
        JaraLab revisa la operación de tu restaurante, conecta la información y te muestra qué está bien, qué necesita atención y qué decisión tomar primero.
      </p>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <Link href="/hoy" style={{
          display: 'inline-block',
          fontFamily: "'Inter', sans-serif", fontSize: '0.9375rem', fontWeight: 500,
          padding: '13px 28px', background: '#1a1310', color: '#fff', textDecoration: 'none',
        }}>
          Conocer JaraLab OS
        </Link>
        <a href="#como-funciona" style={{
          display: 'inline-block',
          fontFamily: "'Inter', sans-serif", fontSize: '0.9375rem',
          padding: '13px 28px', border: hairline, color: '#1a1310', textDecoration: 'none',
        }}>
          Ver cómo funciona
        </a>
      </div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8125rem', color: 'rgba(26,19,16,0.35)', marginTop: 20 }}>
        Construido y validado dentro de restaurantes reales.
      </div>
    </section>
  )
}

function Dolor() {
  return (
    <section style={{ background: '#fff', borderTop: hairline, borderBottom: hairline }}>
      <div style={{ ...section }}>
        <div style={{ ...eyebrow }}>El problema</div>
        <h2 style={{ ...h2 }}>El problema no es que no tengas datos.</h2>
        <p style={{ ...body, marginBottom: 64 }}>
          Ventas, transferencias, gastos, facturas, inventario, personal y mensajes llegan por lugares distintos. Y al final, todo depende de que tú tengas tiempo para unirlo.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 1 }}>
          {[
            'Sabes cuánto vendiste, pero no siempre cuánto quedó.',
            'Encuentras los errores cuando ya pasó demasiado tiempo.',
            'Tu equipo pregunta y tú todavía estás tratando de entender.',
            'Tu negocio funciona, pero no se siente bajo control.',
          ].map((msg, i) => (
            <div key={i} style={{ padding: '28px 32px', background: '#fdfbf8', border: hairline }}>
              <div style={{ width: 4, height: 28, background: '#C05A3E', marginBottom: 16 }} />
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1rem', color: '#1a1310', lineHeight: 1.6, margin: 0 }}>
                {msg}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Costo() {
  return (
    <section id="como-funciona" style={{ background: '#fdfbf8' }}>
      <div style={{ ...section }}>
        <div style={{ ...eyebrow }}>El costo</div>
        <h2 style={{ ...h2 }}>Dirigir en medio de la confusión también tiene un costo.</h2>
        <p style={{ ...body, marginBottom: 48 }}>
          No solo pierdes horas. Tomas decisiones tarde, explicas sin seguridad, cargas preguntas que deberían resolver los datos y terminas sintiendo que el restaurante te dirige a ti.
        </p>
        <div style={{ borderLeft: '3px solid #C05A3E', paddingLeft: 28 }}>
          <p style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 'clamp(1.375rem, 2.5vw, 1.875rem)',
            color: '#1a1310',
            lineHeight: 1.3,
            margin: 0,
          }}>
            No necesitas mirar más.<br />Necesitas entender mejor.
          </p>
        </div>
      </div>
    </section>
  )
}

function Transformacion() {
  const antes = [
    'Revisas todo para encontrar el problema.',
    'Reaccionas tarde.',
    'Persigues diferencias sin contexto.',
    'Explicas desde la intuición.',
    'Cada cierre empieza desde cero.',
  ]
  const despues = [
    'Sabes exactamente dónde mirar.',
    'Priorizas lo que importa.',
    'Entiendes las diferencias al instante.',
    'Hablas con datos y seguridad.',
    'El sistema aprende de cada revisión.',
  ]

  return (
    <section style={{ background: '#fff', borderTop: hairline, borderBottom: hairline }}>
      <div style={{ ...section }}>
        <div style={{ ...eyebrow }}>La transformación</div>
        <h2 style={{ ...h2 }}>Así se siente cuando el negocio empieza a hablar claro.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, marginBottom: 48, maxWidth: 800 }}>
          <div style={{ padding: '28px 32px', background: '#fdfbf8', border: hairline }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6875rem', fontWeight: 600, color: 'rgba(26,19,16,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>Antes</div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {antes.map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ color: 'rgba(26,19,16,0.25)', marginTop: 2, flexShrink: 0 }}>—</span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9375rem', color: 'rgba(26,19,16,0.55)', lineHeight: 1.5 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ padding: '28px 32px', background: '#fdfbf8', border: hairline, borderLeft: '3px solid #1a1310' }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6875rem', fontWeight: 600, color: 'rgba(26,19,16,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>Después</div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {despues.map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ color: '#C05A3E', marginTop: 2, flexShrink: 0 }}>→</span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9375rem', color: '#1a1310', lineHeight: 1.5 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: 'italic', fontSize: '1.25rem', color: '#1a1310', margin: 0 }}>
          Pasas de operar con incertidumbre a dirigir con criterio.
        </p>
      </div>
    </section>
  )
}

function JaraLabOS() {
  const pilares = [
    {
      titulo: 'Restaurant Auditor',
      descripcion: 'Cruza ventas, movimientos y evidencias para mostrarte qué está conciliado y qué necesita revisión. No te entrega más números — te dice qué hacer primero.',
    },
    {
      titulo: 'AI Copilot',
      descripcion: 'Explica los hallazgos, responde tus preguntas y te dice por dónde empezar. Conoce la auditoría antes de que tú le preguntes.',
    },
    {
      titulo: 'Visión del negocio',
      descripcion: 'Reúne ventas, costos, personal y operación en una lectura clara. Una pantalla que responde: ¿cómo estoy hoy?',
    },
  ]

  return (
    <section id="jaralab-os" style={{ background: '#fdfbf8' }}>
      <div style={{ ...section }}>
        <div style={{ ...eyebrow }}>JaraLab OS</div>
        <h2 style={{ ...h2 }}>Un sistema que revisa el negocio antes que tú.</h2>
        <p style={{ ...body, marginBottom: 56 }}>
          JaraLab OS convierte la información diaria de tu restaurante en explicaciones, alertas y decisiones.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
          {pilares.map((p, i) => (
            <div key={i} style={{ padding: '32px', background: '#fff', border: hairline, borderTop: i === 0 ? '3px solid #C05A3E' : `3px solid rgba(26,19,16,${0.08 + i * 0.04})` }}>
              <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: '1.125rem', fontWeight: 500, color: '#1a1310', marginBottom: 14 }}>{p.titulo}</div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9375rem', color: 'rgba(26,19,16,0.6)', lineHeight: 1.7, margin: 0 }}>{p.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Experiencia() {
  const chat = [
    { rol: 'copiloto', texto: 'Encontré tres movimientos que explican la mayor parte de la diferencia de esta semana.' },
    { rol: 'usuario',  texto: '¿Por cuál debería empezar?' },
    { rol: 'copiloto', texto: 'Empieza por la transferencia de $1.061.800. Es el movimiento de mayor impacto y todavía no tiene una venta asociada.' },
  ]

  return (
    <section style={{ background: '#fff', borderTop: hairline, borderBottom: hairline }}>
      <div style={{ ...section }}>
        <div style={{ ...eyebrow }}>La experiencia</div>
        <h2 style={{ ...h2, maxWidth: 600 }}>No te entrega otro dashboard.<br />Te ayuda a entender qué hacer.</h2>
        <div style={{ maxWidth: 540, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {chat.map((msg, i) => {
            const isCopilot = msg.rol === 'copiloto'
            return (
              <div key={i} style={{ display: 'flex', flexDirection: isCopilot ? 'row' : 'row-reverse', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 28, height: 28, flexShrink: 0,
                  background: isCopilot ? 'transparent' : '#1a1310',
                  border: isCopilot ? hairline : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Inter', sans-serif", fontSize: '0.5625rem', fontWeight: 600,
                  color: isCopilot ? 'rgba(26,19,16,0.5)' : '#fff',
                }}>
                  {isCopilot ? 'AI' : 'Tú'}
                </div>
                <div style={{
                  padding: '12px 16px', maxWidth: '78%',
                  background: isCopilot ? '#fdfbf8' : '#1a1310',
                  border: isCopilot ? hairline : 'none',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.9375rem',
                  color: isCopilot ? '#1a1310' : '#fff',
                  lineHeight: 1.6,
                }}>
                  {msg.texto}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Origen() {
  return (
    <section id="nuestra-forma-de-trabajar" style={{ background: '#fdfbf8' }}>
      <div style={{ ...section }}>
        <div style={{ ...eyebrow }}>Nuestra forma de trabajar</div>
        <h2 style={{ ...h2 }}>Construido dentro de la operación real.</h2>
        <p style={{ ...body, marginBottom: 48 }}>
          JaraLab no nació desde una presentación. Nació conciliando bancos, revisando ventas, corrigiendo costos y tomando decisiones dentro de restaurantes reales.
        </p>
        <div style={{ borderLeft: '3px solid rgba(26,19,16,0.12)', paddingLeft: 28, maxWidth: 480 }}>
          <p style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: 'italic', fontSize: '1.25rem', color: '#1a1310', lineHeight: 1.5, margin: '0 0 20px' }}>
            Lo construimos.<br />Lo operamos.<br />Lo validamos.<br />Luego lo compartimos.
          </p>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: 'rgba(26,19,16,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Validated in real operations — We run it.
          </span>
        </div>
      </div>
    </section>
  )
}

function Cierre() {
  return (
    <section style={{ background: '#1a1310', padding: '96px 48px' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 500, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>
          JaraLab · Restaurant Intelligence
        </p>
        <h2 style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 400,
          color: '#fff',
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          marginBottom: 20,
          maxWidth: 640,
        }}>
          Tu negocio ya está tratando de decirte algo.
        </h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.0625rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: 500, marginBottom: 40 }}>
          JaraLab convierte esa información en la claridad que necesitas para decidir.
        </p>
        <Link href="/hoy" style={{
          display: 'inline-block',
          fontFamily: "'Inter', sans-serif", fontSize: '0.9375rem', fontWeight: 500,
          padding: '13px 28px',
          background: '#C05A3E', color: '#fff', textDecoration: 'none',
        }}>
          Entrar a JaraLab OS
        </Link>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8125rem', color: 'rgba(255,255,255,0.25)', marginTop: 20 }}>
          Primera experiencia en desarrollo y validación operativa.
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ background: '#1a1310', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '28px 48px' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8125rem', color: 'rgba(255,255,255,0.25)' }}>
          © 2026 JaraLab
        </div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8125rem', color: 'rgba(255,255,255,0.25)' }}>
          Datos mock — sin datos reales de clientes
        </div>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #fdfbf8; }
        @media (max-width: 768px) {
          nav { padding: 0 20px !important; }
          nav > div:last-child > a:not(:last-child) { display: none; }
          section { padding: 64px 20px !important; }
          h1 { font-size: 2.25rem !important; }
          .grid-2col { grid-template-columns: 1fr !important; }
          .grid-3col { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <Nav />
      <main>
        <Hero />
        <Dolor />
        <Costo />
        <Transformacion />
        <JaraLabOS />
        <Experiencia />
        <Origen />
        <Cierre />
        <Footer />
      </main>
    </>
  )
}

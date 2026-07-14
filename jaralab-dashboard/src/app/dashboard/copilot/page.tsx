'use client'
import React from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { Card } from '@/components/ui/core/Card'
import { Badge } from '@/components/ui/core/Badge'
import { Button } from '@/components/ui/core/Button'
import { Send, Sparkles, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    role: 'assistant',
    content: 'Buenos días. He revisado los datos de esta semana. El costo de alimentos está 1.4 puntos por encima del objetivo, impulsado principalmente por las verduras. Las ventas de esta semana subieron 6.2% respecto a la semana anterior. ¿Qué quieres explorar?',
    timestamp: '9:02 a.m.',
  },
  {
    id: 2,
    role: 'user',
    content: '¿Qué está causando el aumento en el costo de alimentos?',
    timestamp: '9:04 a.m.',
  },
  {
    id: 3,
    role: 'assistant',
    content: 'El principal factor es las verduras, específicamente la factura de Local Farms Co-op — $6,120 contra un presupuesto de $5,000, un sobrecosto de $1,120. Dos causas contribuyentes:\n\n1. Alza estacional en tomates y hortalizas (+18% desde mayo).\n2. Sobrecompra el jueves pasado — 40 kg de verduras que no se usaron antes de dañarse.\n\nLas proteínas y los secos están dentro del presupuesto. Recomiendo revisar las cantidades de pedido con el chef principal esta semana.',
    timestamp: '9:04 a.m.',
  },
  {
    id: 4,
    role: 'user',
    content: '¿Cómo se compara el personal con el mismo período del año pasado?',
    timestamp: '9:06 a.m.',
  },
  {
    id: 5,
    role: 'assistant',
    content: 'El personal este mes está en 31.2% de las ventas, frente a 33.8% en el mismo período del año pasado — una mejora de 2.6 puntos. El principal factor es la reestructuración de plantilla de marzo: el cargo de gerente de sala se consolidó y dos meseros de medio tiempo se reemplazaron por una contratación de tiempo completo. Las ventas también subieron 4.8% interanual, lo que mejora el ratio automáticamente.',
    timestamp: '9:06 a.m.',
  },
]

const SUGGESTIONS = [
  { icon: <TrendingUp size={13} />, text: '¿Qué platos tienen el mejor margen este mes?' },
  { icon: <AlertTriangle size={13} />, text: 'Explica la excepción de consignación en efectivo del 10 jul.' },
  { icon: <DollarSign size={13} />, text: 'Proyecta las ventas de la próxima semana con base en las reservas.' },
  { icon: <Sparkles size={13} />, text: '¿Cuáles son las 3 acciones prioritarias para mejorar la rentabilidad?' },
]

export default function CopilotPage() {
  const [messages, setMessages] = React.useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const bottomRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend(text?: string) {
    const content = text ?? input.trim()
    if (!content) return
    const userMsg: Message = { id: Date.now(), role: 'user', content, timestamp: new Date().toLocaleTimeString('es', { hour: 'numeric', minute: '2-digit' }) }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setTimeout(() => {
      const reply: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Estoy analizando los datos de tu extracto bancario y las exportaciones de Loggro. Con base en los resultados del último audit, puedo ver que esto toca varios rubros. Dame un momento para cruzar las cifras — tendré una respuesta completa en breve.',
        timestamp: new Date().toLocaleTimeString('es', { hour: 'numeric', minute: '2-digit' }),
      }
      setMessages(prev => [...prev, reply])
      setLoading(false)
    }, 1200)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
      <Topbar title="AI Copilot" />
      <div style={{ display: 'flex', gap: 'var(--space-4)', flex: 1, minHeight: 0, padding: 'var(--space-6)', boxSizing: 'border-box', overflow: 'hidden' }}>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <Sparkles size={16} color="var(--accent-primary)" />
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--fg-primary)' }}>JaraLab AI Copilot</div>
              <Badge tone="success" dot>Datos en tiempo real — 12 jul</Badge>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: msg.role === 'assistant' ? 'var(--primary-100)' : 'var(--neutral-200)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.625rem', fontWeight: 700, color: msg.role === 'assistant' ? 'var(--primary-700)' : 'var(--fg-secondary)',
                    letterSpacing: '0.02em',
                  }}>
                    {msg.role === 'assistant' ? 'AI' : 'LJ'}
                  </div>
                  <div style={{ maxWidth: '72%' }}>
                    <div style={{
                      background: msg.role === 'user' ? 'var(--primary-700)' : 'var(--bg-surface)',
                      color: msg.role === 'user' ? 'white' : 'var(--fg-primary)',
                      border: msg.role === 'assistant' ? '1px solid var(--border-subtle)' : 'none',
                      borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                      padding: 'var(--space-3) var(--space-4)',
                      fontSize: '0.875rem', lineHeight: 1.6, whiteSpace: 'pre-wrap',
                    }}>
                      {msg.content}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--fg-tertiary)', marginTop: 4, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem', fontWeight: 700, color: 'var(--primary-700)' }}>AI</div>
                  <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px 12px 12px 2px', padding: 'var(--space-3) var(--space-4)', display: 'flex', gap: 4, alignItems: 'center' }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--fg-tertiary)', animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div style={{ padding: 'var(--space-4) var(--space-5)', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end' }}>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                  placeholder="Pregunta sobre ventas, costos, excepciones, proyecciones…"
                  rows={2}
                  style={{
                    flex: 1, resize: 'none', border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)', padding: 'var(--space-3)',
                    fontFamily: 'var(--font-sans)', fontSize: '0.875rem',
                    color: 'var(--fg-primary)', background: 'var(--bg-page)',
                    outline: 'none', lineHeight: 1.5,
                  }}
                />
                <Button variant="primary" size="md" icon={<Send size={14} />} onClick={() => handleSend()}>
                  Enviar
                </Button>
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--fg-tertiary)', marginTop: 6 }}>
                Enter para enviar · Shift+Enter para nueva línea · AI Copilot lee solo los datos del último audit
              </div>
            </div>
          </Card>
        </div>

        <div style={{ width: 260, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', flexShrink: 0 }}>
          <Card>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--fg-primary)', marginBottom: 'var(--space-4)' }}>Preguntas sugeridas</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s.text)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)',
                    padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)',
                    cursor: 'pointer', textAlign: 'left', width: '100%',
                    color: 'var(--fg-secondary)', fontSize: '0.8125rem', lineHeight: 1.45,
                  }}
                >
                  <span style={{ marginTop: 2, flexShrink: 0, color: 'var(--fg-tertiary)' }}>{s.icon}</span>
                  {s.text}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--fg-primary)', marginBottom: 'var(--space-4)' }}>Fuentes de datos</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[
                { label: 'Extracto bancario',      status: 'success', note: '12 jul · 147 tx' },
                { label: 'Exportación Loggro',     status: 'success', note: '12 jul · 312 cubiertos' },
                { label: 'Hoja de gastos',         status: 'neutral', note: 'No cargada' },
              ].map(d => (
                <div key={d.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--fg-primary)' }}>{d.label}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--fg-tertiary)' }}>{d.note}</div>
                  </div>
                  <Badge tone={d.status as 'success' | 'neutral'} dot>{d.status === 'success' ? 'Lista' : 'Faltante'}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>
      <style>{`@keyframes pulse { 0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); } 40% { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  )
}

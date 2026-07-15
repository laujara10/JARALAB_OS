'use client'
import React from 'react'
import { Send, Sparkles, TrendingUp, AlertTriangle, DollarSign, CheckCircle2, Circle } from 'lucide-react'
import { Topbar } from '@/components/layout/Topbar'
import { loadAuditResult, formatCOP, type AuditResult } from '@/lib/services/audit.service'
import {
  copilotService,
  type CopilotMessage,
  type CopilotContext,
} from '@/lib/services/copilot.service'

// ─── Suggestions ─────────────────────────────────────────────────────────────

const QUICK_SUGGESTIONS = [
  { icon: <AlertTriangle size={12} />, text: '¿Qué debo revisar primero?' },
  { icon: <DollarSign size={12} />,    text: 'Explícame la diferencia pendiente.' },
  { icon: <CheckCircle2 size={12} />,  text: '¿Qué está funcionando bien?' },
  { icon: <TrendingUp size={12} />,    text: '¿Cómo mejoro la conciliación?' },
  { icon: <Sparkles size={12} />,      text: 'Resume esto para mi administradora.' },
]

// ─── Bubble ──────────────────────────────────────────────────────────────────

function Bubble({ msg }: { msg: CopilotMessage }) {
  const isUser = msg.rol === 'usuario'
  return (
    <div style={{ display: 'flex', flexDirection: isUser ? 'row-reverse' : 'row', alignItems: 'flex-start', gap: 10 }}>
      <div style={{
        width: 26, height: 26, flexShrink: 0,
        background: isUser ? 'var(--ink)' : 'transparent',
        border: isUser ? 'none' : '1px solid var(--hairline)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-sans)', fontSize: '0.5625rem', fontWeight: 600, letterSpacing: '0.04em',
        color: isUser ? '#fff' : 'var(--ink-55)',
      }}>
        {isUser ? 'LJ' : 'AI'}
      </div>
      <div style={{ maxWidth: '74%', display: 'flex', flexDirection: 'column', gap: 4, alignItems: isUser ? 'flex-end' : 'flex-start' }}>
        <div style={{
          background: isUser ? 'var(--ink)' : 'var(--panel)',
          color: isUser ? '#ffffff' : 'var(--ink)',
          border: isUser ? 'none' : '1px solid var(--hairline)',
          padding: '10px 14px',
          fontFamily: 'var(--font-sans)', fontSize: '0.875rem', lineHeight: 1.65, whiteSpace: 'pre-wrap',
        }}>
          {msg.texto}
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', color: 'var(--ink-30)', paddingLeft: isUser ? 0 : 2, paddingRight: isUser ? 2 : 0 }}>
          {msg.timestamp}
        </div>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <div style={{ width: 26, height: 26, flexShrink: 0, border: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)', fontSize: '0.5625rem', fontWeight: 600, color: 'var(--ink-55)' }}>AI</div>
      <div style={{ background: 'var(--panel)', border: '1px solid var(--hairline)', padding: '10px 16px', display: 'flex', gap: 5, alignItems: 'center' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--ink-30)', animation: `typingpulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
        ))}
      </div>
    </div>
  )
}

// ─── Side panel — data sources ────────────────────────────────────────────────

function SidePanel({ auditResult, msgCount }: { auditResult: AuditResult | null; msgCount: number }) {
  const sources = auditResult
    ? [
        { label: 'Extracto bancario',   note: `${auditResult.periodo.fecha_fin} · cargado`, ok: true  },
        { label: 'Reporte sistema POS', note: `${auditResult.periodo.fecha_fin} · cargado`, ok: true  },
        { label: 'Maestro de gastos',   note: auditResult.archivos.maestro_gastos ? 'Cargado' : 'No cargado', ok: !!auditResult.archivos.maestro_gastos },
      ]
    : [
        { label: 'Extracto bancario',   note: 'Sin auditoría activa', ok: false },
        { label: 'Reporte sistema POS', note: 'Sin auditoría activa', ok: false },
        { label: 'Maestro de gastos',   note: 'Sin auditoría activa', ok: false },
      ]

  return (
    <div style={{ width: 240, flexShrink: 0, display: 'flex', flexDirection: 'column', background: 'var(--panel)', overflowY: 'auto' }}>
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--hairline)' }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', fontWeight: 500, color: 'var(--ink-30)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Fuentes activas</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sources.map(d => (
            <div key={d.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              {d.ok
                ? <CheckCircle2 size={13} color="var(--success-fg)" style={{ marginTop: 2, flexShrink: 0 }} />
                : <Circle size={13} color="var(--ink-30)" style={{ marginTop: 2, flexShrink: 0 }} />}
              <div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--ink)', lineHeight: 1.3 }}>{d.label}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', color: 'var(--ink-30)', marginTop: 1 }}>{d.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {auditResult && (
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--hairline)' }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', fontWeight: 500, color: 'var(--ink-30)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Auditoría</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-sans)', fontSize: '0.8125rem' }}>
              <span style={{ color: 'var(--ink-55)' }}>Conciliación</span>
              <span style={{ color: 'var(--success-fg)', fontWeight: 500 }}>{auditResult.metricas_secundarias.conciliacion_automatica_pct}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-sans)', fontSize: '0.8125rem' }}>
              <span style={{ color: 'var(--ink-55)' }}>Diferencia</span>
              <span style={{ color: 'var(--urgente)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{formatCOP(auditResult.kpis.diferencia_pendiente.valor)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-sans)', fontSize: '0.8125rem' }}>
              <span style={{ color: 'var(--ink-55)' }}>Por revisar</span>
              <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{auditResult.hallazgos_atencion.length}</span>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--hairline)' }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', fontWeight: 500, color: 'var(--ink-30)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Esta sesión</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--ink-55)' }}>
          {Math.floor(msgCount / 2)} preguntas · {Math.ceil(msgCount / 2)} respuestas
        </div>
      </div>

      <div style={{ padding: '12px 16px', marginTop: 'auto' }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', color: 'var(--ink-30)', lineHeight: 1.6, borderLeft: '2px solid var(--hairline)', paddingLeft: 10 }}>
          El copiloto no guarda memoria entre sesiones. Solo lee los datos del último audit cargado.
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function ts() {
  return new Date().toLocaleTimeString('es', { hour: 'numeric', minute: '2-digit' })
}

export default function CopilotPage() {
  const [auditResult, setAuditResult] = React.useState<AuditResult | null>(null)
  const [messages,    setMessages]    = React.useState<CopilotMessage[]>([])
  const [input,       setInput]       = React.useState('')
  const [loading,     setLoading]     = React.useState(false)
  const bottomRef   = React.useRef<HTMLDivElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // Cargar AuditResult del localStorage al montar
  React.useEffect(() => {
    const result = loadAuditResult()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAuditResult(result)

    const ctx: CopilotContext | null = result ? { auditResult: result } : null
    const initialText = ctx
      ? copilotService.buildInitialMessage(ctx)
      : 'Hola. Aún no tengo datos de una auditoría activa.\n\nPara empezar, ve al Restaurant Auditor, carga los archivos del período y ejecuta la auditoría. Cuando termine, vuelve aquí y podré revisar los resultados contigo.'

    setMessages([{ rol: 'copiloto', texto: initialText, timestamp: ts() }])
  }, [])

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function handleSend(text?: string) {
    const content = (text ?? input).trim()
    if (!content || loading) return
    const userMsg: CopilotMessage = { rol: 'usuario', texto: content, timestamp: ts() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    const ctx: CopilotContext = auditResult
      ? { auditResult }
      : { auditResult: { periodo: { tipo: 'semana', fecha_inicio: '', fecha_fin: '' }, moneda: 'COP', archivos: { extracto_bancario: { nombre: '', tipo: '', tamano_kb: 0, estado: 'pendiente' }, reporte_ventas: { nombre: '', tipo: '', tamano_kb: 0, estado: 'pendiente' }, maestro_gastos: null }, kpis: { ventas_reportadas: { valor: 0, confidence: 'estimado' }, recaudo_identificado: { valor: 0, confidence: 'estimado' }, monto_conciliado: { valor: 0, confidence: 'estimado' }, diferencia_pendiente: { valor: 0, confidence: 'estimado' } }, metricas_secundarias: { cobertura_auditoria_pct: 0, conciliacion_automatica_pct: 0 }, hallazgos_positivos: [], hallazgos_atencion: [], detalle: [], estado_pipeline: 'sin_datos' } }

    try {
      const res = await copilotService.send({ mensaje: content, contexto: ctx })
      setMessages(prev => [...prev, { rol: 'copiloto', texto: res.respuesta, timestamp: ts() }])
    } catch {
      setMessages(prev => [...prev, { rol: 'copiloto', texto: 'Hubo un problema al procesar tu mensaje. Intenta de nuevo.', timestamp: ts() }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Topbar title="AI Copilot" />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

        {/* ── Chat ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, borderRight: '1px solid var(--hairline)' }}>

          {/* Cabecera */}
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--panel)', flexShrink: 0 }}>
            <Sparkles size={14} color="var(--terracota)" />
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink)' }}>JaraLab AI Copilot</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 4 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: auditResult ? 'var(--success-fg)' : 'var(--ink-30)', display: 'inline-block' }} />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', color: 'var(--ink-55)' }}>
                {auditResult ? `Auditoría ${auditResult.periodo.fecha_fin}` : 'Sin auditoría activa'}
              </span>
            </div>
          </div>

          {/* Mensajes */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 16px', display: 'flex', flexDirection: 'column', gap: 20, background: 'var(--bg)' }}>
            {messages.map((msg, i) => <Bubble key={i} msg={msg} />)}
            {loading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Sugerencias */}
          <div style={{ padding: '10px 20px 0', background: 'var(--bg)', display: 'flex', gap: 6, flexWrap: 'wrap', flexShrink: 0 }}>
            {QUICK_SUGGESTIONS.map((s, i) => (
              <button key={i} onClick={() => handleSend(s.text)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontFamily: 'var(--font-sans)', fontSize: '0.75rem',
                color: 'var(--ink-55)', background: 'var(--panel)',
                border: '1px solid var(--hairline)', padding: '5px 10px', cursor: 'pointer', whiteSpace: 'nowrap',
              }}>
                <span style={{ color: 'var(--ink-30)' }}>{s.icon}</span>{s.text}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '12px 20px 16px', background: 'var(--bg)', borderTop: '1px solid var(--hairline)', marginTop: 10, flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                placeholder="Pregunta sobre el resultado de la auditoría…"
                rows={2}
                style={{ flex: 1, resize: 'none', border: '1px solid var(--hairline)', padding: '10px 12px', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--ink)', background: 'var(--panel)', outline: 'none', lineHeight: 1.55 }}
              />
              <button onClick={() => handleSend()} disabled={!input.trim() || loading} style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 500,
                padding: '10px 16px', border: 'none', cursor: !input.trim() || loading ? 'not-allowed' : 'pointer',
                background: !input.trim() || loading ? 'var(--hairline)' : 'var(--ink)',
                color: !input.trim() || loading ? 'var(--ink-30)' : '#fff',
                flexShrink: 0, alignSelf: 'stretch',
              }}>
                <Send size={14} /> Enviar
              </button>
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', color: 'var(--ink-30)', marginTop: 6 }}>
              Enter para enviar · Shift+Enter para nueva línea
            </div>
          </div>
        </div>

        {/* ── Side panel ── */}
        <SidePanel auditResult={auditResult} msgCount={messages.length} />
      </div>

      <style>{`@keyframes typingpulse{0%,100%{opacity:.3;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  )
}

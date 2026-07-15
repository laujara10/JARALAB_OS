'use client'
import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  AlertTriangle, CheckCircle2, Clock, Copy, RefreshCw,
  ArrowRight, Sparkles, WifiOff, CircleDashed, Info,
  ChevronRight, Sun, Sunset, Moon,
} from 'lucide-react'

// ─── JSON CONTRACT ────────────────────────────────────────────────────────────
// Shape expected from GET /api/hoy
// {
//   greeting_text: string,
//   fecha: string,                        // ISO 8601
//   conciliacion_resumen: {
//     porcentaje_limpio: number | null,
//     status: 'ok' | 'atencion' | 'sin_datos',
//     fuente_disponible: boolean,
//   },
//   decisiones: Array<{
//     id: string,
//     titulo: string,
//     descripcion: string,
//     severidad: 'urgente' | 'revisar' | 'info',
//     confidence: 'confirmado' | 'estimado',
//     accion_sugerida: string,
//     cta_label: string,
//   }>,
//   mensaje_equipo: string | null,
//   estado_pipeline: 'completado' | 'corriendo' | 'error',
// }

type Severidad = 'urgente' | 'revisar' | 'info'
type Confidence = 'confirmado' | 'estimado'
type PipelineEstado = 'completado' | 'corriendo' | 'error'
type ConciliacionStatus = 'ok' | 'atencion' | 'sin_datos'
type UiEstado = 'normal' | 'vacio' | 'error' | 'carga'

interface Decision {
  id: string
  titulo: string
  descripcion: string
  severidad: Severidad
  confidence: Confidence
  accion_sugerida: string
  cta_label: string
}

interface HoyData {
  greeting_text: string
  fecha: string
  conciliacion_resumen: {
    porcentaje_limpio: number | null
    status: ConciliacionStatus
    fuente_disponible: boolean
  }
  decisiones: Decision[]
  mensaje_equipo: string | null
  estado_pipeline: PipelineEstado
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const MOCK_NORMAL: HoyData = {
  greeting_text: 'Buenos días, Laura. Revisé Pikeo mientras dormías.',
  fecha: '2026-07-14T08:05:00-05:00',
  conciliacion_resumen: {
    porcentaje_limpio: 97.3,
    status: 'atencion',
    fuente_disponible: true,
  },
  decisiones: [
    {
      id: 'd1',
      titulo: 'Cobro duplicado de Nequi — $12,400 recuperables',
      descripcion:
        'La comisión de Nequi aparece dos veces en el extracto de ayer: 18:42 y 18:43. Mismo monto, misma referencia. Muy probablemente un error del proveedor.',
      severidad: 'urgente',
      confidence: 'confirmado',
      accion_sugerida: 'Llama a Nequi antes de las 12pm para solicitar reversión. Número: 018000-NEQUI.',
      cta_label: 'Marcar como gestionado',
    },
    {
      id: 'd2',
      titulo: 'Débito "PAYU*SERVICIOS" sin respaldo en gastos',
      descripcion:
        'Salió $3,200 hacia PAYU*SERVICIOS el martes. No aparece en el archivo maestro de gastos. Puede ser una suscripción que no se registró o un cargo no autorizado.',
      severidad: 'revisar',
      confidence: 'confirmado',
      accion_sugerida: 'Verifica en tu cuenta PayU si corresponde a un servicio activo.',
      cta_label: 'Revisar en PayU',
    },
    {
      id: 'd3',
      titulo: 'Liquidación Redeban difiere $12.40 del esperado',
      descripcion:
        'El neto recibido de Redeban fue $12.40 menos que lo calculado por el motor. Diferencia pequeña pero fuera del margen de tolerancia.',
      severidad: 'revisar',
      confidence: 'estimado',
      accion_sugerida: 'Consulta el comprobante de liquidación Redeban para verificar la comisión aplicada.',
      cta_label: 'Ver detalle',
    },
    {
      id: 'd4',
      titulo: 'GMF deducido $84.20 — dentro de lo esperado',
      descripcion:
        'El gravamen a movimientos financieros de ayer está en el rango normal. Sin acción requerida.',
      severidad: 'info',
      confidence: 'confirmado',
      accion_sugerida: 'Sin acción requerida.',
      cta_label: 'Entendido',
    },
  ],
  mensaje_equipo:
    '"Ayer cerramos en 97%. Hay un cobro duplicado de Nequi que ya estoy gestionando. Por favor revisa el pago a PayU del mediodía y dime qué fue. Todo lo demás cuadró."',
  estado_pipeline: 'completado',
}

const MOCK_VACIO: HoyData = {
  greeting_text: 'Buenos días, Laura. Pikeo cerró limpio anoche.',
  fecha: '2026-07-14T08:05:00-05:00',
  conciliacion_resumen: {
    porcentaje_limpio: 100,
    status: 'ok',
    fuente_disponible: true,
  },
  decisiones: [],
  mensaje_equipo:
    '"Todo cuadró anoche — 100% conciliado. Nada pendiente de revisión. Buen día."',
  estado_pipeline: 'completado',
}

const MOCK_ERROR: HoyData = {
  greeting_text: 'Buenos días, Laura. Necesito un dato antes de poder analizar.',
  fecha: '2026-07-14T08:05:00-05:00',
  conciliacion_resumen: {
    porcentaje_limpio: null,
    status: 'sin_datos',
    fuente_disponible: false,
  },
  decisiones: [],
  mensaje_equipo: null,
  estado_pipeline: 'error',
}

const MOCK_CARGA: HoyData = {
  greeting_text: 'Analizando Pikeo…',
  fecha: '2026-07-14T08:05:00-05:00',
  conciliacion_resumen: {
    porcentaje_limpio: null,
    status: 'sin_datos',
    fuente_disponible: true,
  },
  decisiones: [],
  mensaje_equipo: null,
  estado_pipeline: 'corriendo',
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function formatFecha(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function getGreetingIcon(hora: number) {
  if (hora < 12) return Sun
  if (hora < 19) return Sunset
  return Moon
}

// v3: solo color de texto + punto — sin fondo relleno
const SEVERIDAD_CONFIG: Record<Severidad, { label: string; color: string; border: string }> = {
  urgente: { label: 'Urgente', color: 'var(--urgente)',      border: 'var(--urgente)' },
  revisar: { label: 'Revisar', color: 'var(--warning-fg)',   border: 'var(--warning-fg)' },
  info:    { label: 'Info',    color: 'var(--ink-55)',        border: 'var(--hairline)' },
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

// v3: sin fondo — texto en color de severidad + punto
function SeveridadBadge({ s }: { s: Severidad }) {
  const cfg = SEVERIDAD_CONFIG[s]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: '0.6875rem', fontWeight: 500, fontFamily: 'var(--font-sans)',
      letterSpacing: '0.04em', textTransform: 'uppercase',
      color: cfg.color, padding: '2px 0',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.color, display: 'inline-block', flexShrink: 0 }} />
      {cfg.label}
    </span>
  )
}

function ConfidenceMark({ c }: { c: Confidence }) {
  if (c === 'confirmado') return null
  return (
    <span title="Estimado — verificar antes de actuar" style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      fontSize: '0.6875rem', fontWeight: 500, fontFamily: 'var(--font-sans)',
      color: 'var(--ink-55)', padding: '2px 0',
    }}>
      <CircleDashed size={10} />
      estimado
    </span>
  )
}

function DecisionCard({ d }: { d: Decision }) {
  const cfg = SEVERIDAD_CONFIG[d.severidad]
  return (
    <div style={{
      background: 'var(--panel)',
      border: '1px solid var(--hairline)',
      borderLeft: `3px solid ${cfg.border}`,
      padding: '16px 20px',
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <SeveridadBadge s={d.severidad} />
          <ConfidenceMark c={d.confidence} />
        </div>
      </div>

      <div>
        <div style={{
          fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', fontWeight: 600,
          color: 'var(--fg-primary)', lineHeight: 1.35, marginBottom: 4,
        }}>
          {d.titulo}
        </div>
        <div style={{
          fontFamily: 'var(--font-sans)', fontSize: '0.8125rem',
          color: 'var(--fg-secondary)', lineHeight: 1.6,
        }}>
          {d.descripcion}
        </div>
      </div>

      {d.severidad !== 'info' && (
        <div style={{
          background: 'var(--bg)', border: '1px solid var(--hairline)',
          padding: '10px 14px', display: 'flex', gap: 8, alignItems: 'flex-start',
        }}>
          <ArrowRight size={14} style={{ marginTop: 2, flexShrink: 0, color: 'var(--fg-tertiary)' }} />
          <span style={{
            fontFamily: 'var(--font-sans)', fontSize: '0.8125rem',
            color: 'var(--fg-secondary)', lineHeight: 1.5,
          }}>
            {d.accion_sugerida}
          </span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 500,
          color: d.severidad === 'urgente' ? 'var(--danger-500)' : d.severidad === 'revisar' ? 'var(--fg-accent)' : 'var(--fg-tertiary)',
          background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0',
        }}>
          {d.cta_label}
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

function ConciliacionBlock({ resumen }: { resumen: HoyData['conciliacion_resumen'] }) {
  if (!resumen.fuente_disponible) {
    return (
      <div style={{
        background: 'var(--bg-canvas)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <WifiOff size={18} color="var(--fg-tertiary)" />
        <div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--fg-primary)' }}>
            Fuente de datos no disponible
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--fg-secondary)', marginTop: 2 }}>
            El motor no pudo leer los datos necesarios. El porcentaje de conciliación no está disponible.
          </div>
        </div>
      </div>
    )
  }

  const pct = resumen.porcentaje_limpio
  const isOk = resumen.status === 'ok'
  const color = isOk ? 'var(--success-fg)' : 'var(--warning-fg)'

  return (
    <div style={{
      background: 'var(--panel)',
      border: '1px solid var(--hairline)',
      borderLeft: `3px solid ${color}`,
      padding: '16px 20px',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <CheckCircle2 size={20} color={color} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--fg-secondary)' }}>
          Conciliación de la noche anterior
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1.125rem', fontWeight: 700, color: 'var(--fg-primary)', marginTop: 2 }}>
          {pct !== null ? `${pct}% concilió limpio` : '—'}
          {resumen.status === 'atencion' && (
            <span style={{
              marginLeft: 10, fontSize: '0.75rem', fontWeight: 500,
              color: 'var(--warning-500)',
            }}>
              — hay excepciones abajo
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function MensajeEquipo({ texto }: { texto: string }) {
  const [copiado, setCopiado] = React.useState(false)

  function copiar() {
    navigator.clipboard.writeText(texto.replace(/^"|"$/g, ''))
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <div style={{
      background: 'var(--ink)',
      padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      <div style={{
        fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 600,
        letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--neutral-400)',
      }}>
        Qué decirle a tu equipo hoy
      </div>
      <div style={{
        fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', lineHeight: 1.65,
        color: '#ffffff', fontStyle: 'normal',
      }}>
        {texto}
      </div>
      <button
        onClick={copiar}
        style={{
          alignSelf: 'flex-start',
          display: 'inline-flex', alignItems: 'center', gap: 7,
          fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 600,
          color: copiado ? 'var(--success-fg)' : '#ffffff',
          background: copiado ? 'transparent' : 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.25)', cursor: 'pointer',
          padding: '8px 16px',
          transition: 'background 0.15s ease',
        }}
      >
        <Copy size={13} />
        {copiado ? 'Copiado ✓' : 'Copiar mensaje →'}
      </button>
    </div>
  )
}

// ─── LOADING STATE ────────────────────────────────────────────────────────────

function EstadoCarga() {
  const pasos = ['Ingesta', 'Normalización', 'Expectativas', 'Conciliación', 'Auditoría', 'Reporte']
  const [paso, setPaso] = React.useState(0)

  React.useEffect(() => {
    const t = setInterval(() => setPaso(p => (p + 1) % pasos.length), 900)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: 360, gap: 28, padding: '40px 0',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        border: '3px solid var(--primary-100)',
        borderTop: '3px solid var(--primary-600)',
        animation: 'spin 0.9s linear infinite',
      }} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 600, color: 'var(--fg-primary)', marginBottom: 6 }}>
          Analizando Pikeo…
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--fg-tertiary)' }}>
          {['Leyendo los archivos del día…', 'Convirtiendo eventos…', 'Generando expectativas…', 'Cruzando contra el banco…', 'Revisando gastos y anomalías…', 'Preparando tu resumen…'][paso]}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {pasos.map((p, i) => (
          <div key={p} style={{
            width: i === paso ? 28 : 8, height: 8,
            borderRadius: 'var(--radius-full)',
            background: i < paso ? 'var(--primary-400)' : i === paso ? 'var(--primary-600)' : 'var(--neutral-200)',
            transition: 'width 0.3s ease, background 0.3s ease',
          }} />
        ))}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ─── ERROR STATE ──────────────────────────────────────────────────────────────

function EstadoError() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: 320, gap: 20, padding: '40px 0', textAlign: 'center',
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: '50%',
        background: 'var(--danger-100)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <WifiOff size={22} color="var(--danger-500)" />
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 600, color: 'var(--fg-primary)', marginBottom: 6 }}>
          No pude leer los datos de hoy
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--fg-secondary)', maxWidth: 380, lineHeight: 1.6 }}>
          El motor no encontró el extracto bancario o el Loggro del día anterior. Esto <strong>no significa que todo esté bien</strong> — significa que aún no tengo datos para analizarlo.
        </div>
      </div>
      <div style={{
        background: 'var(--bg-canvas)', border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)', padding: '14px 20px',
        display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 400, textAlign: 'left',
      }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Qué revisar
        </div>
        {['¿El Loggro del día anterior fue exportado?', '¿El extracto bancario está disponible en Bancolombia?', '¿El Google Sheet de gastos está accesible?'].map(item => (
          <div key={item} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <AlertTriangle size={13} color="var(--warning-500)" style={{ marginTop: 2, flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--fg-secondary)' }}>{item}</span>
          </div>
        ))}
      </div>
      <button style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 600,
        color: 'var(--fg-inverse)', background: 'var(--bg-accent)',
        border: 'none', cursor: 'pointer',
        padding: '10px 20px', borderRadius: 'var(--radius-sm)',
      }}>
        <RefreshCw size={14} />
        Ir al Auditor para cargar archivos
      </button>
    </div>
  )
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────

function EstadoVacio() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: 280, gap: 16, padding: '48px 0', textAlign: 'center',
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: '50%',
        background: 'var(--success-100)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <CheckCircle2 size={24} color="var(--success-500)" />
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 600, color: 'var(--fg-primary)', marginBottom: 6 }}>
          Sin excepciones hoy
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--fg-secondary)', maxWidth: 340, lineHeight: 1.65 }}>
          El motor revisó todo y no encontró nada que requiera tu atención. Vacío aquí significa que Pikeo cerró bien.
        </div>
      </div>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontFamily: 'var(--font-sans)', fontSize: '0.75rem',
        color: 'var(--fg-tertiary)',
        background: 'var(--bg-surface-2)', padding: '5px 12px',
        borderRadius: 'var(--radius-full)',
      }}>
        <Info size={12} />
        Vacío = todo bien. No es un error de pantalla.
      </div>
    </div>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

const ESTADO_LABELS: Record<UiEstado, string> = {
  normal: 'Normal (con hallazgos)',
  vacio:  'Vacío (0 excepciones)',
  error:  'Error / datos faltantes',
  carga:  'Cargando pipeline',
}

const MOCK_MAP: Record<UiEstado, HoyData> = {
  normal: MOCK_NORMAL,
  vacio:  MOCK_VACIO,
  error:  MOCK_ERROR,
  carga:  MOCK_CARGA,
}

function HoyPageInner() {
  const searchParams = useSearchParams()
  const isDevMode = searchParams.get('dev') === 'true'
  const [uiEstado, setUiEstado] = useState<UiEstado>('normal')
  const data = MOCK_MAP[uiEstado]

  const fecha = new Date(data.fecha)
  const hora = fecha.getHours()
  const GreetIcon = getGreetingIcon(hora)

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)' }}>
      {/* Dev switcher — only visible at /hoy?dev=true, never in production */}
      {isDevMode && (
        <div style={{
          position: 'sticky', top: 0, zIndex: 10,
          background: 'var(--neutral-950)', padding: '8px 28px',
          display: 'flex', alignItems: 'center', gap: 10,
          borderBottom: '1px solid var(--neutral-800)',
        }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', color: 'var(--neutral-400)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Estado · DEV
          </span>
          {(Object.keys(ESTADO_LABELS) as UiEstado[]).map(e => (
            <button
              key={e}
              onClick={() => setUiEstado(e)}
              style={{
                fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 500,
                padding: '4px 10px', borderRadius: 'var(--radius-full)',
                background: uiEstado === e ? 'var(--primary-600)' : 'var(--neutral-800)',
                color: uiEstado === e ? 'white' : 'var(--neutral-400)',
                border: 'none', cursor: 'pointer', transition: 'background 0.15s',
              }}
            >
              {ESTADO_LABELS[e]}
            </button>
          ))}
        </div>
      )}

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 28px 60px' }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            {React.createElement(GreetIcon, { size: 16, color: 'var(--fg-tertiary)' })}
            <span style={{
              fontFamily: 'var(--font-sans)', fontSize: '0.75rem',
              color: 'var(--fg-tertiary)', textTransform: 'capitalize',
            }}>
              {formatFecha(data.fecha)}
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-sans)', fontSize: '1.5rem', fontWeight: 700,
            color: 'var(--fg-primary)', lineHeight: 1.25, margin: 0,
          }}>
            {data.greeting_text}
          </h1>
        </div>

        {/* ── CONCILIACIÓN ── */}
        {data.estado_pipeline !== 'corriendo' && (
          <div style={{ marginBottom: 24 }}>
            <ConciliacionBlock resumen={data.conciliacion_resumen} />
          </div>
        )}

        {/* ── ESTADOS PRINCIPALES ── */}
        {data.estado_pipeline === 'corriendo' && <EstadoCarga />}

        {data.estado_pipeline === 'error' && <EstadoError />}

        {data.estado_pipeline === 'completado' && data.decisiones.length === 0 && <EstadoVacio />}

        {data.estado_pipeline === 'completado' && data.decisiones.length > 0 && (
          <>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 14,
            }}>
              <div style={{
                fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 600,
                color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>
                Decisiones de hoy — {data.decisiones.length}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['urgente', 'revisar', 'info'] as Severidad[]).map(s => {
                  const n = data.decisiones.filter(d => d.severidad === s).length
                  if (!n) return null
                  const cfg = SEVERIDAD_CONFIG[s]
                  return (
                    <span key={s} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      fontSize: '0.6875rem', fontWeight: 500, fontFamily: 'var(--font-sans)',
                      color: cfg.color,
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.color, display: 'inline-block' }} />
                      {n} {s}
                    </span>
                  )
                })}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {data.decisiones.map(d => <DecisionCard key={d.id} d={d} />)}
            </div>
          </>
        )}

        {/* ── CTA NUEVA AUDITORÍA ── */}
        {data.estado_pipeline !== 'corriendo' && (
          <div style={{ marginBottom: 28 }}>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 500,
              color: 'var(--ink-55)', background: 'transparent',
              border: '1px solid var(--hairline)', cursor: 'pointer',
              padding: '9px 16px',
            }}>
              <RefreshCw size={14} />
              Nueva auditoría
            </button>
          </div>
        )}

        {/* ── MENSAJE EQUIPO ── */}
        {data.mensaje_equipo && (
          <MensajeEquipo texto={data.mensaje_equipo} />
        )}

        {/* ── COPILOTO PILL ── */}
        {data.estado_pipeline === 'completado' && (
          <div style={{ marginTop: 20 }}>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 500,
              color: 'var(--teal)', background: 'transparent',
              border: '1px solid var(--hairline)', cursor: 'pointer',
              padding: '9px 16px',
            }}>
              <Sparkles size={14} />
              Preguntarle algo al Copiloto
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function HoyPage() {
  return (
    <React.Suspense fallback={null}>
      <HoyPageInner />
    </React.Suspense>
  )
}

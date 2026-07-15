import type { AuditResult, AuditFinding } from './audit.service'
import { formatCOP } from './audit.service'

// ─── Tipos canónicos del Copilot ─────────────────────────────────────────────

export interface CopilotContext {
  auditResult: AuditResult
  hallazgoSeleccionado?: string
}

export interface CopilotMessage {
  rol: 'usuario' | 'copiloto'
  texto: string
  timestamp: string
}

export interface CopilotRequest {
  mensaje: string
  contexto: CopilotContext
}

export interface CopilotResponse {
  respuesta: string
  acciones_sugeridas: string[]
}

// ─── Interfaz estable del servicio ───────────────────────────────────────────
// Implementación real: POST /api/v1/copilot/messages
// Entrada: { mensaje, contexto: { auditResult, hallazgoSeleccionado } }
// Salida:  { respuesta, acciones_sugeridas }

export interface ICopilotService {
  send(request: CopilotRequest): Promise<CopilotResponse>
  buildInitialMessage(context: CopilotContext): string
}

// ─── Mock contextual ─────────────────────────────────────────────────────────

function urgenteFinding(result: AuditResult): AuditFinding | undefined {
  return result.hallazgos_atencion.find(h => h.severidad === 'urgente')
    ?? result.hallazgos_atencion[0]
}

function buildInitialMessage(context: CopilotContext): string {
  const { auditResult } = context
  const { metricas_secundarias, hallazgos_atencion, hallazgos_positivos } = auditResult
  const top = urgenteFinding(auditResult)
  const n = hallazgos_atencion.length
  const pct = metricas_secundarias.conciliacion_automatica_pct

  const lineas = [
    `Ya revisé la auditoría de la ${auditResult.periodo.tipo === 'semana' ? 'semana' : 'período seleccionado'}.`,
    '',
    n > 0
      ? `Encontré ${n} asunto${n > 1 ? 's' : ''} que requier${n > 1 ? 'en' : 'e'} atención.${top ? ` El de mayor impacto es ${top.titulo.toLowerCase()} — ${formatCOP(top.monto)}.` : ''}`
      : 'Todo concilió limpio esta semana.',
    '',
    `La conciliación automática llegó al ${pct}%.`,
    hallazgos_positivos.length > 0 ? hallazgos_positivos[0] : '',
    '',
    top
      ? `Mi recomendación es empezar por ${top.titulo.toLowerCase()}.`
      : '¿Quieres que revisemos algún punto específico?',
  ]

  return lineas.filter(l => l !== undefined).join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

function buildContextualResponse(mensaje: string, context: CopilotContext): CopilotResponse {
  const { auditResult } = context
  const top = urgenteFinding(auditResult)
  const { kpis, metricas_secundarias, hallazgos_positivos, hallazgos_atencion } = auditResult
  const pct = metricas_secundarias.conciliacion_automatica_pct

  const msg = mensaje.toLowerCase()

  if (msg.includes('primero') || msg.includes('revisar primero') || msg.includes('empezar')) {
    return {
      respuesta: top
        ? `Empieza por "${top.titulo}". Es el movimiento de mayor impacto: ${formatCOP(top.monto)}.\n\n${top.accion_sugerida}`
        : `Esta semana no hay urgencias. Puedes revisar los hallazgos de menor prioridad a tu ritmo.`,
      acciones_sugeridas: ['Explícame la diferencia pendiente.', '¿Qué está funcionando bien?'],
    }
  }

  if (msg.includes('diferencia') || msg.includes('pendiente')) {
    const dif = kpis.diferencia_pendiente.valor
    return {
      respuesta: `La diferencia pendiente es ${formatCOP(dif)}.\n\nEsto representa lo que el sistema identificó como recaudo pero aún no tiene una venta del sistema POS que lo respalde con certeza. El ${pct}% ya concilió automáticamente — el restante necesita tu revisión manual.\n\n${hallazgos_atencion.length > 0 ? `El principal caso: ${hallazgos_atencion[0].descripcion}` : ''}`,
      acciones_sugeridas: ['¿Qué debo revisar primero?', '¿Cómo mejoro la conciliación?'],
    }
  }

  if (msg.includes('bien') || msg.includes('funcionando') || msg.includes('positivo')) {
    const positivos = hallazgos_positivos.join('\n• ')
    return {
      respuesta: `Esto está funcionando bien esta semana:\n\n• ${positivos}\n\nEl ${pct}% de conciliación automática es una señal de que los archivos están llegando completos y a tiempo.`,
      acciones_sugeridas: ['¿Cómo mejoro la conciliación?', 'Resume esto para mi administradora.'],
    }
  }

  if (msg.includes('conciliac') || msg.includes('mejorar')) {
    return {
      respuesta: `Para mejorar la conciliación del ${pct}% actual hay dos acciones concretas:\n\n1. Cargar el maestro de gastos. Cuando no está disponible, los débitos sin categoría quedan sin clasificar y bajan el porcentaje.\n\n2. Subir el reporte del sistema POS el mismo día. Los pagos en tránsito que llegan al día siguiente generan diferencias temporales que se resuelven solos, pero cuentan como pendientes durante la auditoría.`,
      acciones_sugeridas: ['¿Qué debo revisar primero?', 'Resume esto para mi administradora.'],
    }
  }

  if (msg.includes('administradora') || msg.includes('resumen') || msg.includes('resumir')) {
    const n = hallazgos_atencion.length
    const top2 = hallazgos_atencion.slice(0, 2)
    return {
      respuesta: `Aquí un resumen listo para compartir:\n\n"Auditoría de la semana completada. El ${pct}% concilió automáticamente. ${n > 0 ? `Hay ${n} punto${n > 1 ? 's' : ''} por revisar:${top2.map(h => `\n• ${h.titulo} (${formatCOP(h.monto)})`).join('')}` : 'Todo concilió limpio.'}${n > 0 ? `\n\nPrioridad: ${top2[0].accion_sugerida}` : ''}"`,
      acciones_sugeridas: ['¿Qué debo revisar primero?', '¿Qué está funcionando bien?'],
    }
  }

  // Respuesta genérica contextual
  return {
    respuesta: `Revisando la auditoría de esta ${auditResult.periodo.tipo === 'semana' ? 'semana' : 'período'}. Tengo la información de ${auditResult.archivos.extracto_bancario.nombre} y ${auditResult.archivos.reporte_ventas.nombre}.\n\n¿Quieres que profundice en algún hallazgo específico o en las métricas de conciliación?`,
    acciones_sugeridas: ['¿Qué debo revisar primero?', 'Explícame la diferencia pendiente.', '¿Qué está funcionando bien?'],
  }
}

export const mockCopilotService: ICopilotService = {
  buildInitialMessage,
  async send(request: CopilotRequest): Promise<CopilotResponse> {
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600))
    return buildContextualResponse(request.mensaje, request.contexto)
  },
}

// Exportar el servicio activo
export const copilotService: ICopilotService = mockCopilotService

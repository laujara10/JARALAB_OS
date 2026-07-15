// ─── Tipos canónicos del Auditor ─────────────────────────────────────────────
// Estos nombres de campo están en uso en otras pantallas del sistema.
// NO cambiar sin actualizar Resumen y las alertas_activas.

export interface AuditPeriod {
  tipo: 'hoy' | 'semana' | 'mes' | 'ultimos_30'
  fecha_inicio: string // ISO 8601
  fecha_fin: string
}

export interface AuditFile {
  nombre: string
  tipo: string
  tamano_kb: number
  estado: 'pendiente' | 'valido' | 'invalido'
}

export interface AuditMetric {
  valor: number
  confidence: 'confirmado' | 'estimado'
}

export interface AuditFinding {
  titulo: string
  descripcion: string
  monto: number
  severidad: 'urgente' | 'revisar' | 'info'
  accion_sugerida: string
}

export interface AuditTransaction {
  fecha: string
  referencia: string
  cuenta: string
  venta_pos: number | null
  movimiento_bancario: number | null
  estado: 'conciliado' | 'posible_coincidencia' | 'requiere_revision' | 'sin_evidencia'
  diferencia: number
  accion: 'ver_detalle' | 'confirmar' | 'asociar' | 'marcar_revision'
}

export interface AuditResult {
  periodo: AuditPeriod
  moneda: string
  archivos: {
    extracto_bancario: AuditFile
    reporte_ventas: AuditFile
    maestro_gastos: AuditFile | null
  }
  kpis: {
    ventas_reportadas: AuditMetric
    recaudo_identificado: AuditMetric
    monto_conciliado: AuditMetric
    diferencia_pendiente: AuditMetric
  }
  metricas_secundarias: {
    cobertura_auditoria_pct: number
    conciliacion_automatica_pct: number
  }
  hallazgos_positivos: string[]
  hallazgos_atencion: AuditFinding[]
  detalle: AuditTransaction[]
  estado_pipeline: 'completado' | 'corriendo' | 'error' | 'sin_datos'
}

export interface AuditError {
  tipo: 'sin_datos' | 'archivo_invalido' | 'error_procesamiento'
  mensaje: string
}

export interface AuditRequest {
  archivos: AuditFile[]
  periodo: AuditPeriod
  restaurantId: string
}

// ─── Interfaz estable del servicio ───────────────────────────────────────────
// Implementación real: POST /api/v1/audits
// Entrada: { archivos, periodo, restaurantId }
// Salida:  AuditResult

export interface IAuditService {
  run(request: AuditRequest): Promise<AuditResult>
}

// ─── Mock — reemplazar por apiAuditService cuando el backend esté listo ──────

const MOCK_RESULT: AuditResult = {
  periodo: {
    tipo: 'semana',
    fecha_inicio: '2026-07-07',
    fecha_fin: '2026-07-13',
  },
  moneda: 'COP',
  archivos: {
    extracto_bancario: { nombre: 'extracto_bancolombia_jul.xlsx', tipo: 'xlsx', tamano_kb: 48, estado: 'valido' },
    reporte_ventas:    { nombre: 'ventas_pos_semana.xlsx',         tipo: 'xlsx', tamano_kb: 31, estado: 'valido' },
    maestro_gastos:    null,
  },
  kpis: {
    ventas_reportadas:   { valor: 8_421_000, confidence: 'confirmado' },
    recaudo_identificado:{ valor: 7_936_000, confidence: 'confirmado' },
    monto_conciliado:    { valor: 7_234_000, confidence: 'confirmado' },
    diferencia_pendiente:{ valor: 702_000,   confidence: 'estimado'   },
  },
  metricas_secundarias: {
    cobertura_auditoria_pct: 72,
    conciliacion_automatica_pct: 86,
  },
  hallazgos_positivos: [
    'El 86% de los movimientos concilió de forma automática.',
    'Todos los débitos de comisiones Redeban están dentro del rango esperado.',
    'No se detectaron transferencias salientes sin categoría.',
  ],
  hallazgos_atencion: [
    {
      titulo: 'Transferencia sin venta asociada',
      descripcion: 'Hay una transferencia recibida de $1.061.800 el 10 de julio que aún no tiene una venta del sistema POS que la respalde. Puede ser un pago anticipado, un depósito de evento o un error de registro.',
      monto: 1_061_800,
      severidad: 'urgente',
      accion_sugerida: 'Verificar si corresponde a un evento del 9 o 10 de julio y asociar la venta.',
    },
    {
      titulo: 'Diferencia en liquidación Nequi',
      descripcion: 'El reporte del sistema POS registra $387.200 en pagos Nequi, pero el extracto bancario muestra $374.800. La diferencia de $12.400 puede ser una comisión no contemplada o un pago aún en tránsito.',
      monto: 12_400,
      severidad: 'revisar',
      accion_sugerida: 'Revisar si la comisión de Nequi de esta semana ya fue descontada o está pendiente.',
    },
    {
      titulo: 'Débito sin categoría en maestro de gastos',
      descripcion: 'Un débito de $48.000 del 8 de julio identificado como "PAYU*SERVICIOS" no aparece en el archivo de gastos. Sin el maestro de gastos esta semana, no es posible clasificarlo.',
      monto: 48_000,
      severidad: 'info',
      accion_sugerida: 'Cargar el maestro de gastos en la próxima auditoría para clasificar este movimiento.',
    },
  ],
  detalle: [
    { fecha: '2026-07-07', referencia: 'TRF-001', cuenta: 'Bancolombia', venta_pos: 1_240_000, movimiento_bancario: 1_240_000, estado: 'conciliado',           diferencia: 0,         accion: 'ver_detalle'    },
    { fecha: '2026-07-08', referencia: 'TRF-002', cuenta: 'Bancolombia', venta_pos: 980_000,   movimiento_bancario: 980_000,   estado: 'conciliado',           diferencia: 0,         accion: 'ver_detalle'    },
    { fecha: '2026-07-08', referencia: 'DBT-003', cuenta: 'Bancolombia', venta_pos: null,       movimiento_bancario: 48_000,    estado: 'sin_evidencia',        diferencia: 48_000,    accion: 'marcar_revision'},
    { fecha: '2026-07-09', referencia: 'TRF-004', cuenta: 'Bancolombia', venta_pos: 1_560_000, movimiento_bancario: 1_560_000, estado: 'conciliado',           diferencia: 0,         accion: 'ver_detalle'    },
    { fecha: '2026-07-10', referencia: 'TRF-005', cuenta: 'Bancolombia', venta_pos: null,       movimiento_bancario: 1_061_800, estado: 'requiere_revision',    diferencia: 1_061_800, accion: 'asociar'        },
    { fecha: '2026-07-11', referencia: 'TRF-006', cuenta: 'Bancolombia', venta_pos: 1_890_000, movimiento_bancario: 1_902_000, estado: 'posible_coincidencia', diferencia: 12_000,    accion: 'confirmar'      },
    { fecha: '2026-07-12', referencia: 'NEQ-007', cuenta: 'Nequi',       venta_pos: 387_200,   movimiento_bancario: 374_800,   estado: 'posible_coincidencia', diferencia: 12_400,    accion: 'confirmar'      },
    { fecha: '2026-07-13', referencia: 'TRF-008', cuenta: 'Bancolombia', venta_pos: 802_000,   movimiento_bancario: 802_000,   estado: 'conciliado',           diferencia: 0,         accion: 'ver_detalle'    },
  ],
  estado_pipeline: 'completado',
}

export const mockAuditService: IAuditService = {
  async run(_request: AuditRequest): Promise<AuditResult> {
    // Simula latencia del backend
    await new Promise(r => setTimeout(r, 5400))
    return { ...MOCK_RESULT, periodo: _request.periodo }
  },
}

// Exportar el servicio activo — cambiar a apiAuditService cuando el backend esté listo
export const auditService: IAuditService = mockAuditService

// Helpers
export const AUDIT_STORAGE_KEY = 'jaralab:audit-result'

export function saveAuditResult(result: AuditResult): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(result))
  }
}

export function loadAuditResult(): AuditResult | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY)
    return raw ? JSON.parse(raw) as AuditResult : null
  } catch {
    return null
  }
}

export function formatCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value)
}

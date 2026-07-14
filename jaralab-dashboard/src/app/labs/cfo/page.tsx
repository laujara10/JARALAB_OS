import React from 'react'
import { LabPlaceholder } from '@/components/ui/core/LabPlaceholder'
import { BarChart3 } from 'lucide-react'

export default function CFOLabPage() {
  return (
    <LabPlaceholder
      name="CFO Lab"
      icon={<BarChart3 size={40} />}
      description="Claridad financiera para dueños de restaurante que no tienen CFO. Análisis de rentabilidad, proyección de flujo de caja y control presupuestal — sin la complejidad de las hojas de cálculo."
      capabilities={[
        'P&L por semana, mes y trimestre',
        'Proyección de flujo de caja',
        'Presupuesto vs. real',
        'Análisis de gasto por proveedor',
        'Modelado de punto de equilibrio y margen',
        'Resúmenes financieros listos para impuestos',
      ]}
    />
  )
}

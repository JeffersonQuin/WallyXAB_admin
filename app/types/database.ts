export interface Reserva {
  id: number
  cliente_nombre: string
  fecha_reserva: string // date
  hora_inicio: string // time
  hora_fin: string // time
  monto_total: number
  monto_pagado: number
  tipo_pago: 'efectivo' | 'tarjeta' | 'transferencia' | 'otro'
  estado_pago: 'pagado' | 'pendiente' | 'parcial'
  observaciones?: string
  administrador_id: number
  created_at?: string
}

export interface Usuario {
  id: number
  nombre: string
  usuario: string
  password: string
  creado_en: string
}
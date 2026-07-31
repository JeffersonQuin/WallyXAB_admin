<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h1 class="text-2xl font-bold text-gray-800">⚙️ Ajustes del Sistema</h1>
      <p class="text-gray-500 mt-1">Gestiona y administra las reservas del sistema</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Panel de Exportar -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-800">Exportar a Excel</h2>
              <p class="text-sm text-gray-600">Exporta las reservas en un rango de fechas</p>
            </div>
          </div>
        </div>

        <div class="p-6">
          <form @submit.prevent="exportarExcel" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio *</label>
                <input
                  v-model="exportar.fechaInicio"
                  type="date"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Fin *</label>
                <input
                  v-model="exportar.fechaFin"
                  type="date"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div class="flex items-center gap-4">
              <label class="flex items-center text-sm text-gray-700">
                <input 
                  v-model="exportar.incluirCanceladas" 
                  type="checkbox" 
                  class="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span class="ml-2">Incluir reservas canceladas</span>
              </label>
            </div>

            <div class="flex items-center gap-3 pt-2">
              <button
                type="submit"
                :disabled="exportar.cargando"
                class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg v-if="!exportar.cargando" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <svg v-else class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ exportar.cargando ? 'Generando...' : 'Exportar a Excel' }}
              </button>
              <span v-if="exportar.totalReservas > 0" class="text-sm text-gray-500">
                {{ exportar.totalReservas }} reservas encontradas
              </span>
            </div>

            <div v-if="exportar.mensaje" 
                 :class="exportar.mensaje.tipo === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'"
                 class="border px-4 py-3 rounded-lg text-sm">
              {{ exportar.mensaje.texto }}
            </div>
          </form>
        </div>
      </div>

      <!-- Panel de Eliminar por Rango -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-rose-50">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-red-100 rounded-lg">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-800">Eliminar por Rango</h2>
              <p class="text-sm text-gray-600">Elimina reservas en un rango de fechas</p>
            </div>
          </div>
        </div>

        <div class="p-6">
          <form @submit.prevent="confirmarEliminacion" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio *</label>
                <input
                  v-model="eliminar.fechaInicio"
                  type="date"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Fin *</label>
                <input
                  v-model="eliminar.fechaFin"
                  type="date"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div class="flex items-center gap-4">
              <label class="flex items-center text-sm text-gray-700">
                <input 
                  v-model="eliminar.incluirCanceladas" 
                  type="checkbox" 
                  class="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span class="ml-2">Incluir reservas canceladas</span>
              </label>
            </div>

            <div class="flex items-center gap-3 pt-2">
              <button
                type="button"
                @click="verificarEliminacion"
                :disabled="eliminar.cargando"
                class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Verificar Reservas
              </button>
              <span v-if="eliminar.totalReservas > 0" class="text-sm text-red-600 font-medium">
                {{ eliminar.totalReservas }} reservas serán eliminadas
              </span>
              <span v-else-if="eliminar.totalReservas === 0 && eliminar.verificado" class="text-sm text-green-600">
                No hay reservas en este rango
              </span>
            </div>

            <button
              v-if="eliminar.totalReservas > 0"
              type="submit"
              class="w-full px-6 py-3 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Eliminar {{ eliminar.totalReservas }} Reservas
            </button>

            <div v-if="eliminar.mensaje" 
                 :class="eliminar.mensaje.tipo === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'"
                 class="border px-4 py-3 rounded-lg text-sm">
              {{ eliminar.mensaje.texto }}
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Resumen de Estadísticas -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">📊 Resumen General</h3>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="text-center p-4 bg-blue-50 rounded-lg">
          <p class="text-2xl font-bold text-blue-600">{{ estadisticas.total }}</p>
          <p class="text-sm text-gray-600">Total Reservas</p>
        </div>
        <div class="text-center p-4 bg-green-50 rounded-lg">
          <p class="text-2xl font-bold text-green-600">{{ estadisticas.pagadas }}</p>
          <p class="text-sm text-gray-600">Pagadas</p>
        </div>
        <div class="text-center p-4 bg-yellow-50 rounded-lg">
          <p class="text-2xl font-bold text-yellow-600">{{ estadisticas.pendientes }}</p>
          <p class="text-sm text-gray-600">Pendientes</p>
        </div>
        <div class="text-center p-4 bg-red-50 rounded-lg">
          <p class="text-2xl font-bold text-red-600">{{ estadisticas.canceladas }}</p>
          <p class="text-sm text-gray-600">Canceladas</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const supabase = useSupabaseClient()

// Estado para exportar
const exportar = reactive({
  fechaInicio: new Date(new Date().setDate(1)).toISOString().split('T')[0],
  fechaFin: new Date().toISOString().split('T')[0],
  incluirCanceladas: false,
  cargando: false,
  totalReservas: 0,
  mensaje: null
})

// Estado para eliminar
const eliminar = reactive({
  fechaInicio: new Date(new Date().setDate(1)).toISOString().split('T')[0],
  fechaFin: new Date().toISOString().split('T')[0],
  incluirCanceladas: false,
  cargando: false,
  totalReservas: 0,
  verificado: false,
  mensaje: null
})

// Estadísticas
const estadisticas = ref({
  total: 0,
  pagadas: 0,
  pendientes: 0,
  canceladas: 0
})

// Cargar estadísticas
const cargarEstadisticas = async () => {
  try {
    const { count: total } = await supabase
      .from('reservas')
      .select('*', { count: 'exact', head: true })

    const { count: pagadas } = await supabase
      .from('reservas')
      .select('*', { count: 'exact', head: true })
      .eq('estado_pago', 'pagado')

    const { count: pendientes } = await supabase
      .from('reservas')
      .select('*', { count: 'exact', head: true })
      .eq('estado_pago', 'pendiente')

    const { count: canceladas } = await supabase
      .from('reservas')
      .select('*', { count: 'exact', head: true })
      .eq('estado_pago', 'cancelado')

    estadisticas.value = {
      total: total || 0,
      pagadas: pagadas || 0,
      pendientes: pendientes || 0,
      canceladas: canceladas || 0
    }
  } catch (error) {
    console.error('Error cargando estadísticas:', error)
  }
}

// Exportar a Excel
const exportarExcel = async () => {
  exportar.cargando = true
  exportar.mensaje = null

  try {
    // Validar fechas
    if (exportar.fechaInicio > exportar.fechaFin) {
      exportar.mensaje = {
        tipo: 'error',
        texto: 'La fecha de inicio no puede ser mayor a la fecha de fin'
      }
      exportar.cargando = false
      return
    }

    // Construir consulta
    let query = supabase
      .from('reservas')
      .select('*')
      .gte('fecha_reserva', exportar.fechaInicio)
      .lte('fecha_reserva', exportar.fechaFin)
      .order('fecha_reserva', { ascending: true })
      .order('hora_inicio', { ascending: true })

    if (!exportar.incluirCanceladas) {
      query = query.neq('estado_pago', 'cancelado')
    }

    const { data, error } = await query

    if (error) throw error

    if (!data || data.length === 0) {
      exportar.mensaje = {
        tipo: 'error',
        texto: 'No hay reservas en el rango de fechas seleccionado'
      }
      exportar.cargando = false
      return
    }

    exportar.totalReservas = data.length

    // Generar CSV
    const csv = generarCSV(data)
    
    // Descargar archivo
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.href = url
    link.setAttribute('download', `reservas_${exportar.fechaInicio}_${exportar.fechaFin}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    exportar.mensaje = {
      tipo: 'success',
      texto: `✅ ${data.length} reservas exportadas exitosamente`
    }

  } catch (error) {
    console.error('Error exportando:', error)
    exportar.mensaje = {
      tipo: 'error',
      texto: `Error al exportar: ${error.message}`
    }
  } finally {
    exportar.cargando = false
  }
}

// Generar CSV
const generarCSV = (data) => {
  const headers = [
    'ID',
    'Cliente',
    'Fecha',
    'Hora Inicio',
    'Hora Fin',
    'Monto Total',
    'Monto Pagado',
    'Tipo Pago',
    'Estado Pago',
    'Observaciones'
  ]

  const rows = data.map(r => [
    r.id,
    r.cliente_nombre,
    r.fecha_reserva,
    r.hora_inicio?.substring(0, 5),
    r.hora_fin?.substring(0, 5),
    Number(r.monto_total).toFixed(2),
    Number(r.monto_pagado).toFixed(2),
    r.tipo_pago,
    r.estado_pago,
    r.observaciones || ''
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')

  return csvContent
}

// Verificar eliminación
const verificarEliminacion = async () => {
  eliminar.cargando = true
  eliminar.mensaje = null
  eliminar.verificado = false

  try {
    if (eliminar.fechaInicio > eliminar.fechaFin) {
      eliminar.mensaje = {
        tipo: 'error',
        texto: 'La fecha de inicio no puede ser mayor a la fecha de fin'
      }
      eliminar.cargando = false
      return
    }

    let query = supabase
      .from('reservas')
      .select('*', { count: 'exact', head: true })
      .gte('fecha_reserva', eliminar.fechaInicio)
      .lte('fecha_reserva', eliminar.fechaFin)

    if (!eliminar.incluirCanceladas) {
      query = query.neq('estado_pago', 'cancelado')
    }

    const { count, error } = await query

    if (error) throw error

    eliminar.totalReservas = count || 0
    eliminar.verificado = true

    if (eliminar.totalReservas === 0) {
      eliminar.mensaje = {
        tipo: 'success',
        texto: 'No hay reservas para eliminar en este rango'
      }
    }

  } catch (error) {
    console.error('Error verificando:', error)
    eliminar.mensaje = {
      tipo: 'error',
      texto: `Error al verificar: ${error.message}`
    }
  } finally {
    eliminar.cargando = false
  }
}

// Confirmar y eliminar
const confirmarEliminacion = async () => {
  if (eliminar.totalReservas === 0) {
    eliminar.mensaje = {
      tipo: 'error',
      texto: 'No hay reservas para eliminar'
    }
    return
  }

  // Confirmación doble
  const confirmacion = confirm(
    `⚠️ ¿Estás seguro de eliminar ${eliminar.totalReservas} reservas?\n\n` +
    `Rango: ${eliminar.fechaInicio} al ${eliminar.fechaFin}\n` +
    `Esta acción no se puede deshacer.`
  )

  if (!confirmacion) return

  // Segunda confirmación
  const confirmacionFinal = confirm(
    `🔴 CONFIRMACIÓN FINAL\n\n` +
    `Vas a eliminar ${eliminar.totalReservas} reservas permanentemente.\n` +
    `¿Estás absolutamente seguro?`
  )

  if (!confirmacionFinal) return

  eliminar.cargando = true
  eliminar.mensaje = null

  try {
    let query = supabase
      .from('reservas')
      .delete()
      .gte('fecha_reserva', eliminar.fechaInicio)
      .lte('fecha_reserva', eliminar.fechaFin)

    if (!eliminar.incluirCanceladas) {
      query = query.neq('estado_pago', 'cancelado')
    }

    const { error } = await query

    if (error) throw error

    eliminar.mensaje = {
      tipo: 'success',
      texto: `✅ ${eliminar.totalReservas} reservas eliminadas exitosamente`
    }

    // Resetear contador
    eliminar.totalReservas = 0
    eliminar.verificado = false

    // Recargar estadísticas
    await cargarEstadisticas()

  } catch (error) {
    console.error('Error eliminando:', error)
    eliminar.mensaje = {
      tipo: 'error',
      texto: `Error al eliminar: ${error.message}`
    }
  } finally {
    eliminar.cargando = false
  }
}

// Inicializar
onMounted(() => {
  cargarEstadisticas()
})
</script>
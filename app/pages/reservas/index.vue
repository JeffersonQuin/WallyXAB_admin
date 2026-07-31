<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Gestión de Reservas</h1>
        <p class="text-gray-500 mt-1">Administra todas las reservas del sistema</p>
      </div>
      <button 
        @click="abrirModal()" 
        class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nueva Reserva
      </button>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <input 
            v-model="busqueda" 
            type="text" 
            placeholder="Buscar cliente..." 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <select 
            v-model="filtroEstadoPago" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Todos los pagos</option>
            <option value="pagado">Pagado</option>
            <option value="pendiente">Pendiente</option>
            <option value="parcial">Parcial</option>
          </select>
        </div>
        <div>
          <select 
            v-model="filtroTipoPago" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Todos los tipos</option>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div>
          <input 
            v-model="filtroFecha" 
            type="date" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>

    <!-- Tabla -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pago</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="reserva in reservasFiltradas" :key="reserva.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div>
                  <p class="font-medium text-gray-800">{{ reserva.cliente_nombre }}</p>
                </div>
              </td>
              <td class="px-6 py-4 text-gray-600">{{ formatFecha(reserva.fecha_reserva) }}</td>
              <td class="px-6 py-4 text-gray-600">
                {{ formatHora(reserva.hora_inicio) }} - {{ formatHora(reserva.hora_fin) }}
              </td>
              <td class="px-6 py-4">
                <p class="font-medium text-gray-800">${{ formatMonto(reserva.monto_total) }}</p>
                <p class="text-xs text-gray-500">Pagado: ${{ formatMonto(reserva.monto_pagado) }}</p>
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 rounded-full text-xs font-medium" :class="getTipoPagoClass(reserva.tipo_pago)">
                  {{ getTipoPagoText(reserva.tipo_pago) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span :class="getEstadoPagoClass(reserva.estado_pago)" 
                      class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ getEstadoPagoText(reserva.estado_pago) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button 
                    @click="abrirModal(reserva)" 
                    class="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button 
                    @click="eliminarReserva(reserva.id)" 
                    class="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="reservasFiltradas.length === 0">
              <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                <div class="flex flex-col items-center gap-2">
                  <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>No hay reservas disponibles</p>
                  <button @click="abrirModal()" class="text-indigo-600 hover:text-indigo-700 font-medium">
                    Crear primera reserva
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Reserva -->
    <ReservaModal 
      v-if="mostrarModal"
      :reserva="reservaEditando"
      @close="cerrarModal"
      @save="onSave"
    />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()

// Estado
const reservas = ref([])
const busqueda = ref('')
const filtroEstadoPago = ref('')
const filtroTipoPago = ref('')
const filtroFecha = ref('')
const mostrarModal = ref(false)
const reservaEditando = ref(null)

// Cargar reservas
const cargarReservas = async () => {
  try {
    let query = supabase
      .from('reservas')
      .select('*')
      .order('fecha_reserva', { ascending: false })

    const { data, error } = await query
    
    if (error) throw error
    reservas.value = data || []
  } catch (error) {
    console.error('Error cargando reservas:', error)
  }
}

// Filtros
const reservasFiltradas = computed(() => {
  let result = reservas.value
  
  if (busqueda.value) {
    const q = busqueda.value.toLowerCase()
    result = result.filter(r => 
      r.cliente_nombre.toLowerCase().includes(q)
    )
  }
  
  if (filtroEstadoPago.value) {
    result = result.filter(r => r.estado_pago === filtroEstadoPago.value)
  }
  
  if (filtroTipoPago.value) {
    result = result.filter(r => r.tipo_pago === filtroTipoPago.value)
  }
  
  if (filtroFecha.value) {
    result = result.filter(r => r.fecha_reserva === filtroFecha.value)
  }
  
  return result
})

// Utilidades de formato
const formatFecha = (fecha) => {
  if (!fecha) return '-'
  
  try {
    // Crear objeto Date desde el string ISO
    const date = new Date(fecha + 'T00:00:00')
    
    // Verificar si es una fecha válida
    if (isNaN(date.getTime())) {
      // Si no es válida, intentar parsear directamente
      const partes = fecha.split('-')
      if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`
      }
      return fecha
    }
    
    // Formatear en DD/MM/YYYY
    const dia = String(date.getDate()).padStart(2, '0')
    const mes = String(date.getMonth() + 1).padStart(2, '0')
    const anio = date.getFullYear()
    
    return `${dia}/${mes}/${anio}`
  } catch (error) {
    console.error('Error formateando fecha:', fecha, error)
    return fecha || '-'
  }
}

const formatHora = (hora) => {
  if (!hora) return '-'
  return hora.substring(0, 5)
}

const formatMonto = (monto) => {
  return Number(monto).toFixed(2)
}

const getTipoPagoClass = (tipo) => {
  const classes = {
    'efectivo': 'bg-green-100 text-green-800',
    'tarjeta': 'bg-blue-100 text-blue-800',
    'transferencia': 'bg-purple-100 text-purple-800',
    'otro': 'bg-gray-100 text-gray-800'
  }
  return classes[tipo] || 'bg-gray-100 text-gray-800'
}

const getTipoPagoText = (tipo) => {
  const texts = {
    'efectivo': 'Efectivo',
    'tarjeta': 'Tarjeta',
    'transferencia': 'Transferencia',
    'otro': 'Otro'
  }
  return texts[tipo] || tipo
}

const getEstadoPagoClass = (estado) => {
  const classes = {
    'pagado': 'bg-green-100 text-green-800',
    'pendiente': 'bg-yellow-100 text-yellow-800',
    'parcial': 'bg-orange-100 text-orange-800'
  }
  return classes[estado] || 'bg-gray-100 text-gray-800'
}

const getEstadoPagoText = (estado) => {
  const texts = {
    'pagado': 'Pagado',
    'pendiente': 'Pendiente',
    'parcial': 'Parcial'
  }
  return texts[estado] || estado
}

// Acciones
const abrirModal = (reserva = null) => {
  reservaEditando.value = reserva
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  reservaEditando.value = null
}

const onSave = async () => {
  await cargarReservas()
  cerrarModal()
}

const eliminarReserva = async (id) => {
  if (!confirm('¿Estás seguro de eliminar esta reserva?')) return
  
  try {
    const { error } = await supabase
      .from('reservas')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    await cargarReservas()
  } catch (error) {
    console.error('Error eliminando reserva:', error)
    alert('Error al eliminar la reserva')
  }
}

// Inicializar
cargarReservas()
</script>
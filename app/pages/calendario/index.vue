<template>
  <div class="space-y-6">
    <!-- Header del Calendario -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">📅 Calendario de Reservas</h1>
          <p class="text-gray-500 text-sm">Visualiza y gestiona las reservas del día</p>
        </div>
        
        <!-- Navegación del día -->
        <div class="flex items-center gap-4">
          <button 
            @click="cambiarDia(-1)" 
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Día anterior"
          >
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div class="text-center min-w-[200px]">
            <p class="text-lg font-semibold text-gray-800">{{ formatFechaTitulo(diaActual) }}</p>
            <p class="text-sm text-gray-500">{{ esHoy ? 'Hoy' : getDiaSemana(diaActual) }}</p>
          </div>
          
          <button 
            @click="cambiarDia(1)" 
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Día siguiente"
          >
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <button 
            @click="volverHoy" 
            class="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Hoy
          </button>
        </div>
      </div>
    </div>

    <!-- Grid de Horas -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <!-- Header de horas -->
      <div class="grid grid-cols-[120px_1fr] border-b border-gray-200">
        <div class="p-3 bg-gray-50 border-r border-gray-200 text-center">
          <span class="text-sm font-medium text-gray-600">Rango de Horas</span>
        </div>
        <div class="p-3 bg-gray-50 text-center">
          <span class="text-sm font-medium text-gray-600">Reservas del Día</span>
        </div>
      </div>

      <!-- Lista de rangos de horas -->
      <div class="divide-y divide-gray-100 max-h-[calc(100vh-400px)] overflow-y-auto">
        <div 
          v-for="(rango, index) in rangosHoras" 
          :key="index"
          class="grid grid-cols-[120px_1fr] hover:bg-gray-50 transition-colors min-h-[70px]"
          :class="{ 'bg-blue-50/30': estaEnRangoOcupado(rango.inicio) }"
        >
          <!-- Rango de hora (ej: 6:00 - 7:00) -->
          <div class="p-3 border-r border-gray-200 flex items-center justify-center">
            <span class="text-sm font-medium" :class="estaEnRangoOcupado(rango.inicio) ? 'text-blue-600' : 'text-gray-600'">
              {{ formatRangoHora(rango.inicio, rango.fin) }}
            </span>
          </div>
          
          <!-- Contenido del rango de hora -->
          <div class="p-2 flex items-center">
            <!-- Verificar si este rango está ocupado -->
            <div v-if="getReservaEnRango(rango.inicio, rango.fin)" class="w-full">
              <div 
                class="flex items-center justify-between p-2 rounded-lg"
                :class="getColorReserva(getReservaEnRango(rango.inicio, rango.fin).estado_pago)"
              >
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 rounded-full" :class="getIndicadorEstado(getReservaEnRango(rango.inicio, rango.fin).estado_pago)"></div>
                  <div>
                    <p class="font-medium text-gray-800">{{ getReservaEnRango(rango.inicio, rango.fin).cliente_nombre }}</p>
                    <p class="text-xs text-gray-500">
                      {{ formatHoraMostrar(getReservaEnRango(rango.inicio, rango.fin).hora_inicio) }} - {{ formatHoraMostrar(getReservaEnRango(rango.inicio, rango.fin).hora_fin) }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-medium" :class="getEstadoPagoClass(getReservaEnRango(rango.inicio, rango.fin).estado_pago)">
                    {{ getEstadoPagoText(getReservaEnRango(rango.inicio, rango.fin).estado_pago) }}
                  </span>
                  <span class="text-xs text-gray-600">${{ formatMonto(getReservaEnRango(rango.inicio, rango.fin).monto_total) }}</span>
                </div>
              </div>
            </div>
            
            <!-- Botón de reserva si está disponible -->
            <div v-else class="w-full flex justify-between items-center">
              <span class="text-sm text-gray-400">Disponible</span>
              <button 
                @click="abrirModalReserva(rango.inicio)"
                class="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-sm hover:shadow"
              >
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Reservar
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Leyenda -->
      <div class="p-4 bg-gray-50 border-t border-gray-200">
        <div class="flex flex-wrap items-center gap-6">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-green-500"></div>
            <span class="text-sm text-gray-600">Disponible</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span class="text-sm text-gray-600">Pendiente</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-blue-500"></div>
            <span class="text-sm text-gray-600">Pagado</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-orange-500"></div>
            <span class="text-sm text-gray-600">Parcial</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-blue-300"></div>
            <span class="text-sm text-gray-600">Rango ocupado</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Reserva Rápida -->
    <ReservaModal 
      v-if="mostrarModal"
      :reserva="null"
      :hora-inicio="horaSeleccionada"
      :fecha-seleccionada="fechaSeleccionada"
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

// Estado
const diaActual = ref(new Date())
const reservas = ref([])
const mostrarModal = ref(false)
const horaSeleccionada = ref('')
const fechaSeleccionada = ref('')
const cargando = ref(false)

// Computed
const esHoy = computed(() => {
  const hoy = new Date()
  return diaActual.value.getDate() === hoy.getDate() &&
         diaActual.value.getMonth() === hoy.getMonth() &&
         diaActual.value.getFullYear() === hoy.getFullYear()
})

// Generar rangos de horas de 6:00-7:00 a 22:00-23:00
const rangosHoras = computed(() => {
  const rangos = []
  for (let i = 6; i < 23; i++) {
    const inicio = `${i.toString().padStart(2, '0')}:00`
    const fin = `${(i + 1).toString().padStart(2, '0')}:00`
    rangos.push({ inicio, fin })
  }
  return rangos
})

const fechaStr = computed(() => {
  const d = diaActual.value
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})

// Formatear rango de hora (ej: 6:00 - 7:00)
const formatRangoHora = (inicio, fin) => {
  const inicioFormateado = formatHoraMostrar(inicio)
  const finFormateado = formatHoraMostrar(fin)
  return `${inicioFormateado} - ${finFormateado}`
}

// Método para obtener la reserva que ocupa un rango específico
const getReservaEnRango = (horaInicio, horaFin) => {
  // Buscar si este rango está dentro de alguna reserva
  for (const reserva of reservas.value) {
    const reservaInicio = reserva.hora_inicio?.substring(0, 5)
    const reservaFin = reserva.hora_fin?.substring(0, 5)
    
    if (reservaInicio && reservaFin) {
      // Verificar si el rango está dentro de la reserva
      // El rango está ocupado si la hora de inicio del rango está dentro de la reserva
      // o si la hora de fin del rango está dentro de la reserva
      const estaDentro = (horaInicio >= reservaInicio && horaInicio < reservaFin) ||
                         (horaFin > reservaInicio && horaFin <= reservaFin) ||
                         (horaInicio <= reservaInicio && horaFin >= reservaFin)
      
      if (estaDentro) {
        return reserva
      }
    }
  }
  return null
}

// Verificar si un rango está ocupado
const estaEnRangoOcupado = (horaInicio) => {
  const horaFin = `${(parseInt(horaInicio.split(':')[0]) + 1).toString().padStart(2, '0')}:00`
  return getReservaEnRango(horaInicio, horaFin) !== null
}

// Método para verificar si hay reservas (para compatibilidad)
const tieneReservasEnHora = (hora) => {
  return getReservaEnRango(hora, `${(parseInt(hora.split(':')[0]) + 1).toString().padStart(2, '0')}:00`) !== null
}

const cargarReservas = async () => {
  cargando.value = true
  try {
    console.log('Cargando reservas para fecha:', fechaStr.value)
    
    const { data, error } = await supabase
      .from('reservas')
      .select('*')
      .eq('fecha_reserva', fechaStr.value)
      .order('hora_inicio', { ascending: true })
    
    if (error) {
      console.error('Error en la consulta:', error)
      throw error
    }
    
    console.log('Reservas cargadas:', data)
    reservas.value = data || []
  } catch (error) {
    console.error('Error cargando reservas:', error)
    reservas.value = []
  } finally {
    cargando.value = false
  }
}

const cambiarDia = (dias) => {
  const nuevaFecha = new Date(diaActual.value)
  nuevaFecha.setDate(nuevaFecha.getDate() + dias)
  diaActual.value = nuevaFecha
  cargarReservas()
}

const volverHoy = () => {
  diaActual.value = new Date()
  cargarReservas()
}

const formatFechaTitulo = (fecha) => {
  return fecha.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const getDiaSemana = (fecha) => {
  return fecha.toLocaleDateString('es-ES', {
    weekday: 'long'
  })
}

const formatHoraMostrar = (hora) => {
  if (!hora) return ''
  const [h, m] = hora.split(':')
  const horaNum = parseInt(h)
  const ampm = horaNum >= 12 ? 'PM' : 'AM'
  const hora12 = horaNum > 12 ? horaNum - 12 : horaNum
  return `${hora12}:${m} ${ampm}`
}

const formatMonto = (monto) => {
  return Number(monto).toFixed(2)
}

const getColorReserva = (estado) => {
  const colores = {
    'pagado': 'bg-green-50 border border-green-200',
    'pendiente': 'bg-yellow-50 border border-yellow-200',
    'parcial': 'bg-orange-50 border border-orange-200',
    'cancelado': 'bg-red-50 border border-red-200'
  }
  return colores[estado] || 'bg-gray-50 border border-gray-200'
}

const getIndicadorEstado = (estado) => {
  const colores = {
    'pagado': 'bg-green-500',
    'pendiente': 'bg-yellow-500',
    'parcial': 'bg-orange-500',
    'cancelado': 'bg-red-500'
  }
  return colores[estado] || 'bg-gray-500'
}

const getEstadoPagoClass = (estado) => {
  const classes = {
    'pagado': 'text-green-700',
    'pendiente': 'text-yellow-700',
    'parcial': 'text-orange-700',
    'cancelado': 'text-red-700'
  }
  return classes[estado] || 'text-gray-700'
}

const getEstadoPagoText = (estado) => {
  const texts = {
    'pagado': 'Pagado',
    'pendiente': 'Pendiente',
    'parcial': 'Parcial',
    'cancelado': 'Cancelado'
  }
  return texts[estado] || estado
}

const abrirModalReserva = (hora) => {
  // Verificar si la hora está ocupada
  if (estaEnRangoOcupado(hora)) {
    alert('⚠️ Este horario ya está ocupado')
    return
  }
  
  console.log('Abriendo modal para hora:', hora)
  horaSeleccionada.value = hora
  fechaSeleccionada.value = fechaStr.value
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  horaSeleccionada.value = ''
  fechaSeleccionada.value = ''
}

const onSave = async () => {
  await cargarReservas()
  cerrarModal()
}

// Inicializar
onMounted(() => {
  console.log('Calendario montado - fecha inicial:', fechaStr.value)
  cargarReservas()
})

// Recargar cuando cambie el día
watch(fechaStr, (nuevaFecha, viejaFecha) => {
  console.log('Fecha cambiada:', viejaFecha, '->', nuevaFecha)
  cargarReservas()
})
</script>

<style scoped>
/* Animación de hover para las horas */
.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

/* Transición suave para las reservas */
.reserva-card {
  transition: all 0.2s ease;
}

.reserva-card:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Scroll suave para el grid de horas */
.horas-grid {
  max-height: calc(100vh - 300px);
  overflow-y: auto;
}

.horas-grid::-webkit-scrollbar {
  width: 6px;
}

.horas-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.horas-grid::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.horas-grid::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Fondo suave para horas ocupadas */
.bg-blue-50\/30 {
  background-color: rgba(219, 234, 254, 0.3);
}
</style>
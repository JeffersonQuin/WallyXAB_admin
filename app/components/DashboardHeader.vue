<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
    <div class="flex items-center justify-between px-4 py-3 lg:px-6">
      <!-- Left side -->
      <div class="flex items-center gap-4">
        <button 
          @click="toggleSidebar" 
          class="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 class="text-xl font-semibold text-gray-800">{{ pageTitle }}</h2>
      </div>

      <!-- Right side -->
      <div class="flex items-center gap-3">
        <!-- Notificaciones -->
        <div class="relative">
          <button 
            @click="toggleNotificaciones"
            class="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            :class="{ 'bg-gray-100': mostrarNotificaciones }"
          >
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span v-if="tieneNotificaciones" class="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
            <span v-else class="absolute top-1 right-1 w-2.5 h-2.5 bg-gray-300 rounded-full"></span>
          </button>

          <!-- Dropdown de notificaciones -->
          <div 
            v-if="mostrarNotificaciones"
            class="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
          >
            <div class="p-4 border-b border-gray-200 bg-gray-50">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-gray-800">🔔 Notificaciones</h3>
                <span class="text-xs text-gray-500">{{ notificaciones.length }} notificaciones</span>
              </div>
            </div>

            <div class="max-h-96 overflow-y-auto">
              <!-- Notificaciones -->
              <div v-if="notificaciones.length > 0">
                <div 
                  v-for="(notificacion, index) in notificaciones" 
                  :key="index"
                  class="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  :class="{ 'bg-blue-50': !notificacion.leida }"
                >
                  <div class="flex items-start gap-3">
                    <div class="flex-shrink-0 mt-1">
                      <div :class="notificacion.tipo === 'warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'"
                           class="w-8 h-8 rounded-full flex items-center justify-center">
                        <svg v-if="notificacion.tipo === 'warning'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm text-gray-800" v-html="notificacion.mensaje"></p>
                      <p class="text-xs text-gray-500 mt-1">{{ notificacion.fecha }}</p>
                    </div>
                    <button 
                      @click="marcarComoLeida(index)"
                      class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Marcar como leída"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Sin notificaciones -->
              <div v-else class="p-8 text-center">
                <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p class="text-gray-500">No hay notificaciones</p>
                <p class="text-sm text-gray-400 mt-1">Todo está en orden</p>
              </div>
            </div>

            <div class="p-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
              <button 
                @click="marcarTodasComoLeidas"
                class="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                v-if="notificaciones.length > 0"
              >
                Marcar todas como leídas
              </button>
              <button 
                @click="cerrarNotificaciones"
                class="text-xs text-gray-500 hover:text-gray-700 ml-auto"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>

        <!-- Perfil -->
        <div class="flex items-center gap-3">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-medium text-gray-700">{{ user?.email }}</p>
            <p class="text-xs text-gray-500">Administrador</p>
          </div>
          <div class="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {{ user?.email?.charAt(0).toUpperCase() || 'U' }}
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const route = useRoute()

// Estado
const mostrarNotificaciones = ref(false)
const notificaciones = ref([])
const reservaMasAntigua = ref(null)
const cargando = ref(false)

// Título dinámico según la ruta
const pageTitle = computed(() => {
  const titles = {
    '/dashboard': 'Dashboard',
    '/reservas': 'Gestión de Reservas',
    '/calendario': 'Calendario',
    '/ajustes': 'Ajustes'
  }
  return titles[route.path] || 'Panel de Control'
})

// Verificar si hay notificaciones no leídas
const tieneNotificaciones = computed(() => {
  return notificaciones.value.some(n => !n.leida)
})

// Cargar la reserva más antigua
const cargarReservaMasAntigua = async () => {
  try {
    cargando.value = true
    
    // Buscar la reserva más antigua (por fecha y hora)
    const { data, error } = await supabase
      .from('reservas')
      .select('*')
      .order('fecha_reserva', { ascending: true })
      .order('hora_inicio', { ascending: true })
      .limit(1)
    
    if (error) throw error
    
    if (data && data.length > 0) {
      reservaMasAntigua.value = data[0]
      verificarNotificacion()
    }
  } catch (error) {
    console.error('Error cargando reserva más antigua:', error)
  } finally {
    cargando.value = false
  }
}

// Verificar y generar notificación
const verificarNotificacion = () => {
  if (!reservaMasAntigua.value) return
  
  const fechaReserva = new Date(reservaMasAntigua.value.fecha_reserva)
  const hoy = new Date()
  
  // Calcular diferencia en días
  const diferenciaTiempo = hoy.getTime() - fechaReserva.getTime()
  const diferenciaDias = Math.floor(diferenciaTiempo / (1000 * 3600 * 24))
  
  console.log(`Días desde la reserva más antigua: ${diferenciaDias}`)
  
  // Si han pasado 30 días o más
  if (diferenciaDias >= 30) {
    const notificacionExistente = notificaciones.value.find(n => 
      n.tipo === 'warning' && n.id === 'liberar_espacio'
    )
    
    if (!notificacionExistente) {
      // Crear notificación de liberación de espacio
      const nuevaNotificacion = {
        id: 'liberar_espacio',
        tipo: 'warning',
        mensaje: `
          <span class="font-semibold">⚠️ ¡Es hora de liberar espacio!</span><br>
          La reserva más antigua es de <span class="font-medium">${formatFecha(fechaReserva)}</span> 
          (hace <span class="font-medium text-red-600">${diferenciaDias} días</span>).<br>
          <span class="text-xs text-gray-600">Considera archivar o eliminar reservas antiguas.</span>
        `,
        fecha: hoy.toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        leida: false
      }
      
      notificaciones.value.unshift(nuevaNotificacion)
    } else {
      // Actualizar notificación existente con nuevos días
      notificacionExistente.mensaje = `
        <span class="font-semibold">⚠️ ¡Es hora de liberar espacio!</span><br>
        La reserva más antigua es de <span class="font-medium">${formatFecha(fechaReserva)}</span> 
        (hace <span class="font-medium text-red-600">${diferenciaDias} días</span>).<br>
        <span class="text-xs text-gray-600">Considera archivar o eliminar reservas antiguas.</span>
      `
      notificacionExistente.fecha = hoy.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  } else {
    // Si hay menos de 30 días, no mostrar notificación de advertencia
    // Solo mostrar notificación informativa si no hay ninguna
    const notificacionInfo = notificaciones.value.find(n => 
      n.tipo === 'info' && n.id === 'espacio_disponible'
    )
    
    if (!notificacionInfo) {
      const diasFaltantes = 30 - diferenciaDias
      const nuevaNotificacion = {
        id: 'espacio_disponible',
        tipo: 'info',
        mensaje: `
          <span class="font-semibold">ℹ️ Espacio disponible</span><br>
          La reserva más antigua es de <span class="font-medium">${formatFecha(fechaReserva)}</span>.<br>
          <span class="text-xs text-gray-600">Faltan ${diasFaltantes} días para considerar liberar espacio.</span>
        `,
        fecha: hoy.toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        leida: false
      }
      notificaciones.value.unshift(nuevaNotificacion)
    }
  }
}

// Formatear fecha
const formatFecha = (fecha) => {
  if (!fecha) return ''
  return fecha.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Toggle notificaciones
const toggleNotificaciones = () => {
  mostrarNotificaciones.value = !mostrarNotificaciones.value
}

// Cerrar notificaciones
const cerrarNotificaciones = () => {
  mostrarNotificaciones.value = false
}

// Marcar como leída
const marcarComoLeida = (index) => {
  notificaciones.value[index].leida = true
}

// Marcar todas como leídas
const marcarTodasComoLeidas = () => {
  notificaciones.value.forEach(n => n.leida = true)
}

// Cerrar al hacer clic fuera
const handleClickOutside = (event) => {
  const dropdown = document.querySelector('.relative')
  if (dropdown && !dropdown.contains(event.target)) {
    cerrarNotificaciones()
  }
}

// Inicializar
onMounted(() => {
  cargarReservaMasAntigua()
  
  // Agregar evento para cerrar al hacer clic fuera
  document.addEventListener('click', handleClickOutside)
})

// Limpiar evento
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Animación de pulso para el indicador */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Scroll personalizado para notificaciones */
.max-h-96::-webkit-scrollbar {
  width: 4px;
}

.max-h-96::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.max-h-96::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.max-h-96::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
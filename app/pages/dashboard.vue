<template>
  <div class="space-y-6">
    <!-- Bienvenida -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h1 class="text-2xl font-bold text-gray-800">
        ¡Bienvenido, {{ userName }}! 👋
      </h1>
      <p class="text-gray-500 mt-1">Aquí tienes el resumen de tu sistema de reservas</p>
    </div>

    <!-- Estadísticas -->
    <StatsCards />

    <!-- Últimas reservas -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-800">📋 Últimas Reservas</h3>
        <NuxtLink to="/reservas" class="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
          Ver todas →
        </NuxtLink>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="reserva in ultimasReservas" :key="reserva.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 font-medium text-gray-800">{{ reserva.cliente_nombre }}</td>
              <td class="px-6 py-4 text-gray-600">{{ formatDate(reserva.fecha_reserva) }}</td>
              <td class="px-6 py-4 text-gray-600">${{ formatMonto(reserva.monto_total) }}</td>
              <td class="px-6 py-4">
                <span :class="getEstadoPagoClass(reserva.estado_pago)" 
                      class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ getEstadoPagoText(reserva.estado_pago) }}
                </span>
              </td>
            </tr>
            <tr v-if="ultimasReservas.length === 0">
              <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                No hay reservas recientes
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const ultimasReservas = ref([])

const userName = computed(() => {
  // Intentar obtener nombre de la tabla usuarios
  return user.value?.email?.split('@')[0] || 'Usuario'
})

const formatDate = (fecha) => {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatMonto = (monto) => {
  return Number(monto).toFixed(2)
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

const cargarUltimasReservas = async () => {
  try {
    const { data } = await supabase
      .from('reservas')
      .select('*')
      .order('fecha_reserva', { ascending: false })
      .limit(5)
    
    ultimasReservas.value = data || []
  } catch (error) {
    console.error('Error cargando últimas reservas:', error)
  }
}

cargarUltimasReservas()
</script>
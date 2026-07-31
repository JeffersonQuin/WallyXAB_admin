<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Total Reservas</p>
          <p class="text-2xl font-bold text-gray-800">{{ stats.total }}</p>
        </div>
        <div class="p-3 bg-blue-100 rounded-xl">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Ingresos Totales</p>
          <p class="text-2xl font-bold text-green-600">{{ stats.ingresosTotales }} Bs</p>
        </div>
        <div class="p-3 bg-green-100 rounded-xl">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v1m0 1v1" />
          </svg>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Pendientes de Pago</p>
          <p class="text-2xl font-bold text-yellow-600">{{ stats.pendientes }}</p>
        </div>
        <div class="p-3 bg-yellow-100 rounded-xl">
          <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Pagadas</p>
          <p class="text-2xl font-bold text-green-600">{{ stats.pagadas }}</p>
        </div>
        <div class="p-3 bg-green-100 rounded-xl">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const stats = ref({
  total: 0,
  ingresosTotales: 0,
  pendientes: 0,
  pagadas: 0
})

const supabase = useSupabaseClient()

const cargarStats = async () => {
  try {
    // Total
    const { count: total } = await supabase
      .from('reservas')
      .select('*', { count: 'exact', head: true })
    
    // Ingresos totales
    const { data: ingresosData } = await supabase
      .from('reservas')
      .select('monto_pagado')
      .eq('estado_pago', 'pagado')
    
    const ingresosTotales = ingresosData?.reduce((sum, r) => sum + Number(r.monto_pagado), 0) || 0
    
    // Pendientes
    const { count: pendientes } = await supabase
      .from('reservas')
      .select('*', { count: 'exact', head: true })
      .eq('estado_pago', 'pendiente')
    
    // Pagadas
    const { count: pagadas } = await supabase
      .from('reservas')
      .select('*', { count: 'exact', head: true })
      .eq('estado_pago', 'pagado')
    
    stats.value = {
      total: total || 0,
      ingresosTotales: ingresosTotales.toFixed(2),
      pendientes: pendientes || 0,
      pagadas: pagadas || 0
    }
  } catch (error) {
    console.error('Error cargando estadísticas:', error)
  }
}

cargarStats()
</script>
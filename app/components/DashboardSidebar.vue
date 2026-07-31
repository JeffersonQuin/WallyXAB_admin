<template>
  <aside class="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-indigo-900 to-purple-900 transform transition-transform duration-300 ease-in-out -translate-x-full lg:translate-x-0">
    <!-- Logo -->
    <div class="flex items-center gap-3 px-6 py-4 border-b border-white/10">
      <div class="bg-white/10 rounded-xl p-2">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <div>
        <h1 class="text-lg font-bold text-white">WALLY X-AB</h1>
        <p class="text-xs text-indigo-200">Sistema de Reservas</p>
      </div>
    </div>

    <!-- Menú de navegación -->
    <nav class="mt-6 px-4 space-y-2">
      <NuxtLink 
        to="/dashboard" 
        class="flex items-center gap-3 px-4 py-3 text-indigo-100 hover:bg-white/10 rounded-xl transition-all duration-200 group"
        :class="{ 'bg-white/10': $route.path === '/dashboard' }"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <span class="font-medium">Dashboard</span>
      </NuxtLink>

      <NuxtLink 
        to="/reservas" 
        class="flex items-center gap-3 px-4 py-3 text-indigo-100 hover:bg-white/10 rounded-xl transition-all duration-200 group"
        :class="{ 'bg-white/10': $route.path.startsWith('/reservas') }"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="font-medium">Reservas</span>
        <span class="ml-auto bg-white/20 px-2 py-0.5 rounded-full text-xs">{{ reservasCount }}</span>
      </NuxtLink>

      <NuxtLink 
        to="/calendario" 
        class="flex items-center gap-3 px-4 py-3 text-indigo-100 hover:bg-white/10 rounded-xl transition-all duration-200 group"
        :class="{ 'bg-white/10': $route.path === '/calendario' }"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="font-medium">Calendario</span>
      </NuxtLink>
      <NuxtLink 
        to="/ajustes" 
        class="flex items-center gap-3 px-4 py-3 text-indigo-100 hover:bg-white/10 rounded-xl transition-all duration-200 group"
        :class="{ 'bg-white/10': $route.path.startsWith('/ajustes') }"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span class="font-medium">Ajustes</span>
      </NuxtLink>
    </nav>

    <!-- Footer del Sidebar -->
    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
      <button 
        @click="logout" 
        class="flex items-center gap-3 px-4 py-3 text-indigo-100 hover:bg-white/10 rounded-xl w-full transition-all duration-200"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span class="font-medium">Cerrar Sesión</span>
      </button>
    </div>

    <!-- Botón mobile para cerrar sidebar -->
    <button 
      @click="$emit('close')" 
      class="absolute top-4 right-4 text-white lg:hidden"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </aside>
</template>

<script setup>
const supabase = useSupabaseClient()
const reservasCount = ref(0)

const logout = async () => {
  await supabase.auth.signOut()
  await navigateTo('/login')
}

// Obtener conteo de reservas
const { data } = await supabase
  .from('reservas')
  .select('*', { count: 'exact', head: true })
reservasCount.value = data?.length || 0
</script>
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <DashboardSidebar />

    <!-- Overlay oscuro (solo mobile, cuando el sidebar está abierto) -->
    <Transition name="fade">
      <div
        v-if="sidebarAbierto"
        class="fixed inset-0 z-40 bg-black/50 lg:hidden"
        @click="cerrarSidebar"
      />
    </Transition>
    
    <!-- Contenido principal -->
    <div class="lg:pl-64 flex flex-col min-h-screen">
      <!-- Header -->
      <DashboardHeader />
      
      <!-- Contenido -->
      <main class="flex-1 p-4 lg:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const { sidebarAbierto, cerrarSidebar } = useSidebar()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
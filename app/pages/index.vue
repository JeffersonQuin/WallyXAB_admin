<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
    <div class="text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
      <p class="text-white text-lg font-medium">Cargando...</p>
      <p class="text-indigo-200 text-sm mt-2">Redirigiendo al sistema</p>
    </div>
  </div>
</template>

<script setup>
// Esta página solo redirige automáticamente
// No necesita lógica adicional porque el middleware manejará la redirección
</script>
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <DashboardSidebar />
    
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
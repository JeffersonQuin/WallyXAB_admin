// Estado global del sidebar compartido entre Header y Sidebar
const sidebarAbierto = ref(false)

export const useSidebar = () => {
  const abrirSidebar = () => {
    sidebarAbierto.value = true
  }

  const cerrarSidebar = () => {
    sidebarAbierto.value = false
  }

  const toggleSidebar = () => {
    sidebarAbierto.value = !sidebarAbierto.value
  }

  return {
    sidebarAbierto: readonly(sidebarAbierto),
    abrirSidebar,
    cerrarSidebar,
    toggleSidebar,
  }
}

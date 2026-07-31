export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()
  
  // Si está en la raíz y no hay usuario, redirigir al login
  if (to.path === '/' && !user.value) {
    return navigateTo('/login')
  }
  
  // Si está en la raíz y hay usuario, redirigir al dashboard
  if (to.path === '/' && user.value) {
    return navigateTo('/dashboard')
  }
})
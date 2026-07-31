export default defineNuxtRouteMiddleware(async (to) => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  
  // Esperar a que el usuario esté disponible
  if (!user.value) {
    const { data } = await supabase.auth.getUser()
    if (!data.user) {
      return navigateTo('/login')
    }
  }
})
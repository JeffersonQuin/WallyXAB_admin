// nuxt.config.ts
export default defineNuxtConfig({
   compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/supabase',
            '@nuxtjs/tailwindcss' 
           ],
  css: ['~/assets/css/tailwind.css'], 
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      include: undefined,
      exclude: [],
      cookieRedirect: false,
    },
  },
  nitro: {
    routeRules: {
      '/': { redirect: '/login' } // Esto redirige automáticamente
    }
  }

})
// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/supabase',
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

  // Corrige la compilación de tslib y Supabase para el navegador/servidor local
  build: {
    transpile: ['tslib', '@supabase/supabase-js', '@nuxtjs/supabase']
  },

  nitro: {
    // Evita forzar el 'inline' de estas librerías viejas en producción
    esmExternals: 'loose',
    externals: {
      // Dejar vacío previene el error de desestructuración de __extends en Vercel
      inline: [] 
    },
    routeRules: {
      '/': { redirect: '/login' }
    }
  }
})

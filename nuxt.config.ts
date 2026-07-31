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

  // Mantenemos esto porque ayudó a resolver el error de compilación local
  build: {
    transpile: [
      'tslib', 
      '@supabase/supabase-js', 
      '@nuxtjs/supabase',
      '@supabase/postgrest-js',
      '@supabase/gotrue-js',
      '@supabase/functions-js',
      '@supabase/storage-js'
    ]
  },

  // Simplificamos Nitro eliminando la restricción de 'external' para Vercel
  nitro: {
    esmExternals: 'loose', // Permite mayor flexibilidad con librerías CommonJS antiguas
    routeRules: {
      '/': { redirect: '/login' }
    }
  }
})
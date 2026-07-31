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

  // Ajustes de compilación global
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

  // Configuración del servidor Nitro para Vercel
  nitro: {
    esmExternals: true, // Fuerza soporte estricto ESM para módulos externos
    externals: {
      inline: [], // Mantenlo vacío para no empaquetar código problemático dentro de las funciones lambda
      external: [
        'tslib',
        '@supabase/supabase-js',
        '@nuxtjs/supabase'
      ]
    },
    routeRules: {
      '/': { redirect: '/login' }
    }
  }
})

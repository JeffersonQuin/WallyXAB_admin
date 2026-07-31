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

  // Ajuste para corregir el conflicto de CommonJS / ESM con Supabase y tslib
  vite: {
    optimizeDeps: {
      include: ['tslib', '@supabase/supabase-js']
    }
  },

  nitro: {
    externals: {
      inline: ['tslib', '@supabase/supabase-js', '@nuxtjs/supabase']
    },
    routeRules: {
      '/': { redirect: '/login' }
    }
  }
})
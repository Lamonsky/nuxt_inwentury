import tailwindcss from '@tailwindcss/vite';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      externalLink: "https://inwentury.pl/projekty/informacje/",
    },
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/app/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss()
    ],
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },
  nitro: {
    prerender: {
      autoSubfolderIndex: false
    }
  },
  app: {
    head: {
      title: 'Lamonski.pl'
    }
  }
})

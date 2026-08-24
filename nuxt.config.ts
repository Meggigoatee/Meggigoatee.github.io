const baseURL = process.env.NUXT_APP_BASE_URL || '/'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['~/assets/css/global.css'],
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/content'],
  content: {
    experimental: {
      sqliteConnector: 'native'
    }
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/about',
        '/projects'
      ]
    }
  },
  app: {
    baseURL,
    head: {
      htmlAttrs: {
        lang: 'ko'
      },
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: `${baseURL}favicon.svg` },
        { rel: 'shortcut icon', href: `${baseURL}favicon.ico` }
      ],
      meta: [
        { name: 'description', content: '개발자 포트폴리오' },
        { name: 'theme-color', content: '#111827' }
      ]
    }
  }
})

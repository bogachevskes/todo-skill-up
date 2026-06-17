// https://nuxt.com/docs/api/configuration/nuxt-config

import { createResolver } from 'nuxt/kit';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  css: ['~/assets/css/base.css', '~/assets/css/tailwind.css'],
  ssr: false,
  plugins: ['@/plugins/ant-design'],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/css/mixins.scss" as *;'
        }
      }
    }
  },

  srcDir: 'src/',
  alias: {
    '@/': 'src/',
  },
  serverDir: './server',

  hooks: {
    'pages:routerOptions'({ files }) {
      const resolver = createResolver(import.meta.url);
      files.push({
        path: resolver.resolve('./router.options'),
        optional: true
      });
    }
  },

  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL,
      webSocketUrl: process.env.NUXT_PUBLIC_WEB_SOCKET_URL,
    },
  },

  app: {
    head: {
      title: 'TODO LIST',
      htmlAttrs: {
        lang: 'ru',
      },
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          name: 'description',
          content: '' 
        },
        {
          name: 'format-detection',
          content: 'telephone=no' 
        },
      ],
    },
  },

});

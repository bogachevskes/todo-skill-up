export default {
    env: {
        WS_APP_URL: process.env.WS_APP_URL,
    },
    server: {
        host: '0',
        port: process.env.APP_PORT,
    },
    // Global page headers: https://go.nuxtjs.dev/config-head
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
            { hid: 'description', name: 'description', content: '' },
            { name: 'format-detection', content: 'telephone=no' },
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: ['~/plugins/eventBus', '~/plugins/userStorage', '~/plugins/socketClient'],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
        // https://go.nuxtjs.dev/typescript
        '@nuxt/typescript-build',
    ],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        // https://go.nuxtjs.dev/buefy
        'nuxt-buefy',
        // https://go.nuxtjs.dev/axios
        '@nuxtjs/axios',
        'nuxt-client-init-module',
    ],

    // Axios module configuration: https://go.nuxtjs.dev/config-axios
    axios: {
        // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
        baseURL: process.env.API_APP_URL,
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {},

    watchers: {
        webpack: {
            aggregateTimeout: 300,
            poll: 1000,
        },
    },
};

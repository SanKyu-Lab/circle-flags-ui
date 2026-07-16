export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  devServer: {
    host: '0.0.0.0',
    port: 31006,
  },
  ssr: true,
  typescript: {
    typeCheck: true,
  },
})

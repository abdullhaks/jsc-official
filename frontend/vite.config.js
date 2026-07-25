import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Jeelani Studies Centre',
        short_name: 'JSC',
        description: 'A centre for Islamic studies, Sufism, and education',
        theme_color: '#f0fdf4',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'https://ik.imagekit.io/aksWebSolutions/JSC/JSC_APP_ICON.png?updatedAt=1754539840889',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://ik.imagekit.io/aksWebSolutions/JSC/JSC_APP_ICON2.png?updatedAt=1754539864015',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },


    workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}'],
    runtimeCaching: [
      {
        urlPattern: ({ request }) => request.destination === 'image',
        handler: 'CacheFirst',
        options: {
          cacheName: 'images',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
        },
      },
    ],
  },



    })
  ]
})
/// <reference types="vitest/config" />
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    exclude: ['e2e/**', 'node_modules/**'],
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      strategies: 'generateSW',
      includeAssets: [
        'favicon.svg',
        'icon.svg',
        'offline.html',
        'apple-touch-icon-180.png',
      ],
      devOptions: {
        enabled: false,
      },
      manifest: {
        name: 'Volleycraft',
        short_name: 'Volleycraft',
        description: 'Volleyball training companion: plan, run, review.',
        theme_color: '#E8732A',
        background_color: '#FFFFFF',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        // V0B-06: three PNG entries. Chromium's installability check
        // warns against `any maskable` on a single source because the
        // two purposes have different layout contracts (maskable is
        // full-bleed; `any` keeps the rounded corner on iOS). The
        // apple-touch-icon PNG is NOT in the manifest — iOS reads it
        // from the `<link>` in index.html instead.
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        // Phase F9 (2026-04-19): `woff2` glob continues to precache the
        // Vite-bundled Fontsource Inter variable file; the two
        // `runtimeCaching` rules that used to target
        // `fonts.googleapis.com` and `fonts.gstatic.com` were removed
        // because the app no longer contacts those hosts. Self-hosted
        // Inter means first paint renders the brand font offline.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
    }),
  ],
})

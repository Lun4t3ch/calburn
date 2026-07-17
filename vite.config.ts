import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages serves the app under /calburn/. When a custom domain is
// attached later, set CALBURN_BASE=/ in the build environment.
const base = process.env.CALBURN_BASE ?? '/calburn/'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'apple-touch-icon.png', 'logo.png'],
      manifest: {
        name: 'CalBurn',
        short_name: 'CalBurn',
        description:
          'Understand how many calories you burn — BMR, NEAT, TEF and exercise — and plan your weight goals with honest, science-based estimates.',
        theme_color: '#0d9488',
        background_color: '#fafaf7',
        display: 'standalone',
        start_url: base,
        scope: base,
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  test: {
    environment: 'node',
    include: ['tests/**/*.test.{ts,tsx}'],
    passWithNoTests: true,
  },
})

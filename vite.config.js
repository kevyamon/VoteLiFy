import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Configuration Vite PWA avec proxy dynamique basé sur l'environnement
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['logo.png', 'manifest.json'],
        manifest: {
          name: 'VoteLiFy — Plateforme Électorale Sécurisée',
          short_name: 'VoteLiFy',
          description: 'Plateforme numérique officielle de vote sécurisé et de proclamation certifiée.',
          theme_color: '#f20411',
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            {
              src: '/logo.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/logo.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),
    ],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'https://votelify-backend.onrender.com',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});

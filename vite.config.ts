import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'beautiful-skill-tree': 'beautiful-skill-tree/dist/beautiful-skill-tree.esm.js'
    }
  },
  server: {
    port: 3000,
    // Listen on all network interfaces so the dev server is reachable
    // from other machines (e.g. when running on a VPS)
    host: true,
    // Proxy API requests to the backend container when running under
    // docker-compose so the frontend can reach the API on port 4000
    proxy: {
      '/api': 'http://skilltree:4000'
    }
  }
});

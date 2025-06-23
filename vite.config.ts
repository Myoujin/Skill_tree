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
    host: true
  }
});

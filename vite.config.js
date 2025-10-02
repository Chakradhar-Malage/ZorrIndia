import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/create-order': 'http://localhost:3000',
      '/save-order': 'http://localhost:3000',
      '/orders': 'http://localhost:3000',
    },
  },
});
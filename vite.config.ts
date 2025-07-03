import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ✅ Only one default export
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
  },
  server: {
    host: true,
    port: 5173, // ✅ Include port here
  },
});

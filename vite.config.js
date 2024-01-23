// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  server: {
    host: '0.0.0.0', // Use '0.0.0.0' to listen on all available network interfaces
  },
  plugins: [react()],
})

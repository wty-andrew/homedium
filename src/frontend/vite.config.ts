/// <reference types="vitest" />

import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
		https:
			process.env.NODE_ENV === 'development'
				? {
						cert: fs.readFileSync('../../certs/cert.pem'),
						key: fs.readFileSync('../../certs/key.pem'),
					}
				: {},
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        xfwd: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
  },
})

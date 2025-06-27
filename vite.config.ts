import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { randomBytes } from 'crypto'

// Polyfill for crypto.getRandomValues in Node.js environment
if (!globalThis.crypto) {
  globalThis.crypto = {
    getRandomValues: (buffer) => {
      const bytes = randomBytes(buffer.length)
      buffer.set(new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength))
      return buffer
    }
  }
}

export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@dashboard': path.resolve(__dirname, './src/components/Devtone-Dashboard/client/src'),
      '@shared': path.resolve(__dirname, './src/components/Devtone-Dashboard/shared'),
      '@assets': path.resolve(__dirname, './src/components/Devtone-Dashboard/attached_assets'),
    }
  },
  server: {
    port: 5173,
    host: 'localhost',
    cors: true,
    open: true, // Auto-open browser
    proxy: {
      // Proxy requests to the dashboard server
      '/devtone-dashboard': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/devtone-dashboard/, '')
      },
      // Proxy API requests to the production API
      '/api': {
        target: 'https://devtone.agency',
        changeOrigin: true,
        secure: true
      }
    }
  },
  build: {
    // Optimize build output
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
          query: ['@tanstack/react-query'],
          supabase: ['@supabase/supabase-js'],
          forms: ['react-hook-form']
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020'
    },
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      '@tanstack/react-query',
      '@supabase/supabase-js',
      'clsx', 
      'tailwind-merge',
      'react-hook-form'
    ]
  },
  // Enable CSS code splitting
  css: {
    devSourcemap: true
  }
})
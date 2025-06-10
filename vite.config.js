import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    dedupe: ['three'],
    alias: {
      'three': 'three'
    }
  },
  optimizeDeps: {
    include: ['three']
  },
  build: {
    commonjsOptions: {
      include: [/three/, /node_modules/],
    },
  },
}); 
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: ['chrome90', 'edge90', 'esnext', 'firefox90', 'safari15.1'],
    rollupOptions: {
      plugins: [visualizer()],
      output: {
        manualChunks: {
          '@monaco-editor/react': ['@monaco-editor/react'],
          '@chakra-ui/react': ['@chakra-ui/react'],
        },
      },
    },
  },
});

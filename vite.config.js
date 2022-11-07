import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    checker({
      overlay: false,
      typescript: true,
      eslint: { files: ['./src'], extensions: ['.ts'] },
    }),
  ],
  // For github pages
  // -> https://vitejs.dev/guide/static-deploy.html#github-pages
  base: '/download-selected/',
  build: { outDir: 'docs' },
})

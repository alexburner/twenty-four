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
})

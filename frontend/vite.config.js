import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  // server: {
  //   host: '0.0.0.0', // Adiciona essa linha
  //   port: 5173, // A porta que você quer usar
  // },
  //  server: {
  //   historyApiFallback: true,
  // },
  define: {
    'process.env': {},
  },
  plugins: [react()],
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        nodePolyfills(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        outDir: 'build',
    },
    server: {
        port: 3000,
    },
    define: {
        // Make environment variables available at build time
        'process.env': process.env
    }
})

import { fileURLToPath, URL } from 'node:url';
import glsl from 'vite-plugin-glsl';


export default {
  root: "./",
  publicDir: "static/",
  base: "./",
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: true,
  },
  server: {
    port: 9000,
    host: "0.0.0.0",
    hmr: {
      protocol: "ws",
      host: "localhost",
    },
  },
  plugins: [
    glsl()
  ]
};

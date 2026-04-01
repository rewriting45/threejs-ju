import path from "path";

export default {
  root: "./",
  publicDir: "static/",
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
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
};

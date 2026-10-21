import { fileURLToPath, URL } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import environment from "vite-plugin-environment";
import {
  isClickTraceRecorderImport,
  shouldStubClickTraceRecorder,
} from "./src/engine/clickTraceBundle.ts";

const ii_url =
  process.env.DFX_NETWORK === "local"
    ? `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:8081/`
    : `https://identity.internetcomputer.org/`;

process.env.II_URL = process.env.II_URL || ii_url;
process.env.STORAGE_GATEWAY_URL =
  process.env.STORAGE_GATEWAY_URL || "https://blob.caffeine.ai";

const clickTraceProdStub = fileURLToPath(
  new URL("./src/debug/clickTrace.prod.ts", import.meta.url),
);

function clickTraceProdStubPlugin() {
  return {
    name: "pbv-prod-click-trace-stub",
    apply: "build",
    enforce: "pre",
    resolveId(source) {
      if (!isClickTraceRecorderImport(source)) return null;
      return clickTraceProdStub;
    },
  };
}

export default defineConfig(({ command, mode }) => ({
  logLevel: "error",
  build: {
    emptyOutDir: true,
    sourcemap: false,
    minify: false,
  },
  css: {
    postcss: "./postcss.config.js",
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
    environment(["II_URL"]),
    environment(["STORAGE_GATEWAY_URL"]),
    react(),
    ...(shouldStubClickTraceRecorder({ command, mode })
      ? [clickTraceProdStubPlugin()]
      : []),
  ],
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(new URL("../declarations", import.meta.url)),
      },
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
    dedupe: ["@dfinity/agent"],
  },
}));

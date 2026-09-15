import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/heitzfit4-planning-card.ts",
      formats: ["es"],
      fileName: () => "heitzfit4-planning-card.js"
    },
    rollupOptions: {
      output: { inlineDynamicImports: true }
    },
    sourcemap: true,
    minify: "esbuild"
  }
});

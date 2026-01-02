/// <reference types="vitest" />
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    preact(),
    dts({
      insertTypesEntry: true, // Ensure the types entry is added to package.json
      outDir: "dist/types", // Output directory for declaration files
    }),
  ],
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "criteo-video-player",
      fileName: (format) => `criteo-video-player.${format}.js`,
      cssFileName: "style",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    include: ["src/**/*.(spec|test).[tj]s?(x)"],
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});

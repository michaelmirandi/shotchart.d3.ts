import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: true,
  external: [/^d3-/],
  onSuccess: "mkdir -p dist/styles && cp src/styles/shotchart.css dist/styles/shotchart.css",
});

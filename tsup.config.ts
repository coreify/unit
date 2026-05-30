import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts"
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: false,
  splitting: false,
  target: "es2020",
  treeshake: true,
  minify: "terser",
  clean: true
});

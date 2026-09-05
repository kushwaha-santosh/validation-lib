import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: { index: "src/core/index.ts" },
    format: ["cjs", "esm"],
    dts: true,
    outDir: "dist/core",
    clean: true,
    target: "es2019",
  },
  {
    entry: { index: "src/react/index.ts" },
    format: ["cjs", "esm"],
    dts: true,
    outDir: "dist/react",
    external: ["react"],
    target: "es2019",
  },
  {
    entry: { index: "src/native/index.ts" },
    format: ["cjs", "esm"],
    dts: true,
    outDir: "dist/native",
    external: ["react", "react-native"],
    target: "es2019",
  },
  {
    entry: { index: "src/angular/index.ts" },
    format: ["cjs", "esm"],
    dts: true,
    outDir: "dist/angular",
    external: ["@angular/core", "@angular/forms"],
    target: "es2019",
  },
]);

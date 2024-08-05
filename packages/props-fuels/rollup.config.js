import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.cjs.js",
      format: "cjs",
      exports: "named",
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
    },
  ],
  plugins: [
    json(),
    typescript({
      tsconfig: "tsconfig.json",
    }),
    resolve({
      preferBuiltins: true,
    }),
    commonjs(),
  ],
  onwarn: (warning, warn) => {
    // Suppress specific warnings
    if (
      warning.code === "THIS_IS_UNDEFINED" ||
      warning.code === "CIRCULAR_DEPENDENCY"
    ) {
      return;
    }
    // Use default for everything else
    warn(warning);
  },
};

import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import css from "rollup-plugin-import-css";

const packageJson = require("./package.json");
const { nodeResolve } = require("@rollup/plugin-node-resolve");

export default [
  {
    onwarn: function (warning, warn) {
      if (warning.code === "CIRCULAR_DEPENDENCY") return;
      warn(warning);
    },
    input: "index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      nodeResolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      terser(),
      css(),
    ],
    external: ["react", "react-dom", "styled-components"],
  },
];

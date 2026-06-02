import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  srcDir: "src",
  modulesDir: "wxt-modules",
  outDir: "dist",
  publicDir: "static",
  entrypointsDir: "entries",

  imports: false,

  vite: () => ({
    plugins: [tailwindcss()],
  }),
});

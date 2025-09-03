import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
// Some environments import CJS default slightly differently. Normalize below.
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
  resolve: {
    // Keep symlinked packages under node_modules path
    preserveSymlinks: true,
  },
  optimizeDeps: {
    // Ensure binaryen (voyd's dependency) is pre-bundled by Vite
    include: ["binaryen"],
    esbuildOptions: {
      supported: {
        "top-level-await": true,
      },
    },
  },
  esbuild: {
    supported: {
      "top-level-await": true, //browsers can handle top-level-await features
    },
  },
});

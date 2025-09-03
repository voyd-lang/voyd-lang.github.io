import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
// Some environments import CJS default slightly differently. Normalize below.
import * as monacoNs from "vite-plugin-monaco-editor";
import tsconfigPaths from "vite-tsconfig-paths";

const monacoPlugin =
  // ESM import of CJS -> nested default
  (monacoNs as any)?.default?.default ??
  // Typical ESM interop default
  (monacoNs as any)?.default ??
  // Fallback to module namespace (some bundlers export callable ns)
  (monacoNs as any);

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    monacoPlugin({
      // include core workers; custom 'voyd' is added at runtime
      languageWorkers: ["editorWorkerService", "json", "typescript"],
      publicPath: "/monaco",
      globalAPI: true,
    }),
  ],
  esbuild: {
    supported: {
      "top-level-await": true, //browsers can handle top-level-await features
    },
  },
});

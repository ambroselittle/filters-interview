import { defineConfig } from "vitest/config";
import { resolve } from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      shared: resolve(__dirname, "../shared/index.ts"),
    },
  },
  test: {
    environment: "node",
  },
});

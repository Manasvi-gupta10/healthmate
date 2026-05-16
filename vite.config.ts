import path from "path";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    vite: {
      installDevServerMiddleware: true,
    },
  },
  vite: {
    resolve: {
      alias: {
        "node:async_hooks": path.resolve(__dirname, "src/shims/node_async_hooks.ts"),
      },
    },
  },
});

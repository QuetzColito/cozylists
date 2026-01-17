import { defineConfig, PluginOption } from "vite";
import solidPlugin from "vite-plugin-solid";
import devtools from "solid-devtools/vite";

const fullReloadAlways: PluginOption = {
  name: "full-reload-always",
  handleHotUpdate({ server }) {
    server.ws.send({ type: "full-reload" });
    return [];
  },
};

export default defineConfig({
  plugins: [devtools(), solidPlugin(), fullReloadAlways],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
});

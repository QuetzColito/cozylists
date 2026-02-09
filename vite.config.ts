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
    proxy: {
      '/api/': {
        target: 'http://localhost:3333/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      }
    },
  },
  root: '.',
  build: {
    target: "esnext",
    rollupOptions: {
      input: {
        lists: '/lists/index.html',
        account: '/account/index.html',
        gw2: '/gw2/index.html',
      }
    }
  },
});

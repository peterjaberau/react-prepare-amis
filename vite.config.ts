import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { sessionContextPlugin } from "session-context/vite";
import path from "path";
import svgr from "vite-plugin-svgr";
// import { codeInspectorPlugin } from 'code-inspector-plugin';
import inject from "@rollup/plugin-inject";

import monacoEditorPlugin, {
  type IMonacoEditorOpts,
} from "vite-plugin-monaco-editor";
const monacoEditorPluginDefault = (monacoEditorPlugin as any).default as (
  options: IMonacoEditorOpts,
) => any;

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  process.env = { ...process.env, ...env };


  return {
    // define: {
    //   jQuery: 'window.jQuery',
    //   $: 'window.$',
    //   __webpack_public_path__: '""', // Define as an empty string
    //
    // },
    plugins: [
      reactRouter({
        babel: {
          parserOpts: {
            plugins: ["decorators-legacy", "classProperties"],
          },
        },
      }),

      tsconfigPaths(),
      sessionContextPlugin(),
      // codeInspectorPlugin({
      //   bundler: 'vite',
      //   editor: 'idea',
      //   port: 3061,
      //   behavior: {
      //     locate: true,
      //     copy: true,
      //   },
      //   showSwitch: true,
      // }),
      // react({
      //   babel: {
      //     parserOpts: {
      //       plugins: ["decorators-legacy", "classProperties"],
      //     },
      //   },
      // }),
      // inject({
      //   $: ["jquery", "*"],
      //   jQuery: "jquery",
      // }),
      svgr({
        exportAsDefault: true,
        svgrOptions: {
          svgProps: {
            className: "icon",
          },
          prettier: false,
          dimensions: false,
        },
      }),
      monacoEditorPluginDefault({}),

      // progress({
      //   format: "[:bar] :percent - Grafana Build",
      //   total: 100,
      //   color: "#eb7b18",
      // } as any),
    ],

    ssr: {
      resolve: {
        conditions: ["workerd", "worker", "browser"],
        externalConditions: ["workerd", "worker"],
      },
    },

    resolve: {
      mainFields: ["webpack", "browser", "module", "main"],
      alias: [
        { find: "~", replacement: path.resolve(__dirname, "./app") },

        { find: "@", replacement: path.resolve(__dirname, "src") },
        {
          find: "@scenes",
          replacement: path.resolve(__dirname, "src/packages/grafana/scenes"),
        },
        { find: "@utils", replacement: path.resolve(__dirname, "src/utils") },
        {
          find: "@schema",
          replacement: path.resolve(__dirname, "src/packages/grafana/schema"),
        },
        {
          find: "@data",
          replacement: path.resolve(__dirname, "src/packages/grafana/data"),
        },
        {
          find: "@runtime",
          replacement: path.resolve(__dirname, "src/packages/grafana/runtime"),
        },
        {
          find: "@grafana-module",
          replacement: path.resolve(__dirname, "src/apps/modules/grafana"),
        },
        {
          find: "@grafana-sql",
          replacement: path.resolve(__dirname, "src/packages/grafana/sql"),
        },
        {
          find: "@saga-icons",
          replacement: path.resolve(__dirname, "src/packages/grafana/saga-icons"),
        },
        {
          find: "@flamegraph",
          replacement: path.resolve(__dirname, "src/packages/grafana/flamegraph"),
        },
        {
          find: "@prometheus",
          replacement: path.resolve(__dirname, "src/packages/grafana/prometheus"),
        },
        {
          find: "@o11y-ds-frontend",
          replacement: path.resolve(
            __dirname,
            "src/packages/grafana/o11y-ds-frontend",
          ),
        },
        {
          find: "@scenes-react",
          replacement: path.resolve(
            __dirname,
            "src/packages/grafana/scenes-react",
          ),
        },
        {
          find: "@selectors",
          replacement: path.resolve(__dirname, "src/packages/grafana/selectors"),
        },
        {
          find: "@grafana-ui",
          replacement: path.resolve(__dirname, "src/packages/grafana/grafana-ui"),
        },
        {
          find: "@plugin-configs",
          replacement: path.resolve(
            __dirname,
            "src/packages/grafana/plugin-configs",
          ),
        },
        {
          find: "@locker/near-membrane-dom/custom-devtools-formatter",
          replacement: path.resolve(
            __dirname,
            "node_modules/@locker/near-membrane-dom/dist",
          ),
        },
        {
          find: "react-loading-skeleton",
          replacement: path.resolve(
            __dirname,
            "node_modules/react-loading-skeleton/dist",
          ),
        },
        {
          find: "@grafana/ui",
          replacement: path.resolve(__dirname, "src/packages/grafana/grafana-ui"),
        },
        {
          find: "@grafana/data",
          replacement: path.resolve(__dirname, "src/packages/grafana/data"),
        },
        {
          find: "@grafana/schema",
          replacement: path.resolve(__dirname, "src/packages/grafana/schema"),
        },
        {
          find: "@grafana/runtime",
          replacement: path.resolve(__dirname, "src/packages/grafana/runtime"),
        },
        {
          find: "prismjs",
          replacement: path.resolve(__dirname, "node_modules/prismjs"),
        },
        {
          find: "@plugin-ui",
          replacement: path.resolve(__dirname, "src/packages/grafana/plugin-ui"),
        },
      ],
    },
    optimizeDeps: {
      // include: ["react-loading-skeleton"],
      // exclude: ["jquery"],
    },
    worker: {
      format: "es",
    },

    build: {
      minify: true,
      rollupOptions: {
        external: [],
      },
    },

    server: {
      // host: "0.0.0.0",
      open: true,
      port: 3061,
      // proxy: {
      //   "/api": {
      //     target: "http://localhost:3061",
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/api/, ""),
      //   },
      // },
      // open: false,
      // cors: true,
      // hmr: true,
      // proxy: {}
    },
  }
});

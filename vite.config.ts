import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import prism from 'vite-plugin-prismjs';

import { sessionContextPlugin } from "session-context/vite";
import path from "path";
import svgr from "vite-plugin-svgr";

import monacoEditorPlugin, {
  type IMonacoEditorOpts,
} from "vite-plugin-monaco-editor";

const monacoEditorPluginDefault = (monacoEditorPlugin as any).default as (
  options: IMonacoEditorOpts,
) => any;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  process.env = { ...process.env, ...env };

  return {
    plugins: [
      reactRouter(),
      tsconfigPaths(),
      sessionContextPlugin(),
      prism({
        languages: ['javascript', 'css', 'html', 'typescript'],
        plugins: ['line-numbers'],
        theme: 'tomorrow',
        css: true,
      }),
      // react({
      //   babel: {
      //     parserOpts: {
      //       plugins: ["decorators-legacy", "classProperties"],
      //     },
      //   },
      // }),

      svgr({
        svgrOptions: {
          svgProps: {
            className: "icon",
          },
          prettier: false,
          dimensions: false,
        },
      }),
      monacoEditorPluginDefault({}),
    ],

    ssr: {
      noExternal: [
        "@ant-design/icons",
        "@ant-design/pro-chat",
        "@ant-design/pro-editor",
        "react-intersection-observer",
      ],
      resolve: {
        conditions: ["workerd", "worker", "browser"],
        externalConditions: ["workerd", "worker"],
      },
    },

    resolve: {
      mainFields: ["webpack", "browser", "module", "main"],
      alias: [
        { find: "~", replacement: path.resolve(__dirname, "./app") },

        {
          find: "@scenes",
          replacement: path.resolve(__dirname, "app/packages/grafana/scenes"),
        },
        { find: "@utils", replacement: path.resolve(__dirname, "app/utils") },
        {
          find: "@schema",
          replacement: path.resolve(__dirname, "app/packages/grafana/schema"),
        },
        {
          find: "@data",
          replacement: path.resolve(__dirname, "app/packages/grafana/data"),
        },
        {
          find: "@runtime",
          replacement: path.resolve(__dirname, "app/packages/grafana/runtime"),
        },
        {
          find: "@grafana-sql",
          replacement: path.resolve(__dirname, "app/packages/grafana/sql"),
        },
        {
          find: "@saga-icons",
          replacement: path.resolve(
            __dirname,
            "app/packages/grafana/saga-icons",
          ),
        },
        {
          find: "@flamegraph",
          replacement: path.resolve(
            __dirname,
            "app/packages/grafana/flamegraph",
          ),
        },
        {
          find: "@prometheus",
          replacement: path.resolve(
            __dirname,
            "app/packages/grafana/prometheus",
          ),
        },
        {
          find: "@o11y-ds-frontend",
          replacement: path.resolve(
            __dirname,
            "app/packages/grafana/o11y-ds-frontend",
          ),
        },
        {
          find: "@scenes-react",
          replacement: path.resolve(
            __dirname,
            "app/packages/grafana/scenes-react",
          ),
        },
        {
          find: "@selectors",
          replacement: path.resolve(
            __dirname,
            "app/packages/grafana/selectors",
          ),
        },
        {
          find: "@grafana-ui",
          replacement: path.resolve(
            __dirname,
            "app/packages/grafana/grafana-ui",
          ),
        },
        {
          find: "@plugin-configs",
          replacement: path.resolve(
            __dirname,
            "app/packages/grafana/plugin-configs",
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
          replacement: path.resolve(
            __dirname,
            "app/packages/grafana/grafana-ui",
          ),
        },
        {
          find: "@grafana/data",
          replacement: path.resolve(__dirname, "app/packages/grafana/data"),
        },
        {
          find: "@grafana/schema",
          replacement: path.resolve(__dirname, "app/packages/grafana/schema"),
        },
        {
          find: "@grafana/runtime",
          replacement: path.resolve(__dirname, "app/packages/grafana/runtime"),
        },
        // {
        //   find: "prismjs",
        //   replacement: path.resolve(__dirname, "app/prismjs"),
        // },
        {
          find: "@plugin-ui",
          replacement: path.resolve(
            __dirname,
            "app/packages/grafana/plugin-ui",
          ),
        },
      ],
    },
    optimizeDeps: {
      include: [
        "react-loading-skeleton",
        "primjs",
        "@ant-design/icons",
        "@ant-design/pro-chat",
        "@ant-design/pro-editor",
        "react-intersection-observer",
      ],
      exclude: [],
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
  };
});

import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import svgr from "vite-plugin-svgr"
import { codeInspectorPlugin } from 'code-inspector-plugin';

import monacoEditorPlugin, { type IMonacoEditorOpts } from "vite-plugin-monaco-editor"
const monacoEditorPluginDefault = (monacoEditorPlugin as any).default as (options: IMonacoEditorOpts) => any

export default defineConfig({
  plugins: [
    codeInspectorPlugin({
      bundler: 'vite',
      editor: 'idea',
      port: 3061,
      behavior: {
        locate: true,
        copy: true,
      },
      showSwitch: true,
    }),
    react({
      babel: {
        parserOpts: {
          plugins: ['decorators-legacy', 'classProperties']
        }
      }
    }),
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
  ],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "src") },
      { find: "@scenes", replacement: path.resolve(__dirname, "src/packages/grafana/scenes") },
      { find: "@schema", replacement: path.resolve(__dirname, "src/packages/grafana/schema") },
      { find: "@data", replacement: path.resolve(__dirname, "src/packages/grafana/data") },


    ],

  },


  server: {
    // host: "0.0.0.0",
    port: 3061,
    proxy: {
      '/api': {
        target: 'http://localhost:3061',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
    // open: false,
    // cors: true,
    // hmr: true,
    // proxy: {}
  },
})

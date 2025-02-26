import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import svgr from "vite-plugin-svgr"

import monacoEditorPlugin, { type IMonacoEditorOpts } from "vite-plugin-monaco-editor"
const monacoEditorPluginDefault = (monacoEditorPlugin as any).default as (options: IMonacoEditorOpts) => any

export default defineConfig({
  plugins: [
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

    ],

  },


  server: {
    host: "0.0.0.0",
    // port: 58760,
    // open: false,
    // cors: true,
    // hmr: true,
    // proxy: {}
  },
})

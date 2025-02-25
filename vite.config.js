import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import svgr from "vite-plugin-svgr";
import monacoEditorPlugin from "vite-plugin-monaco-editor";
var monacoEditorPluginDefault = monacoEditorPlugin.default;
export default defineConfig({
    plugins: [
        react(),
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
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    server: {
        host: "0.0.0.0",
        // port: 58760,
        // open: false,
        // cors: true,
        // hmr: true,
        // proxy: {}
    },
});

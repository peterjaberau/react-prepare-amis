/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly [key: string]: string | boolean | number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

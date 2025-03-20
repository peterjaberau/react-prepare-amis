declare module "*.css";
declare module "vite/client";

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

/*
declare module 'express-status-monitor';
 */



// Entry point that doesn't register all languages by default
// eslint-disable-next-line @typescript-eslint/no-require-imports

/*
import highlight = require('highlight.js')
export = highlight

declare module 'highlightjs-graphql' {
  import type { HLJSStatic, IModeBase } from 'highlight.js'

  function hljsDefineGraphQL(hljs: typeof import('highlight.js')): void
  namespace hljsDefineGraphQL {
    export const definer: (hljs?: HLJSStatic) => IModeBase
  }

  export = hljsDefineGraphQL


}



declare module 'core-js/configurator' {
  export default function configure(config: { usePolyfill?: string[] }): void
}


 */



declare module '*.scss' {
  const cssModule: string
  export default cssModule
}
declare module '*.css' {
  const cssModule: string
  export default cssModule
}

declare module '*.html'

declare module 'core-js/configurator' {
  export default function configure(config: { usePolyfill?: string[] }): void
}

/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />


import '@emotion/react';
declare module 'react' {
  interface Attributes {
    css?: CSSProp<Theme>;
  }
}

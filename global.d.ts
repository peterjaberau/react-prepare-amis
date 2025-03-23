/// <reference types="@remix-run/node" />
/// <reference types="node" />
/// <reference types="jquery" />

declare module "*.module.css";

type CSSModuleClasses = { readonly [key: string]: string };

declare module '*.module.css' {
    const classes: CSSModuleClasses;
    export default classes;
}
declare module '*.module.scss' {
    const classes: CSSModuleClasses;
    export default classes;
}
declare module '*.module.sass' {
    const classes: CSSModuleClasses;
    export default classes;
}
declare module '*.module.less' {
    const classes: CSSModuleClasses;
    export default classes;
}
declare module '*.module.styl' {
    const classes: CSSModuleClasses;
    export default classes;
}
declare module '*.module.stylus' {
    const classes: CSSModuleClasses;
    export default classes;
}
declare module '*.module.pcss' {
    const classes: CSSModuleClasses;
    export default classes;
}
declare module '*.module.sss' {
    const classes: CSSModuleClasses;
    export default classes;
}


// CSS
declare module '*.css' { }
declare module '*.scss' { }
declare module '*.sass' { }
declare module '*.less' { }
declare module '*.styl' { }
declare module '*.stylus' { }
declare module '*.pcss' { }
declare module '*.sss' { }

// Built-in asset types
// see `src/node/constants.ts`

// images
declare module '*.apng' {
    const src: string;
    export default src;
}
declare module '*.png' {
    const src: string;
    export default src;
}
declare module '*.jpg' {
    const src: string;
    export default src;
}
declare module '*.jpeg' {
    const src: string;
    export default src;
}
declare module '*.jfif' {
    const src: string;
    export default src;
}
declare module '*.pjpeg' {
    const src: string;
    export default src;
}
declare module '*.pjp' {
    const src: string;
    export default src;
}
declare module '*.gif' {
    const src: string;
    export default src;
}
declare module '*.svg' {
    const src: string;
    export default src;
}
declare module '*.ico' {
    const src: string;
    export default src;
}
declare module '*.webp' {
    const src: string;
    export default src;
}
declare module '*.avif' {
    const src: string;
    export default src;
}

// media
declare module '*.mp4' {
    const src: string;
    export default src;
}
declare module '*.webm' {
    const src: string;
    export default src;
}
declare module '*.ogg' {
    const src: string;
    export default src;
}
declare module '*.mp3' {
    const src: string;
    export default src;
}
declare module '*.wav' {
    const src: string;
    export default src;
}
declare module '*.flac' {
    const src: string;
    export default src;
}
declare module '*.aac' {
    const src: string;
    export default src;
}
declare module '*.opus' {
    const src: string;
    export default src;
}
declare module '*.mov' {
    const src: string;
    export default src;
}
declare module '*.m4a' {
    const src: string;
    export default src;
}
declare module '*.vtt' {
    const src: string;
    export default src;
}

// fonts
declare module '*.woff' {
    const src: string;
    export default src;
}
declare module '*.woff2' {
    const src: string;
    export default src;
}
declare module '*.eot' {
    const src: string;
    export default src;
}
declare module '*.ttf' {
    const src: string;
    export default src;
}
declare module '*.otf' {
    const src: string;
    export default src;
}

// other
declare module '*.webmanifest' {
    const src: string;
    export default src;
}
declare module '*.pdf' {
    const src: string;
    export default src;
}
declare module '*.txt' {
    const src: string;
    export default src;
}


// wasm?init
declare module '*.wasm?init' {
    const initWasm: (options?: WebAssembly.Imports) => Promise<WebAssembly.Instance>;
    export default initWasm;
}

// web worker
declare module '*?worker' {
    const workerConstructor: {
        new(options?: { name?: string }): Worker;
    };
    export default workerConstructor;
}

declare module '*?worker&inline' {
    const workerConstructor: {
        new(options?: { name?: string }): Worker;
    };
    export default workerConstructor;
}

declare module '*?worker&url' {
    const src: string;
    export default src;
}

declare module '*?sharedworker' {
    const sharedWorkerConstructor: {
        new(options?: { name?: string }): SharedWorker;
    };
    export default sharedWorkerConstructor;
}

declare module '*?sharedworker&inline' {
    const sharedWorkerConstructor: {
        new(options?: { name?: string }): SharedWorker;
    };
    export default sharedWorkerConstructor;
}

declare module '*?sharedworker&url' {
    const src: string;
    export default src;
}

declare module '*?raw' {
    const src: string;
    export default src;
}

declare module '*?url' {
    const src: string;
    export default src;
}

declare module '*?inline' {
    const src: string;
    export default src;
}






declare module 'invariant' {
    function invariant(condition: boolean, message?: string): void;
    export default invariant;
}

declare module 'invariant' {
    function invariant(condition: boolean, message?: string): void;
    export default invariant;
}







import type jQuery from "jquery"; // Ensure TypeScript understands jQuery's types


declare module "*.css";
declare module "vite/client";
declare module "query-string";

declare global {
    interface JQueryPlot {
        (element: HTMLElement | JQuery, data: any, options: any): void;
        plugins: any[];
    }

    interface JQuery {
        place_tt?: any;
        modal?: any;
        tagsinput?: any;
        typeahead?: any;
        accessKey?: any;
        tooltip?: any;
    }

    // @ts-ignore
    interface JQueryStatic extends jQuery {
        plot: JQueryPlot;
    };

    interface Window {
        $: JQueryStatic;
        jQuery: JQueryStatic;
    }
}


declare module '*.png' {
    const path: string;
    export default path;
}

declare module '*.webm' {
    const path: string;
    export default path;
}

declare module '*.mp4' {
    const path: string;
    export default path;
}

declare module '@elastic/eui/es/components/icon/icon' {
    import type { SVGProps } from 'react';
    export function appendIconComponentCache(icons: Record<string, SVGProps<SVGSVGElement>>): void;
}

declare module '@elastic/eui/es/components/icon/assets/*' {
    import type { SVGProps } from 'react';
    export const icon: SVGProps<SVGSVGElement>;
}

declare module '@elastic/eui/dist/*.min.css' {
    const path: string;
    export default path;
}

declare module 'url:monaco-editor/*' {
    const path: string;
    export default path;
}


declare module 'url' {
    export interface UrlObject {
        auth?: string | null;
        hash?: string | null;
        hostname?: string | null;
        pathname?: string | null;
        protocol?: string | null;
        slashes?: boolean | null;
        port?: string | null;
        query?: string | null | ParsedQuery;
    }
}

declare module 'stream' {
    import { Stream } from 'stream';
    export = Stream;
}

declare module './src/views/eui/CoreApp/components/test/basic.js' {
    export const functionMapping: Record<string, any>;
}

declare module '@emotion/css' {
    export type CSSObject = { [key: string]: any };
    export function css(styles: CSSObject): string;
    export function cx(...args: any[]): string;
    export const keyframes: any;

}

declare module 'invariant';

declare module 'react-loading-skeleton' {
    import { FC, ReactNode } from 'react';

    interface SkeletonProps {
        count?: number;
        duration?: number;
        width?: string | number;
        height?: string | number;
        circle?: boolean;
        className?: string;
        style?: React.CSSProperties;
    }

    const Skeleton: FC<SkeletonProps>;
    export default Skeleton;

    interface SkeletonThemeProps {
        baseColor?: string;
        highlightColor?: string;
        borderRadius?: string | number;
        duration?: number;
        children?: ReactNode;
    }

    export const SkeletonTheme: FC<SkeletonThemeProps>;
}

declare var beforeAll: (fn: () => void | Promise<void>, timeout?: number) => void;
declare var afterEach: (fn: () => void | Promise<void>, timeout?: number) => void;
declare var afterAll: (fn: () => void | Promise<void>, timeout?: number) => void;


// declare module 'ol-ext/layer/DayNight' {
//     import { Layer } from 'ol/layer';
//     import { Source } from 'ol/source';
//
//     export default class DayNight extends Layer<Source> {
//         constructor(options?: any);
//         setTime(date: Date): void;
//         getSunPosition(date: Date): number[];
//         getCoordinates(date: Date, type: string): any[];
//     }
// }

declare module 'ol-ext/style/FlowLine' {
    import { Style } from 'ol/style';
    import { LineString } from 'ol/geom';

    export default class FlowLine extends Style {
        constructor(options?: any);
        setArrow(type: number): void;
        setArrowColor(color: string): void;
        setArrowSize(size: number): void;
        setGeometry(geometry: LineString): void;
    }
}


declare module 'ol-ext/style/Photo' {
    import { ImageStyle, ImageStyleOptions } from 'ol/style/Image';

    export interface PhotoOptions extends ImageStyleOptions {
        src: string;
        radius: number;
        crop?: boolean;
        kind?: 'square' | 'circle' | 'anchored' | 'folio';
        shadow?: boolean;
        stroke?: Stroke;
        onload?: () => void;
    }

    export default class Photo extends ImageStyle {
        constructor(options: PhotoOptions);
        setImage(image: HTMLImageElement): void;
        getImage(): HTMLImageElement;
    }
}

declare module '@locker/near-membrane-dom/custom-devtools-formatter';

declare global {
    interface Window {
        __grafana_app_component__?: React.ReactNode;
        __webpack_public_path__?: string;
        __webpack_nonce__?: string;
        __grafana_app_bundle_loaded?: string;
        __grafanaBootData__?: any;
    }
}


declare module 'js-export-excel';
declare module 'lax.js';

declare global {
    const __APP_INFO__: {
        pkg: typeof packageJSON;
        lastBuildTime: string;
    };
}


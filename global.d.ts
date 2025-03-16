/// <reference types="node" />
/// <reference types="jquery" />
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


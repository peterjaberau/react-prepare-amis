/// <reference types="node" />

declare module "*.css";
declare module "vite/client";
declare module "query-string";


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

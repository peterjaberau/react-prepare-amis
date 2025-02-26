/**
 * @file component Env, including how to send ajax, how to notify, how to jump, etc. .
 */
import React from 'react';
import {RendererConfig} from './factory';
import {ThemeInstance} from './theme';
import {
  ActionObject,
  Api,
  EventTrack,
  Payload,
  PlainObject,
  Schema,
  ToastConf,
  ToastLevel
} from './types';
import hoistNonReactStatic from 'hoist-non-react-statics';

import type {IScopedContext} from './Scoped';
import type {RendererEvent} from './utils/renderer-event';
import type {ListenerContext} from './actions/Action';
import type {ICmptAction} from './actions/CmptAction';

export interface WsObject {
  url: string;
  responseKey?: string;
  body?: any;
}

export interface RendererEnv {
  /* Force hiding the error message inside the component, which will overwrite the internal properties of the component*/
  forceSilenceInsideError?: boolean;
  session?: string;
  fetcher: (api: Api, data?: any, options?: object) => Promise<Payload>;
  isCancel: (val: any) => boolean;
  wsFetcher: (
    ws: WsObject,
    onMessage: (data: any) => void,
    onError: (error: any) => void
  ) => void;
  notify: (type: ToastLevel, msg: any, conf?: ToastConf) => void;
  jumpTo: (to: string, action?: ActionObject, ctx?: object) => void;
  alert: (msg: string, title?: string) => void;
  confirm: (msg: string, title?: string) => Promise<boolean>;
  updateLocation: (location: any, replace?: boolean) => void;

  /**
   * Prevent route jump. Sometimes the form is not saved, but the route jumps, resulting in the page not being updated.
   * So let the user confirm first.
   *
   * This is required for single-page mode. If it is not single-page mode, this does not need to be processed.
   */
  blockRouting?: (fn: (targetLocation: any) => void | string) => () => void;
  isCurrentUrl: (link: string, ctx?: any) => boolean | {params?: object};

  /**
   * Monitor route changes. If jssdk needs to do a single page jump, this needs to be implemented.
   */
  watchRouteChange?: (fn: () => void) => () => void;
  // Used to track various operations of users in the interface
  tracker: (eventTrack: EventTrack, props?: PlainObject) => void;
  /**
   * Capture error information during amis execution
   */
  errorCatcher?: (error: any, errorInfo: any) => void;
  /**
   * Custom style prefix
   */
  customStyleClassPrefix?: string;
  rendererResolver?: (
    path: string,
    schema: Schema,
    props: any
  ) => null | RendererConfig;
  copy?: (contents: string, format?: any) => void;
  getModalContainer?: () => HTMLElement;
  theme: ThemeInstance;

  /**
   * @deprecated
   * Please set the `--affix-offset-top` css variable in the outer layer
   */
  affixOffsetTop?: number;

  /**
   * @deprecated
   * Please set the `--affix-offset-bottom` css variable in the outer layer
   */
  affixOffsetBottom?: number;

  richTextToken: string;

  /**
   * The default site selection component provider, currently only supports Baidu
   */
  locationPickerVendor?: string;

  /**
   * ak of the site selection component
   */
  locationPickerAK?: string;
  loadRenderer: (
    schema: Schema,
    path: string,
    reRender: Function
  ) => Promise<React.ElementType> | React.ElementType | JSX.Element | void;
  loadChartExtends?: () => void | Promise<void>;
  loadTinymcePlugin?: (tinymce: any) => void | Promise<void>;
  useMobileUI?: boolean;
  isMobile: () => boolean;
  /**
   * Filter html tags, which can be used to add xss protection logic
   */
  filterHtml: (input: string) => string;
  beforeDispatchEvent: (
    and:
      | string
      | React.ClipboardEvent<any>
      | React.DragEvent<any>
      | React.ChangeEvent<any>
      | React.KeyboardEvent<any>
      | React.TouchEvent<any>
      | React.WheelEvent<any>
      | React.AnimationEvent<any>
      | React.TransitionEvent<any>
      | React.MouseEvent<any>,
    context: any,
    scoped: IScopedContext,
    data: any,
    broadcast?: RendererEvent<any>
  ) => void;

  /**
   * Whether to enable amis debugging
   */
  enableAMISDebug?: boolean;

  /**
   * Whether to enable testid positioning
   */
  enableTestid?: boolean;

  /**
   * Replace text, used to implement URL replacement, language replacement, etc.
   */
  replaceText?: {[propName: string]: any};

  /**
   * Blacklist for text replacement, because there are too many attributes, so it is changed to blacklist flags
   */
  replaceTextIgnoreKeys?:
    | String[]
    | ((key: string, value: any, object: any) => boolean);

  /**
   * Parse url parameters
   */
  parseLocation?: (location: any) => Object;

  /** Hook triggered before data update */
  beforeSetData?: (
    renderer: ListenerContext,
    action: ICmptAction,
    event: RendererEvent<any, any>
  ) => Promise<void | boolean>;

  /**
   * Renderer wrapper components can be specified externally
   */
  SchemaRenderer?: React.ComponentType<any>;
}

export const EnvContext = React.createContext<RendererEnv | void>(undefined);

export interface EnvProps {
  env: RendererEnv;
}

export function withRendererEnv<
  T extends React.ComponentType<React.ComponentProps<T> & EnvProps>
>(ComposedComponent: T) {
  type OuterProps = JSX.LibraryManagedAttributes<
    T,
    Omit<React.ComponentProps<T>, keyof EnvProps>
  > & {
    env?: RendererEnv;
  };

  const result = hoistNonReactStatic(
    class extends React.Component<OuterProps> {
      static displayName: string = `WithEnv(${
        ComposedComponent.displayName || ComposedComponent.name
      })`;
      static contextType = EnvContext;
      static ComposedComponent = ComposedComponent as React.ComponentType<T>;

      render() {
        const injectedProps: {
          env: RendererEnv;
        } = {
          env: this.props.env! || this.context
        };

        if (!injectedProps.env) {
          throw new Error('Env information acquisition failed, component usage is incorrect');
        }

        return (
          <ComposedComponent
            {...(this.props as JSX.LibraryManagedAttributes<
              T,
              React.ComponentProps<T>
            > as any)}
            {...injectedProps}
          />
        );
      }
    },
    ComposedComponent
  );

  return result as typeof result & {
    ComposedComponent: T;
  };
}

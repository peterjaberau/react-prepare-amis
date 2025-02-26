import React from 'react';
import {RendererStore, IRendererStore, IIRendererStore} from './store/index';
import {getEnv, destroy} from 'mobx-state-tree';
import {wrapFetcher} from './utils/api';
import {normalizeLink} from './utils/normalizeLink';
import {
  findIndex,
  promisify,
  qsparse,
  string2regExp,
  parseQuery,
  isMobile,
  TestIdBuilder
} from './utils/helper';
import {
  fetcherResult,
  SchemaNode,
  Schema,
  EventTrack,
  PlainObject
} from './types';
import {observer} from 'mobx-react';
import Scoped from './Scoped';
import {ThemeProps} from './theme';
import find from 'lodash/find';
import {LocaleProps} from './locale';
import {HocStoreFactory} from './WithStore';
import type {RendererEnv} from './env';
import {OnEventProps, RendererEvent} from './utils/renderer-event';
import {Placeholder} from './renderers/Placeholder';
import {StatusScopedProps} from './StatusScoped';

export interface TestFunc {
  (
    path: string,
    schema?: Schema,
    resolveRenderer?: (
      path: string,
      schema?: Schema,
      props?: any
    ) => null | RendererConfig
  ): boolean;
}

export interface RendererBasicConfig {
  test?: RegExp | TestFunc;
  type?: string;
  alias?: Array<string>; // Alias, can be bound to multiple types, just hit one of them.
  name?: string;
  origin?: RendererBasicConfig;
  storeType?: string;
  defaultProps?: (type: string, schema: any) => any;
  shouldSyncSuperStore?: (
    store: any,
    props: any,
    prevProps: any
  ) => boolean | undefined;
  storeExtendsData?: boolean | ((props: any) => boolean); // Whether to inherit the upper layer data.
  // Executed when the global variable associated with the global renderer changes
  // Because global variables are always up to date, some components are updated only when there are changes during didUpdate
  // Here is a chance for the component to customize its update
  onGlobalVarChanged?: (
    instance: React.Component,
    schema: any,
    data: any
  ) => void | boolean;
  weight?: number; // Weight, the lower the value, the higher the priority.
  isolateScope?: boolean;
  isFormItem?: boolean;
  autoVar?: boolean; // Automatically resolve variables
  // If you want to replace the system renderer, you need to set this to true
  override?: boolean;
  // [propName:string]:any;
}

export interface RendererProps
  extends ThemeProps,
    LocaleProps,
    OnEventProps,
    StatusScopedProps {
  render: (
    region: string,
    node: SchemaNode,
    props?: PlainObject
  ) => JSX.Element;
  env: RendererEnv;
  $path: string; // The level information of the current component
  $schema: any; // Original schema configuration
  testIdBuilder?: TestIdBuilder;
  store?: IIRendererStore;
  syncSuperStore?: boolean;
  data: {
    [propName: string]: any;
  };
  defaultData?: object;
  className?: any;
  style?: {
    [propName: string]: any;
  };
  onBroadcast?: (type: string, rawEvent: RendererEvent<any>, ctx: any) => any;
  dispatchEvent: (
    e: React.UIEvent<any> | React.BaseSyntheticEvent<any> | string,
    data: any,
    renderer?: React.Component<RendererProps>
  ) => Promise<RendererEvent<any>>;
  mobileUI?: boolean;
  [propName: string]: any;
}

export type RendererComponent = React.ComponentType<RendererProps> & {
  propsList?: Array<any>;
};

export interface RendererConfig extends RendererBasicConfig {
  // Renderer component. The difference from Renderer is that this one may wrap the store.
  component?: RendererComponent;
  // Asynchronous renderer
  getComponent?: () => Promise<{default: RendererComponent} | any>;

  // Original component
  Renderer?: RendererComponent;
}

export interface RenderSchemaFilter {
  (schema: Schema, renderer: RendererConfig, props?: any): Schema;
}

export interface WsObject {
  url: string;
  responseKey?: string;
  body?: any;
}

export interface FetcherConfig {
  url: string;
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'jsonp' | 'js';
  data?: any;
  config?: any;
}

export interface RenderOptions
  extends Partial<Omit<RendererEnv, 'fetcher' | 'theme'>> {
  session?: string;
  theme?: string;
  fetcher?: (config: FetcherConfig) => Promise<fetcherResult>;
}

const renderers: Array<RendererConfig> = [];
// The mapping relationship between type and RendererConfig
const renderersTypeMap: {
  [propName: string]: RendererConfig;
} = {};
export const renderersMap: {
  [propName: string]: boolean;
} = {};
const schemaFilters: Array<RenderSchemaFilter> = [];
let anonymousIndex = 1;

export function addSchemaFilter(fn: RenderSchemaFilter) {
  schemaFilters.push(fn);
}

export function filterSchema(
  schema: Schema,
  render: RendererConfig,
  props?: any
) {
  return schemaFilters.reduce(
    (schema, filter) => filter(schema, render, props),
    schema
  ) as Schema;
}

export function Renderer(config: RendererBasicConfig) {
  return function <T extends RendererComponent>(component: T): T {
    const renderer = registerRenderer({
      ...config,
      component: component
    });
    return renderer.component as T;
  };
}

// mobx-react's observer will modify the render method of the prototype chain
// If you want to inherit the render method of the overridden component, you need to restore the prototype chain render
// Otherwise the super.render method cannot be called
function fixMobxInjectRender<T extends Function>(klass: T): T {
  const target = klass.prototype;

  // mobx-react records the original render before tampering
  if (target?.render) {
    target.__originRender = target.render;
  }

  // Restore the render method that was tampered by mobx on the parent class
  // And the render of the current class will also be tampered with, so the parent class does not need to be tampered with
  if (target?.__proto__?.hasOwnProperty('__originRender')) {
    const originProto = target.__proto__;
    target.__proto__ = Object.create(originProto.__proto__ || Object);
    Object.assign(target.__proto__, originProto);
    target.__proto__.render = originProto.__originRender;
  }

  return klass;
}

// Convert renderer to component
function rendererToComponent(
  component: RendererComponent,
  config: RendererConfig
): RendererComponent {
  if (config.storeType && config.component) {
    component = HocStoreFactory({
      storeType: config.storeType,
      extendsData: config.storeExtendsData,
      shouldSyncSuperStore: config.shouldSyncSuperStore
    })(observer(fixMobxInjectRender(component)));
  }

  if (config.isolateScope) {
    component = Scoped(component, config.type);
  }
  return component;
}

export function registerRenderer(config: RendererConfig): RendererConfig {
  if (!config.test && !config.type) {
    throw new TypeError('please set config.type or config.test');
  } else if (!config.type && config.name !== 'static') {
    // todo static Currently there is no way to implement it without testing
    console.warn(
      `config.type is recommended for register renderer(${config.test})`
    );
  }

  if (typeof config.type === 'string' && config.type) {
    config.type = config.type.toLowerCase();
    config.test =
      config.test ||
      new RegExp(
        `(^|\/)(?:${(config.alias || [])
          .concat(config.type)
          .map(type => string2regExp(type))
          .join('|')})$`,
        'i'
      );
  }

  const exists = renderersTypeMap[config.type || ''];
  let renderer = {...config};
  if (
    exists &&
    exists.component &&
    exists.component !== Placeholder &&
    config.component &&
    !exists.origin &&
    !config.override
  ) {
    throw new Error(
      `The renderer with type "${config.type}" has already exists, please try another type!`
    );
  } else if (exists) {
    // If it already exists, merge the configuration and use the merged configuration
    renderer = Object.assign(exists, config);
    // If the existing configuration has a placeholder component, and the new configuration is an asynchronous renderer, delete the placeholder component
    // Avoid the problem that the Schema with visibleOn/hiddenOn conditions cannot be rendered
    if (
      exists.component === Placeholder &&
      !config.component &&
      config.getComponent
    ) {
      delete renderer.component;
      delete renderer.Renderer;
    }
  }

  renderer.weight = renderer.weight || 0;
  renderer.name =
    renderer.name || renderer.type || `anonymous-${anonymousIndex++}`;

  if (config.component) {
    renderer.Renderer = config.component;
    renderer.component = rendererToComponent(config.component, renderer);
  }

  if (!exists) {
    const idx = findIndex(
      renderers,
      item => (config.weight as number) < item.weight
    );
    ~idx ? renderers.splice(idx, 0, renderer) : renderers.push(renderer);
  }
  renderersMap[renderer.name] = !!(
    renderer.component && renderer.component !== Placeholder
  );
  renderer.type && (renderersTypeMap[renderer.type] = renderer);
  (renderer.alias || []).forEach(alias => {
    const fork = {
      ...renderer,
      type: alias,
      name: alias,
      alias: undefined,
      origin: renderer
    };

    const idx = renderers.findIndex(item => item.name === alias);
    if (~idx) {
      Object.assign(renderers[idx], fork);
    } else {
      renderers.push(fork);
    }
    renderersTypeMap[alias] = fork;
    renderersMap[alias] = true;
  });
  return renderer;
}

export function unRegisterRenderer(config: RendererConfig | string) {
  const name = (typeof config === 'string' ? config : config.name)!;
  const idx = renderers.findIndex(item => item.name === name);
  if (~idx) {
    const renderer = renderers[idx];
    renderers.splice(idx, 1);

    delete renderersMap[name];
    delete renderersTypeMap[renderer.type || ''];
    renderer.alias?.forEach(alias => {
      const idx = renderers.findIndex(item => item.name === alias);
      idx > -1 && renderers.splice(idx, 1);
      delete renderersTypeMap[alias];
      delete renderersMap[alias];
    });

    // Clear the renderer positioning cache
    Object.keys(cache).forEach(key => {
      const value = cache[key];
      if (value === renderer) {
        delete cache[key];
      }
    });
  }
}

export function loadRendererError(schema: Schema, path: string) {
  return (
    <div className="RuntimeError">
      <p>Error: Unable to find a corresponding renderer</p>
      <p>Path: {path}</p>
      <pre>
        <code>{JSON.stringify(schema, null, 2)}</code>
      </pre>
    </div>
  );
}

export async function loadAsyncRenderer(renderer: RendererConfig) {
  if (!isAsyncRenderer(renderer)) {
    // already loaded
    return;
  }

  const result = await renderer.getComponent!();

  // If the asynchronously loaded component has no registered renderer
  // If a component is exported by default, it will be automatically registered
  if (!renderer.component && result.default) {
    registerRenderer({
      ...renderer,
      component: result.default
    });
  }
}

export function isAsyncRenderer(item: RendererConfig) {
  return (
    item &&
    (!item.component || item.component === Placeholder) &&
    item.getComponent
  );
}

export function hasAsyncRenderers(types?: Array<string>) {
  return (
    Array.isArray(types)
      ? renderers.filter(item => item.type && types.includes(item.type))
      : renderers
  ).some(isAsyncRenderer);
}

export async function loadAsyncRenderersByType(
  type: string | Array<string>,
  ignore = false
) {
  const types = Array.isArray(type) ? type : [type];
  const asyncRenderers = types
    .map(type => {
      const renderer = renderersTypeMap[type];
      if (!renderer && !ignore) {
        throw new Error(`Can not find the renderer by type: ${type}`);
      }
      return renderer;
    })
    .filter(isAsyncRenderer);

  if (asyncRenderers.length) {
    await Promise.all(asyncRenderers.map(item => loadAsyncRenderer(item)));
  }
}

export async function loadAllAsyncRenderers() {
  const asyncRenderers = renderers.filter(isAsyncRenderer);
  if (asyncRenderers.length) {
    await Promise.all(
      renderers.map(async renderer => {
        await loadAsyncRenderer(renderer);
      })
    );
  }
}

export const defaultOptions: RenderOptions = {
  session: 'global',
  richTextToken: '',
  useMobileUI: true, // Whether to enable mobile native UI
  enableAMISDebug:
    (window as any).enableAMISDebug ??
    location.search.indexOf('amisDebug=1') !== -1 ??
    false,
  loadRenderer: loadRendererError,
  fetcher() {
    return Promise.reject('fetcher is required');
  },
  // Use WebSocket to get data in real time
  wsFetcher(
    ws: WsObject,
    onMessage: (data: any) => void,
    onError: (error: any) => void
  ) {
    if (ws) {
      const socket = new WebSocket(ws.url);
      socket.onopen = event => {
        if (ws.body) {
          socket.send(JSON.stringify(ws.body));
        }
      };
      socket.onmessage = event => {
        if (event.data) {
          let data;
          try {
            data = JSON.parse(event.data);
          } catch (error) {}
          if (typeof data !== 'object') {
            let key = ws.responseKey || 'data';
            data = {
              [key]: event.data
            };
          }

          onMessage(data);
        }
      };
      socket.onerror = onError;
      return {
        close: socket.close
      };
    } else {
      return {
        close: () => {}
      };
    }
  },
  isCancel() {
    console.error(
      'Please implement isCancel. see https://aisuda.bce.baidu.com/amis/zh-CN/start/getting-started#%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97'
    );
    return false;
  },
  updateLocation() {
    console.error(
      'Please implement updateLocation. see https://aisuda.bce.baidu.com/amis/zh-CN/start/getting-started#%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97'
    );
  },

  jumpTo: (to: string, action?: any) => {
    if (to === 'goBack') {
      return window.history.back();
    }
    to = normalizeLink(to);
    if (action && action.actionType === 'url') {
      action.blank === false ? (window.location.href = to) : window.open(to);
      return;
    }
    // The link action adds a targetType attribute, which defaults to opening in the content area (page), opening in a new window (blank), and opening in the current tab (self)
    if (
      action?.actionType === 'link' &&
      ['blank', 'self'].includes(action?.targetType)
    ) {
      if (action.targetType === 'self') {
        // The current tab is open and the page needs to be refreshed
        window.history.pushState(null, '', to);
        location.reload();
      } else {
        window.open(to);
      }
      return;
    }
    if (/^https?:\/\//.test(to)) {
      window.location.replace(to);
    } else {
      location.href = to;
    }
  },
  isCurrentUrl: (to: string) => {
    if (!to) {
      return false;
    }

    const link = normalizeLink(to);
    const location = window.location;
    let pathname = link;
    let search = '';
    const idx = link.indexOf('?');
    if (~idx) {
      pathname = link.substring(0, idx);
      search = link.substring(idx);
    }
    if (search) {
      if (pathname !== location.pathname || !location.search) {
        return false;
      }
      const query = qsparse(search.substring(1));
      const currentQuery = parseQuery(location);
      return Object.keys(query).every(key => query[key] === currentQuery[key]);
    } else if (pathname === location.pathname) {
      return true;
    }
    return false;
  },
  copy(contents: string) {
    console.error('copy contents', contents);
  },
  // Used to track various operations of users in the interface
  tracker(eventTrack: EventTrack, props: PlainObject) {},
  rendererResolver: resolveRenderer,
  replaceTextIgnoreKeys: [
    'type',
    'name',
    'mode',
    'target',
    'reload',
    'persistData'
  ],
  /**
   * Filter html tags, which can be used to add xss protection logic
   */
  filterHtml: (input: string) => input,
  isMobile: isMobile
};

export const stores: {
  [propName: string]: IRendererStore;
} = {};

// By default, env will be cached, so the new env passed in will not replace the old one.
// The new one will take effect only if the old one is deleted first.
export function clearStoresCache(
  sessions: Array<string> | string = Object.keys(stores)
) {
  if (!Array.isArray(sessions)) {
    sessions = [sessions];
  }

  sessions.forEach(key => {
    const store = stores[key];

    // @ts-ignore
    delete stores[key];

    store && destroy(store);
  });
}

// Of course, you can also update directly like this.
// Mainly because sometimes not many interfaces are prepared when creating for the first time.
// You can add more points later, such as the form in the prompt implemented by amis himself.
export function updateEnv(options: Partial<RenderOptions>, session = 'global') {
  options = {
    ...options
  };

  if (options.fetcher) {
    options.fetcher = wrapFetcher(options.fetcher, options.tracker) as any;
  }

  if (options.confirm) {
    options.confirm = promisify(options.confirm);
  }

  let store = stores[options.session || session];
  if (!store) {
    store = RendererStore.create(
      {},
      {
        ...defaultOptions,
        ...options
      }
    );
    stores[options.session || session] = store;
  } else {
    const env = getEnv(store);
    Object.assign(env, options);
  }
}

// Expand the default env so that users don't need to specify it.
export function extendDefaultEnv(env: Partial<RenderOptions>) {
  Object.assign(defaultOptions, env);
}

let cache: {[propName: string]: RendererConfig} = {};
export function resolveRenderer(
  path: string,
  schema?: Schema,
): null | RendererConfig {
  const type = typeof schema?.type == 'string' ? schema.type.toLowerCase() : '';

  // Directly match the type. Subsequent registration and rendering should use this method instead of the previous judgment path.
  if (type && renderersTypeMap[type]) {
    return renderersTypeMap[type];
  } else if (cache[path]) {
    return cache[path];
  } else if (path && path.length > 3072) {
    throw new Error('Path is too long, is it an infinite loop?');
  }

  let renderer: null | RendererConfig = null;

  renderers.some(item => {
    let matched = false;

    if (typeof item.test === 'function') {
      // It shouldn't be so complicated. Give each renderer a unique id so that you don't get confused and others don't get confused when using it.
      matched = item.test(path, schema, resolveRenderer);
    } else if (item.test instanceof RegExp) {
      matched = item.test.test(path);
    }

    if (matched) {
      renderer = item;
    }

    return matched;
  });

  // Only pure regular expressions can be cached. The second parameter is not used in the latter method.
  // Because custom test functions may depend on schema results
  if (
    renderer !== null &&
    (renderer as RendererConfig).component !== Placeholder &&
    ((renderer as RendererConfig).type ||
      (renderer as RendererConfig).test instanceof RegExp ||
      (typeof (renderer as RendererConfig).test === 'function' &&
        ((renderer as RendererConfig).test as Function).length < 2))
  ) {
    cache[path] = renderer;
  }

  return renderer;
}

export function getRenderers() {
  return renderers.concat();
}

export function getRendererByName(name: string) {
  return find(renderers, item => item.name === name);
}

export {RendererEnv};

export interface IGlobalOptions {
  pdfjsWorkerSrc: string;
}

const GlobalOptions: IGlobalOptions = {
  pdfjsWorkerSrc: ''
};

export function setGlobalOptions(options: Partial<IGlobalOptions>) {
  Object.assign(GlobalOptions, options);
}

export function getGlobalOptions() {
  return GlobalOptions;
}

/**
 * @file is used to create a domain, in which the runtime instance will be registered to facilitate communication between components.
 * @author fex
 */

import React from 'react';
import find from 'lodash/find';
import values from 'lodash/values';
import hoistNonReactStatic from 'hoist-non-react-statics';
import {dataMapping, registerFunction} from './utils/tpl-builtin';
import {RendererEnv, RendererProps} from './factory';
import {
  autobind,
  qsstringify,
  qsparse,
  eachTree,
  findTree,
  TreeItem,
  parseQuery,
  getVariable
} from './utils/helper';
import {RendererData, ActionObject} from './types';
import {isPureVariable} from './utils/isPureVariable';
import {createObject, createRendererEvent, filter, memoParse} from './utils';
import {ListenerAction, runActions} from './actions';

/**
 * target may contain ?xxx=xxx. In this case, you need to keep ?xxx=xxx and then filter the previous part.
 * Because the query part will be processed differently later. The original value will be retained instead of being converted to a string.
 * @param target
 * @param data
 * @returns
 */
export function filterTarget(target: string, data: Record<string, any>) {
  const idx = target.indexOf('?');

  if (~idx) {
    return filter(target.slice(0, idx), data) + target.slice(idx);
  }

  return filter(target, data, '| raw');
}

/**
 * Split target. If there is an expression inside, do not conflict with the comma in the expression.
 * @param target
 * @returns
 */
export function splitTarget(target: string): Array<string> {
  try {
    const ast = memoParse(target);
    const pos: Array<number> = [];
    ast.body.forEach((item: any) => {
      // Don't process the contents of the expression.
      if (item.type === 'raw') {
        const parts = (item.value as string).split(',');
        if (parts.length > 1) {
          parts.pop();
          let start = item.start.index;
          parts.forEach(part => {
            pos.push(start + part.length);
            start += part.length + 1;
          });
        }
      }
    });
    if (pos.length) {
      let parts: Array<string> = [];

      pos.reduceRight((arr: Array<string>, index) => {
        arr.unshift(target.slice(index + 1)?.trim());
        target = target.slice(0, index);
        return arr;
      }, parts);
      parts.unshift(target);

      return parts;
    }
  } catch (e) {}
  return [target];
}

export interface ScopedComponentType extends React.Component<RendererProps> {
  focus?: () => void;
  doAction?: (
    action: ActionObject,
    data: RendererData,
    throwErrors?: boolean,
    args?: any
  ) => void;
  receive?: (values: RendererData, subPath?: string, replace?: boolean) => void;
  reload?: (
    subpath?: string,
    query?: any,
    ctx?: RendererData,
    silent?: boolean,
    replace?: boolean,
    args?: any
  ) => void;
  context: any;
  setData?: (value?: object, replace?: boolean, index?: number) => void;
}

export interface IScopedContext {
  rendererType?: string;
  component?: ScopedComponentType;
  parent?: AliasIScopedContext;
  children?: AliasIScopedContext[];
  registerComponent: (component: ScopedComponentType) => void;
  unRegisterComponent: (component: ScopedComponentType) => void;
  getComponentByName: (name: string) => ScopedComponentType;
  getComponentById: (id: string) => ScopedComponentType | undefined;
  getComponentByIdUnderCurrentScope: (
    id: string,
    ignoreScope?: IScopedContext
  ) => ScopedComponentType | undefined;
  getComponents: () => Array<ScopedComponentType>;
  reload: (target: string, ctx: RendererData) => void | Promise<void>;
  send: (target: string, ctx: RendererData) => void;
  close: (target: string) => void;
  closeById: (target: string) => void;
  getComponentsByRefPath: (
    session: string,
    path: string
  ) => ScopedComponentType[];
  doAction: (actions: ListenerAction | ListenerAction[], ctx: any) => void;
}
type AliasIScopedContext = IScopedContext;

const rootScopedContext = createScopedTools('');
export const ScopedContext = React.createContext(rootScopedContext);

function createScopedTools(
  path?: string,
  parent?: AliasIScopedContext,
  env?: RendererEnv,
  rendererType?: string
): IScopedContext {
  const components: Array<ScopedComponentType> = [];
  const self: IScopedContext = {
    rendererType,
    component: undefined,
    parent,
    registerComponent(component: ScopedComponentType) {
      // Don't register yourself on your own Scoped object. Your own Scoped object is registered for child nodes.
      if (component.props.$path === path && parent) {
        self.component = component;
        return parent.registerComponent(component);
      }

      if (!~components.indexOf(component)) {
        components.push(component);
      }
    },

    unRegisterComponent(component: ScopedComponentType) {
      // It is actually registered in the parent Scoped.
      if (component.props.$path === path && parent) {
        // If it is yourself, try to remove yourself from the parent Scoped, otherwise the parent's children will continue to grow in some scenarios.
        const idx = parent.children!.indexOf(self);
        ~idx && parent.children!.splice(idx, 1);
        return parent.unRegisterComponent(component);
      }

      const idx = components.indexOf(component);

      if (~idx) {
        components.splice(idx, 1);
      }
    },

    getComponentByName(name: string) {
      if (~name.indexOf('.')) {
        const paths = name.split('.');
        const len = paths.length;

        return paths.reduce((scope, name, idx) => {
          if (scope && scope.getComponentByName) {
            const result: ScopedComponentType = scope.getComponentByName(name);
            return result && idx < len - 1 ? result.context : result;
          }

          return null;
        }, this);
      }

      const resolved = find(
        components,
        component =>
          filter(component.props.name, component.props.data) === name ||
          component.props.id === name
      );
      return resolved || (parent && parent.getComponentByName(name));
    },

    getComponentByIdUnderCurrentScope(
      id: string,
      ignoreScope?: IScopedContext
    ) {
      let component = undefined;
      findTree(
        [this],
        (item: TreeItem) =>
          item !== ignoreScope &&
          item.getComponents().find((cmpt: ScopedComponentType) => {
            if (filter(cmpt.props.id, cmpt.props.data) === id) {
              component = cmpt;
              return true;
            }
            return false;
          })
      ) as ScopedComponentType | undefined;

      return component;
    },

    getComponentById(id: string) {
      let root: AliasIScopedContext = this;
      let ignoreScope: AliasIScopedContext | undefined = undefined;

      // Find the top scoped
      while (root) {
        // Prioritize searching from the current scope
        // Go directly to the top level to search. This may cause problems if there are multiple pages rendered at once with history tags.
        const component = root.getComponentByIdUnderCurrentScope(
          id,
          ignoreScope
        );

        if (component) {
          return component;
        }

        if (!root.parent || root.parent === rootScopedContext) {
          break;
        }

        ignoreScope = root;
        root = root.parent;
      }

      return undefined;
    },

    /**
     * Find a component based on the name of the bound variable
     * Supports formats like ${xxx}
     *
     * @param session store session, default is global
     * @param path variable path, including namespace
     */
    getComponentsByRefPath(
      session: string,
      path: string
    ): ScopedComponentType[] {
      if (!path || typeof path !== 'string') {
        return [];
      }

      const cmptMaps: Record<string, ScopedComponentType> = {};
      let root: AliasIScopedContext = this;

      while (root.parent) {
        root = root.parent;
      }

      eachTree([root], (item: TreeItem) => {
        const scopedCmptList: ScopedComponentType[] =
          item.getComponents() || [];

        if (Array.isArray(scopedCmptList)) {
          for (const cmpt of scopedCmptList) {
            const pathKey = cmpt?.props?.$path ?? 'unknown';
            const schema = cmpt?.props?.$schema ?? {};
            const cmptSession = cmpt?.props.env?.session ?? 'global';

            /** Only search for components in the current session*/
            if (cmptMaps[pathKey] || session !== cmptSession) {
              continue;
            }

            /** Non-Scoped component, find its parent container*/
            if (cmpt?.setData && typeof cmpt.setData === 'function') {
              cmptMaps[pathKey] = cmpt;
              continue;
            }

            /** Find references in Scoped components */
            for (const key of Object.keys(schema)) {
              const expression = schema[key];

              if (
                typeof expression === 'string' &&
                isPureVariable(expression)
              ) {
                /** Taking into account the situation of the data mapping function, extract the host variable*/
                const host = expression
                  .substring(2, expression.length - 1)
                  .split('|')[0];

                if (host && host === path) {
                  cmptMaps[pathKey] = cmpt;
                  break;
                }
              }
            }
          }
        }
      });

      return values(cmptMaps);
    },

    getComponents() {
      return components.concat();
    },

    reload(target: string | Array<string>, ctx: any) {
      const scoped = this;

      let targets = typeof target === 'string' ? splitTarget(target) : target;
      targets.forEach(name => {
        const idx2 = name.indexOf('?');
        let query = null;

        if (~idx2) {
          const queryObj = qsparse(
            name
              .substring(idx2 + 1)
              .replace(
                /\$\{(.*?)\}/,
                (_, match) => '${' + encodeURIComponent(match) + '}'
              )
          );
          query = dataMapping(queryObj, ctx);
          name = name.substring(0, idx2);
        }

        const idx = name.indexOf('.');
        let subPath = '';

        if (~idx) {
          subPath = name.substring(1 + idx);
          name = name.substring(0, idx);
        }

        if (name === 'window') {
          if (query) {
            const link = location.pathname + '?' + qsstringify(query);
            env ? env.updateLocation(link, true) : location.replace(link);
          } else {
            location.reload();
          }
        } else {
          const component =
            scoped.getComponentByName(name) || scoped.getComponentById(name);
          component &&
          component.reload &&
          component.reload(subPath, query, ctx);
        }
      });
    },

    send(receive: string | Array<string>, values: object) {
      const scoped = this;
      let receives =
        typeof receive === 'string' ? splitTarget(receive) : receive;

      // Todo not found as a reminder!
      receives.forEach(name => {
        const askIdx = name.indexOf('?');
        if (~askIdx) {
          const query = name.substring(askIdx + 1);
          const queryObj = qsparse(
            query.replace(
              /\$\{(.*?)\}/,
              (_, match) => '${' + encodeURIComponent(match) + '}'
            )
          );

          name = name.substring(0, askIdx);
          values = dataMapping(queryObj, values);
        }

        const idx = name.indexOf('.');
        let subPath = '';

        if (~idx) {
          subPath = name.substring(1 + idx);
          name = name.substring(0, idx);
        }

        const component = scoped.getComponentByName(name);

        if (component && component.receive) {
          component.receive(values, subPath);
        } else if (name === 'window' && env && env.updateLocation) {
          const query = {
            ...parseQuery(location),
            ...values
          };
          const link = location.pathname + '?' + qsstringify(query);
          env.updateLocation(link, true);
        }
      });
    },

    /**
     * Mainly used to close the specified pop-up window
     *
     * @param target target name
     */
    close(target: string | boolean) {
      const scoped = this;

      if (typeof target === 'string') {
        // Filtering is turned off. This happens when the user closes multiple pop-up box names.
        splitTarget(target)
          .map(name => scoped.getComponentByName(name))
          .filter(component => component && component.props.show)
          .forEach(closeDialog);
      }
    },

    /**
     * Close the pop-up window with the specified id
     * @param id
     */
    closeById(id: string) {
      const scoped = this;
      const component: any = scoped.getComponentById(id);
      if (component && component.props.show) {
        closeDialog(component);
      }
    },

    async doAction(actions: ListenerAction | ListenerAction[], ctx: any) {
      const renderer = this.getComponents()[0]; // Get the top layer directly
      const rendererEvent = createRendererEvent('embed', {
        env,
        nativeEvent: undefined,
        data: createObject(renderer.props.data, ctx),
        scoped: this
      });

      await runActions(actions, renderer, rendererEvent);

      if (rendererEvent.prevented) {
        return;
      }
    }
  };

  registerFunction(
    'GETRENDERERDATA',
    (componentId: string, path?: string, scoped: any = self) => {
      const component = scoped.getComponentById(componentId);
      const data = component?.getData?.();
      if (path) {
        const variable = getVariable(data, path);
        return variable;
      }
      return data;
    }
  );

  registerFunction(
    'GETRENDERERPROP',
    (componentId: string, path?: string, scoped: any = self) => {
      const component = scoped.getComponentById(componentId);
      const props = component?.props;
      if (path) {
        const variable = getVariable(props, path);
        return variable;
      }
      return props;
    }
  );

  if (!parent) {
    return self;
  }

  !parent.children && (parent.children = []);

  // Bring the child
  parent.children!.push(self);

  return self;
}

function closeDialog(component: ScopedComponentType) {
  (component.context as IScopedContext)
    .getComponents()
    .filter(
      item =>
        item &&
        (item.props.type === 'dialog' || item.props.type === 'drawer') &&
        item.props.show
    )
    .forEach(closeDialog);
  component.props.onClose && component.props.onClose();
}

export function HocScoped<
  T extends {
    $path?: string;
    env: RendererEnv;
  }
>(
  ComposedComponent: React.ComponentType<T>,
  rendererType?: string
): React.ComponentType<
  T & {
  scopeRef?: (ref: any) => void;
}
> & {
  ComposedComponent: React.ComponentType<T>;
} {
  type ScopedProps = T & {
    scopeRef?: (ref: any) => void;
  };
  class ScopedComponent extends React.Component<ScopedProps> {
    static displayName = `Scoped(${
      ComposedComponent.displayName || ComposedComponent.name
    })`;
    static contextType = ScopedContext;
    static ComposedComponent = ComposedComponent;
    ref: any;
    scoped?: IScopedContext;

    constructor(props: ScopedProps, context: IScopedContext) {
      super(props);

      this.scoped = createScopedTools(
        this.props.$path,
        context,
        this.props.env,
        rendererType
      );

      const scopeRef = props.scopeRef;
      scopeRef && scopeRef(this.scoped);
    }

    getWrappedInstance() {
      return this.ref;
    }

    @autobind
    childRef(ref: any) {
      while (ref && ref.getWrappedInstance) {
        ref = ref.getWrappedInstance();
      }

      this.ref = ref;
    }

    componentWillUnmount() {
      const scopeRef = this.props.scopeRef;
      scopeRef && scopeRef(null);
      delete this.scoped;
    }

    render() {
      const {scopeRef, ...rest} = this.props;

      return (
        <ScopedContext.Provider value={this.scoped!}>
          <ComposedComponent
            {
              ...(rest as any) /* todo */
            }
            ref={this.childRef}
          />
        </ScopedContext.Provider>
      );
    }
  }

  hoistNonReactStatic(ScopedComponent, ComposedComponent);
  return ScopedComponent;
}

export default HocScoped;

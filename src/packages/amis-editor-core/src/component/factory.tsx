import {render, RendererProps} from 'amis';
import {isAlive} from 'mobx-state-tree';
import React from 'react';
import {NodeWrapper} from './NodeWrapper';
import {PanelProps, RegionConfig, RendererInfo} from '../plugin';
import groupBy from 'lodash/groupBy';
import {RegionWrapper} from './RegionWrapper';
import find from 'lodash/find';
import {ContainerWrapper} from './ContainerWrapper';
import {observer} from 'mobx-react';
import {EditorNodeContext, EditorNodeType} from '../store/node';
import {EditorManager} from '../manager';
import flatten from 'lodash/flatten';
import {render as reactRender, unmountComponentAtNode} from 'react-dom';
import {autobind, JSONGetById, JSONUpdate, appTranslate} from '../util';
import {ErrorBoundary} from '@/packages/amis-core/src';
import {CommonConfigWrapper} from './CommonConfigWrapper';
import type {Schema} from 'amis';
import type {DataScope} from '@/packages/amis-core/src';
import type {RendererConfig} from '@/packages/amis-core/src';
import type {SchemaCollection} from 'amis';
import {SchemaForm} from './base/SchemaForm';
import memoize from 'lodash/memoize';
import {FormConfigWrapper} from './FormConfigWrapper';

// Create Node Store and build it into a tree
export function makeWrapper(
  manager: EditorManager,
  info: RendererInfo,
  rendererConfig: RendererConfig
) {
  type Props = RendererProps & {
    $$id: string;
  };
  const store = manager.store;
  const renderer = rendererConfig.component!;

  @observer
  class Wrapper extends React.Component<Props> {
    static displayName = renderer.displayName;
    static propsList = ((renderer && renderer.propsList) || []).concat([
      '$$id'
      // '$$editor'
    ]);
    static contextType = EditorNodeContext;
    editorNode?: EditorNodeType;
    scopeId?: string;

    UNSAFE_componentWillMount() {
      const parent: EditorNodeType = (this.context as any) || store.root;
      if (!info.id) {
        return;
      }

      this.editorNode = parent.addChild({
        id: info.id, // $$id in the page schema
        type: info.type,
        label: info.name,
        isCommonConfig: !!this.props.$$commonSchema,
        isFormConfig: !!this.props.$$formSchema,
        path: this.props.$path,
        schemaPath: info.schemaPath,
        dialogTitle: info.dialogTitle,
        dialogType: info.dialogType,
        info,
        getData: () => this.props.data
      });

      this.editorNode!.setRendererConfig(rendererConfig);

      // Find the parent data domain and append the current component data domain to it to form a parent-child relationship
      if (
        (rendererConfig.storeType || info.isListComponent) &&
        !manager.dataSchema.hasScope(`${info.id}-${info.type}`)
      ) {
        let from = parent;
        let closestScope: DataScope | undefined = undefined;
        while (from && !closestScope) {
          if (from === store.root) {
            closestScope = manager.dataSchema.getScope('root');
          } else if (manager.dataSchema.hasScope(`${from.id}-${from.type}`)) {
            closestScope = manager.dataSchema.getScope(
              `${from.id}-${from.type}`
            );
          }

          // node.parent cannot find the root layer, so you need to add your own logic
          from = from.parentId === 'root' ? store.root : from.parent;
        }

        if (closestScope) {
          manager.dataSchema.switchTo(closestScope.id);
        } else {
          throw new Error('Program error');
        }

        this.scopeId = `${info.id}-${info.type}`;
        manager.dataSchema.addScope([], this.scopeId);
        if (info.name) {
          const nodeSchema = manager.store.getNodeById(info.id)?.schema;
          const tag = appTranslate(nodeSchema?.title ?? nodeSchema?.name);
          manager.dataSchema.current.tag = `${info.name}${
            tag && typeof tag === 'string' ? ` : ${tag}` : ''
          }`;
          manager.dataSchema.current.group = 'Component context';
        }
      }
    }

    componentDidUpdate(prevProps: Props) {
      const props = this.props;

      if (
        this.editorNode &&
        props.$$commonSchema !== prevProps.$$commonSchema
      ) {
        this.editorNode.updateIsCommonConfig(!!this.props.$$commonSchema);
      }

      if (this.editorNode && props.$$formSchema !== prevProps.$$formSchema) {
        this.editorNode.updateIsFormConfig(!!this.props.$$formSchema);
      }
    }

    componentWillUnmount() {
      if (this.editorNode && isAlive(this.editorNode)) {
        const parent: EditorNodeType = (this.context as any) || store.root;
        parent.removeChild(this.editorNode);
      }

      if (this.scopeId) {
        manager.dataSchema.removeScope(this.scopeId);
      }
    }

    @autobind
    wrapperRef(raw: any) {
      let ref = raw;
      while (ref?.getWrappedInstance) {
        ref = ref.getWrappedInstance();
      }

      if (ref && !ref.props) {
        Object.defineProperty(ref, 'props', {
          get: () => this.props
        });
      } else if (!ref && raw) {
        ref = {};
        Object.defineProperty(ref, 'props', {
          get: () => this.props
        });
      }

      if (this.editorNode && isAlive(this.editorNode)) {
        this.editorNode.setComponent(ref);

        info.plugin?.componentRef?.(this.editorNode, ref);
      }
    }

    /**
     * The main purpose is to make the $$editor sent by the renderer point to the current layer, not the store layer.
     */
    @autobind
    renderChild(region: string, node: Schema, props: any) {
      const {render} = this.props; // render: amis renderer

      // $$id changes, the renderer should also change
      if (node?.$$id) {
        props = props || {}; // props may be undefined
        props.key = `${props.key}-${node.$$id}`;
      }

      return render(region, node, {...props, $$editor: info});
    }

    render() {
      const {$$id, ...rest} = this.props;

      /*
       * Determine whether to wrap with NodeWrapper or ContainerWrapper based on renderer information.
       * NodeWrapper mainly completes the marking of DOM nodes (ie: adding data-editor-id attributes).
       * At the same time, if custom rendering is set in the plugin, the custom rendering related logic will be called.
       * ContainerWrapper itself will still wrap a layer of NodeWrapper. In addition, it mainly completes the wrapping of the area and DOM marking.
       * Whether the region will be wrapped depends on whether regions are configured in the editor information. It will be wrapped only if regions are configured.
       * **Not every container node is like this. For example, the Table renderer in amis. **
       */
      const Wrapper = /*info.wrapper || (*/ this.props.$$commonSchema
        ? CommonConfigWrapper
        : this.props.$$formSchema
        ? FormConfigWrapper
        : info.regions
        ? ContainerWrapper
        : NodeWrapper; /*)*/
      return (
        <EditorNodeContext.Provider
          value={this.editorNode || (this.context as any)}
        >
          <ErrorBoundary
            customErrorMsg={`Intercepted ${info.type} rendering error`}
            fallback={() => {
              return (
                <div className="renderer-error-boundary">
                  {info?.type}
                  An error occurred during rendering. Please check the console
                  output for detailed error information.
                </div>
              );
            }}
          >
            <Wrapper
              {...rest}
              render={this.renderChild}
              $$editor={info}
              $$node={this.editorNode}
              ref={this.wrapperRef}
            />
          </ErrorBoundary>
        </EditorNodeContext.Provider>
      );
    }
  }

  return Wrapper as any;
}

/**
 * Replace the previously selected pop-up window and the existing pop-up window schema with $ref reference
 * @param schema
 * @param dialogId select the pop-up window id
 * @param dialogRefsName
 */
function replaceDialogtoRef(
  schema: Schema,
  dialogId: string,
  dialogRefsName: string
) {
  let replacedSchema = schema;
  const dialog = JSONGetById(schema, dialogId);
  if (dialog) {
    replacedSchema = JSONUpdate(schema, dialogId, {$ref: dialogRefsName}, true);
  }
  return replacedSchema;
}

export function makeSchemaFormRender(
  manager: EditorManager,
  schema: {
    body?: SchemaCollection;
    controls?: Array<any>;
    definitions?: any;
    api?: any;
    submitOnChange?: boolean;
    justify?: boolean;
    panelById?: string;
    formKey?: string;
    pipeIn?: (value: any) => any;
    pipeOut?: (value: any) => any;
  }
) {
  const env = {...manager.env, session: 'schema-form'};
  const filterBody = memoize(body =>
    body ? flatten(Array.isArray(body) ? body : [body]) : undefined
  );

  return ({
    value,
    onChange,
    popOverContainer,
    id,
    store,
    node,
    readonly
  }: PanelProps) => {
    const ctx = {...manager.store.ctx};

    if (schema?.panelById && schema?.panelById !== node?.id) {
      // Used to filter out abnormal rendering
      return <></>;
    }

    if (id) {
      Object.defineProperty(ctx, '__props__', {
        get: () => {
          const node = store.getNodeById(id);
          return node?.getComponent()?.props || {};
        }
      });
    }

    // Do not share panel data for each layer
    const curFormKey = `${id}-${node?.type}${schema.formKey ? '-' : ''}${
      schema.formKey ? schema.formKey : ''
    }`;

    const body = filterBody(schema.body);
    const controls = filterBody(schema.controls);

    return (
      <SchemaForm
        key={curFormKey}
        propKey={curFormKey}
        api={schema.api}
        definitions={schema.definitions}
        body={body}
        controls={controls}
        value={value}
        ctx={ctx}
        pipeIn={schema.pipeIn}
        pipeOut={schema.pipeOut}
        submitOnChange={schema.submitOnChange}
        onChange={onChange}
        env={env}
        popOverContainer={popOverContainer}
        node={node}
        manager={manager}
        justify={schema.justify}
        readonly={readonly}
      />
    );
  };
}

export function hackIn(
  renderer: RendererConfig,
  regions?: Array<RegionConfig>,
  overrides?: any
) {
  let rawComponent: any = renderer.Renderer;
  while (rawComponent.ComposedComponent) {
    rawComponent = rawComponent.ComposedComponent;
  }

  const prototype: any = rawComponent.prototype;

  if (Array.isArray(regions)) {
    const grouped = groupBy(regions, item => item.renderMethod);

    // Mainly because the render method cannot be overwritten, you can only specify other render methods.
    // That's why you need to configure renderMethod to specify overriding other methods.
    Object.keys(grouped).forEach(key => {
      // Do not repeat the hack, or the target method does not exist.
      if (prototype[`__${key}`] || !prototype[key]) {
        return;
      }

      const regions = grouped[key];
      const customRenderCreator = regions[0]?.renderMethodOverride;

      prototype[`__${key}`] = prototype[key];
      prototype[key] = (function (origin, fn) {
        if (typeof origin !== 'function') {
          return origin;
        }

        return function (this: any) {
          const prev = this.super;
          this.super = origin.bind(this);
          const result = fn.apply(this, arguments);
          this.super = prev;
          return result;
        };
      })(
        prototype[`__${key}`],
        customRenderCreator?.(regions.concat(), insertRegion) ||
          function (this: any, ...args: any[]) {
            const info: RendererInfo = this.props.$$editor;
            const dom = this.super.apply(this, args);

            if (
              info &&
              (!this.props.$$commonSchema || !this.props.$$formSchema) &&
              Array.isArray(info.regions) &&
              regions.every(region =>
                find(info.regions!, c => c.key === region.key)
              )
            ) {
              const regionsCopy = regions.map(r => {
                const i = find(
                  info.regions,
                  c =>
                    c.key === r.key &&
                    (!r.rendererName || r.rendererName === c.rendererName)
                );

                if (i) {
                  return {
                    ...r,
                    label: i.label,
                    preferTag: i.preferTag
                  };
                }

                return r;
              });

              return insertRegion(
                this,
                dom,
                regionsCopy,
                info,
                info.plugin.manager
              );
            }

            return dom;
          }
      );
    });
  } else if (overrides) {
    Object.keys(overrides).forEach(key => {
      // Don't repeat the hack
      if (prototype[`__${key}`] || typeof prototype[key] !== 'function') {
        return;
      }

      prototype[`__${key}`] = prototype[key];
      prototype[key] = (function (origin, fn) {
        if (typeof origin !== 'function') {
          return origin;
        }

        return function (this: any) {
          const prev = this.super;
          this.super = origin.bind(this);
          const result = fn.apply(this, arguments);
          this.super = prev;
          return result;
        };
      })(prototype[`__${key}`], overrides[key]);
    });
  }
}

function getMatchedRegion(
  component: JSX.Element,
  dom: JSX.Element,
  regions: Array<RegionConfig>
): [RegionConfig | undefined, number] {
  let index = -1;
  let resolved: RegionConfig | undefined = undefined;

  regions.some((item, i) => {
    /*
     Normally, you can just wrap Region once outside the overridden method, but sometimes it is not a regular container.
     Sometimes it may be the Element inside the returned JSX.Element.
     So sometimes you have to configure properties such as matchRegion to tell the hack where the logic should be wrapped.
     There is also an insertPosition which is also a related configuration.
     */
    if (item.matchRegion!(dom, component)) {
      index = i;
      resolved = item;
      return true;
    }
    return false;
  });

  return [resolved, index];
}

function insertRegion(
  component: JSX.Element,
  dom: JSX.Element,
  regions: Array<RegionConfig>,
  info: RendererInfo,
  manager: EditorManager
): JSX.Element {
  // If the content modification function of these areas is not enabled, skip the insertion logic
  if (info.memberImmutable === true) {
    return dom;
  } else if (
    Array.isArray(info.memberImmutable) &&
    regions.every(reg =>
      (info.memberImmutable as Array<string>).includes(reg.key)
    )
  ) {
    return dom;
  }

  const rootRegion = find(regions, r => !r.matchRegion);

  if (rootRegion) {
    const Region = rootRegion.wrapper || RegionWrapper;

    if (rootRegion.insertPosition === 'inner' && React.isValidElement(dom)) {
      return React.cloneElement(dom as any, {
        children: (
          <Region
            key={rootRegion.key}
            preferTag={rootRegion.preferTag}
            name={rootRegion.key}
            label={rootRegion.label}
            placeholder={rootRegion.placeholder}
            regionConfig={rootRegion}
            editorStore={manager.store}
            manager={manager}
            children={(dom as any).props.children}
            wrapperResolve={rootRegion.wrapperResolve}
            rendererName={info.renderer.name}
          />
        )
      });
    } else {
      return (
        <Region
          key={rootRegion.key}
          preferTag={rootRegion.preferTag}
          name={rootRegion.key}
          label={rootRegion.label}
          placeholder={rootRegion.placeholder}
          regionConfig={rootRegion}
          editorStore={manager.store}
          manager={manager}
          children={dom}
          wrapperResolve={rootRegion.wrapperResolve}
          rendererName={info.renderer.name}
        />
      );
    }
  } else if (regions.length) {
    const [resolved, index] = getMatchedRegion(component, dom, regions);

    if (resolved) {
      const Region = resolved.wrapper || RegionWrapper;
      regions.splice(index, 1);

      if (resolved.insertPosition === 'outter') {
        return (
          <Region
            key={resolved.key}
            preferTag={resolved.preferTag}
            name={resolved.key}
            label={resolved.label}
            placeholder={resolved.placeholder}
            regionConfig={resolved}
            editorStore={manager.store}
            manager={manager}
            children={dom}
            wrapperResolve={resolved.wrapperResolve}
          />
        );
      } else if (React.isValidElement(dom)) {
        const children = (dom.props as any).children;

        return React.cloneElement(dom, {
          children: (
            <Region
              key={resolved.key}
              preferTag={resolved.preferTag}
              name={resolved.key}
              label={resolved.label}
              placeholder={resolved.placeholder}
              regionConfig={resolved}
              editorStore={manager.store}
              manager={manager}
              children={children}
              wrapperResolve={resolved.wrapperResolve}
            />
          )
        } as any);
      }
    } else if (React.isValidElement(dom) && (dom.props as any).children) {
      let children: any = (dom.props as any).children;

      if (Array.isArray(children)) {
        children = children.map(child =>
          insertRegion(component, child, regions, info, manager)
        );
      } else {
        children = insertRegion(
          component,
          children,
          regions,
          info,
          manager
        ) as any;
      }

      return React.cloneElement(dom, {
        children
      } as any);
    }
  }

  return dom;
}

export function mapReactElement(
  dom: JSX.Element,
  iterator: (dom: JSX.Element, index?: number) => JSX.Element,
  index?: number
) {
  if (!React.isValidElement(dom)) {
    return dom;
  }

  let mapped = iterator(dom, index);

  // If they are exactly the same, it means that no replacement was found.
  if (mapped === dom && (dom.props as any).children) {
    const children = (dom.props as any).children;
    if (Array.isArray(children)) {
      const childMapped: Array<any> = [];
      let modified = false;
      children.forEach((child: any, index: number) => {
        let mapped = mapReactElement(child, iterator, index);

        if (mapped !== child) {
          modified = true;
          if (React.isValidElement(mapped) && !mapped.key) {
            mapped = React.cloneElement(mapped, {key: index});
          }
        }

        childMapped.push(mapped);
      });

      if (modified) {
        mapped = React.cloneElement(mapped, {
          children: childMapped
        });
      }
    } else {
      const childMapped = mapReactElement(children, iterator, index);
      if (childMapped !== children) {
        mapped = React.cloneElement(mapped, {
          children: childMapped
        });
      }
    }
  }

  return mapped;
}

const thumbHost = document.createElement('div');
export function renderThumbToGhost(
  ghost: HTMLElement,
  region: EditorNodeType,
  schema: any,
  manager: EditorManager
) {
  // bca-disable-next-line
  ghost.innerHTML = '';
  let path = '';
  const host = region.host!;
  const component = host.getComponent()!;
  const isForm = component?.renderControl && region.region === 'body';

  try {
    reactRender(
      render(
        {
          children: ({render}: any) => {
            return isForm
              ? render('', {
                  type: 'form',
                  wrapWithPanel: false,
                  mode: component.props.mode,
                  body: [schema]
                })
              : render(region.region, schema);
          }
        } as any,
        {},
        {
          ...manager.env,
          theme: component?.props.theme || manager.env.theme,
          session: 'ghost-thumb'
        },
        path
      ),
      thumbHost
    );
  } catch (e) {}

  /* bca-disable */
  const html =
    thumbHost.innerHTML ||
    '<div class="wrapper-sm ba b-light mb-sm">Drag in placeholder</div>';
  // bca-disable-line
  ghost.innerHTML = html;
  /* bca-enable */

  unmountComponentAtNode(thumbHost);
  // bca-disable-next-line
  thumbHost.innerHTML = '';
}

import difference from 'lodash/difference';
import omit from 'lodash/omit';
import React from 'react';
import {isValidElementType} from 'react-is';
import LazyComponent from './components/LazyComponent';
import {
  filterSchema,
  loadRendererError,
  loadAsyncRenderer,
  registerRenderer,
  RendererConfig,
  RendererEnv,
  RendererProps,
  resolveRenderer
} from './factory';
import {asFormItem} from './renderers/Item';
import {IScopedContext, ScopedContext} from './Scoped';
import {Schema, SchemaNode} from './types';
import {DebugWrapper} from './utils/debug';
import getExprProperties from './utils/filter-schema';
import {
  anyChanged,
  chainEvents,
  autobind,
  TestIdBuilder,
  formateId
} from './utils/helper';
import {SimpleMap} from './utils/SimpleMap';
import {
  bindEvent,
  bindGlobalEventForRenderer as bindGlobalEvent,
  dispatchEvent,
  RendererEvent
} from './utils/renderer-event';
import {isAlive} from 'mobx-state-tree';
import {reaction} from 'mobx';
import {resolveVariableAndFilter} from './utils/tpl-builtin';
import {buildStyle} from './utils/style';
import {isExpression} from './utils/formula';
import {StatusScopedProps} from './StatusScoped';
import {evalExpression, filter} from './utils/tpl';
import Animations from './components/Animations';
import {cloneObject} from './utils/object';
import {observeGlobalVars} from './globalVar';

interface SchemaRendererProps
  extends Partial<Omit<RendererProps, 'statusStore'>>,
    StatusScopedProps {
  schema: Schema;
  $path: string;
  env: RendererEnv;
}

export const RENDERER_TRANSMISSION_OMIT_PROPS = [
  'type',
  'name',
  '$ref',
  'className',
  'style',
  'data',
  'originData',
  'children',
  'ref',
  'visible',
  'loading',
  'visibleOn',
  'hidden',
  'hiddenOn',
  'disabled',
  'disabledOn',
  'static',
  'staticOn',
  'component',
  'detectField',
  'defaultValue',
  'defaultData',
  'required',
  'requiredOn',
  'syncSuperStore',
  'mode',
  'body',
  'id',
  'inputOnly',
  'label',
  'renderLabel',
  'trackExpression',
  'editorSetting',
  'updatePristineAfterStoreDataReInit',
  'source'
];

const componentCache: SimpleMap = new SimpleMap();

export class SchemaRenderer extends React.Component<SchemaRendererProps, any> {
  static displayName: string = 'Renderer';
  static contextType = ScopedContext;

  rendererKey = '';
  renderer: RendererConfig | null;
  ref: any;
  cRef: any;

  schema: any;
  path: string;

  tmpData: any;

  toDispose: Array<() => any> = [];
  unbindEvent: (() => void) | undefined = undefined;
  unbindGlobalEvent: (() => void) | undefined = undefined;
  isStatic: any = undefined;

  constructor(props: SchemaRendererProps) {
    super(props);

    this.refFn = this.refFn.bind(this);
    this.renderChild = this.renderChild.bind(this);
    this.reRender = this.reRender.bind(this);
    this.resolveRenderer(this.props);
    this.dispatchEvent = this.dispatchEvent.bind(this);
    this.handleGlobalVarChange = this.handleGlobalVarChange.bind(this);

    const schema = props.schema;

    // Listen for statusStore updates
    this.toDispose.push(
      reaction(
        () => {
          const id = filter(schema.id, props.data);
          const name = filter(schema.name, props.data);
          return `${
            props.statusStore.visibleState[id] ??
            props.statusStore.visibleState[name]
          }${
            props.statusStore.disableState[id] ??
            props.statusStore.disableState[name]
          }${
            props.statusStore.staticState[id] ??
            props.statusStore.staticState[name]
          }`;
        },
        () => this.forceUpdate()
      )
    );

    this.toDispose.push(
      observeGlobalVars(schema, props.topStore, this.handleGlobalVarChange)
    );
  }

  componentWillUnmount() {
    this.toDispose.forEach(fn => fn());
    this.toDispose = [];
    this.unbindEvent?.();
    this.unbindGlobalEvent?.();
  }

  // Restriction: Only props other than the schema change, or a member value in the schema changes before updating.
  shouldComponentUpdate(nextProps: SchemaRendererProps) {
    const props = this.props;
    const list: Array<string> = difference(Object.keys(nextProps), [
      'schema',
      'scope'
    ]);

    if (
      difference(Object.keys(props), ['schema', 'scope']).length !==
      list.length ||
      anyChanged(list, this.props, nextProps)
    ) {
      return true;
    } else {
      const list: Array<string> = Object.keys(nextProps.schema);

      if (
        Object.keys(props.schema).length !== list.length ||
        anyChanged(list, props.schema, nextProps.schema)
      ) {
        return true;
      }
    }

    return false;
  }

  handleGlobalVarChange() {
    const handler = this.renderer?.onGlobalVarChanged;
    const newData = cloneObject(this.props.data);

    // If the renderer implements it itself and returns false, it will not continue to execute
    if (handler?.(this.cRef, this.props.schema, newData) === false) {
      return;
    }

    this.tmpData = newData;
    this.forceUpdate(() => {
      delete this.tmpData;
    });
  }

  resolveRenderer(props: SchemaRendererProps, force = false): any {
    let schema = props.schema;
    let path = props.$path;

    if (schema && schema.$ref) {
      schema = {
        ...props.resolveDefinitions(schema.$ref),
        ...schema
      };

      path = path.replace(/(?!.*\/).*/, schema.type);
    }

    if (
      schema?.type &&
      (force ||
        !this.renderer ||
        this.rendererKey !== `${schema.type}-${schema.$$id}`)
    ) {
      const rendererResolver = props.env.rendererResolver || resolveRenderer;
      this.renderer = rendererResolver(path, schema, props);
      this.rendererKey = `${schema.type}-${schema.$$id}`;
    } else {
      // If the custom component sets a label name or something on the node, wrap it with formItem
      // At least automatically supports valdiations, label, description and other logic.
      if (schema.children && !schema.component && schema.asFormItem) {
        schema.component = PlaceholderComponent;
        schema.renderChildren = schema.children;
        delete schema.children;
      }

      if (
        schema.component &&
        !schema.component.wrapedAsFormItem &&
        schema.asFormItem
      ) {
        const cache = componentCache.get(schema.component);

        if (cache) {
          schema.component = cache;
        } else {
          const cache = asFormItem({
            strictMode: false,
            ...schema.asFormItem
          })(schema.component);
          componentCache.set(schema.component, cache);
          cache.wrapedAsFormItem = true;
          schema.component = cache;
        }
      }
    }

    return {path, schema};
  }

  getWrappedInstance() {
    return this.cRef;
  }

  refFn(ref: any) {
    this.ref = ref;
  }

  @autobind
  childRef(ref: any) {
    // todo There is a problem here, that is, pay attention to the following comment
    // > // The original form item's visible: false and hidden: true form item values ​​and validation are valid
    // > visibleOn and hiddenOn are invalid.
    // > This is a bug, but it has been widely used
    // > I can only continue to implement this bug
    // This will cause the child component to render null based on the hidden situation, which will cause the ref here to have a value, but ref.getWrappedInstance() is null
    // This will be somewhat different from directly rendering components, at least cRef points to a different
    while (ref?.getWrappedInstance?.()) {
      ref = ref.getWrappedInstance();
    }

    if (ref && !ref.props) {
      Object.defineProperty(ref, 'props', {
        get: () => this.props
      });
    }

    if (ref) {
      // It is impossible to distinguish whether the monitoring is broadcast or not, so bind again, mainly to bind the broadcast
      this.unbindEvent?.();
      this.unbindGlobalEvent?.();

      this.unbindEvent = bindEvent(ref);
      this.unbindGlobalEvent = bindGlobalEvent(ref);
    }
    this.cRef = ref;
  }

  async dispatchEvent(
    e: React.MouseEvent<any>,
    data: any,
    renderer?: React.Component<RendererProps> // for didmount
  ): Promise<RendererEvent<any> | void> {
    return await dispatchEvent(
      e,
      this.cRef || renderer,
      this.context as IScopedContext,
      data
    );
  }

  renderChild(
    region: string,
    node?: SchemaNode,
    subProps: {
      data?: object;
      [propName: string]: any;
    } = {}
  ) {
    let {schema: _, $path: __, env, render, ...rest} = this.props;
    let {path: $path} = this.resolveRenderer(this.props);

    const omitList = RENDERER_TRANSMISSION_OMIT_PROPS.concat();
    if (this.renderer) {
      const Component = this.renderer.component;
      Component?.propsList &&
      omitList.push.apply(omitList, Component.propsList as Array<string>);
    }

    return render!(`${$path}${region ? `/${region}` : ''}`, node || '', {
      ...omit(rest, omitList),
      defaultStatic:
        (this.renderer?.type &&
        ['drawer', 'dialog'].includes(this.renderer.type)
          ? false
          : undefined) ??
        this.isStatic ??
        (_.staticOn
          ? evalExpression(_.staticOn, rest.data)
          : _.static ?? rest.defaultStatic),
      ...subProps,
      data:
        this.tmpData && subProps.data === this.props.data
          ? this.tmpData
          : subProps.data || rest.data,
      env: env
    });
  }

  reRender() {
    this.resolveRenderer(this.props, true);
    this.forceUpdate();
  }

  render(): JSX.Element | null {
    let {
      $path: _,
      schema: __,
      rootStore,
      statusStore,
      render,
      ...rest
    } = this.props;

    if (__ == null) {
      return null;
    }

    let {path: $path, schema} = this.resolveRenderer(this.props);
    const theme = this.props.env.theme;

    if (Array.isArray(schema)) {
      return render!($path, schema as any, rest) as JSX.Element;
    }

    const detectData =
      schema &&
      (schema.detectField === '&' ? rest : rest[schema.detectField || 'data']);
    let exprProps: any = detectData
      ? getExprProperties(schema, detectData, undefined, rest)
      : {};

    //Control visibility
    const id = filter(schema.id, rest.data);
    const name = filter(schema.name, rest.data);
    const visible = isAlive(statusStore)
      ? statusStore.visibleState[id] ?? statusStore.visibleState[name]
      : undefined;
    const disable = isAlive(statusStore)
      ? statusStore.disableState[id] ?? statusStore.disableState[name]
      : undefined;
    const isStatic = isAlive(statusStore)
      ? statusStore.staticState[id] ?? statusStore.staticState[name]
      : undefined;
    this.isStatic = isStatic;

    if (
      visible === false ||
      (visible !== true &&
        exprProps &&
        (exprProps.hidden ||
          exprProps.visible === false ||
          schema.hidden ||
          schema.visible === false ||
          rest.hidden ||
          rest.visible === false))
    ) {
      (rest as any).invisible = true;
    }

    if (schema.children) {
      return rest.invisible
        ? null
        : React.isValidElement(schema.children)
          ? schema.children
          : typeof schema.children !== 'function'
            ? null
            : (schema.children as Function)({
              ...rest,
              ...exprProps,
              $path: $path,
              $schema: schema,
              render: this.renderChild,
              forwardedRef: this.refFn,
              rootStore,
              statusStore,
              dispatchEvent: this.dispatchEvent
            });
    } else if (schema.component && isValidElementType(schema.component)) {
      const isSFC = !(schema.component.prototype instanceof React.Component);
      const {
        data: defaultData,
        value: defaultValue, // value during rendering is put into defaultValue
        activeKey: defaultActiveKey,
        key: propKey,
        ...restSchema
      } = schema;
      return rest.invisible
        ? null
        : React.createElement(schema.component as any, {
          ...rest,
          ...restSchema,
          ...exprProps,
          // value: defaultValue, // Note: value is not passed to the renderer here
          defaultData,
          defaultValue,
          defaultActiveKey,
          propKey,
          $path: $path,
          $schema: schema,
          ref: isSFC ? undefined : this.refFn,
          forwardedRef: isSFC ? this.refFn : undefined,
          render: this.renderChild,
          rootStore,
          statusStore,
          dispatchEvent: this.dispatchEvent
        });
    } else if (Object.keys(schema).length === 0) {
      return null;
    } else if (!this.renderer) {
      return rest.invisible ? null : (
        <LazyComponent
          defaultVisible={true}
          getComponent={async () => {
            const result = await rest.env.loadRenderer(
              schema,
              $path,
              this.reRender
            );
            if (result && typeof result === 'function') {
              return result;
            } else if (result && React.isValidElement(result)) {
              return () => result;
            }

            this.reRender();
            return () => loadRendererError(schema, $path);
          }}
        />
      );
    } else if (this.renderer.getComponent && !this.renderer.component) {
      // Handle asynchronous renderers
      return rest.invisible ? null : (
        <LazyComponent
          defaultVisible={true}
          getComponent={async () => {
            await loadAsyncRenderer(this.renderer as RendererConfig);
            this.reRender();
            return () => null;
          }}
        />
      );
    }

    const renderer = this.renderer as RendererConfig;
    schema = filterSchema(schema, renderer, rest);
    const {
      data: defaultData,
      value: defaultValue,
      activeKey: defaultActiveKey,
      key: propKey,
      ...restSchema
    } = schema;
    const Component = renderer.component!;

    let animationShow = true;

    // The original form item's visible: false and hidden: true form item values ​​and validation are valid
    // But visibleOn and hiddenOn are invalid.
    // This is a bug, but it has been widely used
    // I can only continue to implement this bug
    if (
      rest.invisible &&
      (exprProps.hidden ||
        exprProps.visible === false ||
        !renderer.isFormItem ||
        (schema.visible !== false && !schema.hidden))
    ) {
      if (schema.animations) {
        animationShow = false;
      } else {
        return null;
      }
    }

    // withStore will handle it in real time
    // This processing actually caused the problem
    if (renderer.storeType) {
      exprProps = {};
    }

    const supportRef =
      Component.prototype?.isReactComponent ||
      (Component as any).$$typeof === Symbol.for('react.forward_ref');
    let props: any = {
      ...renderer.defaultProps?.(schema.type, schema),
      ...theme.getRendererConfig(renderer.name),
      ...restSchema,
      ...chainEvents(rest, restSchema),
      ...exprProps,
      // value: defaultValue, // Note: value is not passed to the renderer here
      defaultData: restSchema.defaultData ?? defaultData,
      defaultValue: restSchema.defaultValue ?? defaultValue,
      defaultActiveKey: defaultActiveKey,
      propKey: propKey,
      $path: $path,
      $schema: schema,
      render: this.renderChild,
      rootStore,
      statusStore,
      dispatchEvent: this.dispatchEvent,
      mobileUI: schema.useMobileUI === false ? false : rest.mobileUI
    };

    // Used to refresh global variables
    props.data = this.tmpData || props.data;

    // style supports formulas
    if (schema.style) {
      (props as any).style = buildStyle(schema.style, detectData);
    }

    if (disable !== undefined) {
      (props as any).disabled = disable;
    }

    if (isStatic !== undefined) {
      (props as any).static = isStatic;
    }

    // Give priority to using the component's own testid or id, this cannot solve some sub-elements in the table row
    // This testid element will appear in each row. Just use nth to get the sequence number directly in the test tool
    if (rest.env.enableTestid) {
      if (props.testid || props.id || props.testIdBuilder == null) {
        if (!(props.testIdBuilder instanceof TestIdBuilder)) {
          props.testIdBuilder = new TestIdBuilder(props.testid || props.id);
        }
      }
    }

    // Automatically parsing variable mode is mainly to facilitate the direct introduction of third-party component libraries without the need to encapsulate a layer of variables to support them
    if (renderer.autoVar) {
      for (const key of Object.keys(schema)) {
        if (typeof props[key] === 'string' && isExpression(props[key])) {
          props[key] = resolveVariableAndFilter(
            props[key],
            props.data,
            '| raw'
          );
        }
      }
    }

    let component = supportRef ? (
      <Component {...props} ref={this.childRef} />
    ) : (
      <Component {...props} forwardedRef={this.childRef} />
    );

    if (schema.animations) {
      component = (
        <Animations
          schema={schema}
          component={component}
          show={animationShow}
        />
      );
    }

    return this.props.env.enableAMISDebug ? (
      <DebugWrapper renderer={renderer}>{component}</DebugWrapper>
    ) : (
      component
    );
  }
}

class PlaceholderComponent extends React.Component {
  childRef = React.createRef<any>();

  getWrappedInstance() {
    return this.childRef.current;
  }

  render() {
    const {renderChildren, ...rest} = this.props as any;

    if (typeof renderChildren === 'function') {
      return renderChildren({
        ...rest,
        ref: this.childRef
      });
    }

    return null;
  }
}

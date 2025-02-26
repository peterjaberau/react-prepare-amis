import hoistNonReactStatic from 'hoist-non-react-statics';
import {reaction} from 'mobx';
import {observer} from 'mobx-react';
import {isAlive} from 'mobx-state-tree';
import React from 'react';
import {RendererProps} from './factory';
import {IIRendererStore, IRendererStore} from './store';
import {RendererData, SchemaNode} from './types';
import getExprProperties, {
  hasExprPropertiesChanged
} from './utils/filter-schema';
import {
  createObject,
  extendObject,
  guid,
  isObjectShallowModified,
  syncDataFromSuper,
  isSuperDataModified
} from './utils/helper';
import {dataMapping, tokenize} from './utils/tpl-builtin';
import {RootStoreContext} from './WithRootStore';

/**
 * Ignore schema attributes in static data
 *
 * For example, the usage in https://github.com/baidu/amis/issues/8972
 */
function ignoreSchemaProps(key: string, value: any) {
  if (['clickAction'].includes(key) && typeof value !== 'string') {
    return true;
  }

  return false;
}

export function HocStoreFactory(renderer: {
  storeType: string;
  extendsData?: boolean | ((props: any) => boolean);
  shouldSyncSuperStore?: (
    store: any,
    props: any,
    prevProps: any
  ) => boolean | undefined;
}): any {
  return function <T extends React.ComponentType<RendererProps>>(Component: T) {
    type Props = Omit<
      RendererProps,
      'store' | 'data' | 'dataUpdatedAt' | 'scope'
    > & {
      store?: IIRendererStore;
      data?: RendererData;
      scope?: RendererData;
      rootStore: any;
      topStore: any;
    };

    @observer
    class StoreFactory extends React.Component<Props> {
      static displayName = `WithStore(${
        Component.displayName || Component.name
      })`;
      static ComposedComponent = Component;
      static contextType = RootStoreContext;
      store: IIRendererStore;
      context!: React.ContextType<typeof RootStoreContext>;
      ref: any;
      state: any;
      unReaction: any;

      constructor(
        props: Props,
        context: React.ContextType<typeof RootStoreContext>
      ) {
        super(props);

        const rootStore = context;
        this.renderChild = this.renderChild.bind(this);
        this.refFn = this.refFn.bind(this);

        const store = rootStore.addStore({
          id: guid(),
          path: this.props.$path,
          storeType: renderer.storeType,
          parentId: this.props.store ? this.props.store.id : ''
        }) as IIRendererStore;
        store.setTopStore(props.topStore);
        this.store = store;

        const extendsData =
          typeof renderer.extendsData === 'function'
            ? renderer.extendsData(props)
            : renderer.extendsData;

        if (extendsData === false) {
          store.initData(
            createObject(
              (this.props.data as any)
                ? (this.props.data as any).__super
                : null,
              {
                ...this.formatData(
                  dataMapping(
                    this.props.defaultData,
                    this.props.data,
                    ignoreSchemaProps
                  )
                ),
                ...this.formatData(this.props.data)
              }
            )
          );
        } else if (
          this.props.scope ||
          (this.props.data && (this.props.data as any).__super)
        ) {
          if (this.props.store && this.props.data === this.props.scope) {
            store.initData(
              createObject(this.props.store.data, {
                ...this.formatData(
                  dataMapping(
                    this.props.defaultData,
                    this.props.data,
                    ignoreSchemaProps
                  )
                )
              })
            );
          } else {
            store.initData(
              createObject(
                (this.props.data as any).__super || this.props.scope,
                {
                  ...this.formatData(
                    dataMapping(
                      this.props.defaultData,
                      this.props.data,
                      ignoreSchemaProps
                    )
                  ),
                  ...this.formatData(this.props.data)
                }
              )
            );
          }
        } else {
          store.initData({
            ...this.formatData(
              dataMapping(
                this.props.defaultData,
                this.props.data,
                ignoreSchemaProps
              )
            ),
            ...this.formatData(this.props.data)
          });
        }

        this.state = {};
        const {detectField, ...rest} = props;
        let exprProps: any = {};

        if (!detectField || detectField === 'data') {
          exprProps = getExprProperties(rest, store.data);

          this.state = {
            ...exprProps
          };

          this.unReaction = reaction(
            () => JSON.stringify(getExprProperties(this.props, store.data)),
            () =>
              this.setState({
                ...getExprProperties(this.props, store.data)
              })
          );
        }
      }

      getWrappedInstance() {
        return this.ref;
      }

      refFn(ref: any) {
        this.ref = ref;
      }

      formatData(data: any): object {
        if (Array.isArray(data)) {
          return {
            items: data
          };
        }

        return data as object;
      }

      componentDidUpdate(prevProps: Props) {
        const props = this.props;
        const store = this.store;

        // In the dialog scenario, the schema is updated when it is displayed.
        // Therefore, the expression attributes in the schema cannot actually monitor changes
        // So here we need to react again according to the new attributes
        if (
          (!props.detectField || props.detectField === 'data') &&
          hasExprPropertiesChanged(this.props, prevProps)
        ) {
          const state = getExprProperties(this.props, store.data);
          isObjectShallowModified(state, this.state) && this.setState(state);
          // Need to re-listen
          this.unReaction?.();
          this.unReaction = reaction(
            () => getExprProperties(this.props, store.data),
            (exprProps: any) => this.setState(exprProps)
          );
        }

        const shouldSync = renderer.shouldSyncSuperStore?.(
          store,
          props,
          prevProps
        );

        if (shouldSync === false) {
          return;
        }

        const extendsData =
          typeof renderer.extendsData === 'function'
            ? renderer.extendsData(props)
            : renderer.extendsData;
        if (extendsData === false) {
          if (
            shouldSync === true ||
            prevProps.defaultData !== props.defaultData ||
            (props.trackExpression
              ? tokenize(props.trackExpression, props.data!) !==
              tokenize(props.trackExpression, prevProps.data!)
              : isObjectShallowModified(prevProps.data, props.data) ||
              //
              // Special handling of CRUD.
              // In CRUD, the data in the toolbar is an empty object, but __super will be different
              (props.data &&
                prevProps.data &&
                props.data.__super !== prevProps.data.__super))
          ) {
            store.initData(
              extendObject(props.data, {
                ...this.formatData(
                  dataMapping(
                    this.props.defaultData,
                    this.props.data,
                    ignoreSchemaProps
                  )
                ),
                ...(store.hasRemoteData ? store.data : null), // todo only keeps remote data
                ...this.formatData(props.defaultData),
                ...this.formatData(props.data)
              }),
              (props.updatePristineAfterStoreDataReInit ??
                props.dataUpdatedAt !== prevProps.dataUpdatedAt) === false,
              props.data?.__changeReason
            );
          }
        } else if (
          shouldSync === true ||
          (props.trackExpression
            ? tokenize(props.trackExpression, props.data!) !==
            tokenize(props.trackExpression, prevProps.data!)
            : isObjectShallowModified(prevProps.data, props.data) ||
            (props.syncSuperStore !== false &&
              isSuperDataModified(props.data, prevProps.data, store)))
        ) {
          if (props.store && props.scope === props.data) {
            store.initData(
              createObject(props.store.data, {
                ...this.formatData(
                  dataMapping(
                    this.props.defaultData,
                    this.props.data,
                    ignoreSchemaProps
                  )
                ),
                ...(props.syncSuperStore === false
                  ? {
                    ...store.data
                  }
                  : syncDataFromSuper(
                    store.data,
                    props.store.data,
                    prevProps.scope,
                    store,
                    props.syncSuperStore === true
                  ))
              }),
              (props.updatePristineAfterStoreDataReInit ??
                props.dataUpdatedAt !== prevProps.dataUpdatedAt) === false,

              props.data?.__changeReason
            );
          } else if (props.data && (props.data as any).__super) {
            store.initData(
              extendObject(props.data, {
                ...this.formatData(
                  dataMapping(
                    this.props.defaultData,
                    this.props.data,
                    ignoreSchemaProps
                  )
                ),
                ...// There is remote data
                  // or top-level store
                  (store.hasRemoteData || !store.path.includes('/')
                    ? {
                      ...store.data,
                      ...props.data
                    }
                    : // combo does not need to be synchronized. If synchronization is required, the relevant logic has been implemented in Combo.tsx
                    // The main problem at present is that if the name of the form item in the combo is the same as the name of the combo itself, the value inside will be overwritten into an array
                    props.store?.storeType === 'ComboStore'
                      ? undefined
                      : syncDataFromSuper(
                        {...store.pristineDiff, ...props.data},
                        (props.data as any).__super,
                        (prevProps.data as any).__super,
                        store,
                        false
                      ))
              }),
              (props.updatePristineAfterStoreDataReInit ??
                props.dataUpdatedAt !== prevProps.dataUpdatedAt) === false,
              props.data?.__changeReason
            );
          } else {
            store.initData(
              createObject(props.scope, props.data),
              (props.updatePristineAfterStoreDataReInit ??
                props.dataUpdatedAt !== prevProps.dataUpdatedAt) === false,
              props.data?.__changeReason
            );
          }
        } else if (
          !props.trackExpression &&
          (!props.store || props.data !== props.scope) &&
          props.data &&
          props.data.__super
        ) {
          // This is rarely used. When the value of data.__super changes, update store.data
          if (
            !prevProps.data ||
            isObjectShallowModified(
              props.data.__super,
              prevProps.data.__super,
              false
            )
          ) {
            store.initData(
              createObject(props.data.__super, {
                ...props.data,
                ...store.data
              }),

              (props.updatePristineAfterStoreDataReInit ??
                props.dataUpdatedAt !== prevProps.dataUpdatedAt) === false ||
              (store.storeType === 'FormStore' &&
                prevProps.store?.storeType === 'CRUDStore'),

              props.data?.__changeReason
            );
          }
          // nextProps.data.__super !== props.data.__super) &&
        } else if (
          !props.trackExpression &&
          props.scope &&
          props.data === props.store!.data &&
          prevProps.data !== props.data
        ) {
          // This should only come in when the parent data changes.
          // Currently, this case rarely comes in.
          store.initData(
            createObject(props.scope, {
              // ...nextProps.data,
              ...store.data
            }),
            (props.updatePristineAfterStoreDataReInit ??
              props.dataUpdatedAt !== prevProps.dataUpdatedAt) === false,

            props.data?.__changeReason
          );
        }
      }

      componentWillUnmount() {
        const rootStore = this.context as IRendererStore;
        const store = this.store;

        this.unReaction?.();
        if (isAlive(store)) {
          store.setTopStore(null);
          rootStore.removeStore(store);
        }

        // @ts-ignore
        delete this.store;
      }

      renderChild(
        region: string,
        node: SchemaNode,
        subProps: {
          data?: object;
          [propName: string]: any;
        } = {}
      ) {
        let {render} = this.props;

        return render(region, node, {
          data: this.store.data,
          dataUpdatedAt: this.store.updatedAt,
          ...subProps,
          scope: this.store.data,
          store: this.store
        });
      }

      render() {
        const {detectField, ...rest} = this.props;

        if (this.state.hidden || this.state.visible === false) {
          return null;
        }

        const refConfig =
          Component.prototype?.isReactComponent ||
          (Component as any).$$typeof === Symbol.for('react.forward_ref')
            ? {ref: this.refFn}
            : {forwardedRef: this.refFn};

        return (
          <Component
            {
              ...(rest as any) /* todo */
            }
            {...this.state}
            {...refConfig}
            data={this.store.data}
            dataUpdatedAt={this.store.updatedAt}
            store={this.store}
            scope={this.store.data}
            render={this.renderChild}
          />
        );
      }
    }
    hoistNonReactStatic(StoreFactory, Component);

    return StoreFactory;
  };
}

import React from 'react';
import extend from 'lodash/extend';
import {Renderer, RendererProps} from '../factory';
import {FormStore, IFormStore} from '../store/form';
import {
  Api,
  SchemaNode,
  Schema,
  ActionObject,
  Payload,
  ClassName,
  BaseApiObject,
  SchemaExpression,
  SchemaClassName,
  DataChangeReason
} from '../types';
import {filter, evalExpression} from '../utils/tpl';
import getExprProperties from '../utils/filter-schema';
import {
  promisify,
  difference,
  until,
  noop,
  isObject,
  isVisible,
  cloneObject,
  SkipOperation,
  isEmpty,
  getVariable,
  isObjectShallowModified,
  qsparse,
  repeatCount,
  createObject
} from '../utils/helper';

import debouce from 'lodash/debounce';
import flatten from 'lodash/flatten';
import find from 'lodash/find';
import {
  ScopedContext,
  IScopedContext,
  ScopedComponentType,
  filterTarget
} from '../Scoped';

import {IComboStore} from '../store/combo';
import {dataMapping} from '../utils/tpl-builtin';
import {
  isApiOutdated,
  isEffectiveApi,
  shouldBlockedBySendOnApi
} from '../utils/api';
import LazyComponent from '../components/LazyComponent';
import {isAlive} from 'mobx-state-tree';

import type {LabelAlign} from './Item';
import {
  CustomStyleClassName,
  injectObjectChain,
  setThemeClassName
} from '../utils';
import {reaction} from 'mobx';
import groupBy from 'lodash/groupBy';
import isEqual from 'lodash/isEqual';
import CustomStyle from '../components/CustomStyle';

export interface FormHorizontal {
  left?: number;
  right?: number;
  leftFixed?: boolean | number | 'xs' | 'sm' | 'md' | 'lg';
  justify?: boolean; // Alignment
  labelAlign?: 'left' | 'right'; // label alignment
  /** Custom label width, default unit is px */
  labelWidth?: number | string;
}

export interface FormSchemaBase {
  /**
   * Form title
   */
  title?: string;

  /**
   * Button collection, will be fixed at the bottom.
   */
  actions?: Array<any>;

  /**
   * Form item collection
   */
  body?: any;

  /**
   * @deprecated Please use type tabs
   */
  tabs?: any;

  /**
   * @deprecated Please use type fieldSet
   */
  fieldSet?: any;

  data?: any;

  /**
   * Whether to enable debugging. When enabled, the form item data will be displayed in real time at the top.
   */
  debug?: boolean;

  /**
   * Debug panel configuration
   */
  debugConfig?: {
    /**
     * Default expansion level
     */
    levelExpand?: number;

    /**
     * Whether to copy
     */
    enableClipboard?: boolean;

    /**
     * Icon style
     */
    iconStyle?: 'square' | 'circle' | 'triangle';

    /**
     * Whether to display quotes on keys
     */
    quotesOnKeys?: boolean;

    /**
     * Whether to sort by key
     */
    sortKeys?: boolean;

    /**
     * Set the maximum display length of the string. Strings exceeding the length threshold will be truncated. Click value to switch the string display mode. The default is 120
     */
    ellipsisThreshold?: number | false;
  };

  /**
   * Used to initialize form data
   */
  initApi?: string | BaseApiObject;

  /**
   * Form is used to obtain the initial data api. Unlike initApi, it will keep polling the request interface until the finished property is returned as true.
   */
  initAsyncApi?: string | BaseApiObject;

  /**
   * After setting initAsyncApi, the default value will be the data.finished of the returned data to determine whether it is completed. You can also set it to other xxx, and it will be obtained from data.xxx
   */
  initFinishedField?: string;

  /**
   * After setting initAsyncApi, the default pull time interval
   */
  initCheckInterval?: number;

  /**
   * Whether to load initially
   */
  initFetch?: boolean;

  /**
   * It is recommended to change to sendOn Properties of api.
   */
  initFetchOn?: string;

  /**
   * After setting, polling will call initApi
   */
  interval?: number;

  /**
   * Whether to pull silently
   */
  silentPolling?: boolean;

  /**
   * Configure the conditions for stopping polling
   */
  stopAutoRefreshWhen?: string;

  /**
   * Whether to enable local cache
   */
  persistData?: string;

  /**
   * After enabling local cache, limit which keys to save
   */
  persistDataKeys?: string[];

  /**
   * Clear local cache after successful submission
   */
  clearPersistDataAfterSubmit?: boolean;

  /**
   * The api used by Form to save data.
   *
   * Details: https://aisuda.bce.baidu.com/amis/zh-CN/components/form/index#%E8%A1%A8%E5%8D%95%E6%8F%90%E4%BA%A4
   */
  api?: string | BaseApiObject;

  /**
   * Form can also configure feedback.
   */
  feedback?: any;

  /**
   * After setting this property, after the form is submitted and the save interface is sent, the interface will continue to be polled until the finished property is returned to true.
   */
  asyncApi?: string | BaseApiObject;

  /**
   * The time interval for polling requests, the default is 3 seconds. Only effective when setting asyncApi
   */
  checkInterval?: number;

  /**
   * If the name of the field that determines the end is not `finished`, please set this property, such as `is_success`
   */
  finishedField?: string;

  /**
   * Reset the form after submission
   */
  resetAfterSubmit?: boolean;

  /**
   * Clear the form after submission
   */
  clearAfterSubmit?: boolean;

  /**
   * Configure the default display mode of the form items.
   */
  mode?: 'normal' | 'inline' | 'horizontal' | 'flex';

  /**
   * How many columns are displayed for the form items
   */
  columnCount?: number;

  /**
   * If it is horizontal layout, this property can refine the left and right width ratio of the horizontal layout.
   */
  horizontal?: FormHorizontal;

  /**
   * Whether to automatically focus the first form element.
   */
  autoFocus?: boolean;

  /**
   * Message text configuration, remember that this priority is the lowest. If your interface returns msg, the interface returns priority.
   */
  messages?: {
    /**
     * Prompt when form validation fails
     */
    validateFailed?: string;
  };

  name?: string;

  /**
   * Configure the container panel className
   */
  panelClassName?: ClassName;

  /**
   * Set the primary key id. When set, only this data will be carried when checking whether the form is completed (asyncApi).
   * @default id
   */
  primaryField?: string;

  redirect?: string;

  reload?: string;

  /**
   * Whether to submit the form directly when modifying.
   */
  submitOnChange?: boolean;

  /**
   * The form is submitted once initially, which is useful when linked.
   */
  submitOnInit?: boolean;

  /**
   * The default submit button name. If it is set to empty, the default button can be removed.
   */
  submitText?: string;

  /**
   * The default form submission will save the data by sending the api, but you can also set the name value of another form or the name value of another `CRUD` model. If the target is a `Form`, the target `Form` will re-trigger `initApi` and `schemaApi`, and the api can get the current form content. If the target is a `CRUD` model, the target model will re-trigger the search, and the parameter is the current form content.
   */
  target?: string;

  /**
   * Whether to wrap with panel
   */
  wrapWithPanel?: boolean;

  /**
   * Whether to fix the bottom button at the bottom.
   */
  affixFooter?: boolean;

  /**
   * Page leaving prompt, to prevent the page from accidentally jumping and causing the form to not be saved.
   */
  promptPageLeave?: boolean;

  /**
   * Specific prompt information, optional.
   */
  promptPageLeaveMessage?: string;

  /**
   * Combined validation rules, optional
   */
  rules?: Array<{
    rule: string;
    message: string;

    // Highlight form items
    name?: string | Array<string>;
  }>;

  /**
   * Disable carriage return submission
   */
  preventEnterSubmit?: boolean;

  /**
   * Form label alignment
   */
  labelAlign?: LabelAlign;

  /**
   * Custom label width, default unit is px
   */
  labelWidth?: number | string;

  /**
   * ClassName in display state
   */
  static?: boolean;
  staticOn?: SchemaExpression;
  staticClassName?: SchemaClassName;
}

export type FormGroup = FormSchemaBase & {
  title?: string;
  className?: string;
};
export type FormGroupNode = FormGroup | FormGroupArray;
export interface FormGroupArray extends Array<FormGroupNode> {}

export interface FormProps
  extends RendererProps,
    Omit<FormSchemaBase, 'mode' | 'className'> {
  data: any;
  store: IFormStore;
  wrapperComponent: React.ElementType;
  canAccessSuperData: boolean;
  trimValues?: boolean;
  lazyLoad?: boolean;
  simpleMode?: boolean;
  onInit?: (values: object, props: any) => any;
  onReset?: (values: object, action?: any) => void;
  onSubmit?: (values: object, action: any) => any;
  onChange?: (values: object, diff: object, props: any) => any;
  onFailed?: (reason: string, errors: any) => any;
  onFinished: (values: object, action: ActionObject, store: IFormStore) => any;
  onValidate: (values: object, form: any) => any;
  onValidChange?: (valid: boolean, props: any) => void; // Form data validity changes
  messages: {
    fetchSuccess?: string;
    fetchFailed?: string;
    saveSuccess?: string;
    saveFailed?: string;
    validateFailed?: string;
  };
  rules: Array<{
    rule: string;
    message: string;
    name?: string | Array<string>;
  }>;
  lazyChange?: boolean; // form item
  formLazyChange?: boolean; // form
  // Spinner configuration
  loadingConfig?: {
    root?: string;
    show?: boolean;
  };
}
export default class Form extends React.Component<FormProps, object> {
  static defaultProps = {
    title: 'Form.title',
    submitText: 'Form.submit',
    initFetch: true,
    wrapWithPanel: true,
    mode: 'normal',
    collapsable: false,
    controlWidth: 'full',
    horizontal: {
      left: 2,
      right: 10,
      offset: 2
    },
    columnCount: 0,
    panelClassName: 'Panel--default',
    messages: {
      fetchFailed: 'fetchFailed',
      saveSuccess: 'saveSuccess',
      saveFailed: 'saveFailed'
    },
    wrapperComponent: '',
    finishedField: 'finished',
    initFinishedField: 'finished',
    labelAlign: 'right'
  };
  static propsList: Array<string> = [
    'title',
    'header',
    'controls',
    'tabs',
    'fieldSet',
    'submitText',
    'initFetch',
    'wrapWithPanel',
    'mode',
    'columnCount',
    'collapsable',
    'horizontal',
    'panelClassName',
    'messages',
    'wrapperComponent',
    'resetAfterSubmit',
    'clearAfterSubmit',
    'submitOnInit',
    'submitOnChange',
    'onInit',
    'onReset',
    'onSubmit',
    'onChange',
    'onFailed',
    'onFinished',
    'onValidate',
    'onValidChange',
    'onSaved',
    'canAccessSuperData',
    'lazyChange',
    'formLazyChange',
    'lazyLoad',
    'formInited',
    'simpleMode',
    'inputOnly',
    'value',
    'actions',
    'multiple'
  ];

  hooks: {
    [propName: string]: Array<(...args: any) => Promise<any>>;
  } = {};
  asyncCancel: () => void;
  toDispose: Array<() => void> = [];
  shouldLoadInitApi: boolean = false;
  timer: ReturnType<typeof setTimeout>;
  mounted: boolean;
  lazyEmitChange = debouce(this.emitChange.bind(this), 250, {
    trailing: true,
    leading: false
  });
  unBlockRouting?: () => void;
  constructor(props: FormProps) {
    super(props);

    this.onInit = this.onInit.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.handleQuery = this.handleQuery.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDialogConfirm = this.handleDialogConfirm.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleDrawerConfirm = this.handleDrawerConfirm.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.validate = this.validate.bind(this);
    this.submit = this.submit.bind(this);
    this.addHook = this.addHook.bind(this);
    this.removeHook = this.removeHook.bind(this);
    this.emitChange = this.emitChange.bind(this);
    this.handleBulkChange = this.handleBulkChange.bind(this);
    this.renderFormItems = this.renderFormItems.bind(this);
    this.reload = this.reload.bind(this);
    this.silentReload = this.silentReload.bind(this);
    this.initInterval = this.initInterval.bind(this);
    this.dispatchInited = this.dispatchInited.bind(this);
    this.blockRouting = this.blockRouting.bind(this);
    this.beforePageUnload = this.beforePageUnload.bind(this);
    this.formItemDispatchEvent = this.formItemDispatchEvent.bind(this);
    this.flush = this.flush.bind(this);

    const {store, canAccessSuperData, persistData, simpleMode, formLazyChange} =
      props;

    store.setCanAccessSuperData(canAccessSuperData !== false);
    store.setPersistData(persistData);

    if (simpleMode) {
      store.setInited(true);
    }

    if (
      store &&
      store.parentStore &&
      store.parentStore.storeType === 'ComboStore'
    ) {
      const combo = store.parentStore as IComboStore;
      combo.addForm(store);
      combo.forms.forEach(form =>
        form.items.forEach(
          item => item.unique && item.syncOptions(undefined, form.data)
        )
      );
    }

    // withStore will synchronize with the upper layer data
    // At this time, the changed data is not synchronized with onChange, resulting in data inconsistency.
    // https://github.com/baidu/amis/issues/8773
    this.toDispose.push(
      reaction(
        () => store.initedAt,
        () => {
          store.inited &&
            (formLazyChange === false ? this.emitChange : this.lazyEmitChange)(
              !!this.props.submitOnChange,
              true
            );
        }
      )
    );
  }

  componentDidMount() {
    const {
      initApi,
      initFetch,
      initFetchOn,
      initAsyncApi,
      initFinishedField,
      initCheckInterval,
      store,
      messages: {fetchSuccess, fetchFailed},
      onValidate,
      onValidChange,
      promptPageLeave,
      env
    } = this.props;
    const rules = this.getNormalizedRules();
    this.mounted = true;

    if (onValidate) {
      const finalValidate = promisify(onValidate);
      this.toDispose.push(
        this.addHook(async () => {
          const result = await finalValidate(store.data, store);

          if (result && isObject(result)) {
            Object.keys(result).forEach(key => {
              let msg = result[key];
              const items = store.getItemsByPath(key);

              // Not found
              if (!Array.isArray(items) || !items.length) {
                return;
              }

              // Before setError, clear the remaining error information in advance, otherwise the error will be appended every time after onValidate
              items.forEach(item => item.clearError());

              if (msg) {
                msg = Array.isArray(msg) ? msg : [msg];
                items.forEach(item => item.addError(msg));
              }

              delete result[key];
            });

            isEmpty(result)
              ? store.clearRestError()
              : store.setRestError(Object.keys(result).map(key => result[key]));
          }
        })
      );
    }

    // When the form validation result changes, trigger onValidChange
    if (onValidChange) {
      this.toDispose.push(
        reaction(
          () => store.valid,
          valid => onValidChange(valid, this.props)
        )
      );
    }

    if (rules.length) {
      this.toDispose.push(
        this.addHook(() => {
          if (!store.valid) {
            return;
          }

          rules.forEach(
            item =>
              !evalExpression(item.rule, store.data) &&
              store.addRestError(item.message, item.name)
          );
        })
      );
    }

    if (isEffectiveApi(initApi, store.data, initFetch, initFetchOn)) {
      store
        .fetchInitData(initApi as any, store.data, {
          successMessage: fetchSuccess,
          errorMessage: fetchFailed,
          onSuccess: (json: Payload, data: any) => {
            store.setValues(data, undefined, undefined, undefined, {
              type: 'api'
            });

            if (
              !isEffectiveApi(initAsyncApi, store.data) ||
              store.data[initFinishedField || 'finished']
            ) {
              return;
            }

            return until(
              () => store.checkRemote(initAsyncApi, store.data),
              (ret: any) => ret && ret[initFinishedField || 'finished'],
              cancel => (this.asyncCancel = cancel),
              initCheckInterval
            );
          }
        })
        .then(this.initInterval)
        .then(this.onInit);
    } else {
      setTimeout(this.onInit.bind(this), 4);
    }

    if (promptPageLeave) {
      window.addEventListener('beforeunload', this.beforePageUnload);
      this.unBlockRouting = env.blockRouting?.(this.blockRouting) ?? undefined;
    }
  }

  componentDidUpdate(prevProps: FormProps) {
    const props = this.props;
    const store = props.store;

    if (
      isApiOutdated(
        prevProps.initApi,
        props.initApi,
        prevProps.data,
        props.data
      )
    ) {
      const {fetchSuccess, fetchFailed} = props;

      store[store.hasRemoteData ? 'fetchData' : 'fetchInitData'](
        props.initApi as Api,
        store.data,
        {
          successMessage: fetchSuccess,
          errorMessage: fetchFailed
        }
      )
        .then(this.initInterval)
        .then(this.dispatchInited);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    clearTimeout(this.timer);
    // this.lazyHandleChange.flush();
    this.lazyEmitChange.cancel();
    this.asyncCancel && this.asyncCancel();
    this.toDispose.forEach(fn => fn());
    this.toDispose = [];
    window.removeEventListener('beforeunload', this.beforePageUnload);
    this.unBlockRouting?.();
  }

  /** Get the rules for form joint validation */
  getNormalizedRules() {
    const {rules, translate: __} = this.props;

    if (!Array.isArray(rules) || rules.length < 1) {
      return [];
    }

    return rules
      .map(item => ({
        ...item,
        ...(!item.message || typeof item.message !== 'string'
          ? {message: __('Form.rules.message')}
          : {})
      }))
      .filter(item => item.rule && typeof item.rule === 'string');
  }

  async dispatchInited(value: any) {
    const {data, store, dispatchEvent} = this.props;

    if (!isAlive(store) || store.fetching) {
      return value;
    }

    //Dispatching init event, the parameter is initialization data
    const result = await dispatchEvent(
      'inited',
      createObject(data, {
        ...value?.data, // Preserve, compatible with history
        responseData: value?.data ?? {},
        responseStatus: store.error ? 1 : 0,
        responseMsg: store.msg
      })
    );

    return result;
  }

  blockRouting(): any {
    const store = this.props.store;
    const {promptPageLeaveMessage, promptPageLeave} = this.props;

    if (promptPageLeave && store.modified) {
      return (
        promptPageLeaveMessage ||
        'The new changes have not been saved. Confirm to exit.？'
      );
    }
  }

  beforePageUnload(e: any): any {
    const blocked = this.blockRouting();

    if (blocked) {
      e.preventDefault();
      e.returnValue = '';
    }
  }

  async onInit() {
    const {onInit, store, persistData, submitOnInit, dispatchEvent} =
      this.props;
    if (!isAlive(store)) {
      return;
    }

    // First take out the data, mainly because I am worried that the form has been tampered with by something and then applied
    // I encountered a problem before, so I took it out. But the default value of options loadOptions is invalid.
    // So now you need to set both, and then in the init Hook.
    let data = cloneObject(store.data);
    const initedAt = store.initedAt;

    store.setInited(true);
    const hooks = this.hooks['init'] || [];
    const groupedHooks = groupBy(hooks, item =>
      (item as any).__enforce === 'prev'
        ? 'prev'
        : (item as any).__enforce === 'post'
        ? 'post'
        : 'normal'
    );

    await Promise.all((groupedHooks.prev || []).map(hook => hook(data)));
    // It is possible that the hook was deleted in the previous step, so you need to re-verify
    await Promise.all(
      (groupedHooks.normal || []).map(
        hook => hooks.includes(hook) && hook(data)
      )
    );
    await Promise.all(
      (groupedHooks.post || []).map(hook => hooks.includes(hook) && hook(data))
    );

    if (!isAlive(store)) {
      return;
    }

    if (store.initedAt !== initedAt) {
      // Indicates that the previous data is invalid.
      // For example, combo sets the initial value at the beginning, and then the initApi of form returns a new value.
      // At this time, the store data should have been inited with the new value. But the data is still old, so
      // onInit is wrong.
      data = {
        ...data,
        ...store.data
      };
    }

    if (persistData) {
      store.getLocalPersistData();
      data = cloneObject(store.data);
    }

    onInit && onInit(data, this.props);

    // Dispatching initialization events
    const dispatch = await this.dispatchInited({data});

    if (dispatch?.prevented) {
      return;
    }

    // submitOnInit
    submitOnInit &&
      this.handleAction(
        undefined,
        {
          type: 'submit'
        },
        store.data
      );
  }

  async reload(
    subPath?: string,
    query?: any,
    ctx?: any,
    silent?: boolean
  ): Promise<any> {
    if (query) {
      return this.receive(query);
    }

    const {
      store,
      initApi,
      initAsyncApi,
      initFinishedField,
      messages: {fetchSuccess, fetchFailed}
    } = this.props;

    isEffectiveApi(initAsyncApi, store.data) &&
      store.updateData({
        [initFinishedField || 'finished']: false
      });

    let result: Payload | undefined = undefined;

    if (isEffectiveApi(initApi, store.data)) {
      result = await store.fetchInitData(initApi, store.data, {
        successMessage: fetchSuccess,
        errorMessage: fetchFailed,
        silent,
        onSuccess: (json: Payload, data: any) => {
          store.setValues(data);

          if (
            !isEffectiveApi(initAsyncApi, store.data) ||
            store.data[initFinishedField || 'finished']
          ) {
            return;
          }

          return until(
            () => store.checkRemote(initAsyncApi, store.data),
            (ret: any) => ret && ret[initFinishedField || 'finished'],
            cancel => (this.asyncCancel = cancel)
          );
        }
      });

      if (result?.ok) {
        this.initInterval(result);
        store.reset(undefined, false);
      }
    } else {
      store.reset(undefined, false);
    }

    //Dispatching the initialization interface request completion event
    this.dispatchInited(result);
    return store.data;
  }

  receive(values: object, name?: string, replace?: boolean) {
    const {store} = this.props;

    store.updateData(values, undefined, replace);
    return this.reload();
  }

  silentReload(target?: string, query?: any) {
    return this.reload(target, query, undefined, true);
  }

  initInterval(value: any) {
    const {interval, silentPolling, stopAutoRefreshWhen, data} = this.props;

    clearTimeout(this.timer);
    value?.ok &&
      interval &&
      this.mounted &&
      (!stopAutoRefreshWhen || !evalExpression(stopAutoRefreshWhen, data)) &&
      (this.timer = setTimeout(
        silentPolling ? this.silentReload : this.reload,
        Math.max(interval, 1000)
      ));
    return value;
  }

  isValidated() {
    return this.props.store.validated;
  }

  async validate(
    forceValidate?: boolean,
    throwErrors: boolean = false,
    toastErrors: boolean = true,
    skipFlush = false
  ): Promise<boolean> {
    const {store, dispatchEvent, data, messages, translate: __} = this.props;

    if (!skipFlush) {
      await this.flush();
    }
    const result = await store.validate(
      this.hooks['validate'] || [],
      forceValidate,
      throwErrors,
      toastErrors === false
        ? ''
        : typeof messages?.validateFailed === 'string'
        ? __(filter(messages.validateFailed, store.data))
        : undefined
    );

    dispatchEvent(result ? 'validateSucc' : 'validateError', data);
    return result;
  }

  setErrors(errors: {[propName: string]: string}, tag = 'remote') {
    const {store} = this.props;
    store.setFormItemErrors(errors, tag);
  }

  clearErrors() {
    const {store} = this.props;

    return store.clearErrors();
  }

  getValues() {
    const {store} = this.props;
    this.flush();
    return store.data;
  }

  setValues(value: any, replace?: boolean) {
    const {store} = this.props;
    this.flush();
    store.setValues(value, undefined, replace, undefined, {
      type: 'action'
    });
  }

  async submit(
    fn?: (values: object) => Promise<any>,
    throwErrors: boolean = false,
    skipFlush = false
  ): Promise<any> {
    const {store, messages, translate: __, dispatchEvent, data} = this.props;
    if (!skipFlush) {
      await this.flush();
    }
    const validateErrCb = () => dispatchEvent('validateError', data);
    return store.submit(
      fn,
      this.hooks['validate'] || [],
      typeof messages?.validateFailed === 'string'
        ? __(filter(messages.validateFailed, store.data))
        : undefined,
      validateErrCb,
      throwErrors
    );
  }

  // If lazyChange is enabled, a flush method is required to apply the value in the queue.
  flushing = false;
  async flush() {
    try {
      if (this.flushing) {
        return;
      }

      this.flushing = true;
      const hooks = this.hooks['flush'] || [];
      // Must be in order, some may depend on the result of the previous one
      for (let hook of hooks) {
        await hook();
      }
      if (!this.emitting) {
        await this.lazyEmitChange.flush();
      }
    } finally {
      this.flushing = false;
    }
  }

  reset() {
    const {store, onReset} = this.props;
    store.reset(onReset);
  }

  addHook(
    fn: () => any,
    type: 'validate' | 'init' | 'flush' = 'validate',
    enforce?: 'prev' | 'post'
  ) {
    this.hooks[type] = this.hooks[type] || [];
    const hook = type === 'flush' ? fn : promisify(fn);
    (hook as any).__enforce = enforce;
    this.hooks[type].push(hook);
    return () => {
      this.removeHook(fn, type);
      fn = noop;
    };
  }

  removeHook(fn: () => any, type: string = 'validate') {
    const hooks = this.hooks[type];

    if (!hooks) {
      return;
    }

    for (let i = 0, len = hooks.length; i < len; i++) {
      let hook = hooks[i];

      if (hook === fn || (hook as any).raw === fn) {
        hooks.splice(i, 1);
        len--;
        i--;
      }
    }
  }

  handleChange(
    value: any,
    name: string,
    submit: boolean,
    changePristine = false,
    changeReason?: DataChangeReason
  ) {
    const {store, formLazyChange, persistDataKeys} = this.props;
    if (typeof name !== 'string') {
      return;
    }
    store.changeValue(
      name,
      value,
      changePristine,
      undefined,
      undefined,
      changeReason || {
        type: 'input'
      }
    );
    if (!changePristine || typeof value !== 'undefined') {
      (formLazyChange === false ? this.emitChange : this.lazyEmitChange)(
        submit
      );
    }

    if (store.persistData && store.inited) {
      store.setLocalPersistData(persistDataKeys);
    }
  }
  formItemDispatchEvent(type: string, data: any) {
    const {dispatchEvent} = this.props;
    return dispatchEvent(type, data);
  }

  emittedData: any = null;
  emitting = false;
  async emitChange(submit: boolean, emitedFromWatch: boolean = false) {
    try {
      this.emitting = true;

      const {onChange, store, submitOnChange, dispatchEvent, data, originData} =
        this.props;

      if (!isAlive(store)) {
        return;
      }

      const diff = difference(store.data, originData ?? store.upStreamData);
      if (
        emitedFromWatch &&
        (!Object.keys(diff).length || isEqual(store.data, this.emittedData))
      ) {
        return;
      }

      this.emittedData = store.data;
      // Prepare the parameters for onChange in advance.
      // Because store.data will be changed by store.initData in WithStore.componentDidUpdate during await. Causes data loss
      const changeProps = [store.data, diff, this.props];
      const dispatcher = await dispatchEvent(
        'change',
        createObject(data, store.data)
      );
      if (!dispatcher?.prevented) {
        onChange && onChange.apply(null, changeProps);
      }

      isAlive(store) && store.clearRestError();

      // Only changes triggered by active modification of form items will trigger submit
      if (!emitedFromWatch && (submit || (submitOnChange && store.inited))) {
        await this.handleAction(
          undefined,
          {
            type: 'submit',
            // If this is not skipped, there will be a dead loop of mutual dependence, and flush will make emiteChange execute immediately
            // flush will be called again in handleAction
            skipFormFlush: true
          },
          store.data
        );
      }
    } finally {
      this.emitting = false;
    }
  }

  handleBulkChange(
    values: Object,
    submit: boolean,
    changeReason?: DataChangeReason
  ) {
    const {onChange, store, formLazyChange} = this.props;
    store.setValues(
      values,
      undefined,
      undefined,
      undefined,
      changeReason || {
        type: 'input'
      }
    );
    // store.updateData(values);

    // store.items.forEach(formItem => {
    //   const updatedValue = getVariable(values, formItem.name, false);

    // if (updatedValue !== undefined) {
    // // Update the validation status but keep the error message
    // formItem.reset(true);
    // // You need to update the value here, otherwise the new field value will not be used for validation when submitting
    //     formItem.changeTmpValue(updatedValue);
    //     formItem.validateOnChange && formItem.validate(values);
    //   }
    // });
    (formLazyChange === false ? this.emitChange : this.lazyEmitChange)(submit);
  }

  handleFormSubmit(e: React.UIEvent<any>) {
    const {preventEnterSubmit, onActionSensor, close} = this.props;

    e.preventDefault();
    if (preventEnterSubmit) {
      return false;
    }

    const sensor: any = this.handleAction(
      e,
      {
        type: 'submit',
        close
      },
      this.props.store.data
    );

    // Allow the outer layer to monitor the execution result of this action
    onActionSensor?.(sensor);
    return sensor;
  }

  handleReset(action: any) {
    const {onReset} = this.props;

    return (data: any) => {
      onReset && onReset(data, action);
    };
  }

  async handleAction(
    e: React.UIEvent<any> | void,
    action: ActionObject,
    data: object,
    throwErrors: boolean = false,
    delegate?: IScopedContext
  ): Promise<any> {
    const {
      store,
      onSubmit,
      api,
      asyncApi,
      finishedField,
      checkInterval,
      messages: {saveSuccess, saveFailed},
      resetAfterSubmit,
      clearAfterSubmit,
      onAction,
      onSaved,
      onReset,
      onFinished,
      onFailed,
      redirect,
      reload,
      target,
      env,
      onChange,
      clearPersistDataAfterSubmit,
      trimValues,
      dispatchEvent,
      translate: __
    } = this.props;

    // Before taking action, synchronize the data.
    if (!action.skipFormFlush) {
      await this.flush();
    }

    if (!isAlive(store)) {
      return;
    }

    if (trimValues) {
      store.trimValues();
    }

    // If data is the current layer, flush it.
    if (data === this.props.data) {
      data = store.data;
    }

    if (Array.isArray(action.required) && action.required.length) {
      /** If the button specifies required, clear the remaining validation errors before validation */
      store.clearErrors();

      const fields = action.required.map(item => ({
        name: item,
        rules: {isRequired: true}
      }));
      const validationRes = await store.validateFields(fields);

      if (!validationRes) {
        const dispatcher = await dispatchEvent(
          'validateError',
          this.props.data
        );
        if (!dispatcher?.prevented) {
          env.notify('error', __('Form.validateFailed'));
        }

        /** Throwing an exception is to catch this error in the dialog to avoid the pop-up window from closing directly */
        return Promise.reject(__('Form.validateFailed'));
      } else {
        /** Reset the validated state to ensure that the validation items in the form are triggered when submitting */
        store.clearErrors();
      }
    }
    if (
      action.type === 'submit' ||
      action.actionType === 'submit' ||
      action.actionType === 'confirm' ||
      action.actionType === 'reset-and-submit' ||
      action.actionType === 'clear-and-submit'
    ) {
      // The submit event is configured to delegate all submission logic to the event
      const {dispatchEvent, onEvent} = this.props;
      const submitEvent = onEvent?.submit?.actions?.length;
      const dispatcher = await dispatchEvent('submit', this.props.data);
      if (dispatcher?.prevented || submitEvent) {
        return;
      }

      store.setCurrentAction(action, this.props.resolveDefinitions);

      if (action.actionType === 'reset-and-submit') {
        store.reset(this.handleReset(action));
      } else if (action.actionType === 'clear-and-submit') {
        store.clear(this.handleReset(action));
      }

      return this.submit(
        async values => {
          if (onSubmit) {
            const result = await onSubmit(values, action);
            if (result === false) {
              return Promise.resolve(false);
            }
          }

          // Going here means the validation is successful
          dispatchEvent('validateSucc', createObject(this.props.data, values));

          if (target) {
            this.submitToTarget(filterTarget(target, values), values);
            /** You may configure a page jump event. The page route change may cause the persistKey to be inconsistent and the persistent data cannot be cleared. Therefore, clean it up before submitting the success event */
            clearPersistDataAfterSubmit && store.clearLocalPersistData();
            dispatchEvent('submitSucc', createObject(this.props.data, values));
          } else if (action.actionType === 'reload') {
            action.target &&
              this.reloadTarget(filterTarget(action.target, values), values);
          } else if (action.actionType === 'dialog') {
            return new Promise<any>(resolve => {
              store.openDialog(
                data,
                undefined,
                (confirmed: any, value: any) => {
                  action.callback?.(confirmed, value);
                  resolve({
                    confirmed,
                    value
                  });
                },
                delegate || (this.context as any)
              );
            });
          } else if (action.actionType === 'drawer') {
            return new Promise<any>(resolve => {
              store.openDrawer(
                data,
                undefined,
                (confirmed: any, value: any) => {
                  action.callback?.(confirmed, value);
                  resolve({
                    confirmed,
                    value
                  });
                }
              );
            });
          } else if (isEffectiveApi(action.api || api, values)) {
            let finnalAsyncApi = action.asyncApi || asyncApi;
            isEffectiveApi(finnalAsyncApi, store.data) &&
              store.updateData({
                [finishedField || 'finished']: false
              });

            return store
              .saveRemote(action.api || (api as Api), values, {
                successMessage:
                  typeof saveSuccess === 'string'
                    ? filter(saveSuccess, store.data)
                    : undefined,
                errorMessage:
                  typeof saveFailed === 'string'
                    ? filter(saveFailed, store.data)
                    : undefined,
                onSuccess: async (result: Payload) => {
                  clearPersistDataAfterSubmit && store.clearLocalPersistData();
                  // Result is the content returned by the submission interface
                  const dispatcher = await dispatchEvent(
                    'submitSucc',
                    createObject(this.props.data, {result})
                  );
                  if (
                    !isEffectiveApi(finnalAsyncApi, store.data) ||
                    store.data[finishedField || 'finished']
                  ) {
                    return {
                      cbResult: null,
                      dispatcher
                    };
                  }
                  const cbResult = until(
                    () => store.checkRemote(finnalAsyncApi as Api, store.data),
                    (ret: any) => ret && ret[finishedField || 'finished'],
                    cancel => (this.asyncCancel = cancel),
                    checkInterval
                  ).then((value: any) => {
                    // Dispatching asyncApiFinished event
                    dispatchEvent('asyncApiFinished', store.data);
                  });
                  return {
                    cbResult,
                    dispatcher
                  };
                },
                onFailed: async (result: Payload) => {
                  const dispatcher = await dispatchEvent(
                    'submitFail',
                    createObject(this.props.data, {error: result})
                  );
                  return {
                    dispatcher
                  };
                }
              })
              .then(async response => {
                onSaved && onSaved(values, response);
                const feedback = action.feedback || this.props.feedback;

                // submit also supports feedback
                if (feedback && isVisible(feedback, store.data)) {
                  const confirmed = await this.openFeedback(
                    feedback,
                    store.data
                  );

                  // If feedback is configured, cancel and skip the original logic.
                  if (feedback.skipRestOnCancel && !confirmed) {
                    throw new SkipOperation();
                  } else if (feedback.skipRestOnConfirm && confirmed) {
                    throw new SkipOperation();
                  }
                }

                return injectObjectChain(store.data, {
                  __payload: values,
                  __response: response
                });
              });
          } else if (shouldBlockedBySendOnApi(action.api || api, values)) {
            // When the api exists but does not meet sendOn, go here and do not dispatch the submitSucc event
            return;
          } else {
            clearPersistDataAfterSubmit && store.clearLocalPersistData();
            // When type is submit, but there is no api and target, only dispatch events
            dispatchEvent('submitSucc', createObject(this.props.data, values));
          }

          return Promise.resolve(null);
        },
        throwErrors,
        true
      )
        .then(values => {
          // It is possible that onSubmit return false, then the following should not be executed.
          if (values === false) {
            return store.data;
          }

          if (onFinished && onFinished(values, action, store) === false) {
            return values;
          }

          resetAfterSubmit && store.reset(this.handleReset(action));
          clearAfterSubmit && store.clear(this.handleReset(action));
          clearPersistDataAfterSubmit && store.clearLocalPersistData();

          if (action.redirect || redirect) {
            const finalRedirect = filter(
              action.redirect || redirect,
              store.data
            );
            finalRedirect && env.jumpTo(finalRedirect, action, store.data);
          } else if (action.reload || reload) {
            this.reloadTarget(
              filterTarget(action.reload || reload!, store.data),
              store.data
            );
          }

          action.close && this.closeTarget(action.close);
          return values;
        })
        .catch(reason => {
          onFailed && onFailed(reason, store.errors);

          if (throwErrors) {
            throw reason;
          }
        });
    } else if (action.type === 'reset' || action.actionType === 'reset') {
      store.setCurrentAction(action, this.props.resolveDefinitions);
      store.reset(onReset);
    } else if (action.actionType === 'clear') {
      store.setCurrentAction(action, this.props.resolveDefinitions);
      store.clear(onReset);
    } else if (action.actionType === 'validate') {
      store.setCurrentAction(action, this.props.resolveDefinitions);
      return this.validate(true, throwErrors, true, true);
    } else if (action.actionType === 'dialog') {
      store.setCurrentAction(action, this.props.resolveDefinitions);
      return new Promise<any>(resolve => {
        store.openDialog(
          data,
          undefined,
          (confirmed: any, value: any) => {
            action.callback?.(confirmed, value);
            resolve({
              confirmed,
              value
            });
          },
          delegate || (this.context as any)
        );
      });
    } else if (action.actionType === 'drawer') {
      store.setCurrentAction(action, this.props.resolveDefinitions);
      return new Promise<any>(resolve => {
        store.openDrawer(data, undefined, (confirmed: any, value: any) => {
          action.callback?.(confirmed, value);
          resolve({
            confirmed,
            value
          });
        });
      });
    } else if (action.actionType === 'ajax') {
      store.setCurrentAction(action, this.props.resolveDefinitions);
      if (!isEffectiveApi(action.api)) {
        return env.alert(__(`当 actionType 为 ajax 时，请设置 api Properties`));
      }
      let successMsg =
        (action.messages && action.messages.success) || saveSuccess;
      let failMsg = (action.messages && action.messages.failed) || saveFailed;

      return store
        .saveRemote(action.api as Api, data, {
          successMessage: __(
            typeof successMsg === 'string'
              ? filter(successMsg, store.data)
              : undefined
          ),
          errorMessage: __(
            typeof failMsg === 'string'
              ? filter(failMsg, store.data)
              : undefined
          )
        })
        .then(async response => {
          response &&
            onChange &&
            onChange(
              store.data,
              difference(store.data, store.pristine),
              this.props
            );
          if (store.validated) {
            await this.validate(true);
          }

          if (action.feedback && isVisible(action.feedback, store.data)) {
            await this.openFeedback(action.feedback, store.data);
          }

          const redirect =
            action.redirect && filter(action.redirect, store.data);
          redirect && env.jumpTo(redirect, action, store.data);

          action.reload &&
            this.reloadTarget(
              filterTarget(action.reload, store.data),
              store.data
            );
          action.close && this.closeTarget(action.close);
        })
        .catch(e => {
          onFailed && onFailed(e, store.errors);
          if (throwErrors || action.countDown) {
            throw e;
          }
        });
    } else if (action.actionType === 'reload') {
      store.setCurrentAction(action, this.props.resolveDefinitions);
      if (action.target) {
        this.reloadTarget(filterTarget(action.target, data), data);
      } else {
        this.receive(data);
      }
      // action.target && this.reloadTarget(filterTarget(action.target, data), data);
    } else if (onAction) {
      //Throw unrecognized ones to the upper layer for processing.
      return onAction(e, action, data, throwErrors, delegate || this.context);
    }
  }

  handleQuery(query: any) {
    if (this.props.initApi) {
      //If it is a paging action, check if it is useful in the interface, if not, return false
      //Let the component sort itself
      if (
        query?.hasOwnProperty('orderBy') &&
        !isApiOutdated(
          this.props.initApi,
          this.props.initApi,
          this.props.store.data,
          createObject(this.props.store.data, query)
        )
      ) {
        return false;
      }

      this.receive(query);
      return;
    }

    if (this.props.onQuery) {
      return this.props.onQuery(query);
    } else {
      return false;
    }
  }

  handleDialogConfirm(
    values: object[],
    action: ActionObject,
    ctx: any,
    targets: Array<any>
  ) {
    const {store, onChange} = this.props;

    if (
      (action.mergeData || store.action.mergeData) &&
      values.length === 1 &&
      values[0] &&
      targets[0].props.type === 'form'
    ) {
      this.handleBulkChange(values[0], false);
    }

    store.closeDialog(true, values);
  }

  handleDialogClose(confirmed = false) {
    const {store} = this.props;
    store.closeDialog(confirmed);
  }

  handleDrawerConfirm(
    values: object[],
    action: ActionObject,
    ctx: any,
    targets: Array<any>
  ) {
    const {store, onChange} = this.props;

    if (
      (action.mergeData || store.action.mergeData) &&
      values.length === 1 &&
      values[0] &&
      targets[0].props.type === 'form'
    ) {
      store.updateData(values[0]);
      onChange &&
        onChange(
          store.data,
          difference(store.data, store.pristine),
          this.props
        );
    }

    store.closeDrawer(true, values);
  }

  handleDrawerClose() {
    const {store} = this.props;
    store.closeDrawer(false);
  }

  submitToTarget(target: string, values: object) {
    // will be overwritten
  }

  reloadTarget(target: string, data?: any) {
    // will be overwritten
  }

  closeTarget(target: string) {
    // will be overwritten
  }

  openFeedback(dialog: any, ctx: any) {
    return new Promise(resolve => {
      const {store} = this.props;
      store.setCurrentAction(
        {
          type: 'button',
          actionType: 'dialog',
          dialog: dialog
        },
        this.props.resolveDefinitions
      );
      store.openDialog(
        ctx,
        undefined,
        confirmed => {
          resolve(confirmed);
        },
        this.context as any
      );
    });
  }

  buildActions() {
    const {
      actions,
      submitText,
      body,
      translate: __,
      loadingConfig
    } = this.props;

    if (
      typeof actions !== 'undefined' ||
      !submitText ||
      (Array.isArray(body) &&
        body.some(
          item =>
            item &&
            !!~['submit', 'button', 'button-group', 'reset'].indexOf(
              (item as any)?.body?.[0]?.type ||
                (item as any)?.body?.type ||
                (item as any).type
            )
        ))
    ) {
      return actions;
    }

    return [
      {
        type: 'submit',
        label: __(submitText),
        primary: true,
        loadingConfig
      }
    ];
  }

  renderFormItems(
    schema: Partial<FormSchemaBase> & {
      controls?: Array<any>;
    },
    region: string = '',
    otherProps: Partial<FormProps> = {}
  ): React.ReactNode {
    let body: Array<any> = Array.isArray(schema.body)
      ? schema.body
      : schema.body
      ? [schema.body]
      : [];

    // Old usage, let wrapper go through compat logic compatible with old usage
    // Can be deleted later.
    if (!body.length && schema.controls) {
      console.warn('请用 body 代替 controls');
      body = [
        {
          size: 'none',
          type: 'wrapper',
          wrap: false,
          controls: schema.controls
        }
      ];
    }

    return this.renderChildren(body, region, otherProps);
  }

  renderChildren(
    children: Array<any>,
    region: string,
    otherProps: Partial<FormProps> = {}
  ): React.ReactNode {
    children = children || [];
    const {classnames: cx} = this.props;

    if (!Array.isArray(children)) {
      children = [children];
    }

    if (this.props.mode === 'row') {
      const ns = this.props.classPrefix;

      children = flatten(children).filter(item => {
        if ((item as Schema).hidden || (item as Schema).visible === false) {
          return false;
        }

        const exprProps = getExprProperties(
          item as Schema,
          this.props.store.data,
          undefined,
          this.props
        );
        if (exprProps.hidden || exprProps.visible === false) {
          return false;
        }

        return true;
      });

      if (!children.length) {
        return null;
      }

      return (
        <div className={cx('Form-row')}>
          {children.map((control, key) => {
            const split = control.colSize?.split('/');
            const colSize =
              split?.[0] && split?.[1]
                ? (split[0] / split[1]) * 100 + '%'
                : control.colSize;
            return ~['hidden', 'formula'].indexOf((control as any).type) ||
              (control as any).mode === 'inline' ? (
              this.renderChild(control, key, otherProps)
            ) : (
              <div
                key={key}
                className={cx(`Form-col`, (control as Schema).columnClassName)}
                style={{
                  flex:
                    colSize && !['1', 'auto'].includes(colSize)
                      ? `0 0 ${colSize}`
                      : '1'
                }}
              >
                {this.renderChild(control, '', {
                  ...otherProps,
                  mode: 'row'
                })}
              </div>
            );
          })}
        </div>
      );
    }

    if (this.props.mode === 'flex') {
      let rows: any = [];
      children.forEach(child => {
        if (typeof child.row === 'number') {
          if (rows[child.row]) {
            rows[child.row].push(child);
          } else {
            rows[child.row] = [child];
          }
        } else {
          // If there is no row, just start a single row
          rows.push([child]);
        }
      });
      return (
        <>
          {rows.map((children: any, index: number) => {
            return (
              <div className={cx('Form-flex')} role="flex-row" key={index}>
                {children.map((control: any, key: number) => {
                  const split = control.colSize?.split('/');
                  const colSize =
                    split?.[0] && split?.[1]
                      ? (split[0] / split[1]) * 100 + '%'
                      : control.colSize;
                  return ~['hidden', 'formula'].indexOf(
                    (control as any).type
                  ) ? (
                    this.renderChild(control, key, otherProps)
                  ) : (
                    <div
                      key={control.id || key}
                      className={cx(
                        `Form-flex-col`,
                        (control as Schema).columnClassName
                      )}
                      style={{
                        flex:
                          colSize && !['1', 'auto'].includes(colSize)
                            ? `0 0 ${colSize}`
                            : ''
                      }}
                      role="flex-col"
                    >
                      {this.renderChild(control, '', {
                        ...otherProps,
                        mode: 'flex'
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </>
      );
    }
    return children.map((control, key) =>
      this.renderChild(control, key, otherProps, region)
    );
  }

  renderChild(
    control: SchemaNode,
    key: any = '',
    otherProps: Partial<FormProps> = {},
    region: string = ''
  ): React.ReactNode {
    if (!control) {
      return null;
    } else if (typeof control === 'string') {
      control = {
        type: 'tpl',
        tpl: control
      };
    }

    const props = {
      ...this.props,
      ...otherProps
    };
    const form = this.props.store;
    const {
      render,
      mode,
      horizontal,
      store,
      disabled,
      controlWidth,
      resolveDefinitions,
      lazyChange,
      formLazyChange,
      dispatchEvent,
      labelAlign,
      labelWidth,
      static: isStatic,
      canAccessSuperData
    } = props;

    const subProps = {
      formStore: form,
      data: store.data,
      key: `${(control as Schema).name || ''}-${
        (control as Schema).type
      }-${key}`,
      formInited: form.inited,
      formSubmited: form.submited,
      formMode: mode,
      formHorizontal: horizontal,
      formLabelAlign:
        !labelAlign || !['left', 'right', 'top'].includes(labelAlign)
          ? 'right'
          : labelAlign,
      formLabelWidth: labelWidth,
      controlWidth,
      /**
       * The disabled attribute is sent only when form.loading is true, otherwise the disabled attribute is not explicitly set to false
       * When the Form contains container components, these components will continue to send the disabled attribute here to the child components, causing props.disabled in SchemaRenderer to overwrite schema.disabled
       */
      disabled:
        disabled ||
        (control as Schema).disabled ||
        (form.loading ? true : undefined),
      btnDisabled: disabled || form.loading || form.validating,
      onAction: this.handleAction,
      onQuery: this.handleQuery,
      onChange: this.handleChange,
      onBulkChange: this.handleBulkChange,
      addHook: this.addHook,
      removeHook: this.removeHook,
      renderFormItems: this.renderFormItems,
      formItemDispatchEvent: this.formItemDispatchEvent,
      formPristine: form.pristine,
      onFlushForm: this.flush
      // value: (control as any)?.name
      //   ? getVariable(form.data, (control as any)?.name, canAccessSuperData)
      //   : (control as any)?.value,
      // defaultValue: (control as any)?.value
    };

    let subSchema: any = {
      ...control
    };

    if (subSchema.$ref) {
      subSchema = {
        ...resolveDefinitions(subSchema.$ref),
        ...subSchema
      };
    }

    lazyChange === false && (subSchema.changeImmediately = true);
    return render(`${region ? `${region}/` : ''}${key}`, subSchema, subProps);
  }

  renderBody() {
    const {
      body,
      mode,
      className,
      classnames: cx,
      debug,
      debugConfig,
      $path,
      store,
      columnCount,
      render,
      staticClassName,
      static: isStatic = false,
      loadingConfig,
      themeCss,
      id,
      wrapperCustomStyle,
      env,
      wrapWithPanel,
      testid
    } = this.props;

    const {restError} = store;

    const WrapperComponent =
      this.props.wrapperComponent ||
      (/(?:\/|^)form\//.test($path as string) ? 'div' : 'form');

    const padDom = repeatCount(
      columnCount && Array.isArray(body)
        ? (columnCount - (body.length % columnCount)) % columnCount
        : 0,
      index => (
        <div
          className={cx(`Form-item Form-item--${mode} is-placeholder`)}
          key={index}
        ></div>
      )
    );

    return (
      <WrapperComponent
        className={cx(
          `Form`,
          `Form--${mode || 'normal'}`,
          columnCount ? `Form--column Form--column-${columnCount}` : null,
          staticClassName && isStatic ? staticClassName : className,
          isStatic ? 'Form--isStatic' : null,
          setThemeClassName({
            ...this.props,
            name: [
              'formControlClassName',
              'itemClassName',
              'staticClassName',
              'itemLabelClassName'
            ],
            id,
            themeCss
          }),
          !wrapWithPanel &&
            setThemeClassName({
              ...this.props,
              name: 'wrapperCustomStyle',
              id,
              themeCss: wrapperCustomStyle
            })
        )}
        onSubmit={this.handleFormSubmit}
        noValidate
      >
        {/* Automatic submission upon carriage return */}
        <input type="submit" style={{display: 'none'}} />

        {debug
          ? render('form-debug-json', {
              type: 'json',
              value: store.data,
              ellipsisThreshold: 120,
              className: cx('Form--debug'),
              ...debugConfig
            })
          : null}

        {render(
          'spinner',
          {type: 'spinner'},
          {
            overlay: true,
            show: store.loading,
            loadingConfig
          }
        )}

        {this.renderFormItems({
          body
        })}

        {padDom}

        {/* Show no mapping errors */}
        {restError && restError.length ? (
          <ul className={cx('Form-restError', 'Form-feedback')}>
            {restError.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : null}

        {render(
          'modal',
          {
            ...((store.action as ActionObject) &&
              ((store.action as ActionObject).dialog as object)),
            type: 'dialog'
          },
          {
            key: 'dialog',
            data: store.dialogData,
            onConfirm: this.handleDialogConfirm,
            onClose: this.handleDialogClose,
            show: store.dialogOpen
          }
        )}

        {render(
          'modal',
          {
            ...((store.action as ActionObject) &&
              ((store.action as ActionObject).drawer as object)),
            type: 'drawer'
          },
          {
            key: 'drawer',
            data: store.drawerData,
            onConfirm: this.handleDrawerConfirm,
            onClose: this.handleDrawerClose,
            show: store.drawerOpen
          }
        )}
        <CustomStyle
          {...this.props}
          config={{
            themeCss,
            classNames: [
              wrapWithPanel && {
                key: 'panelClassName'
              },
              !wrapWithPanel && {
                key: 'formControlClassName'
              },
              {
                key: 'headerControlClassName',
                weights: {
                  default: {
                    parent: `.${cx('Panel')}`
                  }
                }
              },
              wrapWithPanel && {
                key: 'headerTitleControlClassName',
                weights: {
                  default: {
                    important: true
                  }
                }
              },
              wrapWithPanel && {
                key: 'bodyControlClassName'
              },
              wrapWithPanel && {
                key: 'actionsControlClassName',
                weights: {
                  default: {
                    parent: `.${cx('Panel--form')}`
                  }
                }
              },
              {
                key: 'itemClassName',
                weights: {
                  default: {
                    inner: `.${cx('Form-item')}`
                  }
                }
              },
              {
                key: 'staticClassName',
                weights: {
                  default: {
                    inner: `.${cx('Form-static')}`
                  }
                }
              },
              {
                key: 'itemLabelClassName',
                weights: {
                  default: {
                    inner: `.${cx('Form-label')}`
                  }
                }
              }
            ].filter(n => n) as CustomStyleClassName[],
            wrapperCustomStyle,
            id
          }}
          env={env}
        />
      </WrapperComponent>
    );
  }

  render() {
    const {
      $path,
      $schema,
      wrapWithPanel,
      render,
      title,
      store,
      panelClassName,
      headerClassName,
      footerClassName,
      footerWrapClassName,
      actionsClassName,
      bodyClassName,
      classnames: cx,
      style,
      affixFooter,
      lazyLoad,
      translate: __,
      footer,
      id,
      wrapperCustomStyle,
      themeCss
    } = this.props;

    let body: JSX.Element = this.renderBody();

    if (wrapWithPanel) {
      body = render(
        'body',
        {
          type: 'panel',
          title: __(title)
        },
        {
          className: cx(
            panelClassName,
            'Panel--form',
            setThemeClassName({
              ...this.props,
              name: 'wrapperCustomStyle',
              id,
              themeCss: wrapperCustomStyle
            }),
            setThemeClassName({
              ...this.props,
              name: 'panelClassName',
              id,
              themeCss
            })
          ),
          style: style,
          formStore: this.props.store,
          children: body,
          actions: this.buildActions(),
          onAction: this.handleAction,
          onQuery: this.handleQuery,
          disabled: store.loading,
          btnDisabled: store.loading || store.validating,
          headerClassName,
          headerControlClassName: setThemeClassName({
            ...this.props,
            name: 'headerControlClassName',
            id,
            themeCss
          }),
          headerTitleControlClassName: setThemeClassName({
            ...this.props,
            name: 'headerTitleControlClassName',
            id,
            themeCss
          }),
          footer,
          footerClassName,
          footerWrapClassName,
          actionsClassName,
          actionsControlClassName: setThemeClassName({
            ...this.props,
            name: 'actionsControlClassName',
            id,
            themeCss
          }),
          bodyClassName,
          bodyControlClassName: setThemeClassName({
            ...this.props,
            name: 'bodyControlClassName',
            id,
            themeCss
          }),
          affixFooter
        }
      ) as JSX.Element;
    }

    if (lazyLoad) {
      body = <LazyComponent>{body}</LazyComponent>;
    }

    return body;
  }
}

export class FormRendererBase extends Form {
  static contextType = ScopedContext;

  constructor(props: FormProps, context: IScopedContext) {
    super(props);

    const scoped = context;
    scoped.registerComponent(this);
  }

  componentDidMount() {
    super.componentDidMount();

    if (this.props.autoFocus) {
      this.focus();
    }
  }

  componentWillUnmount() {
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);

    super.componentWillUnmount();
  }

  focus() {
    const scoped = this.context as IScopedContext;
    const inputs = scoped.getComponents();
    let focuableInput = find(
      inputs,
      input => input.focus
    ) as ScopedComponentType;
    focuableInput && setTimeout(() => focuableInput.focus!(), 200);
  }

  doAction(
    action: ActionObject,
    data: object = this.props.store.data,
    throwErrors: boolean = false
  ) {
    return this.handleAction(undefined, action, data, throwErrors);
  }

  async handleAction(
    e: React.UIEvent<any> | undefined,
    action: ActionObject,
    ctx: object,
    throwErrors: boolean = false,
    delegate?: IScopedContext
  ) {
    // Don't do anything if it is disabled. @Comment it out first, it will cause other problems
    // if (this.props.disabled) {
    //   return;
    // }

    if (action.target && action.actionType !== 'reload') {
      const scoped = this.context as IScopedContext;

      return Promise.all(
        action.target.split(',').map(name => {
          let target = scoped.getComponentByName(name);
          return (
            target &&
            target.doAction &&
            target.doAction(
              {
                ...action,
                target: undefined
              },
              ctx,
              throwErrors
            )
          );
        })
      );
    } else if (action.actionType === 'clearError') {
      return super.clearErrors();
    } else {
      return super.handleAction(e, action, ctx, throwErrors, delegate);
    }
  }

  handleDialogConfirm(
    values: object[],
    action: ActionObject,
    ctx: any,
    targets: Array<any>
  ) {
    super.handleDialogConfirm(values, action, ctx, targets);

    const store = this.props.store;
    const scoped = this.context as IScopedContext;

    if (action.reload) {
      scoped.reload(action.reload, ctx);
    } else if (store.action && store.action.reload) {
      scoped.reload(store.action.reload, ctx);
    }
  }

  submitToTarget(target: string, values: object) {
    const scoped = this.context as IScopedContext;
    scoped.send(target, values);
  }

  reloadTarget(target: string, data: any) {
    const scoped = this.context as IScopedContext;
    scoped.reload(target, data);
  }

  closeTarget(target: string) {
    const scoped = this.context as IScopedContext;
    scoped.close(target);
  }

  async reload(
    target?: string,
    query?: any,
    ctx?: any,
    silent?: boolean,
    replace?: boolean
  ): Promise<any> {
    if (query) {
      return this.receive(query, undefined, replace);
    }

    const scoped = this.context as IScopedContext;
    let subPath: string = '';
    let idx: number;
    let subQuery: any = null;
    if (target && ~(idx = target.indexOf('.'))) {
      subPath = target.substring(idx + 1);
      target = target.substring(0, idx);
    }
    const idx2 = target ? target.indexOf('?') : -1;
    if (~idx2) {
      subQuery = dataMapping(
        qsparse((target as string).substring(idx2 + 1)),
        ctx
      );
      target = (target as string).substring(0, idx2);
    }

    let component;
    if (
      target &&
      (component = scoped.getComponentByName(target)) &&
      component.reload
    ) {
      component.reload(subPath, subQuery, ctx);
    } else if (target === '*') {
      await super.reload(target, query, ctx, silent);
      const components = scoped.getComponents();
      components.forEach(
        (component: any) =>
          component.reload && component.reload('', subQuery, ctx)
      );
    } else {
      return super.reload(target, query, ctx, silent);
    }
  }

  async receive(
    values: object,
    name?: string,
    replace?: boolean
  ): Promise<any> {
    if (name) {
      const scoped = this.context as IScopedContext;
      const idx = name.indexOf('.');
      let subPath = '';

      if (~idx) {
        subPath = name.substring(1 + idx);
        name = name.substring(0, idx);
      }

      const component = scoped.getComponentByName(name);
      component && component.receive && component.receive(values, subPath);
      return;
    }

    return super.receive(values, undefined, replace);
  }

  setData(values: object, replace?: boolean) {
    const {onChange, store} = this.props;
    super.setValues(values, replace);
    // Triggering a form change
    onChange &&
      onChange(store.data, difference(store.data, store.pristine), this.props);
  }

  getData() {
    return this.getValues();
  }
}

@Renderer({
  type: 'form',
  storeType: FormStore.name,
  isolateScope: true,
  storeExtendsData: (props: any) => props.inheritData,
  shouldSyncSuperStore: (store, props, prevProps) => {
    // If it is QuickEdit, let the store synchronize __super Content
    if (
      props.quickEditFormRef &&
      props.onQuickChange &&
      (isObjectShallowModified(prevProps.data, props.data) ||
        isObjectShallowModified(prevProps.data.__super, props.data.__super) ||
        isObjectShallowModified(
          prevProps.data.__super?.__super,
          props.data.__super?.__super
        ))
    ) {
      return true;
    }

    return undefined;
  }
})
// The class decorated by the decorator cannot inherit the methods of the parent class, so an extra layer of FormRendererBase is included for inheritance.
export class FormRenderer extends FormRendererBase {}

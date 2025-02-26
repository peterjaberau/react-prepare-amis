// https://json-schema.org/draft-07/json-schema-release-notes.html
import type {JSONSchema7} from 'json-schema';
import {ListenerAction} from './actions/Action';
import {debounceConfig, trackConfig} from './utils/renderer-event';
import type {TestIdBuilder, ValidateError} from './utils/helper';
import {AnimationsProps} from './utils/animations';

export interface Option {
  /**
   * Text to display
   */
  label?: string;

  /**
   * can be used to mark a range for Option to make data display clearer.
   *
   * This is only shown when numerical values ​​are displayed.
   */
  scopeLabel?: string;

  /**
   * Please ensure that the value is unique. Multiple option values ​​that are the same will be considered the same option.
   */
  value?: any;

  /**
   * Whether to disable
   */
  disabled?: boolean;

  /**
   * Support nesting
   */
  children?: Options;

  /**
   * Is it visible?
   */
  visible?: boolean;

  /**
   * It is best not to use it! Because visible is enough.
   *
   * @deprecated 用 visible
   */
  hidden?: boolean;

  /**
   * Description, some controls support
   */
  description?: string;

  /**
   * Delayed loading of data after marking
   */
  defer?: boolean;

  /**
   * If set, it has higher priority. If not set, it will be loaded through the source interface.
   */
  deferApi?: BaseApiObject | string;

  /**
   * Marks loading. Only meaningful when defer is true. Internal fields cannot be set externally.
   */
  loading?: boolean;

  /**
   * It only makes sense if defer is set. Internal fields cannot be set externally.
   */
  loaded?: boolean;

  [propName: string]: any;
}
export interface Options extends Array<Option> {}
export type OptionValue = string | number | null | undefined | Option;

export interface BaseApiObject {
  /**
   * API send type
   */
  method?: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'jsonp' | 'js';

  /**
   * API send destination address
   */
  url: string;

  /**
   * Used to control the data carried. When key is `&` and value is `$$`, all original data are flattened and set to data. When value is $$, all original data are assigned to the corresponding key. When value starts with $, variable value is set to key.
   */
  data?: {
    [propName: string]: any;
  };

  /**
   * If the key in the default data mapping has a dot or curly brackets, it will be converted to an object, for example:
   *
   * {
   *   'a.b': '123'
   * }
   *
   * After data mapping, it becomes
   * {
   *  a: {
   *   b: '123
   *  }
   * }
   *
   * If you want to disable this feature, please set convertKeyToPath to false
   */
  convertKeyToPath?: boolean;

  /**
   * Used to map the data returned by the interface.
   */
  responseData?: {
    [propName: string]: any;
  };

  /**
   * If method is the get interface, data information is set.
   * By default, data will be automatically included in the query and sent to the backend.
   *
   * If you want to send it to the backend via body, please set this to false.
   *
   * However, the browser does not support it yet, so setting it up is just for show. Unless the server supports method-override
   */
  attachDataToQuery?: boolean;

  /**
   * The format of the sent body
   */
  dataType?: 'json' | 'form-data' | 'form';

  /**
   * If it is a file download interface, please configure this.
   */
  responseType?: 'blob';

  /**
   * Carry headers. The usage is the same as data. Variables can be used.
   */
  headers?: {
    [propName: string]: string | number;
  };

  /**
   * Set sending conditions
   */
  sendOn?: string;

  /**
   * The default mode is append mode. If you want to completely replace, set this to true
   */
  replaceData?: boolean;

  /**
   * Whether to merge the data fields returned twice. Configure the field name in the returned object. Multiple fields can be configured.
   *
   * For example: to return the log field at the same time, the first return is {log: '1'}, the second return is {log: '2'}, the combined result is {log: ['1', '2']]}
   * For example: return the items field at the same time, the first return is {items: [1, 2]}, the second return is {items: [3, 4]}, the merged result is {items: [1, 2, 3, 4]}
   */
  concatDataFields?: string | Array<string>;

  /**
   * Whether to refresh automatically. When the value in the URL changes, the data will be refreshed automatically.
   *
   * @default true
   */
  autoRefresh?: boolean;

  /**
   * When automatic refresh is turned on, the default is the api url to automatically track variable changes.
   * If you want to monitor variables other than url, please configure trackExpression.
   */
  trackExpression?: string;

  /**
   * If a value is set, requests within the specified time (unit: ms) for the same interface and the same parameters will go directly to the cache.
   */
  cache?: number;

  /**
   * Force data to be appended to the query. By default, the crud query interface will only be used when there are no variables in the api address.
   * Automatically append data to the query part. If you want to force append, please set this property.
   * This is useful when you want to add a variable temporarily but don't want to rewrite all the parameters.
   */
  forceAppendDataToQuery?: boolean;

  /**
   * qs configuration items
   */
  qsOptions?: {
    arrayFormat?: 'indices' | 'brackets' | 'repeat' | 'comma';
    indices?: boolean;
    allowDots?: boolean;
  };

  /**
   * autoFill: whether to display auto-fill error prompts
   */
  silent?: boolean;

  /**
   * Prompt information
   */
  messages?: {
    success?: string;
    failed?: string;
  };
}

export type ClassName =
  | string
  | {
  [propName: string]: boolean | undefined | null | string;
};

export type RequestAdaptor = (
  api: ApiObject,
  context: any
) => ApiObject | Promise<ApiObject>;

export type ResponseAdaptor = (
  payload: object,
  response: fetcherResult,
  api: ApiObject,
  context: any
) => any;

export interface ApiObject extends BaseApiObject {
  config?: {
    withCredentials?: boolean;
    cancelExecutor?: (cancel: Function) => void;
  };
  originUrl?: string; // The original URL address, which records the address before splicing data into query
  jsonql?: any;
  graphql?: string;
  operationName?: string;
  body?: PlainObject;
  query?: PlainObject;
  mockResponse?: {
    status: number;
    data?: any;
    delay?: number;
  };
  adaptor?: ResponseAdaptor;
  requestAdaptor?: RequestAdaptor;
  /**
   * The api sends context, which can be used to pass some data to the api adapter
   * @readonly
   */
  context?: any;
  /** Whether to filter query parameters that are empty strings*/
  filterEmptyQuery?: boolean;
  downloadFileName?: string;
}
export type ApiString = string;
export type Api = ApiString | ApiObject;

export interface fetcherResult {
  data?: {
    data: object;
    status: number;
    msg: string;
    msgTimeout?: number;
    errors?: {
      [propName: string]: string;
    };
    type?: string;
    [propName: string]: any; // To be compatible with other return formats
  };
  status: number;
  headers?: object;
}

export interface fetchOptions {
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'jsonp' | 'js';
  successMessage?: string;
  errorMessage?: string;
  autoAppend?: boolean;
  beforeSend?: (data: any) => any;
  onSuccess?: (json: Payload, data: any) => any;
  onFailed?: (json: Payload) => any;
  silent?: boolean;
  [propName: string]: any;
}

export interface Payload {
  ok: boolean;
  msg: string;
  defaultMsg?: string;
  msgTimeout?: number;
  data: any;
  status: number;
  errors?: {
    [propName: string]: string;
  };
}

export interface Schema {
  type: string;
  detectField?: string;
  visibleOn?: string;
  hiddenOn?: string;
  disabledOn?: string;
  staticOn?: string;
  visible?: boolean;
  hidden?: boolean;
  disabled?: boolean;
  static?: boolean;
  children?: JSX.Element | ((props: any, schema?: any) => JSX.Element) | null;
  definitions?: Definitions;
  animations?: AnimationsProps;
  [propName: string]: any;
}

export interface ButtonObject {
  type: 'submit' | 'button' | 'reset';
  label?: string;
  icon?: string;
  size?: string;
  disabled?: boolean;
  className?: string;
}

export type SchemaNode = Schema | string | Array<Schema | string>;
export interface SchemaArray extends Array<SchemaNode> {}
export interface Definitions {
  [propName: string]: SchemaNode;
}
export interface ActionObject extends ButtonObject {
  actionType?:
    | 'submit'
    | 'copy'
    | 'reload'
    | 'ajax'
    | 'saveAs'
    | 'dialog'
    | 'drawer'
    | 'confirmDialog'
    | 'jump'
    | 'link'
    | 'url'
    | 'email'
    | 'close'
    | 'confirm'
    | 'add'
    | 'remove'
    | 'delete'
    | 'edit'
    | 'cancel'
    | 'next'
    | 'prev'
    | 'reset'
    | 'validate'
    | 'reset-and-submit'
    | 'clear'
    | 'clear-and-submit'
    | 'toast'
    | 'goto-step'
    | 'goto-image'
    | 'expand'
    | 'collapse'
    | 'step-submit'
    | 'select'
    | 'selectAll'
    | 'clearAll'
    | 'changeTabKey'
    | 'clearSearch'
    | 'submitQuickEdit'
    | 'initDrag'
    | 'cancelDrag'
    | 'toggleExpanded'
    | 'setExpanded'
    | 'clearError';

  api?: BaseApiObject | string;
  asyncApi?: BaseApiObject | string;
  payload?: any;
  dialog?: SchemaNode;
  to?: string;
  target?: string;
  link?: string;
  url?: string;
  cc?: string;
  bcc?: string;
  subject?: string;
  body?: string;
  mergeData?: boolean;
  reload?: string;
  messages?: {
    success?: string;
    failed?: string;
  };
  feedback?: any;
  required?: Array<string>;
  [propName: string]: any;
}

export interface Location {
  pathname: string;
  search: string;
  state: any;
  hash: string;
  key?: string;
  query?: any;
}

export interface PlainObject {
  [propsName: string]: any;
}

export interface DataChangeReason {
  type:
    | 'input' // user input
    | 'api' // API interface return trigger
    | 'formula' // formula calculation trigger
    | 'hide' // Hide attribute change trigger
    | 'init' // Form item initialization trigger
    | 'action'; // Event action trigger

  // Changing field names
  // If it is an overall change, it is undefined
  name?: string;

  // Changing value
  value?: any;
}

export interface RendererData {
  [propsName: string]: any;
  /**
   * Record the data before the change
   */
  __prev?: RendererDataAlias;

  /**
   * Record the changed information
   */
  __changeReason?: DataChangeReason;

  /**
   * Record upper layer data
   */
  __super?: RendererData;
}
type RendererDataAlias = RendererData;

export type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

// Only support JSONSchema draft07 for now

export type JSONSchema = JSONSchema7 & {
  group?: string; // group
  typeLabel?: string; // Type description
  rawType?: string; // type
};

// export type Omit<T, K extends keyof T & any> = Pick<T, Exclude<keyof T, K>>;
// export type Override<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;
// export type ExtractProps<
//   TComponentOrTProps
// > = TComponentOrTProps extends React.ComponentType<infer P> ? P : never;

/**
 * Definition of event tracking
 */
export interface EventTrack {
  /**
   * Event type, currently there are the following
   *
   * api: called before all fetchers
   * url: open external link, the component may be action or link
   * link: open internal link
   * dialog: action pop-up window
   * drawer: action's pop-up window
   * copy: copy in action
   * reload: reload in action
   * email: the email in the action
   * prev: prev in action
   * next: next in action
   * cancel: cancel in action
   * close: close in action
   * submit: It may be submit in action, or it may be form submission
   * confirm: confirm in action
   * add: add in action
   * reset: reset in action
   * reset-and-submit: action 里的 reset-and-submit
   * formItemChange: form item content changes
   * formError: Form validation failed
   * formSubmit: The form is successfully submitted. It will be triggered only after the form is successfully validated. This may overlap with the API.
   * tabChange: tab switching
   * netError: api error
   */
  eventType:
    | 'api'
    | 'url'
    | 'link'
    | 'dialog'
    | 'drawer'
    | 'copy'
    | 'reload'
    | 'email'
    | 'prev'
    | 'next'
    | 'cancel'
    | 'close'
    | 'submit'
    | 'confirm'
    | 'reset'
    | 'reset-and-submit'
    | 'formItemChange'
    | 'tabChange'
    | 'pageLoaded'
    | 'pageHidden'
    | 'pageVisible'
    | string;

  /**
   * Event data
   */
  eventData?: PlainObject | Api;
}

export type ToastLevel = 'info' | 'success' | 'error' | 'warning';
export type ToastConf = {
  position?:
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-center'
    | 'bottom-left'
    | 'bottom-right'
    | 'center';
  closeButton: boolean;
  showIcon?: boolean;
  timeout?: number;
  errorTimeout?: number;
  className?: string;
  items?: Array<any>;
  useMobileUI?: boolean;
  validateError?: ValidateError;
};

export interface OptionProps {
  className?: string;
  multi?: boolean;
  multiple?: boolean;
  valueField?: string;
  labelField?: string;
  simpleValue?: boolean; // By default, onChange sends the entire option node. If simpleValue is configured, it only contains the value.
  options: Options;
  loading?: boolean;
  joinValues?: boolean;
  extractValue?: boolean;
  delimiter?: string;
  clearable?: boolean;
  resetValue: any;
  placeholder?: string;
  disabled?: boolean;
  creatable?: boolean;
  pathSeparator?: string;
  hasError?: boolean;
  block?: boolean;
  onAdd?: (
    idx?: number | Array<number>,
    value?: any,
    skipForm?: boolean
  ) => void;
  editable?: boolean;
  onEdit?: (value: Option, origin?: Option, skipForm?: boolean) => void;
  removable?: boolean;
  onDelete?: (value: Option) => void;
}

export type LinkItem = LinkItemProps;
interface LinkItemProps {
  id?: number;
  label: string;
  hidden?: boolean;
  open?: boolean;
  active?: boolean;
  className?: string;
  children?: Array<LinkItem>;
  path?: string;
  icon?: string;
  component?: React.ElementType;
}

export interface NavigationObject {
  label: string;
  children?: Array<LinkItem>;
  prefix?: JSX.Element;
  affix?: JSX.Element;
  className?: string;
  [propName: string]: any;
}

/**
 * Expression, syntax is `data.xxx > 5`.
 */
export type SchemaExpression = string;

/**
 * CSS class name, configuration string, or object.
 *
 *     className: "red"
 *
 * Using object configuration means you can use it with expressions, such as:
 *
 *     className: {
 *         "red": "data.progress > 80",
 *         "blue": "data.progress > 60"
 *     }
 */
export type SchemaClassName =
  | string
  | {
  [propName: string]: boolean | undefined | null | SchemaExpression;
};
export interface BaseSchemaWithoutType {
  /**
   * Component unique id, mainly used to locate json nodes in page designers
   */
  $$id?: string;
  /**
   * Container css class name
   */
  className?: SchemaClassName;

  /**
   * Used together with definitions, you can implement an infinite loop renderer.
   */
  $ref?: string;

  /**
   * Whether to disable
   */
  disabled?: boolean;

  /**
   * Whether to disable the expression
   */
  disabledOn?: SchemaExpression;

  /**
   * Whether to hide
   * @deprecated It is recommended to use visible
   */
  hidden?: boolean;

  /**
   * Whether to hide the expression
   * @deprecated Recommend using visibleOn
   */
  hiddenOn?: SchemaExpression;

  /**
   * Whether to display
   */

  visible?: boolean;

  /**
   * Whether to display the expression
   */
  visibleOn?: SchemaExpression;

  /**
   * Unique id of the component, mainly used for log collection
   */
  id?: string;

  /**
   * Event action configuration
   */
  onEvent?: {
    [propName: string]: {
      weight?: number; // weight
      actions: ListenerAction[]; // Action set to be executed
      debounce?: debounceConfig;
      track?: trackConfig;
    };
  };
  /**
   * Whether to display statically
   */
  static?: boolean;
  /**
   * Whether to display the expression statically
   */
  staticOn?: SchemaExpression;
  /**
   * Static display of empty value placeholder
   */
  staticPlaceholder?: string;
  /**
   * Static display of form item class name
   */
  staticClassName?: SchemaClassName;
  /**
   * Static display of form item Label class name
   */
  staticLabelClassName?: SchemaClassName;
  /**
   * Static display of form item Value class name
   */
  staticInputClassName?: SchemaClassName;
  staticSchema?: any;

  /**
   * Component styles
   */
  style?: {
    [propName: string]: any;
  };

  /**
   * Editor configuration, can be ignored at runtime
   */
  editorSetting?: {
    /**
     * Component behavior and purpose, such as create, update, remove
     */
    behavior?: string;

    /**
     * Component name, usually the business name for easy positioning
     */
    displayName?: string;

    /**
     * Editor fake data for easy display
     */
    mock?: any;

    [propName: string]: any;
  };

  /**
   * Can be used to disable mobile styling at the component level
   */
  useMobileUI?: boolean;

  testIdBuilder?: TestIdBuilder;
}

export type OperatorType =
  | 'equal'
  | 'not_equal'
  | 'is_empty'
  | 'is_not_empty'
  | 'like'
  | 'not_like'
  | 'starts_with'
  | 'ends_with'
  | 'less'
  | 'less_or_equal'
  | 'greater'
  | 'greater_or_equal'
  | 'between'
  | 'not_between'
  | 'select_equals'
  | 'select_not_equals'
  | 'select_any_in'
  | 'select_not_any_in'
  | {
  label: string;
  value: string;
};

export type ExpressionSimple = string | number | object | undefined;
export type ExpressionValue =
  | ExpressionSimple
  | {
  type: 'value';
  value: ExpressionSimple;
};
export type ExpressionFunc = {
  type: 'func';
  func: string;
  args: Array<ExpressionComplex>;
};
export type ExpressionField = {
  type: 'field';
  field: string;
};
export type ExpressionFormula = {
  type: 'formula';
  value: string;
};

export type ExpressionComplex =
  | ExpressionValue
  | ExpressionFunc
  | ExpressionField
  | ExpressionFormula;

export interface ConditionRule {
  id: any;
  left?: ExpressionComplex;
  on?: OperatorType;
  right?: ExpressionComplex | Array<ExpressionComplex>;
  if?: string;
}

export interface ConditionGroupValue {
  id: string;
  conjunction: 'and' | 'or';
  not?: boolean;
  children?: Array<ConditionRule | ConditionGroupValue>;
  if?: string;
}

export interface ConditionValue extends ConditionGroupValue {}

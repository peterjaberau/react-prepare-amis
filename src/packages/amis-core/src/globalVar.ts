/**
 * Global variables
 *
 * Used to implement data sharing across components and pages, and support persistence.
 */

import {JSONSchema} from './types';
import {isExpression} from './utils/formula';
import {reaction} from 'mobx';
import {resolveVariableAndFilter} from './utils/resolveVariableAndFilter';
import {IRootStore} from './store/root';

/**
 * Definition of global variables
 */
export interface GlobalVariableItem {
  // Identifier, used to distinguish different variables, cannot be repeated
  id?: string;

  /**
   * Design state properties.
   * The global variable type is not a data body type, but is used to distinguish different configuration methods.
   * This field has no meaning at runtime and is mainly used for classification in the editor.
   *
   * For example, the platform may be expanded: application level, page level, user level, data dictionary association, data model association, etc.
   * Built-in in amis: builtin is a simple client storage, and the server storage needs external expansion.
   *
   * @default builtin
   */
  type?: string | 'builtin';

  /**
   * Variable name
   */
  key: string;

  /**
   * Variable title
   */
  label?: string;

  /**
   * Variable description
   */
  description?: string;

  /**
   * default value
   */
  defaultValue?: string;

  /**
   * Data type definition of the value
   */
  valueSchema?: JSONSchema;

  /**
   * Data scope
   */
  scope?: 'page' | 'app';

  /**
   * Data storage method
   */
  storageOn?: 'client' | 'server' | 'session';

  /**
   * Whether it is read-only, modification is not allowed, and running state attributes.
   */
  readonly?: boolean;

  /**
   * @default true
   * Whether to save automatically. If no special configuration is required, it will be saved automatically.
   */
  autoSave?: boolean;

  // todo: The following are extended fields that need further definition
  validationErrors?: any;
  validations?: any;

  // Other extended data
  [propName: string]: any;
}

export type GlobalVarGetter = (
  variable: GlobalVariableItem,
  context: GlobalVarContext
) => Promise<any>;
export type GlobalVarBulkGetter = (
  context: GlobalVarContext
) => Promise<Record<string, any>> | Record<string, any>;
export type GlobalVarSetter = (
  variable: GlobalVariableItem,
  value: Record<string, any>,
  context: GlobalVarContext
) => Promise<any>;
export type GlobalVarBulkSetter = (
  values: Record<string, any>,
  context: GlobalVarContext
) => Promise<any> | any;

export interface GlobalVariableItemFull extends GlobalVariableItem {
  /**
   * Check whether the value is legal
   * @param value
   * @returns
   */
  validate?: (value: any, values: Record<string, any>) => string | void;

  /**
   * Weight, used for sorting
   */
  order?: number;

  /**
   * Initialize and obtain a single data
   * @returns
   */
  getter?: GlobalVarGetter;

  /**
   * Initialize batch data acquisition
   * @returns
   */
  bulkGetter?: GlobalVarBulkGetter;

  /**
   * When the data is modified, it is saved
   * @param value
   * @returns
   */
  sets?: GlobalVarSetter;

  /**
   * Batch global variable data saving, multiple variables are saved together
   * @param values
   * @returns
   */
  bulkSetter?: GlobalVarBulkSetter;
}

/**
 * The state of global variables
 */
export interface GlobalVariableState {
  /**
   * Current value
   */
  value: any;

  /**
   * Original value
   */
  pristine: any;

  /**
   * Is it loading, or getting
   */
  busy?: boolean;

  /**
   * Has it been initialized?
   */
  initialized: boolean;

  /**
   * Is the data legal?
   */
  valid: boolean;

  /**
   * Error Xinxin
   */
  errorMessages: string[];

  /**
   * Is there any change
   */
  touched: boolean;

  /**
   * Whether to save
   */
  saved: boolean;
}

export interface GlobalVarContext {
  variables: Array<GlobalVariableItem>;
  [propName: string]: any;
}
/**
 * Global variable processor, which can handle the initialization, verification, storage and other operations of all variables
 */
export type GlobalVariableHandler = (
  variable: GlobalVariableItem | GlobalVariableItemFull,
  context: GlobalVarContext
) =>
  | GlobalVariableItemFull
  | void
  | ((
  variable: GlobalVariableItem | GlobalVariableItemFull,
  context: GlobalVarContext
) => GlobalVariableItemFull | void);

const handlers: Array<GlobalVariableHandler> = [];

/**
 * Register global variable handler
 * @param handler
 */
export function registerGlobalVariableHandler(handler: GlobalVariableHandler) {
  handlers.push(handler);
}

/**
 * Construct global variable detail objects through the processor for subsequent initialization, verification, storage and other operations
 * @param variable
 * @param context
 * @returns
 */
export function buildGlobalVariable(
  variable: GlobalVariableItem | GlobalVariableItemFull,
  context: GlobalVarContext
): GlobalVariableItemFull {
  const postHandlers: Array<
    (
      variable: GlobalVariableItem | GlobalVariableItemFull,
      context: GlobalVarContext
    ) => GlobalVariableItemFull | void
  > = [];

  let result = handlers.reduce((item, handler) => {
    const result = handler(item, context);

    if (typeof result === 'function') {
      postHandlers.push(result);
    }

    return (result ?? item) as GlobalVariableItemFull;
  }, variable);

  result = postHandlers.reduce(
    (item, handler) => handler(item, context) ?? item,
    result
  );

  return result;
}

/**
 * Construct the initial state of the variable
 * @returns
 */
export function createGlobalVarState(): GlobalVariableState {
  return {
    value: undefined,
    pristine: undefined,
    initialized: false,
    valid: true,
    errorMessages: [],
    touched: false,
    saved: false
  };
}

// The first two are historical, the last two are new
const globalVarFields = ['__page.', 'appVariables.', 'global.', 'globalState.'];
export function isGlobalVarExpression(value: string) {
  return (
    typeof value === 'string' &&
    isExpression(value) &&
    globalVarFields.some(k => value.includes(k))
  );
}

/**
 * Global variables of monitoring components
 * @param schema
 * @param topStore
 * @param callback
 * @returns
 */
export function observeGlobalVars(
  schema: any,
  topStore: IRootStore,
  callback: () => void
) {
  let expressions: Array<{
    key: string;
    value: string;
  }> = [];
  Object.keys(schema).forEach(key => {
    const value = schema[key];

    if (isGlobalVarExpression(value)) {
      expressions.push({
        key,
        value
      });
    } else if (
      [
        'items',
        'body',
        'buttons',
        'header',
        'columns',
        'tabs',
        'footer',
        'actions',
        'toolbar'
      ].includes(key)
    ) {
      const items = Array.isArray(value) ? value : [value];
      items.forEach(item => {
        if (isGlobalVarExpression(item?.visibleOn)) {
          expressions.push({
            key: `${key}.x.visibleOn`,
            value: item.visibleOn
          });
        } else if (isGlobalVarExpression(item?.hiddenOn)) {
          expressions.push({
            key: `${key}.x.hiddenOn`,
            value: item.hiddenOn
          });
        }
      });
    }
  });
  if (!expressions.length) {
    return () => {};
  }

  const unReaction = reaction(
    () =>
      expressions
        .map(
          exp =>
            `${exp.key}:${resolveVariableAndFilter(
              exp.value,
              topStore.downStream,
              '| json' // If you use a complex object, you need to rely on this for comparison
            )}`
        )
        .join(','),
    callback
  );

  return unReaction;
}

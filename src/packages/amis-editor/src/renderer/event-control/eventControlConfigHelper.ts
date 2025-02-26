import {
  BaseEventContext,
  EditorManager,
  JSONGetById,
  PluginActions,
  RendererPluginAction,
  SubRendererPluginAction
} from '@/packages/amis-editor-core/src';
import {
  filterTree,
  findTree,
  normalizeApi,
  PlainObject,
  Schema,
  getRendererByName
} from 'amis-core';
import {ActionConfig, ComponentInfo} from './types';
import {ActionData} from '.';
import {NO_SUPPORT_STATIC_FORMITEM_CMPTS} from './constants';

/**
 * Combo component object array to object
 * @param arr
 * @returns
 */
const comboArrayToObject = (arr: any[]) => {
  let obj: PlainObject = {};
  arr?.forEach(item => {
    obj[item.key] = item.val;
  });

  return obj;
};

// Get the action that contains the specified sub-action
export const findSubActionNode = (
  actions: RendererPluginAction[],
  actionType: string
) =>
  findTree(actions, node =>
    node.actions?.find(
      (item: SubRendererPluginAction) => item.actionType === actionType
    )
  );

// Get the actual action type
export const getActionType = (
  action: ActionConfig,
  hasSubActionNode: RendererPluginAction | null
) =>
  action.groupType === 'component'
    ? 'component'
    : hasSubActionNode
    ? hasSubActionNode.actionType
    : action.actionType;

// Determine whether the specified action exists in the plugin action
export const hasActionType = (
  actionType: string,
  actions?: RendererPluginAction[]
) => {
  if (!Array.isArray(actions)) {
    return false;
  }
  return !!actions?.find(item =>
    [item.actionType, 'component'].includes(actionType)
  );
};

/**
 * Object to Combo component object array
 * @param obj
 * @returns
 */
const objectToComboArray = (obj: PlainObject) =>
  Object.entries(obj).map(([key, val]) => ({
    key,
    val
  }));

// Get action configuration, mainly to get config and desc, schema is mandatory to bundle in action tree node (action configuration may be in plugin action > tree node or sub-action)
export const getPropOfAcion = (
  action: ActionConfig,
  propName: string,
  actionTree: RendererPluginAction[],
  pluginActions: PluginActions,
  commonActions?: {[propName: string]: RendererPluginAction},
  allComponents?: ComponentInfo[]
): any => {
  let prop: any = null;
  if (action.componentId) {
    // Prioritize finding from component feature actions
    const node = findTree(
      allComponents ?? [],
      item => item.value === action.componentId
    );
    prop =
      node &&
      pluginActions[node.type]?.find(
        (item: RendererPluginAction) => item.actionType === action.actionType
      )?.[propName as keyof RendererPluginAction];
  }

  if (!prop) {
    prop = findActionNode(actionTree, action.actionType)?.[
      propName as keyof RendererPluginAction
    ];
  }

  if (!prop) {
    const commonActionConfig = {
      ...commonActions
    };
    const hasSubActionNode = findSubActionNode(actionTree, action.actionType);

    if (propName === 'actionLabel') {
      prop = hasSubActionNode?.actionLabel;
    } else {
      prop =
        hasSubActionNode?.actions?.find(
          (item: SubRendererPluginAction) =>
            item.actionType === action.actionType
        )?.[propName as keyof SubRendererPluginAction] ??
        commonActionConfig[action.actionType]?.[
          propName as keyof RendererPluginAction
        ];
    }
  }

  return prop;
};

export const checkComponent =
  (manager: EditorManager) => (node: any, action: RendererPluginAction) => {
    const actionType = action?.actionType;
    const actions = manager?.pluginActions[node.type];
    const haveChild = !!node.children?.length;
    let isSupport = false;

    const render = getRendererByName(node.type);

    if (typeof action.supportComponents === 'string') {
      isSupport =
        action.supportComponents === '*' ||
        action.supportComponents === node.type;
      // Built-in logic
      if (action.supportComponents === 'byComponent' && actionType) {
        isSupport = hasActionType(actionType, actions);
        node.scoped = isSupport;
      }
    } else if (action.supportComponents?.includes('isFormItem')) {
      isSupport = !!render?.isFormItem;
    } else if (action.supportComponents?.includes('isStaticFormItem')) {
      isSupport =
        !!render?.isFormItem &&
        !NO_SUPPORT_STATIC_FORMITEM_CMPTS.includes(node.type);
    } else if (Array.isArray(action.supportComponents)) {
      isSupport = action.supportComponents.includes(node.type);
    }

    node.isScopeContainer = !!render?.storeType;
    if (actionType === 'component' && !actions?.length) {
      node.disabled = true;
    }
    if (isSupport) {
      return true;
    } else if (haveChild) {
      return true;
    }
    return false;
  };

// Get the specified action in the action tree
export const findActionNode = (
  actions: RendererPluginAction[],
  actionType: string
) => findTree(actions, node => node.actionType === actionType);

export const getContextSchemasHoc =
  (manager: EditorManager, context?: BaseEventContext) =>
  async (id?: string, withoutSuper?: boolean) => {
    const dataSchema = await manager.getContextSchemas(
      id ?? context!.id,
      withoutSuper
    );
    // When the specified id exists, only the current layer context is needed
    if (id) {
      return dataSchema;
    }
    return manager.dataSchema;
  };

export const getComponentsHoc =
  (manager: EditorManager) => (action: RendererPluginAction) => {
    if (!action) {
      return [];
    }

    const isSubEditor = manager.store.isSubEditor;
    let components = manager?.store?.getComponentTreeSource();
    let finalCmpts: any[] = [];
    if (isSubEditor) {
      let editorData = manager.store.getSuperEditorData;
      while (components) {
        if (editorData?.__curCmptTreeWrap) {
          components = [
            {
              ...editorData.__curCmptTreeWrap,
              children: components
            }
          ];
        }
        finalCmpts = [...finalCmpts, ...components];
        components = editorData?.__superCmptTreeSource;
        editorData = editorData?.__super;
      }
    } else {
      finalCmpts = components;
    }
    const result = filterTree(
      finalCmpts,
      node => checkComponent(manager)(node, action),
      1,
      true
    );
    result.unshift({
      label: 'Enter component id',
      value: 'customCmptId'
    });
    return result;
  };

export const getRootManager = (manager: EditorManager) => {
  let rootManager = manager;
  while (rootManager) {
    if (!rootManager.parent) {
      break;
    }
    rootManager = rootManager.parent;
  }

  return rootManager;
};

export const actionConfigInitFormatterHoc =
  (
    manager: EditorManager,
    actionTree: RendererPluginAction[],
    commonActions: any,
    allComponents: ComponentInfo[]
  ) =>
  async (action: ActionConfig) => {
    let config = {...action};
    config.args = {...action.args};
    if (['link', 'url'].includes(action.actionType) && action.args?.params) {
      config.args = {
        ...config.args,
        params: objectToComboArray(action.args?.params)
      };
    }

    if (['setValue'].includes(action.actionType) && action.args?.value) {
      !config.args && (config.args = {});
      if (Array.isArray(action.args?.value)) {
        config.args.value = action.args?.value.reduce(
          (arr: any, valueItem: any, index: number) => {
            if (!arr[index]) {
              arr[index] = {};
            }
            arr[index].item = objectToComboArray(valueItem);
            return arr;
          },
          []
        );
        // Currently, only the value assigned to combo is an array, so it is considered to be the full value assignment method
        config.args['__comboType'] = 'all';
      } else if (typeof action.args?.value === 'object') {
        config.args.value = objectToComboArray(action.args?.value);
        config.args['__containerType'] = 'appoint';
        // If there is an index, it is considered to be assigning a value to the combo of the specified sequence number, so it is considered to be the assignment method of the specified sequence number
        if (action.args.index !== undefined) {
          config.args['__comboType'] = 'appoint';
        }
      } else if (
        action.actionType === 'setValue' &&
        typeof action.args?.path === 'string' &&
        typeof action.args?.value === 'string'
      ) {
        /** Application variable assignment */
        config.args['__containerType'] = 'all';
      } else if (
        action.actionType === 'setValue' &&
        typeof action.args?.value === 'string'
      ) {
        config.args['__containerType'] = 'all';
        config.args['__valueInput'] = config.args['value'];
        delete config.args?.value;
      }
    }

    if (['show', 'hidden', 'enabled', 'disabled'].includes(action.actionType)) {
      // Compatible with old logic, initialize actionType
      config.__statusType = action.actionType;
      config.__actionType = 'static';
    }

    if (['usability', 'visibility'].includes(action.actionType)) {
      // Initialize condition parameters
      config.__actionExpression = action.args?.value;
    }

    if (['ajax', 'download'].includes(action.actionType)) {
      config.api = action.api ?? action?.args?.api;
      config.options = action.options ?? action?.args?.options;
      if (typeof action?.api === 'string') {
        config.api = normalizeApi(action?.api);
      }
      delete config.args;
    }

    // Get action-specific configuration parameters
    const innerArgs: any = getPropOfAcion(
      action,
      'innerArgs',
      actionTree,
      manager.pluginActions,
      commonActions
    );

    // Process additional parameters for refreshing component actions
    if (config.actionType === 'reload') {
      config.__resetPage = config.args?.resetPage;
      config.__addParam = !!config.data;

      if (
        (config.data && typeof config.data === 'object') ||
        (config.args &&
          Object.keys(config.args).length &&
          config.data === undefined)
      ) {
        config.__addParam = true;
        config.__containerType = 'appoint';
        config.dataMergeMode = config.dataMergeMode || 'merge';
      }

      if (config.__addParam && config.data) {
        if (typeof config.data === 'string') {
          config.__containerType = 'all';
          config.__valueInput = config.data;
        } else {
          config.__containerType = 'appoint';
          config.__reloadParams = objectToComboArray(config.data);
        }
      } else if (
        config.args &&
        Object.keys(config.args).length &&
        config.data === undefined
      ) {
        config.__reloadParams = objectToComboArray(config.args);
      }
    }

    // If it is not in the selectable component range, set the custom input component data
    if (
      [
        'setValue',
        'static',
        'nonstatic',
        'show',
        'visibility',
        'hidden',
        'enabled',
        'disabled',
        'usability',
        'reload',
        'submit',
        'clear',
        'reset',
        'validate'
      ].includes(action.actionType)
    ) {
      const node = findTree(
        allComponents ?? [],
        item => item.value === config.componentId
      );
      if (!node) {
        config.__cmptId = config.componentId;
        config.componentId = 'customCmptId';
      }

      if (['setValue'].includes(action.actionType)) {
        const root = getRootManager(manager);
        let schema = JSONGetById(
          root.store.schema,
          config.__cmptId || action.componentId,
          'id'
        );
        if (schema) {
          const render = getRendererByName(schema.type);
          config.__isScopeContainer = !!render?.storeType;
          config.__rendererName = schema.type;
        }
      }
    }

    if (config.actionType !== 'broadcast') {
      delete config.data;
    }

    // Process the initialization of addItem
    if (action.actionType === 'addItem') {
      if (Array.isArray(action.args?.item)) {
        const comboArray = (action.args?.item || []).map((raw: any) =>
          objectToComboArray(raw)
        );
        config.args = {
          ...config.args,
          value: comboArray.map(combo => ({item: combo}))
        };
      } else {
        config.args = {
          ...config.args,
          item: objectToComboArray(action.args?.item)
        };
      }
    }

    // Restore args to a visual configuration structure (args + addOnArgs)
    if (config.args) {
      if (innerArgs) {
        let tmpArgs = {};
        config.addOnArgs = [];
        Object.keys(config.args).forEach(key => {
          // Filter out additional configuration parameters
          if (!innerArgs.includes(key)) {
            config.addOnArgs = [
              ...config.addOnArgs,
              {
                key: key,
                val: config.args?.[key]
              }
            ];
          } else {
            tmpArgs = {
              ...tmpArgs,
              [key]: config.args?.[key]
            };
          }
        });
        config.args = tmpArgs;
      }
    }

    // Get the action node hit on the left
    const hasSubActionNode = findSubActionNode(actionTree, action.actionType);

    return {
      ...config,
      actionType: getActionType(action, hasSubActionNode),
      args: config.args
    };
  };

export const actionConfigSubmitFormatterHoc =
  (actionTree: any) =>
  (
    config: ActionConfig,
    type?: string,
    actionData?: ActionData,
    schema?: Schema
  ) => {
    let action: ActionConfig = {...config, groupType: undefined};
    action.__title = findActionNode(actionTree, config.actionType)?.actionLabel;

    // Correction action name
    if (config.actionType === 'component') {
      action.actionType = config.groupType;
      //Mark the component feature action
      action.groupType = config.actionType;
    }
    const hasSubActionNode = findSubActionNode(actionTree, config.groupType);
    if (hasSubActionNode) {
      // Correction action
      action.actionType = config.groupType;
    }

    // Merge additional action parameters
    if (config.addOnArgs) {
      config.addOnArgs.forEach((args: any) => {
        action.args = action.args ?? {};
        action.args = {
          ...action.args,
          [args.key]: args.val
        };
      });
      delete action.addOnArgs;
    }

    // If you don't add it back, the data may be lost
    ['drawer', 'dialog', 'args', 'preventDefault'].forEach(key => {
      action[key] = action[key] ?? actionData?.[key];
    });

    // When refreshing the component, handle whether to append event variables
    if (config.actionType === 'reload') {
      action.data = undefined;
      action.dataMergeMode = undefined;

      action.args =
        action.__rendererName === 'crud'
          ? {
              ...action.args,
              resetPage: config.__resetPage ?? true
            }
          : undefined;

      action.data = undefined;
      if (config.__addParam) {
        action.dataMergeMode = config.dataMergeMode || 'merge';
        action.data =
          config.__containerType === 'all'
            ? config.__valueInput
            : comboArrayToObject(config.__reloadParams || []);
      }
    }

    //Convert the format
    if (['link', 'url'].includes(action.actionType)) {
      const params = config.args?.params;
      if (params && params.length) {
        action.args = {
          ...action.args,
          params: comboArrayToObject(params)
        };
      }
    }

    if (action.actionType === 'toast') {
      //Configure a toast component default class
      action.args = {
        ...action.args,
        className: 'theme-toast-action-scope'
      };
    }

    //Convert the format
    if (action.actionType === 'setValue') {
      if (config.args?.hasOwnProperty('path')) {
        /** Application variable assignment */
        action.args = {
          path: config.args.path,
          value: config.args?.value ?? ''
        };

        action.hasOwnProperty('componentId') && delete action.componentId;
        return action;
      } else {
        action?.args?.hasOwnProperty('path') && delete action.args.path;

        if (config.args?.__valueInput !== undefined) {
          action.args = {
            value: config.args?.__valueInput
          };
        } else if (Array.isArray(config.args?.value)) {
          action.args = action.args ?? {};
          if (
            (action.__rendererName === 'combo' ||
              action.__rendererName === 'input-table') &&
            action.args?.index === undefined
          ) {
            // Special processing of combo and input-table
            let tempArr: any = [];
            config.args?.value.forEach((valueItem: any, index: number) => {
              valueItem.item.forEach((item: any) => {
                if (!tempArr[index]) {
                  tempArr[index] = {};
                }
                tempArr[index][item.key] = item.val;
              });
            });
            action.args = {
              ...action.args,
              value: tempArr
            };
          } else {
            action.args = {
              ...action.args,
              value: comboArrayToObject(config.args?.value!)
            };
          }
        }
      }
    }

    if (
      [
        'setValue',
        'static',
        'nonstatic',
        'show',
        'visibility',
        'hidden',
        'enabled',
        'disabled',
        'usability',
        'reload',
        'submit',
        'clear',
        'reset',
        'validate'
      ].includes(action.actionType)
    ) {
      // Handle the conversion of self-entered component id
      if (action.componentId === 'customCmptId') {
        action.componentId = action.__cmptId;
      }
    }

    if (action.actionType === 'addItem' && action.__rendererName === 'combo') {
      action.args = {
        ...action.args,
        item: comboArrayToObject(config.args?.item!)
      };
    }

    if (
      action.actionType === 'addItem' &&
      action.__rendererName === 'input-table'
    ) {
      const comboArray = (config.args?.value! || []).map(
        (combo: any) => combo.item || {}
      );
      action.args = {
        ...action.args,
        item: comboArray.map((raw: any) => comboArrayToObject(raw))
      };
      delete action.args?.value;
    }

    //Convert the format
    if (['visibility', 'usability'].includes(config.actionType)) {
      action.args =
        action.actionType !== 'static'
          ? {
              value: action.__actionExpression
            }
          : undefined;
      action.actionType === 'static' &&
        (action.actionType = config.__statusType);
      delete action.__actionExpression;
      delete action.__statusType;
    }

    delete action.config;
    delete action.__keywords;
    delete action.__resultActionTree;
    return action;
  };

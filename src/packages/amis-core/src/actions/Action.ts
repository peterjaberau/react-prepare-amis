import omit from 'lodash/omit';
import {RendererProps} from '../factory';
import {ConditionGroupValue, Api, SchemaNode} from '../types';
import {createObject} from '../utils/helper';
import {RendererEvent} from '../utils/renderer-event';
import {evalExpressionWithConditionBuilderAsync} from '../utils/tpl';
import {dataMapping} from '../utils/tpl-builtin';
import {IBreakAction} from './BreakAction';
import {IContinueAction} from './ContinueAction';
import {ILoopAction} from './LoopAction';
import {IParallelAction} from './ParallelAction';
import {ISwitchAction} from './SwitchAction';
import {debug} from '../utils/debug';

// Loop action execution status
export enum LoopStatus {
  NORMAL,
  BREAK,
  CONTINUE
}

// Listener action definition
export interface ListenerAction {
  actionType: string; // Action type Logical action|Custom (script support)|reload|url|ajax|dialog|drawer Other extended component actions
  description?: string; // Event description, actionType: broadcast
  componentId?: string; // Component ID, used to directly execute the action of the specified component. Use English commas to separate multiple components
  componentName?: string; // Component Name, used to directly execute the action of the specified component. Use English commas to separate multiple components
  ignoreError?: boolean; // When an error occurs during the execution of the action, whether to ignore and continue to execute
  args?: Record<string, any>; // Action configuration, you can configure data mapping. Note: Actions with schema configuration cannot be placed in args to avoid parsing errors caused by different data domains
  data?: Record<string, any> | null; // Action data parameter, data mapping can be configured
  dataMergeMode?: 'merge' | 'override'; // Parameter mode, merge or override
  outputVar?: string; // Output data variable name
  preventDefault?: boolean; // Prevent the action behavior of the original component
  stopPropagation?: boolean; // Prevent subsequent event handlers from executing
  expression?: string | ConditionGroupValue; // Execution condition
  execOn?: string; // Execution condition, deprecated in 1.9.0
  [propName: string]: any;
}

export interface ILogicAction extends ListenerAction {
  children?: ListenerAction[]; // child actions
}

// logical action type, supports parallel, exclusive (switch), loop (supports continue and break)
export type LogicAction =
  | IParallelAction
  | ISwitchAction
  | ILoopAction
  | IContinueAction
  | IBreakAction;

export interface ListenerContext extends React.Component<RendererProps> {
  [propName: string]: any;
}

interface MappingIgnoreMap {
  [propName: string]: string[];
}

// Action basic interface
export interface RendererAction {
// Run this Action, each type of Action has only one instance, the run function is a reentrant function
  run: (
    action: ListenerAction,
    renderer: ListenerContext,
    event: RendererEvent<any>,
    mergeData?: any // Some actions need to process proprietary logic through context data. The data here is event data + renderer data
  ) => Promise<RendererEvent<any> | void>;
}

// Store the mapping relationship between Action and type for subsequent search
const ActionTypeMap: {[key: string]: RendererAction} = {};

// Register Action
export const registerAction = (type: string, action: RendererAction) => {
  ActionTypeMap[type] = action;
};

// Get Action instance by type
export const getActionByType = (type: string) => {
  return ActionTypeMap[type];
};

// Get attribute exclusion list based on action type
const getOmitActionProp = (type: string) => {
  let omitList: string[] = [];
  switch (type) {
    case 'toast':
      omitList = [
        'msgType',
        'msg',
        'position',
        'closeButton',
        'showIcon',
        'timeout',
        'title'
      ];
      break;
    case 'alert':
      omitList = ['msg'];
      break;
    case 'confirm':
      omitList = ['msg', 'title'];
      break;
    case 'ajax':
    case 'download':
      omitList = ['api', 'messages', 'options'];
      break;
    case 'setValue':
      omitList = ['value', 'index'];
      break;
    case 'copy':
      omitList = ['content', 'copyFormat'];
      break;
    case 'email':
      omitList = ['to', 'cc', 'bcc', 'subject', 'body'];
      break;
    case 'link':
      omitList = ['link', 'blank', 'params'];
      break;
    case 'url':
      omitList = ['url', 'blank', 'params'];
      break;
    case 'for':
      omitList = ['loopName'];
      break;
    case 'goPage':
      omitList = ['delta'];
      break;
    case 'custom':
      omitList = ['script'];
      break;
    case 'broadcast':
      omitList = ['eventName'];
      break;
    case 'dialog':
      omitList = ['dialog'];
      break;
    case 'drawer':
      omitList = ['drawer'];
      break;
    case 'confirmDialog':
      omitList = ['dialog'];
      break;
    case 'reload':
      omitList = ['resetPage'];
      break;
  }
  return omitList;
};

export const runActions = async (
  actions: ListenerAction | ListenerAction[],
  renderer: ListenerContext,
  event: any
) => {
  if (!Array.isArray(actions)) {
    actions = [actions];
  }

  for (const actionConfig of actions) {
    let actionInstrance = getActionByType(actionConfig.actionType);

    // If a specified component ID exists, it indicates a component-specific action
    if (
      !actionInstrance &&
      (actionConfig.componentId || actionConfig.componentName)
    ) {
      actionInstrance = [
        'static',
        'nonstatic',
        'show',
        'visibility',
        'hidden',
        'enabled',
        'disabled',
        'usability'
      ].includes(actionConfig.actionType)
        ? getActionByType('status')
        : getActionByType('component');
    } else if (['url', 'link', 'jump'].includes(actionConfig.actionType)) {
      //Open page action
      actionInstrance = getActionByType('openlink');
    }

//If not found, complete it through component-specific actions
    if (!actionInstrance) {
      actionInstrance = getActionByType('component');
    }

    try {
//The sub-node operation logic of these nodes is implemented by the node
      await runAction(actionInstrance, actionConfig, renderer, event);
    } catch (e) {
      const ignore = actionConfig.ignoreError ?? false;
      if (!ignore) {
        throw Error(
          `${actionConfig.actionType} Action execution failed, reason: ${
            e.message || 'Unknown'
          }`
        );
      }
    }

    if (event.stoped) {
      break;
    }
  }
};

// Execute the action and connect with the original action processing
export const runAction = async (
  actionInstrance: RendererAction,
  actionConfig: ListenerAction,
  renderer: ListenerContext,
  event: any
) => {
// Append data
  let additional: any = {
    event
  };
  let action: ListenerAction = {...actionConfig};
  action.args = {...actionConfig.args};

  const rendererProto = renderer.props.getData?.() ?? renderer.props.data;

// __rendererData defaults to renderer.props.data, compatible with data reading when form item values change
  if (!event.data?.__rendererData) {
    additional = {
      event,
      __rendererData: rendererProto // Some components will be updated after interaction. If you want to get that part of the data, you can get it through event data
    };
  }

// Users may need to use event data and current domain data, so merge event data and current renderer data
// Need to keep renderer data chain intact
// Note: Parallel ajax request results must be obtained through event
  const mergeData = createObject(
    createObject(
      rendererProto.__super
        ? createObject(rendererProto.__super, additional)
        : additional,
      rendererProto
    ),
    event.data
  );
// Compatible with versions before 1.9.0
  const expression = action.expression ?? action.execOn;
// Execution condition
  let isStop = false;
  if (expression) {
    isStop = !(await evalExpressionWithConditionBuilderAsync(
      expression,
      mergeData,
      true
    ));
  }

  if (isStop) {
    return;
  }

  // Support expressions >=1.10.0
  let preventDefault = false;
  if (action.preventDefault) {
    preventDefault = await evalExpressionWithConditionBuilderAsync(
      action.preventDefault,
      mergeData,
      false
    );
  }

  let key = {
    componentId: dataMapping(action.componentId, mergeData),
    componentName: dataMapping(action.componentName, mergeData)
  };

// Compatible with args package usage
  if (action.actionType === 'dialog') {
    action.dialog = {...(action.dialog ?? action.args?.dialog)};
    delete action.args?.dialog;
  } else if (action.actionType === 'drawer') {
    action.drawer = {...(action.drawer ?? action.args?.drawer)};
    delete action.args?.drawer;
  } else if (['ajax', 'download'].includes(action.actionType)) {
    const api = action.api ?? action.args?.api;
    action.api = typeof api === 'string' ? api : {...api};
    action.options = {...(action.options ?? action.args?.options)};
    action.messages = {...(action.messages ?? action.args?.messages)};
    delete action.args?.api;
    delete action.args?.options;
    delete action.args?.messages;
  }
  const cmptFlag = key.componentId || key.componentName;
  let targetComponent = cmptFlag
    ? event.context.scoped?.[
        action.componentId ? 'getComponentById' : 'getComponentByName'
      ](cmptFlag)
    : renderer;
  // Action Configuration
  const args = dataMapping(action.args, mergeData, (key: string) => {
    const actionIgnoreKey: MappingIgnoreMap = {
      ajax: ['adaptor', 'responseAdaptor', 'requestAdaptor', 'responseData']
    };
    const cmptIgnoreMap: MappingIgnoreMap = {
      'input-table': ['condition'],
      'table': ['condition'],
      'table2': ['condition'],
      'crud': ['condition'],
      'combo': ['condition'],
      'list': ['condition'],
      'cards': ['condition']
    };
    const curCmptType: string = targetComponent?.props?.type;
    const curActionType: string = action.actionType;
    const ignoreKey = [
      ...(actionIgnoreKey[curActionType] || []),
      ...(cmptIgnoreMap[curCmptType] || [])
    ];
    return ignoreKey.includes(key);
  });
  const afterMappingData = dataMapping(action.data, mergeData);

  // Action data
  const actionData =
    args && Object.keys(args).length
      ? omit(
          {
            ...args, // Compatible with history (when action configuration and data are mixed)
            ...(afterMappingData ?? {})
          },
          getOmitActionProp(action.actionType)
        )
      : afterMappingData;

  //Defaults to the current data domain
  const data =
    actionData !== undefined &&
    !['ajax', 'download', 'dialog', 'drawer'].includes(action.actionType) // Avoid illegal configuration from affecting the judgment of actionData, resulting in data mapping failure in action configuration
      ? actionData
      : mergeData;

  console.group?.(`run action ${action.actionType}`);
  console.debug(`[${action.actionType}] action args, data`, args, data);

  debug('action', `run action ${action.actionType} with args`, args);
  debug('action', `run action ${action.actionType} with data`, data);

  let stopped = false;
  const actionResult = await actionInstrance.run(
    {
      ...action,
      args,
      rawData: actionConfig.data,
      data: action.actionType === 'reload' ? actionData : data, // If it is a refresh action, only action is passed action.data
      ...key
    },
    renderer,
    event,
    mergeData
  );
  // If the secondary confirmation pop-up window is cancelled, the subsequent actions will be terminated
  if (action?.actionType === 'confirmDialog' && !actionResult) {
    stopped = true;
    preventDefault = true; // This is more meaningful for form item changes. For example, a confirmation pop-up window pops up when a switch is switched. If you cancel it, you cannot modify the switch.
  }

  let stopPropagation = false;
  if (action.stopPropagation) {
    stopPropagation = await evalExpressionWithConditionBuilderAsync(
      action.stopPropagation,
      mergeData,
      false
    );
  }
  console.debug(`[${action.actionType}] action end event`, event);
  console.groupEnd?.();

  // Prevent the original action from being executed
  preventDefault && event.preventDefault();
// Prevent subsequent actions from being executed
  (stopPropagation || stopped) && event.stopPropagation();
};

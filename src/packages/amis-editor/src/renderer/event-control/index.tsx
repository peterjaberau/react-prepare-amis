import React from 'react';
import {findDOMNode} from 'react-dom';
import cx from 'classnames';
import Sortable from 'sortablejs';
import {
  DataSchema,
  FormItem,
  Icon,
  TooltipWrapper,
  render as amisRender,
  Tooltip,
  PopOverContainer,
  Tree,
  Button
} from 'amis';
import cloneDeep from 'lodash/cloneDeep';
import groupBy from 'lodash/groupBy';
import {
  FormControlProps,
  JSONTraverse,
  JSONValueMap,
  Schema,
  autobind,
  findTree,
  getRendererByName,
  guid
} from 'amis-core';
import ActionDialog from './action-config-dialog';
import {
  getEventDesc,
  getEventStrongDesc,
  getEventLabel,
  updateCommonUseActions,
  getActionsByRendererName
} from './helper';
import {
  findActionNode,
  findSubActionNode,
  getActionType,
  getPropOfAcion
} from './eventControlConfigHelper';
import {SELECT_PROPS_CONTAINER} from './constants';
import {
  ActionConfig,
  ActionEventConfig,
  ComponentInfo,
  ContextVariables
} from './types';
import {
  EditorManager,
  PluginActions,
  PluginEvents,
  RendererPluginAction,
  RendererPluginEvent,
  SubRendererPluginAction,
  IGlobalEvent
} from 'amis-editor-core';
export * from './helper';
import {i18n as _i18n} from 'i18n-runtime';
import {reaction} from 'mobx';
import {updateComponentContext} from 'amis-editor-core';
import type {VariableItem} from 'amis-ui';

interface EventControlProps extends FormControlProps {
  manager: EditorManager;
  actions: PluginActions; // component action list
  events: PluginEvents; // component event list
  actionTree: RendererPluginAction[]; // Action tree
  commonActions?: {[propName: string]: RendererPluginAction}; // Common action Map
  value: ActionEventConfig; // event action configuration
  onChange: (
    value: any,
    submitOnChange?: boolean,
    changeImmediately?: boolean
  ) => void;
  addBroadcast?: (event: RendererPluginEvent) => void;
  removeBroadcast?: (eventName: string) => void;
  getComponents: (action: any) => ComponentInfo[]; // Current page component tree
  getContextSchemas?: (id?: string, withoutSuper?: boolean) => DataSchema; // Get context
  actionConfigInitFormatter?: (actionConfig: ActionConfig) => ActionConfig; // Formatting when action configuration is initialized
  actionConfigSubmitFormatter?: (
    actionConfig: ActionConfig,
    type?: string,
    actionData?: ActionData,
    schema?: Schema
  ) => ActionConfig; // Formatting when action configuration is submitted
  owner?: string; // component identifier

  // Listen for panel submission events
  // Triggered after changes are made but before they are written to the store
  subscribeSchemaSubmit: (
    fn: (schema: any, value: any, id: string, diff?: any) => any,
    once?: boolean
  ) => () => void;
}

interface EventDialogData {
  eventName: string;
  eventLabel: string;
  isBroadcast: boolean;
  debounceConfig?: {
    open: boolean;
    wait?: number;
  };
  trackConfig?: {
    open: boolean;
    id: string;
    name: string;
  };
  [propName: string]: any;
}

export interface ActionData {
  eventKey: string;
  actionIndex?: number;
  action?: ActionConfig;
  variables?: ContextVariables[];
  pluginActions: PluginActions;
  getContextSchemas?: (id?: string, withoutSuper?: boolean) => DataSchema;
  groupType?: string;
  __actionDesc?: string;
  __cmptTreeSource?: ComponentInfo[];
  __superCmptTreeSource?: ComponentInfo[];
  __actionSchema?: any;
  __subActions?: SubRendererPluginAction[];
  __setValueDs?: any[];
  [propName: string]: any;
}

interface EventControlState {
  onEvent: ActionEventConfig;
  events: RendererPluginEvent[];
  eventPanelActive: {
    [prop: string]: boolean;
  };
  showAcionDialog: boolean;
  showEventDialog: boolean;
  eventDialogData?: EventDialogData;
  actionData: ActionData | undefined;
  type: 'update' | 'add';
  appLocaleState?: number;
  actionRelations: any;
  globalEvents: IGlobalEvent[];
}

const dialogObjMap = {
  dialogue: 'dialogue',
  drawer: 'drawer',
  confirmDialog: ['dialog', 'args']
};

export class EventControl extends React.Component<
  EventControlProps,
  EventControlState
> {
  target: HTMLElement | null;
  eventPanelSortMap: {
    [prop: string]: Sortable;
  } = {};
  drag?: HTMLElement | null;
  unReaction: any;
  unEventReaction: any;
  submitSubscribers: Array<(value: any) => any> = [];

  constructor(props: EventControlProps) {
    super(props);
    const {events, value, data, rawType} = props;
    const editorStore = props.manager.store;
    const globalEvents = editorStore.globalEvents;
    const eventPanelActive: {
      [prop: string]: boolean;
    } = {};

    const tmpEvents =
      events[
        rawType || (!data.type || data.type === 'text' ? 'plain' : data.type)
      ] || [];
    const pluginEvents =
      typeof tmpEvents === 'function' ? tmpEvents(data) : [...tmpEvents];

    pluginEvents.forEach((event: RendererPluginEvent) => {
      eventPanelActive[event.eventName] = true;
    });

    const actionRelations = this.getActionRelations();
    globalEvents?.forEach(event => {
      eventPanelActive[event.name] = true;
    });

    this.state = {
      onEvent: value ?? this.generateEmptyDefault(pluginEvents),
      events: pluginEvents,
      eventPanelActive,
      showAcionDialog: false,
      showEventDialog: false,
      actionData: undefined,
      type: 'add',
      appLocaleState: 0,
      actionRelations: actionRelations ?? [],
      globalEvents: globalEvents
    };
  }

  componentDidMount(): void {
    const editorStore = this.props.manager.store;
    this.unReaction = reaction(
      () => editorStore?.appLocaleState,
      () => {
        this.setState({
          appLocaleState: editorStore?.appLocaleState
        });
      }
    );
    this.unEventReaction = reaction(
      () => editorStore.globalEvents,
      () => {
        this.setState({
          globalEvents: editorStore.globalEvents
        });
      }
    );
  }

  componentWillUnmount() {
    this.unReaction?.();
    this.unEventReaction?.();
    this.submitSubscribers = [];
  }

  componentDidUpdate(
    prevProps: EventControlProps,
    prevState: EventControlState
  ) {
    const {value, data, events, rawType} = this.props;

    if (value !== prevProps.value) {
      this.setState({onEvent: value});
    }

    if (
      data?.type !== prevProps.data?.type ||
      data?.onEvent !== prevProps.data?.onEvent
    ) {
      const tmpEvents =
        events[
          rawType || (!data.type || data.type === 'text' ? 'plain' : data.type)
        ] || [];
      const pluginEvents =
        typeof tmpEvents === 'function' ? tmpEvents(data) : [...tmpEvents];
      const actionRelations = this.getActionRelations();

      this.setState({
        events: pluginEvents,
        actionRelations: actionRelations
      });
    }
  }

  @autobind
  subscribeSubmit(subscriber: (value: any) => any) {
    const fn = (value: any) => subscriber?.(value) || value;
    this.submitSubscribers.push(fn);
    return () => {
      const idx = this.submitSubscribers.indexOf(fn);
      this.submitSubscribers.splice(idx, 1);
    };
  }

  generateEmptyDefault(events: RendererPluginEvent[]) {
    const onEvent: ActionEventConfig = {};
    events.forEach((event: RendererPluginEvent) => {
      if (event.defaultShow) {
        onEvent[`${event.eventName}`] = {
          __isBroadcast: !!event.isBroadcast,
          weight: 0,
          actions: []
        };
      }
    });
    // Object.keys(onEvent).length && props.onChange && props.onChange(onEvent);

    return Object.keys(onEvent).length ? onEvent : {};
  }

  addEvent(event: RendererPluginEvent, disabled: boolean) {
    const {onChange} = this.props;
    let onEvent = {
      ...this.state.onEvent
    };
    if (disabled) {
      return;
    }
    onEvent[`${event.eventName}`] = {
      __isBroadcast: !!event.isBroadcast,
      weight: 0,
      actions: []
    };
    this.setState({
      onEvent: onEvent
    });

    onChange && onChange(onEvent);
  }

  addGlobalEvent(event: IGlobalEvent, disabled: boolean) {
    const {onChange} = this.props;
    let onEvent = {
      ...this.state.onEvent
    };
    if (disabled) {
      return;
    }
    onEvent[`${event.name}`] = {
      weight: 0,
      actions: []
    };
    this.setState({
      onEvent: onEvent
    });

    onChange && onChange(onEvent);
  }

  activeEventDialog(eventInfo: EventDialogData) {
    eventInfo = cloneDeep(eventInfo);
    if (!eventInfo.debounce) {
      //Default value of anti-shake configuration
      eventInfo.debounce = {
        open: false,
        wait: 100
      };
    } else {
      eventInfo.debounce = {
        open: true,
        ...eventInfo.debounce
      };
    }
    if (!eventInfo.track) {
      eventInfo.track = {
        open: false
      };
    } else {
      eventInfo.track = {
        open: true,
        ...eventInfo.track
      };
    }
    this.setState({
      eventDialogData: eventInfo,
      showEventDialog: true
    });
  }

  eventDialogSubmit(formData: any) {
    const {onChange} = this.props;
    const {eventName, debounce = {}, track = {}} = formData;
    let onEvent = {
      ...this.state.onEvent
    };
    let eventConfig = {...onEvent[`${eventName}`]};
    if (!debounce.open) {
      delete eventConfig.debounce;
    } else {
      eventConfig = {
        ...eventConfig,
        debounce: {
          wait: debounce.wait
        }
      };
    }
    if (!track.open) {
      delete eventConfig.track;
    } else {
      eventConfig = {
        ...eventConfig,
        track: {
          id: track.id,
          name: track.name
        }
      };
    }

    onEvent[`${eventName}`] = {
      ...eventConfig
    };
    this.setState({
      onEvent,
      showEventDialog: false
    });
    onChange && onChange(onEvent);
  }

  delEvent(event: string) {
    const {onChange} = this.props;
    let onEvent = {
      ...this.state.onEvent
    };
    delete onEvent[event];
    this.setState({
      onEvent: onEvent
    });

    onChange && onChange(onEvent);
  }

  addAction(event: string, config: any) {
    const {addBroadcast, owner} = this.props;
    const {onEvent, eventPanelActive} = this.state;
    let onEventConfig = {...onEvent};
    let activeConfig = {...eventPanelActive};

    if (config.actionType === 'broadcast') {
      typeof addBroadcast === 'function' &&
        addBroadcast({
          owner: owner, // TODO: mark the source
          isBroadcast: true,
          eventName: config.eventName,
          eventLabel: config.eventLabel,
          description: config.description
        });
    }
    activeConfig[event] = true;
    if (config.actionType) {
      onEventConfig[event] = {
        ...onEventConfig[event],
        actions: (onEventConfig[event]?.actions || []).concat(
          // Temporary processing, so many interactive attributes will be removed later
          Object.defineProperties(config, {
            __cmptTreeSource: {
              enumerable: false
            },
            __nodeSchema: {
              enumerable: false
            },
            __subActions: {
              enumerable: false
            }
          })
        )
      };
    }

    this.setState({
      onEvent: onEventConfig,
      eventPanelActive: activeConfig
    });
    this.initDragging();
    this.props.onChange && this.props.onChange(onEventConfig);
  }

  updateAction(event: string, index: number, config: any) {
    this.updateValue(event, index, config);
  }

  delAction(event: string, action: any, index: number) {
    const {onEvent, eventPanelActive} = this.state;
    const {removeBroadcast} = this.props;

    let onEventConfig = {...onEvent};
    let activeConfig = {...eventPanelActive};

    // Delete the corresponding broadcast
    if (action.actionType === 'broadcast') {
      typeof removeBroadcast === 'function' &&
        removeBroadcast(action.eventName);
    }

    onEventConfig[event] = {
      ...onEventConfig[event],
      actions: onEventConfig[event].actions.filter(
        (item, actionIndex) => index !== actionIndex
      )
    };

    if (onEventConfig[event].actions.length < 1) {
      activeConfig[event] = false;
      this.setState({
        eventPanelActive: activeConfig
      });
      this.eventPanelSortMap[event]?.destroy();
    }

    this.setState({
      onEvent: onEventConfig
    });

    this.props.onChange && this.props.onChange(onEventConfig);
  }

  toggleActivePanel(eventKey: string) {
    const {eventPanelActive} = this.state;
    eventPanelActive[eventKey] = !eventPanelActive[eventKey];
    if (!eventPanelActive[eventKey]) {
      this.eventPanelSortMap[eventKey]?.destroy();
    }
    this.setState({eventPanelActive}, () => {
      this.initDragging();
    });
  }

  updateWeight(event: string, data: any) {
    const {onEvent} = this.state;
    let onEventConfig = {...onEvent};
    onEventConfig[event] = {
      ...onEventConfig[event],
      weight: data.weight || 0
    };

    this.setState({
      onEvent: onEventConfig
    });
  }

  /**
   * Update event configuration
   *
   * @param {string} event
   * @param {number} actionIndex
   * @param {*} config
   * @memberof EventControl
   */
  async updateValue(event: string, index: number, config: any) {
    const {onEvent} = this.state;
    let emptyEventAcion = {...onEvent};
    let onEventConfig = {...onEvent};

    emptyEventAcion[event] = {
      actions: onEvent[event].actions.map((item, actionIndex) => {
        return actionIndex === index ? {actionType: ''} : item;
      }),
      weight: onEvent[event].weight
    };
    onEventConfig[event] = {
      ...onEvent[event],
      actions: onEvent[event].actions.map((item, actionIndex) => {
        return actionIndex === index
          ? typeof config === 'string'
            ? {
                ...item,
                actionType: config
              }
            : Object.defineProperties(config, {
                __cmptTreeSource: {
                  enumerable: false
                },
                __nodeSchema: {
                  enumerable: false
                },
                __subActions: {
                  enumerable: false
                }
              })
          : item;
      })
    };
    this.setState({
      onEvent: onEventConfig
    });
    this.props.onChange && this.props.onChange(onEventConfig);
  }

  @autobind
  dragRef(ref: any) {
    if (!this.drag && ref) {
      this.initDragging();
    } else if (this.drag && !ref) {
      this.destroyDragging();
    }
    this.drag = ref;
  }

  initDragging() {
    this.eventPanelSortMap = {};
    const dom = findDOMNode(this) as HTMLElement;
    const {onEvent, eventPanelActive} = this.state;
    const eventPanel: object[] = Array.prototype.slice.call(
      dom.getElementsByClassName('item-content')
    );
    // Find the activated event panel
    Object.keys(onEvent)
      .filter((key: string) => {
        return onEvent[key]?.actions?.length && eventPanelActive[key];
      })
      .forEach((key: string, index: number) => {
        if (!this.eventPanelSortMap[key]) {
          this.eventPanelSortMap[key] = this.genSortPanel(
            key,
            eventPanel[index] as HTMLElement
          );
        }
      });
  }

  genSortPanel(eventKey: string, ele: HTMLElement) {
    return new Sortable(ele, {
      group: 'eventControlGroup',
      animation: 150,
      handle: '.ae-option-control-item-dragBar',
      ghostClass: 'ae-option-control-item--dragging',
      onEnd: (e: any) => {
        // No movement
        if (e.newIndex === e.oldIndex) {
          return;
        }
        // Switch back
        const parent = e.to as HTMLElement;
        if (e.oldIndex < parent.childNodes.length - 1) {
          parent.insertBefore(
            e.item,
            parent.childNodes[
              e.oldIndex > e.newIndex ? e.oldIndex + 1 : e.oldIndex
            ]
          );
        } else {
          parent.appendChild(e.item);
        }
        let onEventConfig = cloneDeep(this.state.onEvent);
        const newEvent = onEventConfig[eventKey];
        let options = newEvent?.actions.concat();
        // Move from back to front
        options.splice(e.newIndex, 0, options.splice(e.oldIndex, 1)[0]);
        onEventConfig[eventKey] = {
          ...onEventConfig[eventKey],
          actions: options
        };
        this.setState({
          onEvent: onEventConfig
        });
        this.props.onChange && this.props.onChange(onEventConfig);
      }
    });
  }

  destroyDragging() {
    Object.keys(this.eventPanelSortMap).forEach((key: string) => {
      this.eventPanelSortMap[key]?.el && this.eventPanelSortMap[key]?.destroy();
    });
  }

  buildEventDataSchema(data: any, manager: EditorManager) {
    const {
      actionTree,
      actions: pluginActions,
      commonActions,
      allComponents
    } = this.props;
    const {events, onEvent, globalEvents} = this.state;
    const eventConfig = events.find(
      item => item.eventName === data.actionData!.eventKey
    );
    const globalEventConfig = globalEvents?.find(
      item => item.name === data.actionData!.eventKey
    );
    // Collect the current event action parameters
    let actions = onEvent[data.actionData!.eventKey]?.actions;

    // When editing, you can only get the event variables of the action before the current action and the current action event
    if (data.type === 'update') {
      actions = actions.slice(
        0,
        data.actionData!.actionIndex !== undefined
          ? data.actionData!.actionIndex + 1
          : 0
      );
    }

    let jsonSchema: any = {};

    if (globalEventConfig) {
      jsonSchema = {
        type: 'object',
        properties: {
          data: {
            type: 'object',
            title: 'Data',
            properties: (globalEventConfig.mapping || []).reduce(
              (acc: any, item) => {
                acc[item.key] = {
                  type: item.type,
                  title: `${item.key}(global event parameter)`
                };
                return acc;
              },
              {}
            )
          }
        }
      };
    } else {
      // Dynamically construct event parameters
      if (typeof eventConfig?.dataSchema === 'function') {
        jsonSchema = eventConfig.dataSchema(manager)?.[0];
      } else {
        jsonSchema = {...(eventConfig?.dataSchema?.[0] ?? {})};
      }
    }

    actions
      ?.filter(item => item.outputVar)
      ?.forEach((action: ActionConfig, index: number) => {
        if (
          manager.dataSchema.getScope(
            `action-output-${action.actionType}_ ${index}`
          )
        ) {
          return;
        }

        const actionLabel = getPropOfAcion(
          action,
          'actionLabel',
          actionTree,
          pluginActions,
          commonActions,
          allComponents
        );
        const actionSchema = getPropOfAcion(
          action,
          'outputVarDataSchema',
          actionTree,
          pluginActions,
          commonActions,
          allComponents
        );

        jsonSchema = {
          ...jsonSchema,
          properties: {
            ...jsonSchema.properties,
            data: {
              type: 'object',
              title: 'Data',
              ...jsonSchema.properties?.data,
              properties: {
                ...jsonSchema.properties?.data?.properties,
                [action.outputVar!]: {
                  ...(Array.isArray(actionSchema) && (actionSchema[0] || {})),
                  title: `${action.outputVar}(${actionLabel} action output parameter)`
                }
              }
            }
          }
        };
      });

    if (manager.dataSchema.getScope('event-variable')) {
      manager.dataSchema.removeScope('event-variable');
    }

    manager.dataSchema.addScope(
      {
        type: 'object',
        properties: {
          event: {
            ...jsonSchema,
            title: 'Event Action'
          }
        }
      },
      'event-variable'
    );
  }

  async buildContextSchema(data: any) {
    const {manager, node: currentNode} = this.props;
    let variables = [];

    // Get the context
    await manager.getContextSchemas(currentNode.id);
    //Add event related
    // this.buildActionDataSchema(data, manager);
    this.buildEventDataSchema(data, manager);
    (manager.dataSchema as DataSchema).switchTo('event-variable');
    variables = (manager.dataSchema as DataSchema).getDataPropsAsOptions();

    // Insert application variables
    const appVariables =
      manager?.variableManager?.getVariableFormulaOptions() || [];
    appVariables.forEach(item => {
      if (Array.isArray(item?.children) && item.children.length) {
        variables.push(item);
      }
    });

    return updateComponentContext(variables);
  }

  // Invoke action configuration pop-up window
  async activeActionDialog(
    data: Pick<EventControlState, 'showAcionDialog' | 'type' | 'actionData'>
  ) {
    const {
      actions: pluginActions,
      getContextSchemas,
      actionConfigInitFormatter,
      getComponents,
      actionTree,
      allComponents,
      manager,
      node: currentNode
    } = this.props;

    // Build context variable schema
    const variables = await this.buildContextSchema(data);

    // Edit operation, requires formatting action configuration
    if (data.type === 'update') {
      const action = data.actionData!.action!;
      const actionConfig = await actionConfigInitFormatter?.(action);
      const actionNode = findActionNode(actionTree, actionConfig?.actionType!);
      const hasSubActionNode = findSubActionNode(actionTree, action.actionType);
      const supportComponents = getComponents(actionNode!);
      const node = findTree(
        supportComponents,
        item => item.value === action.componentId
      );

      // Get the variable field of the assigned component
      let setValueDs: any = null;
      if (
        actionConfig?.actionType === 'setValue' &&
        node?.id &&
        SELECT_PROPS_CONTAINER.includes(node?.type || '')
      ) {
        // Get the target component data domain
        const contextSchema: any = await manager.getContextSchemas(
          node.id,
          true
        );
        const dataSchema = new DataSchema(contextSchema || []);
        const targetVariables = dataSchema?.getDataPropsAsOptions() || [];

        setValueDs = targetVariables?.filter(
          (item: ContextVariables) => item.value !== '$$id'
        );
      }

      const actionGroupType = actionConfig?.__actionType || action.actionType;

      data.actionData = {
        eventKey: data.actionData!.eventKey,
        actionIndex: data.actionData!.actionIndex,
        variables,
        pluginActions,
        getContextSchemas,
        ...actionConfig,
        groupType: actionGroupType,
        __actionDesc: actionNode?.description ?? '', // tree node description
        __actionSchema: actionNode!.schema, // tree node schema
        __subActions: hasSubActionNode?.actions, // Tree node sub-actions
        __cmptTreeSource: supportComponents ?? [],
        // __dialogActions: manager.store.modalOptions,
        __superCmptTreeSource: allComponents,
        // __supersCmptTreeSource: '',
        __setValueDs: setValueDs
        // broadcastId: action.actionType === 'broadcast' ? action.eventName : ''
      };

      // The selected item automatically scrolls to the visible position
      setTimeout(
        () =>
          document
            .querySelector('.action-tree li .is-checked')
            ?.scrollIntoView(),
        0
      );
    } else {
      data.actionData = {
        eventKey: data.actionData!.eventKey,
        variables,
        pluginActions,
        getContextSchemas,
        __superCmptTreeSource: allComponents,
        __dialogActions: manager.store.modalOptions
      };
    }
    this.setState(data);
  }

  // Rendering description information
  renderDesc(action: ActionConfig, actionIndex: number, eventKey: string) {
    const {
      actions: pluginActions,
      actionTree,
      commonActions,
      getComponents,
      allComponents
    } = this.props;
    const desc = getPropOfAcion(
      action,
      'descDetail',
      actionTree,
      pluginActions,
      commonActions,
      allComponents
    );
    let info = {...action};
    // Get the configuration of the action tree node according to the sub-action type
    const hasSubActionNode = findSubActionNode(actionTree, action.actionType);
    const actionType = getActionType(action, hasSubActionNode);
    const actionNode = actionType && findActionNode(actionTree, actionType);

    if (action.componentId && actionNode) {
      const supportComponents = getComponents(actionNode);
      const node = findTree(
        supportComponents,
        item => item.value === action.componentId
      );
      if (node) {
        info = {
          ...info,
          rendererLabel: node.label
        };
      }
    }

    return typeof desc === 'function' ? (
      <div className="action-control-content">
        {desc?.(
          info,
          {
            actionIndex,
            eventKey
          },
          this.props
        ) || '-'}
      </div>
    ) : null;
  }

  @autobind
  onSubmit(type: string, config: any) {
    const {actionConfigSubmitFormatter, manager} = this.props;
    const {actionData} = this.state;
    const store = manager.store;

    let action =
      actionConfigSubmitFormatter?.(config, type, actionData, store.schema) ??
      config;

    action = this.submitSubscribers.reduce(
      (action, fn) => fn(action) || action,
      action
    );

    delete action.__actionSchema;
    if (type === 'add') {
      this.addAction?.(config.eventKey, action);
    } else if (type === 'update') {
      this.updateAction?.(config.eventKey, config.actionIndex, action);
    }

    updateCommonUseActions({
      label: action.__title,
      value: config.actionType,
      use: 1
    });

    this.removeDataSchema();
    this.setState({showAcionDialog: false});
    this.setState({actionData: undefined});
  }

  @autobind
  onClose() {
    this.removeDataSchema();
    this.setState({showAcionDialog: false});
    this.unSubscribeSchemaSubmit?.();
    delete this.unSubscribeSchemaSubmit;
  }

  unSubscribeSchemaSubmit?: () => void;
  @autobind
  subscribeSchemaSubmit(
    fn: (schema: any, value: any, id: string, diff?: any) => any,
    once?: boolean
  ) {
    this.unSubscribeSchemaSubmit = this.props.subscribeSchemaSubmit(fn, once);
    return this.unSubscribeSchemaSubmit;
  }

  removeDataSchema() {
    const {manager} = this.props;

    // Delete event
    if (manager.dataSchema.getScope('event-variable')) {
      manager.dataSchema.removeScope('event-variable');
    }
  }

  renderActionType(action: any, actionIndex: number, eventKey: string) {
    const {
      actionTree,
      actions: pluginActions,
      commonActions,
      allComponents,
      node,
      manager
    } = this.props;

    return (
      <span>
        {getPropOfAcion(
          action,
          'actionLabel',
          actionTree,
          pluginActions,
          commonActions,
          allComponents
        ) || action.actionType}
      </span>
    );
  }

  getActionRelations() {
    const {actions: pluginActions, data, manager} = this.props;
    const actions = getActionsByRendererName(pluginActions, data?.type);
    const schema = manager.store.schema;
    let prevs: any[] = [];

    JSONValueMap(schema, (value: any, key: string, host: any) => {
      if (key === 'onEvent') {
        const hostName =
          host.title ?? host.label ?? host.name ?? host.type ?? host.id;
        const hostId = host.$$id;

        Object.keys(value)?.forEach(eventKey => {
          if (eventKey !== '$$id') {
            value[eventKey]?.actions?.forEach((ac: any) => {
              const matchAction = actions?.find(
                item => item.actionType === ac.actionType
              );
              if (matchAction && ac.componentId === data.id) {
                // If different events call the same component and the same action, they will not be recorded
                const isHas = prevs?.find(
                  item =>
                    item.hostId === hostId && item.actionType === ac.actionType
                );
                if (!isHas) {
                  prevs.push({
                    actionType: matchAction.actionType,
                    actionLabel: matchAction.actionLabel,
                    hostName,
                    hostId
                  });
                }
              }
            });
          }
        });
      }
      return value;
    });

    const prevsGroup = groupBy(prevs, item => item.actionLabel);
    let actionRelations: any = [];
    Object.keys(prevsGroup)?.forEach(key => {
      actionRelations.push({
        label: key,
        value: key,
        icon: 'fa fa-bolt',
        children: prevsGroup[key]?.map(item => ({
          label: item.hostName,
          value: item.hostId,
          icon: ''
        }))
      });
    });

    return actionRelations;
  }

  @autobind
  handleRelationComponentActive(componentId: string) {
    const {manager} = this.props;
    manager.store.setActiveId(componentId);
  }

  render() {
    const {
      actionTree,
      actions: pluginActions,
      commonActions,
      getComponents,
      render
    } = this.props;
    const {
      onEvent,
      events: itemEvents,
      globalEvents,
      eventPanelActive,
      showAcionDialog,
      showEventDialog,
      type,
      actionData,
      eventDialogData
    } = this.state;
    const eventSnapshot = {...onEvent};
    const {showOldEntry} = this.props;
    const eventKeys = Object.keys(eventSnapshot);

    let commonEvents: RendererPluginEvent[] = [];
    if (getRendererByName(this.props?.data?.type)?.isFormItem) {
      commonEvents = [
        {
          eventName: 'formItemValidateSucc',
          eventLabel: 'Verification successful',
          description: 'Triggered after form item verification succeeds',
          dataSchema: [
            {
              type: 'object',
              properties: {
                data: {
                  type: 'object',
                  title: 'Data',
                  description:
                    'The current form data can be read through the field name'
                }
              }
            }
          ]
        },
        {
          eventName: 'formItemValidateError',
          eventLabel: 'Verification failed',
          description: 'Triggered after form item validation fails',
          dataSchema: [
            {
              type: 'object',
              properties: {
                data: {
                  type: 'object',
                  title: 'Data',
                  description:
                    'The current form data can be read through the field name'
                }
              }
            }
          ]
        }
      ];
    }
    const events = [...itemEvents, ...commonEvents];

    return (
      <div className="ae-event-control">
        <header
          className={cx({
            'ae-event-control-header': true,
            'ae-event-control-header-m':
              this.props.data.type === 'button' && showOldEntry,
            'no-bd-btm': !eventKeys.length
          })}
        >
          {this.state.actionRelations?.length ? (
            <PopOverContainer
              popOverContainer={() => document.body}
              popOverRender={({onClose}) => (
                <div className="ae-action-relation-panel">
                  <Tree
                    options={this.state.actionRelations}
                    className="variables-select-panel-tree"
                    onChange={this.handleRelationComponentActive}
                    onlyChildren={true}
                    value=""
                  />
                </div>
              )}
            >
              {({onClick, ref, isOpened}) => {
                return (
                  <TooltipWrapper
                    tooltipClassName="ae-event-item-header-tip"
                    trigger="hover"
                    placement="top"
                    tooltip="You can see which components will call which actions of the current component"
                  >
                    <Button className="block w-full mb-2" onClick={onClick}>
                      View call relationship
                    </Button>
                  </TooltipWrapper>
                );
              }}
            </PopOverContainer>
          ) : null}
          {render(
            'dropdown',
            {
              type: 'dropdown-button',
              level: 'enhance',
              label: 'Add event',
              disabled: false,
              className: 'block w-full add-event-dropdown',
              closeOnClick: true,
              buttons: [
                ...events.map(item => ({
                  type: 'button',
                  disabledTip: 'You have added this event',
                  tooltipPlacement: 'left',
                  disabled: Object.keys(onEvent).includes(item.eventName),
                  actionType: '',
                  label: item.eventLabel,
                  onClick: this.addEvent.bind(
                    this,
                    item,
                    Object.keys(onEvent).includes(item.eventName)
                  )
                })),
                ...globalEvents.map(item => ({
                  type: 'button',
                  disabledTip: 'You have added this global event',
                  tooltipPlacement: 'left',
                  disabled: Object.keys(onEvent).includes(item.name),
                  actionType: '',
                  className: 'add-event-dropdown-global-event',
                  label: item.label,
                  onClick: this.addGlobalEvent.bind(
                    this,
                    item,
                    Object.keys(onEvent).includes(item.name)
                  )
                }))
              ]
            },
            {
              popOverContainer: null // amis renders the mounted node and uses this.target
            }
          )}
        </header>
        <ul
          className={cx({
            'ae-event-control-content': true,
            'ae-event-control-content-m':
              (this.props.data.type === 'button' && showOldEntry) ||
              this.state.actionRelations?.length,
            'ae-event-control-content-l':
              this.props.data.type === 'button' &&
              showOldEntry &&
              !!this.state.actionRelations?.length
          })}
          ref={this.dragRef}
        >
          {eventKeys.length ? (
            eventKeys.map((eventKey, eventIndex) => {
              const globalEvent = globalEvents.find(i => i.name === eventKey);
              return (
                <li className="event-item" key={`content_${eventIndex}`}>
                  <div
                    className={cx({
                      'event-item-header': true,
                      'no-bd-btm':
                        !(
                          eventSnapshot[eventKey]?.actions?.length &&
                          eventPanelActive[eventKey]
                        ) && !getEventStrongDesc(events, eventKey)
                    })}
                  >
                    <TooltipWrapper
                      tooltipClassName="ae-event-item-header-tip"
                      trigger="hover"
                      placement="top"
                      tooltip={{
                        children: () => (
                          <div>
                            {getEventDesc(events, eventKey) ||
                              getEventStrongDesc(events, eventKey) ||
                              eventKey}
                          </div>
                        )
                      }}
                    >
                      {!globalEvent ? (
                        <div>{getEventLabel(events, eventKey) || eventKey}</div>
                      ) : (
                        <div className="event-label">
                          <span className="global-event-tip">
                            <span>Global Events</span>
                          </span>
                          <span className="event-label-key">
                            {globalEvent.label || eventKey}
                          </span>
                        </div>
                      )}
                    </TooltipWrapper>
                    <div className="event-item-header-toolbar">
                      <div
                        onClick={this.activeActionDialog.bind(this, {
                          showAcionDialog: true,
                          type: 'add',
                          actionData: {
                            eventKey
                          }
                        })}
                      >
                        <Icon className="icon" icon="add-btn" />
                      </div>
                      <div onClick={this.delEvent.bind(this, eventKey)}>
                        <Icon className="icon" icon="delete-bold-btn" />
                      </div>
                      <div
                        onClick={this.activeEventDialog.bind(this, {
                          eventName: eventKey,
                          eventLabel:
                            getEventLabel(events, eventKey) || eventKey,
                          ...eventSnapshot[eventKey]
                        })}
                      >
                        <Icon className="icon" icon="event-setting" />
                      </div>
                      <div
                        onClick={this.toggleActivePanel.bind(this, eventKey)}
                      >
                        {eventPanelActive[eventKey] ? (
                          <Icon className="icon" icon="open-btn-r" />
                        ) : (
                          <Icon className="icon" icon="close-btn" />
                        )}
                      </div>
                    </div>
                  </div>
                  {getEventStrongDesc(events, eventKey)
                    ? render('alert', {
                        type: 'alert',
                        body:
                          'Warm Tips:' + getEventStrongDesc(events, eventKey),
                        level: 'info',
                        showCloseButton: true,
                        showIcon: true,
                        className: 'event-item-desc'
                      })
                    : null}
                  {eventSnapshot[eventKey]?.actions?.length &&
                  eventPanelActive[eventKey] ? (
                    <ul className="item-content">
                      {eventSnapshot[eventKey]?.actions?.map(
                        (action, actionIndex) => {
                          return (
                            <li
                              className="ae-option-control-item"
                              key={`item-content_${actionIndex}`}
                            >
                              <div className="action-control-header">
                                <div className="action-control-header-left">
                                  <div className="ae-option-control-item-dragBar">
                                    <Icon
                                      icon="drag-six-circle-btn"
                                      className="icon"
                                    />
                                  </div>
                                  <div className="action-item-actiontype">
                                    {this.renderActionType(
                                      action,
                                      actionIndex,
                                      eventKey
                                    )}
                                  </div>
                                  {action.description && (
                                    <TooltipWrapper
                                      trigger="hover"
                                      placement="top"
                                      tooltip={action.description}
                                    >
                                      <Icon
                                        icon="far fa-question-circle"
                                        className="flex justify-center items-center icon ml-0.5"
                                      />
                                    </TooltipWrapper>
                                  )}
                                </div>
                                <div className="action-control-header-right">
                                  <div
                                    onClick={this.activeActionDialog.bind(
                                      this,
                                      {
                                        showAcionDialog: true,
                                        type: 'update',
                                        actionData: {
                                          action,
                                          eventKey,
                                          actionIndex
                                        }
                                      }
                                    )}
                                  >
                                    <Icon className="icon" icon="setting" />
                                  </div>
                                  <div
                                    onClick={this.delAction.bind(
                                      this,
                                      eventKey,
                                      action,
                                      actionIndex
                                    )}
                                  >
                                    <Icon
                                      className="icon"
                                      icon="delete-easy-btn"
                                    />
                                  </div>
                                </div>
                              </div>
                              {this.renderDesc(action, actionIndex, eventKey)}
                            </li>
                          );
                        }
                      )}
                    </ul>
                  ) : null}
                </li>
              );
            })
          ) : (
            <div className="ae-event-control-placeholder">
              {/* Translation not effective, temporary solution*/}
              {_i18n('Go add events and make your product move')}
            </div>
          )}
        </ul>
        {amisRender(
          {
            type: 'dialog',
            title: `${eventDialogData?.eventLabel}-Event Configuration`,
            showCloseButton: false,
            body: [
              {
                type: 'form',
                title: 'Form',
                data: {
                  '&': '$$'
                },
                mode: 'horizontal',
                horizontal: {
                  left: 3,
                  right: 9
                },
                body: [
                  {
                    label: 'Event prevention',
                    type: 'switch',
                    name: 'debounce.open',
                    description:
                      'After enabling event duplicate prevention, only the last event will be executed if multiple events are triggered within the duplicate prevention time'
                  },
                  {
                    label: 'Anti-heavy time',
                    required: true,
                    hiddenOn: '!debounce.open',
                    name: 'debounce.wait',
                    suffix: 'ms',
                    max: 10000,
                    min: 0,
                    type: 'input-number'
                  },
                  {
                    label: 'Event tracking point',
                    type: 'switch',
                    name: 'track.open',
                    description:
                      'After turning on event tracking, tracking data will be sent to the background every time an event is triggered'
                  },
                  {
                    label: 'track-id',
                    required: true,
                    hiddenOn: '!track.open',
                    name: 'track.id',
                    type: 'input-text'
                  },
                  {
                    label: 'track-name',
                    required: true,
                    hiddenOn: '!track.open',
                    name: 'track.name',
                    type: 'input-text'
                  }
                ],
                onSubmit: this.eventDialogSubmit.bind(this)
              }
            ],
            actions: [
              {
                type: 'button',
                label: 'Cancel',
                onEvent: {
                  click: {
                    actions: [
                      {
                        actionType: 'custom',
                        script: () => {
                          this.setState({
                            showEventDialog: false
                          });
                        }
                      }
                    ]
                  }
                }
              },
              {
                type: 'button',
                actionType: 'confirm',
                label: 'Confirm',
                primary: true
              }
            ]
          },
          {
            data: eventDialogData,
            show: showEventDialog
          }
        )}
        <ActionDialog
          closeOnEsc={false}
          show={showAcionDialog}
          type={type}
          actionTree={actionTree}
          pluginActions={pluginActions}
          commonActions={commonActions}
          getComponents={getComponents}
          data={actionData}
          onSubmit={this.onSubmit}
          onClose={this.onClose}
          render={this.props.render}
          subscribeSchemaSubmit={this.subscribeSchemaSubmit}
          subscribeActionSubmit={this.subscribeSubmit}
        />
      </div>
    );
  }
}

@FormItem({
  type: 'ae-eventControl'
})
export class EventControlRenderer extends EventControl {}

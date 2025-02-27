/**
 * @file defines the interface of the plug-in and provides a BasePlugin base class to put some common methods here.
 */

import omit from 'lodash/omit';
import {RegionWrapperProps} from './component/RegionWrapper';
import {makeAsyncLayer} from './component/AsyncLayer';
import {EditorManager} from './manager';
import {EditorStoreType} from './store/editor';
import {EditorNodeType} from './store/node';
import {DNDModeInterface} from './dnd/interface';
import {EditorDNDManager} from './dnd';
import React from 'react';
import {DiffChange} from './util';
import find from 'lodash/find';
import {RAW_TYPE_MAP} from './util';
import type {GlobalVariableItem, RendererConfig, Schema} from '@/packages/amis-core/src';
// @ts-ignore
import type {MenuDivider, MenuItem} from '@/packages/amis-ui/src/components/ContextMenu';
import type {BaseSchema, SchemaCollection} from '@/packages/amis/src';
import type {AsyncLayerOptions} from './component/AsyncLayer';
// @ts-ignore
import type {SchemaType} from '@/packages/amis/src/Schema';

/**
 * Region definition, container renderers need to define region information.
 */
export interface RegionConfig {
  /**
   * In simple case, if the region is directly used render('region', subSchema)
   * This method can easily insert a Region node by just configuring the key.
   */
  key: string;

  /**
   * The name of the zone to be displayed.
   */
  label: string;

  /**
   * Area placeholder character, used for prompts
   */
  placeholder?: string | JSX.Element;

  /**
   * This configuration is required for complex controls.
   * If configured, traverse the react dom until the target node is replaced by a Region node
   *
   * If this is not configured, but the renderMethod method is configured,
   * Then just wrap the react dom returned in renderMethod with a layer of Region
   */
  matchRegion?: (
    elem: JSX.Element | undefined | null,
    component: JSX.Element
  ) => boolean;

  /**
   * Specifies which method to override.
   */
  renderMethod?: string;

  /**
   * Usually hacks the current renderer, but sometimes the current renderer is actually a combination of other renderers.
   */
  rendererName?: string;

  /**
   * When configuring renderMethod, Region will be automatically inserted.
   * The default is outer mode, sometimes you may need to configure it to inner mode.
   * For example, when renderMethod is render.
   */
  insertPosition?: 'outter' | 'inner';

  /**
   * Whether it is an optional container. If it is an optional container, members will not be forced to be automatically created.
   */
  optional?: boolean;

  /**
   * Sometimes some includes require other conditions, so you have to write the package logic yourself.
   * For example, renderBody in Panel
   */
  renderMethodOverride?: (
    regions: Array<RegionConfig>,
    insertRegion: (
      component: JSX.Element,
      home: JSX.Element,
      regions: Array<RegionConfig>,
      info: RendererInfo,
      manager: EditorManager
    ) => JSX.Element
  ) => Function;

  /**
   * What type of components do you prefer? For example, in a form, the controls container prefers the form item.
   */
  preferTag?: string;

  /**
   * Used to specify which component to wrap, the default is RegionWrapper
   */
  wrapper?: React.ComponentType<RegionWrapperProps>;

  /**
   * Returns the DOM node to which data-region needs to be added.
   */
  wrapperResolve?: (dom: HTMLElement) => HTMLElement;

  /**
   * When dragging into this container, do I need to modify the ghost structure?
   */
  modifyGhost?: (ghost: HTMLElement, schema?: any) => void;

  /**
   * dnd drag mode. For example, table needs to be configured as position-h
   */
  dndMode?:
    | 'default'
    | 'position-h'
    | 'position-v'
    | 'flex'
    // | (new (dnd: EditorDNDManager) => DNDModeInterface)
    | ((node: any) => string | undefined);

  /**
   * Can be used to determine whether dragging into the current node is allowed.
   */
  accept?: (json: any) => boolean;

  /**
   * Whether the current area is hidden
   */
  hiddenOn?: (schema: Schema) => boolean;
}

export interface VRendererConfig {
  /**
   * Configuring these will automatically create the edit panel.
   */
  panelIcon?: string;
  panelTitle?: string;
  /**
   * @deprecated Use panelBody instead
   */
  panelControls?: Array<any>;
  panelDefinitions?: any;

  /**
   * Configure the panel to justify the layout
   */
  panelJustify?: boolean;

  /**
   * @deprecated Use panelBodyCreator instead
   */
  panelControlsCreator?: (context: BaseEventContext) => Array<any>;
  panelBody?: Array<any>;
  panelBodyCreator?: (context: BaseEventContext) => Array<any>;

  /**
   * Even if configured, it is useless if not used in overides.
   */
  regions?: {
    [propName: string]: RegionConfig;
  };
}

export interface RendererScaffoldInfo {
  /**
   * Component Name
   */
  name: string;

  // icon
  icon?: string;

  pluginIcon?: string; //Higher priority than icon, used to use the new version of component icon

  // Component search keyword
  searchKeywords?: string;

  //Component description information
  description?: string;

  // Document link
  docLink?: string;

  // Used to generate preview images
  previewSchema?: any;

  // Classification
  tags?: string | Array<string>;

  // Choose between type and scaffold
  type?: string;
  scaffold?: any;
}

export interface InlineEditableElement {
  // Element selector, supports inline editing when this rule is hit
  match: string;

  // Inline editing mode
  // Default is plain-text
  mode?: 'plain-text' | 'rich-text';

  // onChange?: (node: EditorNodeType, value: any, elem: HTMLElement) => void;
  key: string;
}

/**
 * Renderer information.
 */
export interface RendererInfo extends RendererScaffoldInfo {
  scaffolds?: Array<Partial<RendererScaffoldInfo>>;

  rendererName?: string;

  /**
   * json schema protocol
   */
  $schema?: string;

  isBaseComponent?: boolean;

  /**
   * Is it a list type component, which has no data of its own but is bound to the array field in the data source
   * Subcomponents need to be able to obtain single-item fields, such as list, each, cards
   */
  isListComponent?: boolean;

  disabledRendererPlugin?: boolean;

  /**
   * Configure the zone.
   */
  regions?: Array<RegionConfig>;

  /**
   * A collection of elements that support inline editing
   */
  inlineEditableElements?: Array<InlineEditableElement>;

  /**
   * Select without highlighting
   */
  notHighlight?: boolean;

  /**
   * Which container attributes need to be automatically converted to arrays. If not configured, they are read from regions by default.
   */
  patchContainers?: Array<string>;

  /**
   * Override the target renderer name
   */
  overrideTargetRendererName?: string;

  /**
   * Override some methods, generally used to insert a virtual renderer editor.
   */
  overrides?: {
    [propName: string]: Function;
  };

  /**
   * Virtual renderer configuration items. Sometimes you need to add click-to-edit functionality to components that are not renderers.
   * For example: Tab under Tabs, this is not a renderer, but it needs to be able to click and modify the content.
   */
  vRendererConfig?: VRendererConfig;

  /**
   * The default is BaseWrapper, the container class is specified as BaseContainerWrapper or implement another
   * There is no configuration required at the moment, so comment it out.
   * wrapper?: React.ComponentType<NodeWrapperProps>;
   *
   * Which DOM nodes are returned and the data-editor-id attribute needs to be automatically added
   * Currently only used in TableCell, it needs to add that attribute to all TDs under a certain column at the same time.
   */
  wrapperResolve?: (dom: HTMLElement) => HTMLElement | Array<HTMLElement>;

  /**
   * Which properties are sent by default? If you want to send them dynamically, please use filterProps
   */
  wrapperProps?: any;

  /**
   * Modify some attributes, generally used to kill $$id or render fake data
   * In this way, its child nodes cannot be directly edited, such as Combo.
   */
  filterProps?: (props: any, node: EditorNodeType) => any;

  /**
   * For some components without views, you can output some content yourself, otherwise you cannot click to edit.
   */
  renderRenderer?: (props: any, info: RendererInfo) => JSX.Element;

  /**
   * Are there multiple identities?
   * For example, CRUD can be either CRUD or Table
   *
   * The columns of the table are table columns, which may also be other text boxes.
   *
   * After configuring this, multiple Panels will be automatically added for editing.
   */
  multifactor?: boolean;

  /**
   * Whether the rebuild will appear when right clicking depends on this.
   */
  scaffoldForm?: ScaffoldForm;

  // Automatically filled in, no configuration required
  id: string;
  type: string;
  plugin: PluginInterface;
  extraPlugin?: PluginInterface; // Auxiliary plug-in, depending on requirements.
  renderer: RendererConfig;
  schemaPath: string;

  // For subEditor, don't configure it directly
  editable?: boolean; // Is it editable?
  removable?: boolean; // Can it be removed?
  draggable?: boolean; // Can it be dragged?
  movable?: boolean; // Can it be moved?
  replaceable?: boolean; // Can it be replaced?
  duplicatable?: boolean; // Can a duplicate be made?
  memberImmutable?: boolean | Array<string>; // Member nodes are fixed, which means that no new members can be added
  typeMutable?: boolean; // Is the type modifiable?

  // If it is a virtual renderer
  hostId?: string;
  memberIndex?: number;

  tipName?: string;
  /** Shared context */
  sharedContext?: Record<string, any>;
  dialogTitle?: string; //Popup window title is used to display the popup window outline
  dialogType?: string; //Distinguish the confirmation dialog type
  getSubEditorVariable?: (
    schema?: any
  ) => Array<{label: string; children: any}>; // Component custom variables passed to the sub-editor, such as listSelect option name and value
}

export type BasicRendererInfo = Omit<
  RendererInfo,
  'id' | 'type' | 'plugin' | 'renderer' | 'schemaPath'
>;

export interface PopOverForm {
  title?: string;

  /**
   * Scaffolding configuration items.
   */
  body: Array<any>;

  /**
   * @deprecated Use body instead
   */
  controls?: Array<any>;

  initApi?: any;
  api?: any;
}

export interface ScaffoldForm extends PopOverForm {
  // Is the content divided into steps? If so, body must be?: Array<{title: string,body: any[]}>
  stepsBody?: boolean;
  /** Can I skip the creation wizard and create directly? */
  canSkip?: boolean;
  getSchema?: (value: any) => PopOverForm | Promise<PopOverForm>;
  mode?:
    | 'normal'
    | 'horizontal'
    | 'inline'
    | {
        mode: string;
        horizontal: any;
      };

  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  initApi?: any;
  api?: any;
  actions?: any[];
  /**
   * Verify the scaffolding configuration as a whole and return an error object if there is an error.
   * key is the name of the configured field.
   * value is the specific error message.
   */
  validate?: (
    values: any,
    formStore: any
  ) =>
    | void
    | {[propName: string]: string}
    | Promise<void | {[propName: string]: string}>;

  /**
   * Convert schema configuration to scaffolding configuration
   */
  pipeIn?: (value: any) => any;

  /**
   * Convert scaffolding configuration to schema configuration.
   */
  pipeOut?: (value: any) => any;

  /**
   * Whether to allow rebuilding;
   */
  canRebuild?: boolean;
}

/**
 * Subrenderer information
 */
export interface SubRendererInfo extends RendererScaffoldInfo {
  /**
   * Used to determine whether it is a platform preset component, the platform preset component is true.
   */
  isBaseComponent?: boolean;

  rendererName?: string;
  /**
   * Can be used to configure a form when dragged in for the first time.
   */
  scaffoldForm?: ScaffoldForm;
  /**
   * Added a new property to determine whether it appears in the component panel. The default value is false. If it is true, it will not be displayed.
   */
  disabledRendererPlugin?: boolean;

  // Automatically filled in, no configuration required
  plugin: PluginInterface;
  parent: RendererInfo;
  id: string;
  order: number;
}

export type BasicSubRenderInfo = Omit<
  SubRendererInfo,
  'plugin' | 'parent' | 'id' | 'order'
> &
  Partial<Pick<SubRendererInfo, 'order'>>;

/**
 * Tool button information.
 */
export interface ToolbarItem {
  label?: string;
  id?: string;
  order: number;
  level?: 'primary' | 'secondary' | 'special';
  className?: string;
  draggable?: boolean;
  onDragStart?: (e: any) => void;
  icon?: string;
  iconSvg?: string; // custom icon (svg format)
  onClick?: (e: any) => void;
  tooltip?: string;
  placement?: 'top' | 'bottom' | 'right' | 'left';
}

export type BasicToolbarItem = Partial<ToolbarItem>;

export type ContextMenuItem = MenuItem | MenuDivider;

/**
 * Panel property definition
 */
export interface PanelProps {
  id?: string;
  info?: RendererInfo;
  path?: string;
  node?: EditorNodeType;
  value: BaseSchema;
  onChange: (value: BaseSchema, diff?: Array<DiffChange>) => void;
  store: EditorStoreType;
  manager: EditorManager;
  popOverContainer?: () => HTMLElement | void;
  readonly?: boolean;
  children?: React.ReactNode | ((props: PanelProps) => React.ReactNode);
}

/**
 * Panel information definition
 */
export interface PanelItem {
  nodeId?: string;
  key: string;
  icon: React.ReactNode;
  tooltip?: string;
  pluginIcon?: string; // New version icon (svg)
  title?: React.ReactNode; // title
  component?: React.ComponentType<PanelProps | any>;
  order: number;
  position?: 'left' | 'right';
  render?: (props: PanelProps) => JSX.Element;
  menus?: Array<any>;
}

export type BasicPanelItem = Omit<PanelItem, 'order'> &
  Partial<Pick<PanelItem, 'order'>>;

export interface EventContext {
  data?: any;
  [propName: string]: any;
}

/**
 * Event context
 */
export interface BaseEventContext extends EventContext {
  node: EditorNodeType;
  id: string;
  info: RendererInfo;
  path: string;
  schema: any;
  schemaPath: string;
  secondFactor?: boolean;
}

export interface RendererInfoResolveEventContext extends EventContext {
  renderer: RendererConfig;
  path: string;
  schema: any;
  schemaPath: string;
  data?: RendererInfo;
}

export interface RendererJSONSchemaResolveEventContext
  extends BaseEventContext {
  data: string;
}

export interface IGlobalEvent {
  label: string;
  name: string; // event name, unique
  description: string; // event description
  mapping: Array<{
    key: string; // parameter name
    type: string; // parameter type
  }>;
}

/**
 * The context of the right-click menu event.
 */
export interface ContextMenuEventContext extends BaseEventContext {
  region: string;
  selections: Array<BaseEventContext>;
  data: Array<ContextMenuItem>;
}

export interface SelectionEventContext extends BaseEventContext {
  selections: Array<BaseEventContext>;
  data: Array<string>;
}

export interface RendererEventContext extends BaseEventContext {
  region?: string;
}

export interface ActiveEventContext extends Partial<BaseEventContext> {
  active?: boolean;
}

export interface DeleteEventContext extends BaseEventContext {
  data?: Array<string>;
}

/**
 * Event context information for inserting a node
 */
export interface InsertEventContext extends BaseEventContext {
  region: string;
  beforeId?: string;
  index: number;
  data: any;
  subRenderer?: SubRendererInfo | RendererInfo;
  dragInfo?: {
    id: string;
    type: string;
    data: any;
    position?: string;
  };
}

export interface ReplaceEventContext extends BaseEventContext {
  data: any;
  subRenderer?: SubRendererInfo | RendererInfo;
  region?: string;
}

export interface MoveEventContext extends BaseEventContext {
  region: string;
  sourceId: string;
  beforeId?: string;
  direction?: 'up' | 'down';
}

/**
 * Update the event context of the node
 */
export interface ChangeEventContext extends BaseEventContext {
  value: any;
  readonly diff: Array<DiffChange>;
}

export interface DragEventContext extends EventContext {
  mode: 'move' | 'copy';
  sourceType: 'schema' | 'subrenderer' | string;
  sourceId: string;
  data: any;

  targetId?: string;
  targetRegion?: string;
}

export interface BuildPanelEventContext extends BaseEventContext {
  data: Array<BasicPanelItem>;
  selections: Array<BaseEventContext>;
}

export interface PreventClickEventContext extends EventContext {
  data: MouseEvent;
}

export interface ResizeMoveEventContext extends EventContext {
  data: Object;
  nativeEvent: MouseEvent;
  home: HTMLElement;
  resizer: HTMLElement;
  node: EditorNodeType;
  store: EditorStoreType;
}

export interface GlobalVariablesEventContext extends EventContext {
  data: Array<GlobalVariableItem>;
}

export interface GlobalVariableEventContext extends EventContext {
  data: Partial<GlobalVariableItem>;
}

export interface AfterBuildPanelBody extends EventContext {
  data: SchemaCollection;
  plugin: BasePlugin;
  context: BaseEventContext;
}

/**
 * Convert the event context into an event object.
 */
export type PluginEvent<T, P = any> = {
  context: T;
  type: string;
  preventDefault: () => void;
  stopPropagation: () => void;
  setData: (data: P) => void;

  // Blocked?
  prevented?: boolean;
  stoped?: boolean;

  // Used to support asynchronous scenarios
  pending?: Promise<any>;

  // Current value
  data?: P;

  // value
  value?: any;
};

export type PluginEventFn = (e: PluginEvent<EventContext>) => any;

/**
 * Create an event.
 * @param type
 * @param context
 */
export function createEvent<T extends EventContext>(
  type: string,
  context: T
): PluginEvent<T> {
  const event = {
    context,
    type,
    prevented: false,
    stoped: false,
    preventDefault() {
      event.prevented = true;
    },
    stopPropagation() {
      event.stoped = true;
    },
    get data() {
      return event.context.data;
    },
    setData(data: any) {
      event.context.data = data;
    }
  };

  return event;
}
export interface PluginEventListener {
  onInit?: (
    event: PluginEvent<
      EventContext & {
        data: EditorManager;
      }
    >
  ) => void;

  onActive?: (event: PluginEvent<ActiveEventContext>) => void;

  /**
   * Event, called before a configuration item is inserted. You can intervene through event.preventDefault().
   */
  beforeInsert?: (event: PluginEvent<InsertEventContext>) => false | void;
  afterInsert?: (event: PluginEvent<InsertEventContext>) => void;

  /**
   * Edit and modify events in the panel.
   */
  beforeUpdate?: (event: PluginEvent<ChangeEventContext>) => false | void;
  afterUpdate?: (event: PluginEvent<ChangeEventContext>) => void;

  /**
   * Update the renderer, or right-click to paste the configuration.
   */
  beforeReplace?: (event: PluginEvent<ReplaceEventContext>) => false | void;
  afterReplace?: (event: PluginEvent<ReplaceEventContext>) => void;

  /**
   * Triggered when moving a node, including moving up and down
   */
  beforeMove?: (event: PluginEvent<MoveEventContext>) => false | void;
  afterMove?: (event: PluginEvent<MoveEventContext>) => void;

  /**
   * Triggered when deleting
   */
  beforeDelete?: (event: PluginEvent<DeleteEventContext>) => false | void;
  afterDelete?: (event: PluginEvent<DeleteEventContext>) => void;

  beforeResolveEditorInfo?: (
    event: PluginEvent<RendererInfoResolveEventContext>
  ) => false | void;
  afterResolveEditorInfo?: (
    event: PluginEvent<RendererInfoResolveEventContext>
  ) => void;

  beforeResolveJsonSchema?: (
    event: PluginEvent<RendererJSONSchemaResolveEventContext>
  ) => false | void;
  afterResolveJsonSchema?: (
    event: PluginEvent<RendererJSONSchemaResolveEventContext>
  ) => void;

  onDndAccept?: (event: PluginEvent<DragEventContext>) => false | void;

  onBuildPanels?: (event: PluginEvent<BuildPanelEventContext>) => void;

  onBuildContextMenus?: (event: PluginEvent<ContextMenuEventContext>) => void;

  onBuildToolbars?: (event: PluginEvent<BaseEventContext>) => void;

  onSelectionChange?: (event: PluginEvent<SelectionEventContext>) => void;

  onPreventClick?: (
    event: PluginEvent<PreventClickEventContext>
  ) => false | void;

  onWidthChangeStart?: (
    event: PluginEvent<
      ResizeMoveEventContext,
      {
        onMove(e: MouseEvent): void;
        onEnd(e: MouseEvent): void;
      }
    >
  ) => void;

  onHeightChangeStart?: (
    event: PluginEvent<
      ResizeMoveEventContext,
      {
        onMove(e: MouseEvent): void;
        onEnd(e: MouseEvent): void;
      }
    >
  ) => void;

  onSizeChangeStart?: (
    event: PluginEvent<
      ResizeMoveEventContext,
      {
        onMove(e: MouseEvent): void;
        onEnd(e: MouseEvent): void;
      }
    >
  ) => void;

  // External can take over the addition, deletion, modification and query of global variables
  // Get the global variable list
  onGlobalVariableInit?: (
    event: PluginEvent<GlobalVariablesEventContext>
  ) => void;
  // Global variable details
  onGlobalVariableDetail?: (
    event: PluginEvent<GlobalVariableEventContext>
  ) => void;
  // Save global variables
  onGlobalVariableSave?: (
    event: PluginEvent<GlobalVariableEventContext>
  ) => void;
  // Global variable deletion
  onGlobalVariableDelete?: (
    event: PluginEvent<GlobalVariableEventContext>
  ) => void;
}

/**
 * Plugin interface definition
 */
export interface PluginInterface
  extends Partial<BasicRendererInfo>,
    Partial<BasicSubRenderInfo>,
    PluginEventListener {
  readonly manager: EditorManager;

  order?: number;

  /**
   * Plugin application scenarios
   */
  scene?: Array<string>;

  // Whether data can be bound. Generally, container types do not have this option.
  withDataSource?: boolean;

  /**
   * The name of the renderer. After associating, you don't need to implement getRendererInfo yourself.
   */
  rendererName?: string;

  /**
   * Default configuration panel information
   */
  panelIcon?: string;
  panelTitle?: string;

  /**
   * Added a new property to determine whether it appears in the component panel. The default value is false. If it is true, it will not be displayed.
   */
  disabledRendererPlugin?: boolean;

  /**
   * @deprecated 用 panelBody
   */
  panelControls?: Array<any>;
  panelBody?: Array<any>;
  panelDefinitions?: any;
  panelApi?: any;
  panelSubmitOnChange?: boolean;

  /**
   * Hide the right panel form item Tab
   * TODO: This property will be removed after the official launch
   */
  notRenderFormZone?: boolean;

  /**
   *
   * Event definition collection
   */
  events?: RendererPluginEvent[] | ((schema: any) => RendererPluginEvent[]);

  /**
   *
   * Proprietary action definition set
   */
  actions?: RendererPluginAction[];

  /**
   * Whether the right panel needs to be aligned
   */
  panelJustify?: boolean;

  /**
   * panelBodyAsyncCreator sets the configuration items for asynchronous loading of layers
   */
  async?: AsyncLayerOptions;

  /**
   * Drag mode
   */
  dragMode?: string;

  /**
   * A container with data fields that can provide a field binding page for subcomponents to read
   */
  getAvailableContextFields?: (
    // Provides the container node for the data domain
    scopeNode: EditorNodeType,
    // Application node of data domain
    target: EditorNodeType,
    // The container region to which the node belongs
    region?: EditorNodeType
  ) => Promise<SchemaCollection | void>;

  /** Configure the pipeOut function of the panel form */
  panelFormPipeOut?: (value: any, oldValue: any) => any;

  /**
   * @deprecated 用 panelBodyCreator
   */
  panelControlsCreator?: (context: BaseEventContext) => Array<any>;
  panelBodyCreator?: (context: BaseEventContext) => SchemaCollection;
  /**
   * Configure the asynchronous loading method of the panel content area. After setting, the priority is greater than panelBodyCreator
   */
  panelBodyAsyncCreator?: (
    context: BaseEventContext
  ) => Promise<SchemaCollection>;

  // It seems useless, comment it out first
  // /**
  // * The panel also needs to merge the configuration provided by the target plugin. In case of conflict, the current plugin will prevail
  //  */
  // panelBodyMergeable?: (
  //   context: BaseEventContext,
  //   plugin: PluginInterface
  // ) => boolean;

  popOverBody?: Array<any>;
  popOverBodyCreator?: (context: BaseEventContext) => Array<any>;

  /**
   * Returns renderer information. Not required for every plugin.
   */
  getRendererInfo?: (
    context: RendererInfoResolveEventContext
  ) => BasicRendererInfo | void;

  /**
   * Generate the JSON Schema uri address of the node.
   */
  buildJSONSchema?: (
    context: RendererJSONSchemaResolveEventContext
  ) => void | string;

  /**
   * Build a collection of function buttons in the upper right corner
   */
  buildEditorToolbar?: (
    context: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) => void;

  /**
   * Build right-click menu items
   */
  buildEditorContextMenu?: (
    context: ContextMenuEventContext,
    menus: Array<ContextMenuItem>
  ) => void;

  /**
   * Build the editor panel.
   */
  buildEditorPanel?: (
    context: BuildPanelEventContext,
    panels: Array<BasicPanelItem>
  ) => void;

  /**
   * Build a subrenderer information collection.
   */
  buildSubRenderers?: (
    context: RendererEventContext,
    subRenderers: Array<SubRendererInfo>,
    renderers: Array<RendererConfig>
  ) =>
    | BasicSubRenderInfo
    | Array<BasicSubRenderInfo>
    | void
    | Promise<BasicSubRenderInfo | Array<BasicSubRenderInfo> | void>;

  /**
   * Update NPM custom component classification and sorting [asynchronous method]
   * Note: Currently mainly used in the classification and sorting updates of npm custom components
   */
  asyncUpdateCustomSubRenderersInfo?: (
    context: RendererEventContext,
    subRenderers: Array<SubRendererInfo>,
    renderers: Array<RendererConfig>
  ) => void;

  markDom?: (dom: HTMLElement | Array<HTMLElement>, props: any) => void;

  /**
   * Get the context data structure
   *
   * @param node current container node
   * @param region The container node to which it belongs
   */
  buildDataSchemas?: (
    node: EditorNodeType,
    region?: EditorNodeType,
    trigger?: EditorNodeType,
    parent?: EditorNodeType
  ) => any | Promise<any>;

  rendererBeforeDispatchEvent?: (
    node: EditorNodeType,
    e: any,
    data: any
  ) => void;

  /**
   * Patch the schema and correct the schema configuration.
   * @param schema
   * @param renderer
   * @param props
   * @returns
   */
  patchSchema?: (
    schema: Schema,
    renderer: RendererConfig,
    props?: any
  ) => Schema | void;

  dispose?: () => void;

  /**
   * Component ref callback, called when mounting and unmounting
   * @param ref
   * @returns
   */
  componentRef?: (node: EditorNodeType, ref: any) => void;
}

export interface RendererPluginEvent {
  eventName: string; // event name value
  eventLabel: string; // event name label
  description?: string; // event description
  defaultShow?: boolean; // Whether to display by default
  isBroadcast?: boolean; // Broadcast event
  owner?: string; //Mark the source, mainly used for broadcasting
  dataSchema?: any[] | ((manager: EditorManager) => any[]); // context schema
  strongDesc?: string;
}

//Action declaration
export interface RendererPluginAction {
  actionType?: string; // action name value
  actionLabel?: string; // action name label
  description?: string; // action description
  schema?: any; // Action configuration schema
  supportComponents?: string[] | string; // If the schema contains select components, you can specify the component types supported by the action for component tree filtering
  innerArgs?: string[]; // Action-specific configuration parameters, mainly to distinguish feature fields and additional parameters
  descDetail?: (info: any, context: any, props: any) => string | JSX.Element; // Detailed description of the action
  outputVarDataSchema?: any | any[]; // Action output parameter structure definition
  actions?: SubRendererPluginAction[]; // Branch actions (when the configuration panel contains multiple actions)
  children?: RendererPluginAction[]; // Subtype, for action tree
}

// Branch action
export interface SubRendererPluginAction
  extends Pick<
    RendererPluginAction,
    'actionType' | 'innerArgs' | 'descDetail'
  > {}

export interface PluginEvents {
  [propName: string]:
    | RendererPluginEvent[]
    | ((schema: any) => RendererPluginEvent[]);
}

export interface PluginActions {
  [propName: string]: RendererPluginAction[];
}

/**
 * Base class, all plugins can inherit from this one, so you can write less logic.
 */
export abstract class BasePlugin implements PluginInterface {
  constructor(readonly manager: EditorManager | any) {}

  static scene = ['global'];

  name?: string;
  rendererName?: string;

  /**
   * If there is rendererName in the configuration, the renderer information is automatically returned.
   * @param renderer
   */
  getRendererInfo({
    renderer,
    schema
  }: RendererInfoResolveEventContext): BasicRendererInfo | void {
    const plugin: PluginInterface = this;

    if (
      schema.$$id &&
      plugin.name &&
      plugin.rendererName &&
      plugin.rendererName === renderer.name // renderer.name will be taken from renderer.type
    ) {
      let curPluginName = plugin.name;
      if (schema?.isFreeContainer) {
        curPluginName = 'Free container';
      } else if (schema?.isSorptionContainer) {
        curPluginName = 'Adsorption container';
      }
      // Copy some information out
      return {
        name: curPluginName,
        regions: plugin.regions,
        inlineEditableElements: plugin.inlineEditableElements,
        patchContainers: plugin.patchContainers,
        // wrapper: plugin.wrapper,
        vRendererConfig: plugin.vRendererConfig,
        wrapperProps: plugin.wrapperProps,
        wrapperResolve: plugin.wrapperResolve,
        filterProps: plugin.filterProps,
        $schema: plugin.$schema,
        renderRenderer: plugin.renderRenderer,
        multifactor: plugin.multifactor,
        scaffoldForm: plugin.scaffoldForm,
        disabledRendererPlugin: plugin.disabledRendererPlugin,
        isBaseComponent: plugin.isBaseComponent,
        isListComponent: plugin.isListComponent,
        rendererName: plugin.rendererName,
        memberImmutable: plugin.memberImmutable,
        getSubEditorVariable: plugin.getSubEditorVariable
      };
    }
  }

  /**
   * Configured panelControls to automatically generate configuration panels
   * @param context
   * @param panels
   */
  buildEditorPanel(
    context: BuildPanelEventContext,
    panels: Array<BasicPanelItem>
  ) {
    const plugin: PluginInterface = this;
    const store = this.manager.store;

    // No element is selected or multiple selections are not processed
    if (!store.activeId || context.selections.length) {
      return;
    }

    if (
      !context.info.hostId &&
      (plugin.panelControls ||
        plugin.panelControlsCreator ||
        plugin.panelBody ||
        plugin.panelBodyCreator ||
        plugin.panelBodyAsyncCreator) &&
      context.info.plugin === this
    ) {
      const enableAsync = !!(
        plugin.panelBodyAsyncCreator &&
        typeof plugin.panelBodyAsyncCreator === 'function'
      );
      const body = plugin.panelBodyAsyncCreator
        ? plugin.panelBodyAsyncCreator(context)
        : plugin.panelBodyCreator
        ? plugin.panelBodyCreator(context)
        : plugin.panelBody!;

      this.manager.trigger('after-build-panel-body', {
        context,
        data: body,
        plugin
      });

      const baseProps = {
        definitions: plugin.panelDefinitions,
        submitOnChange: plugin.panelSubmitOnChange,
        api: plugin.panelApi,
        controls: plugin.panelControlsCreator
          ? plugin.panelControlsCreator(context)
          : plugin.panelControls!,
        justify: plugin.panelJustify,
        panelById: store.activeId,
        pipeOut: plugin.panelFormPipeOut?.bind?.(plugin)
      };

      panels.push({
        key: 'config',
        icon: plugin.panelIcon || plugin.icon || 'fa fa-cog',
        pluginIcon: plugin.pluginIcon,
        title: plugin.panelTitle || 'Settings',
        render: enableAsync
          ? makeAsyncLayer(async () => {
              const panelBody = await (body as Promise<SchemaCollection>);

              return this.manager.makeSchemaFormRender({
                ...baseProps,
                body: panelBody
              });
            }, omit(plugin.async, 'enable'))
          : this.manager.makeSchemaFormRender({
              ...baseProps,
              body: body as SchemaCollection
            })
      });
    } else if (
      context.info.plugin === this &&
      context.info.hostId &&
      (plugin.vRendererConfig?.panelControls ||
        plugin.vRendererConfig?.panelControlsCreator ||
        plugin.vRendererConfig?.panelBody ||
        plugin.vRendererConfig?.panelBodyCreator)
    ) {
      panels.push({
        key: context.info.multifactor ? 'vconfig' : 'config',
        icon: plugin.vRendererConfig.panelIcon || 'fa fa-cog',
        title: plugin.vRendererConfig.panelTitle || '设置',
        render: this.manager.makeSchemaFormRender({
          submitOnChange: plugin.panelSubmitOnChange,
          api: plugin.panelApi,
          definitions: plugin.vRendererConfig.panelDefinitions,
          controls: plugin.vRendererConfig.panelControlsCreator
            ? plugin.vRendererConfig.panelControlsCreator(context)
            : plugin.vRendererConfig.panelControls!,
          body: plugin.vRendererConfig.panelBodyCreator
            ? plugin.vRendererConfig.panelBodyCreator(context)
            : plugin.vRendererConfig.panelBody!,
          justify: plugin.vRendererConfig.panelJustify,
          panelById: store.activeId
        })
      });
    }

    // If it is a multiple ID
    if (context.info.plugin === this && context.info.multifactor) {
      const sameIdChild: EditorNodeType = context.node.sameIdChild;

      if (sameIdChild) {
        const subPanels = this.manager.collectPanels(sameIdChild, false, true);
        subPanels.forEach(panel => {
          if (panel.key === 'config' || panel.key === 'vconfig') {
            panels.push({
              ...panel,
              key: `sub-${panel.key}`,
              icon: sameIdChild.info?.plugin?.icon || panel.icon
            });
          }
        });
      }
    }
  }

  /**
   * By default, all components are added to the subcomponent, and this change behavior can be overridden in the subclass.
   * @param context
   * @param subRenderers
   */
  buildSubRenderers(
    context: RendererEventContext,
    subRenderers: Array<SubRendererInfo>,
    renderers: Array<RendererConfig>
  ): BasicSubRenderInfo | Array<BasicSubRenderInfo> | void {
    const plugin: PluginInterface | any = this;

    if (Array.isArray(plugin.scaffolds)) {
      return plugin.scaffolds.map(scaffold => ({
        name: (scaffold.name ?? plugin.name)!,
        icon: scaffold.icon ?? plugin.icon,
        pluginIcon: plugin.pluginIcon,
        description: scaffold.description ?? plugin.description,
        previewSchema: scaffold.previewSchema ?? plugin.previewSchema,
        tags: scaffold.tags ?? plugin.tags,
        docLink: scaffold.docLink ?? plugin.docLink,
        type: scaffold.type ?? plugin.type,
        scaffold: scaffold.scaffold ?? plugin.scaffold,
        scaffoldForm: plugin.scaffoldForm,
        disabledRendererPlugin: plugin.disabledRendererPlugin,
        isBaseComponent: plugin.isBaseComponent,
        rendererName: plugin.rendererName
      }));
    } else if (plugin.name && plugin.description) {
      return {
        searchKeywords: plugin.searchKeywords,
        name: plugin.name,
        icon: plugin.icon,
        description: plugin.description,
        previewSchema: plugin.previewSchema,
        tags: plugin.tags,
        docLink: plugin.docLink,
        type: plugin.type,
        scaffold: plugin.scaffold,
        scaffoldForm: plugin.scaffoldForm,
        disabledRendererPlugin: plugin.disabledRendererPlugin,
        isBaseComponent: plugin.isBaseComponent,
        pluginIcon: plugin.pluginIcon,
        rendererName: plugin.rendererName
      };
    }
  }

  renderPlaceholder(text: string, key?: any, style?: any) {
    return React.createElement('div', {
      key,
      className: 'wrapper-sm b-a b-light m-b-sm',
      style: style,
      children: React.createElement('span', {
        className: 'text-muted',
        children: text
      })
    });
  }

  getPlugin(rendererNameOrKlass: string | typeof BasePlugin) {
    return find(this.manager.plugins, plugin =>
      typeof rendererNameOrKlass === 'string'
        ? plugin.rendererName === rendererNameOrKlass
        : plugin instanceof rendererNameOrKlass
    );
  }

  buildDataSchemas(
    node: EditorNodeType,
    region?: EditorNodeType,
    trigger?: EditorNodeType,
    parent?: EditorNodeType
  ) {
    return {
      type: 'string',
      rawType: RAW_TYPE_MAP[node.schema.type as SchemaType] || 'string',
      title:
        typeof node.schema.label === 'string'
          ? node.schema.label
          : node.schema.name,
      originalValue: node.schema.value // Record the original value, required for circular reference detection
    } as any;
  }

  getKeyAndName() {
    return {
      key: this.rendererName,
      name: this.name
    };
  }
}

/**
 * Layout related component base class, with high bandwidth and draggable function.
 */
export class LayoutBasePlugin extends BasePlugin {
  onActive(event: PluginEvent<ActiveEventContext>) {
    const context = event.context;

    if (context.info?.plugin !== this || !context.node) {
      return;
    }

    const node = context.node!;
    const curSchema = node.schema || {};

    if (curSchema.isFixedWidth) {
      node.setWidthMutable(true);
    }
    if (curSchema.isFixedHeight) {
      node.setHeightMutable(true);
    }
  }

  onWidthChangeStart(
    event: PluginEvent<
      ResizeMoveEventContext,
      {
        onMove(e: MouseEvent): void;
        onEnd(e: MouseEvent): void;
      }
    >
  ) {
    return this.onSizeChangeStart(event, 'horizontal');
  }

  onHeightChangeStart(
    event: PluginEvent<
      ResizeMoveEventContext,
      {
        onMove(e: MouseEvent): void;
        onEnd(e: MouseEvent): void;
      }
    >
  ) {
    return this.onSizeChangeStart(event, 'vertical');
  }

  onSizeChangeStart(
    event: PluginEvent<
      ResizeMoveEventContext,
      {
        onMove(e: MouseEvent): void;
        onEnd(e: MouseEvent): void;
      }
    >,
    direction: 'both' | 'vertical' | 'horizontal' = 'both'
  ) {
    const context = event.context;
    const node = context.node;
    const store = context.store;
    if (node.info?.plugin !== this) {
      return;
    }

    const resizer = context.resizer;
    const dom = context.dom;
    const doc = store.getDoc() || document;
    const frameRect = dom.parentElement!.getBoundingClientRect();
    const rect = dom.getBoundingClientRect();
    const startX = context.nativeEvent.pageX;
    const startY = context.nativeEvent.pageY;

    event.setData({
      onMove: (e: MouseEvent) => {
        const dy = e.pageY - startY;
        const dx = e.pageX - startX;
        const height = Math.max(50, rect.height + dy);
        const width = Math.max(100, Math.min(rect.width + dx, frameRect.width));
        const state: any = {
          width,
          height
        };

        const dragHlBoxItem = doc.querySelector(
          `[data-hlbox-id='${node.id}']`
        ) as HTMLElement;

        // Adjust the coordinate value of the dragged element in real time
        const dragContainerItem = doc.querySelector(
          `[data-editor-id='${node.id}']`
        ) as HTMLElement;

        if (direction === 'both') {
          resizer.setAttribute('data-value', `${width}px x ${height}px`);
          dragHlBoxItem.style.height = `${height}px`;
          dragHlBoxItem.style.width = `${width}px`;
          dragContainerItem.style.height = `${height}px`;
          dragContainerItem.style.width = `${width}px`;
        } else if (direction === 'vertical') {
          resizer.setAttribute('data-value', `${height}px`);
          dragHlBoxItem.style.height = `${height}px`;
          dragContainerItem.style.height = `${height}px`;
          delete state.width;
        } else {
          resizer.setAttribute('data-value', `${width}px`);
          dragHlBoxItem.style.width = `${width}px`;
          dragContainerItem.style.width = `${width}px`;
          delete state.height;
        }

        node.updateState(state);

        requestAnimationFrame(() => {
          node.calculateHighlightBox();
        });
      },
      onEnd: (e: MouseEvent) => {
        const dy = e.pageY - startY;
        const dx = e.pageX - startX;
        const height = Math.max(50, rect.height + dy);
        const width = Math.max(100, Math.min(rect.width + dx, frameRect.width));
        const state: any = {
          width,
          height
        };

        if (direction === 'vertical') {
          delete state.width;
        } else if (direction === 'horizontal') {
          delete state.height;
        }

        resizer.removeAttribute('data-value');
        node.updateSchemaStyle(state);
        requestAnimationFrame(() => {
          node.calculateHighlightBox();
        });
      }
    });
  }
}

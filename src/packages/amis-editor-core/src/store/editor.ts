import {
  findTree,
  getVariable,
  mapObject,
  mapTree,
  eachTree,
  extendObject,
  createObject,
  extractObjectChain,
  GlobalVariableItem
} from '@/packages/amis-core/src';
import {cast, getEnv, Instance, types} from 'mobx-state-tree';
import {
  diff,
  filterSchemaForEditor,
  JSONDelete,
  JSONGetById,
  JSONTraverse,
  patchDiff,
  unitFormula,
  stringRegExp,
  needDefaultWidth,
  guid,
  appTranslate,
  JSONGetByPath,
  addModal,
  mergeDefinitions,
  getModals
} from '../util';
import {
  InsertEventContext,
  PluginEvent,
  RendererInfo,
  SubRendererInfo,
  ToolbarItem,
  PanelItem,
  MoveEventContext,
  ScaffoldForm,
  PopOverForm,
  DeleteEventContext,
  BaseEventContext,
  IGlobalEvent
} from '../plugin';
import {
  JSONDuplicate,
  JSONGetParentById,
  JSONGetPathById,
  JSONMoveDownById,
  JSONMoveUpById,
  JSONPipeIn,
  JSONPipeOut,
  JSONUpdate
} from '../util';
import type {JSONSchema, Schema} from 'amis';
import {toast, resolveVariable} from 'amis';
import find from 'lodash/find';
import {InsertSubRendererPanel} from '../component/Panel/InsertSubRendererPanel';
import {AvailableRenderersPanel} from '../component/Panel/AvailableRenderersPanel';
import isPlainObject from 'lodash/isPlainObject';
import {EditorManagerConfig} from '../manager';
import {EditorNode, EditorNodeType} from './node';
import findIndex from 'lodash/findIndex';
import {matchSorter} from 'match-sorter';
import debounce from 'lodash/debounce';
// @ts-ignore
import type {DialogSchema} from '@/packages/amis/src/renderers/Dialog';
// @ts-ignore
import type {DrawerSchema} from '@/packages/amis/src/renderers/Drawer';
import getLayoutInstance from '../layout';
import {isAlive} from 'mobx-state-tree';

export interface SchemaHistory {
  versionId: number;
  schema: any;
}

export type SubEditorContext = {
  title: string;
  value: any;
  onChange: (value: any, diff: any) => void;
  slot?: any;
  data?: any;
  validate?: (value: any) => void | string | Promise<void | string>;
  canUndo?: boolean;
  canRedo?: boolean;

  // Whether the own type can be changed.
  typeMutable?: boolean;
  memberImmutable?: boolean | Array<string>;
  props?: any;
  /* Host node's Store */
  hostNode?: EditorNodeType;
};

export type PatchItem =
  | {
      op: 'update' | 'replace';
      target: string;
      value: any;
    }
  | {
      op: 'delete';
      target: string;
    }
  | {
      op: 'push';
      target: string;
      key: string;
      value: any;
    }
  | {
      op: 'splice';
      target: string;
      key: string;
      args: Array<any>;
    };

export interface ScaffoldFormContext extends ScaffoldForm {
  value: any;
  callback: (value: any) => void;
}

export interface PopOverFormContext extends PopOverForm {
  target: () => HTMLElement;
  value: any;
  callback: (value: any, diff: any) => void;
  node?: EditorNodeType;
}

export interface ModalFormContext extends PopOverForm {
  mode?: 'dialog' | 'drawer';
  size?: string;
  postion?: string;
  value: any;
  callback: (value: any, diff: any) => void;
}

/**
 * Collected name information
 */
export interface TargetName {
  type: string;
  name: string;
  editorId: string;
}

export type EditorModalBody = (DialogSchema | DrawerSchema) & {
  // Node ID
  $$id?: string;
  // If it is a public pop-up window, the key in definitions
  $$ref?: string;

  // The embedded pop-up window will be converted into a public pop-up window and sent to the bullet window, otherwise the bullet window cannot be selected
  // This class will mark the original position in the definition
  $$originId?: string;

  // Pop-up method
  actionType?: string;
};

export const MainStore = types
  .model('EditorRoot', {
    ready: false, // Unavailable before asynchronous component loading
    isMobile: false,
    isSubEditor: false,
    // Used to customize the amis document path in AISUTA
    amisDocHost: types.optional(types.string, 'https://baidu.gitee.io'),
    root: types.optional(EditorNode, {
      id: 'root',
      label: 'Root'
    }),
    theme: 'cxd', // theme, default cxd theme
    toolbarMode: 'default', // toolbar mode, default, mini mode has no more, insert components before and after, context data, repeat, merge into one line, right-click function
    noDialog: false, // No need for pop-up function
    hoverId: '',
    hoverRegion: '',
    activeId: '',
    activeRegion: '', // Record the currently activated sub-region
    activeElement: '', // Record the currently edited inline element
    mouseMoveRegion: '', // Record the area where the mouse is currently hovering, which needs to be optimized later (merge MouseMoveRegion and hoverRegion)

    // Used to record when multiple items are selected, or activeId when a single item is selected
    selections: types.optional(types.frozen<Array<string>>(), []),

    // When right clicking, record the currently selected one.
    contextId: '',

    //Drag related
    dragMode: 'move' as 'move' | 'copy',
    dragId: '', // dragged component id
    dragType: '',
    dragSchema: types.frozen(),

    dropId: '', // component id to be placed
    dropRegion: '',

    // Area to be dragged
    planDropId: '',
    planDropRegion: '',

    insertId: '',
    insertRegion: '',
    insertRenderers: types.optional(types.frozen<Array<SubRendererInfo>>(), []),
    insertRenderersKeywords: '',
    insertTag: 'All',
    insertSelected: '',
    insertMode: 'insert' as 'insert' | 'replace', //
    insertOrigId: '',
    insertBeforeId: '',

    showInsertRenderer: false, // Whether to display the insert component panel (drawer pop-up mode)

    schema: types.frozen(),
    versionId: 0,
    schemaHistory: types.optional(
      types.array(types.frozen<SchemaHistory>()),
      []
    ),

    toolbars: types.optional(types.frozen<Array<ToolbarItem>>(), []),
    panels: types.optional(types.frozen<Array<PanelItem>>(), []),

    showCustomRenderersPanel: false, // Whether to display the custom component panel, not displayed by default
    renderersTabsKey: 'base-renderers', // Component panel tabs, default display "base components", custom displays "custom components"
    outlineTabsKey: 'component-outline', // View structure tabs, by default displays "component outline", dialog displays "pop-up window outline"
    //Store preset components and custom components
    subRenderers: types.optional(types.frozen<Array<SubRendererInfo>>(), []),
    subRenderersKeywords: '', // Query keywords for basic components
    subRenderersTag: '', // Current display category of the basic component
    subRendererRegion: '', // Query container element for pre-set components [not currently used]

    customRenderersKeywords: '', // Query keywords for custom components
    customRenderersTag: '', // Current display category of custom components

    panelKey: '',
    leftPanelKey: '',
    leftPanelOpenStatus: true, // Left panel expanded status, displayed by default

    jsonSchemaUri: '',

    scaffoldForm: types.maybe(types.frozen<ScaffoldFormContext>()),
    scaffoldFormStep: 0,
    /** Whether the scaffolding has proceeded to the next step*/
    scaffoldStepManipulated: false,
    scaffoldFormBuzy: false,
    scaffoldError: '',

    popOverForm: types.maybe(types.frozen<PopOverFormContext>()),

    // Pop-up form
    modalForm: types.maybe(types.frozen<ModalFormContext>()),
    modalMode: '',
    modalFormBuzy: false,
    modalFormError: '',

    // Pop-up sub-editor related information
    subEditorContext: types.maybe(types.frozen<SubEditorContext>()),
    // The child editor may need to get the data of the parent editor
    superEditorData: types.maybe(types.frozen()),

    calculateStarted: false,

    // Automatically collect a list of names that can be used by target/reload
    targetNames: types.optional(types.array(types.frozen<TargetName>()), []),

    ctx: types.frozen(),
    /** Whether to enable multi-language application*/
    i18nEnabled: types.optional(types.boolean, false),
    /** Application language */
    appLocale: types.optional(types.string, 'zh-CN'),
    /** Application corpus*/
    appCorpusData: types.optional(types.frozen(), {}),
    /** Apply multilingual status, for other components to subscribe to*/
    appLocaleState: types.optional(types.number, 0),
    /** Global broadcast event */
    globalEvents: types.optional(types.frozen<Array<IGlobalEvent>>(), []),

    /** Global variables */
    globalVariables: types.optional(
      types.frozen<Array<GlobalVariableItem & {id: string | number}>>(),
      []
    )
    // types.optional(
    //   types.array(types.frozen<GlobalVariableItem & {id: string | number}>()),
    //   []
    // )
  })
  .views(self => {
    return {
      // For editing state
      get filteredSchema() {
        let schema = self.schema;
        return filterSchemaForEditor(
          getEnv(self).schemaFilter?.(schema) ?? schema
        );
      },

      // For preview status
      get filteredSchemaForPreview() {
        const schema = JSONPipeOut(self.schema);
        return getEnv(self).schemaFilter?.(schema, true) ?? schema;
      },

      // Determine whether the current element is the root node
      isRootSchema(id: string) {
        const curSchema = this.getSchema();
        if (curSchema && curSchema.$$id === id) {
          return true;
        }
        return false;
      },

      get rootId() {
        return this.getRootId();
      },

      getRootId() {
        const curSchema = this.getSchema();
        return curSchema?.$$id;
      },

      isHoved(id: string) {
        return id && self.hoverId === id;
      },

      isActive(id: string) {
        return (
          id &&
          !this.dragging &&
          !self.insertOrigId &&
          self.insertBeforeId !== id &&
          self.activeId === id
        );
      },

      isContextOn(id: string) {
        return id && self.contextId === id;
      },

      get activeContainerId() {
        if (!self.activeId) {
          return '';
        }

        let node: EditorNodeType = this.getNodeById(self.activeId) as any;

        while (node) {
          if (node.childRegions.length || node.info?.regions) {
            return node.id;
          }

          node = node.host;
        }

        return '';
      },

      isRegionHighlighted(id: string, region: string) {
        return (
          (!self.insertOrigId &&
            id === self.hoverId &&
            region === self.hoverRegion) ||
          (id === self.activeId && self.activeRegion === region) ||
          (id === self.dropId && self.dropRegion === region) ||
          (!self.insertOrigId &&
            id === self.insertId &&
            self.insertRegion === region)
        );
      },

      isRegionHighlightHover(id: string, region: string) {
        return id === self.hoverId && region === self.mouseMoveRegion;
      },

      isRegionActive(id: string, region: string): boolean {
        return (
          this.isActive(id) ||
          id === self.dropId ||
          id === self.planDropId || // Area to be dragged
          this.isRegionHighlighted(id, region) ||
          this.isRegionHighlightHover(id, region)
        );
      },

      isRegionDragEnter(id: string, region: string) {
        return this.isRegionActive(id, region) && region === self.dropRegion;
      },

      get highlightNodes() {
        const nodes: Array<string> = [];

        if (
          self.hoverId &&
          !self.dragId &&
          !self.contextId &&
          (self.activeId !== self.hoverId || self.hoverRegion) &&
          !self.selections.includes(self.hoverId)
        ) {
          nodes.push(self.hoverId);
        }

        if (self.contextId) {
          nodes.push(self.contextId);
        }

        if (
          (self.activeId || self.selections.length) &&
          (!self.dragId || this.draggableContainer(self.dragId)) &&
          !self.insertOrigId &&
          !self.insertId &&
          !(self.hoverId && self.hoverRegion)
        ) {
          self.activeId
            ? nodes.push(self.activeId)
            : nodes.push.apply(nodes, self.selections);
        }

        // Determine whether the parent element is a free container element
        const curFreeContainerId = this.parentIsFreeContainer(self.activeId);
        if (curFreeContainerId) {
          nodes.push(curFreeContainerId);
        }

        if (self.insertMode === 'insert' && self.insertId) {
          nodes.push(self.insertId);
        }

        self.insertOrigId && nodes.push(self.insertOrigId);
        self.dropId && nodes.push(self.dropId);
        self.planDropId && nodes.push(self.planDropId);
        self.insertBeforeId && nodes.push(self.insertBeforeId);

        return nodes
          .filter((id, index, thelist) => id && index === thelist.indexOf(id))
          .map(id => this.getNodeById(id)!)
          .filter(node => node);
      },

      getNodeById(
        id: string,
        regionOrType?: string
      ): EditorNodeType | undefined {
        return self.root.getNodeById(id, regionOrType);
      },
      getNodeByComponentId(id: string): EditorNodeType | undefined {
        return self.root.getNodeByComponentId(id);
      },

      get activeNodeInfo(): RendererInfo | null | undefined {
        return this.getNodeById(self.activeId)?.info;
      },

      getSchema(id?: string, idKey?: string) {
        return id ? JSONGetById(self.schema, id, idKey) : self.schema;
      },

      getSchemaByPath(path: Array<string>) {
        return JSONGetByPath(self.schema, path);
      },

      getSchemaParentById(id: string, skipArray: boolean = false) {
        return JSONGetParentById(self.schema, id, skipArray);
      },

      getSchemaPath(id: string): string {
        const paths = JSONGetPathById(self.schema, id);
        return Array.isArray(paths) ? paths.join('/') : '';
      },

      // Used to remove redundant fields
      getSimpleSchema(curSchema: any) {
        return JSONPipeOut(curSchema);
      },

      getPanelKey() {
        let panelKey = self.panelKey;

        if (panelKey === 'none') {
          return panelKey;
        }

        const panels = this.getPanels();
        const isIn = find(panels, panel => panelKey && panel.key === panelKey);

        if (!isIn) {
          return panels[0]?.key || 'none';
        }

        return panelKey;
      },

      getLeftPanelKey() {
        let leftPanelKey = self.leftPanelKey;
        if (this.dragging) {
          return 'outline';
        } else if (leftPanelKey === 'none') {
          return leftPanelKey;
        }
        const panels = this.getLeftPanels();
        const isIn = find(
          panels,
          panel => leftPanelKey && panel.key === leftPanelKey
        );

        if (!isIn) {
          return 'renderers'; // Expand the left component panel by default. Previously, the default was outline.
        }
        return leftPanelKey;
      },

      get leftPanels() {
        return self.panels.filter(panel => panel.position === 'left');
      },

      get rightPanels() {
        //Change the contextmenu panel to a custom panel
        return self.panels.filter(
          panel => panel.position !== 'left' && panel.key !== 'contextmenu'
        );
      },

      get contextMenuPanel() {
        //Change the contextmenu panel to a custom panel
        return self.panels.find(panel => panel.key === 'contextmenu');
      },

      getPanels(): Array<PanelItem> {
        const panels: Array<PanelItem> = [].concat(
          (this.rightPanels as any) || []
        );
        return panels.sort((a, b) => a.order - b.order);
      },

      getLeftPanels(): Array<PanelItem> {
        const panels: Array<PanelItem> = [].concat(
          (this.leftPanels as any) || []
        );

        if (self.insertId && self.insertRegion) {
          panels.push({
            key: 'insert',
            icon: 'fa fa-bolt',
            position: 'left',
            title: self.insertMode === 'replace' ? 'Change' : 'Insert',
            component: InsertSubRendererPanel,
            order: 9999
          });
        }

        // Add a new insert component panel (drawer pop-up)
        panels.push({
          key: 'insertRenderer',
          icon: 'fa fa-bolt',
          position: 'left',
          title: 'Insert Component Panel',
          component: AvailableRenderersPanel,
          order: 9999
        });

        return panels.sort((a, b) => a.order - b.order);
      },

      get sortedToolbars(): Array<ToolbarItem> {
        return self.toolbars
          .filter(
            toolbar =>
              toolbar.level !== 'secondary' && toolbar.level !== 'special'
          )
          .sort((a, b) => a.order - b.order);
      },

      get sortedSecondaryToolbars(): Array<ToolbarItem> {
        return self.toolbars
          .filter(toolbar => toolbar.level === 'secondary')
          .sort((a, b) => a.order - b.order);
      },

      get sortedSpecialToolbars(): Array<ToolbarItem> {
        return self.toolbars
          .filter(toolbar => toolbar.level === 'special')
          .sort((a, b) => a.order - b.order);
      },

      get value() {
        if (!self.activeId) {
          return undefined;
        }

        return this.getValueOf(self.activeId);
      },

      getValueOf(id: string) {
        const schema = JSONGetById(self.schema, id);
        const data = JSONPipeOut(schema, false);
        return data;
      },

      get valueWithoutHiddenProps() {
        if (!self.activeId) {
          return undefined;
        }

        const isSubEditor = self.isSubEditor;
        const isHiddenProps = getEnv(self).isHiddenProps;

        return JSONPipeOut(
          JSONGetById(self.schema, self.activeId),
          (key, props) => {
            if (isSubEditor && key === 'definitions') {
              return true;
            }

            if (typeof isHiddenProps === 'function') {
              return isHiddenProps(key, props);
            }

            return (
              (key.substring(0, 2) === '$$' &&
                key !== '$$comments' &&
                key !== '$$commonSchema' &&
                key !== '$$formSchema') ||
              typeof props === 'function' || // pipeIn 和 pipeOut
              key.substring(0, 2) === '__'
            );
          }
        );
      },

      get outline() {
        return self.root.children;
      },

      get bcn() {
        let bcn: Array<EditorNodeType> = [];

        if (self.activeId) {
          findTree(
            self.root.children,
            (item: EditorNodeType, index: number, leve, paths: any[]) => {
              if (item.id === self.activeId) {
                bcn = paths.concat(item);
                return true;
              }
              return false;
            }
          );
        }

        return bcn.filter(item => !item.isSecondFactor);
      },

      get activePath(): Array<EditorNodeType> {
        return this.getNodePathById(self.activeId);
      },

      getNodePathById(id: string) {
        let paths: Array<EditorNodeType> = [];
        if (!id) {
          return paths;
        }

        let iterator = (
          list: Array<EditorNodeType>,
          parents: Array<EditorNodeType> = []
        ): boolean => {
          return list.every(node => {
            if (node.id === id) {
              paths = parents.concat(node);
              return false;
            } else if (node.children && node.children.length) {
              return iterator(node.children, parents.concat(node));
            }

            return true;
          });
        };

        iterator(self.root.children);

        return paths;
      },

      get dragging() {
        if (this.draggableContainer(self.dragId)) {
          return false;
        }
        return !!(self.dragId || self.dropId);
      },

      get needPatch() {
        let hasUnPatched = (list: Array<EditorNodeType>): boolean => {
          return list.some(node => {
            if (!node.patched && !node.isRegion) {
              return true;
            } else if (node.uniqueChildren.length) {
              return hasUnPatched(node.uniqueChildren);
            }

            return false;
          });
        };

        return hasUnPatched(self.root.children);
      },

      get schemaRaw() {
        return JSONPipeOut(self.schema);
      },

      /** Get platform preset components (basic components)
       * Note: If disabledRendererPlugin is true, it will not be displayed in the panel
       */
      get subRenderersByOrder() {
        return self.subRenderers
          .filter(renderer =>
            !renderer.disabledRendererPlugin && self.showCustomRenderersPanel
              ? renderer.isBaseComponent
              : true
          )
          .sort((a, b) => a.order - b.order);
      },

      /** Get custom components
       * Note: If disabledRendererPlugin is true, it will not be displayed in the panel
       */
      get customRenderersByOrder() {
        return self.subRenderers
          .filter(
            renderer =>
              !renderer.disabledRendererPlugin && !renderer.isBaseComponent
          )
          .sort((a, b) => a.order - b.order);
      },

      /** Filter components by keyword*/
      groupedRenderersByKeyword(
        _subRenderers: Array<SubRendererInfo>,
        keywords: string = ''
      ) {
        const subRenderers = _subRenderers;
        const grouped: {
          [propName: string]: Array<SubRendererInfo>;
        } = {};

        const searchMap = new Map<string, any>();
        matchSorter(subRenderers, keywords, {
          keys: ['name', 'description', 'scaffold.type', 'searchKeywords']
        }).forEach(item => {
          searchMap.set(item.id, item);
        });

        subRenderers.forEach(item => {
          if (searchMap.has(item.id)) {
            const tags = Array.isArray(item.tags)
              ? item.tags.concat()
              : item.tags
              ? [item.tags]
              : ['other'];

            tags.forEach(tag => {
              grouped[tag] = grouped[tag] || [];
              grouped[tag].push(item);
            });
          }
        });

        return grouped;
      },

      /** Filter preset components by keyword
       * Note: Required for component search
       */
      groupedSubRenderersByKeyword(
        _subRenderers?: Array<SubRendererInfo>,
        keywords?: string
      ) {
        // Get the preset component
        const subRenderers: Array<SubRendererInfo> =
          _subRenderers || this.subRenderersByOrder;
        return this.groupedRenderersByKeyword(subRenderers, keywords);
      },

      /**
       * Get preset components based on current category and keyword
       * Note: Component panel display requires
       */
      get groupedSubRenderers() {
        if (self.subRenderersTag) {
          // Get the component list based on tag classification
          const grouped: {
            [propName: string]: Array<SubRendererInfo>;
          } = {};
          const groupedSubRenderers = this.groupedSubRenderersByKeyword();
          const curTagSubRenderers = groupedSubRenderers[self.subRenderersTag];
          if (curTagSubRenderers) {
            grouped[self.subRenderersTag] = curTagSubRenderers;
          }
          return grouped;
        } else {
          // Get component list based on keyword
          return this.groupedSubRenderersByKeyword(
            this.subRenderersByOrder,
            self.subRenderersKeywords
          );
        }
      },

      /** Filter custom components by keyword*/
      groupedCustomRenderersByKeyword(
        _subRenderers?: Array<SubRendererInfo>,
        keywords?: string
      ) {
        // Get the preset component
        const subRenderers: Array<SubRendererInfo> =
          _subRenderers || this.customRenderersByOrder;
        return this.groupedRenderersByKeyword(subRenderers, keywords);
      },

      /**
       * Get custom components based on current categories and keywords
       */
      get groupedCustomRenderers() {
        if (self.customRenderersTag) {
          // Get the component list based on tag classification
          const grouped: {
            [propName: string]: Array<SubRendererInfo>;
          } = {};
          const groupedCustomRenderers = this.groupedCustomRenderersByKeyword();
          const curTagCustomRenderers =
            groupedCustomRenderers[self.customRenderersTag];
          if (curTagCustomRenderers) {
            grouped[self.customRenderersTag] = curTagCustomRenderers;
          }
          return grouped;
        } else {
          // Get component list based on keyword
          return this.groupedCustomRenderersByKeyword(
            this.customRenderersByOrder,
            self.customRenderersKeywords
          );
        }
      },

      getSubRendererById(id: string) {
        return find(self.subRenderers || [], (item: any) => item.id === id);
      },

      get groupedInsertRenderers() {
        const grouped: {
          [propName: string]: Array<SubRendererInfo>;
        } = {
          ['all']: []
        };
        const keywords = self.insertRenderersKeywords;
        const r = new RegExp(stringRegExp(keywords), 'i');

        self.insertRenderers
          .concat()
          .sort((a, b) => a.order - b.order)
          .forEach(item => {
            if (
              !keywords ||
              ['name', 'description', 'scaffold.type'].some(
                key =>
                  resolveVariable(key, item) &&
                  r.test(resolveVariable(key, item))
              )
            ) {
              const tags = Array.isArray(item.tags)
                ? item.tags.concat()
                : item.tags
                ? [item.tags]
                : ['other'];

              tags.forEach(tag => {
                grouped[tag] = grouped[tag] || [];
                grouped[tag].push(item);
              });

              grouped['all'].push(item);
            }
          });

        return grouped;
      },

      get selectedInsertRendererInfo() {
        return find(
          self.insertRenderers,
          item => item.id === self.insertSelected
        );
      },

      get subEditorSlotPath() {
        const slot = self.subEditorContext?.slot;

        if (!slot) {
          return '';
        }

        let paths: Array<string> = [];
        let resolve = (
          value: any,
          prefixPaths: Array<string> = []
        ): boolean => {
          if (
            Array.isArray(value) &&
            value.some((value, index) =>
              resolve(value, prefixPaths.concat(`${index}`))
            )
          ) {
            return true;
          } else if (isPlainObject(value)) {
            return Object.keys(value).some(key => {
              return resolve(value[key], prefixPaths.concat(key));
            });
          } else if (value === '$$') {
            paths = prefixPaths.concat();
            return true;
          }

          return false;
        };

        resolve(slot);

        return paths.length ? paths.join('/') : '';
      },

      get subEditorValue() {
        if (self.subEditorContext) {
          return self.subEditorContext.slot
            ? {
                ...mapObject(self.subEditorContext.slot, function (value: any) {
                  if (value === '$$') {
                    return self.subEditorContext!.value;
                  }

                  return value;
                }),
                isSlot: true
              }
            : self.subEditorContext.value;
        }

        return undefined;
      },

      get canUndo() {
        const idx = self.schemaHistory.findIndex(
          item => item.versionId === self.versionId
        );
        return idx !== 0;
      },

      get canRedo() {
        const idx = self.schemaHistory.findIndex(
          item => item.versionId === self.versionId
        );
        return idx < self.schemaHistory.length - 1;
      },
      // Determine whether the current element positioning is a flex container
      isFlexContainer(id: string) {
        const activeId = id ?? self.activeId;
        const curSchema = this.getSchema(activeId);
        if (
          curSchema?.style?.display === 'flex' ||
          curSchema?.style?.display === 'inline-flex'
        ) {
          return true;
        }
        return false;
      },
      // Determine whether it is a column-level element in the layout container
      isFlexItem(id: string) {
        const activeId = id ?? self.activeId;
        const parentSchema = this.getSchemaParentById(activeId, true);
        if (
          parentSchema?.type === 'flex' ||
          parentSchema?.style?.display === 'flex' ||
          parentSchema?.style?.display === 'inline-flex'
        ) {
          return true;
        }
        return false;
      },
      // Determine whether the parent layout container is arranged vertically
      isFlexColumnItem(id: string) {
        const activeId = id ?? self.activeId;
        const parentSchema = this.getSchemaParentById(activeId, true);
        const isFlexItem =
          parentSchema?.type === 'flex' ||
          parentSchema?.style?.display === 'flex' ||
          parentSchema?.style?.display === 'inline-flex';
        const isFlexColumn =
          parentSchema?.direction === 'column' ||
          parentSchema?.direction === 'column-reverse' ||
          parentSchema?.style?.flexDirection === 'column' ||
          parentSchema?.style?.flexDirection === 'column-reverse';
        if (isFlexItem && isFlexColumn) {
          return true;
        }
        return false;
      },
      // Determine whether the container element can be dragged
      draggableContainer(id?: string) {
        const activeId = id || self.activeId;
        const curSchema = this.getSchema(activeId);
        const curSchemaStyle = curSchema?.style || {};
        if (
          curSchemaStyle?.position === 'fixed' ||
          curSchemaStyle?.position === 'absolute'
        ) {
          return true;
        }
        return false;
      },
      // Determine whether the parent element is a free container element. If the parent element is a free container, return the parent element ID
      parentIsFreeContainer(id?: string) {
        const activeId = id ?? self.activeId;
        const curNode = this.getNodeById(activeId)!;
        const parentNode = curNode?.parent;
        if (!parentNode) {
          return false;
        }
        const curSchema = this.getSchema(parentNode.id);
        if (curSchema?.isFreeContainer) {
          return parentNode.id;
        }
        return false;
      },
      get getSuperEditorData() {
        return self.superEditorData || {};
      },
      // Get the component selection tree
      getComponentTreeSource() {
        return mapTree(
          self.root.children ?? [],
          (item: any) => {
            const schema = item.id
              ? JSONGetById(self.schema, item.id)
              : self.schema;
            let cmptLabel = '';
            const itemLabel = appTranslate(item?.label);
            const schemaLabel = appTranslate(schema?.label);
            const schemaTitle = appTranslate(schema?.title);
            if (item?.region) {
              cmptLabel = itemLabel;
            } else {
              const labelPrefix =
                item.type !== 'cell' ? `<${itemLabel}>` : `<列>`;
              cmptLabel = `${labelPrefix}${
                schemaLabel ?? schemaTitle ?? itemLabel
              }`;
            }
            cmptLabel = cmptLabel ?? itemLabel;
            return {
              id: item.id,
              label: cmptLabel,
              value: schema?.id ?? item.id,
              type: schema?.type ?? item.type,
              schema,
              disabled: !!item.region,
              visible: item.region ? !!item?.children.length : true,
              children: item?.children
            };
          },
          1,
          true
        );
      },

      get scaffoldData() {
        return createObject(self.ctx, {
          ...(self.scaffoldForm?.value || {}),
          __step: self.scaffoldFormStep
        });
      },

      // Get the pop-up outline list
      get modals(): Array<EditorModalBody> {
        const schema = self.schema;
        const modals: Array<DialogSchema | DrawerSchema> = getModals(schema);

        return modals;
      },

      get modalOptions() {
        return this.modals.map((modal: EditorModalBody) => {
          return {
            label: `${
              modal.editorSetting?.displayName ||
              modal.title ||
              'Unnamed pop-up window'
            }`,
            tip:
              modal.actionType === 'confirmDialog'
                ? 'Confirmation box'
                : modal.type === 'drawer'
                ? 'Drawer pop-up'
                : 'Popup',
            value: modal.$$id,
            $$ref: modal.$$ref
          };
        });
      }
    };
  })
  .actions(self => {
    const config: EditorManagerConfig = getEnv(self);
    let versionIdIndex = 0;
    let subEditor: any = null;
    let layer: HTMLElement | undefined = undefined;
    let scale: number = 1;
    let doc: Document = document;
    let iframe: HTMLIFrameElement | undefined = undefined;

    const lazyUpdateTargetName = debounce(
      () => (self as any).updateTargetName(),
      250,
      {
        leading: false,
        trailing: true
      }
    );

    const observer = new ResizeObserver(entries => {
      if (!isAlive(self)) {
        return;
      }

      (self as any).calculateHighlightBox([]);
      for (let entry of entries) {
        const target = entry.target as HTMLElement;
        const id =
          target.getAttribute('data-editor-id') ||
          target.getAttribute('data-region-host');

        if (id) {
          const node = self.getNodeById(id);
          node?.calculateHighlightBox();
        }
      }
    });

    return {
      markReady() {
        self.ready = true;
      },
      setLayer(value: any) {
        layer = value;
      },
      getLayer() {
        return layer;
      },
      // iframe scaling
      setScale(num: number) {
        scale = num;
      },
      getScale() {
        return scale;
      },
      setDoc(value: any) {
        doc = value;
      },
      getDoc() {
        return doc;
      },
      setIframe(value: any) {
        iframe = value;
      },
      getIframe() {
        return iframe;
      },

      setIsMobile(value?: boolean) {
        self.isMobile = !!value;
      },

      setCtx(value: any) {
        if (value?.__super) {
          // The context does not support chaining. If it is sent down in this way, it needs to be converted into a normal object.
          // Currently the platform will send this kind of data, in order to prevent data loss, do some processing
          value = extractObjectChain(value).reduce(
            (obj, item) => Object.assign(obj, item),
            {}
          );
        }

        self.ctx = value;
      },

      setTheme(value: string) {
        self.theme = value;
      },

      setIsSubEditor(isSubEditor: boolean) {
        self.isSubEditor = isSubEditor;
      },

      // Used to set whether to display the custom component panel
      setShowCustomRenderersPanel(_showCustomRenderersPanel: boolean) {
        self.showCustomRenderersPanel = _showCustomRenderersPanel;
      },

      setSchema(json: any) {
        const newSchema = JSONPipeIn(json || {});

        // There is always a $$id in the schema
        // If there is more than one element, it means it is not an empty configuration, so do not replace it directly.
        if (self.schema && Object.keys(self.schema).length > 1) {
          // Do not replace directly, mainly to avoid regenerating $$id or something.
          const changes = diff(
            self.schema,
            newSchema,
            (path, key) => key === '$$id'
          );

          const schema = patchDiff(self.schema, changes);

          // When there is an array change and a member is added or deleted
          // At this time, we usually don't know which member has changed
          // So let all members regenerate $$id
          if (
            changes?.[0]?.kind === 'A' &&
            (changes[0].item.kind === 'D' || changes[0].item.kind === 'N') &&
            Array.isArray(changes[0].path)
          ) {
            const path = changes[0].path;
            const last = path.pop();
            const host = path.reduce((schema, key) => {
              return schema[key];
            }, schema);
            host[last] = host[last].map((item: any) => {
              if (isPlainObject(host[last])) {
                return {
                  ...item,
                  $$id: guid()
                };
              }
              return item;
            });
          }

          self.schema = schema;
        } else {
          self.schema = newSchema;
        }

        this.resetHistory();
        lazyUpdateTargetName();
      },

      insertSchema(event: PluginEvent<InsertEventContext>) {
        const id = event.context.id;
        const region = event.context.region;

        const parent = JSONGetById(self.schema, id);

        if (!parent) {
          // Clearly there is an error.
          return;
        }
        const node = self.getNodeById(id, region);
        const LayoutInstance = getLayoutInstance(self.schema, node!);
        const {beforeInsert, afterInsert} = LayoutInstance;

        beforeInsert && (event.context = beforeInsert(event.context, self));

        const child = JSONPipeIn(event.context.data);

        if (parent?.isFreeContainer) {
          child.style = {
            position: 'absolute',
            inset: '10px auto auto 10px'
          };

          //Special elements, need to add default width
          if (needDefaultWidth(child.type)) {
            child.style.width = '300px';
          }
        }

        const arr = Array.isArray(parent[region])
          ? parent[region].concat()
          : parent[region]
          ? [parent[region]]
          : [];

        if (event.context.beforeId) {
          const idx = findIndex(
            arr,
            (item: any) => item?.$$id === event.context.beforeId
          );
          ~idx ? arr.splice(idx, 0, child) : arr.push(child);
        } else {
          arr.push(child);
        }

        event.context.data = child;
        event.context.regionList = arr;
        afterInsert && (event.context = afterInsert(event.context, self));

        this.traceableSetSchema(
          JSONUpdate(self.schema, id, {
            [region]: event.context.regionList
          })
        );

        child?.$$id &&
          setTimeout(() => {
            this.setActiveId(child.$$id);
          }, 0);

        return child;
      },

      moveSchema(event: PluginEvent<MoveEventContext>) {
        const context = event.context;
        let schema = self.schema;

        // Still in the original position.
        if (context.sourceId === context.beforeId) {
          return;
        }
        const region = context.region;

        const node = self.getNodeById(context.id, region);
        const LayoutInstance = getLayoutInstance(self.schema, node!);
        const {beforeMove, afterMove} = LayoutInstance;

        beforeMove && (event.context = beforeMove(event.context, self));

        const source = JSONGetById(schema, context.sourceId);
        schema = JSONDelete(schema, context.sourceId, undefined, true);

        const json = JSONGetById(schema, context.id);
        let origin = json[region];
        origin = Array.isArray(origin)
          ? origin.concat()
          : origin
          ? [origin]
          : [];

        if (context.beforeId) {
          let idx = findIndex(
            origin,
            (item: any) => item.$$id === context.beforeId
          );
          if (!~idx) {
            throw new Error('Position error, target location not found');
          }
          origin.splice(idx, 0, source);
        } else {
          origin.push(source);
        }

        event.context.regionList = origin;
        afterMove && (event.context = afterMove(event.context, self));

        this.traceableSetSchema(
          JSONUpdate(schema, context.id, {
            [region]: event.context.regionList
          })
        );
      },

      setActiveId(
        id: string,
        region: string = '',
        selections: Array<string> = [],
        onEditorActive: boolean = true
      ) {
        const node = id ? self.getNodeById(id) : undefined;

        if (node?.clickable === false || (id && !node)) {
          return;
        }

        self.activeId = id;
        self.activeRegion = region;
        self.selections = selections;
        // if (!self.panelKey && id) {
        //   self.panelKey = 'config';
        // }
        const schema = self.getSchema(id);

        onEditorActive && (window as any).onEditorActive?.(schema);
      },

      setActiveIdByComponentId(id: string) {
        const node = self.getNodeByComponentId(id);
        if (node) {
          this.setActiveId(node.id, node.region, [], false);
          this.closeSubEditor();
        } else {
          const modals = self.modals;
          const modalSchema = find(modals, modal => modal.id === id);
          if (modalSchema) {
            this.openSubEditor({
              value: modalSchema,
              title: 'Popup preview',
              onChange: (value: any) => {}
            });
          } else {
            const subEditorRef = this.getSubEditorRef();
            if (subEditorRef) {
              subEditorRef.store.setActiveIdByComponentId(id);
              const $$id = subEditorRef.props.value.$$id;
              const modalSchema = find(modals, modal => modal.$$id === $$id);
              this.openSubEditor({
                value: modalSchema,
                title: 'Popup preview',
                onChange: (value: any) => {}
              });
            }
          }
        }
      },

      setActiveElement(selector: string) {
        self.activeElement = selector;
      },

      setSelections(ids: Array<string>) {
        self.activeId = '';
        self.activeRegion = '';
        self.selections = ids ? ids.concat() : [];
      },

      clearSelection() {
        self.selections = [];
      },

      setHoverId(id: string, region?: string) {
        const node = id ? self.getNodeById(id) : undefined;

        if (node?.clickable === false) {
          return;
        }

        self.hoverId = id;
        self.hoverRegion = region || '';
      },

      setMouseMoveRegion(region: string) {
        self.mouseMoveRegion = region;
      },

      setInsertId(id: string) {
        self.insertId = id;
      },

      setContextId(id: string) {
        self.contextId = id;
      },

      setDragId(
        id: string,
        mode: 'move' | 'copy' = 'move',
        type: string = 'schema',
        schema?: any
      ) {
        self.dragId = id;
        self.dragMode = mode;
        self.dragType = type;
        self.dragSchema = schema || (id ? self.getSchema(id) : null);
      },

      setDropId(id: string, region: string = '') {
        self.dropId = id;
        self.dropRegion = region;
        self.planDropId = '';
        self.planDropRegion = '';
      },

      setPlanDropId(id: string, region: string) {
        self.planDropId = id;
        self.planDropRegion = region;
      },

      setActiveToolbars(activeToolbars: Array<ToolbarItem>) {
        self.toolbars = activeToolbars;
      },

      setPanels(panels: Array<PanelItem>) {
        self.panels = panels;
      },

      // Set the renderer (including pre-set components and custom components)
      setSubRenderers(renderers: Array<SubRendererInfo>) {
        self.subRenderers = renderers;
      },

      changeSubRenderersKeywords(keywords: string) {
        self.subRenderersKeywords = keywords;
        self.subRenderersTag = '';
      },

      changeSubRenderersTag(tag: string) {
        self.subRenderersKeywords = '';
        self.subRenderersTag = tag;
      },

      resetSubRenderersKeywords() {
        self.subRenderersKeywords = '';
        self.subRenderersTag = '';
      },

      // Custom component panel
      changeCustomRenderersKeywords(keywords: string) {
        self.customRenderersKeywords = keywords;
        self.customRenderersTag = '';
      },

      // Custom component panel
      changeCustomRenderersTag(tag: string) {
        self.customRenderersKeywords = '';
        self.customRenderersTag = tag;
      },

      // Custom component panel
      resetCustomRenderersKeywords() {
        self.customRenderersKeywords = '';
        self.customRenderersTag = '';
      },

      changeSubRendererRegion(region: string) {
        self.subRendererRegion = region;
      },

      changePanelKey(key: string) {
        if (key !== self.getPanelKey()) {
          self.panelKey = key;
        }
      },

      changeLeftPanelKey(key: string) {
        if (key === 'insert' || self.panelKey === 'insert') {
          return;
        }

        if (key !== self.getLeftPanelKey()) {
          self.leftPanelKey = key;
        }
      },

      changeRenderersTabsKey(key: string) {
        if (key !== self.renderersTabsKey) {
          self.renderersTabsKey = key;
        }
      },

      changeOutlineTabsKey(key: string) {
        if (key !== self.outlineTabsKey) {
          self.outlineTabsKey = key;
        }
      },

      changeLeftPanelOpenStatus(isOpenStatus: boolean) {
        if (isOpenStatus !== self.leftPanelOpenStatus) {
          self.leftPanelOpenStatus = isOpenStatus;
        }
      },

      // Display the component panel on the left (the component panel will pop up automatically in the property panel)
      showRendererPanel(tag?: string, msg?: string) {
        if ('renderers' !== self.getLeftPanelKey()) {
          self.leftPanelKey = 'renderers';
        } else if (tag === self.subRenderersTag || !tag) {
          //toast a small prompt
          toast.info(
            msg ||
              'Please click to add a new element from the component panel on the left.'
          );
        }
        // When the component panel pops up actively, "Basic Components" are displayed first
        self.renderersTabsKey = 'base-renderers';
        if (tag) {
          this.changeSubRenderersTag(tag);
        }
        this.changeLeftPanelOpenStatus(true);
      },

      changeValue(
        value: Schema,
        diff?: any,
        changeFilter?: (schema: any, value: any, id: string, diff?: any) => any,
        id = self.activeId
      ) {
        if (!id) {
          return;
        }
        this.changeValueById(
          id,
          value,
          diff,
          undefined,
          undefined,
          changeFilter
        );
      },

      definitionOnchangeValue(value: Schema, diff?: any) {
        this.changeValueById(self.getRootId(), value, diff);
      },

      changeValueById(
        id: string,
        value: Schema,
        diff?: any,
        replace?: boolean,
        noTrace?: boolean,
        changeFilter?: (schema: any, value: any, id: string, diff?: any) => any
      ) {
        const origin = JSONGetById(self.schema, id);

        if (!origin) {
          return;
        }

        // Usually Panel and codeEditor both have diff information
        if (diff) {
          const result = patchDiff(origin, diff);
          let schema = JSONUpdate(self.schema, id, JSONPipeIn(result), true);
          schema = changeFilter?.(schema, value, id, diff) || schema;
          this.traceableSetSchema(schema, noTrace);
        } else {
          let schema = JSONUpdate(self.schema, id, JSONPipeIn(value), replace);
          schema = changeFilter?.(schema, value, id) || schema;
          this.traceableSetSchema(
            JSONUpdate(self.schema, id, JSONPipeIn(value), replace),
            noTrace
          );
        }
      },

      batchChangeValue(list: Array<{id: string; value: Schema}>) {
        this.traceableSetSchema(
          list.reduce((schema, item) => {
            return JSONUpdate(schema, item.id, JSONPipeIn(item.value), true);
          }, self.schema),
          true
        );
      },

      /**
       * Update the position of special layout elements (fixed, absolute)
       */
      updateContainerStyleByDrag(dragId: string, dx: number, dy: number) {
        const curDragId = dragId || self.dragId;
        if (!curDragId) {
          return;
        }
        const curSchema = self.getSchema(curDragId);
        const curSchemaStyle = curSchema?.style || {};
        if (
          (curDragId && curSchemaStyle?.position === 'fixed') ||
          curSchemaStyle?.position === 'absolute'
        ) {
          let curInset = curSchemaStyle.inset || 'auto';

          const insetArr = curInset.split(' ');
          const inset = {
            top: insetArr[0] || 'auto',
            right: insetArr[1] || 'auto',
            bottom: insetArr[2] || insetArr[0] || 'auto',
            left: insetArr[3] || insetArr[1] || 'auto'
          };

          const newInset = `${
            inset.top !== 'auto' ? unitFormula(inset.top, dy) : 'auto'
          } ${
            inset.right !== 'auto' ? unitFormula(inset.right, -dx) : 'auto'
          } ${
            inset.bottom !== 'auto' ? unitFormula(inset.bottom, -dy) : 'auto'
          } ${inset.left !== 'auto' ? unitFormula(inset.left, dx) : 'auto'}`;

          this.changeValueById(curDragId, {
            ...curSchema,
            style: {
              ...curSchemaStyle,
              inset: newInset
            }
          });

          // Update the highlighted position
          this.calculateHighlightBox([curDragId]);
        }
      },

      moveUp(context: BaseEventContext) {
        const {sourceId, regionNode, region, id} = context;
        if (!sourceId) {
          return;
        }
        const schema = JSONMoveUpById(self.schema, sourceId);
        const LayoutInstance = getLayoutInstance(self.schema, regionNode);

        if (LayoutInstance.afterMoveUp) {
          const parent = JSONGetById(schema, id);
          let regionList = parent[region];
          context.regionList = regionList;
          context = LayoutInstance.afterMoveUp(context, self);
          this.traceableSetSchema(
            JSONUpdate(schema, id, {
              [region]: context.regionList
            })
          );
        } else {
          this.traceableSetSchema(schema);
        }
      },
      moveDown(context: BaseEventContext) {
        const {sourceId, regionNode, region, id} = context;
        if (!sourceId) {
          return;
        }
        const schema = JSONMoveDownById(self.schema, sourceId);
        const LayoutInstance = getLayoutInstance(self.schema, regionNode);

        if (LayoutInstance.afterMoveDown) {
          const parent = JSONGetById(schema, id);
          let regionList = parent[region];
          context.regionList = regionList;
          context = LayoutInstance.afterMoveDown(context, self);
          this.traceableSetSchema(
            JSONUpdate(schema, id, {
              [region]: context.regionList
            })
          );
        } else {
          this.traceableSetSchema(schema);
        }
      },

      del(context: DeleteEventContext) {
        const id = context.id;
        if (id === self.activeId) {
          const node = self.getNodeById(id);
          this.setActiveId(node?.parentId || '', node?.parentRegion);
        } else if (self.activeId) {
          const active = JSONGetById(self.schema, id);

          // If the current selection is inside the node to be deleted, select the upper layer of the node to be deleted instead
          if (JSONGetById(active, self.activeId)) {
            const node = self.getNodeById(id);
            this.setActiveId(node?.parentId || '', node?.parentRegion);
          }
        }

        const schema = JSONDelete(self.schema, id);

        const node = self.getNodeById(id);
        const LayoutInstance = getLayoutInstance(self.schema, node?.parent);

        if (LayoutInstance.afterDelete && node) {
          const parent = JSONGetById(schema, node.parentId);
          let regionList = parent[node.parentRegion];
          context.regionList = regionList;
          context = LayoutInstance.afterDelete(context, self);
          this.traceableSetSchema(
            JSONUpdate(schema, node.parentId, {
              [node.parentRegion]: context.regionList
            })
          );
        } else {
          this.traceableSetSchema(schema);
        }
      },

      delMulti(ids: Array<string>) {
        (Array.isArray(ids) ? ids : [ids]).forEach(id => {
          if (id === self.activeId) {
            const host = self.getNodeById(id)?.host;
            this.setActiveId(host ? host.id : '');
          } else if (self.activeId) {
            const active = JSONGetById(self.schema, id);

            // If the current selection is inside the node to be deleted, select the upper layer of the node to be deleted instead
            if (JSONGetById(active, self.activeId)) {
              const host = self.getNodeById(id)?.host;
              this.setActiveId(host ? host.id : '');
            }
          }
        });
        this.traceableSetSchema(
          ids.reduce((schema, id) => {
            return JSONDelete(schema, id);
          }, self.schema)
        );
      },

      duplicate(id: string | Array<string>) {
        this.traceableSetSchema(
          (Array.isArray(id) ? id : [id]).reduce((schema, id) => {
            return JSONDuplicate(schema, id);
          }, self.schema)
        );
      },

      emptyRegion(id: string, region: string) {
        this.traceableSetSchema(
          JSONUpdate(self.schema, id, {
            [region]: []
          })
        );
      },

      replaceChild(id: string, json: any) {
        this.traceableSetSchema(
          JSONUpdate(self.schema, id, JSONPipeIn(json), true)
        );
      },

      setInsertRegion(
        region: string,
        id: string = '',
        tag = 'all',
        mode: 'insert' | 'replace' = 'insert',
        originId: string = '',
        beforeId?: string
      ) {
        self.insertId = id;
        self.insertRegion = region;
        self.insertTag = tag;

        self.insertMode = mode;
        self.insertOrigId = originId;
        self.insertBeforeId = beforeId || '';
      },

      closeInsertPanel() {
        self.insertOrigId = '';
        self.insertId = '';
        self.insertRegion = '';
        self.insertSelected = '';
        self.insertRenderersKeywords = '';
        self.insertBeforeId = '';
      },

      // Display the Insert Component Panel (New Version: Reuse Component Material Selection Panel)
      showInsertRendererPanel() {
        self.showInsertRenderer = true;
      },

      closeInsertRendererPanel() {
        self.showInsertRenderer = false;
      },

      setInsertRenderers(renderers: Array<SubRendererInfo>) {
        self.insertRenderers = renderers;
      },

      changeInsertRenderersKeywords(keywords: string) {
        self.insertRenderersKeywords = keywords;
      },

      resetInsertRenderersKeywords() {
        self.insertRenderersKeywords = '';
      },

      setInsertTag(tag: string) {
        self.insertTag = tag;
      },

      setInsertSelected(id: string) {
        self.insertSelected = id;
      },

      setJSONSchemaUri(schemaUri: string) {
        self.jsonSchemaUri = schemaUri;
      },

      addModal(modal?: DialogSchema | DrawerSchema, definitions?: any) {
        const [schema] = addModal(self.schema, modal, definitions);
        this.traceableSetSchema(schema);
      },

      /**
       * Counts the number of modal action references with the specified ID
       *
       * @param id The ID of the modal action
       * @returns Returns the number of modal action references
       */
      countModalActionRefs(id: string) {
        let count = 0;
        const host = JSONGetParentById(self.schema, id);

        if (host?.actionType) {
          // If there is a type, it means it is an old action button. The button itself is an action and does not need to be calculated again
          // No type means it is an action in onEvent, the number of references is 1
          return host.type ? 0 : 1;
        } else if (host !== self.schema.definitions) {
          return count;
        }

        const modalKey = Object.keys(host).find(key => host[key]?.$$id === id);
        JSONTraverse(self.schema, (value: any, key: string, host: any) => {
          if (
            key === 'actionType' &&
            ['dialog', 'drawer', 'confirmDialog'].includes(value) &&
            host[value === 'drawer' ? 'drawer' : 'dialog']?.$ref === modalKey
          ) {
            count++;
          }
          return value;
        });

        return count;
      },

      removeModal(id: string) {
        let schema = self.schema;
        const host = JSONGetParentById(schema, id);
        if (host === schema.definitions) {
          const modalKey = Object.keys(host).find(
            key => host[key]?.$$id === id
          );
          JSONTraverse(schema, (value: any, key: string, host: any) => {
            if (
              key === 'actionType' &&
              ['dialog', 'drawer', 'confirmDialog'].includes(value) &&
              host[value === 'drawer' ? 'drawer' : 'dialog']?.$ref === modalKey
            ) {
              schema = JSONDelete(schema, host.$$id);
            }
            return value;
          });
          schema = JSONDelete(schema, id);
        } else {
          schema = JSONDelete(schema, host.$$id);
        }
        this.traceableSetSchema(schema);
      },

      updateModal(
        id: string,
        modal: DialogSchema | DrawerSchema,
        definitions?: any
      ) {
        let schema = self.schema;
        const parent = JSONGetParentById(schema, id);

        if (!parent) {
          throw new Error('modal not found');
        }

        modal = JSONPipeIn(modal);
        if (definitions && isPlainObject(definitions)) {
          schema = mergeDefinitions(schema, definitions, modal);
        }

        const newHostKey =
          ((modal as any).actionType || modal.type) === 'drawer'
            ? 'drawer'
            : 'dialog';

        schema = JSONUpdate(schema, id, modal, true);

        // If you are editing a public pop-up window
        if (!parent.actionType) {
          const modalKey = Object.keys(parent).find(
            key => parent[key]?.$$id === id
          );

          // All references must be updated
          JSONTraverse(schema, (value: any, key: string, host: any) => {
            if (
              key === 'actionType' &&
              ['dialog', 'drawer', 'confirmDialog'].includes(value) &&
              host[value === 'drawer' ? 'drawer' : 'dialog']?.$ref ===
                modalKey &&
              newHostKey !== (value === 'drawer' ? 'drawer' : 'dialog')
            ) {
              schema = JSONUpdate(schema, host.$$id, {
                actionType: (modal as any).actionType || modal.type,
                args: undefined,
                dialog: undefined,
                drawer: undefined,
                [newHostKey]: host[value === 'drawer' ? 'drawer' : 'dialog']
              });
            }
            return value;
          });
        } else {
          // For embedded pop-up windows, just modify them yourself
          schema = JSONUpdate(schema, parent.$$id, {
            actionType: (modal as any).actionType || modal.type,
            args: undefined,
            dialog: undefined,
            drawer: undefined,
            [newHostKey]: modal
          });
        }

        // If there is another pop-up window pointing to itself, then update it as well
        let refIds: string[] = [];
        JSONTraverse(modal, (value: any, key: string, host: any) => {
          if (key === '$ref' && host.$$originId === id) {
            refIds.push(host.$$id);
          }
        });
        if (refIds.length) {
          let refKey = '';
          [schema, refKey] = addModal(schema, modal);
          schema = JSONUpdate(schema, parent.$$id, {
            [newHostKey]: JSONPipeIn({
              $ref: refKey
            })
          });
          refIds.forEach(refId => {
            schema = JSONUpdate(schema, refId, {
              $ref: refKey,
              $$originId: undefined
            });
          });
        }

        this.traceableSetSchema(schema);

        // Configuration of todo update pop-up mode
      },

      openSubEditor(context: SubEditorContext) {
        const activeId = self.activeId;

        if (!activeId) {
          return;
        }

        self.subEditorContext = {
          ...context,
          hostNode: self.getNodeById(activeId),
          data: createObject(
            self.ctx,
            extendObject(context.data, {
              __curCmptTreeWrap: {
                label: context.title,
                disabled: true
              },
              __superCmptTreeSource: self.getComponentTreeSource()
            })
          )
        };
      },

      confirmSubEditor([valueRaw]: any) {
        const {onChange, slot} = self.subEditorContext!;
        let value = valueRaw.schema;
        let originValue = valueRaw.__pristine?.schema || value;

        if (slot) {
          const slotPath = self.subEditorSlotPath;
          // const dotPath = slotPath.replace(/\//g, '.');
          // The following codes are treated as comments in the above writing. In the fis project, a group is added.
          const dotPath = slotPath.replace(/(?:\/)/g, '.');
          value = getVariable(value, dotPath);
          originValue = getVariable(originValue, dotPath);

          if (
            Array.isArray(value) &&
            value.length === 1 &&
            !Array.isArray(originValue)
          ) {
            value = value[0];
          }
        }

        onChange(
          value,
          onChange.length > 1 ? diff(originValue, value) : undefined
        );

        self.subEditorContext = undefined;
      },

      closeSubEditor() {
        self.subEditorContext = undefined;
      },

      subEditorOnChange() {
        if (!subEditor) {
          return;
        }

        self.subEditorContext = {
          ...self.subEditorContext!,
          canUndo: subEditor.canUndo(),
          canRedo: subEditor.canRedo()
        };
      },

      undoSubEditor() {
        if (!subEditor) {
          return;
        }
        subEditor.undo();
      },

      redoSubEditor() {
        if (!subEditor) {
          return;
        }

        subEditor.redo();
      },

      subEditorRef(ref: any) {
        subEditor = ref;
      },

      getSubEditorRef() {
        return subEditor;
      },

      openScaffoldForm(context: ScaffoldFormContext) {
        self.scaffoldForm = context;
        /** Reset state before opening */
        self.scaffoldStepManipulated = false;
      },

      closeScaffoldForm() {
        self.scaffoldForm = undefined;
      },

      setScaffoldBuzy(value: any) {
        self.scaffoldFormBuzy = !!value;
      },

      setScaffoldStep(value: number) {
        self.scaffoldFormStep = value;
      },

      setScaffoldStepManipulated(value: boolean) {
        self.scaffoldStepManipulated = value;
      },

      setScaffoldError(msg: string = '') {
        self.scaffoldError = msg;
      },

      updateScaffoldData(value: any, replace?: boolean) {
        if (self.scaffoldForm && value) {
          self.scaffoldForm = {
            ...self.scaffoldForm,
            value: replace
              ? value
              : {
                  ...self.scaffoldForm.value,
                  ...value
                }
          };
        }
      },

      openPopOverForm(context: PopOverFormContext) {
        self.popOverForm = context;
      },

      closePopOverForm() {
        self.popOverForm = undefined;
      },

      openModalForm(context: ModalFormContext) {
        self.modalForm = context;
        self.modalMode = context?.mode || self.modalMode;
        self.modalFormError = '';
      },

      closeModalForm() {
        self.modalForm = undefined;
      },

      markModalFormBuzy(value: any) {
        self.modalFormBuzy = !!value;
      },

      setModalFormError(msg: string = '') {
        self.modalFormError = msg;
      },

      activeHighlightNodes(ids: Array<string>) {
        ids.forEach(id => {
          const node = self.getNodeById(id);
          const target = node?.getTarget();

          if (target) {
            (Array.isArray(target) ? target : [target]).forEach(target =>
              observer.observe(target)
            );
          }
        });
        setTimeout(() => {
          isAlive(self) && this.calculateHighlightBox(ids);
        }, 200);
      },

      deActiveHighlightNodes(ids: Array<string>) {
        ids.forEach(id => {
          const node = self.getNodeById(id);
          const target = node?.getTarget();

          if (target) {
            (Array.isArray(target) ? target : [target]).forEach(target =>
              observer.unobserve(target)
            );
          }
        });
      },

      calculateHighlightBox(
        ids: Array<string> = self.highlightNodes.map(item => item.id)
      ) {
        self.calculateStarted = true;
        ids.forEach(id => {
          const node = self.getNodeById(id);
          node?.calculateHighlightBox(self);
        });
      },

      resetHighlightBox(ids: Array<string>) {
        ids.forEach(id => {
          const node = self.getNodeById(id);
          node?.resetHighlightBox(self);
        });
      },

      /**
       * Update the list of names available for target and reload
       */
      updateTargetName() {
        const targetNames: Array<TargetName> = [];
        JSONTraverse(self.schema, (value: any, key: string, host: any) => {
          if (
            key === 'name' &&
            value &&
            host &&
            (host.type === 'crud' ||
              host.type === 'form' ||
              host.type === 'page' ||
              host.type === 'service' ||
              host.type === 'chart' ||
              host.type === 'wizard')
          ) {
            targetNames.push({
              type: host.type,
              name: value,
              editorId: host.$$id
            });
          }
          return value;
        });
        self.targetNames = cast(targetNames);
      },

      traceableSetSchema(schema: any, noTrace?: boolean) {
        const idx = self.schemaHistory.findIndex(
          item => item.versionId === self.versionId
        );
        if (~idx) {
          self.schemaHistory.splice(
            idx + 1,
            self.schemaHistory.length - idx - 1
          );
        }
        if (noTrace) {
          self.schemaHistory.pop();
        }
        self.schemaHistory.push({
          versionId: (self.versionId = versionIdIndex++),
          schema: schema
        });
        self.schema = schema;
        lazyUpdateTargetName();
      },

      undo() {
        const idx = self.schemaHistory.findIndex(
          item => item.versionId === self.versionId
        );

        if (idx > 0) {
          const version = self.schemaHistory[idx - 1];
          self.versionId = version.versionId;
          self.schema = version.schema;
          lazyUpdateTargetName();
          this.autoSelectRoot();
        }
      },

      redo() {
        const idx = self.schemaHistory.findIndex(
          item => item.versionId === self.versionId
        );
        if (idx < self.schemaHistory.length - 1) {
          const version = self.schemaHistory[idx + 1];
          self.versionId = version.versionId;
          self.schema = version.schema;
          lazyUpdateTargetName();
          this.autoSelectRoot();
        }
      },

      autoSelectRoot() {
        // After undoing or redoing, the currently selected element may have been deleted in the undo process. In this case, the root node needs to be automatically selected.
        const curElem = self.getSchema(self.activeId);
        if (!curElem) {
          this.setActiveId(self.getRootId());
        }
      },

      resetHistory() {
        versionIdIndex = 0;
        self.versionId = versionIdIndex++;
        self.schemaHistory.replace([
          {
            versionId: self.versionId,
            schema: self.schema
          }
        ]);
        this.autoSelectRoot();
      },

      /**
       * The logic in MiniEditor is now used in pageEditor
       */
      applyPatches(patches: Array<PatchItem>) {
        let json = self.schema;
        patches.forEach(item => {
          if (item.op === 'update') {
            json = JSONUpdate(json, item.target, item.value);
          } else if (item.op === 'replace') {
            json = JSONUpdate(json, item.target, item.value, true);
          } else if (item.op === 'delete') {
            json = JSONDelete(json, item.target);
          } else if (item.op === 'push') {
            let target = JSONGetById(json, item.target);
            let container = target[item.key];
            container = Array.isArray(container)
              ? container.concat()
              : container
              ? [container]
              : [];
            container.push(item.value);
            target = {
              ...target,
              [item.key]: container
            };
            json = JSONUpdate(json, item.target, target);
          } else if (item.op === 'splice') {
            let target = JSONGetById(json, item.target);
            let container = target[item.key];
            container = Array.isArray(container)
              ? container.concat()
              : container
              ? [container]
              : [];
            container.splice(...item.args);
            target = {
              ...target,
              [item.key]: container
            };
            json = JSONUpdate(json, item.target, target);
          }
        });
        this.traceableSetSchema(json);
      },

      /** Change the application's multilingual status */
      updateAppLocaleState() {
        self.appLocaleState += 1;
      },

      /** Set the application language to support application internationalization*/
      setAppLocale(locale?: string) {
        if (!locale) {
          return;
        }
        self.appLocale = locale;
        this.updateAppLocaleState();
      },

      /** Set the application's corpus data */
      setAppCorpusData(data: any = {}) {
        self.appCorpusData = data;
        this.updateAppLocaleState();
      },

      setGlobalEvents(events: IGlobalEvent[]) {
        self.globalEvents = events;
      },

      setGlobalVariables(
        variables: Array<GlobalVariableItem & {id: string | number}>
      ) {
        self.globalVariables = variables;
      },

      beforeDestroy() {
        observer.disconnect();
        lazyUpdateTargetName.cancel();
      }
    };
  });

export type EditorStoreType = Instance<typeof MainStore>;

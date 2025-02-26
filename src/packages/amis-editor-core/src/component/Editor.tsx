import React, {Component} from 'react';
import cx from 'classnames';
import Preview from './Preview';
import {autobind} from '../util';
import {MainStore, EditorStoreType} from '../store/editor';
import {EditorManager, EditorManagerConfig, PluginClass} from '../manager';
import {reaction} from 'mobx';
import {RenderOptions, closeContextMenus, toast} from 'amis';
import {
  PluginEventListener,
  RendererPluginAction,
  IGlobalEvent
} from '../plugin';
import {reGenerateID} from '../util';
import {SubEditor} from './SubEditor';
import Breadcrumb from './Breadcrumb';
import {destroy, isAlive} from 'mobx-state-tree';
import {ScaffoldModal} from './ScaffoldModal';
import {PopOverForm} from './PopOverForm';
import {ModalForm} from './ModalForm';
import {ContextMenuPanel} from './Panel/ContextMenuPanel';
import {LeftPanels} from './Panel/LeftPanels';
import {RightPanels} from './Panel/RightPanels';
import type {SchemaObject} from 'amis';
import type {VariableGroup, VariableOptions} from '../variable';
import type {EditorNodeType} from '../store/node';
import {MobileDevTool} from '@/packages/amis-ui/src';
import {LeftPanelsProps} from './Panel/LeftPanels';
import {RightPanelsProps} from './Panel/RightPanels';

export interface EditorProps extends PluginEventListener {
  value: SchemaObject;
  onChange: (value: SchemaObject) => void;
  preview?: boolean;
  isMobile?: boolean;
  isSubEditor?: boolean;
  autoFocus?: boolean;
  className?: string;
  $schemaUrl?: string;
  schemas?: Array<any>;
  theme?: string;
  /** Toolbar mode */
  toolbarMode?: 'default' | 'mini';
  /** Is a pop-up window required? */
  noDialog?: boolean;
  /** Application language type */
  appLocale?: string;
  /** Whether to enable multi-language*/
  i18nEnabled?: boolean;
  showCustomRenderersPanel?: boolean;
  amisDocHost?: string;
  superEditorData?: any;
  withSuperDataSchema?: boolean;
  /** Host node triggered when the current Editor is a SubEditor*/
  hostManager?: EditorManager;
  hostNode?: EditorNodeType;
  dataBindingChange?: (
    value: string,
    data: any,
    manager?: EditorManager
  ) => void;

  /**
   * Preview You can modify the configuration before previewing.
   * For example, replace the API address with the proxy address.
   */
  schemaFilter?: (schema: any, isPreview?: boolean) => any;
  amisEnv?: RenderOptions;

  /**
   * Context data. After setting, these values ​​can be obtained in the panel and scaffolding form.
   */
  ctx?: any;
  data?: any;

  /**
   * Whether to disable built-in plugins
   */
  disableBultinPlugin?: boolean;

  /**
   * Plugin scenario
   */
  scene?: string;

  disablePluginList?:
    | Array<string>
    | ((id: string, plugin: PluginClass) => boolean);

  plugins?: Array<
    | PluginClass
    | [PluginClass, Record<string, any> | (() => Record<string, any>)]
  >;

  /**
   * Other properties passed to the previewer
   */
  previewProps?: any;

  isHiddenProps?: (key: string) => boolean;

  /**
   * Event action panel related configuration
   */
  actionOptions?: {
    // Whether to open the old action configuration entry
    showOldEntry?: boolean;
    /**
     * Common action set (action tree on the left side of the event action panel)
     */
    actionTreeGetter?: (
      actionTree: RendererPluginAction[]
    ) => RendererPluginAction[];
    /**
     * Custom action configuration
     */
    customActionGetter?: (manager: EditorManager) => {
      [propName: string]: RendererPluginAction;
    };

    globalEventGetter?: (manager: EditorManager) => IGlobalEvent[];
  };

  /** Context variables */
  variables?: VariableGroup[];
  /** Variable configuration */
  variableOptions?: VariableOptions;

  onUndo?: () => void; // Used to trigger external undo events
  onRedo?: () => void; // Used to trigger external redo events
  onSave?: () => void; // Used to trigger external save event
  onPreview?: (preview: boolean) => void; // Used to trigger external preview events

  /** Event triggered before opening the formula editor*/
  onFormulaEditorOpen?: (
    node: EditorNodeType,
    manager: EditorManager,
    ctx: Record<string, any>,
    host?: {
      node?: EditorNodeType;
      manager?: EditorManager;
    }
  ) => Promise<void | boolean>;

  getHostNodeDataSchema?: () => Promise<any>;

  getAvaiableContextFields?: (node: EditorNodeType) => Promise<any>;
  readonly?: boolean;

  onEditorMount?: (manager: EditorManager) => void;
  onEditorUnmount?: (manager: EditorManager) => void;

  children?: React.ReactNode | ((manager: EditorManager) => React.ReactNode);

  LeftPanelsComponent?: React.ComponentType<LeftPanelsProps>;
  RightPanelsComponent?: React.ComponentType<RightPanelsProps>;

  /**
   * Rich text editor configuration, for inline editing
   */
  richTextOptions?: any;
  richTextToken?: string;
}

export default class Editor extends Component<EditorProps> {
  readonly store: EditorStoreType;
  readonly manager: EditorManager;
  readonly mainRef = React.createRef<HTMLDivElement>();
  readonly mainPreviewRef = React.createRef<HTMLDivElement>();
  readonly mainPreviewBodyRef = React.createRef<any>();
  toDispose: Array<Function> = [];
  lastResult: any;
  curCopySchemaData: any; // Used to record the currently copied elements

  static defaultProps = {
    autoFocus: true
  };
  isInternalChange: boolean = false;

  constructor(props: EditorProps) {
    super(props);

    const {
      value,
      isSubEditor = false,
      onChange,
      showCustomRenderersPanel,
      superEditorData,
      hostManager,
      onEditorMount,
      ...rest
    } = props;

    const config: EditorManagerConfig = {
      ...rest
    };
    this.store = MainStore.create(
      {
        isMobile: props.isMobile,
        theme: props.theme,
        toolbarMode: props.toolbarMode || 'default',
        noDialog: props.noDialog,
        isSubEditor,
        amisDocHost: props.amisDocHost,
        superEditorData,
        appLocale: props.appLocale,
        appCorpusData: props?.amisEnv?.replaceText,
        i18nEnabled: props?.i18nEnabled ?? false
      },
      config
    );
    this.store.setCtx(props.ctx);
    this.store.setSchema(value);
    if (showCustomRenderersPanel !== undefined) {
      this.store.setShowCustomRenderersPanel(showCustomRenderersPanel);
    }

    this.manager = new EditorManager(config, this.store, hostManager);

    this.store.setGlobalEvents(
      config.actionOptions?.globalEventGetter?.(this.manager) || []
    );

    // Sub-editor no longer resets editorStore
    if (!(props.isSubEditor && (window as any).editorStore)) {
      (window as any).editorStore = this.store;
    }

    // Add shortcut key event
    document.addEventListener('keydown', this.handleKeyDown);

    window.addEventListener('message', this.handleMessage, false);

    this.toDispose.push(
      reaction(
        () => this.store.schemaRaw,
        (raw: any) => {
          this.lastResult = raw;

          if (this.isInternalChange) {
            return;
          }
          props.onChange(raw);
        }
      )
    );
    this.toDispose.push(
      this.manager.on('preview2editor', () => this.manager.rebuild())
    );

    onEditorMount?.(this.manager);
  }

  componentDidMount() {
    const store = this.manager.store;
    if (this.props.isSubEditor) {
      // Wait for the sub-editor animation to end and re-acquire the highlighted component position
      setTimeout(() => {
        store.calculateHighlightBox(store.highlightNodes.map(node => node.id));
      }, 500);
    } else {
      this.manager.trigger('init', {
        data: this.manager
      });
    }
  }

  componentDidUpdate(prevProps: EditorProps) {
    const props = this.props;

    if (props.value !== prevProps.value && props.value !== this.lastResult) {
      this.isInternalChange = true;
      this.store.setSchema(props.value);
      this.isInternalChange = false;
    }

    if (props.isMobile !== prevProps.isMobile) {
      this.store.setIsMobile(props.isMobile);
    }

    if (props.ctx !== prevProps.ctx) {
      this.store.setCtx(props.ctx);
    }

    if (props.appLocale !== prevProps.appLocale) {
      this.store.setAppLocale(props.appLocale);
    }

    if (props?.amisEnv?.replaceText !== prevProps?.amisEnv?.replaceText) {
      this.store.setAppCorpusData(props?.amisEnv?.replaceText);
    }
    if (
      props.actionOptions?.globalEventGetter?.(this.manager) !==
      prevProps.actionOptions?.globalEventGetter?.(this.manager)
    ) {
      this.store.setGlobalEvents(
        props.actionOptions?.globalEventGetter?.(this.manager) || []
      );
    }
  }

  componentWillUnmount() {
    this.props.onEditorUnmount?.(this.manager);
    document.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('message', this.handleMessage);
    this.toDispose.forEach(fn => fn());
    this.toDispose = [];
    this.manager.dispose();
    setTimeout(() => destroy(this.store), 4);
  }

  // Shortcut function keys
  @autobind
  handleKeyDown(e: KeyboardEvent) {
    // Pop-up mode is not processed
    if (this.props.isSubEditor) {
      // e.defaultPrevented // or has been blocked and not processed
      return;
    }

    if (this.props.readonly) {
      return;
    }

    const manager = this.manager;
    const store = manager.store;

    if (
      (e.target as HTMLElement).tagName === 'BODY' &&
      (e.key === 'z' || e.key === 'Z') &&
      (e.metaKey || e.ctrlKey) &&
      e.shiftKey
    ) {
      e.preventDefault();
      this.redo(); // redo
      return;
    } else if (
      (e.target as HTMLElement).tagName === 'BODY' &&
      (e.key === 'z' || e.key === 'Z') &&
      (e.metaKey || e.ctrlKey)
    ) {
      e.preventDefault();
      this.undo(); // Undo
      return;
    } else if (
      (e.target as HTMLElement).tagName === 'BODY' &&
      (e.key === 's' || e.key === 'S') &&
      (e.metaKey || e.ctrlKey)
    ) {
      e.preventDefault();
      this.save(); // Save
      return;
    } else if (
      (e.target as HTMLElement).tagName === 'BODY' &&
      (e.key === 'c' || e.key === 'C') &&
      (e.metaKey || e.ctrlKey)
    ) {
      // e.preventDefault(); // Comment out the method that prevents the default behavior, allowing the user to copy the text in the designer
      this.copy(); // Copy
      return;
    } else if (
      (e.target as HTMLElement).tagName === 'BODY' &&
      (e.key === 'v' || e.key === 'V') &&
      (e.metaKey || e.ctrlKey)
    ) {
      e.preventDefault();
      if (this.curCopySchemaData) {
        this.paste(); // paste
      }
      return;
    } else if (
      (e.target as HTMLElement).tagName === 'BODY' &&
      e.key === 'x' &&
      (e.metaKey || e.ctrlKey)
    ) {
      e.preventDefault();
      // Cut
      if (this.store.activeId) {
        const node = store.getNodeById(this.store.activeId);
        if (node && store.activeRegion) {
          toast.warning('Region nodes are not allowed to be cut.');
        } else if (store.isRootSchema(this.store.activeId)) {
          toast.warning('Root node cannot be cut.');
        } else if (node && node.moveable) {
          this.copy(); // Copy
          this.manager.del(this.store.activeId); // 删除
        } else {
          toast.warning('The current element does not allow cutting.');
        }
      }
    } else if (
      (e.target as HTMLElement).tagName === 'BODY' &&
      e.key === 'p' &&
      (e.metaKey || e.ctrlKey)
    ) {
      // Preview
      e.preventDefault(); // Avoid triggering the system default event (print shortcut key)
      this.preview();
    } else if (
      (e.target as HTMLElement).tagName === 'BODY' &&
      e.key === 'ArrowUp' &&
      (e.metaKey || e.ctrlKey)
    ) {
      e.preventDefault();
      // Move up
      if (this.store.activeId) {
        const node = store.getNodeById(this.store.activeId);
        if (node && node.canMoveUp) {
          this.manager.moveUp();
        } else {
          toast.warning('The current element cannot be moved up');
        }
      }
    } else if (
      (e.target as HTMLElement).tagName === 'BODY' &&
      e.key === 'ArrowDown' &&
      (e.metaKey || e.ctrlKey)
    ) {
      e.preventDefault();
      // Move down
      if (this.store.activeId) {
        const node = store.getNodeById(this.store.activeId);
        if (node && node.canMoveDown) {
          this.manager.moveDown();
        } else {
          toast.warning('The current element cannot be moved down');
        }
      }
    } else if (
      (e.target as HTMLElement).tagName === 'BODY' &&
      (e.key === 'Backspace' || e.key === 'Delete')
    ) {
      e.preventDefault();
      // Delete shortcut key
      if (this.store.activeId) {
        const node = store.getNodeById(this.store.activeId);
        if (
          node &&
          store.activeRegion &&
          node.info?.regions &&
          node.info.regions.length > 1
        ) {
          toast.warning('Region nodes cannot be deleted directly.');
        } else if (store.isRootSchema(this.store.activeId)) {
          toast.warning('Root node cannot be deleted.');
        } else if (node && (node.removable || node.removable === undefined)) {
          this.manager.del(this.store.activeId);
        } else {
          toast.warning('The current element cannot be deleted.');
        }
      }
      return;
    }
  }

  @autobind
  handleMessage(event: any) {
    if (!event.data) {
      return;
    }
    // Add plugin to dynamically add event response mechanism
    if (
      event.data.type === 'amis-widget-register-event' &&
      event.data.editorPluginName
    ) {
      console.info(
        '[amis-editor] responds to dynamically added plugin events:',
        event.data.editorPluginName
      );
      this.manager.dynamicAddPlugin(event.data.editorPluginName);
    }
  }

  // Right-click menu
  @autobind
  async handleContextMenu(e: React.MouseEvent<HTMLElement>) {
    // Do not right-click in inline edit mode
    if (this.store.activeElement) {
      return;
    }

    e.persist();
    await closeContextMenus();
    let targetId: string = '';
    let region = '';

    // If it is under a selected control, let the currently selected renderer call out the right-click menu
    if (this.store.activeId) {
      targetId = (e.target as HTMLElement)
        .closest(`[data-editor-id="${this.store.activeId}"]`)
        ?.getAttribute('data-editor-id')!;
    } else if (this.store.selections.length) {
      targetId = (e.target as HTMLElement)
        .closest(
          this.store.selections
            .map(item => `[data-editor-id="${item}"]`)
            .join(',')
        )
        ?.getAttribute('data-editor-id')!;
    }

    // If not found, search nearby
    if (!targetId) {
      targetId = (e.target as HTMLElement)
        .closest('[data-editor-id]')
        ?.getAttribute('data-editor-id')!;
    }

    // If you can't find it, check if it is the right button in the outline
    if (!targetId) {
      const node = (e.target as HTMLElement).closest(
        '[data-node-id]'
      ) as HTMLElement;
      targetId = node?.getAttribute('data-node-id')!;

      if (!targetId) {
        return;
      }

      region = node.getAttribute('data-node-region')!;
    }

    e.preventDefault();
    e.stopPropagation();
    const manager = this.manager;
    let offsetX = 0;
    let offsetY = 0;

    // Description: It is inside the iframe
    if ((e.target as HTMLElement).ownerDocument !== document) {
      const rect = manager.store.getIframe()!.getBoundingClientRect();
      offsetX = rect.left;
      offsetY = rect.top;
    }

    manager.openContextMenu(targetId, region, {
      x: window.scrollX + e.clientX + offsetX,
      y: window.scrollY + e.clientY + offsetY
    });
  }

  canUndo() {
    return this.store.canUndo;
  }

  canRedo() {
    return this.store.canRedo;
  }

  undo() {
    if (this.props.onUndo) {
      this.props.onUndo(); // Give priority to external undo methods
    } else {
      this.store.undo();
    }
  }

  redo() {
    if (this.props.onRedo) {
      this.props.onRedo(); // Give priority to external redo method
    } else {
      this.store.redo();
    }
  }

  // By default, data changes will trigger front-end temporary storage. This is mainly used to execute external saving methods.
  save() {
    if (this.props.onSave) {
      this.props.onSave();
    }
  }

  preview() {
    if (this.props.onPreview) {
      this.props.onPreview(!this.props.preview);
    }
  }

  /**
   * The copied content is stored in the form of variables
   * Note 1: The system's copy & paste requires the https service to be enabled, so here it is implemented in memory instead
   * Note 2: This method does not support cross-page copy & paste capabilities
   * Note 3: Support for cross-page and cross-browser copy & paste capabilities will be required in the future
   */
  copy() {
    if (this.store.activeId) {
      this.curCopySchemaData = this.store.getSchema(this.store.activeId);
    }
  }

  /**
   * Paste the last copied content
   */
  paste() {
    if (this.store.activeId && this.curCopySchemaData) {
      if (!this.curCopySchemaData) {
        // Consider the case where the copied element is deleted
        return;
      }
      const curSimpleSchema = this.store.getSimpleSchema(
        this.curCopySchemaData
      );
      if (this.store.activeId === this.curCopySchemaData.$$id) {
        // If the element to be copied and pasted is the same, append it directly to the end of the current element
        this.manager.appendSiblingSchema(reGenerateID(curSimpleSchema), false);
      } else {
        this.manager.addElem(reGenerateID(curSimpleSchema), false);
      }
    }
  }

  @autobind
  getToolbarContainer() {
    return this.mainRef.current;
  }

  render() {
    const {
      preview,
      isMobile,
      className,
      theme,
      appLocale,
      data,
      previewProps,
      autoFocus,
      isSubEditor,
      amisEnv,
      readonly,
      children,
      LeftPanelsComponent,
      RightPanelsComponent
    } = this.props;
    const FinalLeftPanels = LeftPanelsComponent ?? LeftPanels;
    const FinalRightPanels = RightPanelsComponent ?? RightPanels;

    return (
      <div
        ref={this.mainRef}
        className={cx(
          'ae-Editor',
          {
            preview: preview
          },
          className
        )}
      >
        <div
          className={cx(
            'ae-Editor-inner',
            isMobile && 'ae-Editor-inner--mobile'
          )}
          onContextMenu={this.handleContextMenu}
        >
          {!preview && !readonly && (
            <FinalLeftPanels
              store={this.store}
              manager={this.manager}
              theme={theme}
            />
          )}

          <div className="ae-Main" ref={this.mainPreviewRef}>
            {!preview && (
              <div className="ae-Header">
                <Breadcrumb store={this.store} manager={this.manager} />
                <div
                  id="aeHeaderRightContainer"
                  className="ae-Header-Right-Container"
                ></div>
              </div>
            )}
            {isMobile && (
              <MobileDevTool
                container={this.mainPreviewRef.current}
                previewBody={
                  this.mainPreviewBodyRef.current?.currentDom?.current
                }
                onChangeScale={scale => {
                  if (scale >= 0) {
                    this.store.setScale(scale / 100);
                  }
                }}
              />
            )}
            <Preview
              {...previewProps}
              editable={!preview}
              isMobile={isMobile}
              store={this.store}
              manager={this.manager}
              theme={theme}
              appLocale={appLocale}
              data={data}
              amisEnv={amisEnv}
              autoFocus={autoFocus}
              toolbarContainer={this.getToolbarContainer}
              readonly={readonly}
              ref={this.mainPreviewBodyRef}
            ></Preview>
          </div>

          {!preview && (
            <FinalRightPanels
              store={this.store}
              manager={this.manager}
              theme={theme}
              appLocale={appLocale}
              amisEnv={amisEnv}
              readonly={readonly}
            />
          )}

          {!preview && <ContextMenuPanel store={this.store} />}

          {typeof children === 'function' ? children(this.manager) : children}
        </div>

        <SubEditor
          store={this.store}
          manager={this.manager}
          theme={theme}
          amisEnv={amisEnv}
          readonly={readonly}
        />
        <ScaffoldModal
          store={this.store}
          manager={this.manager}
          theme={theme}
        />
        <PopOverForm store={this.store} manager={this.manager} theme={theme} />
        <ModalForm store={this.store} manager={this.manager} theme={theme} />
      </div>
    );
  }
}

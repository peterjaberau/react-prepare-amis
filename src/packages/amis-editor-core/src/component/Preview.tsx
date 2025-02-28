import {
  toast,
  Modal,
  Icon,
  Spinner
} from '@/packages/amis/src';
import {
  render,
  resolveRenderer,
  resizeSensor,
} from '@/packages/amis-core/src';
import React, {Component} from 'react';
import cx from 'classnames';
import {autobind, guid, noop, reactionWithOldValue} from '../util';
import {clearStoresCache, RenderOptions} from '@/packages/amis-core/src';
import type {Schema} from '@/packages/amis/src';
import {EditorStoreType} from '../store/editor';
import {observer} from 'mobx-react';
import {EditorManager} from '../manager';
import HighlightBox from './HighlightBox';
import RegionHighlightBox from './RegionHLBox';
import {ErrorRenderer} from './base/ErrorRenderer';
import {isAlive} from 'mobx-state-tree';
import {findTree} from '@/packages/amis-core/src';
import BackTop from './base/BackTop';
import {reaction} from 'mobx';
import type {RendererConfig} from '@/packages/amis-core/src';
import IFramePreview from './IFramePreview';

export interface PreviewProps {
  // isEditorEnabled?: (
  //   info: any,
  //   path: string,
  //   renderer: any,
  //   schema: any
  // ) => boolean;

  theme?: string;
  /** Application language type */
  appLocale?: string;
  amisEnv?: any;
  className?: string;
  editable?: boolean;
  isMobile?: boolean;
  store: EditorStoreType;
  manager: EditorManager;
  data?: any;
  autoFocus?: boolean;

  toolbarContainer?: () => any;

  readonly?: boolean;
  ref?: any;
}

export interface PreviewState {
  ready?: boolean;
}

@observer
export default class Preview extends Component<PreviewProps> {
  currentDom = React.createRef<HTMLDivElement>();
  dialogReaction: any;
  env: RenderOptions = {
    ...this.props.manager.env,
    notify: (type, msg, conf) => {
      if (this.props.editable) {
        console.warn('[Notify]', type, msg);
        return;
      }

      toast[type]
        ? toast[type](
            msg,
            conf || (type === 'error' ? 'System error' : 'System message')
          )
        : console.warn('[Notify]', type, msg);
    },
    theme: this.props.theme,
    session: `preview-${this.props.manager.id}`,
    rendererResolver: this.rendererResolver.bind(this)
  };

  doingSelection = false;

  componentDidMount() {
    const currentDom = this.currentDom.current!;
    currentDom.addEventListener('mouseleave', this.handleMouseLeave);
    currentDom.addEventListener('mousemove', this.handleMouseMove);
    currentDom.addEventListener('click', this.handleClick, true);
    currentDom.addEventListener('dblclick', this.handleDBClick, true);
    currentDom.addEventListener('mouseover', this.handeMouseOver);
    currentDom.addEventListener('mousedown', this.handeMouseDown);
    currentDom.addEventListener('submit', this.handleSubmit);
    this.props.manager.on('after-update', this.handlePanelChange);
  }

  componentWillUnmount() {
    if (this.currentDom.current) {
      const currentDom = this.currentDom.current!;
      currentDom.removeEventListener('mouseleave', this.handleMouseLeave);
      currentDom.removeEventListener('mousemove', this.handleMouseMove);
      currentDom.removeEventListener('click', this.handleClick, true);
      currentDom.removeEventListener('dblclick', this.handleDBClick, true);
      currentDom.removeEventListener('mouseover', this.handeMouseOver);
      currentDom.removeEventListener('mousedown', this.handeMouseDown);
      currentDom.removeEventListener('submit', this.handleSubmit);
      this.props.manager.off('after-update', this.handlePanelChange);
      this.dialogReaction?.();
    }

    this.scrollLayer?.removeEventListener('scroll', this.handlePanelChange);

    setTimeout(() => clearStoresCache([this.env.session!]), 500);
  }

  unSensor?: () => void;
  layer?: HTMLDivElement;
  scrollLayer?: HTMLDivElement;

  @autobind
  contentsRef(ref: HTMLDivElement | null) {
    if (ref) {
      this.layer = ref.parentElement!.querySelector(
        '.ae-Preview-widgets'
      ) as HTMLDivElement;

      this.unSensor = resizeSensor(ref, this.handlePanelChange);
      if (this.props.isMobile) {
        ref = ref.firstChild as HTMLDivElement;
      }

      this.scrollLayer = ref as HTMLDivElement;
      this.scrollLayer.removeEventListener('scroll', this.handlePanelChange);
      this.scrollLayer.addEventListener('scroll', this.handlePanelChange);
      this.props.store.setLayer(this.layer);
    } else {
      delete this.scrollLayer;
      delete this.layer;
      this.unSensor?.();
      delete this.unSensor;
    }
  }

  // Optimize this
  readonly unReaction: () => void = reactionWithOldValue(
    () => [this.getHighlightNodes(), this.props.store.activeId],
    ([ids]: [Array<string>], oldValue: [Array<string>]) => {
      const store = this.props.store;
      // requestAnimationFrame(() => {
      //   this.calculateHighlightBox(ids);
      // });
      store.activeHighlightNodes(ids);
      let oldIds = oldValue?.[0];

      if (Array.isArray(oldIds)) {
        oldIds = oldIds.filter(id => !~ids.indexOf(id));
        store.deActiveHighlightNodes(oldIds);
        // store.resetHighlightBox(oldIds);
      }
    }
  );

  @autobind
  handlePanelChange() {
    if (this.layer && this.scrollLayer) {
      requestAnimationFrame(() => {
        if (!this.layer) {
          return;
        }
        this.layer!.style.cssText += `transform: translate(0, -${
          this.scrollLayer!.scrollTop
        }px);`;
      });
    }

    requestAnimationFrame(() =>
      this.calculateHighlightBox(this.getHighlightNodes())
    );
  }

  getHighlightNodes() {
    const store = this.props.store;
    return store.highlightNodes.map(item => item.id);
  }

  @autobind
  calculateHighlightBox(ids: Array<string>) {
    const store = this.props.store;
    this.layer && store.calculateHighlightBox(ids);
  }

  @autobind
  handeMouseDown(e: MouseEvent) {
    const isLeftButton =
      (e.button === 1 && window.event !== null) || e.button === 0;
    if (!this.props.editable || !isLeftButton || e.defaultPrevented) return;

    const store = this.props.store;
    if (
      e.defaultPrevented ||
      (e.target as HTMLElement)?.closest('[draggable]') ||
      store.activeElement
    ) {
      return;
    }

    const dom = this.layer as HTMLElement;
    if (!dom) {
      return;
    }

    let cursor: HTMLDivElement | null = null;
    const rect = dom.getBoundingClientRect();
    const startX = e.pageX;
    const startY = e.pageY;
    const x = startX - rect.left;
    const y = startY - rect.top;

    let onMove = (e: MouseEvent) => {
      if (!cursor) {
        cursor = document.createElement('div');
        cursor.classList.add('ae-Editor-selectionCursor');
        dom.appendChild(cursor);
      }

      this.doingSelection = true;
      const w = e.pageX - startX;
      const h = e.pageY - startY;
      cursor.style.cssText = `left: ${x + Math.min(w, 0)}px; top: ${
        y + Math.min(h, 0)
      }px; width: ${Math.abs(w)}px; height: ${Math.abs(h)}px;`;
    };
    let onUp = (e: MouseEvent) => {
      this.doingSelection = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      cursor && dom.removeChild(cursor);

      const w = e.pageX - startX;
      const h = e.pageY - startY;
      const rect = {
        x: x + Math.min(w, 0),
        y: y + Math.min(h, 0),
        w: Math.abs(w),
        h: Math.abs(h)
      };

      if (rect.w < 10 && rect.h < 10) {
        return;
      }

      // Prevent the click event from firing.
      let captureClick = (e: MouseEvent) => {
        window.removeEventListener('click', captureClick, true);
        e.preventDefault();
        e.stopPropagation();
      };
      window.addEventListener('click', captureClick, true);
      setTimeout(
        () => window.removeEventListener('click', captureClick, true),
        350
      );

      this.doSelection(rect);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  /** Drag multiple selections */
  doSelection(rect: {x: number; y: number; w: number; h: number}) {
    const layer = this.layer;
    const dom = this.currentDom.current;
    if (!layer || !dom) {
      return;
    }

    const selections: Array<HTMLElement> = [];
    const layerRect = layer.getBoundingClientRect();
    const frameRect = {
      left: rect.x + layerRect.left,
      top: rect.y + layerRect.top,
      width: rect.w,
      height: rect.h,
      right: rect.x + layerRect.left + rect.w,
      bottom: rect.y + layerRect.top + rect.h
    };
    const nodes = dom.querySelectorAll(`[data-editor-id]`);
    [].slice.apply(nodes).forEach((node: HTMLElement) => {
      if (selections.some(container => container.contains(node))) {
        return;
      }

      const nodeRect = node.getBoundingClientRect();

      // Completely included
      if (
        frameRect.left <= nodeRect.left &&
        frameRect.top <= nodeRect.top &&
        frameRect.right >= nodeRect.right &&
        frameRect.bottom >= nodeRect.bottom
      ) {
        ~selections.indexOf(node) || selections.push(node);
      }
    });
    const ids = selections
      .map(item => item.getAttribute('data-editor-id')!)
      .filter((id: string, idx, list) => list.indexOf(id) === idx);
    ids.length && this.props.manager.setSelection(ids);
  }

  @autobind
  handleClick(e: MouseEvent) {
    const store = this.props.store;

    // When in editing mode, do not respond to click events
    if (store.activeElement) {
      // Also prevent click events in the renderer
      e.preventDefault();
      return;
    }

    const target = (e.target as HTMLElement).closest(`[data-editor-id]`);

    if ((e.target as HTMLElement).closest('.ae-editor-action-btn')) {
      // Elements that are allowed to be clicked in the designer content area, such as the back to top function button.
      return;
    }

    if (e.defaultPrevented) {
      e.stopPropagation();
      return;
    }

    if (target) {
      const curActiveId = target.getAttribute('data-editor-id');
      let curRegion: string = '';

      // Determine whether you are currently in a sub-area
      const targetRegion = (e.target as HTMLElement).closest(
        `[data-region-host]`
      );
      if (targetRegion) {
        // Special area allows click events
        const curRegionId = targetRegion.getAttribute('data-region-host');
        if (
          curRegionId &&
          curRegionId === curActiveId &&
          targetRegion.getAttribute('data-region')
        ) {
          // Make sure the click is on a sub-area of ​​the currently pre-selected element
          curRegion = targetRegion.getAttribute('data-region')!;
        }
      }

      e.metaKey
        ? this.props.manager.toggleSelection(curActiveId!)
        : store.setActiveId(curActiveId!, curRegion);
    }

    if (!this.layer?.contains(e.target as HTMLElement) && this.props.editable) {
      // Make the renderer non-clickable and only selectable by clicking.
      const event = this.props.manager.trigger('prevent-click', {
        data: e
      });

      if (!event.prevented && !event.stoped) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }

  @autobind
  handleDBClick(e: MouseEvent) {
    const store = this.props.store;
    let target = e.target as HTMLElement;
    let hostElem = target.closest(`[data-editor-id]`) as HTMLElement;

    if (!hostElem) {
      const hlbox = target.closest(`[data-hlbox-id]`) as HTMLElement;
      // The highlighted area in the free container is clickable
      // When the click comes from the highlighted area, the clicked element on the component needs to be calculated based on the position
      if (hlbox) {
        let x = e.clientX;
        let y = e.clientY;

        const layer: HTMLElement = store.getLayer()!;
        const layerRect = layer.getBoundingClientRect();
        const iframe = store.getIframe();

        // Calculate the actual position of the mouse on the page. If an iframe exists, the iframe offset and iframe scaling must be considered.
        let scrollTop = 0;
        if (iframe) {
          scrollTop = iframe.contentWindow?.scrollY || 0;
          x -= layerRect.left;
          y -= layerRect.top;
          y += scrollTop;
        }
        const elements = store.getDoc().elementsFromPoint(x, y);
        target = elements.find((ele: Element) => {
          hostElem = ele.closest(
            `[data-editor-id="${hlbox.getAttribute('data-hlbox-id')}"]`
          ) as HTMLElement;
          return hostElem;
        }) as HTMLElement;
      }
    }

    if (hostElem) {
      const node = store.getNodeById(hostElem.getAttribute('data-editor-id')!);
      if (!node) {
        return;
      }
      e.preventDefault();
      const rendererInfo = node.info;

      // Need to support :scope > xxx syntax, so write it like this
      let inlineElem: HTMLElement | undefined | null = null;
      const inlineSetting = (rendererInfo.inlineEditableElements || []).find(
        elem => {
          inlineElem = (
            [].slice.call(
              hostElem.querySelectorAll(elem.match)
            ) as Array<HTMLElement>
          ).find(dom => dom.contains(target));
          return !!inlineElem;
        }
      )!;

      // If an element that supports inline editing is hit, start inline editing
      if (inlineElem && inlineSetting) {
        const manager = this.props.manager;
        manager.startInlineEdit(node, inlineElem, inlineSetting, e);
      }
    }
  }

  @autobind
  handleNavSwitch(id: string) {
    const store = this.props.store;
    store.setActiveId(id);
  }

  @autobind
  handleMouseMove(e: MouseEvent) {
    if (this.doingSelection || this.props.manager.disableHover) {
      return;
    }

    const store = this.props.store;
    const dom = e.target as HTMLElement;

    if (this.layer?.contains(dom)) {
      return;
    }

    if ((e.target as HTMLElement).closest('.ignore-hover-elem')) {
      // Ignore hover elements in the designer content area, such as the region header tag.
      return;
    }

    const target = dom.closest(`[data-editor-id]`);

    if (target) {
      const curHoverId = target.getAttribute('data-editor-id');
      let curHoverRegion: string = '';

      // Determine whether you are currently in a sub-area
      const targetRegion = (e.target as HTMLElement).closest(
        `[data-region-host]`
      );
      if (targetRegion) {
        // Special area allows click events
        const curRegionId = targetRegion.getAttribute('data-region-host');
        if (
          curRegionId &&
          curRegionId === curHoverId &&
          targetRegion.getAttribute('data-region')
        ) {
          // Make sure the click is on a sub-area of ​​the currently pre-selected element
          curHoverRegion = targetRegion.getAttribute('data-region')!;
        }
      }

      store.setMouseMoveRegion(curHoverRegion);
      store.setHoverId(curHoverId!);
    }
  }

  @autobind
  handleMouseLeave() {
    const store = this.props.store;
    store.setMouseMoveRegion('');
    store.setHoverId('');
  }

  @autobind
  handeMouseOver(e: MouseEvent) {
    if (this.props.editable) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  // Disable internal submit events
  handleSubmit(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }

  @autobind
  handleDragEnter(e: React.DragEvent) {
    if (!this.props.editable) {
      // Do not listen to drag events in non-editing mode
      return;
    }
    const manager = this.props.manager;
    manager.dnd.dragEnter(e.nativeEvent);
  }

  @autobind
  handleDragLeave(e: React.DragEvent) {
    if (!this.props.editable) {
      return;
    }
    const manager = this.props.manager;
    manager.dnd.dragLeave(e.nativeEvent);
  }

  @autobind
  handleDragOver(e: React.DragEvent) {
    if (!this.props.editable) {
      return;
    }
    const manager = this.props.manager;
    manager.dnd.dragOver(e.nativeEvent);
  }

  @autobind
  handleDrop(e: React.DragEvent) {
    if (!this.props.editable) {
      return;
    }
    const manager = this.props.manager;
    manager.dnd.drop(e.nativeEvent);
  }

  @autobind
  handleWidgetsDragEnter(e: React.DragEvent) {
    const target = e.target as HTMLElement;
    const dom = target.closest(`[data-node-id][data-node-region].region-tip`);

    if (!dom) {
      return;
    }

    e.preventDefault();
    const manager = this.props.manager;
    const id = dom.getAttribute('data-node-id')!;
    const region = dom.getAttribute('data-node-region')!; // container node in the outline tree

    id && region && manager.dnd.switchToRegion(e.nativeEvent, id, region);
  }

  @autobind
  getCurrentTarget() {
    const isMobile = this.props.isMobile;
    if (isMobile) {
      return this.currentDom.current!.querySelector(
        '.ae-Preview-inner'
      ) as HTMLDivElement;
    } else {
      return this.currentDom.current!.querySelector(
        '.ae-Preview-body'
      ) as HTMLDivElement;
    }
  }

  rendererResolver(path: string, schema: Schema, props: any) {
    const {editable, manager} = this.props;

    let renderer: RendererConfig = resolveRenderer(path, schema)!;
    if (editable === false) {
      return renderer;
    }

    renderer = renderer || {
      name: 'error',
      test: () => true,
      component: ErrorRenderer
    };

    let info = manager.getEditorInfo(renderer!, path, schema);

    info &&
      (renderer = {
        ...renderer,
        component: manager.makeWrapper(info, renderer)
      });

    return renderer;
  }

  render() {
    const {
      className,
      editable,
      store,
      manager,
      amisEnv,
      theme,
      isMobile,
      autoFocus,
      toolbarContainer,
      appLocale,
      ...rest
    } = this.props;

    const env = {
      ...this.env,
      ...amisEnv
    };

    return (
      <div
        id="editor-preview-body"
        onDragEnter={this.handleDragEnter}
        onDragLeave={this.handleDragLeave}
        onDragOver={this.handleDragOver}
        onDrop={this.handleDrop}
        className={cx(
          'ae-Preview',
          'AMISCSSWrapper',
          className,
          isMobile ? 'is-mobile-body' : 'is-pc-body'
        )}
        ref={this.currentDom}
      >
        <div
          key={
            /* contentsLayer logic is different and needs to be updated*/ isMobile
              ? 'mobile-body'
              : 'pc-body'
          }
          className={cx(
            'ae-Preview-body',
            className,
            editable ? 'is-edting' : '',
            isMobile ? 'is-mobile' : 'is-pc hoverShowScrollBar'
          )}
          ref={this.contentsRef}
        >
          <div className="ae-Preview-inner">
            {!store.ready ? (
              <div className="ae-Preview-loading">
                <Spinner overlay size="lg" />
              </div>
            ) : isMobile ? (
              <IFramePreview
                {...rest}
                key="mobile"
                editable={editable}
                store={store}
                env={env}
                manager={manager}
                autoFocus={autoFocus}
                appLocale={appLocale}
              ></IFramePreview>
            ) : (
              <SmartPreview
                {...rest}
                editable={editable}
                autoFocus={autoFocus}
                store={store}
                env={env}
                manager={manager}
                key="pc"
                appLocale={appLocale}
              />
            )}
          </div>
          {this.currentDom.current && (
            <BackTop
              key={isMobile ? 'mobile-back-up' : 'pc-back-up'}
              className="ae-editor-action-btn"
              target={this.getCurrentTarget.bind(this)}
              onClick={(e: any) => {
                console.log(e);
              }}
            >
              <Icon icon="back-up" className="back-top-icon" />
            </BackTop>
          )}
        </div>

        <div
          onDragEnter={this.handleWidgetsDragEnter}
          className="ae-Preview-widgets"
          id="aePreviewHighlightBox"
        >
          {store.highlightNodes.map(node => (
            <HighlightBox
              node={node}
              key={node.id}
              store={store}
              id={node.id}
              title={node.label}
              toolbarContainer={toolbarContainer}
              onSwitch={this.handleNavSwitch}
              manager={manager}
              readonly={this.props.readonly}
            >
              {node.childRegions.map(region =>
                !node.memberImmutable(region.region) &&
                !store.activeElement &&
                !this.props.readonly &&
                store.isRegionActive(region.id, region.region) ? (
                  <RegionHighlightBox
                    manager={manager}
                    key={region.region}
                    store={store}
                    node={region}
                    id={region.id}
                    name={region.region}
                    title={region.label}
                    preferTag={region.preferTag}
                    isOnlyChildRegion={node.childRegions.length === 1}
                  />
                ) : null
              )}
            </HighlightBox>
          ))}
        </div>
      </div>
    );
  }
}

/**
 * This uses observer, so it can refresh to the minimum extent. If the data does not change, it will not be refreshed.
 */
export interface SmartPreviewProps {
  editable?: boolean;
  autoFocus?: boolean;
  store: EditorStoreType;
  env: any;
  data?: any;
  manager: EditorManager;
  /** Application language type */
  appLocale?: string;
}
@observer
class SmartPreview extends React.Component<SmartPreviewProps> {
  dialogMountRef: React.RefObject<HTMLDivElement> = React.createRef();

  componentDidMount() {
    const store = this.props.store;

    if (this.props.autoFocus) {
      // Generally, the pop-up animation takes about 350ms
      // Delay 350ms, it is better to display the editor in the pop-up box.
      setTimeout(() => {
        if (isAlive(store)) {
          const first = findTree(
            store.outline,
            item => !item.isRegion && item.clickable
          );
          if (first && isAlive(store)) {
            let region = first.childRegions.find(
              (item: any) => item.region === 'body'
            )?.region;
            region =
              region ?? first.childRegions.find((i: any) => i.region)?.region;
            store.setActiveId(first.id, region);
          }
        }
      }, 350);
    } else {
      this.props.manager.buildRenderersAndPanels();
    }
  }

  componentDidUpdate(prevProps: SmartPreviewProps) {
    const props = this.props;

    if (props.editable !== prevProps.editable) {
      if (props.editable) {
        // When the preview state switches to the design state
        this.props.manager.trigger('preview2editor', {
          data: this.props.manager
        });
      }
    }
  }

  @autobind
  getDialogMountRef() {
    return this.dialogMountRef.current;
  }

  render() {
    const {editable, store, appLocale, autoFocus, env, data, manager, ...rest} =
      this.props;

    return (
      // Pop-up window mounting node
      <div ref={this.dialogMountRef} className="ae-Dialog-preview-mount-node">
        {render(
          editable ? store.filteredSchema : store.filteredSchemaForPreview,
          {
            globalVars: store.globalVariables,
            ...rest,
            key: editable ? 'edit-mode' : 'preview-mode',
            theme: env.theme,
            data: data,
            context: store.ctx,
            local: appLocale,
            editorDialogMountNode: this.getDialogMountRef
          },
          {
            ...env,
            session: editable ? 'edit-mode' : 'preview-mode',
            enableAMISDebug: !editable
          }
        )}
      </div>
    );
  }
}

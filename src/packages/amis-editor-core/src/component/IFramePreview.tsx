import {observer} from 'mobx-react';
import {EditorStoreType} from '../store/editor';
import React, {memo} from 'react';
import {EditorManager} from '../manager';
import Frame, {useFrame} from 'react-frame-component';
import {
  autobind,
  closeContextMenus,
  findTree,
  render,
  resizeSensor
} from '@/packages/src';
import {isAlive} from 'mobx-state-tree';

/**
 * This uses observer, so it can refresh to the minimum extent. If the data does not change, it will not be refreshed.
 */
export interface IFramePreviewProps {
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
export default class IFramePreview extends React.Component<IFramePreviewProps> {
  initialContent: string = '';
  dialogMountRef: React.RefObject<HTMLDivElement> = React.createRef();
  iframeRef: HTMLIFrameElement;
  constructor(props: IFramePreviewProps) {
    super(props);

    const styles = [].slice
      .call(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map((el: any) => {
        return el.outerHTML;
      });
    styles.push(
      `<style>body {height:auto !important;min-height:100%;display: flex;flex-direction: column;}</style>`
    );

    this.initialContent = `<!DOCTYPE html><html><head>${styles.join(
      ''
    )}</head><body><div class="ae-IFramePreview AMISCSSWrapper"></div></body></html>`;
  }

  componentDidMount() {
    if (this.props.autoFocus) {
      // Generally, the pop-up animation takes about 350ms
      // Delay 350ms, it is better to display the editor in the pop-up box.
      const store = this.props.manager.store;
      setTimeout(() => {
        if (isAlive(store)) {
          const first = findTree(
            store.outline,
            item => !item.isRegion && item.clickable
          );

          first && store.setActiveId(first.id);
        }
      }, 350);
    } else {
      this.props.manager.buildRenderersAndPanels();
    }
  }

  @autobind
  iframeRefFunc(iframe: any) {
    const store = this.props.store;
    this.iframeRef = iframe;
    isAlive(store) && store.setIframe(iframe);
  }

  @autobind
  getModalContainer() {
    const store = this.props.store;
    return store.getDoc().body;
  }

  @autobind
  isMobile() {
    return true;
  }

  @autobind
  getDialogMountRef() {
    return this.dialogMountRef.current;
  }

  @autobind
  iframeContentDidMount() {
    const body = this.iframeRef.contentWindow?.document.body;
    body?.classList.add('is-modalOpened');
    body?.classList.add('ae-PreviewIFrameBody');
  }

  render() {
    const {editable, store, appLocale, autoFocus, env, data, manager, ...rest} =
      this.props;

    return (
      <Frame
        className={'ae-PreviewIFrame'}
        initialContent={this.initialContent}
        ref={this.iframeRefFunc}
        contentDidMount={this.iframeContentDidMount}
      >
        <InnerComponent store={store} editable={editable} manager={manager} />
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
              session: `${env.session}-iframe-preview`,
              useMobileUI: true,
              isMobile: this.isMobile,
              getModalContainer: this.getModalContainer
            }
          )}
          <InnerSvgSpirit />
        </div>
      </Frame>
    );
  }
}

function InnerComponent({
  store,
  editable,
  manager
}: {
  store: EditorStoreType;
  editable?: boolean;
  manager: EditorManager;
}) {
  // Hook returns iframe's window and document instances from Frame context
  const {document: doc} = useFrame();
  const editableRef = React.useRef(editable);

  const handleMouseLeave = React.useCallback(() => {
    store.setHoverId('');
  }, []);

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    const dom = e.target as HTMLElement;
    const target = dom.closest(`[data-editor-id]`);

    if (target) {
      store.setHoverId(target.getAttribute('data-editor-id')!);
    }
  }, []);

  const handleBodyClick = React.useCallback(() => {
    closeContextMenus();
  }, []);

  const handleClick = React.useCallback((e: MouseEvent) => {
    const target = (e.target as HTMLElement).closest(`[data-editor-id]`);
    closeContextMenus();

    if (e.defaultPrevented) {
      return;
    }

    if (store.activeElement) {
      // Disable internal click events
      e.preventDefault();
      return;
    }

    if (target) {
      store.setActiveId(target.getAttribute('data-editor-id')!);
    }

    if (editableRef.current) {
      // Make the renderer non-clickable and only selectable by clicking.
      const event = manager.trigger('prevent-click', {
        data: e
      });

      if (!event.prevented && !event.stoped) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }, []);

  const handleDBClick = React.useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const hostElem = target.closest(`[data-editor-id]`) as HTMLElement;
    if (hostElem) {
      const node = store.getNodeById(hostElem.getAttribute('data-editor-id')!);
      if (!node) {
        return;
      }

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
        manager.startInlineEdit(node, inlineElem, inlineSetting, e);
      }
    }
  }, []);

  const handeMouseOver = React.useCallback((e: MouseEvent) => {
    if (editableRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  // Disable internal submit events
  const handleSubmit = React.useCallback((e: Event) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const syncIframeHeight = React.useCallback(() => {
    const iframe = manager.store.getIframe()!;
    iframe.style.cssText += `height: ${doc!.body.offsetHeight}px`;
  }, []);

  React.useEffect(() => {
    store.setDoc(doc);
    const layer = doc?.querySelector('.frame-content') as HTMLElement;

    doc!.addEventListener('click', handleBodyClick);
    layer!.addEventListener('mouseleave', handleMouseLeave);
    layer!.addEventListener('mousemove', handleMouseMove);
    layer!.addEventListener('click', handleClick, true);
    layer!.addEventListener('dblclick', handleDBClick);
    layer!.addEventListener('mouseover', handeMouseOver);
    layer!.addEventListener('submit', handleSubmit);

    const unSensor = resizeSensor(doc!.body, () => {
      syncIframeHeight();
    });
    syncIframeHeight();

    return () => {
      doc!.removeEventListener('click', handleBodyClick);
      layer!.removeEventListener('mouseleave', handleMouseLeave);
      layer!.removeEventListener('mousemove', handleMouseMove);
      layer!.removeEventListener('click', handleClick);
      layer!.removeEventListener('mouseover', handeMouseOver);
      layer!.removeEventListener('dblclick', handleDBClick);
      layer!.removeEventListener('submit', handleSubmit);
      store.setDoc(document);
      unSensor();
    };
  }, [doc]);

  React.useEffect(() => {
    doc
      ?.querySelector('body>div:first-child')
      ?.classList.toggle('is-edting', editable);
    editableRef.current = editable;
  }, [editable]);

  return null;
}

const InnerSvgSpirit = memo(() => {
  // @ts-ignore Here is the platform variable
  let spiriteIcons = window.spiriteIcons;
  if (spiriteIcons) {
    return (
      <div
        id="amis-icon-manage-mount-node"
        style={{display: 'none'}}
        dangerouslySetInnerHTML={{__html: spiriteIcons}}
      ></div>
    );
  } else {
    return null;
  }
});

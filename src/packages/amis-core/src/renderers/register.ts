import {renderersMap, Renderer} from '../factory';
import {OptionsControl} from './Options';
import FormItem from './Item';

declare const window: Window & {
  AmisCustomRenderers: {
    [props: string]: any;
  };
};

/**
 * Provides two special ways to register renderers
 * 1. Automatically load pre-registered custom renderers: Automatically load and register renderers in window.AmisCustomRenderers
 * 2. Tell amis to register a new renderer through postMessage: Indirectly register renderers without directly relying on amis.
 */

// Automatically load pre-registered custom renderers
export function autoPreRegisterAmisCustomRenderers() {
  if (window.AmisCustomRenderers) {
    Object.keys(window.AmisCustomRenderers).forEach(rendererType => {
      if (renderersMap[rendererType]) {
        console.warn(
          `[amis-core]: Pre-register renderer failed, a renderer with the same name as ${rendererType} already exists.`
        );
      } else {
        const curAmisRenderer = window.AmisCustomRenderers[rendererType];
        if (curAmisRenderer) {
          registerAmisRendererByUsage(rendererType, curAmisRenderer);
        }
      }
    });
  }
}

// Automatically load and register renderers in window.AmisCustomRenderers
autoPreRegisterAmisCustomRenderers();

// postMessage Dynamic registration mechanism for renderers
window.addEventListener(
  'message',
  (event: any) => {
    if (!event.data) {
      return;
    }
    if (
      event.data?.type === 'amis-renderer-register-event' &&
      event.data?.amisRenderer &&
      event.data.amisRenderer.type
    ) {
      const curAmisRenderer = event.data?.amisRenderer;
      const curUsage = curAmisRenderer?.usage || 'renderer';
      if (renderersMap[curAmisRenderer.type]) {
        console.warn(
          `[amis-core]: Failed to dynamically register renderer. A renderer with the same name already exists (${curAmisRenderer.type}). `
        );
      } else {
        console.info(
          '[amis-core] respond to dynamic registration renderer event:',
          curAmisRenderer.type
        );
        registerAmisRendererByUsage(curUsage, curAmisRenderer);
      }
    }
  },
  false
);
// Register amis renderer according to type (usage)
function registerAmisRendererByUsage(curUsage: string, curAmisRenderer: any) {
  // Currently supported registered renderer types
  const registerMap: {
    [props: string]: Function;
  } = {
    renderer: Renderer,
    form: FormItem,
    options: OptionsControl
  };
  let curAmisRendererComponent = curAmisRenderer.component;
  if (
    !curAmisRendererComponent &&
    window.AmisCustomRenderers &&
    window.AmisCustomRenderers[curAmisRenderer.type] &&
    window.AmisCustomRenderers[curAmisRenderer.type].component
  ) {
    curAmisRendererComponent =
      window.AmisCustomRenderers[curAmisRenderer.type].component;
  }
  if (
    curAmisRendererComponent &&
    ['renderer', 'formitem', 'options'].includes(curUsage) &&
    registerMap[curUsage]
  ) {
    registerMap[curUsage as keyof typeof registerMap]({
      ...(curAmisRenderer.config || {}),
      type: curAmisRenderer.type,
      weight: curAmisRenderer.weight || 0,
      autoVar: curAmisRenderer.autoVar || false
    })(curAmisRendererComponent);
  }
}

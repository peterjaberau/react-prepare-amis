import React from 'react';
import {Icon} from '@/packages/src';
import {registerEditorPlugin} from '../manager';
import {AvailableRenderersPanel} from '../component/Panel/AvailableRenderersPanel';
import {BuildPanelEventContext, BasePlugin, BasicPanelItem} from '../plugin';

/**
 * Add source code editing function
 */
export class AvailableRenderersPlugin extends BasePlugin {
  static scene = ['layout'];
  order = -9999;

  buildEditorPanel(
    context: BuildPanelEventContext,
    panels: Array<BasicPanelItem>
  ) {
    const store = this.manager.store;

    // Not displayed when multiple selections are made
    if (context.selections.length) {
      return;
    }

    if (store.subRenderers.length) {
      panels.push({
        key: 'renderers',
        icon: <Icon icon="editor-renderer" />,
        tooltip: 'Component',
        component: AvailableRenderersPanel,
        position: 'left',
        order: -9999
      });
    }
  }
}

registerEditorPlugin(AvailableRenderersPlugin);

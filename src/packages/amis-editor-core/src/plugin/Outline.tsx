import React from 'react';
import {Icon} from '@/packages/src';
import {registerEditorPlugin} from '../manager';
import {BuildPanelEventContext, BasePlugin, BasicPanelItem} from '../plugin';
import WidthDraggableContainer from '../component/base/WidthDraggableContainer';
import {OutlinePanel} from '../component/Panel/Outline';

/**
 * Outline Panel
 */
export class OutlinePlugin extends BasePlugin {
  static scene = ['layout'];
  order = -9999;

  buildEditorPanel(
    context: BuildPanelEventContext,
    panels: Array<BasicPanelItem>
  ) {
    const store = this.manager.store;

    // Display outline panel when multiple selections are made
    if (store && context.selections.length) {
      const {changeLeftPanelOpenStatus, changeLeftPanelKey} = store;
      changeLeftPanelOpenStatus(true);
      changeLeftPanelKey('outline');
    }
    panels.push({
      key: 'outline',
      icon: <Icon icon="editor-outline" />, // 'fa fa-navicon',
      tooltip: 'Outline',
      component: WidthDraggableContainer(OutlinePanel),
      position: 'left',
      order: 4000
    });
  }
}

registerEditorPlugin(OutlinePlugin);

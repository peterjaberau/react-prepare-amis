import React from 'react';
import {Icon} from 'amis';
import {
  BuildPanelEventContext,
  BasePlugin,
  BasicPanelItem,
  registerEditorPlugin
} from '@/packages/amis-editor-core/src';
import {GlobalVarManagerPanel} from '../renderer/global-var-control/GlobalVarManagerPanel';

/**
 * Add source code editing function
 */
export class GlobalVarPlugin extends BasePlugin {
  onInit() {
    this.manager.initGlobalVariables();
  }

  buildEditorPanel(
    context: BuildPanelEventContext,
    panels: Array<BasicPanelItem>
  ) {
    // If the global variable initialization function is not configured, the global variable management panel will not be displayed
    if (!this.manager.config.onGlobalVariableInit) {
      return;
    }

    panels.push({
      key: 'global-var',
      icon: '', // 'fa fa-code',
      title: (
        <span
          className="editor-tab-icon editor-tab-s-icon"
          editor-tooltip="Global variables"
        >
          <Icon icon="global-var" />
        </span>
      ),
      position: 'left',
      component: GlobalVarManagerPanel
    });
  }
}

registerEditorPlugin(GlobalVarPlugin);

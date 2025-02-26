import type {BaseEventContext} from 'amis-editor-core';
import {registerEditorPlugin, getSchemaTpl} from 'amis-editor-core';
import {ContainerPlugin} from '../Container';

export default class Layout_free_container extends ContainerPlugin {
  static id = 'Layout_free_container';
  name = 'Free container';
  isBaseComponent = true;
  pluginIcon = 'layout-free-container';
  description =
    'Free container: its direct child elements support dragging and repositioning.';
  // order = -1;
  tags = ['layout container'];
  scaffold: any = {
    type: 'container',
    isFreeContainer: true,
    size: 'xs',
    body: [],
    wrapperBody: false,
    style: {
      position: 'relative',
      minHeight: '200px'
    }
  };

  panelTitle = 'Free container';
}

registerEditorPlugin(Layout_free_container);

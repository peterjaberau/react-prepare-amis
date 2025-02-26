import {registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {FlexPluginBase} from './FlexPluginBase';

export default class Layout_fixed extends FlexPluginBase {
  static id = 'Layout_fixed';
  static scene = ['layout'];

  name = 'Suspended container';
  isBaseComponent = true;
  pluginIcon = 'layout-fixed-plugin';
  description =
    'Floating container: a special layout container based on CSS Fixed.';
  order = 0;
  scaffold: any = {
    type: 'container',
    size: 'xs',
    body: [],
    style: {
      position: 'fixed',
      inset: 'auto 50px 50px auto',
      zIndex: 10,
      minWidth: '80px',
      minHeight: '80px',
      display: 'block'
    },
    wrapperBody: false,
    originPosition: 'right-bottom'
  };
  previewSchema: any = {
    type: 'container',
    body: [],
    style: {
      position: 'static',
      display: 'block'
    },
    size: 'none',
    wrapperBody: false
  };
  panelTitle = 'Floating container';
}

registerEditorPlugin(Layout_fixed);

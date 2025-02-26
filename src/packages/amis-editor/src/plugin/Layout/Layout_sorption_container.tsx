import {registerEditorPlugin} from 'amis-editor-core';
import {FlexPluginBase, defaultFlexColumnSchema} from './FlexPluginBase';

export default class Layout_fixed_top extends FlexPluginBase {
  static id = 'Layout_fixed_top';
  static scene = ['layout'];

  name = 'Adsorption container';
  isBaseComponent = true;
  pluginIcon = 'layout-fixed-top';
  description =
    'Adsorption container: can be set to be ceiling mounted or ceiling displayed.';
  order = -1;
  scaffold: any = {
    type: 'flex',
    isSorptionContainer: true,
    sorptionPosition: 'top',
    className: 'p-1',
    items: [
      defaultFlexColumnSchema(),
      defaultFlexColumnSchema(),
      defaultFlexColumnSchema(),
      defaultFlexColumnSchema()
    ],
    style: {
      position: 'fixed',
      inset: '0 auto auto 0',
      zIndex: 10,
      width: '100%',
      overflowX: 'auto',
      margin: '0',
      overflowY: 'auto'
    },
    isFixedWidth: true,
    isFixedHeight: false,
    originPosition: 'right-bottom'
  };
  panelTitle = 'Adsorption container';
}

registerEditorPlugin(Layout_fixed_top);

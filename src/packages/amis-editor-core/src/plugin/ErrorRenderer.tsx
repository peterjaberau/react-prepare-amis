import {registerEditorPlugin} from '../manager';
import {BasePlugin} from '../plugin';

export class ErrorRendererPlugin extends BasePlugin {
  static scene = ['layout'];
  order = -9999;

  // Associated renderer name
  rendererName = 'error';

  // Component name
  name = 'Error';
  isBaseComponent = true;
}

registerEditorPlugin(ErrorRendererPlugin);

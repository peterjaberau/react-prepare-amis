import {registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {ButtonPlugin} from './Button';

export class ResetPlugin extends ButtonPlugin {
  static id = 'ResetPlugin';
  // Associated renderer name
  rendererName = 'reset';
  disabledRendererPlugin = true; // The component panel is not displayed
  // Component name
  name = 'Reset';
  isBaseComponent = true;
  icon = 'fa fa-eraser';
  description = 'Generally used to reset form data to initial values.';
  panelTitle = 'Button';
  scaffold: any = {
    type: 'reset',
    label: 'Reset'
  };
  previewSchema: any = {
    ...this.scaffold
  };
}

registerEditorPlugin(ResetPlugin);

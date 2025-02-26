import {registerEditorPlugin} from 'amis-editor-core';
import {ButtonPlugin} from './Button';

export class SubmitPlugin extends ButtonPlugin {
  static id = 'SubmitPlugin';
  // Associated renderer name
  rendererName = 'submit';
  disabledRendererPlugin = true; // The component panel is not displayed
  // Component name
  name = 'Submit';
  isBaseComponent = true;
  description =
    'Used to submit the form, requiring form validation. If in the pop-up window, the pop-up window will be automatically closed.';
  panelTitle = 'Button';
  scaffold: any = {
    type: 'submit',
    label: 'Submit',
    level: 'primary'
  };
  previewSchema = {
    ...this.scaffold
  };
}

registerEditorPlugin(SubmitPlugin);

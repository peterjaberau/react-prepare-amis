import {registerEditorPlugin} from 'amis-editor-core';
import {TextControlPlugin} from './InputText';

export class PasswordControlPlugin extends TextControlPlugin {
  static id = 'PasswordControlPlugin';
  // Associated renderer name
  rendererName = 'input-password';
  $schema = '/schemas/TextControlSchema.json';
  name = 'Password box';
  isBaseComponent = true;
  icon = 'fa fa-asterisk';
  pluginIcon = 'input-password-plugin';

  description = 'Verify that the input conforms to the email format';

  scaffold = {
    type: 'input-password',
    label: 'Password',
    name: 'password'
  };

  disabledRendererPlugin = true;

  previewSchema = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: {
      ...this.scaffold
    }
  };

  panelTitle = this.name;
}

registerEditorPlugin(PasswordControlPlugin);

import {registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {TextControlPlugin} from './InputText';

export class EmailControlPlugin extends TextControlPlugin {
  static id = 'EmailControlPlugin';
  // Associated renderer name
  rendererName = 'input-email';
  $schema = '/schemas/TextControlSchema.json';
  name = 'Mailbox';
  isBaseComponent = true;
  icon = 'fa fa-envelope-o';
  pluginIcon = 'input-email-plugin';

  description = 'Verify that the input conforms to the email format';

  scaffold = {
    type: 'input-email',
    label: 'Email',
    name: 'email'
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

registerEditorPlugin(EmailControlPlugin);

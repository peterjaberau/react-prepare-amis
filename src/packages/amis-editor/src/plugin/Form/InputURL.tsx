import {registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {TextControlPlugin} from './InputText';

export class URLControlPlugin extends TextControlPlugin {
  static id = 'URLControlPlugin';
  // Associated renderer name
  rendererName = 'input-url';
  $schema = '/schemas/TextControlSchema.json';
  name = 'URL input box';
  isBaseComponent = true;
  icon = 'fa fa-link';
  pluginIcon = 'input-url-plugin';

  description = 'Verify that the input is a valid URL';
  docLink = '/amis/zh-CN/components/form/input-url';

  scaffold = {
    type: 'input-url',
    label: 'Link',
    name: 'url'
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

  panelTitle = 'URL';
}

registerEditorPlugin(URLControlPlugin);

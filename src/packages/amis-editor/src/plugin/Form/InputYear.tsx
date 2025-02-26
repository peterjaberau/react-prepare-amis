import {registerEditorPlugin} from '@/packages/amis-editor-core/src';

import {DateControlPlugin} from './InputDate';

export class YearControlPlugin extends DateControlPlugin {
  static id = 'YearControlPlugin';
  // Associated renderer name
  rendererName = 'input-year';
  $schema = '/schemas/YearControlSchema.json';

  // Component name
  name = 'Year';
  isBaseComponent = true;
  icon = 'fa fa-calendar';
  pluginIcon = 'input-year-plugin';
  description = 'Year selection';
  docLink = '/amis/zh-CN/components/form/input-year';
  tags = ['form item'];
  // @ts-ignore
  scaffold = {
    type: 'input-year',
    name: 'year'
  };

  disabledRendererPlugin = true;
  previewSchema: any = {
    type: 'form',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold
      }
    ]
  };

  panelTitle = 'Year';
}

registerEditorPlugin(YearControlPlugin);

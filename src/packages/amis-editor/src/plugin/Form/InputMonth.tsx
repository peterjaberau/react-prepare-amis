import {registerEditorPlugin} from 'amis-editor-core';

import {DateControlPlugin} from './InputDate';

export class MonthControlPlugin extends DateControlPlugin {
  static id = 'MonthControlPlugin';
  // Associated renderer name
  rendererName = 'input-month';
  $schema = '/schemas/MonthControlSchema.json';

  // Component name
  name = 'Date';
  isBaseComponent = true;
  pluginIcon = 'inputMonth-plugin';
  icon = 'fa fa-calendar';
  description = 'Month selection';
  docLink = '/amis/zh-CN/components/form/input-month';
  tags = ['form item'];
  // @ts-ignore
  scaffold = {
    type: 'input-month',
    name: 'month'
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

  panelTitle = 'Month';
}

registerEditorPlugin(MonthControlPlugin);

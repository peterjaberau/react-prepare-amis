import {registerEditorPlugin} from 'amis-editor-core';

import {DateControlPlugin} from './InputDate';

export class DateTimeControlPlugin extends DateControlPlugin {
  static id = 'DateTimeControlPlugin';
  // Associated renderer name
  rendererName = 'input-datetime';
  $schema = '/schemas/DateTimeControlSchema.json';

  // Component name
  isBaseComponent = true;
  icon = 'fa fa-calendar';
  pluginIcon = 'input-datetime-plugin';
  name = 'Date time';
  description = 'Year, month, day, hour and minute selection';
  docLink = '/amis/zh-CN/components/form/input-datetime';
  tags = ['form item'];
  scaffold = {
    type: 'input-datetime',
    label: 'Date time',
    name: 'datetime'
  };

  disabledRendererPlugin = true;
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    wrapWithPanel: false,
    mode: 'horizontal',
    body: [
      {
        ...this.scaffold
      }
    ]
  };

  panelTitle = 'Date Time';
}

registerEditorPlugin(DateTimeControlPlugin);

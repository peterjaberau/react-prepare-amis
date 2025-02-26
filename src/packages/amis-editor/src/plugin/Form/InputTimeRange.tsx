import {registerEditorPlugin} from 'amis-editor-core';

import {DateRangeControlPlugin} from './InputDateRange';

export class TimeRangeControlPlugin extends DateRangeControlPlugin {
  static id = 'TimeRangeControlPlugin';
  // Associated renderer name
  rendererName = 'input-time-range';
  $schema = '/schemas/DateRangeControlSchema.json';

  // Component name
  icon = 'fa fa-calendar';
  pluginIcon = 'input-time-range-plugin';
  name = 'Date Range';
  isBaseComponent = true;
  description =
    'Time range selection, you can set the minimum and maximum dates through <code>minDate</code> and <code>maxDate</code>';
  docLink = '/amis/zh-CN/components/form/time-range';
  tags = ['form item'];
  scaffold = {
    type: 'input-time-range',
    label: 'Date range',
    name: 'time-range'
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold
      }
    ]
  };

  disabledRendererPlugin = true;
  notRenderFormZone = true;
}

registerEditorPlugin(TimeRangeControlPlugin);

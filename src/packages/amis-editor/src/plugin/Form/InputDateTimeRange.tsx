import {registerEditorPlugin} from '@/packages/amis-editor-core/src';

import {DateRangeControlPlugin} from './InputDateRange';

export class DateTimeRangeControlPlugin extends DateRangeControlPlugin {
  static id = 'DateTimeRangeControlPlugin';
  // Associated renderer name
  rendererName = 'input-datetime-range';
  $schema = '/schemas/DateTimeRangeControlSchema.json';

  // Component name
  icon = 'fa fa-calendar';
  pluginIcon = 'input-date-range-plugin';
  name = 'Date Time Range';
  isBaseComponent = true;
  description =
    'Date time range selection, you can set the minimum and maximum dates through <code>minDate</code> and <code>maxDate</code>';
  docLink = '/amis/zh-CN/components/form/input-datetime-range';
  tags = ['form item'];
  scaffold = {
    type: 'input-datetime-range',
    label: 'Date range',
    name: 'datetime-range'
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

registerEditorPlugin(DateTimeRangeControlPlugin);

import {registerEditorPlugin} from '@/packages/amis-editor-core/src';

import {DateRangeControlPlugin} from './InputDateRange';

export class MonthRangeControlPlugin extends DateRangeControlPlugin {
  static id = 'MonthRangeControlPlugin';
  // Associated renderer name
  rendererName = 'input-month-range';
  $schema = '/schemas/MonthRangeControlSchema.json';

  // Component name
  icon = 'fa fa-calendar';
  pluginIcon = 'input-month-range-plugin';
  name = 'Month Range';
  isBaseComponent = true;
  description =
    'Month range selection, you can set the minimum and maximum dates through <code>minDate</code> and <code>maxDate</code>';
  docLink = '/amis/zh-CN/components/form/input-month-range';
  tags = ['form item'];
  scaffold = {
    type: 'input-month-range',
    label: 'Date range',
    name: 'month-range'
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

registerEditorPlugin(MonthRangeControlPlugin);

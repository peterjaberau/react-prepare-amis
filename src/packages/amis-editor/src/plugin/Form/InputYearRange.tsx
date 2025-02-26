import {registerEditorPlugin} from 'amis-editor-core';

import {DateRangeControlPlugin} from './InputDateRange';

export class YearRangeControlPlugin extends DateRangeControlPlugin {
  static id = 'YearRangeControlPlugin';
  // Associated renderer name
  rendererName = 'input-year-range';
  $schema = '/schemas/DateRangeControlSchema.json';

  // Component name
  icon = 'fa fa-calendar';
  pluginIcon = 'input-month-range-plugin';
  name = 'Date Range';
  isBaseComponent = true;
  description =
    'Year range selection, you can set the minimum and maximum dates through <code>minDate</code> and <code>maxDate</code>';
  docLink = '/amis/zh-CN/components/form/year-range';
  tags = ['form item'];
  scaffold = {
    type: 'input-year-range',
    label: 'Date range',
    name: 'year-range'
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

registerEditorPlugin(YearRangeControlPlugin);

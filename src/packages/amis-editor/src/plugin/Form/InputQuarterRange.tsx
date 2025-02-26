import {registerEditorPlugin} from 'amis-editor-core';

import {DateRangeControlPlugin} from './InputDateRange';

export class QuarterRangePlugin extends DateRangeControlPlugin {
  static id = 'QuarterRangePlugin';
  // Associated renderer name
  rendererName = 'input-quarter-range';
  $schema = '/schemas/MonthRangeControlSchema.json';

  // Component name
  icon = 'fa fa-calendar';
  pluginIcon = 'input-quarter-range-plugin';
  name = 'Quarter Range';
  isBaseComponent = true;
  description =
    'Month range selection, you can set the minimum and maximum dates through <code>minDate</code> and <code>maxDate</code>';
  docLink = '/amis/zh-CN/components/form/input-quarter-range';
  tags = ['form item'];
  scaffold = {
    type: 'input-quarter-range',
    label: 'Date range',
    name: 'quarter-range'
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

registerEditorPlugin(QuarterRangePlugin);

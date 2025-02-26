import {registerEditorPlugin} from 'amis-editor-core';

import {DateControlPlugin} from './InputDate';

export class InputQuarterPlugin extends DateControlPlugin {
  static id = 'InputQuarterPlugin';
  // Associated renderer name
  rendererName = 'input-quarter';
  $schema = '/schemas/QuarterControlSchema.json';

  // Component name
  name = 'quarter';
  isBaseComponent = true;
  icon = 'fa fa-calendar';
  pluginIcon = 'input-quarter-plugin';
  description = 'Quarter Selection';
  docLink = '/amis/zh-CN/components/form/input-quarter';
  tags = ['form item'];
  // @ts-ignore
  scaffold = {
    type: 'input-quarter',
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

  panelTitle = 'Quarter';
}

registerEditorPlugin(InputQuarterPlugin);

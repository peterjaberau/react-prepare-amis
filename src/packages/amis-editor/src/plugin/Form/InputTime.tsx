import {registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {DateControlPlugin} from './InputDate';

export class TimeControlPlugin extends DateControlPlugin {
  static id = 'TimeControlPlugin';
  // Associated renderer name
  rendererName = 'input-time';
  $schema = '/schemas/TimeControlSchema.json';

  // Component name
  name = 'Timeframe';
  isBaseComponent = true;
  icon = 'fa fa-clock-o';
  pluginIcon = 'input-time-plugin';
  description = 'Hours, minutes and seconds input';
  docLink = '/amis/zh-CN/components/form/input-time';
  tags = ['form item'];
  scaffold = {
    type: 'input-time',
    label: 'time',
    name: 'time'
  };

  disabledRendererPlugin = true;
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: {
      ...this.scaffold
    }
  };

  panelTitle = 'Time Frame';
}

registerEditorPlugin(TimeControlPlugin);

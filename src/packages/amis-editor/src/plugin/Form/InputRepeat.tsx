import {getSchemaTpl} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin} from 'amis-editor-core';

export class RepeatControlPlugin extends BasePlugin {
  static id = 'RepeatControlPlugin';
  // Associated renderer name
  rendererName = 'input-repeat';
  $schema = '/schemas/RepeatControlSchema.json';

  // Component name
  name = 'Repeat cycle selection';
  isBaseComponent = true;
  icon = 'fa fa-repeat';
  pluginIcon = 'input-repeat-plugin';
  description =
    'Select the repetition frequency, such as every hour, every day, every week, etc.';
  searchKeywords = 'Repeat frequency selector';
  docLink = '/amis/zh-CN/components/form/input-repeat';
  tags = ['form item'];
  scaffold = {
    type: 'input-repeat',
    label: 'cycle',
    name: 'repeat'
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

  panelTitle = 'Cycle';
  panelBody = [
    getSchemaTpl('layout:originPosition', {value: 'left-top'}),
    getSchemaTpl('switchDefaultValue'),
    {
      type: 'input-text',
      name: 'value',
      label: 'Default value',
      visibleOn: 'typeof this.value !== "undefined"'
    },

    {
      name: 'options',
      type: 'select',
      label: 'Enable unit',
      options:
        'secondly,minutely,hourly,daily,weekdays,weekly,monthly,yearly'.split(
          ','
        ),
      value: 'hourly,daily,weekly,monthly',
      multiple: true
    }
  ];
}

registerEditorPlugin(RepeatControlPlugin);

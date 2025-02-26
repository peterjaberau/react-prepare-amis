import {registerEditorPlugin, tipedLabel} from 'amis-editor-core';
import {BaseEventContext} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {DatePlugin} from './Date';

const timeFormatOptions = [
  {
    label: 'HH:mm',
    value: 'HH:mm',
    timeFormat: 'HH:mm'
  },
  {
    label: 'HH:mm:ss',
    value: 'HH:mm:ss',
    timeFormat: 'HH:mm:ss'
  },
  {
    label: 'HH hour mm minute',
    value: 'HH hour mm minute',
    timeFormat: 'HH:mm'
  },
  {
    label: 'HH hour mm minute ss second',
    value: 'HH hour mm minute ss second',
    timeFormat: 'HH:mm:ss'
  }
];
// Only timestamps are displayed for now. Other types will be added after the timeFormat of input-time supports expressions.
const dateFormatOptions = [
  {
    label: 'X(timestamp)',
    value: 'X'
  }
];
export class TimePlugin extends DatePlugin {
  static id = 'TimePlugin';
  // Associated renderer name
  rendererName = 'time';
  name = 'Time Display';
  isBaseComponent = true;
  disabledRendererPlugin = true; // Can be implemented with DatetimePlugin

  pluginIcon = 'time-plugin';
  docLink = '/friends/zh-CN/components/date';
  scaffold = {
    type: 'time',
    value: Math.round(Date.now() / 1000),
    format: 'HH:mm:ss'
  };

  previewSchema = {
    ...this.scaffold,
    format: 'HH:mm:ss',
    value: Math.round(Date.now() / 1000)
  };
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    return [
      getSchemaTpl('tabs', [
        {
          title: 'Attributes',
          body: getSchemaTpl('collapseGroup', [
            {
              title: 'Basic',
              body: [
                {
                  type: 'input-time',
                  name: 'value',
                  inputFormat: 'HH:mm:ss',
                  timeFormat: 'HH:mm:ss',
                  label: 'Time value'
                },
                {
                  type: 'input-text',
                  name: 'format',
                  label: tipedLabel(
                    'Display format',
                    'Please refer to <a href="https://momentjs.com/" target="_blank">moment</a> for format usage.'
                  ),
                  clearable: true,
                  options: timeFormatOptions,
                  pipeIn: defaultValue('HH:mm:ss')
                },
                {
                  type: 'input-text',
                  name: 'valueFormat',
                  label: tipedLabel(
                    'Value format',
                    'Please refer to <a href="https://momentjs.com/" target="_blank">moment</a> for format usage.'
                  ),
                  clearable: true,
                  options: dateFormatOptions,
                  pipeIn: defaultValue('X')
                },
                getSchemaTpl('placeholder', {
                  pipeIn: defaultValue('-'),
                  label: 'Placeholder'
                })
              ]
            },
            getSchemaTpl('status')
          ])
        },
        getSchemaTpl('onlyClassNameTab')
      ])
    ];
  };
}

registerEditorPlugin(TimePlugin);

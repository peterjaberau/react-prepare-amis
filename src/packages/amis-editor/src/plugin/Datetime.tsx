import {registerEditorPlugin, tipedLabel} from 'amis-editor-core';
import {BaseEventContext} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {DatePlugin} from './Date';

const dateFormatOptions = [
  {
    label: 'timestamp',
    children: [
      {
        label: 'X(timestamp)',
        value: 'X'
      },
      {
        label: 'x(millisecond timestamp)',
        value: 'x'
      }
    ]
  },
  {
    label: 'Date format',
    children: [
      {
        label: 'YYYY-MM-DD',
        value: 'YYYY-MM-DD'
      },
      {
        label: 'YYYY/MM/DD',
        value: 'YYYY/MM/DD'
      },
      {
        label: 'YYYY-MM-DD',
        value: 'YYYY year MM month DD day'
      }
    ]
  },
  {
    label: 'Time format',
    children: [
      {
        label: 'HH:mm:ss',
        value: 'HH:mm:ss',
        timeFormat: 'HH:mm:ss'
      },
      {
        label: 'HH:mm',
        value: 'HH:mm',
        timeFormat: 'HH:mm'
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
    ]
  },
  {
    label: 'Date time format',
    children: [
      {
        label: 'YYYY-MM-DD HH:mm:ss',
        value: 'YYYY-MM-DD HH:mm:ss'
      },
      {
        label: 'YYYY/MM/DD HH:mm:ss',
        value: 'YYYY/MM/DD HH:mm:ss'
      },
      {
        label: 'YYYY year MM month DD day HH hour mm minute ss second',
        value: 'YYYY year MM month DD day HH hour mm minute ss second'
      }
    ]
  }
];
const valueDateFormatOptions = [
  {
    label: 'X(timestamp)',
    value: 'X'
  }
];
export class DatetimePlugin extends DatePlugin {
  static id = 'DatetimePlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'datetime';

  scaffold = {
    type: 'datetime',
    format: 'YYYY-MM-DD HH:mm:ss',
    value: Math.round(Date.now() / 1000)
  };

  name = 'Date and time display';
  isBaseComponent = true;
  disabledRendererPlugin = false; // Avoid being overwritten by DatePlugin
  pluginIcon = 'datetime-plugin';
  docLink = '/friends/zh-CN/components/date';
  previewSchema = {
    ...this.scaffold,
    format: 'YYYY-MM-DD HH:mm:ss',
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
                  type: 'input-datetime',
                  name: 'value',
                  label: 'Date time value'
                },
                {
                  type: 'nested-select',
                  name: 'format',
                  // searchable: true,
                  // selectMode: 'chained', // tree、chained
                  hideNodePathLabel: true,
                  onlyLeaf: true,
                  label: tipedLabel(
                    'Display format',
                    'Please refer to <a href="https://momentjs.com/" target="_blank">moment</a> for format usage.'
                  ),
                  clearable: true,
                  // creatable: true,
                  options: dateFormatOptions,
                  pipeIn: defaultValue('YYYY-MM-DD HH:mm:ss')
                },
                {
                  type: 'input-text',
                  name: 'valueFormat',
                  label: tipedLabel(
                    'Value format',
                    'Please refer to <a href="https://momentjs.com/" target="_blank">moment</a> for format usage.'
                  ),
                  clearable: true,
                  options: valueDateFormatOptions,
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
        {
          title: 'Appearance',
          body: getSchemaTpl('collapseGroup', [
            ...getSchemaTpl('theme:common', {
              exclude: ['layout'],
              baseExtra: [
                getSchemaTpl('theme:font', {
                  label: 'character',
                  name: 'themeCss.baseControlClassName.font'
                })
              ]
            }),
            {
              title: 'CSS class name',
              body: [getSchemaTpl('className')]
            }
          ])
        }
      ])
    ];
  };
}

registerEditorPlugin(DatetimePlugin);

import {registerEditorPlugin, tipedLabel} from '@/packages/amis-editor-core/src';
import {BaseEventContext, BasePlugin} from '@/packages/amis-editor-core/src';
import {defaultValue, getSchemaTpl} from '@/packages/amis-editor-core/src';

const dateFormatOptions = [
  {
    label: 'X(timestamp)',
    value: 'X'
  },
  {
    label: 'x(millisecond timestamp)',
    value: 'x'
  },
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
];
const valueDateFormatOptions = [
  {
    label: 'X(timestamp)',
    value: 'X'
  }
];
export class DatePlugin extends BasePlugin {
  static id = 'DatePlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'date';
  $schema = '/schemas/DateSchema.json';

  // Component name
  name = 'Date Display';
  isBaseComponent = true;
  disabledRendererPlugin = true; // Can be implemented with DatetimePlugin
  description =
    'Mainly used to associate field names for date display, supporting various formats such as: X (timestamp), YYYY-MM-DD HH:mm:ss. ';
  docLink = '/friends/zh-CN/components/date';
  tags = ['show'];
  icon = 'fa fa-calendar';
  pluginIcon = 'date-plugin';
  scaffold = {
    type: 'date',
    value: Math.round(Date.now() / 1000)
  };
  previewSchema = {
    ...this.scaffold,
    format: 'YYYY-MM-DD',
    value: Math.round(Date.now() / 1000)
  };

  panelTitle = 'Date Display';
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
                  type: 'input-date',
                  name: 'value',
                  label: 'Date value'
                },
                {
                  type: 'input-text',
                  name: 'format',
                  label: tipedLabel(
                    'Display format',
                    'Please refer to <a href="https://momentjs.com/" target="_blank">moment</a> for format usage.'
                  ),
                  clearable: true,
                  options: dateFormatOptions,
                  pipeIn: defaultValue('YYYY-MM-DD')
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
        getSchemaTpl('onlyClassNameTab')
      ])
    ];
  };
}

registerEditorPlugin(DatePlugin);

/**
 * @file log component
 */
import {registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {BaseEventContext, BasePlugin} from '@/packages/amis-editor-core/src';
import {getSchemaTpl, tipedLabel} from '@/packages/amis-editor-core/src';

export class LogPlugin extends BasePlugin {
  static id = 'LogPlugin';
  // Associated renderer name
  rendererName = 'log';
  $schema = '/schemas/LogSchema.json';

  // Component name
  name = 'Log';
  isBaseComponent = true;
  icon = 'fa fa-file-text-o';
  pluginIcon = 'log-plugin';
  description = 'Used to display logs in real time';
  searchKeywords = 'Real-time log';
  docLink = '/amis/zh-CN/components/log';
  tags = ['show'];
  previewSchema = {
    type: 'log',
    height: 120,
    autoScroll: true
  };
  scaffold: any = {
    type: 'log',
    autoScroll: true,
    height: 500,
    encoding: 'utf-8'
  };
  panelJustify = true;
  panelTitle = 'Log';
  panelBodyCreator = (context: BaseEventContext) => {
    const renderer: any = context.info.renderer;
    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: [
              getSchemaTpl('apiControl', {
                required: true,
                name: 'source',
                renderLabel: true,
                label: tipedLabel(
                  'Data Source',
                  `For services that return log information, the backend needs to return the results in a stream manner.
                  Please refer to <a target="_blank" href="https://baidu.github.io/amis/zh-CN/components/log#%E5%90%8E%E7%AB%AF%E5%AE%9E%E7%8E%B0%E5%8F%82%E8%80%83">example</a>`
                )
              }),
              {
                type: 'input-text',
                label: tipedLabel(
                  'Text encoding',
                  'The character encoding of the returned content, such as UTF-8, ISO-8859-2, KOI8-R, GBK, etc. The default is UTF-8'
                ),
                name: 'encoding'
              },
              getSchemaTpl('placeholder', {
                label: 'Loading prompt',
                placeholder: 'Loading'
              }),
              {
                type: 'switch',
                label: tipedLabel(
                  'Follow the bottom',
                  'Automatically scroll to the bottom to view the latest log content'
                ),
                name: 'autoScroll',
                value: true,
                inputClassName: 'is-inline'
              },
              {
                label: tipedLabel(
                  'Operation',
                  'You can add the following operation buttons at the top of the log'
                ),
                type: 'checkboxes',
                name: 'operation',
                inline: false,
                options: [
                  {
                    label: 'Stop',
                    value: 'stop'
                  },
                  {
                    label: 'Refresh',
                    value: 'restart'
                  },
                  {
                    label: 'Clear',
                    value: 'clear'
                  },
                  {
                    label: 'Hide line number',
                    value: 'showLineNumber'
                  },
                  {
                    label: 'Query',
                    value: 'filter'
                  }
                ]
              }
            ]
          },
          {
            title: 'Performance Optimization',
            body: [
              {
                type: 'input-number',
                label: tipedLabel(
                  'Height of each row',
                  `Set the height of each row. Virtual rendering will be enabled by default to avoid rendering jams.
                    <ul><li>Advantage: You can still view all logs</li>
                    <li>Disadvantages: If a line of log is very long, it will not automatically wrap and a horizontal scroll bar will appear</li></ul>
                `
                ),
                name: 'rowHeight',
                min: 1
              },
              {
                type: 'input-number',
                label: tipedLabel(
                  'Show number of rows',
                  `Limit the maximum number of displayed rows to avoid rendering jams. By default, there is no limit.
                    <ul><li>Advantages: When a line of log is very long, it will automatically wrap</li>
                    <li>Disadvantages: Unable to view previous logs</li></ul>
                `
                ),
                name: 'maxLength',
                min: 1
              }
            ]
          },
          getSchemaTpl('status', {isFormItem: false})
        ])
      },
      {
        title: 'Appearance',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: [
              {
                type: 'input-number',
                label: tipedLabel('Height', 'Display area height'),
                name: 'height',
                min: 1
              }
            ]
          },
          getSchemaTpl('style:classNames', {
            isFormItem: false
          })
        ])
      }
    ]);
  };
}

registerEditorPlugin(LogPlugin);

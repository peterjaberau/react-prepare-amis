/**
 * @file input-excel component element
 */
import {
  BasePlugin,
  BaseEventContext,
  RendererPluginAction,
  RendererPluginEvent,
  defaultValue,
  getSchemaTpl,
  registerEditorPlugin
} from 'amis-editor-core';
import {formItemControl} from '../../component/BaseControl';
import {getActionCommonProps} from '../../renderer/event-control/helper';

export class ExcelControlPlugin extends BasePlugin {
  static id = 'ExcelControlPlugin';
  // Associated renderer name
  rendererName = 'input-excel';
  $schema = '/schemas/ExcelControlSchema.json';

  // Component name
  name = 'Upload Excel';
  isBaseComponent = true;
  icon = 'fa fa-eyedropper';
  pluginIcon = 'input-excel-plugin';
  description = 'Automatically parse Excel';
  docLink = '/amis/zh-CN/components/form/input-excel';
  tags = ['form item'];
  scaffold = {
    type: 'input-excel',
    label: 'Excel',
    name: 'excel'
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
  panelTitle = 'Upload Excel';

  panelJustify = true;

  notRenderFormZone = true;

  // Event definition
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: 'value change',
      description: 'Triggered after Excel upload parsing is completed',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                value: {
                  type: 'string',
                  title: 'Data after excel parsing'
                }
              }
            }
          }
        }
      ]
    }
  ];

  //Action definition
  actions: RendererPluginAction[] = [
    {
      actionType: 'clear',
      actionLabel: 'Clear',
      description: 'Clear selected value',
      ...getActionCommonProps('clear')
    },
    {
      actionType: 'reset',
      actionLabel: 'Reset',
      description: 'Reset the value to the initial value',
      ...getActionCommonProps('reset')
    },
    {
      actionType: 'setValue',
      actionLabel: 'Assignment',
      description: 'Trigger component data update',
      ...getActionCommonProps('setValue')
    }
  ];
  panelBodyCreator = (context: BaseEventContext) => {
    return formItemControl(
      {
        common: {
          body: [
            getSchemaTpl('layout:originPosition', {value: 'left-top'}),
            {
              label: 'Parsing mode',
              name: 'parseMode',
              type: 'select',
              options: [
                {
                  label: 'object',
                  value: 'object'
                },
                {label: 'array', value: 'array'}
              ]
            },
            getSchemaTpl('switch', {
              name: 'allSheets',
              label: 'Whether to parse all Sheets'
            }),

            getSchemaTpl('switch', {
              name: 'plainText',
              label: 'Whether to parse as plain text',
              pipeIn: defaultValue(true)
            }),

            getSchemaTpl('switch', {
              name: 'includeEmpty',
              label: 'Whether it contains empty content',
              visibleOn: 'this.parseMode === "array"'
            })
          ]
        }
      },
      context
    );
  };
}

registerEditorPlugin(ExcelControlPlugin);

import {
  defaultValue,
  getSchemaTpl,
  registerEditorPlugin,
  BasePlugin,
  tipedLabel,
  RendererPluginAction,
  RendererPluginEvent
} from '@/packages/amis-editor-core/src';
import type {BaseEventContext} from '@/packages/amis-editor-core/src';
import {ValidatorTag} from '../../validator';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';
import {inputStateTpl} from '../../renderer/style-control/helper';

export class TextareaControlPlugin extends BasePlugin {
  static id = 'TextareaControlPlugin';
  // Associated renderer name
  rendererName = 'textarea';
  $schema = '/schemas/TextareaControlSchema.json';

  // Component name
  name = 'Multi-line text box';
  isBaseComponent = true;
  icon = 'fa fa-paragraph';
  pluginIcon = 'textarea-plugin';
  description = 'Support line break input';
  searchKeywords = 'Multi-line text input box';
  docLink = '/amis/zh-CN/components/form/textarea';
  tags = ['form item'];
  scaffold = {
    type: 'textarea',
    label: 'Multi-line text',
    name: 'textarea'
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    wrapWithPanel: false,
    mode: 'horizontal',
    body: {
      ...this.scaffold
    }
  };

  notRenderFormZone = true;

  panelTitle = 'Multi-line text';

  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: 'value change',
      description: 'Triggered when the input box value changes',
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
                  title: 'Current text content'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'focus',
      eventLabel: 'Get focus',
      description: 'Triggered when the input box gets focus',
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
                  title: 'Current text content'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'blur',
      eventLabel: 'Lost focus',
      description: 'Triggered when the input box loses focus',
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
                  title: 'Current text content'
                }
              }
            }
          }
        }
      ]
    }
  ];

  actions: RendererPluginAction[] = [
    {
      actionType: 'clear',
      actionLabel: 'Clear',
      description: 'Clear the input box content',
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

  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              getSchemaTpl('formItemName', {
                required: true
              }),
              getSchemaTpl('label'),
              // getSchemaTpl('valueFormula', {
              //   rendererSchema: context?.schema,
              // mode: 'vertical' // Change to up and down display mode
              // }),
              getSchemaTpl('textareaDefaultValue'),
              getSchemaTpl('switch', {
                name: 'trimContents',
                pipeIn: defaultValue(true),
                label: tipedLabel(
                  'Remove leading and trailing blanks',
                  'When enabled, users will not be allowed to enter leading and trailing spaces'
                )
              }),
              getSchemaTpl('showCounter'),
              {
                name: 'maxLength',
                label: tipedLabel(
                  'Maximum number of characters',
                  'Limit the maximum number of characters to be entered'
                ),
                type: 'input-number',
                min: 0,
                step: 1
              },
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('placeholder'),
              getSchemaTpl('description'),
              getSchemaTpl('autoFillApi')
            ]
          },
          getSchemaTpl('status', {
            isFormItem: true,
            readonly: true
          }),
          getSchemaTpl('validation', {
            tag: ValidatorTag.Text
          })
        ])
      },
      {
        title: 'Appearance',
        body: [
          getSchemaTpl('collapseGroup', [
            getSchemaTpl('theme:formItem', {
              schema: [
                {
                  type: 'input-number',
                  name: 'minRows',
                  value: 3,
                  label: 'Minimum number of display rows',
                  min: 1
                },
                {
                  type: 'input-number',
                  name: 'maxRows',
                  value: 20,
                  label: 'Maximum number of display rows',
                  min: 1
                }
              ]
            }),
            getSchemaTpl('theme:form-label'),
            getSchemaTpl('theme:form-description'),
            {
              title: 'Multi-line text style',
              body: [
                ...inputStateTpl(
                  'themeCss.inputControlClassName',
                  '--input-textarea'
                )
              ]
            },
            getSchemaTpl('theme:cssCode'),
            getSchemaTpl('style:classNames')
          ])
        ]
      },
      {
        title: 'Event',
        className: 'p-none',
        body: [
          getSchemaTpl('eventControl', {
            name: 'onEvent',
            ...getEventControlConfig(this.manager, context)
          })
        ]
      }
    ]);
  };
}

registerEditorPlugin(TextareaControlPlugin);

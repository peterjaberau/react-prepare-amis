import {EditorAvailableLanguages as availableLanguages} from '@/packages/src';
import {
  defaultValue,
  getSchemaTpl,
  undefinedPipeOut,
  registerEditorPlugin,
  BasePlugin,
  RendererPluginEvent,
  RendererPluginAction
} from '@/packages/amis-editor-core/src';
import type {BaseEventContext} from '@/packages/amis-editor-core/src';
import {ValidatorTag} from '../../validator';
import {getEventControlConfig} from '../../renderer/event-control/helper';
import {getActionCommonProps} from '../../renderer/event-control/helper';

export class CodeEditorControlPlugin extends BasePlugin {
  static id = 'CodeEditorControlPlugin';
  // Associated renderer name
  rendererName = 'editor';
  $schema = '/schemas/EditorControlSchema.json';

  // Component name
  name = 'Code Editor';
  isBaseComponent = true;
  icon = 'fa fa-code';
  pluginIcon = 'editor-plugin';
  description = `Code editor, using monaco-editor Support: ${availableLanguages
    .slice(0, 10)
    .join(',')} etc`;
  docLink = '/amis/zh-CN/components/form/editor';
  tags = ['form item'];
  scaffold = {
    type: 'editor',
    label: 'Code Editor',
    name: 'editor'
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold,
        value: 'console.log("Hello world.");'
      }
    ]
  };

  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: 'Code changes',
      description: 'Triggered when the code changes',
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
                  title: 'Current code content'
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
                  title: 'Current code content'
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
                  title: 'Current code content'
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
      actionType: 'focus',
      actionLabel: 'Get focus',
      description: 'Input box gets focus',
      ...getActionCommonProps('focus')
    },
    {
      actionType: 'setValue',
      actionLabel: 'Assignment',
      description: 'Trigger component data update',
      ...getActionCommonProps('setValue')
    }
  ];

  notRenderFormZone = true;

  panelTitle = 'Editor';

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
              {
                label: 'language',
                name: 'language',
                type: 'select',
                value: 'javascript',
                searchable: true,
                options: availableLanguages.concat()
              },

              getSchemaTpl('valueFormula', {
                rendererSchema: {
                  type: 'textarea'
                },
                mode: 'vertical' // Change to up and down display mode
              }),
              getSchemaTpl('switch', {
                label: 'Can be full screen',
                name: 'allowFullscreen',
                pipeIn: defaultValue(true)
              }),
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('description'),
              getSchemaTpl('autoFillApi')
            ]
          },
          getSchemaTpl('status', {
            isFormItem: true,
            unsupportStatic: true
          }),
          getSchemaTpl('validation', {
            tag: ValidatorTag.Code
          })
        ])
      },
      {
        title: 'Appearance',
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('style:formItem', {
            renderer: context.info.renderer,
            schema: [
              {
                name: 'size',
                type: 'select',
                pipeIn: defaultValue(''),
                pipeOut: undefinedPipeOut,
                label: 'Control size',
                options: [
                  {
                    label: 'Default',
                    value: ''
                  },

                  {
                    label: 'Medium',
                    value: 'md'
                  },

                  {
                    label: 'big',
                    value: 'lg'
                  },

                  {
                    label: 'Extra Large',
                    value: 'xl'
                  },

                  {
                    label: 'super large',
                    value: 'xxl'
                  }
                ]
              }
            ]
          }),
          getSchemaTpl('style:classNames', {
            unsupportStatic: true
          })
        ])
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

  filterProps(props: any) {
    props.disabled = true;
    return props;
  }
}

registerEditorPlugin(CodeEditorControlPlugin);

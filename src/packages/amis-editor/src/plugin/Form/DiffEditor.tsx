import {EditorAvailableLanguages as availableLanguages} from '@/packages/src';
import {
  defaultValue,
  getSchemaTpl,
  undefinedPipeOut,
  registerEditorPlugin,
  BasePlugin
} from '@/packages/amis-editor-core/src';
import type {BaseEventContext} from '@/packages/amis-editor-core/src';
import {ValidatorTag} from '../../validator';
import {getEventControlConfig} from '../../renderer/event-control/helper';
import {RendererPluginEvent, RendererPluginAction} from '@/packages/amis-editor-core/src';
import {getActionCommonProps} from '../../renderer/event-control/helper';

export class DiffEditorControlPlugin extends BasePlugin {
  static id = 'DiffEditorControlPlugin';
  // Associated renderer name
  rendererName = 'diff-editor';
  $schema = '/schemas/DiffEditorControlSchema.json';

  // Component name
  name = 'Diff Editor';
  isBaseComponent = true;
  icon = 'fa fa-columns';
  pluginIcon = 'diff-editor-plugin';
  description = `Compare the codes on the left and right, the supported languages ​​include: ${availableLanguages
    .slice(0, 10)
    .join(',')} etc`;
  searchKeywords = 'Compare Editors';
  docLink = '/amis/zh-CN/components/form/diff-editor';
  tags = ['form item'];
  scaffold = {
    type: 'diff-editor',
    label: 'diff editor',
    name: 'diff'
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold,
        value: 'Hello World\nLine 1\nNew line\nBla Bla',
        diffValue: 'Hello World\nLine 2'
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
      description: 'Triggered when the right input box gets the focus',
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
      description: 'Triggered when the right input box loses focus',
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
      description: 'Get the focus, the focus falls on the right editing panel',
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

  panelTitle = 'Diff Editor';

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
                  type: 'textarea',
                  value: context?.schema.diffValue
                },
                label: 'Default value on the left',
                name: 'diffValue',
                mode: 'vertical' // Change to up and down display mode
              }),
              getSchemaTpl('valueFormula', {
                rendererSchema: {
                  type: 'textarea',
                  value: context?.schema.value
                },
                label: 'Default value on the right',
                mode: 'vertical' // Change to up and down display mode
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
            tag: ValidatorTag.All
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

registerEditorPlugin(DiffEditorControlPlugin);

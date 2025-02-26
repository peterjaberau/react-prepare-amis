import {
  registerEditorPlugin,
  RendererPluginAction,
  RendererPluginEvent
} from '@/packages/amis-editor-core/src';
import {BaseEventContext, BasePlugin} from '@/packages/amis-editor-core/src';
import {defaultValue, getSchemaTpl} from '@/packages/amis-editor-core/src';
import {getEventControlConfig} from '../renderer/event-control/helper';

export class PlainPlugin extends BasePlugin {
  static id = 'PlainPlugin';
  // Associated renderer name
  rendererName = 'plain';
  $schema = '/schemas/PlainSchema.json';
  disabledRendererPlugin = true; // The component panel is not displayed

  // Component name
  name = 'Plain text';
  isBaseComponent = true;
  icon = 'fa fa-file-text-o';
  pluginIcon = 'plain-plugin';
  description = 'Used to display plain text, html tags will be escaped. ';
  docLink = '/amis/zh-CN/components/plain';
  tags = ['show'];
  previewSchema = {
    type: 'plain',
    text: 'This is plain text',
    className: 'text-center',
    inline: false
  };
  scaffold: any = {
    type: 'plain',
    tpl: 'content',
    inline: false
  };

  panelTitle = 'Plain Text';
  panelJustify = true;

  // Event definition
  events: RendererPluginEvent[] = [
    {
      eventName: 'click',
      eventLabel: 'click',
      description: 'Triggered when clicked',
      dataSchema: [
        {
          type: 'object',
          properties: {
            context: {
              type: 'object',
              title: 'Context',
              properties: {
                nativeEvent: {
                  type: 'object',
                  title: 'Mouse event object'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'mouseenter',
      eventLabel: 'Mouse Move',
      description: 'Triggered when the mouse moves in',
      dataSchema: [
        {
          type: 'object',
          properties: {
            context: {
              type: 'object',
              title: 'Context',
              properties: {
                nativeEvent: {
                  type: 'object',
                  title: 'Mouse event object'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'mouseleave',
      eventLabel: 'Mouse out',
      description: 'Triggered when the mouse moves out',
      dataSchema: [
        {
          type: 'object',
          properties: {
            context: {
              type: 'object',
              title: 'Context',
              properties: {
                nativeEvent: {
                  type: 'object',
                  title: 'Mouse event object'
                }
              }
            }
          }
        }
      ]
    }
  ];

  //Action definition
  actions: RendererPluginAction[] = [];

  panelBodyCreator = (context: BaseEventContext) => {
    const isTableCell = context.info.renderer.name === 'table-cell';
    return [
      getSchemaTpl('tabs', [
        {
          title: 'Attributes',
          body: getSchemaTpl('collapseGroup', [
            {
              title: 'Basic',
              body: [
                getSchemaTpl('textareaFormulaControl', {
                  name: 'tpl',
                  label: 'content',
                  mode: 'normal',
                  pipeIn: (value: any, data: any) =>
                    value || (data && data.text),
                  description:
                    'If the current field has a value, please do not set it, otherwise overwrite it. Support using <code>\\${xxx}</code> to get variables, or use lodash.template syntax to write template logic. <a target="_blank" href="/amis/zh-CN/docs/concepts/template">Details</a>'
                }),
                getSchemaTpl('placeholder', {
                  pipeIn: defaultValue('-'),
                  label: 'Placeholder'
                })
              ]
            },
            isTableCell ? null : getSchemaTpl('status')
          ])
        },
        isTableCell
          ? null
          : {
              title: 'Appearance',
              body: getSchemaTpl('collapseGroup', [
                {
                  title: 'Basic',
                  body: [
                    getSchemaTpl('switch', {
                      name: 'inline',
                      label: 'Inline mode',
                      value: true
                    })
                  ]
                },
                getSchemaTpl('style:classNames', {isFormItem: false})
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
      ])
    ];
  };
}

registerEditorPlugin(PlainPlugin);

import {
  registerEditorPlugin,
  RendererPluginAction,
  RendererPluginEvent
} from '@/packages/amis-editor-core/src';
import {BaseEventContext, BasePlugin} from '@/packages/amis-editor-core/src';
import {undefinedPipeOut, getSchemaTpl} from '@/packages/amis-editor-core/src';
import {getEventControlConfig} from '../renderer/event-control/helper';

const presetColors = [
  '#2468f2',
  '#b8babf',
  '#528eff',
  '#30bf13',
  '#f33e3e',
  '#ff9326',
  '#fff',
  '#000'
];

export class TagPlugin extends BasePlugin {
  static id = 'TagPlugin';
  // Associated renderer name
  rendererName = 'tag';
  $schema = '/schemas/TagSchema.json';

  // Component name
  name = 'Label';
  isBaseComponent = true;
  icon = 'fa fa-tag';
  pluginIcon = 'tag-plugin';
  description = 'Label for marking and selection';
  docLink = '/amis/zh-CN/components/tag';
  tags = ['show'];
  previewSchema = {
    type: 'tag',
    label: 'normal label',
    color: 'processing'
  };
  scaffold: any = {
    type: 'tag',
    label: 'normal label',
    color: 'processing'
  };

  panelTitle = 'Labels';
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
            },
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                label: {
                  type: 'object',
                  title: 'label name'
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
            },
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                label: {
                  type: 'object',
                  title: 'label name'
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
            },
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                label: {
                  type: 'object',
                  title: 'label name'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'close',
      eventLabel: 'Click to close',
      description: 'Triggered when clicking close',
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
            },
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                label: {
                  type: 'object',
                  title: 'label name'
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
    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: [
              getSchemaTpl('valueFormula', {
                name: 'label',
                label: 'label content',
                rendererSchema: {
                  type: 'input-text'
                }
              }),
              {
                type: 'button-group-select',
                label: 'mode',
                name: 'displayMode',
                value: 'normal',
                options: [
                  {
                    label: 'Normal',
                    value: 'normal'
                  },
                  {
                    label: 'Rounded corners',
                    value: 'rounded'
                  },
                  {
                    label: 'status',
                    value: 'status'
                  }
                ],
                onChange: (value: any, origin: any, item: any, form: any) => {
                  if (value !== 'status') {
                    form.setValues({
                      icon: undefined
                    });
                  }
                }
              },
              getSchemaTpl('icon', {
                visibleOn: 'this.displayMode === "status"',
                label: 'front icon'
              }),
              getSchemaTpl('switch', {
                label: 'Can be closed',
                name: 'closable'
              })
            ]
          },
          getSchemaTpl('status')
        ])
      },
      {
        title: 'Appearance',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Color',
            body: [
              {
                type: 'input-color',
                label: 'Topic',
                name: 'color',
                presetColors,
                pipeOut: undefinedPipeOut
              },
              {
                type: 'input-color',
                label: 'background color',
                name: 'style.backgroundColor',
                presetColors,
                pipeOut: undefinedPipeOut
              },
              {
                type: 'input-color',
                label: 'border',
                name: 'style.borderColor',
                presetColors,
                pipeOut: undefinedPipeOut
              },
              {
                type: 'input-color',
                label: 'character',
                name: 'style.color',
                presetColors,
                pipeOut: undefinedPipeOut
              }
            ]
          },
          getSchemaTpl('style:classNames', {
            isFormItem: false
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
}

registerEditorPlugin(TagPlugin);

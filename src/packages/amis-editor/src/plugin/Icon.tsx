import {
  registerEditorPlugin,
  RendererPluginAction,
  RendererPluginEvent
} from '@/packages/amis-editor-core/src';
import {BaseEventContext, BasePlugin} from '@/packages/amis-editor-core/src';
import {defaultValue, getSchemaTpl} from '@/packages/amis-editor-core/src';
import {getEventControlConfig} from '../renderer/event-control';

export class IconPlugin extends BasePlugin {
  static id = 'IconPlugin';
  // Associated renderer name
  rendererName = 'icon';
  $schema = '/schemas/Icon.json';

  // Component name
  name = 'icon';
  isBaseComponent = true;
  icon = 'fa fa-calendar';

  panelTitle = 'icon';

  description =
    'Used to display an icon, you can configure different icon styles. ';
  docLink = '/amis/zh-CN/components/icon';
  tags = ['show'];

  pluginIcon = 'button-plugin';

  scaffold = {
    type: 'icon',
    icon: 'fa fa-spotify',
    vendor: ''
  };
  previewSchema: any = {
    type: 'icon',
    icon: 'fa fa-spotify',
    vendor: ''
  };

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
                getSchemaTpl('icon', {
                  label: 'icon'
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
              title: 'Basic style',
              body: [
                getSchemaTpl('theme:select', {
                  label: 'Size',
                  name: 'themeCss.className.iconSize'
                }),
                getSchemaTpl('theme:colorPicker', {
                  label: 'color',
                  name: `themeCss.className.font.color`,
                  labelMode: 'input'
                }),
                getSchemaTpl('theme:paddingAndMargin', {
                  label: 'Margin'
                })
              ]
            }
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

registerEditorPlugin(IconPlugin);

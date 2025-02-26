/**
 * @file avatar
 */
import {registerEditorPlugin, RendererPluginEvent} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {getSchemaTpl, defaultValue} from 'amis-editor-core';
import {tipedLabel} from 'amis-editor-core';
import {getEventControlConfig} from '../renderer/event-control';

const DefaultSize = 40;
const DefaultBorderRadius = 20;

const widthOrheightPipeIn = (curValue: string, rest: any) =>
  curValue ? curValue : rest.data?.size ?? DefaultSize;

export class AvatarPlugin extends BasePlugin {
  static id = 'AvatarPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'avatar';
  $schema = '/schemas/AvatarSchema.json';

  // Component name
  name = 'Avatar';
  isBaseComponent = true;
  icon = 'fa fa-user';
  pluginIcon = 'avatar-plugin';
  description = 'User avatar';
  docLink = '/friends/zh-CN/components/avatar';
  tags = ['show'];
  scaffold = {
    type: 'avatar',
    showtype: 'image',
    icon: '',
    fit: 'cover',
    style: {
      width: DefaultSize,
      height: DefaultSize,
      borderRadius: DefaultBorderRadius
    }
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

  previewSchema: any = {
    ...this.scaffold
  };

  notRenderFormZone = true;

  panelJustify = true;

  panelTitle = 'Avatar';

  panelBodyCreator = (context: BaseEventContext) => {
    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              className: 'p-none',
              title: 'Basic',
              body: [
                getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                // If src, text and icon exist at the same time, src will be used first, followed by text, and finally icon
                {
                  type: 'button-group-select',
                  label: 'content',
                  name: 'showtype',
                  tiled: true,
                  inputClassName: 'items-center',
                  options: [
                    {label: '图片', value: 'image'},
                    {label: 'icon', value: 'icon'},
                    {label: 'text', value: 'text'}
                  ],
                  pipeIn: (value: string, form: any) => {
                    if (value) {
                      return value;
                    }
                    const showType = form.data?.text
                      ? 'text'
                      : form.data?.icon
                      ? 'icon'
                      : 'image';
                    // Use setTimeout to skip react update detection and promote showtype update
                    setTimeout(() => form.setValueByName('showtype', showType));
                    return showType;
                  },
                  onChange: (value: any, origin: any, item: any, form: any) => {
                    form.setValues({
                      src: undefined,
                      defaultAvatar: undefined,
                      fit: 'cover',
                      text: undefined,
                      gap: 4,
                      icon: ''
                    });
                  }
                },
                {
                  type: 'container',
                  className: 'ae-ExtendMore mb-3',
                  body: [
                    // icon
                    getSchemaTpl('icon', {
                      name: 'icon',
                      label: 'icon',
                      visibleOn: 'this.showtype === "icon"'
                    }),
                    // picture
                    getSchemaTpl('valueFormula', {
                      rendererSchema: {
                        type: 'input-url'
                      },
                      name: 'src',
                      label: 'Avatar address',
                      visibleOn: 'this.showtype === "image"'
                    }),
                    // Placeholder image
                    getSchemaTpl('imageUrl', {
                      name: 'defaultAvatar',
                      label: 'Default avatar',
                      visibleOn: 'this.showtype === "image"'
                    }),
                    {
                      label: tipedLabel(
                        'Filling method',
                        'How to handle images whose size is inconsistent with the control size'
                      ),
                      name: 'fit',
                      type: 'select',
                      pipeIn: defaultValue('cover'),
                      options: [
                        {
                          label: 'Crop the long side in equal proportion',
                          value: 'cover'
                        },
                        {
                          label: 'Leave short sides blank in equal proportion',
                          value: 'contain'
                        },
                        {
                          label: 'Stretch the image to fill',
                          value: 'fill'
                        },
                        {
                          label: 'Crop to original size',
                          value: 'none'
                        }
                      ],
                      visibleOn: 'this.showtype === "image"'
                    },

                    // Character
                    getSchemaTpl('avatarText'),
                    {
                      type: 'input-group',
                      name: 'gap',
                      value: 4,
                      label: tipedLabel(
                        'Border distance',
                        'Center the text, and keep the minimum distance from the border when there are too many words'
                      ),
                      body: [
                        {
                          type: 'input-number',
                          name: 'gap',
                          min: 0
                        },
                        {
                          type: 'tpl',
                          addOnclassName: 'border-0 bg-none',
                          tpl: 'px'
                        }
                      ],
                      visibleOn: 'this.showtype === "text"'
                    }
                  ]
                },
                getSchemaTpl('badge')
              ]
            },
            getSchemaTpl('status')
          ])
        ]
      },
      {
        title: 'Appearance',
        className: 'p-none',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: [
              {
                type: 'input-number',
                label: 'length',
                min: 0,
                name: 'style.width',
                pipeIn: widthOrheightPipeIn
              },
              {
                type: 'input-number',
                label: 'Height',
                min: 1,
                name: 'style.height',
                pipeIn: widthOrheightPipeIn
              },
              {
                type: 'input-number',
                label: 'Rounded corners',
                min: 0,
                name: 'style.borderRadius',
                pipeIn: (curValue: string, rest: any) => {
                  if (curValue) {
                    return curValue;
                  }
                  // If it is a circle, it means it is old. Set the shape to a rectangle and return 50%
                  if (rest.data?.shape === 'circle') {
                    rest.setValueByName('shape', 'square');
                    return +(rest.data?.size || DefaultSize) * 0.5;
                  }
                  return rest.data?.size ? 0 : DefaultBorderRadius;
                }
              }
            ]
          },
          // Compatible with old appearance panels
          {
            header: 'character',
            key: 'font',
            body: [
              {
                type: 'style-font',
                label: false,
                name: 'style'
              }
            ]
          },
          {
            header: 'Inside and outside margins',
            key: 'box-model',
            body: [
              {
                type: 'style-box-model',
                label: false,
                name: 'style'
              }
            ]
          },
          {
            header: 'border',
            key: 'border',
            body: [
              {
                type: 'style-border',
                label: false,
                name: 'style',
                disableRadius: true
              }
            ]
          },
          {
            title: 'Background',
            body: [
              {
                type: 'style-background',
                label: false,
                name: 'style',
                noImage: true
              }
            ]
          },
          {
            header: 'Shadow',
            key: 'box-shadow',
            body: [
              {
                type: 'style-box-shadow',
                label: false,
                name: 'style.boxShadow'
              }
            ]
          },
          {
            header: 'Other',
            key: 'other',
            body: [
              {
                label: 'Transparency',
                name: 'style.opacity',
                min: 0,
                max: 1,
                step: 0.05,
                type: 'input-range',
                pipeIn: defaultValue(1),
                marks: {
                  '0%': '0',
                  '50%': '0.5',
                  '100%': '1'
                }
              }
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
    ]);
  };
}

registerEditorPlugin(AvatarPlugin);

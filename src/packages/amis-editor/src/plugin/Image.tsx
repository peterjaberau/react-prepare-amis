import {
  RendererPluginAction,
  RendererPluginEvent,
  getI18nEnabled,
  registerEditorPlugin
} from 'amis-editor-core';
import {
  ActiveEventContext,
  BaseEventContext,
  BasePlugin,
  PluginEvent,
  ResizeMoveEventContext
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl, tipedLabel} from 'amis-editor-core';
import {mockValue} from 'amis-editor-core';
import {
  buildLinkActionDesc,
  getArgsWrapper,
  getEventControlConfig
} from '../renderer/event-control/helper';
import React from 'react';

export class ImagePlugin extends BasePlugin {
  static id = 'ImagePlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'image';
  $schema = '/schemas/ImageSchema.json';

  // Component name
  name = 'Picture display';
  isBaseComponent = true;
  description =
    'Can be used to display an image, supports static setting of image address, and can also configure <code>name</code> to associate with a variable. ';
  docLink = '/amis/zh-CN/components/image';
  tags = ['show'];
  icon = 'fa fa-photo';
  pluginIcon = 'image-plugin';
  scaffold = {
    type: 'image'
  };
  previewSchema = {
    ...this.scaffold,
    thumbMode: 'cover',
    value: mockValue({type: 'image'})
  };

  // Event definition
  events: RendererPluginEvent[] = [
    {
      eventName: 'click',
      eventLabel: 'click',
      description: 'Triggered when clicked',
      defaultShow: true,
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
  actions: RendererPluginAction[] = [
    {
      actionType: 'preview',
      actionLabel: 'Preview',
      description: 'Preview image',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            Preview
            {buildLinkActionDesc(props.manager, info)}
          </div>
        );
      }
    },
    {
      actionType: 'zoom',
      actionLabel: 'Adjust image ratio',
      description: 'Enlarge or reduce the image proportionally',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            Adjustment
            {buildLinkActionDesc(props.manager, info)}
            Image ratio
          </div>
        );
      },
      schema: {
        type: 'container',
        body: [
          getArgsWrapper([
            getSchemaTpl('formulaControl', {
              name: 'scale',
              mode: 'horizontal',
              variables: '${variables}',
              horizontal: {
                leftFixed: 4 // You need to set leftFixed, otherwise the controls of this field will not be left aligned with the controls of other fields
              },
              label: tipedLabel(
                'Adjust scale',
                'Define the percentage size of each enlargement or reduction of the image, positive value is enlargement, negative value is reduction, the default is 50'
              ),
              value: 50,
              size: 'lg'
            })
          ])
        ]
      }
    }
  ];

  panelTitle = 'Picture';
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    const isUnderField = /\/field\/\w+$/.test(context.path as string);
    const i18nEnabled = getI18nEnabled();
    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: [
              {
                name: 'title',
                type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                label: 'Image title'
              },
              {
                name: 'imageCaption',
                type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                label: 'Image description'
              },
              {
                name: 'imageMode',
                label: 'display mode',
                type: 'select',
                pipeIn: defaultValue('thumb'),
                options: [
                  {
                    label: 'thumbnail',
                    value: 'thumb'
                  },
                  {
                    label: 'Original image',
                    value: 'original'
                  }
                ]
              },
              isUnderField
                ? null
                : getSchemaTpl('imageUrl', {
                    name: 'src',
                    label: 'thumbnail address',
                    description:
                      "If the field name has been bound, you don't need to set it. Variables are supported."
                  }),

              getSchemaTpl('backgroundImageUrl', {
                name: 'editorSetting.mock.src',
                label: tipedLabel(
                  'Fake data picture',
                  'The simulated image is only displayed in the editing area, and the actual content of the image will be displayed during runtime'
                )
              }),
              {
                type: 'ae-switch-more',
                mode: 'normal',
                name: 'enlargeAble',
                label: tipedLabel(
                  'Image zoom function',
                  'The zoom function and the open external link function are in conflict. If you want to open an external link when clicking, please turn off this function first.'
                ),
                value: false,
                hiddenOnDefault: false,
                formType: 'extend',
                pipeIn: (value: any) => !!value,
                form: {
                  body: [
                    getSchemaTpl('imageUrl', {
                      name: 'originalSrc',
                      label: 'Original image address',
                      description:
                        'If not configured, the thumbnail address will be used by default.'
                    })
                  ]
                }
              },
              {
                type: 'input-text',
                label: 'Open external link',
                name: 'href',
                hiddenOn: 'this.enlargeAble',
                clearValueOnHidden: true
              },
              getSchemaTpl('imageUrl', {
                name: 'defaultImage',
                label: tipedLabel(
                  'Placeholder',
                  'Image displayed when there is no data'
                )
              }),
              getSchemaTpl('formulaControl', {
                name: 'maxScale',
                mode: 'horizontal',
                label: tipedLabel(
                  'Magnification limit',
                  'Define the maximum percentage of the image resize action, default is 200'
                ),
                value: 200
              }),
              getSchemaTpl('formulaControl', {
                name: 'minScale',
                mode: 'horizontal',
                label: tipedLabel(
                  'Narrowing the limit',
                  'Define the minimum percentage of the action to resize the image, the default is 50'
                ),
                value: 50
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
            title: 'Basic',
            body: [
              // amis is deprecated
              // getSchemaTpl('switch', {
              //   name: 'showDimensions',
              // label: 'Show image size'
              // }),
              getSchemaTpl('layout:display', {
                flexHide: true,
                value: 'inline-block',
                label: 'Display type'
              }),

              {
                name: 'thumbMode',
                visibleOn: '${!imageMode || imageMode ===  "thumb"}',
                type: 'select',
                label: 'display mode',
                mode: 'horizontal',
                labelAlign: 'left',
                horizontal: {
                  left: 5,
                  right: 7
                },
                pipeIn: defaultValue('contain'),
                options: [
                  {
                    label: 'Full width',
                    value: 'w-full'
                  },

                  {
                    label: 'Height full',
                    value: 'h-full'
                  },

                  {
                    label: 'include',
                    value: 'contain'
                  },

                  {
                    label: 'filled',
                    value: 'cover'
                  }
                ]
              },

              getSchemaTpl('theme:size', {
                label: 'Size',
                name: 'themeCss.imageContentClassName.size:default'
              })
            ]
          },
          getSchemaTpl('theme:base', {
            classname: 'imageControlClassName',
            title: 'Picture'
          }),
          {
            title: 'Other',
            body: [
              getSchemaTpl('theme:font', {
                label: 'Title text',
                name: 'themeCss.titleControlClassName.font',
                editorValueToken: '--image-image-normal'
              }),
              getSchemaTpl('theme:paddingAndMargin', {
                label: 'Title margin',
                name: 'themeCss.titleControlClassName.padding-and-margin',
                editorValueToken: '--image-image-normal-title'
              }),
              getSchemaTpl('theme:font', {
                label: 'Description text',
                name: 'themeCss.desControlClassName.font',
                editorValueToken: '--image-image-description'
              }),
              getSchemaTpl('theme:paddingAndMargin', {
                label: 'Description margin',
                name: 'themeCss.desControlClassName.padding-and-margin',
                editorValueToken: '--image-image-description'
              }),
              {
                name: 'themeCss.iconControlClassName.--image-image-normal-icon',
                label: 'Zoom in icon',
                type: 'icon-select',
                returnSvg: true
              },
              {
                name: 'themeCss.galleryControlClassName.--image-images-prev-icon',
                label: 'left switch icon',
                type: 'icon-select',
                returnSvg: true
              },
              {
                name: 'themeCss.galleryControlClassName.--image-images-next-icon',
                label: 'right switch icon',
                type: 'icon-select',
                returnSvg: true
              },
              getSchemaTpl('theme:select', {
                label: 'Switch icon size',
                name: 'themeCss.galleryControlClassName.--image-images-item-size'
              })
            ]
          },
          getSchemaTpl('theme:cssCode')
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

  onActive(event: PluginEvent<ActiveEventContext>) {
    const context = event.context;

    if (context.info?.plugin !== this || !context.node) {
      return;
    }

    const node = context.node!;
    node.setHeightMutable(true);
    node.setWidthMutable(true);
  }

  onWidthChangeStart(
    event: PluginEvent<
      ResizeMoveEventContext,
      {
        onMove(e: MouseEvent): void;
        onEnd(e: MouseEvent): void;
      }
    >
  ) {
    return this.onSizeChangeStart(event, 'horizontal');
  }

  onHeightChangeStart(
    event: PluginEvent<
      ResizeMoveEventContext,
      {
        onMove(e: MouseEvent): void;
        onEnd(e: MouseEvent): void;
      }
    >
  ) {
    return this.onSizeChangeStart(event, 'vertical');
  }

  onSizeChangeStart(
    event: PluginEvent<
      ResizeMoveEventContext,
      {
        onMove(e: MouseEvent): void;
        onEnd(e: MouseEvent): void;
      }
    >,
    direction: 'both' | 'vertical' | 'horizontal' = 'both'
  ) {
    const context = event.context;
    const node = context.node;
    if (node.info?.plugin !== this) {
      return;
    }

    const resizer = context.resizer;
    const dom = context.dom;
    const frameRect = dom.parentElement!.getBoundingClientRect();
    const rect = dom.getBoundingClientRect();
    const startX = context.nativeEvent.pageX;
    const startY = context.nativeEvent.pageY;

    event.setData({
      onMove: (e: MouseEvent) => {
        const dy = e.pageY - startY;
        const dx = e.pageX - startX;
        const height = Math.max(50, rect.height + dy);
        const width = Math.max(100, Math.min(rect.width + dx, frameRect.width));
        const state: any = {
          width,
          height
        };

        if (direction === 'both') {
          resizer.setAttribute('data-value', `${width}px x ${height}px`);
        } else if (direction === 'vertical') {
          resizer.setAttribute('data-value', `${height}px`);
          delete state.width;
        } else {
          resizer.setAttribute('data-value', `${width}px`);
          delete state.height;
        }

        node.updateState(state);

        requestAnimationFrame(() => {
          node.calculateHighlightBox();
        });
      },
      onEnd: (e: MouseEvent) => {
        const dy = e.pageY - startY;
        const dx = e.pageX - startX;
        const height = Math.max(50, rect.height + dy);
        const width = Math.max(100, Math.min(rect.width + dx, frameRect.width));
        const state: any = {
          width,
          height
        };

        if (direction === 'vertical') {
          delete state.width;
        } else if (direction === 'horizontal') {
          delete state.height;
        }

        resizer.removeAttribute('data-value');
        node.updateSchema(state);
        node.updateState({}, true);
        requestAnimationFrame(() => {
          node.calculateHighlightBox();
        });
      }
    });
  }
}

registerEditorPlugin(ImagePlugin);

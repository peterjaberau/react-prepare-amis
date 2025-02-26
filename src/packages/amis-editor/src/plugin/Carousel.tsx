import {registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext, BasePlugin, BasicToolbarItem} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {mockValue} from 'amis-editor-core';

export class CarouselPlugin extends BasePlugin {
  static id = 'CarouselPlugin';
  // Associated renderer name
  rendererName = 'carousel';
  $schema = '/schemas/CarouselSchema.json';

  // Component name
  name = 'Carousel';
  isBaseComponent = true;
  description =
    'Used to render the carousel, you can configure the content of each page (not just pictures), and you can configure the transition animation. ';
  docLink = '/amis/zh-CN/components/carousel';
  tags = ['show'];
  icon = 'fa fa-images';
  pluginIcon = 'carousel-plugin';
  scaffold = {
    type: 'carousel',
    options: [
      {
        image: mockValue({type: 'image'})
      },
      {
        html: '<div style="width: 100%; height: 300px; background: #e3e3e3; text-align: center; line-height: 300px;">carousel data</div>'
      },
      {
        image: mockValue({type: 'image'})
      }
    ]
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = 'Carousel';
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    const isUnderField = /\/field\/\w+$/.test(context.path as string);
    return [
      getSchemaTpl('tabs', [
        {
          title: 'General',
          body: [
            getSchemaTpl('layout:originPosition', {value: 'left-top'}),
            isUnderField
              ? {
                  type: 'tpl',
                  inline: false,
                  className: 'text-info text-sm',
                  tpl: '<p>Currently the field content node is configured. Select the upper level for more configurations. </p>'
                }
              : null,
            {
              type: 'formula',
              name: '__mode',
              autoSet: false,
              formula:
                '!this.name && !this.source && Array.isArray(this.options) ? 2 : 1'
            },
            {
              label: 'data source',
              name: '__mode',
              type: 'button-group-select',
              pipeIn: (value: any, {data}: any) => {
                if (value === undefined) {
                  return !data.name &&
                    !data.source &&
                    Array.isArray(data.options)
                    ? 2
                    : 1;
                }
                return value;
              },
              options: [
                {
                  label: 'Related fields',
                  value: 1
                },
                {
                  label: 'Static settings',
                  value: 2
                }
              ]
            },
            {
              label: 'field name',
              name: 'name',
              type: 'input-text',
              description:
                'Set the field name and associate it with the data in the current data scope.',
              visibleOn:
                'this.__mode == 1 || !this.__mode && (this.name || this.source || !Array.isArray(this.options))'
            },
            {
              type: 'combo',
              name: 'options',
              visibleOn:
                'this.__mode == 2 || !this.__mode && !this.name && !this.source && Array.isArray(this.options)',
              label: 'Carousel options content',
              mode: 'vertical',
              multiple: true,
              multiLine: true,
              addable: true,
              removable: true,
              typeSwitchable: false,
              conditions: [
                {
                  label: 'Picture',
                  test: 'this.type === "image"',
                  items: [
                    getSchemaTpl('imageUrl', {
                      name: 'content'
                    }),
                    getSchemaTpl('imageTitle'),
                    getSchemaTpl('className', {
                      label: 'Image title class name',
                      name: 'titleClassName',
                      visibleOn: 'this.type == "image"'
                    }),
                    getSchemaTpl('imageDesc'),
                    getSchemaTpl('className', {
                      label: 'Image description class name',
                      name: 'descriptionClassName',
                      visibleOn: 'this.type == "image"'
                    }),
                    {
                      type: 'input-text',
                      label: 'Open external link',
                      name: 'href',
                      visibleOn: 'this.type == "image"'
                    }
                  ],
                  scaffold: {
                    type: 'input-image',
                    image: ''
                  }
                },

                {
                  label: 'HTML',
                  test: 'this.type === "html"',
                  items: [
                    getSchemaTpl('richText', {
                      label: 'content',
                      name: 'content'
                    })
                  ],
                  scaffold: {
                    type: 'html',
                    content: '<p>html snippet</p>'
                  }
                },

                {
                  label: 'Custom container',
                  test: 'this.type === "container"',
                  items: [
                    {
                      type: 'combo',
                      name: 'content',
                      label: false,
                      multiple: false,
                      items: [
                        {
                          type: 'input-text',
                          name: 'itemSchema',
                          value: {
                            type: 'container',
                            body: {
                              type: 'tpl',
                              tpl: 'Drag the component here'
                            }
                          }
                        }
                      ]
                    }
                  ],
                  scaffold: {
                    type: 'container',
                    itemSchema: {
                      type: 'container',
                      body: {
                        type: 'tpl',
                        tpl: 'Drag the component here'
                      }
                    }
                  }
                }
              ],
              pipeIn: (value: any) => {
                return Array.isArray(value) && value.length
                  ? value.map(
                      (item: {
                        html?: string;
                        image?: string;
                        href?: string;
                        title?: string;
                        titleClassName?: string;
                        description?: string;
                        descriptionClassName?: string;
                        itemSchema?: any;
                      }) => {
                        if (item && item.hasOwnProperty('html')) {
                          return {
                            type: 'html',
                            content: item.html
                          };
                        } else if (item && item.hasOwnProperty('itemSchema')) {
                          return {
                            type: 'container',
                            content: {
                              itemSchema: item.itemSchema
                            }
                          };
                        } else {
                          return {
                            type: 'image',
                            content: item.image,
                            title: item.title,
                            href: item.href,
                            titleClassName: item.titleClassName,
                            description: item.description,
                            descriptionClassName: item.descriptionClassName
                          };
                        }
                      }
                    )
                  : [];
              },
              pipeOut: (value: any, originValue: any, data: any) => {
                return Array.isArray(value) && value.length
                  ? value.map(
                      (item: {
                        type: string;
                        content: any;
                        href?: string;
                        title?: string;
                        titleClassName?: string;
                        description?: string;
                        descriptionClassName?: string;
                      }) => {
                        if (item.type === 'html') {
                          return {
                            html: item.content
                          };
                        } else if (item.type === 'container') {
                          return {
                            itemSchema: item.content?.itemSchema
                          };
                        } else {
                          return {
                            image: item.content,
                            href: item.href,
                            title: item.title,
                            titleClassName: item.titleClassName,
                            description: item.description,
                            descriptionClassName: item.descriptionClassName
                          };
                        }
                      }
                    )
                  : [];
              }
            }
          ]
        },
        {
          title: 'Appearance',
          body: getSchemaTpl('collapseGroup', [
            {
              title: 'Basic',
              body: [
                getSchemaTpl('switch', {
                  name: 'auto',
                  label: 'Automatic carousel',
                  pipeIn: defaultValue(true)
                }),
                getSchemaTpl('valueFormula', {
                  rendererSchema: {
                    type: 'input-number'
                  },
                  name: 'interval',
                  label: 'Animation interval (ms)',
                  valueType: 'number',
                  pipeIn: defaultValue(5000)
                }),
                {
                  name: 'duration',
                  type: 'input-number',
                  label: 'Animation duration (ms)',
                  min: 100,
                  step: 10,
                  size: 'sm',
                  pipeIn: defaultValue(500)
                },
                {
                  name: 'animation',
                  label: 'Animation effect',
                  type: 'button-group-select',
                  pipeIn: defaultValue('fade'),
                  options: [
                    {
                      label: 'fade',
                      value: 'fade'
                    },
                    {
                      label: 'slide',
                      value: 'slide'
                    }
                  ]
                },
                {
                  name: 'controlsTheme',
                  label: 'Control button theme',
                  type: 'button-group-select',
                  pipeIn: defaultValue('light'),
                  options: [
                    {
                      label: 'light',
                      value: 'light'
                    },
                    {
                      label: 'dark',
                      value: 'dark'
                    }
                  ]
                },
                {
                  name: 'controls',
                  label: 'Control display',
                  type: 'button-group-select',
                  pipeIn: defaultValue('dots,arrows'),
                  multiple: true,
                  options: [
                    {
                      label: 'bottom dot',
                      value: 'dots'
                    },
                    {
                      label: 'left and right arrows',
                      value: 'arrows'
                    }
                  ]
                },
                getSchemaTpl('switch', {
                  name: 'alwaysShowArrow',
                  label: 'The arrow is always displayed',
                  clearValueOnHidden: true,
                  hiddenOn: '!~this.controls.indexOf("arrows")',
                  pipeIn: defaultValue(false)
                }),
                {
                  type: 'ae-switch-more',
                  mode: 'normal',
                  name: 'multiple',
                  bulk: false,
                  label: 'Multiple images display',
                  formType: 'extend',
                  form: {
                    body: [
                      {
                        name: 'count',
                        label: 'Quantity',
                        type: 'input-number',
                        min: 2,
                        step: 1,
                        value: 5
                      }
                    ]
                  }
                },
                {
                  name: 'width',
                  type: 'input-text',
                  label: 'width',
                  validations: 'isNumeric',
                  addOn: {
                    type: 'button',
                    label: 'px'
                  }
                },
                {
                  name: 'height',
                  type: 'input-text',
                  label: 'Height',
                  validations: 'isNumeric',
                  addOn: {
                    type: 'button',
                    label: 'px'
                  }
                }
              ]
            },
            {
              title: 'Show and hide',
              body: [getSchemaTpl('ref'), getSchemaTpl('visible')]
            },
            getSchemaTpl('theme:base', {
              title: 'Carousel'
            }),
            {
              title: 'Other',
              body: [
                {
                  name: 'themeCss.baseControlClassName.--image-images-prev-icon',
                  label: 'left switch icon',
                  type: 'icon-select',
                  returnSvg: true
                },
                {
                  name: 'themeCss.baseControlClassName.--image-images-next-icon',
                  label: 'right switch icon',
                  type: 'icon-select',
                  returnSvg: true
                },
                getSchemaTpl('theme:select', {
                  label: 'Switch icon size',
                  name: 'themeCss.galleryControlClassName.width:default'
                })
              ]
            },
            getSchemaTpl('theme:cssCode')
          ])
        }
      ])
    ];
  };

  filterProps(props: any) {
    // Don't rotate automatically when editing, it will affect editing
    props.auto = false;
    return props;
  }

  /**
   * Added switching toolbar
   * @param context
   * @param toolbars
   */
  buildEditorToolbar(
    context: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) {
    if (
      context.info.plugin === this &&
      context.info.renderer.name === 'carousel' &&
      !context.info.hostId
    ) {
      const node = context.node;

      toolbars.push({
        level: 'secondary',
        icon: 'fa fa-chevron-left',
        tooltip: 'Previous card',
        onClick: () => {
          const control = node.getComponent();
          control?.prev?.();
        }
      });

      toolbars.push({
        level: 'secondary',
        icon: 'fa fa-chevron-right',
        tooltip: 'Next card',
        onClick: () => {
          const control = node.getComponent();

          control?.next?.();
        }
      });
    }
  }
}

registerEditorPlugin(CarouselPlugin);

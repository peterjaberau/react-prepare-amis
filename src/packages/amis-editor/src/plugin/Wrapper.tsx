import {registerEditorPlugin} from 'amis-editor-core';
import {
  LayoutBasePlugin,
  RegionConfig,
  BaseEventContext
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';

export class WrapperPlugin extends LayoutBasePlugin {
  static id = 'WrapperPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'wrapper';
  $schema = '/schemas/WrapperSchema.json';
  disabledRendererPlugin = true; // The component panel is not displayed

  // Component name
  name = 'Package';
  isBaseComponent = true;
  description =
    'Similar to a container, the only difference is that it will have one layer of padding by default.';
  docLink = '/amis/zh-CN/components/wrapper';
  tags = ['container'];
  icon = 'fa fa-square-o';
  scaffold = {
    type: 'wrapper',
    body: 'content'
  };
  previewSchema = {
    ...this.scaffold
  };

  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: 'Content area'
    }
  ];

  panelTitle = 'Package';

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    const curRendererSchema = context?.schema;
    // const isFlexContainer = this.manager?.isFlexContainer(context?.id);
    const isFlexItem = this.manager?.isFlexItem(context?.id);
    const isFlexColumnItem = this.manager?.isFlexColumnItem(context?.id);

    return [
      getSchemaTpl('tabs', [
        {
          title: 'Attributes',
          className: 'p-none',
          body: [
            getSchemaTpl('collapseGroup', [
              {
                title: 'Layout',
                body: [
                  getSchemaTpl('layout:position', {
                    visibleOn: '!this.stickyStatus'
                  }),
                  getSchemaTpl('layout:originPosition'),
                  getSchemaTpl('layout:inset', {
                    mode: 'vertical'
                  }),
                  getSchemaTpl('layout:display'),

                  getSchemaTpl('layout:flex-setting', {
                    visibleOn:
                      'this.style && (this.style.display === "flex" || this.style.display === "inline-flex")',
                    direction: curRendererSchema.direction,
                    justify: curRendererSchema.justify,
                    alignItems: curRendererSchema.alignItems
                  }),

                  getSchemaTpl('layout:flex-wrap', {
                    visibleOn:
                      'this.style && (this.style.display === "flex" || this.style.display === "inline-flex")'
                  }),

                  ...(isFlexItem
                    ? [
                        getSchemaTpl('layout:flex', {
                          isFlexColumnItem,
                          label: isFlexColumnItem
                            ? 'Height setting'
                            : 'Width setting',
                          visibleOn:
                            'this.style && (this.style.position === "static" || this.style.position === "relative")'
                        }),
                        getSchemaTpl('layout:flex-grow', {
                          visibleOn:
                            'this.style && this.style.flex === "1 1 auto" && (this.style.position === "static" || this.style.position === "relative")'
                        }),
                        getSchemaTpl('layout:flex-basis', {
                          label: isFlexColumnItem
                            ? 'Flexible height'
                            : 'Flexible width',
                          visibleOn:
                            'this.style && (this.style.position === "static" || this.style.position === "relative") && this.style.flex === "1 1 auto"'
                        }),
                        getSchemaTpl('layout:flex-basis', {
                          label: isFlexColumnItem
                            ? 'Fixed height'
                            : 'Fixed width',
                          visibleOn:
                            'this.style && (this.style.position === "static" || this.style.position === "relative") && this.style.flex === "0 0 150px"'
                        })
                      ]
                    : []),

                  getSchemaTpl('layout:overflow-x', {
                    visibleOn: `${
                      isFlexItem && !isFlexColumnItem
                    } && this.style.flex === '0 0 150px'`
                  }),

                  getSchemaTpl('layout:isFixedHeight', {
                    visibleOn: `${!isFlexItem || !isFlexColumnItem}`,
                    onChange: (value: boolean) => {
                      context?.node.setHeightMutable(value);
                    }
                  }),
                  getSchemaTpl('layout:height', {
                    visibleOn: `${!isFlexItem || !isFlexColumnItem}`
                  }),
                  getSchemaTpl('layout:max-height', {
                    visibleOn: `${!isFlexItem || !isFlexColumnItem}`
                  }),
                  getSchemaTpl('layout:min-height', {
                    visibleOn: `${!isFlexItem || !isFlexColumnItem}`
                  }),
                  getSchemaTpl('layout:overflow-y', {
                    visibleOn: `${
                      !isFlexItem || !isFlexColumnItem
                    } && (this.isFixedHeight || this.style && this.style.maxHeight) || (${
                      isFlexItem && isFlexColumnItem
                    } && this.style.flex === '0 0 150px')`
                  }),

                  getSchemaTpl('layout:isFixedWidth', {
                    visibleOn: `${!isFlexItem || isFlexColumnItem}`,
                    onChange: (value: boolean) => {
                      context?.node.setWidthMutable(value);
                    }
                  }),
                  getSchemaTpl('layout:width', {
                    visibleOn: `${!isFlexItem || isFlexColumnItem}`
                  }),
                  getSchemaTpl('layout:max-width', {
                    visibleOn: `${!isFlexItem || isFlexColumnItem}`
                  }),
                  getSchemaTpl('layout:min-width', {
                    visibleOn: `${!isFlexItem || isFlexColumnItem}`
                  }),

                  getSchemaTpl('layout:overflow-x', {
                    visibleOn: `${
                      !isFlexItem || isFlexColumnItem
                    } && (this.isFixedWidth || this.style && this.style.maxWidth)`
                  }),
                  !isFlexItem ? getSchemaTpl('layout:margin-center') : null,
                  !isFlexItem
                    ? getSchemaTpl('layout:textAlign', {
                        name: 'style.textAlign',
                        label: 'Internal alignment',
                        visibleOn:
                          'this.style && this.style.display !== "flex" && this.style.display !== "inline-flex"'
                      })
                    : null,
                  getSchemaTpl('layout:z-index')
                ]
              },
              {
                title: 'Common',
                body: [getSchemaTpl('layout:padding')]
              },
              getSchemaTpl('status')
            ])
          ]
        },
        {
          title: 'Appearance',
          className: 'p-none',
          body: getSchemaTpl('collapseGroup', [
            ...getSchemaTpl('style:common', ['layout']),
            {
              title: 'CSS class name',
              body: [
                getSchemaTpl('className', {
                  description:
                    'After setting the style, the size setting will be invalid.',
                  pipeIn: defaultValue('bg-white')
                })
              ]
            }
          ])
        }
      ])
    ];
  };
}

registerEditorPlugin(WrapperPlugin);

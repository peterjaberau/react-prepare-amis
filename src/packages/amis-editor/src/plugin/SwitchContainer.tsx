import {
  BaseEventContext,
  LayoutBasePlugin,
  RegionConfig,
  registerEditorPlugin,
  getSchemaTpl,
  RendererPluginEvent,
  VRendererConfig,
  VRenderer,
  RendererInfo,
  BasicToolbarItem
} from 'amis-editor-core';
import {RegionWrapper as Region} from 'amis-editor-core';
import {getEventControlConfig} from '../renderer/event-control';
import React from 'react';
import {generateId} from '../util';

export class SwitchContainerPlugin extends LayoutBasePlugin {
  static id = 'SwitchContainerPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'switch-container';
  $schema = '/schemas/SwitchContainerSchema.json';

  // Component name
  name = 'State Container';
  isBaseComponent = true;
  description =
    'A container for conditional rendering of components based on their states, making it easy to design multi-state components';
  tags = ['layout container'];
  order = -2;
  icon = 'fa fa-square-o';
  pluginIcon = 'switch-container-plugin';
  scaffold = {
    type: 'switch-container',
    items: [
      {
        title: 'State 1',
        id: generateId(),
        body: [
          {
            type: 'tpl',
            tpl: 'Status-Content',
            wrapperComponent: '',
            id: generateId()
          }
        ]
      },
      {
        title: 'State 2',
        id: generateId(),
        body: [
          {
            type: 'tpl',
            tpl: 'State 2 content',
            wrapperComponent: '',
            id: generateId()
          }
        ]
      }
    ],
    style: {
      position: 'static',
      display: 'block'
    }
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

  panelTitle = 'Status Container';

  panelJustify = true;

  vRendererConfig: VRendererConfig = {
    regions: {
      body: {
        key: 'body',
        label: 'Content area',
        placeholder: 'status',
        wrapperResolve: (dom: HTMLElement) => dom
      }
    },
    panelTitle: 'Status',
    panelJustify: true,
    panelBodyCreator: (context: BaseEventContext) => {
      return getSchemaTpl('tabs', [
        {
          title: 'Attributes',
          body: getSchemaTpl('collapseGroup', [
            {
              title: 'Basics',
              body: [
                {
                  name: 'title',
                  label: 'status name',
                  type: 'input-text',
                  required: true
                },
                getSchemaTpl('expressionFormulaControl', {
                  evalMode: false,
                  label: 'Status condition',
                  name: 'visibleOn',
                  placeholder: '\\${xxx}'
                })
              ]
            }
          ])
        }
      ]);
    }
  };

  wrapperProps = {
    unmountOnExit: true,
    mountOnEnter: true
  };

  stateWrapperResolve = (dom: HTMLElement) => dom;
  overrides = {
    renderBody(this: any, item: any) {
      const dom = this.super(item);
      const info: RendererInfo = this.props.$$editor;
      const items = this.props.items || [];
      const index = items.findIndex((cur: any) => cur.$$id === item.$$id);

      if (!info || !info.plugin) {
        return dom;
      }

      const plugin: SwitchContainerPlugin = info.plugin as any;
      const id = item.$$id;
      const region = plugin.vRendererConfig?.regions?.body;

      return (
        <VRenderer
          type={info.type}
          plugin={info.plugin}
          renderer={info.renderer}
          multifactor
          key={id}
          //$schema="/schemas/ListBodyField.json"
          hostId={info.id}
          memberIndex={index}
          name={`${item.title || `status${index + 1}`}`}
          id={id}
          draggable={false}
          wrapperResolve={plugin.stateWrapperResolve}
          schemaPath={`${info.schemaPath}/items/${index}`}
          path={`${this.props.$path}/${index}`}
          data={this.props.data}
        >
          {region ? (
            <Region
              key={region.key}
              preferTag={region.preferTag}
              name={region.key}
              label={region.label}
              regionConfig={region}
              placeholder={region.placeholder}
              editorStore={plugin.manager.store}
              manager={plugin.manager}
              children={dom}
              wrapperResolve={region.wrapperResolve}
              rendererName={info.renderer.name}
            />
          ) : (
            dom
          )}
        </VRenderer>
      );
    }
  };

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
      context.info.renderer.name === 'switch-container' &&
      !context.info.hostId
    ) {
      const node = context.node;
      toolbars.unshift({
        icon: 'fa fa-chevron-right',
        tooltip: 'Next state',
        onClick: () => {
          const control = node.getComponent();
          if (control?.switchTo) {
            let index =
              control.state.activeIndex < 0 ? 0 : control.state.activeIndex;
            control.switchTo(index + 1);
          }
        }
      });

      toolbars.unshift({
        icon: 'fa fa-chevron-left',
        tooltip: 'Previous status',
        onClick: () => {
          const control = node.getComponent();
          if (control?.switchTo) {
            let index = control.state.activeIndex;
            control.switchTo(index - 1);
          }
        }
      });
    }
  }

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

  panelBodyCreator = (context: BaseEventContext) => {
    const curRendererSchema = context?.schema;
    const isFreeContainer = curRendererSchema?.isFreeContainer || false;
    const isFlexItem = this.manager?.isFlexItem(context?.id);
    const isFlexColumnItem = this.manager?.isFlexColumnItem(context?.id);

    const displayTpl = [
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
      })
    ];

    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: [
              {
                type: 'ae-listItemControl',
                mode: 'normal',
                name: 'items',
                label: 'Status list',
                addTip: 'Add component status',
                minLength: 1,
                items: [
                  {
                    type: 'input-text',
                    placeholder: 'Please enter the display text',
                    label: 'status name',
                    mode: 'horizontal',
                    name: 'title'
                  },
                  getSchemaTpl('expressionFormulaControl', {
                    name: 'visibleOn',
                    mode: 'horizontal',
                    label: 'Display conditions'
                  })
                ],
                scaffold: {
                  title: 'Status',
                  body: [
                    {
                      type: 'tpl',
                      tpl: 'Status content',
                      wrapperComponent: '',
                      inline: false
                    }
                  ]
                }
              }
            ]
          },
          getSchemaTpl('status')
        ])
      },
      {
        title: 'Appearance',
        className: 'p-none',
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('theme:base', {
            collapsed: false,
            extra: []
          }),
          {
            title: 'Layout',
            body: [
              getSchemaTpl('layout:originPosition'),
              getSchemaTpl('layout:inset', {
                mode: 'vertical'
              }),

              // Free containers do not require display related configuration items
              ...(!isFreeContainer ? displayTpl : []),

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
                      label: isFlexColumnItem ? 'Fixed height' : 'Fixed width',
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
              !isFlexItem && !isFreeContainer
                ? getSchemaTpl('layout:textAlign', {
                    name: 'style.textAlign',
                    label: 'Internal alignment',
                    visibleOn:
                      'this.style && this.style.display !== "flex" && this.style.display !== "inline-flex"'
                  })
                : null,
              getSchemaTpl('layout:z-index'),
              getSchemaTpl('layout:sticky', {
                visibleOn:
                  'this.style && (this.style.position !== "fixed" && this.style.position !== "absolute")'
              }),
              getSchemaTpl('layout:stickyPosition')
            ]
          },
          {
            title: 'Custom style',
            body: [
              {
                type: 'theme-cssCode',
                label: false
              }
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
    ]);
  };
}

registerEditorPlugin(SwitchContainerPlugin);

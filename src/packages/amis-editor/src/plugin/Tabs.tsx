import React from 'react';
import {getI18nEnabled, registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {
  BaseEventContext,
  BasePlugin,
  BasicToolbarItem,
  PluginEvent,
  PreventClickEventContext,
  RegionConfig,
  RendererInfo,
  VRendererConfig
} from '@/packages/amis-editor-core/src';
import {defaultValue, getSchemaTpl} from '@/packages/amis-editor-core/src';
import {mapReactElement} from '@/packages/amis-editor-core/src';
import {VRenderer} from '@/packages/amis-editor-core/src';
import findIndex from 'lodash/findIndex';
import {RegionWrapper as Region} from '@/packages/amis-editor-core/src';
import {Tab} from '@/packages/amis/src';
import {tipedLabel} from '@/packages/amis-editor-core/src';
import {
  buildLinkActionDesc,
  getArgsWrapper,
  getEventControlConfig
} from '../renderer/event-control/helper';

export class TabsPlugin extends BasePlugin {
  static id = 'TabsPlugin';
  // Associated renderer name
  rendererName = 'tabs';
  $schema = '/schemas/TabsSchema.json';

  // Component name
  name = 'tab';
  isBaseComponent = true;
  description =
    'Tabs can group content and display it in the form of tabs to reduce user usage costs.';
  docLink = '/amis/zh-CN/components/tabs';
  tags = ['layout container'];
  icon = 'fa fa-folder-o';
  pluginIcon = 'tabs-plugin';
  scaffold = {
    type: 'tabs',
    tabs: [
      {
        title: 'Tab 1',
        body: []
      },
      {
        title: 'Tab 2',
        body: []
      }
    ],
    mountOnEnter: true,
    themeCss: {
      titleControlClassName: {
        'font:default': {
          'text-align': 'center'
        }
      }
    }
  };
  previewSchema = {
    ...this.scaffold
  };

  notRenderFormZone = true;

  regions: Array<RegionConfig> = [
    {
      key: 'toolbar',
      label: 'Toolbar',
      preferTag: 'display'
    }
  ];

  panelTitle = 'Tabs';

  events = [
    {
      eventName: 'change',
      eventLabel: 'Tab switch',
      description: 'Tab switching',
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
                  title: 'Tab Index'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'delete',
      eventLabel: 'Tab deleted',
      description: 'Tab deletion',
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
                  title: 'Tab Index'
                }
              }
            }
          }
        }
      ]
    }
  ];

  actions = [
    {
      actionType: 'changeActiveKey',
      actionLabel: 'Activate the specified tab',
      description: 'Modify the currently active tab item',
      config: ['activeKey'],
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            activation
            {buildLinkActionDesc(props.manager, info)}第
            <span className="variable-left variable-right">
              {info?.args?.activeKey}
            </span>
            item
          </div>
        );
      },
      schema: getArgsWrapper(
        getSchemaTpl('formulaControl', {
          name: 'activeKey',
          label: 'Activate item',
          variables: '${variables}',
          size: 'lg',
          mode: 'horizontal',
          horizontal: {
            left: 'normal'
          }
        })
      )
    },
    {
      actionType: 'deleteTab',
      actionLabel: 'Delete the specified tab',
      description: 'Delete the tab item of the specified hash',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div>
            delete
            {buildLinkActionDesc(props.manager, info)}
            hash
            <span className="variable-left variable-right">
              {info?.args?.deleteHash}
            </span>
            Tab item
          </div>
        );
      },
      schema: getArgsWrapper(
        getSchemaTpl('formulaControl', {
          name: 'deleteHash',
          label: 'Delete item',
          variables: '${variables}',
          size: 'lg',
          mode: 'horizontal',
          placeholder: 'Please enter the hash value',
          horizontal: {
            left: 'normal'
          }
        })
      )
    }
  ];

  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    const isNewTabMode =
      'this.tabsMode !=="vertical" && this.tabsMode !=="sidebar" && this.tabsMode !=="chrome"';

    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              getSchemaTpl('combo-container', {
                type: 'combo',
                label: 'tab',
                mode: 'normal',
                name: 'tabs',
                draggableTip: '',
                draggable: true,
                multiple: true,
                minLength: 1,
                scaffold: {
                  title: 'Tab',
                  body: [
                    {
                      type: 'tpl',
                      tpl: 'content',
                      inline: false
                    }
                  ]
                },
                items: [
                  getSchemaTpl('title', {
                    label: false,
                    required: true
                  })
                ]
              }),

              getSchemaTpl('switch', {
                name: 'showTip',
                label: tipedLabel(
                  'Title Tip',
                  'When the mouse moves to the tab title, a pop-up prompt will appear. This is suitable for providing a complete prompt when the title is too long.'
                ),
                visibleOn: isNewTabMode,
                clearValueOnHidden: true
              }),

              {
                label: tipedLabel(
                  'Initial tab',
                  'The tab activated when the component is initialized has a higher priority than the activated tab. It cannot respond to context data. When the tab is configured with hash, use the hash, otherwise use the index value. It supports obtaining variables, such as: <code>tab\\${id}</code>, <code>\\${id}</code>'
                ),
                type: 'input-text',
                name: 'defaultKey',
                placeholder: 'The initial default activated tab',
                pipeOut: (data: string) =>
                  data === '' || isNaN(Number(data)) ? data : Number(data)
              },

              {
                label: tipedLabel(
                  'Active tab',
                  'Display a tab by default, which can respond to context data. When the tab is configured with hash, use the hash, otherwise use the index value. It supports getting variables, such as: <code>tab\\${id}</code>, <code>\\${id}</code>'
                ),
                type: 'input-text',
                name: 'activeKey',
                placeholder: 'Default active tab',
                pipeOut: (data: string) =>
                  data === '' || isNaN(Number(data)) ? data : Number(data)
              },
              getSchemaTpl('closable')
            ]
          },
          getSchemaTpl('status'),
          {
            title: 'Advanced',
            body: [
              getSchemaTpl('sourceBindControl', {
                label: tipedLabel(
                  'Linked Data',
                  'Dynamically re-render the configured tabs based on this data'
                )
              }),
              getSchemaTpl('switch', {
                name: 'mountOnEnter',
                label: tipedLabel(
                  'Render content when activated',
                  'Content rendering is only performed when the tab is activated, improving rendering performance'
                )
              }),
              getSchemaTpl('switch', {
                name: 'unmountOnExit',
                label: tipedLabel(
                  'Destroy content after hiding',
                  'When activating other tabs, the current content is destroyed so that the content can be re-rendered when it is activated again. It is suitable for scenarios where the data container needs to obtain data in real time every time it is rendered.'
                )
              })
            ]
          }
        ])
      },
      {
        title: 'Appearance',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              title: 'Basic',
              body: [
                {
                  name: 'tabsMode',
                  label: 'Display format',
                  type: 'select',
                  options: [
                    {
                      label: 'Default',
                      value: ''
                    },
                    {
                      label: 'Line type',
                      value: 'line'
                    },
                    {
                      label: 'Simple',
                      value: 'simple'
                    },
                    {
                      label: 'Strengthen',
                      value: 'strong'
                    },
                    {
                      label: 'Card',
                      value: 'card'
                    },
                    {
                      label: 'Chrome-like',
                      value: 'chrome'
                    },
                    {
                      label: 'Horizontal full',
                      value: 'tiled'
                    },
                    {
                      label: 'Selector',
                      value: 'radio'
                    },
                    {
                      label: 'vertical',
                      value: 'vertical'
                    },
                    {
                      label: 'Sidebar',
                      value: 'sidebar'
                    }
                  ],
                  pipeIn: defaultValue('')
                },

                getSchemaTpl('horizontal-align', {
                  label: 'Title area position',
                  name: 'sidePosition',
                  pipeIn: defaultValue('left'),
                  visibleOn: 'this.tabsMode === "sidebar"',
                  clearValueOnHidden: true
                })
              ]
            },
            getSchemaTpl('theme:base', {
              classname: 'titleControlClassName',
              title: 'Title style',
              hidePaddingAndMargin: true,
              hideRadius: true,
              hideShadow: true,
              hideBorder: true,
              hideBackground: true,
              state: ['default', 'hover', 'focused', 'disabled'],
              extra: [
                getSchemaTpl('theme:select', {
                  label: 'width',
                  name: 'themeCss.titleControlClassName.width'
                }),
                getSchemaTpl('theme:font', {
                  label: 'character',
                  name: 'themeCss.titleControlClassName.font'
                })
              ]
            }),
            getSchemaTpl('theme:base', {
              classname: 'toolbarControlClassName',
              title: 'Toolbar style'
            }),
            getSchemaTpl('theme:base', {
              classname: 'contentControlClassName',
              title: 'Content area style'
            }),
            getSchemaTpl('theme:singleCssCode', {
              selectors: [
                {
                  label: 'Basic style of tabs',
                  isRoot: true,
                  selector: '.cxd-Tabs'
                },
                {
                  label: 'Tab toolbar style',
                  selector: '.cxd-Tabs-toolbar'
                },
                {
                  label: 'tab title style',
                  selector: '.cxd-Tabs-link'
                },
                {
                  label: 'Tab content area style',
                  selector: '.cxd-Tabs-content'
                }
              ]
            })
          ])
        ]
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

  patchContainers = ['tabs.body'];

  vRendererConfig: VRendererConfig = {
    regions: {
      body: {
        key: 'body',
        label: 'Content area'
      }
    },
    panelTitle: 'Card',
    panelJustify: true,
    panelBodyCreator: (context: BaseEventContext) => {
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
                  label: 'Title',
                  type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                  required: true
                },

                {
                  type: 'ae-switch-more',
                  formType: 'extend',
                  mode: 'normal',
                  label: 'title icon',
                  form: {
                    body: [
                      getSchemaTpl('icon'),

                      getSchemaTpl('horizontal-align', {
                        label: 'Location',
                        name: 'iconPosition',
                        pipeIn: defaultValue('left'),
                        visibleOn: 'this.icon',
                        clearValueOnHidden: true
                      })
                    ]
                  }
                },
                getSchemaTpl('closable'),
                {
                  label: tipedLabel(
                    'Hash',
                    'After setting, the hash of the address bar will be updated synchronously.'
                  ),
                  name: 'hash',
                  type: 'input-text'
                }
              ]
            },
            getSchemaTpl('status', {disabled: true}),
            {
              title: 'Advanced',
              body: [
                getSchemaTpl('switch', {
                  name: 'mountOnEnter',
                  label: tipedLabel(
                    'Render only when activated',
                    'Rendering the content area of ​​a tab only after it is selected can improve rendering performance.'
                  ),
                  visibleOn: '!this.reload',
                  clearValueOnHidden: true
                }),

                getSchemaTpl('switch', {
                  name: 'unmountOnExit',
                  label: tipedLabel(
                    'Hide and destroy',
                    'Closing a tab destroys its contents. Configuring the "Render when activated" option allows the content to be reloaded each time it is selected.'
                  ),
                  visibleOn: '!this.reload',
                  clearValueOnHidden: true
                })
              ]
            }
          ])
        },
        {
          title: 'Appearance',
          body: getSchemaTpl('collapseGroup', [
            getSchemaTpl('theme:base', {
              classname: 'panelControlClassName',
              title: 'Basic style'
            })
          ])
        }
      ]);
    }
  };

  wrapperProps = {
    unmountOnExit: true,
    mountOnEnter: true
  };

  tabWrapperResolve = (dom: HTMLElement) => dom.parentElement!;
  overrides = {
    renderTabs(this: any) {
      const dom = this.super();

      if (!this.renderTab && this.props.$$editor && dom) {
        const tabs = this.props.tabs;
        return mapReactElement(dom, item => {
          if (item.type === Tab && item.props.$$id) {
            const id = item.props.$$id;
            const index = findIndex(tabs, (tab: any) => tab.$$id === id);
            const info: RendererInfo = this.props.$$editor;
            const plugin: TabsPlugin = info.plugin as any;

            if (~index) {
              const region = plugin.vRendererConfig?.regions?.body;

              if (!region) {
                return item;
              }

              return React.cloneElement(item, {
                children: (
                  <VRenderer
                    key={id}
                    type={info.type}
                    plugin={info.plugin}
                    renderer={info.renderer}
                    $schema="/schemas/TabSchema.json"
                    hostId={info.id}
                    memberIndex={index}
                    name={`${item.props.title || `Card${index + 1}`}`}
                    id={id}
                    draggable={false}
                    wrapperResolve={plugin.tabWrapperResolve}
                    schemaPath={`${info.schemaPath}/tabs/${index}`}
                    path={`${this.props.$path}/${index}`} // seems useless
                    data={this.props.data} // seems useless
                  >
                    <Region
                      key={region.key}
                      preferTag={region.preferTag}
                      name={region.key}
                      label={region.label}
                      regionConfig={region}
                      placeholder={region.placeholder}
                      editorStore={plugin.manager.store}
                      manager={plugin.manager}
                      children={item.props.children}
                      wrapperResolve={region.wrapperResolve}
                      rendererName={info.renderer.name}
                    />
                  </VRenderer>
                )
              });
            }
          }

          return item;
        });
      }

      return dom;
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
      context.info.renderer.name === 'tabs' &&
      !context.info.hostId
    ) {
      const node = context.node;

      toolbars.push({
        level: 'secondary',
        icon: 'fa fa-chevron-left',
        tooltip: 'Previous card',
        onClick: () => {
          const control = node.getComponent();

          if (control?.switchTo) {
            const currentIndex = control.currentIndex();
            control.switchTo(currentIndex - 1);
          }
        }
      });

      toolbars.push({
        level: 'secondary',
        icon: 'fa fa-chevron-right',
        tooltip: 'Next card',
        onClick: () => {
          const control = node.getComponent();

          if (control?.switchTo) {
            const currentIndex = control.currentIndex();
            control.switchTo(currentIndex + 1);
          }
        }
      });
    }
  }

  onPreventClick(e: PluginEvent<PreventClickEventContext>) {
    const mouseEvent = e.context.data;

    if (mouseEvent.defaultPrevented) {
      return false;
    } else if (
      (mouseEvent.target as HTMLElement).closest('[role=tablist]>li')
    ) {
      return false;
    }

    return;
  }
}

registerEditorPlugin(TabsPlugin);

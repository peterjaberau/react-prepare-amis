import {render} from 'amis';
import React from 'react';
import {TooltipWrapper} from 'amis-ui';
import {
  registerEditorPlugin,
  BasePlugin,
  BaseEventContext,
  getSchemaTpl,
  RendererPluginEvent,
  RendererPluginAction,
  tipedLabel
} from 'amis-editor-core';
import {
  getEventControlConfig,
  getActionCommonProps,
  buildLinkActionDesc
} from '../renderer/event-control/helper';

export class NavPlugin extends BasePlugin {
  static id = 'NavPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'hub';
  $schema = '/schemas/NavSchema.json';

  // Component name
  name = 'Navigation';
  isBaseComponent = true;
  description =
    'Used to render the navigation menu, supports horizontal and vertical layout.';
  docLink = '/amis/zh-CN/components/nav';
  tags = ['function'];
  icon = 'fa fa-map-signs';
  pluginIcon = 'nav-plugin';
  scaffold = {
    type: 'nav',
    stacked: true,
    popupClassName: 'app-popover :AMISCSSWrapper',
    links: [
      {
        label: 'Page 1',
        to: '?id=1',
        target: '_self',
        id: '0'
      },
      {
        label: 'Page 2',
        to: '?id=2',
        target: '_self',
        id: '1'
      }
    ]
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = 'Navigation';

  panelDefinitions = {
    links: {
      label: 'Menu Management',
      name: 'links',
      type: 'combo',
      multiple: true,
      draggable: true,
      addButtonText: 'Add new menu',
      multiLine: true,
      messages: {
        validateFailed:
          'There is a configuration error in the menu, please check carefully'
      },
      scaffold: {
        label: '',
        to: ''
      },
      items: [
        getSchemaTpl('label', {
          label: 'name',
          required: true
        }),

        {
          type: 'input-text',
          name: 'to',
          label: 'jump address',
          required: true
        },
        getSchemaTpl('switch', {
          label: 'Whether to open a new page',
          name: 'target',
          pipeIn: (value: any) => value === '_parent',
          pipeOut: (value: any) => (value ? '_parent' : '_blank')
        }),
        getSchemaTpl('icon', {
          name: 'icon',
          label: 'icon'
        }),
        getSchemaTpl('switch', {
          label: 'Whether to expand initially',
          name: 'unfolded'
        }),
        {
          type: 'group',
          label: 'Is it highlighted',
          direction: 'vertical',
          className: 'm-b-none',
          labelRemark: {
            trigger: 'click',
            rootClose: true,
            className: 'm-l-xs',
            content: 'You can configure whether the menu should be highlighted',
            placement: 'left'
          },
          body: [
            {
              name: 'active',
              type: 'radios',
              inline: true,
              // pipeIn: (value:any) => typeof value === 'boolean' ? value : '1'
              options: [
                {
                  label: 'Yes',
                  value: true
                },

                {
                  label: 'No',
                  value: false
                },

                {
                  label: 'expression',
                  value: ''
                }
              ]
            },

            {
              name: 'activeOn',
              autoComplete: false,
              visibleOn: 'typeof this.active !== "boolean"',
              type: 'input-text',
              placeholder:
                'Leave it blank to automatically analyze the menu address',
              className: 'm-t-n-sm'
            }
          ]
        },
        getSchemaTpl('switch', {
          label: 'Contains submenus',
          name: 'children',
          pipeIn: (value: any) => !!value,
          pipeOut: (value: any) => (value ? [{label: '', to: ''}] : undefined),
          messages: {
            validateFailed:
              'There is a configuration error in the submenu, please check carefully'
          }
        }),
        {
          name: 'children',
          $ref: 'links',
          visibleOn: 'this.children',
          label: 'Submenu Management',
          addButtonText: 'Add a new submenu'
        }
      ]
    }
  };

  // Event definition
  events: RendererPluginEvent[] = [
    {
      eventName: 'click',
      eventLabel: 'Menu click',
      description: 'Triggered when the menu is clicked',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              description:
                'The current data domain, you can read the corresponding value through the field name'
            }
          }
        }
      ]
    },
    {
      eventName: 'change',
      eventLabel: 'Menu selected',
      description: 'Triggered when the menu is selected',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data'
            }
          }
        }
      ]
    },
    {
      eventName: 'toggled',
      eventLabel: 'Menu expansion',
      description: 'Triggered when the menu is expanded',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data'
            }
          }
        }
      ]
    },
    {
      eventName: 'collapsed',
      eventLabel: 'Menu collapse',
      description: 'Triggered when the menu is collapsed',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data'
            }
          }
        }
      ]
    },
    {
      eventName: 'loaded',
      eventLabel: 'Data loading completed',
      description: 'Triggered after data loading is complete',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data'
            }
          }
        }
      ]
    }
  ];

  //Action definition
  actions: RendererPluginAction[] = [
    {
      actionType: 'updateItems',
      actionLabel: 'Update menu item',
      description: 'Trigger component update menu item',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            renew
            {buildLinkActionDesc(props.manager, info)}
            Menu Items
          </div>
        );
      }
    },
    {
      actionType: 'collapse',
      actionLabel: 'Menu Collapse',
      description: 'Trigger the folding and expanding of components',
      ...getActionCommonProps('collapse')
    },
    {
      actionType: 'reload',
      actionLabel: 'Reload',
      description: 'Trigger component data refresh and re-rendering',
      ...getActionCommonProps('reload')
    }
  ];

  panelBodyCreator = (context: BaseEventContext) => {
    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              getSchemaTpl('switch', {
                name: 'stacked',
                label: 'horizontally placed',
                pipeIn: (value: boolean) => !value,
                pipeOut: (value: boolean) => !value
              }),
              getSchemaTpl('switch', {
                name: 'mode',
                label: [
                  {
                    children: (
                      <TooltipWrapper
                        tooltipClassName="ae-nav-tooltip-wrapper"
                        trigger="hover"
                        rootClose={true}
                        placement="top"
                        tooltipTheme="dark"
                        style={{
                          fontSize: '12px'
                        }}
                        tooltip={{
                          children: () => (
                            <div>
                              <span>
                                The default mode is inline. When it is turned
                                on, the submenu will not expand below the parent
                                menu, but will be displayed floating on the side
                                of the menu.
                              </span>
                              <div className="nav-mode-gif" />
                            </div>
                          )
                        }}
                      >
                        <span>Submenu floating display</span>
                      </TooltipWrapper>
                    )
                  }
                ],
                visibleOn: 'this.stacked',
                pipeIn: (value: any) => value === 'float',
                pipeOut: (value: boolean) => (value ? 'float' : 'inline')
              }),
              getSchemaTpl('switch', {
                label: tipedLabel(
                  'Accordion mode',
                  'Click on the menu to expand only the current parent menu and collapse other expanded menus'
                ),
                visibleOn: 'this.stacked && this.mode !== "float"',
                name: 'accordion'
              }),
              {
                type: 'input-number',
                name: 'defaultOpenLevel',
                label: tipedLabel(
                  'Default expansion level',
                  'Default expansion level for all menus'
                ),
                visibleOn: 'this.stacked && this.mode !== "float"',
                mode: 'horizontal',
                labelAlign: 'left'
              },
              {
                type: 'input-number',
                name: 'level',
                label: tipedLabel(
                  'Maximum display level',
                  'After configuration, menu items above this level will be hidden. For example, if the maximum display level is two, menu items at level three and below will be hidden.'
                ),
                mode: 'horizontal',
                labelAlign: 'left'
              }
            ]
          },
          {
            title: 'Menu Item',
            body: [
              getSchemaTpl('navControl'),
              // Corner mark
              getSchemaTpl('nav-badge', {
                visibleOn: 'this.links'
              })
              //Default selected menu
              // getSchemaTpl('nav-default-active', {
              //   visibleOn: 'this.links'
              // })
            ]
          },
          // {
          // title: 'Advanced',
          //   body: [
          //     getSchemaTpl('switch', {
          //       name: 'draggable',
          // label: 'Drag and drop to sort',
          //       visibleOn:
          //         'this.source && this.source !== "${amisStore.app.portalNav}"'
          //     }),
          //     getSchemaTpl('switch', {
          //       name: 'dragOnSameLevel',
          // label: 'Only same level drag',
          //       visibleOn: 'this.draggable'
          //     }),
          //     getSchemaTpl('apiControl', {
          //       name: 'saveOrderApi',
          // label: 'Save sorting interface',
          //       mode: 'normal',
          //       visibleOn:
          //         'this.source && this.source !== "${amisStore.app.portalNav}"'
          //     })
          //   ]
          // },
          {
            title: 'Status',
            body: [getSchemaTpl('visible'), getSchemaTpl('hidden')]
          }
        ])
      },
      {
        title: 'Appearance',
        body: getSchemaTpl(
          'collapseGroup',
          getSchemaTpl('style:common', ['layout'])
        )
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

registerEditorPlugin(NavPlugin);

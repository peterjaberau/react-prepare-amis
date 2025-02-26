import React from 'react';
import {
  RendererPluginAction,
  RendererPluginEvent,
  getI18nEnabled,
  registerEditorPlugin,
  BasePlugin,
  RegionConfig,
  BaseEventContext,
  defaultValue,
  getSchemaTpl
} from 'amis-editor-core';
import {
  buildLinkActionDesc,
  getEventControlConfig
} from '../renderer/event-control/helper';
import {getActionCommonProps} from '../renderer/event-control/helper';
import {generateId} from '../util';

export class CollapsePlugin extends BasePlugin {
  static id = 'CollapsePlugin';
  // Associated renderer name
  rendererName = 'collapse';
  $schema = '/schemas/CollapseSchema.json';

  // Component name
  name = 'Folder';
  isBaseComponent = true;
  description =
    'The folder can expand or hide the content area to keep the page tidy';
  docLink = '/amis/zh-CN/components/collapse';
  tags = ['show'];
  icon = 'fa fa-window-minimize';
  pluginIcon = 'collapse-plugin';
  scaffold = {
    type: 'collapse',
    header: 'Title',
    body: [
      {
        type: 'tpl',
        tpl: 'content',
        wrapperComponent: '',
        inline: false,
        id: generateId()
      }
    ]
  };
  previewSchema = {
    ...this.scaffold
  };
  panelTitle = 'Folder';

  panelJustify = true;

  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: 'Folding state changed',
      description: 'Triggered when the folder folding state changes',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                collapsed: {
                  type: 'boolean',
                  title: 'Folder Status'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'expand',
      eventLabel: 'folder expanded',
      description: 'Triggered when the folder state changes to expanded',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                collapsed: {
                  type: 'boolean',
                  title: 'Folder Status'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'collapse',
      eventLabel: 'Folder collapsed',
      description: 'Triggered when the folder state changes to collapsed',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                collapsed: {
                  type: 'boolean',
                  title: 'Folder Status'
                }
              }
            }
          }
        }
      ]
    }
  ];

  actions: RendererPluginAction[] = [
    {
      actionType: 'expand',
      actionLabel: 'Component expansion',
      description: "The component's collapsed state changes to expanded",
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            Expand
            {buildLinkActionDesc(props.manager, info)}
          </div>
        );
      }
    },
    {
      actionLabel: 'Component Collapse',
      actionType: 'collapse',
      description: 'The component folding state changes to collapsed',
      ...getActionCommonProps('collapse')
    }
  ];

  panelBodyCreator = (context: BaseEventContext) => {
    const i18nEnabled = getI18nEnabled();
    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              getSchemaTpl('title', {
                name: 'header',
                label: 'Title',
                pipeIn: defaultValue(
                  context?.schema?.title || context?.schema?.header || ''
                ),
                onChange: (
                  value: any,
                  oldValue: any,
                  model: any,
                  form: any
                ) => {
                  // Convert the title field of the old version
                  form.setValueByName('header', value);
                  form.setValueByName('title', undefined);
                }
              }),
              getSchemaTpl('collapseOpenHeader'),
              {
                name: 'headerPosition',
                label: 'Title position',
                type: 'button-group-select',
                size: 'sm',
                pipeIn: defaultValue('top'),
                options: [
                  {
                    label: 'Top',
                    value: 'top',
                    icon: 'fa fa-arrow-up'
                  },
                  {
                    label: 'Bottom',
                    value: 'bottom',
                    icon: 'fa fa-arrow-down'
                  }
                ]
              },
              {
                name: 'showArrow',
                label: 'Display icon',
                mode: 'row',
                inputClassName: 'inline-flex justify-between flex-row-reverse',
                type: 'switch',
                pipeIn: defaultValue(true)
              },

              getSchemaTpl('switch', {
                name: 'collapsable',
                label: 'Foldable',
                pipeIn: defaultValue(true)
              })
            ]
          },
          getSchemaTpl('status', {
            disabled: true
          })
        ])
      },
      {
        title: 'Appearance',
        body: getSchemaTpl('collapseGroup', [
          ...getSchemaTpl('theme:common', {
            exclude: ['layout'],
            hideAnimation: true,
            classname: 'baseControlClassName',
            needState: false,
            baseTitle: 'Basic style',
            extra: [
              getSchemaTpl('theme:base', {
                classname: 'headerControlClassName',
                title: 'Title area style',
                state: ['default', 'hover'],
                extra: [
                  getSchemaTpl('theme:font', {
                    label: 'character',
                    name: 'themeCss.headerControlClassName.font'
                  })
                ]
              }),
              getSchemaTpl('theme:base', {
                classname: 'bodyControlClassName',
                needState: false,
                title: 'Content area style'
              })
            ]
          }),
          getSchemaTpl('style:classNames', {
            isFormItem: false,
            schema: [
              getSchemaTpl('className', {
                name: 'headingClassName',
                label: 'Title class name'
              }),
              getSchemaTpl('className', {
                name: 'bodyClassName',
                label: 'Content category name'
              })
            ]
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

  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: 'Content area'
    }
  ];
}

registerEditorPlugin(CollapsePlugin);

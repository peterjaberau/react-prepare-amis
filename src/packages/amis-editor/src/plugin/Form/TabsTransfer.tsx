import React from 'react';
import {
  EditorManager,
  EditorNodeType,
  getSchemaTpl,
  tipedLabel,
  BasePlugin,
  BaseEventContext,
  registerEditorPlugin,
  RendererPluginAction,
  RendererPluginEvent
} from 'amis-editor-core';
import {
  getEventControlConfig,
  getActionCommonProps,
  buildLinkActionDesc
} from '../../renderer/event-control/helper';
import {resolveOptionEventDataSchame, resolveOptionType} from '../../util';

export class TabsTransferPlugin extends BasePlugin {
  static id = 'TabsTransferPlugin';
  // Associated renderer name
  rendererName = 'tabs-transfer';
  $schema = '/schemas/TransferControlSchema.json';

  // Component name
  name = 'Combined Shuttle';
  isBaseComponent = true;
  icon = 'fa fa-th-list';
  pluginIcon = 'tabs-transfer-plugin';
  description = 'Combined Shuttle Components';
  docLink = '/amis/zh-CN/components/form/transfer';
  tags = ['form item'];
  scaffold = {
    label: 'Combined Shuttle',
    type: 'tabs-transfer',
    name: 'tabsTransfer',
    selectMode: 'tree',
    options: [
      {
        label: 'Member',
        children: [
          {
            label: 'Mage',
            value: 'fashi',
            children: [
              {
                label: 'Zhuge Liang',
                value: 'zhugeliang'
              }
            ]
          },
          {
            label: 'Warrior',
            value: 'zhanshi',
            children: [
              {
                label: 'Cao Cao',
                value: 'caocao'
              },
              {
                label: 'Zhong Wuyan',
                value: 'zhongwuyan'
              }
            ]
          },
          {
            label: 'Jungle',
            value: 'daye',
            children: [
              {
                label: 'Li Bai',
                value: 'libai'
              },
              {
                label: 'Han Xin',
                value: 'hanxin'
              },
              {
                label: 'Mr. Yunzhong',
                value: 'yunzhongjun'
              }
            ]
          }
        ]
      },
      {
        label: 'User',
        children: [
          {
            label: 'Mage',
            value: 'fashi2',
            children: [
              {
                label: 'Zhuge Liang',
                value: 'zhugeliang2'
              }
            ]
          },
          {
            label: 'Warrior',
            value: 'zhanshi2',
            children: [
              {
                label: 'Cao Cao',
                value: 'caocao2'
              },
              {
                label: 'Zhong Wuyan',
                value: 'zhongwuyan2'
              }
            ]
          },
          {
            label: 'Jungle',
            value: 'daye2',
            children: [
              {
                label: 'Li Bai',
                value: 'libai2'
              },
              {
                label: 'Han Xin',
                value: 'hanxin2'
              },
              {
                label: 'Mr. Yunzhong',
                value: 'yunzhongjun2'
              }
            ]
          }
        ]
      }
    ]
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold
      }
    ]
  };

  panelTitle = 'Combination Shuttle';

  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: 'value change',
      description: 'Triggered when the selected value changes',
      dataSchema: (manager: EditorManager) => {
        const {value, items} = resolveOptionEventDataSchame(manager, true);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  value,
                  items
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'tab-change',
      eventLabel: 'Tab switch',
      description: 'Triggered when tab is switched',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                key: {
                  type: 'string',
                  title: 'Activated Index'
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
      actionType: 'clear',
      actionLabel: 'Clear',
      description: 'Clear selected content',
      ...getActionCommonProps('clear')
    },
    {
      actionType: 'reset',
      actionLabel: 'Reset',
      description: 'Reset selected content',
      ...getActionCommonProps('reset')
    },
    {
      actionType: 'changeTabKey',
      actionLabel: 'Modify the selected tab',
      description: 'Modify the currently selected tab to select other options',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            Revise
            {buildLinkActionDesc(props.manager, info)}
            Select the tab
          </div>
        );
      }
    },
    {
      actionType: 'setValue',
      actionLabel: 'Assignment',
      description: 'Trigger component data update',
      ...getActionCommonProps('setValue')
    }
  ];

  notRenderFormZone = true;

  panelJustify = true;

  panelDefinitions = {
    options: {
      label: 'Options',
      name: 'options',
      type: 'combo',
      multiple: true,
      multiLine: true,
      draggable: true,
      mode: 'normal',
      addButtonText: 'Add new option',
      scaffold: {
        label: '',
        value: ''
      },
      items: [
        {
          type: 'group',
          body: [
            getSchemaTpl('label', {
              label: false,
              placeholder: 'name',
              required: true
            }),

            {
              type: 'input-text',
              name: 'value',
              placeholder: 'value',
              unique: true
            }
          ]
        },
        {
          $ref: 'options',
          label: 'Suboption',
          name: 'children',
          addButtonText: 'Add a new sub-option'
        }
      ]
    }
  };

  // notRenderFormZone = true;

  panelBodyCreator = (context: BaseEventContext) => {
    const renderer: any = context.info.renderer;

    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              getSchemaTpl('formItemName', {
                required: true
              }),
              getSchemaTpl('label'),
              {
                label: 'Left option display',
                name: 'selectMode',
                type: 'select',
                value: 'tree',
                options: [
                  {
                    label: 'List form',
                    value: 'list'
                  },
                  {
                    label: 'Table format',
                    value: 'table'
                  },
                  {
                    label: 'Tree selection form',
                    value: 'tree'
                  },
                  {
                    label: 'Cascade selection form',
                    value: 'chained'
                  }
                ]
              },
              {
                label: 'right result title',
                name: 'resultTitle',
                type: 'input-text',
                inputClassName: 'is-inline ',
                placeholder: 'Selected'
              },
              getSchemaTpl('sortable'),
              getSchemaTpl('searchable', {
                onChange: (value: any, origin: any, item: any, form: any) => {
                  if (!value) {
                    form.setValues({
                      searchApi: undefined
                    });
                  }
                }
              }),

              getSchemaTpl('apiControl', {
                label: tipedLabel(
                  'Retrieval interface',
                  'You can get the search results through the interface, and the search value can be obtained through the variable \\${term}, such as: "https://xxx/search?name=\\${term}"'
                ),
                mode: 'normal',
                name: 'searchApi',
                visibleOn: '!!searchable'
              })
            ]
          },
          {
            title: 'Options',
            body: [
              {
                $ref: 'options',
                name: 'options'
              },
              getSchemaTpl('apiControl', {
                label: tipedLabel(
                  'Get options interface',
                  'You can get dynamic options through the interface and pull them all at once'
                ),
                mode: 'normal',
                name: 'source'
              }),
              getSchemaTpl(
                'loadingConfig',
                {
                  visibleOn: 'this.source || !this.options'
                },
                {context}
              ),
              getSchemaTpl('joinValues'),
              getSchemaTpl('delimiter'),
              getSchemaTpl('extractValue')
              // getSchemaTpl('autoFillApi', {
              //   visibleOn:
              //     '!this.autoFill || this.autoFill.scene && this.autoFill.action'
              // })
            ]
          },
          {
            title: 'Advanced',
            body: [
              getSchemaTpl('virtualThreshold'),
              getSchemaTpl('virtualItemHeight')
            ]
          },
          getSchemaTpl('status', {isFormItem: true})
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

  buildDataSchemas(node: EditorNodeType, region: EditorNodeType) {
    const type = resolveOptionType(node.schema);
    // todo: asynchronous data case
    let dataSchema: any = {
      type,
      title: node.schema?.label || node.schema?.name,
      originalValue: node.schema?.value // Record the original value, required for circular reference detection
    };

    if (node.schema?.extractValue) {
      dataSchema = {
        type: 'array',
        title: node.schema?.label || node.schema?.name
      };
    } else if (node.schema?.joinValues === false) {
      dataSchema = {
        type: 'array',
        title: node.schema?.label || node.schema?.name,
        items: {
          type: 'object',
          title: 'Member',
          properties: {
            [node.schema?.labelField || 'label']: {
              type: 'string',
              title: 'text'
            },
            [node.schema?.valueField || 'value']: {
              type,
              title: 'value'
            }
          }
        },
        originalValue: dataSchema.originalValue
      };
    }

    return dataSchema;
  }
}

registerEditorPlugin(TabsTransferPlugin);

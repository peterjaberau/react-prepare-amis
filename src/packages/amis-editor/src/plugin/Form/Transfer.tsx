import {
  EditorManager,
  EditorNodeType,
  defaultValue,
  getSchemaTpl,
  BasePlugin,
  BaseEventContext,
  registerEditorPlugin,
  tipedLabel,
  RendererPluginAction,
  RendererPluginEvent,
  undefinedPipeOut
} from '@/packages/amis-editor-core/src';
import type {Schema} from '@/packages/src';
import {getEventControlConfig} from '../../renderer/event-control/helper';
import {ValidatorTag} from '../../validator';
import {resolveOptionEventDataSchame, resolveOptionType} from '../../util';
import {getActionCommonProps} from '../../renderer/event-control/helper';

export class TransferPlugin extends BasePlugin {
  static id = 'TransferPlugin';
  // Associated renderer name
  rendererName = 'transfer';
  $schema = '/schemas/TransferControlSchema.json';

  // Component name
  name = 'Shuttle';
  isBaseComponent = true;
  icon = 'fa fa-th-list';
  pluginIcon = 'transfer-plugin';
  description = 'Shuttle Components';
  docLink = '/amis/zh-CN/components/form/transfer';
  tags = ['form item'];
  scaffold = {
    label: 'Grouping',
    type: 'transfer',
    name: 'transfer',
    options: [
      {
        label: 'Zhuge Liang',
        value: 'zhugeliang'
      },
      {
        label: 'Cao Cao',
        value: 'caocao'
      }
    ],
    selectMode: 'list',
    resultListModeFollowSelect: false
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

  panelTitle = 'Shuttle';

  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: 'value change',
      description: 'Triggered when the input box loses focus',
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
      eventName: 'selectAll',
      eventLabel: 'Select All',
      description: 'Select all options',
      dataSchema: (manager: EditorManager) => {
        const {items} = resolveOptionEventDataSchame(manager, true);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  items
                }
              }
            }
          }
        ];
      }
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
      actionType: 'selectAll',
      actionLabel: 'Select All',
      description: 'Select all options',
      ...getActionCommonProps('selectAll')
    },
    {
      actionType: 'setValue',
      actionLabel: 'Assignment',
      description:
        'Trigger component data update, multiple values ​​are separated by ","',
      ...getActionCommonProps('setValue')
    }
  ];

  panelDefinitions = {
    options: {
      label: 'Options',
      name: 'options',
      type: 'combo',
      multiple: true,
      multiLine: true,
      draggable: true,
      addButtonText: 'Add new option',
      scaffold: {
        label: '',
        value: ''
      },
      items: [
        {
          type: 'group',
          body: [
            getSchemaTpl('optionsLabel'),
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

  notRenderFormZone = true;

  panelJustify = true;

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
              getSchemaTpl('valueFormula', {
                rendererSchema: (schema: Schema) => ({
                  ...schema,
                  type: 'select',
                  multiple: true
                }),
                visibleOn: 'this.options.length > 0'
              }),
              getSchemaTpl('switch', {
                label: 'Statistical data',
                name: 'statistics'
              }),
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('description')
            ]
          },
          {
            title: 'Left Options Panel',
            body: [
              {
                label: 'Display format',
                name: 'selectMode',
                type: 'select',
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
                    label: 'Tree form',
                    value: 'tree'
                  }
                ],
                onChange: (value: any, origin: any, item: any, form: any) => {
                  form.setValues({
                    options: undefined,
                    columns: undefined,
                    value: '',
                    valueTpl: ''
                  });
                  // Mainly solve the problem that directly setting value and valueTpl to undefined does not take effect on the configuration panel, so first set '', then use setTimout to set it to undefined
                  setTimeout(() => {
                    form.setValues({
                      value: undefined,
                      valueTpl: undefined
                    });
                  }, 100);
                }
              },

              getSchemaTpl(
                'loadingConfig',
                {
                  visibleOn: 'this.source || !this.options'
                },
                {context}
              ),
              getSchemaTpl('optionControl', {
                visibleOn: 'this.selectMode === "list"',
                multiple: true
              }),

              {
                type: 'ae-transferTableControl',
                label: 'data',
                visibleOn: 'this.selectMode === "table"',
                mode: 'normal',
                // Custom change function
                onValueChange: (
                  type: 'options' | 'columns',
                  data: any,
                  onBulkChange: Function
                ) => {
                  if (type === 'options') {
                    onBulkChange(data);
                  } else if (type === 'columns') {
                    const columns = data.columns;
                    if (data.columns.length > 0) {
                      data.valueTpl = `\${${columns[0].name}}`;
                    }
                    onBulkChange(data);
                  }
                }
              },

              getSchemaTpl('treeOptionControl', {
                visibleOn: 'this.selectMode === "tree"'
              }),

              getSchemaTpl('switch', {
                label: 'Retrievable',
                name: 'searchable'
              }),
              getSchemaTpl('switch', {
                label: tipedLabel(
                  'Only include the values ​​of child nodes',
                  'Only works when autoCheckChildren=true'
                ),
                value: true,
                name: 'onlyChildren',
                visibleOn: 'this.selectMode === "tree"'
              }),
              getSchemaTpl('switch', {
                label:
                  'Select the parent node and automatically select the child node',
                name: 'autoCheckChildren',
                value: true,
                visibleOn: 'this.selectMode === "tree"'
              }),

              getSchemaTpl('optionsMenuTpl', {
                manager: this.manager,
                onChange: (value: any) => {},
                visibleOn: 'this.selectMode !== "table"'
              }),

              {
                label: 'Title',
                name: 'selectTitle',
                type: 'input-text',
                inputClassName: 'is-inline '
              }
            ]
          },
          {
            title: 'Right result panel',
            body: [
              {
                type: 'button-group-select',
                label: 'Display format',
                name: 'resultListModeFollowSelect',
                inputClassName: 'items-center',
                options: [
                  {label: 'List form', value: false},
                  {label: 'Follow left', value: true}
                ],
                onChange: (value: any, origin: any, item: any, form: any) => {
                  form.setValueByName('sortable', !value ? true : undefined);
                }
              },
              getSchemaTpl('switch', {
                label: tipedLabel(
                  'Searchable',
                  'The query function currently only supports fuzzy matching queries based on names or values'
                ),
                name: 'resultSearchable'
              }),
              getSchemaTpl('sortable', {
                label: 'Support sorting',
                mode: 'horizontal',
                horizontal: {
                  justify: true,
                  left: 8
                },
                inputClassName: 'is-inline',
                visibleOn:
                  'this.selectMode === "list" && !this.resultListModeFollowSelect'
              }),

              getSchemaTpl('optionsMenuTpl', {
                name: 'valueTpl',
                manager: this.manager,
                onChange: (value: any) => {},
                visibleOn:
                  '!(this.selectMode === "table" && this.resultListModeFollowSelect)'
              }),
              {
                label: 'Title',
                name: 'resultTitle',
                type: 'input-text',
                inputClassName: 'is-inline '
              }
            ]
          },
          {
            title: 'Advanced',
            body: [
              getSchemaTpl('virtualThreshold'),
              getSchemaTpl('virtualItemHeight')
            ]
          },
          getSchemaTpl('status', {isFormItem: true}),
          getSchemaTpl('validation', {tag: ValidatorTag.MultiSelect})
        ])
      },
      {
        title: 'Appearance',
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('style:formItem', renderer),
          getSchemaTpl('style:classNames', [
            getSchemaTpl('className', {
              label: 'Description',
              name: 'descriptionClassName',
              visibleOn: 'this.description'
            }),
            getSchemaTpl('className', {
              name: 'addOn.className',
              label: 'AddOn',
              visibleOn: 'this.addOn && this.addOn.type === "text"'
            })
          ]),
          ...(this.rendererName === 'transfer-picker'
            ? [
                {
                  title: 'Border',
                  key: 'borderMode',
                  body: [getSchemaTpl('borderMode')]
                },
                {
                  title: 'Popup',
                  key: 'picker',
                  body: [
                    {
                      name: 'pickerSize',
                      type: 'select',
                      pipeIn: defaultValue(''),
                      pipeOut: undefinedPipeOut,
                      label: 'Popup size',
                      options: [
                        {
                          label: 'Default',
                          value: ''
                        },
                        {
                          value: 'sm',
                          label: 'small'
                        },

                        {
                          label: 'Medium',
                          value: 'md'
                        },

                        {
                          label: 'big',
                          value: 'lg'
                        },

                        {
                          label: 'Extra Large',
                          value: 'xl'
                        },

                        {
                          label: 'Full screen',
                          value: 'full'
                        }
                      ]
                    }
                  ]
                }
              ]
            : [])
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

registerEditorPlugin(TransferPlugin);

import {
  registerEditorPlugin,
  BaseEventContext,
  BasePlugin,
  InsertEventContext,
  PluginEvent,
  ScaffoldForm,
  RegionConfig,
  RendererPluginEvent,
  defaultValue,
  getSchemaTpl,
  RendererPluginAction,
  tipedLabel,
  getI18nEnabled,
  EditorNodeType,
  EditorManager,
  RAW_TYPE_MAP
} from '@/packages/amis-editor-core/src';
import {someTree} from '@/packages/amis-core/src';
import type {SchemaType} from '@/packages/amis-ui/src';
import {isObject} from '@/packages/amis-ui/src';
import set from 'lodash/set';
import {DSBuilderManager} from '../../builder/DSBuilderManager';
import {ValidatorTag} from '../../validator';
import {
  getEventControlConfig,
  getArgsWrapper,
  getActionCommonProps,
  buildLinkActionDesc
} from '../../renderer/event-control/helper';
import cloneDeep from 'lodash/cloneDeep';
import {
  generateId,
  resolveArrayDatasource,
  resolveInputTableEventDataSchame
} from '../../util';
import React from 'react';

export class TableControlPlugin extends BasePlugin {
  static id = 'TableControlPlugin';
  // Associated renderer name
  rendererName = 'input-table';
  $schema = '/schemas/TableControlSchema.json';

  // Component name
  name = 'Table edit box';
  isBaseComponent = true;
  icon = 'fa fa-table';
  pluginIcon = 'table-plugin';
  description =
    'Can be used to display data, can be used to display array type data, such as multiple sub-form';
  docLink = '/amis/zh-CN/components/form/input-table';
  tags = ['form item'];
  scaffold = {
    type: 'input-table',
    name: 'table',
    label: 'Form',
    columns: [
      {
        label: 'name',
        name: 'name',
        quickEdit: {
          type: 'input-text',
          id: generateId(),
          name: 'name1'
        }
      },
      {
        label: 'score',
        name: 'score',
        quickEdit: {
          type: 'input-number',
          mode: 'inline',
          id: generateId(),
          name: 'score'
        }
      },
      {
        label: 'level',
        name: 'level',
        quickEdit: {
          type: 'select',
          name: 'level',
          id: generateId(),
          options: [
            {
              label: 'A',
              value: 'A'
            },
            {
              label: 'B',
              value: 'B'
            },
            {
              label: 'C',
              value: 'C'
            }
          ]
        }
      }
    ],
    addable: false,
    footerAddBtn: {
      label: 'New',
      icon: 'fa fa-plus'
    },
    strictMode: true
  };

  regions: Array<RegionConfig> = [
    {
      key: 'columns',
      label: 'column collection',
      renderMethod: 'renderTableContent',
      preferTag: 'display',
      dndMode: 'position-h'
    }
  ];

  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    wrapWithPanel: false,
    mode: 'horizontal',
    body: {
      ...this.scaffold,
      value: [{color: 'green', name: 'green'}]
    }
  };

  get scaffoldForm(): ScaffoldForm {
    const i18nEnabled = getI18nEnabled();
    return {
      title: 'Quickly build a table edit box',
      body: [
        {
          name: 'columns',
          type: 'input-table',
          label: false,
          needConfirm: false,
          addable: true,
          removable: true,
          columns: [
            {
              type: 'text',
              name: 'label',
              label: 'Title',
              quickEdit: {
                type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                mode: 'inline'
              }
            },
            {
              type: 'text',
              name: 'name',
              label: 'Bound field name',
              quickEdit: {
                type: 'input-text',
                mode: 'inline'
              }
            },
            {
              type: 'text',
              name: 'type',
              label: 'Display type',
              width: 140,
              quickEdit: {
                type: 'select',
                options: [
                  {
                    value: 'text',
                    label: 'Plain text'
                  },
                  {
                    value: 'tpl',
                    label: 'Template'
                  },
                  {
                    value: 'container',
                    label: 'Container'
                  },
                  {
                    value: 'image',
                    label: 'Picture'
                  },
                  {
                    value: 'date',
                    label: 'Date'
                  },
                  {
                    value: 'datetime',
                    label: 'Date time'
                  },
                  {
                    value: 'time',
                    label: 'time'
                  },
                  {
                    value: 'status',
                    label: 'status'
                  },
                  {
                    value: 'mapping',
                    label: 'Mapping'
                  }
                ],
                pipeIn: defaultValue('text')
              }
            },
            {
              type: 'text',
              name: 'quickEdit.type',
              label: 'Edit type',
              quickEdit: {
                type: 'select',
                clearable: true,
                placeholder: 'If empty, editing is not supported',
                options: [
                  {
                    value: 'input-text',
                    label: 'text box'
                  },
                  {
                    value: 'input-number',
                    label: 'digital box'
                  },
                  {
                    value: 'select',
                    label: 'select box'
                  },
                  {
                    value: 'input-color',
                    label: 'Color selection box'
                  },
                  {
                    value: 'checkboxes',
                    label: 'Multiple checkboxes'
                  },
                  {
                    value: 'radios',
                    label: 'Radio box'
                  },
                  {
                    value: 'input-date',
                    label: 'Date'
                  },
                  {
                    value: 'input-date-range',
                    label: 'Date range'
                  },
                  {
                    value: 'switch',
                    label: 'switch'
                  },
                  {
                    value: 'nested-select',
                    label: 'Cascade selector'
                  },
                  {
                    value: 'input-city',
                    label: 'City selector'
                  },
                  {
                    value: 'input-tree',
                    label: 'Tree selection box'
                  }
                ]
              },
              width: 210
            }
          ]
        }
      ],
      pipeOut: (schema: any) => {
        const columns = cloneDeep(schema.columns || []);
        const rawColumns: any = [];
        columns.forEach((column: any) => {
          const rawColumn = {
            ...column,
            type: column.type,
            quickEdit: column.quickEdit?.type
              ? {
                  type: column.quickEdit.type,
                  name: column.name
                }
              : false
          };
          rawColumns.push(rawColumn);
        });
        schema.columns = rawColumns;
        return {...schema};
      },
      canRebuild: true
    };
  }

  notRenderFormZone = true;

  panelJustify = true;
  panelTitle = 'Table Edit';

  events: RendererPluginEvent[] = [
    {
      eventName: 'add',
      eventLabel: 'Add row',
      description:
        'Triggered when clicking the add button in the lower left corner or the add button in the right operation bar of a row',
      dataSchema: (manager: EditorManager) => {
        const {value, item} = resolveInputTableEventDataSchame(manager, true);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  value: {
                    type: 'array',
                    ...value,
                    title: 'List records'
                  },
                  item: {
                    type: 'object',
                    ...item,
                    title: 'Add new row record'
                  },
                  index: {
                    type: 'number',
                    title: 'New index'
                  },
                  indexPath: {
                    type: 'string',
                    title: 'Index Path'
                  }
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'addConfirm',
      eventLabel: 'Confirm to add',
      description:
        'Turn on "confirmation mode", click the add button, fill in the data and click the "save" button to trigger',
      dataSchema: (manager: EditorManager) => {
        const {value, item} = resolveInputTableEventDataSchame(manager, true);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  value: {
                    type: 'array',
                    ...value,
                    title: 'List records'
                  },
                  item: {
                    type: 'object',
                    ...item,
                    title: 'Add new row record'
                  },
                  index: {
                    type: 'number',
                    title: 'New index'
                  },
                  indexPath: {
                    type: 'string',
                    title: 'Index Path'
                  }
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'addSuccess',
      eventLabel: 'Added successfully',
      description:
        'Turn on "Confirmation Mode" and configure "Add Interface", click "Save" and it will be triggered when it is successfully added',
      dataSchema: (manager: EditorManager) => {
        const {value, item} = resolveInputTableEventDataSchame(manager, true);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  value: {
                    type: 'array',
                    ...value,
                    title: 'List records'
                  },
                  item: {
                    type: 'object',
                    ...item,
                    title: 'Add new row record'
                  },
                  index: {
                    type: 'number',
                    title: 'New index'
                  },
                  indexPath: {
                    type: 'string',
                    title: 'Index Path'
                  }
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'addFail',
      eventLabel: 'Add failed',
      description:
        'Turn on "Confirmation Mode" and configure "Add New Interface", click "Save" and the interface call fails',
      dataSchema: (manager: EditorManager) => {
        const {value, item} = resolveInputTableEventDataSchame(manager, true);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  value: {
                    type: 'array',
                    ...value,
                    title: 'List records'
                  },
                  item: {
                    type: 'object',
                    ...item,
                    title: 'Add new row record'
                  },
                  index: {
                    type: 'number',
                    title: 'New index'
                  },
                  indexPath: {
                    type: 'string',
                    title: 'Index Path'
                  },
                  error: {
                    type: 'object',
                    title:
                      'Error message returned by the interface after the request failed'
                  }
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'edit',
      eventLabel: 'Edit row',
      description:
        'Triggered when clicking the "Edit" button in the right operation bar of a row',
      dataSchema: (manager: EditorManager) => {
        const {value, item} = resolveInputTableEventDataSchame(manager, true);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  value: {
                    type: 'array',
                    ...value,
                    title: 'List records'
                  },
                  item: {
                    type: 'object',
                    ...item,
                    title: 'The row record'
                  },
                  index: {
                    type: 'number',
                    title: 'The row record index'
                  },
                  indexPath: {
                    type: 'string',
                    title: 'Index Path'
                  }
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'editConfirm',
      eventLabel: 'Confirm edit',
      description:
        'Turn on "confirmation mode", click the "edit" button, fill in the data and click the "save" button to trigger',
      dataSchema: (manager: EditorManager) => {
        const {value, item} = resolveInputTableEventDataSchame(manager, true);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  value: {
                    type: 'array',
                    ...value,
                    title: 'List records'
                  },
                  item: {
                    type: 'object',
                    ...item,
                    title: 'The row record'
                  },
                  index: {
                    type: 'number',
                    title: 'Index'
                  },
                  indexPath: {
                    type: 'string',
                    title: 'Index Path'
                  }
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'editSuccess',
      eventLabel: 'Edit successful',
      description:
        'Turn on "confirmation mode" and configure "edit interface", and click "save" to trigger when the edit is successful',
      dataSchema: (manager: EditorManager) => {
        const {value, item} = resolveInputTableEventDataSchame(manager, true);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  value: {
                    type: 'array',
                    ...value,
                    title: 'List records'
                  },
                  item: {
                    type: 'object',
                    ...item,
                    title: 'The row record'
                  },
                  index: {
                    type: 'number',
                    title: 'The row record index'
                  },
                  indexPath: {
                    type: 'string',
                    title: 'Index Path'
                  }
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'editFail',
      eventLabel: 'Edit failed',
      description:
        'Turn on "confirmation mode" and configure "edit interface", click "save" and the interface call fails',
      dataSchema: (manager: EditorManager) => {
        const {value, item} = resolveInputTableEventDataSchame(manager, true);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  value: {
                    type: 'array',
                    ...value,
                    title: 'List records'
                  },
                  item: {
                    type: 'object',
                    ...item,
                    title: 'The row record'
                  },
                  index: {
                    type: 'number',
                    title: 'The row record index'
                  },
                  indexPath: {
                    type: 'string',
                    title: 'Index Path'
                  },
                  error: {
                    type: 'object',
                    title: 'Error message returned after request error'
                  }
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'delete',
      eventLabel: 'Delete row',
      description:
        'Triggered when clicking the "Delete" button in the right operation bar of a row',
      dataSchema: (manager: EditorManager) => {
        const {value, item} = resolveInputTableEventDataSchame(manager, true);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  value: {
                    type: 'array',
                    ...value,
                    title: 'List records'
                  },
                  item: {
                    type: 'object',
                    ...item,
                    title: 'The row record'
                  },
                  index: {
                    type: 'object',
                    title: 'The row record index'
                  },
                  indexPath: {
                    type: 'string',
                    title: 'Index Path'
                  }
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'deleteSuccess',
      eventLabel: 'Deleted successfully',
      description:
        'Configured "delete interface", triggered when the interface is called successfully',
      dataSchema: (manager: EditorManager) => {
        const {value, item} = resolveInputTableEventDataSchame(manager, true);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  value: {
                    type: 'array',
                    ...value,
                    title: 'List records'
                  },
                  item: {
                    type: 'object',
                    ...item,
                    title: 'The row record'
                  },
                  index: {
                    type: 'object',
                    title: 'The row record index'
                  },
                  indexPath: {
                    type: 'string',
                    title: 'Index Path'
                  }
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'deleteFail',
      eventLabel: 'Delete failed',
      description:
        'Configured "delete interface", triggered when calling the interface fails',
      dataSchema: (manager: EditorManager) => {
        const {value, item} = resolveInputTableEventDataSchame(manager, true);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  value: {
                    type: 'array',
                    ...value,
                    title: 'List records'
                  },
                  item: {
                    type: 'object',
                    ...item,
                    title: 'The row record'
                  },
                  index: {
                    type: 'number',
                    title: 'The row record index'
                  },
                  indexPath: {
                    type: 'string',
                    title: 'Index Path'
                  },
                  error: {
                    type: 'object',
                    title:
                      'Error message returned by the interface after the request failed'
                  }
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'change',
      eventLabel: 'value change',
      description: 'Triggered when table data changes',
      dataSchema: (manager: EditorManager) => {
        const {value} = resolveInputTableEventDataSchame(manager, true);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  value: {
                    type: 'array',
                    ...value,
                    title: 'List records'
                  }
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'orderChange',
      eventLabel: 'Row sorting',
      description: 'Manual drag row sorting event',
      dataSchema: (manager: EditorManager) => {
        const {item} = resolveInputTableEventDataSchame(manager, true);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  movedItems: {
                    type: 'array',
                    items: item,
                    title: 'Sorted records'
                  }
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'rowClick',
      eventLabel: 'row click',
      description: 'Click the entire row event',
      dataSchema: (manager: EditorManager) => {
        const {item} = resolveInputTableEventDataSchame(manager, true);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  item: {
                    type: 'object',
                    ...item,
                    title: 'Current row record'
                  },
                  index: {
                    type: 'number',
                    title: 'Current row index'
                  },
                  indexPath: {
                    type: 'string',
                    title: 'Index Path'
                  }
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'rowDbClick',
      eventLabel: 'row double click',
      description: 'Double click the whole row event',
      dataSchema: (manager: EditorManager) => {
        const {item} = resolveInputTableEventDataSchame(manager, true);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  item: {
                    type: 'object',
                    ...item,
                    title: 'Current row record'
                  },
                  index: {
                    type: 'number',
                    title: 'Current row index'
                  },
                  indexPath: {
                    type: 'string',
                    title: 'Index Path'
                  }
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'rowMouseEnter',
      eventLabel: 'Mouse enters row event',
      description: 'Triggered when moving into a whole line',
      dataSchema: (manager: EditorManager) => {
        const {item} = resolveInputTableEventDataSchame(manager, true);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  item: {
                    type: 'object',
                    ...item,
                    title: 'Current row record'
                  },
                  index: {
                    type: 'number',
                    title: 'Current row index'
                  },
                  indexPath: {
                    type: 'string',
                    title: 'Index Path'
                  }
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'rowMouseLeave',
      eventLabel: 'Mouse out event',
      description: 'Triggered when moving out of the entire line',
      dataSchema: (manager: EditorManager) => {
        const {item} = resolveInputTableEventDataSchame(manager, true);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  item: {
                    type: 'object',
                    ...item,
                    title: 'Current row record'
                  },
                  index: {
                    type: 'number',
                    title: 'Current row index'
                  },
                  indexPath: {
                    type: 'string',
                    title: 'Index Path'
                  }
                }
              }
            }
          }
        ];
      }
    }
  ];

  actions: RendererPluginAction[] = [
    {
      actionType: 'setValue',
      actionLabel: 'Assignment',
      description: 'Trigger component data update',
      ...getActionCommonProps('setValue')
    },
    {
      actionType: 'addItem',
      actionLabel: 'Add row',
      description: 'Add row data',
      innerArgs: ['item', 'index'],
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            {buildLinkActionDesc(props.manager, info)}
            Add a row
          </div>
        );
      },
      schema: getArgsWrapper({
        type: 'container',
        body: [
          {
            type: 'input-number',
            name: 'index',
            mode: 'horizontal',
            horizontal: {
              leftFixed: 4 // You need to set leftFixed, otherwise the controls of this field will not be left aligned with the controls of other fields
            },
            label: 'Insert position',
            size: 'lg',
            placeholder:
              'Please enter the line number, if it is empty, insert it at the end'
          },
          {
            type: 'combo',
            name: 'value',
            label: 'Data settings',
            multiple: true,
            removable: true,
            required: true,
            addable: true,
            strictMode: false,
            canAccessSuperData: true,
            mode: 'horizontal',
            size: 'lg',
            addButtonText: 'Add a new line',
            items: [
              {
                type: 'combo',
                name: 'item',
                label: false,
                renderLabel: false,
                multiple: true,
                removable: true,
                required: true,
                addable: true,
                strictMode: false,
                canAccessSuperData: true,
                className: 'm-l',
                size: 'lg',
                mode: 'horizontal',
                addButtonText: 'Add new field',
                items: [
                  {
                    name: 'key',
                    type: 'input-text',
                    source: '${__setValueDs}',
                    labelField: 'label',
                    valueField: 'value',
                    required: true
                  },
                  getSchemaTpl('formulaControl', {
                    name: 'val',
                    variables: '${variables}'
                  })
                ]
              }
            ]
          }
        ]
      })
    },
    {
      actionType: 'deleteItem',
      actionLabel: 'Delete row',
      description: 'Delete a row of data',
      innerArgs: ['condition', 'index'],
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            {buildLinkActionDesc(props.manager, info)}
            Deleting a row
          </div>
        );
      },
      schema: getArgsWrapper({
        type: 'container',
        body: [
          {
            type: 'radios',
            name: '__deleteType',
            inputClassName: 'event-action-radio',
            mode: 'horizontal',
            label: 'Delete method',
            pipeIn: (value: string, store: any) => {
              if (store.data.__deleteType === undefined) {
                const deleteType = store.data.condition
                  ? 'conditionExpression'
                  : 'rowIndex';
                store.updateData({
                  __deleteType: deleteType
                });
                return deleteType;
              }
              return value;
            },
            horizontal: {
              leftFixed: 4 // You need to set leftFixed, otherwise the controls of this field will not be left aligned with the controls of other fields
            },
            options: [
              {
                label: 'Specify line number',
                value: 'rowIndex'
              },
              {
                label: 'Conditional expression',
                value: 'conditionExpression'
              }
            ],
            onChange: (value: string, oldVal: any, data: any, form: any) => {
              form.setValueByName('index', undefined);
              form.setValueByName('condition', undefined);
            }
          },
          {
            type: 'input-text',
            name: 'index',
            mode: 'horizontal',
            horizontal: {
              leftFixed: 4 // You need to set leftFixed, otherwise the controls of this field will not be left aligned with the controls of other fields
            },
            required: true,
            label: 'Delete range',
            size: 'lg',
            placeholder:
              'Please enter the line number. If you enter multiple numbers, separate them with commas',
            hiddenOn: 'this.__deleteType !== "rowIndex"'
          },
          getSchemaTpl('formulaControl', {
            name: 'condition',
            variables: '${variables}',
            label: 'Delete condition',
            hiddenOn: 'this.__deleteType !== "conditionExpression"',
            mode: 'horizontal',
            required: true,
            horizontal: {
              leftFixed: 4 // You need to set leftFixed, otherwise the controls of this field will not be left aligned with the controls of other fields
            },
            size: 'lg'
          })
        ]
      })
    },
    // {
    //   actionType: 'reset',
    // actionLabel: 'Reset',
    // description: 'Reset the value to the initial value'
    // },
    {
      actionType: 'clear',
      actionLabel: 'Clear',
      description: 'Clear component data',
      ...getActionCommonProps('clear')
    },
    {
      actionType: 'initDrag',
      actionLabel: 'Start sorting',
      description: 'Enable table drag and drop sorting function',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            Open
            {buildLinkActionDesc(props.manager, info)}
            Sorting
          </div>
        );
      }
    },
    {
      actionType: 'cancelDrag',
      actionLabel: 'Cancel sorting',
      description: 'Cancel the table drag and drop sorting function',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            Cancel
            {buildLinkActionDesc(props.manager, info)}
            Sorting
          </div>
        );
      }
    }
  ];

  dsManager: DSBuilderManager;

  constructor(manager: EditorManager) {
    super(manager);
    this.dsManager = new DSBuilderManager(manager);
  }

  panelBodyCreator = (context: BaseEventContext) => {
    const isCRUDBody = context.schema.type === 'crud';
    const i18nEnabled = getI18nEnabled();
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
                type: 'ae-switch-more',
                name: 'needConfirm',
                label: tipedLabel(
                  'Confirmation Mode',
                  'When it is turned on, adding or editing requires clicking the "Save" button on the right side of the table to change the component data. When it is not turned on, adding, editing, and deleting directly change the component data.'
                ),
                isChecked: (v: any) => v.value !== false,
                falseValue: false,
                mode: 'normal',
                formType: 'extend',
                hiddenOnDefault: true,
                form: {
                  body: [
                    {
                      type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                      name: 'confirmBtnLabel',
                      label: 'Confirm button name',
                      placeholder: 'Confirm button name'
                    },
                    getSchemaTpl('icon', {
                      name: 'confirmBtnIcon',
                      label: 'Confirm button icon',
                      pipeIn: defaultValue('check')
                    }),
                    {
                      type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                      name: 'cancelBtnLabel',
                      label: 'Cancel button name',
                      placeholder: 'Cancel button name'
                    },
                    getSchemaTpl('icon', {
                      name: 'cancelBtnIcon',
                      label: 'Cancel button icon',
                      pipeIn: defaultValue('close')
                    })
                  ]
                },
                pipeIn: defaultValue(true)
              },
              {
                type: 'ae-switch-more',
                name: 'addable',
                label: 'Can be added',
                mode: 'normal',
                formType: 'extend',
                hiddenOnDefault: true,
                form: {
                  body: [
                    getSchemaTpl('apiControl', {
                      label: 'New interface',
                      name: 'addApi',
                      mode: 'row'
                    }),
                    getSchemaTpl('switch', {
                      name: 'showTableAddBtn',
                      label: 'Add a new button to the action bar',
                      value: true
                    }),
                    {
                      label: 'Button name',
                      name: 'addBtnLabel',
                      visibleOn: 'this.showTableAddBtn',
                      type: i18nEnabled ? 'input-text-i18n' : 'input-text'
                    },
                    getSchemaTpl('icon', {
                      name: 'addBtnIcon',
                      label: 'button icon',
                      visibleOn: 'this.showTableAddBtn',
                      pipeIn: defaultValue('plus')
                    })
                  ]
                }
              },
              {
                type: 'ae-switch-more',
                name: 'copyable',
                label: 'Copyable',
                mode: 'normal',
                formType: 'extend',
                hiddenOnDefault: true,
                form: {
                  body: [
                    {
                      label: 'Button name',
                      name: 'copyBtnLabel',
                      type: i18nEnabled ? 'input-text-i18n' : 'input-text'
                    },
                    getSchemaTpl('icon', {
                      name: 'copyBtnIcon',
                      label: 'button icon',
                      pipeIn: defaultValue('copy')
                    })
                  ]
                }
              },
              {
                type: 'ae-switch-more',
                name: 'editable',
                label: 'Editable',
                mode: 'normal',
                formType: 'extend',
                hiddenOnDefault: true,
                form: {
                  body: [
                    getSchemaTpl('apiControl', {
                      label: 'Edit interface',
                      name: 'updateApi',
                      mode: 'row'
                    }),
                    {
                      label: 'Button name',
                      name: 'editBtnLabel',
                      type: i18nEnabled ? 'input-text-i18n' : 'input-text'
                    },
                    getSchemaTpl('icon', {
                      name: 'editBtnIcon',
                      label: 'button icon',
                      pipeIn: defaultValue('pencil')
                    })
                  ]
                }
              },
              {
                type: 'ae-switch-more',
                name: 'removable',
                label: 'Can be deleted',
                mode: 'normal',
                formType: 'extend',
                hiddenOnDefault: true,
                form: {
                  body: [
                    getSchemaTpl('deleteApi'),
                    {
                      label: 'Button name',
                      name: 'deleteBtnLabel',
                      type: i18nEnabled ? 'input-text-i18n' : 'input-text'
                    },
                    getSchemaTpl('icon', {
                      name: 'deleteBtnIcon',
                      label: 'button icon',
                      pipeIn: defaultValue('minus')
                    })
                  ]
                }
              },
              getSchemaTpl('switch', {
                name: 'showIndex',
                label: 'Show serial number',
                pipeIn: defaultValue(false)
              }),
              {
                type: 'input-number',
                name: 'perPage',
                label: 'Number of items displayed per page',
                placeholder: 'If empty, no paging will be performed'
              },
              {
                type: 'input-number',
                name: 'minLength',
                label: 'Minimum number of rows',
                pipeIn: defaultValue(0)
              },
              {
                type: 'input-number',
                name: 'maxLength',
                label: 'Maximum number of rows'
              },
              getSchemaTpl('description'),
              getSchemaTpl('placeholder'),
              getSchemaTpl('labelRemark')
            ]
          },
          {
            title: 'Advanced',
            body: [
              getSchemaTpl('switch', {
                name: 'strictMode',
                label: tipedLabel(
                  'Strict mode',
                  'For performance reasons, by default, changes in other form item values ​​will not cause the current table to be updated. Sometimes, in order to synchronously obtain other form item fields, this needs to be enabled.'
                ),
                pipeIn: defaultValue(false)
              }),
              getSchemaTpl('switch', {
                name: 'canAccessSuperData',
                label: tipedLabel(
                  'Get parent data',
                  'Whether you can access parent data, that is, sibling data in the form, usually needs to be used with the "strict mode" attribute.'
                ),
                pipeIn: defaultValue(false)
              })
            ]
          },
          getSchemaTpl('status', {isFormItem: true}),
          getSchemaTpl('validation', {
            tag: ValidatorTag.MultiSelect
          })
        ])
      },
      {
        title: 'Appearance',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: [
              {
                name: 'columnsTogglable',
                label: tipedLabel(
                  'Column display switch',
                  'Whether to display the visibility control of the table columns, "Auto" means it will be automatically turned on when the number of columns is greater than 5'
                ),
                type: 'button-group-select',
                pipeIn: defaultValue('auto'),
                size: 'sm',
                labelAlign: 'left',
                options: [
                  {
                    label: 'Automatic',
                    value: 'auto'
                  },

                  {
                    label: 'Open',
                    value: true
                  },

                  {
                    label: 'Close',
                    value: false
                  }
                ]
              },
              getSchemaTpl('switch', {
                name: 'affixHeader',
                label: 'Is the header fixed?',
                pipeIn: defaultValue(false)
              }),
              getSchemaTpl('switch', {
                name: 'showFooterAddBtn',
                label: 'Show the new button at the bottom',
                pipeIn: defaultValue(true)
              }),
              getSchemaTpl('switch', {
                name: 'showTableAddBtn',
                label: 'Show new button in the operation column',
                pipeIn: defaultValue(true)
              })
            ]
          },
          getSchemaTpl('style:formItem', {renderer: context.info.renderer}),
          getSchemaTpl('style:classNames', {
            schema: [
              getSchemaTpl('className', {
                name: 'rowClassName',
                label: 'row style'
              }),
              getSchemaTpl('className', {
                name: 'toolbarClassName',
                label: 'Toolbar'
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

  filterProps(props: any, node: EditorNodeType) {
    if (!node.state.value) {
      const arr = resolveArrayDatasource(props);
      let value: Array<any> = [];

      // Only take 10 previews, otherwise there will be too much lag
      if (Array.isArray(arr) && arr.length) {
        value = arr.slice(0, 10);
      } else {
        value.push({});
      }
      node.updateState({value});
    }

    return {
      ...props,
      // Prevent the change event in the editor preview state to avoid an infinite loop caused by a special case triggering a change
      onChange: () => true
    };
  }

  // Automatically insert label
  beforeInsert(event: PluginEvent<InsertEventContext>) {
    const context = event.context;
    if (
      (context.info.plugin === this ||
        context.node.sameIdChild?.info.plugin === this) &&
      context.region === 'columns'
    ) {
      context.data = {
        ...context.data,
        label: context.data.label ?? context.subRenderer?.name ?? 'Column name'
      };
    }
  }

  async buildDataSchemas(
    node: EditorNodeType,
    region?: EditorNodeType,
    trigger?: EditorNodeType,
    parent?: EditorNodeType
  ) {
    let itemsSchema: any = {
      $id: `${node.id}-${node.type}-tableRows`,
      type: 'object',
      properties: {}
    };
    const columns: EditorNodeType = node.children.find(
      item => item.isRegion && item.region === 'columns'
    );
    const parentScopeId = `${parent?.id}-${parent?.type}${
      node.parent?.type === 'cell' ? '-currentRow' : ''
    }`;
    let isColumnChild = false;

    // Append the current row scope
    if (trigger) {
      isColumnChild = someTree(
        columns?.children,
        item => item.id === trigger.id
      );

      if (isColumnChild) {
        const scopeId = `${node.id}-${node.type}-currentRow`;
        if (this.manager.dataSchema.getScope(scopeId)) {
          this.manager.dataSchema.removeScope(scopeId);
        }

        if (this.manager.dataSchema.getScope(parentScopeId)) {
          this.manager.dataSchema.switchTo(parentScopeId);
        }

        this.manager.dataSchema.addScope([], scopeId);
        this.manager.dataSchema.current.tag = 'Current row record';
        this.manager.dataSchema.current.group = 'component context';
      }
    }

    const cells: any = columns?.children.concat() || [];
    while (cells.length > 0) {
      const cell = cells.shift() as EditorNodeType;
      // It seems that there is only one child of the cell
      const items = cell.children.concat();
      while (items.length) {
        const current = items.shift() as EditorNodeType;
        const schema = current.schema;

        if (schema.name) {
          const tmpSchema = await current.info.plugin.buildDataSchemas?.(
            current,
            region,
            trigger,
            node
          );
          itemsSchema.properties[schema.name] = {
            ...tmpSchema,
            ...(tmpSchema?.$id ? {} : {$id: `${current!.id}-${current!.type}`})
          };
        }
      }
    }
    let match =
      node.schema.source && String(node.schema.source).match(/{([\w-_]+)}/);
    let field = node.schema.name || match?.[1];
    const origin = this.manager.dataSchema.current;
    const schema = this.manager.dataSchema.getSchemaByPath(field);
    this.manager.dataSchema.switchTo(origin);
    if (isObject(schema?.items)) {
      itemsSchema = {
        ...itemsSchema,
        ...(schema!.items as any)
      };

      set(itemsSchema, 'properties.index', {
        type: 'number',
        title: 'Index'
      });
    }

    if (region?.region === 'columns') {
      return itemsSchema;
    }

    // Append the current row data
    if (isColumnChild) {
      const scopeId = `${node.id}-${node.type}-currentRow`;
      const scope = this.manager.dataSchema.getScope(scopeId);
      scope?.addSchema(itemsSchema);
    }

    return {
      $id: `${node.id}-${node.type}-tableData`,
      type: 'array',
      rawType: RAW_TYPE_MAP[node.schema.type as SchemaType] || 'string',
      title: node.schema?.label || node.schema?.name,
      items: itemsSchema
    };
  }

  async getAvailableContextFields(
    scopeNode: EditorNodeType,
    target: EditorNodeType,
    region?: EditorNodeType
  ) {
    let scope;
    let builder;

    if (
      target.type === scopeNode.type ||
      (target.parent.isRegion && target.parent.region === 'columns')
    ) {
      scope = scopeNode.parent.parent;
      builder = this.dsManager.getBuilderBySchema(scope.schema);
    }

    if (builder && scope.schema.api) {
      return builder.getAvailableContextFields(
        {
          schema: scope.schema,
          sourceKey: 'api',
          feat: scope.schema?.feat ?? 'List',
          scopeNode
        },
        /** If the ID is the same, it is the entity, otherwise it is the subitem*/
        target?.id === scopeNode?.id ? scopeNode : target
      );
    }
  }
}

registerEditorPlugin(TableControlPlugin);

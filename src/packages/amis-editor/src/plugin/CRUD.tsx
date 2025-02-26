import {toast, normalizeApiResponseData} from 'amis';
import cloneDeep from 'lodash/cloneDeep';
import React from 'react';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../renderer/event-control/helper';
import {genCodeSchema} from '../renderer/APIAdaptorControl';
import {
  getI18nEnabled,
  jsonToJsonSchema,
  registerEditorPlugin,
  tipedLabel
} from 'amis-editor-core';
import {
  BaseEventContext,
  BasePlugin,
  BasicRendererInfo,
  BasicSubRenderInfo,
  ChangeEventContext,
  PluginEvent,
  PluginInterface,
  RendererEventContext,
  RendererInfoResolveEventContext,
  ScaffoldForm,
  SubRendererInfo,
  defaultValue,
  getSchemaTpl,
  JSONPipeIn
} from 'amis-editor-core';
import {setVariable, someTree, normalizeApi} from 'amis-core';
import type {CRUDCommonSchema} from 'amis';
import {getEnv} from 'mobx-state-tree';
import type {
  EditorNodeType,
  RendererPluginAction,
  RendererPluginEvent
} from 'amis-editor-core';
import isPlainObject from 'lodash/isPlainObject';
import findLastIndex from 'lodash/findLastIndex';

interface ColumnItem {
  label: string;
  type: string;
  name: string;
}

type CRUDModes = CRUDCommonSchema['mode'];

// Convert the display control to an edit control
const viewTypeToEditType = (type: string) => {
  return type === 'tpl'
    ? 'input-text'
    : type === 'status' || type === 'mapping'
    ? 'select'
    : `input-${type}`;
};

export class CRUDPlugin extends BasePlugin {
  static id = 'CRUDPlugin';
  // Associated renderer name
  rendererName = 'crud';
  $scheme = '/schemes/CRUDSchema.json';

  order = -800;

  // Component name
  name = 'Add, delete, modify and check';
  isBaseComponent = true;
  description =
    'Used to implement data addition, deletion, modification and query, supporting three display modes: table, cards and list. Responsible for data pulling, paging, single operation, batch operation, sorting, quick editing and other functions. Integrated query conditions. ';
  docLink = '/amis/zh-CN/components/crud';
  tags = ['data container'];
  icon = 'fa fa-table';
  pluginIcon = 'table-plugin';

  scaffold: any = {
    type: 'crud',
    syncLocation: false,
    api: '',
    columns: [
      {
        name: 'id',
        label: 'ID',
        type: 'text'
      },
      {
        name: 'engine',
        label: 'rendering engine',
        type: 'text'
      }
    ],
    bulkActions: [],
    itemActions: []
  };

  events: RendererPluginEvent[] = [
    {
      eventName: 'fetchInited',
      eventLabel: 'Initialization data interface request completed',
      description:
        'Triggered when the remote initialization data interface request is completed',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                responseData: {
                  type: 'object',
                  title: 'Response data'
                },
                responseStatus: {
                  type: 'number',
                  title: 'Response status (0 means success)'
                },
                responseMsg: {
                  type: 'string',
                  title: 'Response message'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'research',
      eventLabel: 'Reload',
      description: 'Triggered when reloading or query reset',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                responseData: {
                  type: 'object',
                  title: 'Response data'
                },
                responseStatus: {
                  type: 'number',
                  title: 'Response status (0 means success)'
                },
                responseMsg: {
                  type: 'string',
                  title: 'Response message'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'selectedChange',
      eventLabel: 'Select table item',
      description: 'Manually select table item event',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                selectedItems: {
                  type: 'array',
                  title: 'Selected row record'
                },
                unSelectedItems: {
                  type: 'array',
                  Title: 'No row selected'
                },
                selectedIndexes: {
                  type: 'array',
                  title: 'Selected row index'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'columnSort',
      eventLabel: 'Column sorting',
      description: 'Click column sorting event',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                orderBy: {
                  type: 'string',
                  title: 'column name'
                },
                orderDir: {
                  type: 'string',
                  title: 'Sort value'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'columnFilter',
      eventLabel: 'column filter',
      description: 'Click column filter event',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                filterName: {
                  type: 'string',
                  title: 'column name'
                },
                filterValue: {
                  type: 'string',
                  title: 'Filter value'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'columnSearch',
      eventLabel: 'Column Search',
      description: 'Click column search event',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                searchName: {
                  type: 'string',
                  title: 'column name'
                },
                searchValue: {
                  type: 'object',
                  title: 'Search value'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'orderChange',
      eventLabel: 'Row sorting',
      description: 'Manual drag row sorting event',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                movedItems: {
                  type: 'array',
                  title: 'Sorted records'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'columnToggled',
      eventLabel: 'Column display changes',
      description: 'Click on custom column event',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                columns: {
                  type: 'array',
                  title: 'Currently displayed column configuration'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'rowClick',
      eventLabel: 'row click',
      description: 'Click the entire row event',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                item: {
                  type: 'object',
                  title: 'Current row record'
                },
                index: {
                  type: 'number',
                  title: 'Current row index'
                },
                indexPath: {
                  type: 'number',
                  title: 'Row index path'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'rowDbClick',
      eventLabel: 'row double click',
      description: 'Double click the whole row event',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                item: {
                  type: 'object',
                  title: 'Current row record'
                },
                index: {
                  type: 'number',
                  title: 'Current row index'
                },
                indexPath: {
                  type: 'number',
                  title: 'Row index path'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'rowMouseEnter',
      eventLabel: 'Mouse enters row event',
      description: 'Triggered when moving into a whole line',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                item: {
                  type: 'object',
                  title: 'Current row record'
                },
                index: {
                  type: 'number',
                  title: 'Current row index'
                },
                indexPath: {
                  type: 'number',
                  title: 'Row index path'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'rowMouseLeave',
      eventLabel: 'Mouse out event',
      description: 'Triggered when moving out of the entire line',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                item: {
                  type: 'object',
                  title: 'Current row record'
                },
                index: {
                  type: 'number',
                  title: 'Current row index'
                },
                indexPath: {
                  type: 'number',
                  title: 'Row index path'
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
      actionType: 'reload',
      actionLabel: 'Reload',
      description: 'Trigger component data refresh and re-rendering',
      ...getActionCommonProps('reload')
    },
    {
      actionLabel: 'Variable assignment',
      actionType: 'setValue',
      description: 'Update list records',
      ...getActionCommonProps('setValue')
    }
  ];

  btnSchemas = {
    create: {
      label: 'New',
      type: 'button',
      actionType: 'dialog',
      level: 'primary',
      editorSetting: {
        behavior: 'create'
      },
      dialog: {
        title: 'New',
        body: {
          type: 'form',
          api: '',
          body: []
        }
      }
    },
    update: {
      label: 'Edit',
      type: 'button',
      actionType: 'dialog',
      level: 'link',
      editorSetting: {
        behavior: 'update'
      },
      dialog: {
        title: 'Edit',
        body: {
          type: 'form',
          api: '',
          initApi: '',
          body: []
        }
      }
    },
    view: {
      label: 'View',
      type: 'button',
      actionType: 'dialog',
      level: 'link',
      editorSetting: {
        behavior: 'view'
      },
      dialog: {
        title: 'View details',
        body: {
          type: 'form',
          initApi: '',
          body: []
        }
      }
    },
    delete: {
      type: 'button',
      label: 'Delete',
      actionType: 'ajax',
      level: 'link',
      className: 'text-danger',
      confirmText: 'Are you sure you want to delete? ',
      api: '',
      editorSetting: {
        behavior: 'delete'
      }
    },
    bulkDelete: {
      type: 'button',
      level: 'danger',
      label: 'Batch delete',
      actionType: 'ajax',
      confirmText: 'Are you sure you want to delete? ',
      api: '',
      editorSetting: {
        behavior: 'bulkDelete'
      }
    },
    bulkUpdate: {
      type: 'button',
      label: 'Batch Edit',
      actionType: 'dialog',
      editorSetting: {
        behavior: 'bulkUpdate'
      },
      dialog: {
        title: 'Batch Edit',
        size: 'md',
        body: {
          type: 'form',
          api: '',
          body: [
            {
              label: 'Field 1',
              text: 'Field 1',
              type: 'input-text'
            }
          ]
        }
      }
    },
    // itemDelete: {
    //   type: 'button',
    //   level: 'danger',
    // label: 'Delete',
    //   api: '',
    //   actionType: 'ajax',
    // confirmText: 'Are you sure you want to delete? '
    // },
    filter: {
      title: 'Query conditions',
      body: [
        {
          type: 'input-text',
          name: 'keywords',
          label: 'Keywords'
        }
      ]
    }
  };

  get scaffoldForm(): ScaffoldForm {
    const i18nEnabled = getI18nEnabled();
    return {
      title: 'Quick Start of CRUD',
      body: [
        getSchemaTpl('apiControl', {
          label: 'Interface address',
          sampleBuilder: (schema: any) =>
            JSON.stringify(
              {
                status: 0,
                msg: '',
                data: {
                  items: [{id: 1, engine: 'Webkit'}],
                  total: 1
                }
              },
              null,
              2
            )
        }),
        {
          type: 'button',
          label:
            'Format verification and automatic generation of column configuration',
          className: 'm-t-xs m-b-xs',
          visibleOn: '!!this.api.url',
          onClick: async (e: Event, props: any) => {
            const data = props.data;
            const schemaFilter = getEnv(
              (window as any).editorStore
            ).schemaFilter;
            let api: any = data.api;
            // Mainly to replace the url in iShuDa
            if (schemaFilter) {
              api = schemaFilter({
                api: data.api
              }).api;
            }
            const response = await props.env.fetcher(api, data);
            const result = normalizeApiResponseData(response.data);
            let autoFillKeyValues: Array<any> = [];
            let items = result?.items ?? result?.rows;

            /** Non-standard return, take the first array in data as the return value, synchronized with the processing logic in AMIS*/
            if (!Array.isArray(items)) {
              for (const key of Object.keys(result)) {
                if (result.hasOwnProperty(key) && Array.isArray(result[key])) {
                  items = result[key];
                  break;
                }
              }
            }

            if (Array.isArray(items)) {
              Object.keys(items[0]).forEach((key: any) => {
                const value = items[0][key];
                autoFillKeyValues.push({
                  label: key,
                  type: 'text',
                  name: key
                });
              });
              props.formStore.setValues({
                columns: autoFillKeyValues
              });
              // List of fields for query conditions
              props.formStore.setValues({
                filterSettingSource: autoFillKeyValues.map(column => {
                  return column.name;
                })
              });
            } else {
              toast.warning(
                'The API return format is incorrect. Please click the example on the right side of the interface address to view the CRUD data interface structure requirements'
              );
            }
          }
        },
        {
          name: '__features',
          label: 'Enable feature',
          type: 'checkboxes',
          joinValues: false,
          extractValue: true,
          itemClassName: 'max-w-lg',
          options: [
            {label: 'Add', value: 'create'},
            {label: 'query', value: 'filter'},
            {label: 'Batch Delete', value: 'bulkDelete'},
            {label: 'Batch update', value: 'bulkUpdate'},
            {label: 'Action Bar - Edit', value: 'update'},
            {label: 'Action bar - view details', value: 'view'},
            {label: 'Action bar - delete', value: 'delete'}
          ]
        },
        {
          type: 'group',
          body: [
            {
              columnRatio: 10,
              type: 'checkboxes',
              label: 'Enabled query fields',
              name: 'filterEnabledList',
              joinValues: false,
              source: '${filterSettingSource}'
            },
            {
              columnRatio: 2,
              type: 'input-number',
              label: 'How many fields are displayed in each column',
              value: 3,
              name: '__filterColumnCount'
            }
          ],
          visibleOn: "${__features && CONTAINS(__features, 'filter')}"
        },
        {
          name: 'columns',
          type: 'input-table',
          label: false,
          addable: true,
          removable: true,
          needConfirm: false,
          columns: [
            {
              type: i18nEnabled ? 'input-text-i18n' : 'input-text',
              name: 'label',
              label: 'Title'
            },
            {
              type: 'input-text',
              name: 'name',
              label: 'Bound field name'
            },
            {
              type: 'select',
              name: 'type',
              label: 'type',
              value: 'text',
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
                  value: 'image',
                  label: 'Picture'
                },
                {
                  value: 'date',
                  label: 'Date'
                },
                {
                  value: 'progress',
                  label: 'Progress'
                },
                {
                  value: 'status',
                  label: 'status'
                },
                {
                  value: 'mapping',
                  label: 'Mapping'
                },
                {
                  value: 'operation',
                  label: 'Action bar'
                }
              ]
            }
          ]
        }
      ],
      pipeIn: (value: any) => {
        const __features = [];
        //Collection filter
        if (value.filter) {
          __features.push('filter');
        }

        let actions = [];
        if (value.mode === 'cards' && Array.isArray(value.card?.body)) {
          actions = Array.isArray(value.card.actions)
            ? value.card.actions.concat()
            : [];
        } else if (
          value.mode === 'list' &&
          Array.isArray(value.listItem?.body)
        ) {
          actions = Array.isArray(value.listItem.actions)
            ? value.listItem.actions.concat()
            : [];
        } else if (Array.isArray(value.columns)) {
          actions =
            value.columns
              .find((value: any) => value?.type === 'operation')
              ?.buttons?.concat() || [];
        }

        //Collection column operations
        const operBtns: Array<string> = ['update', 'view', 'delete'];
        actions.forEach((btn: any) => {
          if (operBtns.includes(btn.editorSetting?.behavior || '')) {
            __features.push(btn.editorSetting?.behavior);
          }
        });

        // Collect batch operations
        if (Array.isArray(value.bulkActions)) {
          value.bulkActions.forEach((item: any) => {
            if (item.editorSetting?.behavior) {
              __features.push(item.editorSetting?.behavior);
            }
          });
        }
        // Collect new
        if (
          Array.isArray(value.headerToolbar) &&
          value.headerToolbar.some(
            (item: any) => item.editorSetting?.behavior === 'create'
          )
        ) {
          __features.push('create');
        }
        return {
          ...value,
          ...(value.mode !== 'table'
            ? {
                columns:
                  value.columns ||
                  this.transformByMode({
                    from: value.mode,
                    to: 'table',
                    schema: value
                  })
              }
            : {}),
          __filterColumnCount: value?.filter?.columnCount || 3,
          __features: __features,
          __LastFeatures: [...__features]
        };
      },
      pipeOut: (value: any) => {
        let valueSchema = cloneDeep(value);
        /** Unified API format */
        valueSchema.api =
          typeof valueSchema.api === 'string'
            ? normalizeApi(valueSchema.api)
            : valueSchema.api;

        const features: string[] = valueSchema.__features;
        const lastFeatures: string[] = valueSchema.__LastFeatures;
        const willAddedList = features.filter(
          item => !lastFeatures.includes(item)
        );
        const willRemoveList = lastFeatures.filter(
          item => !features.includes(item)
        );

        const operButtons: any[] = [];
        const operBtns: string[] = ['update', 'view', 'delete'];

        if (!valueSchema.bulkActions) {
          valueSchema.bulkActions = [];
        } else {
          // Delete unchecked batch operations
          valueSchema.bulkActions = valueSchema.bulkActions.filter(
            (item: any) =>
              !willRemoveList.includes(item.editorSetting?.behavior)
          );
        }

        // Delete the unchecked filter
        if (willRemoveList.includes('filter') && valueSchema.filter) {
          delete valueSchema.filter;
        }

        // Delete the unchecked additions
        if (
          willRemoveList.includes('create') &&
          Array.isArray(valueSchema.headerToolbar)
        ) {
          valueSchema.headerToolbar = valueSchema.headerToolbar.filter(
            (item: any) => item.editorSetting?.behavior !== 'create'
          );
        }

        willAddedList.length &&
          willAddedList.forEach((item: string) => {
            if (operBtns.includes(item)) {
              // Column operation buttons
              let schema;
              if (item === 'update') {
                schema = cloneDeep(this.btnSchemas.update);
                schema.dialog.body.body = value.columns
                  .filter(
                    ({type}: any) => type !== 'progress' && type !== 'operation'
                  )
                  .map(({type, ...rest}: any) => ({
                    ...rest,
                    type: viewTypeToEditType(type)
                  }));
              } else if (item === 'view') {
                schema = cloneDeep(this.btnSchemas.view);
                schema.dialog.body.body = value.columns.map(
                  ({type, ...rest}: any) => ({
                    ...rest,
                    type: 'static'
                  })
                );
              } else if (item === 'delete') {
                schema = cloneDeep(this.btnSchemas.delete);
                schema.api = valueSchema.api?.method?.match(/^(post|delete)$/i)
                  ? valueSchema.api
                  : {...valueSchema.api, method: 'post'};
              }
              schema && operButtons.push(schema);
            } else {
              // Batch operation
              if (item === 'bulkUpdate') {
                this.addItem(
                  valueSchema.bulkActions,
                  cloneDeep(this.btnSchemas.bulkUpdate)
                );
              }

              if (item === 'bulkDelete') {
                this.addItem(
                  valueSchema.bulkActions,
                  cloneDeep(this.btnSchemas.bulkDelete)
                );
              }

              // Create
              if (item === 'create') {
                const createSchemaBase = this.btnSchemas.create;
                createSchemaBase.dialog.body = {
                  type: 'form',
                  api: valueSchema.api?.method?.match(/^(post|put)$/i)
                    ? valueSchema.api
                    : {...valueSchema.api, method: 'post'},
                  body: valueSchema.columns
                    .filter(
                      ({type}: any) =>
                        type !== 'progress' && type !== 'operation'
                    )
                    .map((column: ColumnItem) => {
                      const type = column.type;
                      return {
                        type: viewTypeToEditType(type),
                        name: column.name,
                        label: column.label
                      };
                    })
                };
                valueSchema.headerToolbar = [createSchemaBase, 'bulkActions'];
              }
              // Query
              let keysFilter = Object.keys(valueSchema.filter || {});
              if (item === 'filter' && !keysFilter.length) {
                if (valueSchema.filterEnabledList) {
                  valueSchema.filter = {
                    title: 'Query conditions'
                  };
                  valueSchema.filter.columnCount = value.__filterColumnCount;
                  valueSchema.filter.mode = 'horizontal';
                  valueSchema.filter.body = valueSchema.filterEnabledList.map(
                    (item: any) => {
                      return {
                        type: 'input-text',
                        label: item.label,
                        name: item.value
                      };
                    }
                  );
                }
              }
            }
          });

        // Process column action buttons
        const lastIndex = findLastIndex(
          value.columns || [],
          (item: any) => item.type === 'operation'
        );
        if (lastIndex === -1) {
          if (operButtons.length) {
            valueSchema.columns.push({
              type: 'operation',
              label: 'Operation',
              buttons: operButtons
            });
          }
        } else {
          const operColumn = valueSchema.columns[lastIndex];
          operColumn.buttons = (operColumn.buttons || [])
            .filter(
              (btn: any) =>
                !willRemoveList.includes(btn.editorSetting?.behavior)
            )
            .concat(operButtons);
        }

        const {card, columns, listItem, ...rest} = valueSchema;

        return {
          ...rest,
          ...(valueSchema.mode === 'cards'
            ? {
                card: this.transformByMode({
                  from: 'table',
                  to: 'cards',
                  schema: valueSchema
                })
              }
            : valueSchema.mode === 'list'
            ? {
                listItem: this.transformByMode({
                  from: 'table',
                  to: 'list',
                  schema: valueSchema
                })
              }
            : columns
            ? {columns}
            : {})
        };
      },
      canRebuild: true
    };
  }

  addItem(source: any, target: any) {
    const canAdd = source.find((item: any) => item.label === target.label);
    if (!canAdd) {
      source.push(target);
    }
  }

  multifactor = true;
  previewSchema: any = {
    syncLocation: false,
    type: 'crud',
    className: 'text-left',
    bodyClassName: 'm-b-none',
    affixHeader: false,
    data: {
      items: [
        {a: 1, b: 2},
        {a: 3, b: 4},
        {a: 5, b: 6}
      ]
    },
    source: '${items}',
    columns: [
      {
        label: 'A',
        name: 'a'
      },
      {
        label: 'B',
        name: 'b'
      },
      {
        type: 'operation',
        label: 'Operation',
        buttons: [
          {
            icon: 'fa fa-eye',
            type: 'button'
          },

          {
            icon: 'fa fa-edit',
            type: 'button'
          }
        ]
      }
    ]
  };

  oldFilter?: any;
  panelTitle = 'Add, delete, modify and check';
  panelBodyCreator = (context: BaseEventContext) => {
    const store = this.manager.store;
    const id = context.id;

    return getSchemaTpl('tabs', [
      {
        title: 'General',
        body: [
          getSchemaTpl('layout:originPosition', {value: 'left-top'}),
          getSchemaTpl('switch', {
            name: 'filter',
            label: 'Enable query conditions',
            visibleOn:
              'this.api && this.api.url || typeof this.api === "string" && this.api',
            pipeIn: (value: any) => !!value,
            pipeOut: (value: any, originValue: any) => {
              if (value) {
                return (
                  this.oldFilter ||
                  JSONPipeIn({
                    title: 'Query conditions',
                    body: [
                      {
                        type: 'input-text',
                        name: 'keywords',
                        label: 'Keywords'
                      }
                    ]
                  })
                );
              } else {
                this.oldFilter = originValue;
              }

              return null;
            }
          }),

          {
            type: 'divider',
            visibleOn: 'this.api && this.api.url'
          },

          getSchemaTpl('combo-container', {
            label: 'Batch operation',
            name: 'bulkActions',
            type: 'combo',
            hiddenOn: 'this.pickerMode && this.multiple',
            inputClassName: 'ae-BulkActions-control',
            multiple: true,
            draggable: true,
            draggableTip: '',
            scaffold: {
              label: 'button',
              type: 'button'
            },
            labelRemark: {
              className: 'm-l-xs',
              trigger: 'click',
              rootClose: true,
              content:
                'This allows you to manage batch operation buttons. The selection box will only appear if batch operation buttons are set. You can configure the location of batch operation buttons in the appearance. ',
              placement: 'left'
            },
            items: [
              getSchemaTpl('tpl:btnLabel'),

              {
                columnClassName: 'p-t-xs col-edit',
                children: ({index}: any) => (
                  <button
                    onClick={this.handleBulkActionEdit.bind(this, id, index)}
                    data-tooltip="Modify"
                    data-position="bottom"
                    className="text-muted"
                  >
                    <i className="fa fa-pencil" />
                  </button>
                )
              }
            ]
          }),

          // getSchemaTpl('switch', {
          //   name: 'defaultChecked',
          // label: 'Are all checked by default',
          //   visibleOn: 'this.bulkActions && this.bulkActions.length',
          //   pipeIn: defaultValue(false)
          // }),

          {
            type: 'divider'
          },

          getSchemaTpl('combo-container', {
            label: 'Single operation',
            name: 'itemActions',
            type: 'combo',
            labelRemark: {
              className: 'm-l-xs',
              trigger: 'click',
              rootClose: true,
              content:
                'After setting, when the mouse hovers over the row data, the operation button will appear, and the button will also be displayed in the top operation bar. When checking members, it will switch intelligently with the batch button. ',
              placement: 'left'
            },
            hiddenOn: 'this.mode && this.mode !== "table" || this.pickerMode',
            inputClassName: 'ae-BulkActions-control',
            multiple: true,
            draggable: true,
            scaffold: {
              label: 'button',
              type: 'button'
            },
            items: [
              getSchemaTpl('tpl:btnLabel'),

              {
                type: 'checkbox',
                className: 'text-xs',
                option: 'Hover hide',
                name: 'hiddenOnHover'
              },

              {
                columnClassName: 'p-t-xs col-edit',
                children: ({index}: any) => (
                  <button
                    onClick={this.handleItemActionEdit.bind(this, id, index)}
                    data-tooltip="Modify"
                    data-position="bottom"
                    className="text-muted"
                  >
                    <i className="fa fa-pencil" />
                  </button>
                )
              }
            ]
          }),

          {
            type: 'divider',
            hiddenOn: 'this.mode && this.mode !== "table" || this.pickerMode'
          },

          getSchemaTpl('switch', {
            name: 'selectable',
            label: 'Open selection',
            pipeIn: defaultValue(false),
            labelRemark: {
              className: 'm-l-xs',
              trigger: 'click',
              rootClose: true,
              content:
                'After turning it on, even if there is no batch operation button, it will still be displayed as clickable',
              placement: 'left'
            }
          }),

          getSchemaTpl('switch', {
            name: 'multiple',
            label: 'Open multiple selection',
            visibleOn: '${selectable}',
            pipeIn: defaultValue(true),
            labelRemark: {
              className: 'm-l-xs',
              trigger: 'click',
              rootClose: true,
              content:
                'Control whether it is single selection or multiple selection',
              placement: 'left'
            }
          }),

          getSchemaTpl('switch', {
            name: 'syncLocation',
            label: 'Synchronize address bar',
            pipeIn: defaultValue(true),
            labelRemark: {
              className: 'm-l-xs',
              trigger: 'click',
              rootClose: true,
              content:
                'After turning it on, the query condition data and paging information will be synchronized to the address bar. When there are multiple addresses on the page, it is recommended to keep only one synchronization address bar, otherwise they will affect each other. ',
              placement: 'left'
            }
          }),

          getSchemaTpl('combo-container', {
            label: 'Default parameters',
            type: 'input-kv',
            name: 'defaultParams',
            labelRemark: {
              className: 'm-l-xs',
              trigger: 'click',
              rootClose: true,
              content:
                'Can be used to set default parameters, such as <code>perPage:20</code>',
              placement: 'left'
            }
          }),

          {
            type: 'divider'
          },

          getSchemaTpl('switch', {
            name: 'keepItemSelectionOnPageChange',
            label: 'Keep item selected',
            visbileOn:
              'this.bulkActions && this.bulkActions.length || this.itemActions && this.itemActions.length',
            labelRemark: {
              className: 'm-l-xs',
              trigger: 'click',
              rootClose: true,
              content:
                "After default paging and searching, the user's selected items will be cleared. After turning on this option, the user's selection will be retained, and batch operations across pages can be implemented. ",
              placement: 'left'
            }
          }),

          {
            name: 'labelTpl',
            type: 'input-text',
            label: 'Single description template',
            visibleOn: 'this.keepItemSelectionOnPageChange',
            labelRemark: {
              className: 'm-l-xs',
              trigger: 'click',
              rootClose: true,
              content:
                'After turning on [Keep Item Selection], all selected items will be listed. This option can be used to customize the item display copy. ',
              placement: 'left'
            }
          },

          {
            name: 'primaryField',
            label: 'Specify primary key',
            type: 'input-text',
            pipeIn: defaultValue('id'),
            description:
              'Default <code>id</code>, used for batch operations to obtain row-level data'
          }
        ]
      },

      {
        title: 'Interface',
        body: [
          getSchemaTpl('apiControl', {
            label: 'Data pull interface',
            sampleBuilder: () => {
              const data: any = {
                items: [],
                total: 0
              };
              const columns: any[] = context?.schema?.columns ?? [];
              const row = {};

              columns.forEach(column => {
                if (column.name) {
                  setVariable(row, column.name, 'sample');
                }
              });
              data.items.push(row);
              return JSON.stringify(
                {
                  status: 0,
                  msg: '',
                  data: data
                },
                null,
                2
              );
            }
          }),

          {
            name: 'initFetch',
            type: 'radios',
            label: 'Whether to pull initially',
            pipeIn: (value: any) =>
              (typeof value == 'boolean' && value) ||
              (typeof value !== 'boolean' && ''),
            inline: true,
            onChange: () => {},
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
            name: 'initFetchOn',
            autoComplete: false,
            visibleOn: 'typeof this.initFetch !== "boolean"',
            type: 'input-text',
            placeholder: 'Use JS expression to determine',
            className: 'm-t-n-sm'
          },

          getSchemaTpl('switch', {
            name: 'loadDataOnce',
            label: 'One-time pull',
            labelRemark: {
              className: 'm-l-xs',
              trigger: 'click',
              rootClose: true,
              content:
                'After turning it on, data will only be pulled at the initial stage, and subsequent paging and sorting will no longer request the interface, but will be completed directly by the front end. ',
              placement: 'left'
            }
          }),

          {
            name: 'matchFunc',
            type: 'ae-functionEditorControl',
            allowFullscreen: true,
            mode: 'normal',
            label: tipedLabel(
              'Search matching function',
              'Custom search matching function. When <code>loadDataOnce</code> is turned on, filtering will be performed based on the matching results calculated by this function. It is mainly used to handle scenarios where the column field type is complex or the field value format is inconsistent with the backend return. The <code>matchSorter</code> function is used to handle complex filtering scenarios, such as fuzzy matching. For more details, please refer to <a href="https://github.com/kentcdodds/match-sorter" target="_blank">match-sorter</a>. '
            ),
            renderLabel: true,
            params: [
              {
                label: 'items',
                tip: genCodeSchema(
                  '/* Full data of the current list*/\nitems: any[]'
                )
              },
              {
                label: 'itemsRaw',
                tip: genCodeSchema(
                  '/* The full amount of data returned by the most recent interface*/\nitemsRaw: any[]'
                )
              },
              {
                label: 'options',
                tip: genCodeSchema(
                  '/* Additional configuration*/\noptions?: {\n /* Query parameters*/\n query: Record < string, any>;\n /* Column configuration*/\n columns: any;\n /** match-sorter matching function*/\n matchSorter: (items: any[], value: string, options?: MatchSorterOptions<any>) => any[]\n}'
                )
              }
            ],
            placeholder: `return items;`,
            visibleOn: '${loadDataOnce === true}'
          },

          getSchemaTpl('switch', {
            label: 'Enable timed refresh',
            name: 'interval',
            visibleOn: 'this.api',
            pipeIn: (value: any) => !!value,
            pipeOut: (value: any) => (value ? 3000 : undefined)
          }),

          {
            name: 'interval',
            type: 'input-number',
            visibleOn: 'typeof this.interval === "number"',
            step: 500,
            className: 'm-t-n-sm',
            description:
              'After setting, it will automatically refresh at a fixed time, in ms'
          },

          getSchemaTpl('switch', {
            name: 'silentPolling',
            label: 'Silent refresh',
            visibleOn: '!!this.interval',
            description:
              'Set whether to display loading when automatically refreshing'
          }),

          {
            name: 'stopAutoRefreshWhen',
            label: 'Stop timing refresh detection expression',
            type: 'input-text',
            visibleOn: '!!this.interval',
            description:
              'Once the timed refresh is set, it will refresh all the time unless an expression is given. If the condition is met, it will not refresh.'
          },

          getSchemaTpl('switch', {
            name: 'stopAutoRefreshWhenModalIsOpen',
            label: 'Turn off auto-refresh when a pop-up window appears',
            visibleOn: '!!this.interval',
            description:
              'Open and close the pop-up box to automatically refresh, close the pop-up box to restore'
          }),

          {
            type: 'divider'
          },

          getSchemaTpl('switch', {
            name: 'draggable',
            label: 'Can drag and drop sorting be performed'
          }),

          getSchemaTpl('apiControl', {
            label: tipedLabel(
              'Sequential preservation interface',
              `<p><code>ids</code>: <span>Use id to record the new order</span></p>
              <p><code>rows</code>: <span>Array format, new order, the array contains all the original information</span></p>
              <p><code>insetAfter</code> / <code>insertBefore</code>: <span>This is the diff information generated by amis, in object format, the key is the primaryField value of the target member, that is, id, and the value is an array that stores the member's primaryField value</span></p>`
            ),
            name: 'saveOrderApi',
            visibleOn: 'this.draggable'
          }),

          {
            type: 'divider'
          },

          getSchemaTpl('apiControl', {
            label: 'Quick Save Interface',
            name: 'quickSaveApi',
            description:
              'When quick edit is set in the column, this interface will be used to save data in batches.'
          }),

          {
            type: 'divider'
          },

          getSchemaTpl('apiControl', {
            label: 'Quickly save a single interface',
            name: 'quickSaveItemApi',
            description:
              'When quick edit is set in the column and immediate save is set, this interface will be used to save the data.'
          }),

          {
            type: 'divider'
          },

          getSchemaTpl('loadingConfig', {}, {context}),

          {
            type: 'divider'
          },

          {
            label: 'Default message prompt',
            type: 'combo',
            name: 'messages',
            multiLine: true,
            description:
              'Override the default message prompt, but if the API returns msg, this msg will be used first',
            items: [
              getSchemaTpl('fetchSuccess'),
              getSchemaTpl('fetchFailed'),
              getSchemaTpl('saveOrderSuccess'),
              getSchemaTpl('saveOrderFailed'),
              getSchemaTpl('quickSaveSuccess'),
              getSchemaTpl('quickSaveFailed')
            ]
          }
        ],
        visibleOn: '!this.pickerMode'
      },

      {
        title: 'Appearance',
        body: [
          {
            label: 'Content display mode',
            name: 'mode',
            type: 'button-group-select',
            size: 'xs',
            pipeIn: (value: any, values: any) =>
              (value === 'grid' ? 'cards' : value) ?? 'table',
            onChange: (value: any, oldValue: any, model: any, form: any) => {
              let headerHasColumnsToggle = form?.data?.headerToolbar?.some(
                (item: any) => item.type === 'columns-toggler'
              );
              let headerToolbar = cloneDeep(form?.data?.headerToolbar);
              let columnsToggler;
              if (value !== 'table' && oldValue === 'table') {
                // Whether the storage table mode has columns-toggler
                columnsToggler = headerToolbar?.find(
                  (item: any) => item.type === 'columns-toggler'
                ) || {
                  type: 'columns-toggler',
                  align: 'right'
                };
                form.setValues({
                  __headerHasColumnsToggler: headerHasColumnsToggle
                });
              }
              headerToolbar =
                value === 'table'
                  ? headerToolbar
                  : headerToolbar?.filter(
                      (item: any) => item.type !== 'columns-toggler'
                    );
              if (value === 'table') {
                if (
                  form?.data?.__headerHasColumnsToggler &&
                  !headerHasColumnsToggle
                ) {
                  headerToolbar?.push(
                    form?.data?.__cacheColumnsToggler || {
                      type: 'columns-toggler',
                      align: 'right'
                    }
                  );
                }
                form.setValues({
                  headerToolbar,
                  columns:
                    form.data.__columns ||
                    this.transformByMode({
                      from: oldValue,
                      to: value,
                      schema: form.data
                    }),
                  __headerHasColumnsToggler: headerHasColumnsToggle,
                  __card: form.data.card || form.data.__card,
                  __listItem: form.data.listItem || form.data.__listItem
                });
                form.deleteValueByName('card');
                form.deleteValueByName('listItem');
              } else if (value === 'cards') {
                oldValue === 'table' &&
                  form.setValues({
                    __cacheColumnsToggler: columnsToggler
                  });
                form.setValues({
                  headerToolbar,
                  card:
                    form.data.__card ||
                    this.transformByMode({
                      from: oldValue,
                      to: value,
                      schema: form.data
                    }),
                  __columns: form.data.columns || form.data.__columns,
                  __listItem: form.data.listItem || form.data.__listItem
                });
                form.deleteValueByName('columns');
                form.deleteValueByName('listItem');
              } else {
                oldValue === 'table' &&
                  form.setValues({
                    __cacheColumnsToggler: columnsToggler
                  });
                form.setValues({
                  headerToolbar,
                  listItem:
                    form.data.__listItem ||
                    this.transformByMode({
                      from: oldValue,
                      to: value,
                      schema: form.data
                    }),
                  __columns: form.data.columns || form.data.__columns,
                  __card: form.data.card || form.data.__card
                });
                form.deleteValueByName('columns');
                form.deleteValueByName('card');
              }
            },
            options: [
              {
                value: 'table',
                label: 'Table'
              },

              {
                value: 'cards',
                label: 'Card'
              },

              {
                value: 'list',
                label: 'list'
              }
            ]
          },

          getSchemaTpl('combo-container', {
            name: 'headerToolbar',
            type: 'combo',
            draggable: true,
            draggableTip: '',
            description:
              'Please select non-built-in content in the preview area and edit it',
            label: 'Top toolbar configuration',
            pipeIn: (value: any) => {
              if (!Array.isArray(value)) {
                value = value ? [value] : ['bulkActions'];
              }
              return value.map((item: any) => {
                let type = item.type;

                if (
                  typeof item === 'string' &&
                  ~[
                    'bulkActions',
                    'bulk-actions',
                    'pagination',
                    'statistics',
                    'switch-per-page',
                    'filter-toggler',
                    'load-more',
                    'export-csv',
                    'export-excel'
                  ].indexOf(item)
                ) {
                  type = item === 'bulkActions' ? 'bulk-actions' : item;
                  item = {type};
                } else if (typeof item === 'string') {
                  type = 'tpl';
                  item =
                    typeof item === 'string'
                      ? {type: 'tpl', tpl: item, wrapperComponent: ''}
                      : item;
                }
                return {
                  type,
                  ...item
                };
              });
            },
            pipeOut: (value: any) => {
              if (Array.isArray(value)) {
                return value.map((item: any) => {
                  if (item.type === 'button') {
                    return JSONPipeIn({
                      label: 'button',
                      type: 'button',
                      ...item
                    });
                  } else if (item.type === 'tpl') {
                    return JSONPipeIn({
                      type: 'tpl',
                      tpl: 'content',
                      wrapperComponent: '',
                      ...item
                    });
                  }

                  return item;
                });
              }

              return [];
            },
            scaffold: {
              type: 'tpl',
              wrapperComponent: '',
              tpl: 'content'
            },
            multiple: true,
            items: [
              {
                type: 'select',
                name: 'type',
                columnClassName: 'w-ssm',
                overlay: {
                  align: 'left',
                  width: 150
                },
                options: [
                  {
                    value: 'bulk-actions',
                    label: 'Action bar'
                  },

                  {
                    value: 'pagination',
                    label: 'Pagination'
                  },

                  {
                    value: 'statistics',
                    label: 'Statistical data'
                  },

                  {
                    value: 'switch-per-page',
                    label: 'Switch page number'
                  },

                  {
                    value: 'load-more',
                    label: 'Load more'
                  },

                  {
                    value: 'export-csv',
                    label: 'Export CSV'
                  },

                  {
                    value: 'export-excel',
                    label: 'Export Excel'
                  },

                  {
                    value: 'columns-toggler',
                    label: 'column selector',
                    visibleOn: '!this.mode || this.mode === "table"'
                  },

                  {
                    value: 'filter-toggler',
                    label: 'Query condition switch'
                  },

                  {
                    value: 'drag-toggler',
                    label: 'Drag to switch'
                  },
                  // list and cards have their own selection function, no need to add it
                  // {
                  //   value: 'check-all',
                  // label: 'Select all',
                  //   hiddenOn: '!this.mode || this.mode === "table"'
                  // },

                  {
                    value: 'tpl',
                    label: 'text'
                  },

                  {
                    value: 'button',
                    label: 'button'
                  }
                ]
              },

              {
                name: 'align',
                placeholder: 'Alignment',
                type: 'select',
                size: 'xs',
                options: [
                  {
                    label: 'Left Align',
                    value: 'left'
                  },

                  {
                    label: 'right aligned',
                    value: 'right'
                  }
                ]
              }

              // {
              //   type: 'remark',
              // content: 'Please select the details in the preview area and edit them.',
              //   trigger: ['click'],
              //   rootClose: true,
              //   placement: 'left',
              //   visibleOn:
              //     '!~["bulkActions", "drag-toggler", "check-all", "bulk-actions", "pagination", "statistics", "switch-per-page", "filter-toggler", "load-more"].indexOf(this.type)',
              //   columnClassName: 'no-grow w-3x p-t-xs',
              //   className: 'm-l-none'
              // }
            ]
          }),

          getSchemaTpl('combo-container', {
            name: 'footerToolbar',
            type: 'combo',
            draggable: true,
            draggableTip: '',
            description:
              'Please select non-built-in content in the preview area and edit it',
            label: 'Bottom toolbar configuration',
            pipeIn: (value: any) => {
              if (!Array.isArray(value)) {
                value = value ? [value] : ['statistics', 'pagination'];
              }

              return value.map((item: any) => {
                let type = item.type;

                if (
                  typeof item === 'string' &&
                  ~[
                    'bulkActions',
                    'bulk-actions',
                    'pagination',
                    'statistics',
                    'switch-per-page',
                    'filter-toggler',
                    'load-more',
                    'export-csv',
                    'export-excel'
                  ].indexOf(item)
                ) {
                  type = item === 'bulkActions' ? 'bulk-actions' : item;
                  item = {type};
                } else if (typeof item === 'string') {
                  type = 'tpl';
                  item =
                    typeof item === 'string'
                      ? {type: 'tpl', tpl: item, wrapperComponent: ''}
                      : item;
                }

                return {
                  type,
                  ...item
                };
              });
            },
            pipeOut: (value: any) => {
              if (Array.isArray(value)) {
                return value.map((item: any) => {
                  if (item.type === 'button') {
                    return JSONPipeIn({
                      label: 'button',
                      type: 'button',
                      ...item
                    });
                  } else if (item.type === 'tpl') {
                    return JSONPipeIn({
                      type: 'tpl',
                      tpl: 'content',
                      wrapperComponent: '',
                      ...item
                    });
                  }

                  return item;
                });
              }

              return [];
            },
            scaffold: {
              type: 'tpl',
              tpl: 'content',
              wrapperComponent: ''
            },
            multiple: true,
            items: [
              {
                type: 'select',
                name: 'type',
                columnClassName: 'w-ssm',
                overlay: {
                  align: 'left',
                  width: 150
                },
                options: [
                  {
                    value: 'bulk-actions',
                    label: 'Action bar'
                  },

                  {
                    value: 'pagination',
                    label: 'Pagination'
                  },

                  {
                    value: 'statistics',
                    label: 'Statistical data'
                  },

                  {
                    value: 'switch-per-page',
                    label: 'Switch page number'
                  },

                  {
                    value: 'load-more',
                    label: 'Load more'
                  },

                  {
                    value: 'export-csv',
                    label: 'Export CSV'
                  },

                  {
                    value: 'export-excel',
                    label: 'Export Excel'
                  },

                  {
                    value: 'columns-toggler',
                    label: 'column selector',
                    hiddenOn: '["grid", "cards", "list"].indexOf(this.mode)'
                  },

                  {
                    value: 'filter-toggler',
                    label: 'Query condition switch'
                  },

                  {
                    value: 'drag-toggler',
                    label: 'Drag to switch'
                  },

                  {
                    value: 'check-all',
                    label: 'Select all',
                    hiddenOn: '!this.mode || this.mode === "table"'
                  },

                  {
                    value: 'tpl',
                    label: 'text'
                  },

                  {
                    value: 'button',
                    label: 'button'
                  }
                ]
              },

              {
                name: 'align',
                placeholder: 'Alignment',
                size: 'xs',
                type: 'select',
                options: [
                  {
                    label: 'Left Align',
                    value: 'left'
                  },

                  {
                    label: 'right aligned',
                    value: 'right'
                  }
                ]
              },

              {
                type: 'remark',
                content:
                  'Please select the details in the preview area and edit them.',
                trigger: ['click'],
                rootClose: true,
                placement: 'left',
                visibleOn:
                  '!~["bulkActions", "drag-toggler", "check-all", "bulk-actions", "pagination", "statistics", "switch-per-page", "filter-toggler", "load-more", "export-csv", "export-excel"].indexOf(this.type)',
                columnClassName: 'no-grow w-3x p-t-xs',
                className: 'm-l-none'
              }
            ]
          }),

          getSchemaTpl('switch', {
            name: 'filterTogglable',
            label: 'Whether query conditions can be displayed or hidden',
            visibleOn: 'this.filter'
          }),

          getSchemaTpl('switch', {
            name: 'filterDefaultVisible',
            label: 'Whether the query condition is visible by default',
            visibleOn: 'this.filter && this.filterTogglable',
            pipeIn: defaultValue(true)
          }),

          getSchemaTpl('switch', {
            name: 'hideQuickSaveBtn',
            label: 'Hide the top quick save prompt'
          }),

          getSchemaTpl('switch', {
            name: 'alwaysShowPagination',
            label: 'Whether to always display paging'
          }),

          getSchemaTpl('switch', {
            name: 'autoFillHeight',
            label: 'Content area adaptive height'
          }),

          getSchemaTpl('switch', {
            name: 'hideCheckToggler',
            label: 'Hide selection button',
            visibleOn: 'this.checkOnItemClick'
          }),

          getSchemaTpl('className'),

          getSchemaTpl('className', {
            name: 'bodyClassName',
            label: 'Content CSS class name'
          })
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
      },

      {
        title: 'Other',
        body: [
          getSchemaTpl('ref'),
          {
            name: 'source',
            label: 'data source',
            type: 'input-text',
            description:
              'Leave it blank. By default, the items or rows attributes returned by the interface are read. If it is something else, please set it here, such as: <code>\\${xxxx}</code>'
          },

          {
            name: 'perPage',
            label: 'Number per page',
            type: 'input-number'
          },

          getSchemaTpl('switch', {
            name: 'keepItemSelectionOnPageChange',
            label: 'Keep selection when turning pages'
          }),

          {
            name: 'maxKeepItemSelectionLength',
            label: 'Maximum number of selections',
            type: 'input-number',
            mode: 'horizontal',
            horizontal: {
              justify: true
            }
          },

          {
            name: 'pageField',
            label: 'Page number field name',
            type: 'input-text',
            pipeIn: defaultValue('page')
          },

          {
            name: 'perPageField',
            label: 'Paging step field name',
            type: 'input-text',
            pipeIn: defaultValue('perPage')
          },

          {
            name: 'orderField',
            label: 'Sorting weight field',
            type: 'input-text',
            labelRemark: {
              className: 'm-l-xs',
              trigger: 'click',
              rootClose: true,
              content:
                'Set the field name used to determine the position. After setting, the new order will be assigned to this field. ',
              placement: 'left'
            }
          },

          {
            name: 'perPageAvailable',
            label: 'Switch number of pages',
            type: 'input-array',
            hiddenOn: 'this.loadDataOnce',
            items: {
              type: 'input-number',
              required: true
            },
            value: [5, 10, 20, 50, 100]
          },

          getSchemaTpl('name'),

          {
            name: 'itemCheckableOn',
            type: 'input-text',
            label: 'Configure a single selectable expression',
            description:
              'Please use js expression, if not set, every item can be selected.',
            visibleOn:
              'this.bulkActions && this.bulkActions.length || this.pickerMode'
          },

          getSchemaTpl('switch', {
            name: 'checkOnItemClick',
            label: 'Open single click to select the entire area',
            visibleOn:
              'this.bulkActions && this.bulkActions.length || this.pickerMode'
          }),

          getSchemaTpl('switch', {
            name: 'autoJumpToTopOnPagerChange',
            label: 'Automatically jump to the top',
            description:
              'When splitting pages, whether to automatically jump to the top'
          }),

          getSchemaTpl('switch', {
            name: 'syncResponse2Query',
            label: 'Synchronous query conditions',
            description:
              'After querying, synchronize the returned data to the query conditions'
          })
        ]
      }
    ]);
  };

  handleBulkActionEdit(id: string, index: number) {
    const store = this.manager.store;
    const schema = store.getSchema(id);
    const action = schema?.bulkActions[index];

    if (action && action.$$id) {
      store.setActiveId(action.$$id);
    }
  }
  handleItemActionEdit(id: string, index: number) {
    const store = this.manager.store;
    const schema = store.getSchema(id);
    const action = schema?.itemActions[index];

    if (action && action.$$id) {
      store.setActiveId(action.$$id);
    }
  }

  wrapperProps = {
    affixHeader: false
  };

  /**
   * By default, all components are added to the subcomponent, and this change behavior can be overridden in the subclass.
   * @param context
   * @param renderers
   */
  buildSubRenderers(
    context: RendererEventContext,
    renderers: Array<SubRendererInfo>
  ): BasicSubRenderInfo | Array<BasicSubRenderInfo> | void {
    const plugin: PluginInterface = this;
    if (plugin.name && plugin.description) {
      return {
        name: plugin.name,
        icon: plugin.icon,
        pluginIcon: plugin.pluginIcon,
        description: plugin.description,
        previewSchema: plugin.previewSchema,
        tags: plugin.tags,
        docLink: plugin.docLink,
        type: plugin.type,
        scaffold: plugin.scaffold,
        disabledRendererPlugin: plugin.disabledRendererPlugin,
        isBaseComponent: plugin.isBaseComponent,
        scaffoldForm: this.scaffoldForm,
        rendererName: plugin.rendererName
      };
    }
  }

  getRendererInfo(
    context: RendererInfoResolveEventContext
  ): BasicRendererInfo | void {
    const info = super.getRendererInfo(context);
    if (info) {
      info.scaffoldForm = this.scaffoldForm;
    }
    return info;
  }

  renderEditableComponents(props: any) {
    const render = props.render;
    const bulkActions = props.bulkActions;
    const itemActions = props.itemActions;
    const doms: Array<JSX.Element> = [];

    if (Array.isArray(bulkActions) && bulkActions.length) {
      doms.push(
        <div key="bulkActions" className="ae-EditableRender">
          <div className="ae-EditableRender-title">Batch Operation</div>
          <div className="ae-EditableRender-body">
            {bulkActions.map(action =>
              render(
                'bulk-action',
                {
                  type: 'button',
                  size: 'sm',
                  ...action
                },
                {
                  key: action.$$id
                }
              )
            )}
          </div>
        </div>
      );
    }

    if (Array.isArray(itemActions) && itemActions.length) {
      doms.push(
        <div key="itemActions" className="ae-EditableRender">
          <div className="ae-EditableRender-title">Single operation</div>
          <div className="ae-EditableRender-body">
            {itemActions.map(action =>
              render(
                'bulk-action',
                {
                  type: 'button',
                  size: 'sm',
                  ...action
                },
                {
                  key: action.$$id
                }
              )
            )}
          </div>
        </div>
      );
    }

    if (!doms.length) {
      return null;
    }

    return (
      <div className="ae-EditableRenderers">
        <div className="ae-EditableRenderers-tip">
          "Add, delete, modify and check" editing auxiliary area
        </div>
        {doms}
      </div>
    );
  }

  renderRenderer(props: any) {
    const {$$editor, style, ...rest} = props;
    const renderer = $$editor.renderer;
    return (
      <div className="ae-CRUDEditor" style={style}>
        {this.renderEditableComponents(props)}
        <renderer.component $$editor={$$editor} {...rest} />
      </div>
    );
  }

  filterProps(props: any) {
    if (props.pickerMode) {
      props.options = props.data.options;
    }

    return props;
  }

  afterUpdate(event: PluginEvent<ChangeEventContext>) {
    const context = event.context;

    // The mode content format has changed, and the panel needs to be rebuilt.
    if (
      context.info.plugin === this &&
      context.diff?.some(change => change.path?.join('.') === 'mode')
    ) {
      setTimeout(() => {
        this.manager.buildPanels();
        this.manager.buildToolbars();
      }, 20);
    }
  }

  async buildDataSchemas(
    node: EditorNodeType,
    region?: EditorNodeType,
    trigger?: EditorNodeType,
    parent?: EditorNodeType
  ) {
    const child: EditorNodeType = node.children.find(
      item => !!~['table', 'table2', 'cards', 'list'].indexOf(item.type)
    );

    if (!child?.info?.plugin?.buildDataSchemas) {
      return;
    }

    const tmpSchema = await child.info.plugin.buildDataSchemas?.(
      child,
      undefined,
      trigger,
      node
    );

    let childSchema = {
      ...tmpSchema,
      ...(tmpSchema?.$id ? {} : {$id: `${child.id}-${child.type}`})
    };

    // Compatible with table rows and merged asynchronous data by itself
    if (child.type === 'table') {
      let itemsSchema: any = {}; // Collect columns in selected records
      const columns: EditorNodeType = child.children.find(
        item => item.isRegion && item.region === 'columns'
      );
      const rowsSchema = childSchema.properties.rows?.items;

      if (trigger) {
        const isColumnChild = someTree(
          columns?.children,
          item => item.id === trigger.id
        );

        // merge single column members in asynchronous data, because rendererBeforeDispatchEvent cannot distinguish whether single column members are needed
        const scope = this.manager.dataSchema.getScope(
          `${node.id}-${node.type}`
        );
        //List record member fields
        const menberProps = (
          scope.getSchemaById('crudFetchInitedData')?.properties?.items as any
        )?.items?.properties;
        // All fields
        let tmpProperties: any = {
          ...menberProps,
          ...rowsSchema?.properties
        };

        Object.keys(tmpProperties).map(key => {
          itemsSchema[key] = {
            ...tmpProperties[key]
          };
        });

        if (isColumnChild) {
          const childScope = this.manager.dataSchema.getScope(
            `${child.id}-${child.type}-currentRow`
          );

          if (childScope) {
            childScope?.setSchemas([
              {
                $id: `${child.id}-${child.type}-currentRow`,
                type: 'object',
                properties: itemsSchema
              }
            ]);
            childScope.tag = `Current line record: ${node.type}`;
          }
        }
      }
      childSchema = {
        $id: childSchema.$id,
        type: childSchema.type,
        properties: {
          items: childSchema.properties.rows,
          selectedItems: {
            ...childSchema.properties.selectedItems,
            items: {
              ...childSchema.properties.selectedItems.items,
              properties: itemsSchema
            }
          },
          unSelectedItems: {
            ...childSchema.properties.unSelectedItems,
            items: {
              ...childSchema.properties.unSelectedItems.items,
              properties: itemsSchema
            }
          },
          selectedIndexes: {
            type: 'array',
            title: 'Selected row index'
          },
          count: {
            type: 'number',
            title: 'Total number of rows'
          },
          page: {
            type: 'number',
            title: 'Current page number'
          }
        }
      };
    }

    return childSchema;
  }

  rendererBeforeDispatchEvent(node: EditorNodeType, e: any, data: any) {
    if (e === 'fetchInited' || e === 'research') {
      const scope = this.manager.dataSchema.getScope(`${node.id}-${node.type}`);
      const jsonschema: any = {
        $id: 'crudFetchInitedData',
        type: 'object',
        ...jsonToJsonSchema(data.responseData, (type: string, key: string) => {
          if (type === 'array' && key === 'items') {
            return 'data list';
          }
          if (type === 'number' && key === 'count') {
            return 'total number of rows';
          }
          return key;
        })
      };

      scope?.removeSchema(jsonschema.$id);
      scope?.addSchema(jsonschema);
    }
  }

  /** Crud main body conversion when switching between different modes*/
  transformByMode({
    from,
    to,
    schema
  }: {
    from: CRUDModes;
    to: CRUDModes;
    schema: any;
  }) {
    const fields = [];
    const actions = [];

    if (!from || from === 'table') {
      (schema.columns || []).forEach((item: any) => {
        if (!isPlainObject(item)) {
          return;
        } else if (item.type === 'operation') {
          actions.push(...(item?.buttons || []));
        } else {
          fields.push(item);
        }
      });
    } else {
      const name = from === 'cards' ? 'card' : 'listItem';
      fields.push(...(schema?.[name]?.body || []));
      actions.push(...(schema?.[name]?.actions || []));
    }

    // Guaranteed
    fields.length ||
      fields.push(
        ...[
          {
            type: 'text',
            name: schema.labelField || 'label',
            label: 'label'
          },
          {
            type: 'text',
            name: schema.valueField || 'value',
            label: 'value'
          }
        ]
      );

    if (to === 'table') {
      return fields.concat({
        type: 'operation',
        label: 'Operation',
        buttons: actions
      });
    } else if (to === 'cards') {
      return {
        type: 'card',
        header: {
          title: 'Title',
          subTitle: 'Subtitle'
        },
        body: fields,
        actions
      };
    }
    return {
      body: fields,
      actions
    };
  }
}

registerEditorPlugin(CRUDPlugin);

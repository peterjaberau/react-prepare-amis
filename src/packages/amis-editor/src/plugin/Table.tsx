import React from 'react';
import {Button, resolveVariable} from 'amis';
import type {DataScope, SchemaObject} from 'amis';
import {
  getI18nEnabled,
  RendererPluginAction,
  RendererPluginEvent,
  BasePlugin,
  BaseEventContext,
  PluginEvent,
  RegionConfig,
  RendererInfoResolveEventContext,
  BasicRendererInfo,
  PluginInterface,
  InsertEventContext,
  ScaffoldForm,
  registerEditorPlugin,
  repeatArray,
  diff,
  mockValue,
  EditorNodeType,
  defaultValue,
  getSchemaTpl,
  tipedLabel
} from '@/packages/amis-editor-core/src';
import type {EditorManager} from '@/packages/amis-editor-core/src';
import {setVariable, someTree} from '@/packages/amis-core/src';
import {reaction} from 'mobx';
import {DSBuilderManager} from '../builder/DSBuilderManager';
import {
  getEventControlConfig,
  getArgsWrapper,
  buildLinkActionDesc
} from '../renderer/event-control/helper';
import {
  schemaArrayFormat,
  schemaToArray,
  resolveArrayDatasource
} from '../util';
import {getActionCommonProps} from '../renderer/event-control/helper';

export class TablePlugin extends BasePlugin {
  static id = 'TablePlugin';
  // Associated renderer name
  rendererName = 'table';
  $schema = '/schemas/TableSchema.json';

  // Component name
  name = 'Atom table';
  tags = ['show'];
  isBaseComponent = true;
  description =
    'Used to display table data, you can configure column information, and then associate data to complete the display. Supports nesting, super headers, fixed columns, fixed headers, merged cells, etc. The current component needs to configure the data source and does not come with data pulling. Please use the "CRUD" component first. ';
  docLink = '/amis/zh-CN/components/table';
  icon = 'fa fa-table';
  pluginIcon = 'table-plugin';
  scaffold: SchemaObject = {
    type: 'table',
    columns: [
      {
        label: 'column information',
        name: 'a'
      }
    ]
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

  //renderTableContent

  previewSchema: any = {
    type: 'table',
    className: 'text-left m-b-none',
    affixHeader: false,
    items: [
      {a: 1, b: 2},
      {a: 3, b: 4},
      {a: 5, b: 6}
    ],
    columns: [
      {
        label: 'A',
        name: 'a'
      },
      {
        label: 'B',
        name: 'b'
      }
    ]
  };

  get scaffoldForm(): ScaffoldForm {
    const i18nEnabled = getI18nEnabled();
    return {
      title: 'Quickly build a table',
      body: [
        {
          name: 'columns',
          type: 'combo',
          multiple: true,
          label: false,
          addButtonText: 'Add a new column',
          draggable: true,
          items: [
            {
              type: i18nEnabled ? 'input-text-i18n' : 'input-text',
              name: 'label',
              placeholder: 'Title'
            },
            {
              type: 'input-text',
              name: 'name',
              placeholder: 'Bound field name'
            },
            {
              type: 'select',
              name: 'type',
              placeholder: 'type',
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
                // {
                //     value: 'datetime',
                // label: 'Date time'
                // },
                // {
                //     value: 'time',
                // label: 'time'
                // },
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
      canRebuild: true
    };
  }

  panelTitle = 'Table';

  events: RendererPluginEvent[] = [
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
                  title: 'Selected row records'
                },
                unSelectedItems: {
                  type: 'array',
                  title: 'Unselected row record'
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
      actionType: 'select',
      actionLabel: 'Set selected item',
      description: 'Set the selected item of the table',
      innerArgs: ['selected'],
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            set up
            {buildLinkActionDesc(props.manager, info)}
            Selected Items
          </div>
        );
      },
      schema: getArgsWrapper([
        getSchemaTpl('formulaControl', {
          name: 'selected',
          label: 'Selected item',
          variables: '${variables}',
          size: 'lg',
          mode: 'horizontal'
        })
      ])
    },
    {
      actionType: 'selectAll',
      actionLabel: 'Set all selected',
      description: 'Set all table items to be selected',
      ...getActionCommonProps('selectAll')
    },
    {
      actionType: 'clearAll',
      actionLabel: 'Clear selected items',
      description: 'Clear all selected items in the table',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            Clear
            {buildLinkActionDesc(props.manager, info)}
            Selected Items
          </div>
        );
      }
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

  panelJustify = true;

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
              {
                name: 'title',
                type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                label: 'Title'
              },

              isCRUDBody
                ? null
                : getSchemaTpl('sourceBindControl', {
                    label: 'Data source'
                  }),

              {
                name: 'combineNum',
                label: tipedLabel(
                  'Automatically merge cells',
                  'Set the number of columns from left to right to enable automatic merging of cells, and decide whether to merge based on whether the field values ​​are the same.'
                ),
                type: 'input-number',
                labelAlign: 'left',
                horizontal: {
                  left: 5,
                  right: 7
                },
                placeholder: 'Set the number of columns'
              },
              {
                type: 'ae-switch-more',
                mode: 'normal',
                formType: 'extend',
                label: 'head',
                name: 'showHeader',
                pipeIn: (value: any) => value ?? true,
                falseValue: false, // This property mode is processed as true, and cannot be deleted unless the configured header is removed.
                form: {
                  body: [
                    {
                      children: (
                        <Button
                          level="primary"
                          size="sm"
                          block
                          onClick={this.editHeaderDetail.bind(this, context.id)}
                        >
                          Configuring the Header
                        </Button>
                      )
                    }
                  ]
                }
              },
              {
                type: 'ae-switch-more',
                mode: 'normal',
                formType: 'extend',
                label: 'Bottom',
                name: 'showFooter',
                pipeIn: (value: any) => value ?? true,
                falseValue: false, // This property mode is processed as true, and cannot be deleted unless the configured footer is removed
                form: {
                  body: [
                    {
                      children: (
                        <Button
                          level="primary"
                          size="sm"
                          block
                          onClick={this.editFooterDetail.bind(this, context.id)}
                        >
                          Configuration bottom
                        </Button>
                      )
                    }
                  ]
                }
              }

              // {
              //   children: (
              //     <div>
              //       <Button
              //         level="info"
              //         size="sm"
              //         className="m-b-sm"
              //         block
              //         onClick={this.handleAdd}
              //       >
              // Add a new column
              //       </Button>
              //     </div>
              //   )
              // },

              // {
              //   children: (
              //     <div>
              //       <Button
              //         level="success"
              //         size="sm"
              //         block
              //         onClick={this.handleColumnsQuickEdit.bind(this)}
              //       >
              // Quickly edit column information
              //       </Button>
              //     </div>
              //   )
              // }
            ]
          },
          getSchemaTpl('status')
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
                name: 'showIndex',
                label: 'Whether to display the serial number',
                pipeIn: defaultValue(false)
              }),

              getSchemaTpl('switch', {
                name: 'affixHeader',
                label: 'Is the header fixed?',
                pipeIn: defaultValue(true)
              }),

              getSchemaTpl('switch', {
                name: 'footable',
                label: tipedLabel(
                  'Whether to enable single bottom display',
                  'If there are too many columns, the display will be bloated. Consider displaying some columns at the bottom of the current row.'
                ),
                pipeIn: (value: any) => !!value
              }),

              {
                name: 'footable.expand',
                type: 'button-group-select',
                size: 'sm',
                visibleOn: 'this.footable',
                label: 'Bottom expanded by default',
                pipeIn: defaultValue('none'),
                options: [
                  {
                    label: 'The first one',
                    value: 'first'
                  },

                  {
                    label: 'all',
                    value: 'all'
                  },

                  {
                    label: 'Do not expand',
                    value: 'none'
                  }
                ]
              },

              {
                name: 'placeholder',
                pipeIn: defaultValue('No data yet'),
                type: 'input-text',
                label: 'No data prompt'
              },
              {
                name: 'rowClassNameExpr',
                type: 'input-text',
                label: 'Line highlighting rules',
                placeholder: `Support template syntax, such as <%= this.id % 2 ? 'bg-success' : '' %>`
              }
            ]
          },
          {
            title: 'CSS class name',
            body: [
              getSchemaTpl('className', {
                label: 'Outer layer'
              }),

              getSchemaTpl('className', {
                name: 'tableClassName',
                label: 'Table'
              }),

              getSchemaTpl('className', {
                name: 'headerClassName',
                label: 'Top outer layer'
              }),

              getSchemaTpl('className', {
                name: 'footerClassName',
                label: 'Bottom outer layer'
              }),

              getSchemaTpl('className', {
                name: 'toolbarClassName',
                label: 'Toolbar'
              })
            ]
          }
        ])
      },
      isCRUDBody
        ? null
        : {
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

      if (!Array.isArray(arr) || !arr.length) {
        const mockedData: any = {};

        if (Array.isArray(props.columns)) {
          props.columns.forEach((column: any) => {
            if (column.name) {
              setVariable(mockedData, column.name, mockValue(column));
            }
          });
        }

        node.updateState({
          value: repeatArray(mockedData, 1).map((item, index) => ({
            ...item,
            id: index + 1
          }))
        });
      } else {
        // Only take 10 previews, otherwise there will be too much lag
        node.updateState({
          value: arr.slice(0, 3)
        });
      }
    }

    // Edit mode, do not allow the table to adjust width
    props.resizable = false;
    return props;
  }

  // In order to be able to automatically inject data.
  getRendererInfo(
    context: RendererInfoResolveEventContext
  ): BasicRendererInfo | void {
    const plugin: PluginInterface = this;
    const {schema, renderer} = context;
    if (
      !schema.$$id &&
      schema.$$editor?.renderer.name === 'crud' &&
      renderer.name === 'table'
    ) {
      return {
        ...({id: schema.$$editor.id} as any),
        name: plugin.name!,
        regions: plugin.regions,
        patchContainers: plugin.patchContainers,
        vRendererConfig: plugin.vRendererConfig,
        wrapperProps: plugin.wrapperProps,
        wrapperResolve: plugin.wrapperResolve,
        filterProps: plugin.filterProps,
        $schema: plugin.$schema,
        renderRenderer: plugin.renderRenderer
      };
    }
    return super.getRendererInfo(context);
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

    let index = 0;
    const cells: any = columns.children.concat();
    // There is a preview node, limit the number of traversals
    while (cells.length > 0 && index < node.schema.columns.length) {
      const cell = cells.shift() as EditorNodeType;
      // It seems that the cell will only have one child
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
      index++;
    }

    // Collect list members bound to source
    if (node.schema.source) {
      const sourceMatch1 = node.schema.source.match(/\$\{(.*?)\}/);
      const sourceMatch2 = node.schema.source.match(/\$(\w+$)/);
      const source = sourceMatch1
        ? sourceMatch1[1]
        : sourceMatch2
        ? sourceMatch2[1]
        : '';
      let scope: any = this.manager.dataSchema.getScope(
        `${node.info.id}-${node.info.type}`
      );

      while (scope) {
        const rowMembers: any = scope.schemas.find(
          (item: any) => item.properties?.[source]
        );

        if (rowMembers) {
          itemsSchema = {
            ...itemsSchema,
            properties: {
              ...itemsSchema.properties,
              ...(rowMembers.properties?.[source] as any)?.items?.properties
            }
          };
        }
        scope = rowMembers ? undefined : scope.parent;
      }
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
      $id: `${node.id}-${node.type}`,
      type: 'object',
      properties: {
        rows: {
          type: 'array',
          title: 'Data List',
          items: itemsSchema
        },
        selectedItems: {
          type: 'array',
          title: 'Selected row',
          items: itemsSchema
        },
        unSelectedItems: {
          type: 'array',
          title: 'Unselected row',
          items: itemsSchema
        }
      }
    };
  }

  async getAvailableContextFields(
    scopeNode: EditorNodeType,
    node: EditorNodeType,
    region?: EditorNodeType
  ) {
    if (node?.info?.renderer?.name === 'table-cell') {
      if (
        scopeNode.parent?.type === 'service' &&
        scopeNode.parent?.parent?.path?.endsWith('service')
      ) {
        return scopeNode.parent.parent.info.plugin.getAvailableContextFields?.(
          scopeNode.parent.parent,
          node,
          region
        );
      }
    }

    const builder = this.dsManager.getBuilderBySchema(scopeNode.schema);

    if (builder && scopeNode.schema.api) {
      return builder.getAvailableContextFields(
        {
          schema: scopeNode.schema,
          sourceKey: 'api',
          feat: 'List'
        },
        node
      );
    }
  }

  editHeaderDetail(id: string) {
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id);
    const value = store.getValueOf(id);

    const defaultHeader = {
      type: 'tpl',
      tpl: 'head',
      wrapperComponent: ''
    };

    node &&
      value &&
      this.manager.openSubEditor({
        title: 'Configure Header',
        value: schemaToArray(value.header ?? defaultHeader),
        slot: {
          type: 'container',
          body: '$$'
        },
        onChange: newValue => {
          newValue = {...value, header: schemaArrayFormat(newValue)};
          manager.panelChangeValue(newValue, diff(value, newValue));
        }
      });
  }

  editFooterDetail(id: string) {
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id);
    const value = store.getValueOf(id);

    const defaultFooter = {
      type: 'tpl',
      tpl: 'Bottom',
      wrapperComponent: ''
    };

    node &&
      value &&
      this.manager.openSubEditor({
        title: 'Configure bottom',
        value: schemaToArray(value.footer ?? defaultFooter),
        slot: {
          type: 'container',
          body: '$$'
        },
        onChange: newValue => {
          newValue = {...value, footer: schemaArrayFormat(newValue)};
          manager.panelChangeValue(newValue, diff(value, newValue));
        }
      });
  }

  unWatchWidthChange: {[propName: string]: () => void} = {};
  componentRef(node: EditorNodeType, ref: any) {
    if (ref) {
      const store = ref.props.store;
      this.unWatchWidthChange[node.id] = reaction(
        () =>
          store.columns.map((column: any) => column.pristine.width).join(','),
        () => {
          ref.updateTableInfoLazy(() => {
            this.manager.store.highlightNodes.forEach(node =>
              node.calculateHighlightBox()
            );
          });
        }
      );
    } else {
      this.unWatchWidthChange[node.id]?.();
    }
  }
}

registerEditorPlugin(TablePlugin);

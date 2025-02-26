import {setVariable, someTree} from 'amis-core';
import {
  BaseEventContext,
  BasePlugin,
  registerEditorPlugin,
  defaultValue,
  getSchemaTpl,
  RendererPluginEvent,
  RendererPluginAction,
  tipedLabel,
  mockValue,
  RegionConfig,
  getI18nEnabled,
  EditorNodeType,
  EditorManager
} from '@/packages/amis-editor-core/src';
import {DSBuilderManager} from '../../builder/DSBuilderManager';
import {ValidatorTag} from '../../validator';
import {
  getArgsWrapper,
  getEventControlConfig,
  getActionCommonProps,
  buildLinkActionDesc
} from '../../renderer/event-control/helper';
import {generateId, resolveInputTableEventDataSchame} from '../../util';
import React from 'react';

export class ComboControlPlugin extends BasePlugin {
  static id = 'ComboControlPlugin';
  // Associated renderer name
  rendererName = 'combo';
  $schema = '/schemas/ComboControlSchema.json';

  // Component name
  name = 'Combined Input';
  isBaseComponent = true;
  icon = 'fa fa-group';
  pluginIcon = 'combo-plugin';
  description =
    'A combination of multiple form items, you can configure whether to add or delete the initial template';
  docLink = '/amis/zh-CN/components/form/combo';
  tags = ['form item'];
  scaffold = {
    type: 'combo',
    label: 'Combined input',
    name: 'combo',
    multiple: true,
    addable: true,
    removable: true,
    removableMode: 'icon',
    addBtn: {
      label: 'New',
      icon: 'fa fa-plus',
      level: 'primary',
      size: 'sm'
    },
    items: [
      {
        type: 'input-text',
        name: 'text',
        placeholder: 'text',
        id: generateId()
      },
      {
        type: 'select',
        name: 'select',
        placeholder: 'options',
        id: generateId(),
        options: [
          {
            label: 'A',
            value: 'a'
          },
          {
            label: 'B',
            value: 'b'
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
        ...this.scaffold,
        value: [{text: 'Row 1', select: 'a'}, {}]
      }
    ]
  };

  //Container configuration
  regions: Array<RegionConfig> = [
    {
      key: 'items',
      label: 'Content area',
      preferTag: 'content area',
      renderMethod: 'renderItems'
    }
  ];

  // Event definition
  events: RendererPluginEvent[] = [
    {
      eventName: 'add',
      eventLabel: 'Add',
      description: 'Triggered when adding a combination item',
      dataSchema: (manager: EditorManager) => {
        const {value} = resolveInputTableEventDataSchame(manager);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  value: {
                    type: 'string',
                    ...value,
                    title: 'Value of the combined item'
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
      eventLabel: 'Delete',
      description: 'Delete combination item',
      dataSchema: (manager: EditorManager) => {
        const {value, item} = resolveInputTableEventDataSchame(manager);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  key: {
                    type: 'number',
                    title: 'Deleted index'
                  },
                  value: {
                    type: 'string',
                    ...value,
                    title: 'Value of the combined item'
                  },
                  item: {
                    type: 'object',
                    ...item,
                    title: 'Deleted items'
                  }
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'dragEnd',
      eventLabel: 'Drag ends',
      description:
        'Triggered when the drag of the combination item ends and the position changes',
      dataSchema: (manager: EditorManager) => {
        const {value, item} = resolveInputTableEventDataSchame(manager);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  index: {
                    type: 'number',
                    title: 'Index after dragging'
                  },
                  previousIndex: {
                    type: 'number',
                    title: 'Index before dragging'
                  },
                  item: {
                    type: 'object',
                    ...item,
                    title: 'Dragged item'
                  },
                  value: {
                    type: 'string',
                    ...value,
                    title: 'The value of the combined item before dragging'
                  },
                  oldValue: {
                    type: 'string',
                    ...value,
                    title: 'The value of the combined item after dragging'
                  }
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'tabsChange',
      eventLabel: 'Switch tab',
      description:
        'When tabsMode is set to true, it is triggered when switching tabs',
      dataSchema: (manager: EditorManager) => {
        const {value, item} = resolveInputTableEventDataSchame(manager);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  key: {
                    type: 'number',
                    title: 'Tab Index'
                  },
                  value: {
                    type: 'string',
                    ...value,
                    title: 'Value of the combined item'
                  },
                  item: {
                    type: 'object',
                    ...item,
                    title: 'Activated item'
                  }
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
      description: 'Clear selected value',
      ...getActionCommonProps('clear')
    },
    {
      actionType: 'reset',
      actionLabel: 'Reset',
      description: 'Reset the value to the initial value',
      ...getActionCommonProps('reset')
    },
    {
      actionType: 'addItem',
      actionLabel: 'Add item',
      description: 'Add new item',
      innerArgs: ['item'],
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            {buildLinkActionDesc(props.manager, info)}
            Add Item
          </div>
        );
      },
      schema: getArgsWrapper({
        type: 'combo',
        label: 'Add item',
        name: 'item',
        draggable: false,
        multiple: true,
        removable: true,
        required: true,
        addable: true,
        strictMode: false,
        canAccessSuperData: true,
        mode: 'horizontal',
        items: [
          {
            name: 'key',
            type: 'input-text',
            required: true,
            placeholder: 'variable name',
            source: '${__setValueDs}'
          },
          getSchemaTpl('formulaControl', {
            name: 'val',
            variables: '${variables}',
            inputMode: 'input-group'
          })
        ]
      })
    },
    {
      actionType: 'setValue',
      actionLabel: 'Assignment',
      description: 'Trigger component data update',
      ...getActionCommonProps('setValue')
    }
  ];

  panelTitle = 'Combination Input';

  notRenderFormZone = true;

  panelJustify = true;

  dsManager: DSBuilderManager;

  constructor(manager: EditorManager) {
    super(manager);
    this.dsManager = new DSBuilderManager(manager);
  }

  panelBodyCreator = (context: BaseEventContext) => {
    const i18nEnabled = getI18nEnabled();
    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              className: 'p-none',
              title: 'Common',
              body: [
                getSchemaTpl('formItemName', {
                  required: true
                }),
                getSchemaTpl('label'),

                getSchemaTpl('valueFormula', {
                  rendererSchema: {
                    ...context?.schema,
                    type: 'textarea'
                  },
                  label: tipedLabel(
                    'default value',
                    'Supports relative value usage such as <code>now, +1day, -2weeks, +1hours, +2years</code>'
                  ),
                  pipeOut: (value: any) => {
                    try {
                      return typeof JSON.parse(value) === 'number'
                        ? value
                        : JSON.parse(value);
                    } catch (err) {
                      return value;
                    }
                  }
                }),
                // The multiple selection mode is bound to the number of items, so multiple selection is set and the number of items is enabled
                getSchemaTpl('switch', {
                  name: 'multiple',
                  label: 'Multiple selections possible',
                  pipeIn: defaultValue(true),
                  onChange: (
                    value: any,
                    oldValue: any,
                    model: any,
                    form: any
                  ) => {
                    form.setValueByName('addable', value);
                    form.setValueByName('removable', value);
                    !value && form.setValueByName('draggable', false);
                    form.setValueByName('flat', false);
                  }
                }),
                {
                  type: 'container',
                  className: 'ae-ExtendMore mb-3',
                  visibleOn: 'this.multiple',
                  body: [
                    {
                      label: 'Maximum number of entries',
                      name: 'maxLength',
                      type: 'input-number'
                    },
                    {
                      label: 'Minimum number of entries',
                      name: 'minLength',
                      type: 'input-number'
                    }
                  ]
                },
                getSchemaTpl('switch', {
                  name: 'flat',
                  label: tipedLabel(
                    'Tie value',
                    'The default data structure in the array is an object. If there is only one form item, you can configure it to flatten the value, and then the value of that form item will be placed in the array'
                  ),
                  visibleOn:
                    'Array.isArray(this.items) && this.items.length === 1 && this.multiple'
                }),
                {
                  type: 'container',
                  className: 'ae-ExtendMore mb-3',
                  visibleOn: 'this.multiple && this.flat',
                  body: [getSchemaTpl('joinValues'), getSchemaTpl('delimiter')]
                },
                // Sortable, sorting has nothing to do with adding, but is related to the multiple selection mode
                getSchemaTpl('switch', {
                  name: 'draggable',
                  label: 'Sortable',
                  pipeIn: defaultValue(false),
                  visibleOn: 'this.multiple'
                }),
                {
                  type: 'container',
                  className: 'ae-ExtendMore mb-3',
                  visibleOn: 'this.draggable',
                  body: [getSchemaTpl('draggableTip')]
                },

                // Can be added
                getSchemaTpl('switch', {
                  name: 'addable',
                  label: tipedLabel(
                    'Can be added',
                    'If you need to expand custom new functions, you can expand them by configuring components-new items'
                  ),
                  visibleOn: 'this.multiple',
                  pipeIn: defaultValue(false),
                  onChange: (
                    value: any,
                    oldValue: any,
                    model: any,
                    form: any
                  ) => {
                    if (value) {
                      form.setValueByName('addBtn', {
                        label: 'New',
                        icon: 'fa fa-plus',
                        level: 'primary',
                        size: 'sm'
                      });
                    }
                  }
                }),

                // Can be deleted
                getSchemaTpl('switch', {
                  name: 'removable',
                  label: 'Can be deleted',
                  pipeIn: defaultValue(false),
                  visibleOn: 'this.multiple',
                  onChange: (
                    value: any,
                    oldValue: any,
                    model: any,
                    form: any
                  ) => {
                    if (value) {
                      form.setValueByName('removableMode', 'icon');
                      form.setValueByName('deleteIcon', undefined);
                      form.setValueByName('deleteBtn', undefined);
                    }
                  }
                }),
                {
                  type: 'container',
                  className: 'ae-ExtendMore mb-3',
                  visibleOn: 'this.removable',
                  body: [
                    // Custom delete button switch
                    {
                      type: 'button-group-select',
                      name: 'removableMode',
                      label: 'Button mode',
                      options: [
                        {
                          label: 'icon',
                          value: 'icon'
                        },
                        {
                          label: 'button',
                          value: 'button'
                        }
                      ],
                      onChange: (
                        value: any,
                        oldValue: any,
                        model: any,
                        form: any
                      ) => {
                        if (value === 'icon') {
                          form.setValueByName('deleteBtn', undefined);
                        } else if (value === 'button') {
                          form.setValueByName('deleteBtn', {
                            label: 'Delete',
                            level: 'default'
                          });
                        }
                      }
                    },
                    // getSchemaTpl('icon', {
                    //   name: 'deleteIcon',
                    // label: 'icon',
                    //   visibleOn: 'this.removableMode === "icon"'
                    // }),
                    {
                      label: 'copywriting',
                      name: 'deleteBtn.label',
                      type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                      visibleOn: 'this.removableMode === "button"'
                    },
                    getSchemaTpl('buttonLevel', {
                      label: 'Style',
                      name: 'deleteBtn.level',
                      visibleOn: 'this.removableMode === "button"'
                    }),
                    getSchemaTpl('apiControl', {
                      name: 'deleteApi',
                      label: 'Delete',
                      renderLabel: false,
                      mode: 'normal'
                    }),
                    getSchemaTpl('deleteConfirmText')
                  ]
                },

                {
                  type: 'select',
                  name: '__uniqueItems',
                  label: 'Configure unique item',
                  source: '${items|pick:name}',
                  pipeIn: (value: any, form: any) => {
                    // Get the name of the item with unique: true set from items
                    const items = form.data.items || [];
                    return items
                      .filter((item: any) => item.unique)
                      .map((item: any) => item.name);
                  },
                  onChange: (
                    value: string[],
                    oldValue: any,
                    model: any,
                    form: any
                  ) => {
                    // Get the current items
                    const items = [...(form.data.items || [])];
                    // Modify the unique attribute in items
                    const updatedItems = items.map(item => {
                      if (value === item.name) {
                        return {...item, unique: true};
                      } else {
                        const newItem = {...item};
                        delete newItem.unique;
                        return newItem;
                      }
                    });
                    // Update items
                    form.setValueByName('items', updatedItems);
                  }
                },
                getSchemaTpl('labelRemark'),
                getSchemaTpl('remark'),

                getSchemaTpl('placeholder'),
                getSchemaTpl('description')
              ]
            },
            getSchemaTpl('collapseGroup', [
              {
                className: 'p-none',
                title: 'Advanced',
                body: [
                  getSchemaTpl('switch', {
                    name: 'canAccessSuperData',
                    label: 'Automatically fill in parent variables',
                    pipeIn: defaultValue(false)
                  }),

                  getSchemaTpl('switch', {
                    name: 'strictMode',
                    label: tipedLabel(
                      'Strict mode',
                      'If you want the value of the environment variable to be passed to the Combo in real time, please turn this option off.'
                    ),
                    value: true
                  }),

                  getSchemaTpl('combo-container', {
                    name: 'syncFields',
                    visibleOn: '!this.strictMode',
                    label: tipedLabel(
                      'Synchronize Field',
                      'If the combo level is deep, the data obtained from the bottom layer may not be synchronized with the outer layer. However, configuring this property for the combo can synchronize them.'
                    ),
                    type: 'combo',
                    mode: 'normal',
                    multiple: true,
                    canAccessSuperData: true,
                    items: [
                      {
                        name: 'field',
                        type: 'input-text'
                      }
                    ],
                    value: [],
                    pipeIn(value?: Array<string>) {
                      return (value ?? []).map(item => ({field: item}));
                    },
                    pipeOut(value?: Array<{field: string}>) {
                      return (value ?? []).map(item => {
                        const keys = Object.keys(item);
                        return keys.length > 0 ? item.field : '';
                      });
                    }
                  }),

                  getSchemaTpl('switch', {
                    name: 'lazyLoad',
                    label: tipedLabel(
                      'Lazy loading',
                      'If there is a lot of data and it is slow, you can turn on this configuration item'
                    ),
                    pipeIn: defaultValue(false),
                    visibleOn: 'this.multiple && !this.tabsMode'
                  })
                ]
              }
            ]),
            getSchemaTpl('status', {
              isFormItem: true,
              readonly: true
            }),
            getSchemaTpl('validation', {tag: ValidatorTag.MultiSelect})
          ])
        ]
      },
      {
        title: 'Appearance',
        className: 'p-none',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            visibleOn: 'this.multiple',
            body: [
              {
                name: 'tabsMode',
                label: 'Display format',
                type: 'button-group-select',
                inputClassName: 'items-center',
                size: 'sm',
                options: [
                  {label: 'Form', value: false},
                  {label: 'Tab', value: true}
                ],
                pipeIn: defaultValue(false),
                onChange: (
                  value: any,
                  oldValue: any,
                  model: any,
                  form: any
                ) => {
                  if (value) {
                    form.setValueByName('lazyLoad', undefined);
                  }
                }
              },
              {
                type: 'container',
                className: 'ae-ExtendMore mb-3',
                visibleOn: 'this.tabsMode',
                body: [
                  {
                    type: 'select',
                    name: 'tabsStyle',
                    label: 'Style',
                    pipeIn: defaultValue(''),
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
                        label: 'Card',
                        value: 'card'
                      },
                      {
                        label: 'Selector',
                        value: 'radio'
                      }
                    ]
                  },
                  getSchemaTpl('formulaControl', {
                    label: 'Title template',
                    name: 'tabsLabelTpl'
                  })
                ]
              },
              // Form multi-line display
              getSchemaTpl('switch', {
                name: 'multiLine',
                label: 'Multi-line display',
                pipeIn: defaultValue(false),
                visibleOn: '!this.tabsMode',
                onChange: (
                  value: boolean,
                  oldValue: any,
                  model: any,
                  form: any
                ) => {
                  if (!value) {
                    form.setValueByName('subFormMode', undefined);
                    form.setValueByName('noBorder', undefined);
                  }
                }
              }),
              getSchemaTpl('switch', {
                visibleOn: '!this.tabsMode && this.multiLine',
                name: 'noBorder',
                label: 'Remove border',
                pipeIn: defaultValue(false)
              })
            ]
          },
          getSchemaTpl('style:formItem', {
            renderer: context.info.renderer,
            schema: [
              getSchemaTpl('subFormItemMode', {
                visibleOn: 'this.multiLine',
                type: 'select',
                label: 'Subform'
              })
            ]
          }),
          getSchemaTpl('style:classNames')
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
      // Display at least one member, otherwise display nothing.
      if (
        props.multiple &&
        !props.value &&
        !props.$schema.value &&
        !props.$ref
      ) {
        const mockedData = {};
        if (Array.isArray(props.items) && props.items.length === 0) {
          props.items.forEach((control: any) => {
            control.name &&
              setVariable(mockedData, control.name, mockValue(control));
          });
        }
        node.updateState({
          value: [mockedData]
        });
      }
    }
    return props;
  }

  async buildDataSchemas(
    node: EditorNodeType,
    region?: EditorNodeType,
    trigger?: EditorNodeType,
    parent?: EditorNodeType
  ) {
    const itemsSchema: any = {
      $id: `${node.id}-${node.type}-tableRows`,
      type: 'object',
      properties: {}
    };
    const items = node.children?.find(
      child => child.isRegion && child.region === 'items'
    );
    const parentScopeId = `${parent?.id}-${parent?.type}${
      node.parent?.type === 'cell' ? '-currentRow' : ''
    }`;
    let isColumnChild = false;

    if (trigger && items) {
      isColumnChild = someTree(items.children, item => item.id === trigger?.id);

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

    const pool = items?.children?.concat() || [];

    while (pool.length) {
      const current = pool.shift() as EditorNodeType;
      const schema = current.schema;
      if (schema?.name) {
        const tmpSchema = await current.info.plugin.buildDataSchemas?.(
          current,
          region,
          trigger,
          node
        );
        itemsSchema.properties[schema.name] = {
          tmpSchema,
          ...(tmpSchema?.$id ? {} : {$id: `${current!.id}-${current!.type}`})
        };
      }
    }

    if (isColumnChild) {
      const scopeId = `${node.id}-${node.type}-currentRow`;
      const scope = this.manager.dataSchema.getScope(scopeId);
      scope?.addSchema(itemsSchema);
    }

    if (node.schema?.multiple) {
      return {
        $id: 'combo',
        type: 'array',
        title: node.schema?.label || node.schema?.name,
        items: itemsSchema
      };
    }

    return {
      ...itemsSchema,
      title: node.schema?.label || node.schema?.name
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
      (target.parent.isRegion && target.parent.region === 'items')
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

registerEditorPlugin(ComboControlPlugin);

import {
  EditorManager,
  EditorNodeType,
  getI18nEnabled,
  RendererPluginAction,
  RendererPluginEvent,
  defaultValue,
  getSchemaTpl,
  registerEditorPlugin,
  BaseEventContext,
  BasePlugin,
  tipedLabel,
  diff
} from 'amis-editor-core';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';
import {ValidatorTag} from '../../validator';
import {
  resolveOptionEventDataSchame,
  resolveOptionType,
  schemaArrayFormat,
  schemaToArray,
  TREE_BASE_EVENTS
} from '../../util';
import {TreeCommonAction} from './InputTree';
import {inputStateTpl} from '../../renderer/style-control/helper';

export class TreeSelectControlPlugin extends BasePlugin {
  static id = 'TreeSelectControlPlugin';
  // Associated renderer name
  rendererName = 'tree-select';
  $schema = '/schemas/TreeSelectControlSchema.json';

  // Component name
  name = 'Tree component';
  isBaseComponent = true;
  disabledRendererPlugin = true;
  icon = 'fa fa-list-alt';
  pluginIcon = 'tree-select-plugin';
  description =
    'Tree structure selection, supports appearance switching between [embedded mode] and [floating mode]';
  searchKeywords =
    'tree, tree drop-down, tree drop-down box, tree-select, tree selection box, tree selector';
  docLink = '/amis/zh-CN/components/form/treeselect';
  tags = ['form item'];
  scaffold = {
    type: 'tree-select',
    label: 'Tree component',
    name: 'tree',
    clearable: false,
    options: [
      {
        label: 'Option A',
        value: 'A',
        children: [
          {
            label: 'Option C',
            value: 'C'
          },
          {
            label: 'Option D',
            value: 'D'
          }
        ]
      },

      {
        label: 'Option B',
        value: 'B'
      }
    ]
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: {
      ...this.scaffold,
      label: 'Tree component - floating mode',
      mode: 'normal'
    }
  };
  defaultItemAction = {
    type: 'container',
    body: [
      {
        type: 'button',
        icon: 'fa fa-plus',
        level: 'link',
        size: 'xs'
      }
    ]
  };

  notRenderFormZone = true;

  panelTitle = 'Tree Selection';

  // Event definition
  events: (schema: any) => RendererPluginEvent[] = (schema: any) => [
    ...TREE_BASE_EVENTS(schema),
    {
      eventName: 'focus',
      eventLabel: 'Get focus',
      description: 'Triggered when the input box gets focus',
      dataSchema: (manager: EditorManager) => {
        const {value, items, itemSchema} =
          resolveOptionEventDataSchame(manager);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  value,
                  item: {
                    type: 'object',
                    title: 'Selected Item',
                    properties: itemSchema
                  },
                  items
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'blur',
      eventLabel: 'Lost focus',
      description: 'Triggered when the input box loses focus',
      dataSchema: (manager: EditorManager) => {
        const {value, items, itemSchema} =
          resolveOptionEventDataSchame(manager);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  value,
                  item: {
                    type: 'object',
                    title: 'Selected Item',
                    properties: itemSchema
                  },
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
    /** Add, edit, delete */
    ...TreeCommonAction,
    {
      actionType: 'clear',
      actionLabel: 'Clear',
      description: 'Clear data',
      ...getActionCommonProps('clear')
    },
    {
      actionType: 'reset',
      actionLabel: 'Reset',
      description: 'Reset data',
      ...getActionCommonProps('reset')
    },
    {
      actionType: 'setValue',
      actionLabel: 'Assignment',
      description: 'Trigger component data update',
      ...getActionCommonProps('setValue')
    },
    {
      actionType: 'reload',
      actionLabel: 'Reload',
      description: 'Trigger component data refresh and re-rendering',
      ...getActionCommonProps('reload')
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

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    const renderer: any = context.info.renderer;
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
                type: 'button-group-select',
                name: 'type',
                label: 'mode',
                pipeIn: defaultValue('tree-select'),
                options: [
                  {
                    label: 'embedded',
                    value: 'input-tree'
                  },
                  {
                    label: 'Floating layer',
                    value: 'tree-select'
                  }
                ]
              },
              getSchemaTpl('clearable', {
                mode: 'horizontal',
                horizontal: {
                  justify: true,
                  left: 8
                },
                value: false,
                inputClassName: 'is-inline ',
                visibleOn: 'this.type === "tree-select"'
              }),
              getSchemaTpl('switch', {
                label: 'Retrievable',
                name: 'searchable'
              }),
              getSchemaTpl('apiControl', {
                name: 'searchApi',
                label: 'Option search interface',
                labelClassName: 'none',
                visibleOn: 'this.type === "input-tree" && this.searchable'
              }),
              getSchemaTpl('multiple', {
                body: [
                  {
                    type: 'input-number',
                    label: tipedLabel(
                      'Minimum number of nodes',
                      'Minimum number of nodes selected for form validation'
                    ),
                    name: 'minLength',
                    min: 0
                  },
                  {
                    type: 'input-number',
                    label: tipedLabel(
                      'Maximum number of nodes',
                      'The maximum number of nodes selected in form verification'
                    ),
                    name: 'maxLength',
                    min: 0
                  }
                ]
              }),
              getSchemaTpl('switch', {
                label: tipedLabel(
                  'Automatic selection of child nodes',
                  'When the parent node is selected, cascade select child nodes'
                ),
                name: 'autoCheckChildren',
                hiddenOn: '!this.multiple',
                value: true
              }),
              getSchemaTpl('switch', {
                label: tipedLabel(
                  'Child nodes can be reversed',
                  'Child nodes can be inverted, and the value includes the parent and child nodes'
                ),
                name: 'cascade',
                hiddenOn: '!this.multiple || !this.autoCheckChildren'
              }),
              getSchemaTpl('switch', {
                label: tipedLabel(
                  'Deselect the child node and cancel the parent node',
                  'Cancel the selection of any child node and cancel the selection of the parent node'
                ),
                name: 'autoCancelParent',
                hiddenOn: '!this.multiple || !this.cascade'
              }),
              getSchemaTpl('switch', {
                label: tipedLabel(
                  'Value contains parent node',
                  'When the parent node is selected, the value will contain the values ​​of the parent and child nodes, otherwise only the value of the parent node will be retained'
                ),
                name: 'withChildren',
                hiddenOn:
                  '!this.multiple || !this.autoCheckChildren && this.cascade'
              }),
              getSchemaTpl('switch', {
                label: tipedLabel(
                  'Value contains only child nodes',
                  'UI behavior cascades to select child nodes, child nodes can be deselected, and the value only contains the value of the child node'
                ),
                name: 'onlyChildren',
                hiddenOn: '!this.multiple  || !this.autoCheckChildren'
              }),

              getSchemaTpl('valueFormula', {
                rendererSchema: {
                  ...context?.schema,
                  type: 'tree-select'
                },
                visibleOn: 'this.options && this.options.length > 0'
              }),

              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('placeholder'),
              getSchemaTpl('description')
            ]
          },
          {
            title: 'Options',
            body: [
              getSchemaTpl('treeOptionControl', {
                label: 'data',
                showIconField: true
              }),
              // Custom options template
              getSchemaTpl('optionsMenuTpl', {
                manager: this.manager
              }),
              getSchemaTpl('apiControl', {
                name: 'deferApi',
                label: 'Lazy loading interface',
                labelClassName: 'none'
              }),
              getSchemaTpl('deferField'),
              getSchemaTpl(
                'loadingConfig',
                {
                  visibleOn: 'this.source || !this.options'
                },
                {context}
              ),
              {
                type: 'checkboxes',
                name: 'nodeBehavior',
                label: 'Node behavior',
                value: ['check'],
                joinValues: false,
                extractValue: true,
                inline: true,
                options: [
                  {
                    label: 'Selected',
                    value: 'check'
                  },
                  {
                    label: 'Expand',
                    value: 'unfold'
                  }
                ]
              },
              getSchemaTpl('switch', {
                label: 'Only leaf nodes can be selected',
                name: 'onlyLeaf'
              }),
              /** New options */
              getSchemaTpl('optionAddControl', {
                manager: this.manager,
                collections: [
                  getSchemaTpl('switch', {
                    label: 'Top level can be added',
                    value: true,
                    name: 'rootCreatable'
                  }),
                  {
                    type: 'input-text',
                    label: 'Root node copy',
                    value: 'Add a first-level node',
                    name: 'rootCreateTip',
                    hiddenOn: '!this.rootCreatable'
                  },
                  {
                    type: 'input-text',
                    label: 'Add text prompt',
                    value: 'Add child node',
                    name: 'createTip'
                  }
                ]
              }),
              /** Edit options */
              getSchemaTpl('optionEditControl', {
                manager: this.manager,
                collections: [
                  {
                    type: 'input-text',
                    label: 'Edit copy tips',
                    value: 'Edit this node',
                    name: 'editTip'
                  }
                ]
              }),
              /** Delete option */
              getSchemaTpl('optionDeleteControl', {
                manager: this.manager,
                collections: [
                  {
                    type: 'input-text',
                    label: 'Delete copywriting tips',
                    value: 'Remove this node',
                    name: 'removeTip'
                  }
                ]
              }),
              {
                type: 'select',
                label: 'Operation bar position',
                value: '',
                name: 'themeCss.actionControlClassName.marginLeft',
                options: [
                  {
                    label: 'left side',
                    value: ''
                  },
                  {
                    label: 'right side',
                    value: 'auto'
                  }
                ]
              },
              {
                type: 'ae-switch-more',
                mode: 'normal',
                label: 'Custom operation',
                bulk: false,
                name: 'itemActions',
                formType: 'extend',
                defaultData: this.defaultItemAction,
                form: {
                  body: [
                    {
                      type: 'button',
                      level: 'primary',
                      size: 'sm',
                      block: true,
                      onClick: this.editDetail.bind(this, context.id),
                      label: 'Configure custom operation template'
                    }
                  ]
                }
              }
            ]
          },
          {
            title: 'Advanced',
            body: [
              getSchemaTpl('valueFormula', {
                name: 'highlightTxt',
                label: 'Highlight node character',
                visibleOn: 'this.type === "input-tree"'
              }),
              {
                type: 'ae-Switch-More',
                mode: 'normal',
                name: 'enableNodePath',
                label: tipedLabel(
                  'The option value contains the parent node',
                  'After turning it on, the corresponding node value will include the parent node'
                ),
                falseValue: false,
                formType: 'extend',
                autoFocus: false,
                form: {
                  body: [
                    {
                      type: 'input-text',
                      label: 'Path separator',
                      value: '/',
                      name: 'pathSeparator'
                    }
                  ]
                }
              },
              {
                type: 'ae-Switch-More',
                mode: 'normal',
                name: 'hideRoot',
                label: 'Show top nodes',
                trueValue: false,
                falseValue: true,
                formType: 'extend',
                autoFocus: false,
                form: {
                  body: [
                    {
                      type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                      label: 'Node copy',
                      value: 'Top',
                      name: 'rootLabel'
                    }
                  ]
                },
                visibleOn: 'this.type === "input-tree"'
              },
              getSchemaTpl('switch', {
                label: tipedLabel(
                  'Option text only displays selected nodes',
                  'Hide the text information of the ancestor nodes of the selected node in the selection box'
                ),
                name: 'hideNodePathLabel',
                visibleOn: 'this.type==="tree-select"'
              }),
              getSchemaTpl('switch', {
                label: 'Show node icon',
                name: 'showIcon',
                value: true
              }),
              getSchemaTpl('switch', {
                label: tipedLabel(
                  'Show node checkbox',
                  'In the case of single selection, the tree node check box can also be displayed'
                ),
                name: 'showRadio',
                hiddenOn: 'this.multiple'
              }),
              getSchemaTpl('switch', {
                label: tipedLabel(
                  'Show level expansion line',
                  'Show tree level expansion line'
                ),
                name: 'showOutline'
              }),
              {
                type: 'ae-Switch-More',
                mode: 'normal',
                name: 'initiallyOpen',
                label: tipedLabel(
                  'Custom expansion level',
                  'By default, all node levels are expanded. After turning it on, you can customize the number of expanded levels'
                ),
                trueValue: false,
                falseValue: true,
                formType: 'extend',
                autoFocus: false,
                form: {
                  body: [
                    {
                      type: 'input-number',
                      label: 'Set level',
                      name: 'unfoldedLevel',
                      value: 1,
                      min: 0
                    }
                  ]
                }
              },
              getSchemaTpl('virtualThreshold'),
              getSchemaTpl('virtualItemHeight')
            ]
          },
          getSchemaTpl('status', {
            isFormItem: true
          }),
          getSchemaTpl('validation', {tag: ValidatorTag.Tree})
        ])
      },
      {
        title: 'Appearance',
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('theme:formItem'),
          getSchemaTpl('theme:form-label'),
          getSchemaTpl('theme:form-description'),
          {
            title: 'Input box style',
            body: [
              ...inputStateTpl(
                'themeCss.inputControlClassName',
                '--input-default'
              )
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

  buildDataSchemas(node: EditorNodeType, region: EditorNodeType) {
    const type = resolveOptionType(node.schema);
    // todo: asynchronous data case
    let dataSchema: any = {
      type,
      title: node.schema?.label || node.schema?.name,
      originalValue: node.schema?.value // Record the original value, required for circular reference detection
    };

    if (node.schema?.joinValues === false) {
      dataSchema = {
        ...dataSchema,
        type: 'object',
        title: node.schema?.label || node.schema?.name,
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
      };
    }

    if (node.schema?.multiple) {
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
            properties: dataSchema.properties
          },
          originalValue: dataSchema.originalValue
        };
      }
    }

    return dataSchema;
  }

  getSubEditorVariable(schema: any): Array<{label: string; children: any}> {
    let labelField = schema?.labelField || 'label';
    let valueField = schema?.valueField || 'value';

    return [
      {
        label: 'Node options',
        children: [
          {
            label: 'node index',
            value: 'index'
          },
          {
            label: 'node name',
            value: labelField
          },
          {
            label: 'node value',
            value: valueField
          },
          {
            label: 'node status',
            value: 'checked'
          }
        ]
      }
    ];
  }

  getDisplayField(data: any) {
    if (
      data.source ||
      (data.map &&
        Array.isArray(data.map) &&
        data.map[0] &&
        Object.keys(data.map[0]).length > 1)
    ) {
      return data.labelField ?? 'label';
    }
    return 'item';
  }

  editDetail(id: string) {
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id);
    const value = store.getValueOf(id);
    const defaultItemSchema = this.defaultItemAction;
    let originData = value.itemActions;

    if (originData.type && originData.type !== 'container') {
      originData = {
        type: 'container',
        body: [originData]
      };
    } else {
      originData = originData ?? defaultItemSchema;
    }

    node &&
      value &&
      this.manager.openSubEditor({
        title: 'Configure custom operation template',
        value: originData,
        onChange: (newValue: any) => {
          newValue = {...value, itemActions: newValue};
          manager.panelChangeValue(newValue, diff(value, newValue));
        }
      });
  }
}

registerEditorPlugin(TreeSelectControlPlugin);

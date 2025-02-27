import {
  EditorManager,
  EditorNodeType,
  RendererPluginAction,
  RendererPluginEvent,
  getSchemaTpl,
  registerEditorPlugin,
  BasePlugin,
  BaseEventContext,
  tipedLabel
} from '@/packages/amis-editor-core/src';
import type {Schema} from '@/packages/src';
import {ValidatorTag} from '../../validator';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';
import {resolveOptionEventDataSchame, resolveOptionType} from '../../util';
import {inputStateTpl} from '../../renderer/style-control/helper';

export class NestedSelectControlPlugin extends BasePlugin {
  static id = 'NestedSelectControlPlugin';
  // Associated renderer name
  rendererName = 'nested-select';
  $schema = '/schemas/NestedSelectControlSchema.json';

  // Component name
  name = 'Cascade Selector';
  isBaseComponent = true;
  icon = 'fa fa-indent';
  pluginIcon = 'nested-select-plugin';
  description =
    'Applicable to options containing sub-items, options can be pulled through source, and multiple selections are supported';
  docLink = '/amis/zh-CN/components/form/nestedselect';
  tags = ['form item'];
  scaffold = {
    type: 'nested-select',
    label: 'Cascade selector',
    name: 'nestedSelect',
    onlyChildren: true,
    options: [
      {
        label: 'Option A',
        value: 'A'
      },

      {
        label: 'Option B',
        value: 'B',
        children: [
          {
            label: 'Option b1',
            value: 'b1'
          },
          {
            label: 'Option b2',
            value: 'b2'
          }
        ]
      },
      {
        label: 'Option C',
        value: 'C',
        children: [
          {
            label: 'Option c1',
            value: 'c1'
          },
          {
            label: 'Option c2',
            value: 'c2'
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

  panelTitle = 'Cascade Selector';
  notRenderFormZone = true;
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
  // Event definition
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: 'value change',
      description: 'Triggered when the selected value changes',
      dataSchema: (manager: EditorManager) => {
        const {value, selectedItems} = resolveOptionEventDataSchame(manager);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  value,
                  selectedItems
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'focus',
      eventLabel: 'Get focus',
      description: 'Triggered when the input box gets focus',
      dataSchema: (manager: EditorManager) => {
        const {value, selectedItems} = resolveOptionEventDataSchame(manager);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  value,
                  selectedItems
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
        const {value, selectedItems} = resolveOptionEventDataSchame(manager);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  value,
                  selectedItems
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
      actionType: 'reload',
      actionLabel: 'Reload',
      description: 'Trigger component data refresh and re-rendering',
      ...getActionCommonProps('reload')
    },
    {
      actionType: 'setValue',
      actionLabel: 'Assignment',
      description: 'Trigger component data update',
      ...getActionCommonProps('setValue')
    }
  ];
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
              getSchemaTpl('clearable'),
              {
                type: 'ae-Switch-More',
                name: 'searchable',
                label: 'Retrievable',
                mode: 'normal',
                value: false,
                hiddenOnDefault: true,
                formType: 'extend',
                form: {
                  body: [
                    {
                      type: 'input-text',
                      name: 'noResultsText',
                      label: tipedLabel(
                        'Empty tip',
                        'Text when no results are found'
                      )
                    }
                  ]
                }
              },
              getSchemaTpl('onlyLeaf'),
              [
                {
                  type: 'switch',
                  label: 'Multiple selections possible',
                  name: 'multiple',
                  value: false,
                  inputClassName: 'is-inline'
                },
                {
                  type: 'container',
                  className: 'ae-ExtendMore mb-3',
                  visibleOn: 'this.multiple',
                  body: [
                    {
                      type: 'switch',
                      label: tipedLabel(
                        'Parent as return value',
                        'When turned on, the parent level is selected, all child level options are not selected, and the parent level is returned as the value'
                      ),
                      horizontal: {
                        left: 6,
                        justify: true
                      },
                      name: 'onlyChildren',
                      inputClassName: 'is-inline',
                      visibleOn: '!this.onlyLeaf',
                      pipeIn: (value: any) => !value,
                      pipeOut: (value: any) => !value,
                      onChange: (
                        value: any,
                        origin: any,
                        item: any,
                        form: any
                      ) => {
                        if (!value) {
                          // Parent as return value
                          form.setValues({
                            cascade: true,
                            withChildren: false,
                            onlyChildren: true
                          });
                        } else {
                          form.setValues({
                            withChildren: false,
                            cascade: false,
                            onlyChildren: false
                          });
                        }
                      }
                    },
                    getSchemaTpl('joinValues'),
                    getSchemaTpl('delimiter', {
                      visibleOn: 'this.joinValues'
                    }),
                    getSchemaTpl('extractValue', {
                      visibleOn: '!this.joinValues'
                    })
                  ]
                }
              ],
              getSchemaTpl('valueFormula', {
                rendererSchema: (schema: Schema) => schema
              }),
              getSchemaTpl('hideNodePathLabel'),
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('placeholder'),
              getSchemaTpl('description'),
              getSchemaTpl('autoFillApi')
            ]
          },
          {
            title: 'Options',
            body: [
              getSchemaTpl('treeOptionControl'),
              getSchemaTpl(
                'loadingConfig',
                {
                  visibleOn: 'this.source || !this.options'
                },
                {context}
              )
            ]
          },
          getSchemaTpl('status', {isFormItem: true}),
          getSchemaTpl('validation', {
            tag: (data: any) => {
              return ValidatorTag.MultiSelect;
            }
          })
        ])
      },
      {
        title: 'Appearance',
        body: [
          getSchemaTpl('collapseGroup', [
            getSchemaTpl('theme:formItem'),
            getSchemaTpl('theme:form-label'),
            getSchemaTpl('theme:form-description'),
            {
              title: 'Selection box style',
              body: [
                ...inputStateTpl(
                  'themeCss.nestedSelectControlClassName',
                  '--select-base'
                )
              ]
            },
            {
              title: 'Drop-down box style',
              body: [
                ...inputStateTpl(
                  'themeCss.nestedSelectPopoverClassName',
                  '--select-base-${state}-option',
                  {
                    state: [
                      {label: 'Normal', value: 'default'},
                      {label: 'Hover', value: 'hover'},
                      {label: 'selected', value: 'focused'}
                    ]
                  }
                )
              ]
            },
            getSchemaTpl('theme:cssCode'),
            getSchemaTpl('style:classNames')
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
}

registerEditorPlugin(NestedSelectControlPlugin);

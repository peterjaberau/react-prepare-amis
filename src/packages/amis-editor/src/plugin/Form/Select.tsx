import type {Schema, SchemaType} from 'amis';
import {
  registerEditorPlugin,
  getSchemaTpl,
  BasePlugin,
  tipedLabel,
  undefinedPipeOut,
  RAW_TYPE_MAP
} from 'amis-editor-core';
import type {
  EditorNodeType,
  RendererPluginAction,
  RendererPluginEvent,
  BaseEventContext,
  EditorManager
} from 'amis-editor-core';

import {ValidatorTag} from '../../validator';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';
import {
  OPTION_EDIT_EVENTS,
  OPTION_EDIT_EVENTS_OLD,
  resolveOptionEventDataSchame,
  resolveOptionType
} from '../../util';

import {inputStateTpl} from '../../renderer/style-control/helper';

export class SelectControlPlugin extends BasePlugin {
  static id = 'SelectControlPlugin';

  static scene = ['layout'];

  name = 'Drop-down box';

  panelTitle = 'Drop-down box';

  rendererName = 'select';

  icon = 'fa fa-th-list';

  panelIcon = 'fa fa-th-list';

  pluginIcon = 'select-plugin';

  isBaseComponent = true;

  panelJustify = true;

  notRenderFormZone = true;

  $schema = '/schemas/SelectControlSchema.json';

  description =
    'Supports multiple selections, input prompts, and can use source to get options';

  searchKeywords = 'selector';

  docLink = '/amis/zh-CN/components/form/select';

  tags = ['form item'];

  scaffold = {
    type: 'select',
    label: 'options',
    name: 'select',
    options: [
      {label: 'Option A', value: 'A'},
      {label: 'Option B', value: 'B'}
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

  // Event definition
  events: (schema: any) => RendererPluginEvent[] = (schema: any) => {
    return [
      {
        eventName: 'change',
        eventLabel: 'value change',
        description: 'Triggered when the selected value changes',
        dataSchema: (manager: EditorManager) => {
          const {value, selectedItems, items} =
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
                    selectedItems,
                    items
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
          const {value, items} = resolveOptionEventDataSchame(manager);

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
        eventName: 'blur',
        eventLabel: 'Lost focus',
        description: 'Triggered when the input box loses focus',
        dataSchema: (manager: EditorManager) => {
          const {value, items} = resolveOptionEventDataSchame(manager);

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
      ...OPTION_EDIT_EVENTS,
      ...OPTION_EDIT_EVENTS_OLD(schema)
    ];
  };

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
    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            id: 'properties-basic',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              getSchemaTpl('formItemName', {
                required: true
              }),
              getSchemaTpl('label'),
              getSchemaTpl('clearable'),
              getSchemaTpl('searchable'),
              getSchemaTpl('multiple', {
                body: [
                  getSchemaTpl('switch', {
                    label: 'Single line display selected value',
                    name: 'valuesNoWrap'
                  }),
                  {
                    type: 'input-number',
                    name: 'maxTagCount',
                    label: tipedLabel(
                      'Number of label displays',
                      'The maximum number of tags to be displayed. If the number is exceeded, they will be displayed in a floating layer. By default, all tags will be displayed.'
                    )
                  }
                ]
              }),
              getSchemaTpl('checkAll'),
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('placeholder'),
              getSchemaTpl('description')
            ]
          },
          {
            title: 'Options',
            id: 'properties-options',
            body: [
              getSchemaTpl('optionControlV2'),
              getSchemaTpl('selectFirst', {
                onChange: (
                  value: any,
                  oldValue: any,
                  model: any,
                  form: any
                ) => {
                  if (value) {
                    form.deleteValueByName('value');
                  }
                }
              }),
              getSchemaTpl('valueFormula', {
                rendererSchema: (schema: Schema) => ({
                  ...schema,
                  type: 'input-text'
                }),
                pipeOut: undefinedPipeOut,
                // There are some problems with the design of the default value component. The request is automatically initiated and the interface data is used as the default value option. The interface form should be to set a static value or FX
                needDeleteProps: ['source'],
                // When the data source is a custom static option, no additional default value is configured. Just check the option. There will be a bug: when the check is removed, the default value configuration component is not cleared, but the schema clears the value
                visibleOn: 'this.selectFirst !== true && this.source != null'
              }),
              getSchemaTpl(
                'loadingConfig',
                {
                  visibleOn: 'this.source || !this.options'
                },
                {context}
              ),
              // Template
              getSchemaTpl('optionsMenuTpl', {
                manager: this.manager,
                onChange: (value: any) => {}
              }),
              /** New options */
              getSchemaTpl('optionAddControl', {
                manager: this.manager
              }),
              /** Edit options */
              getSchemaTpl('optionEditControl', {
                manager: this.manager
              }),
              /** Delete option */
              getSchemaTpl('optionDeleteControl')
            ]
          },
          {
            title: 'Advanced',
            body: [
              getSchemaTpl('switch', {
                label: tipedLabel(
                  'Option value check',
                  'After turning it on, when the option value does not match the option in the current options, the option text will be red'
                ),
                name: 'showInvalidMatch'
              }),
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
        body: [
          getSchemaTpl('collapseGroup', [
            getSchemaTpl('theme:formItem'),
            getSchemaTpl('theme:form-label'),
            getSchemaTpl('theme:form-description'),
            {
              title: 'Selection box style',
              body: [
                ...inputStateTpl(
                  'themeCss.selectControlClassName',
                  '--select-base'
                )
              ]
            },
            {
              title: 'Drop-down box style',
              body: [
                ...inputStateTpl(
                  'themeCss.selectPopoverClassName',
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
      rawType: RAW_TYPE_MAP[node.schema.type as SchemaType] || 'string',
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

registerEditorPlugin(SelectControlPlugin);

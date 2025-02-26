import {
  EditorNodeType,
  getI18nEnabled,
  RAW_TYPE_MAP,
  RendererPluginAction,
  RendererPluginEvent,
  BasePlugin,
  BaseEventContext,
  registerEditorPlugin,
  defaultValue,
  getSchemaTpl,
  tipedLabel
} from 'amis-editor-core';
import {Schema} from 'amis-core';
import type {SchemaType} from 'amis';
import {ValidatorTag} from '../../validator';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';
import {inputStateTpl} from '../../renderer/style-control/helper';

export class NumberControlPlugin extends BasePlugin {
  static id = 'NumberControlPlugin';
  // Associated renderer name
  rendererName = 'input-number';
  $schema = '/schemas/NumberControlSchema.json';

  // Component name
  name = 'Digital box';
  isBaseComponent = true;
  icon = 'fa fa-sort-numeric-asc';
  pluginIcon = 'input-number-plugin';
  description =
    'Supports setting maximum and minimum values, as well as step size and precision';
  searchKeywords = 'Number input box';
  docLink = '/amis/zh-CN/components/form/input-number';
  tags = ['form item'];
  scaffold = {
    type: 'input-number',
    label: 'number',
    name: 'number',
    showSteps: true,
    keyboard: true
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold,
        value: 88
      }
    ]
  };

  notRenderFormZone = true;

  panelTitle = 'Number Box';
  panelJustify = true;

  // Event definition
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: 'value change',
      description: 'Value change',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                value: {
                  type: 'number',
                  title: 'Current value'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'focus',
      eventLabel: 'Get focus',
      description: 'The digital box gets the focus',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                value: {
                  type: 'number',
                  title: 'Current value'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'blur',
      eventLabel: 'Lost focus',
      description: 'The number box loses focus',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                value: {
                  type: 'number',
                  title: 'Current value'
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
      description: 'Clear the content of the number box',
      ...getActionCommonProps('clear')
    },
    {
      actionType: 'reset',
      actionLabel: 'Reset',
      description: 'Reset to default values',
      ...getActionCommonProps('reset')
    },
    {
      actionType: 'setValue',
      actionLabel: 'Assignment',
      description: 'Trigger component data update',
      ...getActionCommonProps('setValue')
    }
  ];

  panelBodyCreator = (context: BaseEventContext) => {
    const i18nEnabled = getI18nEnabled();
    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl(
          'collapseGroup',
          [
            {
              title: 'Basic',
              body: [
                getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                getSchemaTpl('formItemName', {
                  required: true
                }),
                getSchemaTpl('label'),
                {
                  type: 'switch',
                  label: tipedLabel(
                    'Keyboard events',
                    'Use the up and down arrow keys on the keyboard to add or subtract data values'
                  ),
                  name: 'keyboard',
                  value: true,
                  inputClassName: 'is-inline'
                },
                getSchemaTpl('kilobitSeparator'),

                getSchemaTpl('valueFormula', {
                  rendererSchema: (schema: Schema) => ({
                    ...schema,
                    displayMode: 'base'
                  }),
                  valueType: 'number' // expected value type
                }),

                getSchemaTpl('valueFormula', {
                  name: 'min',
                  rendererSchema: (schema: Schema) => ({
                    ...schema,
                    value: context?.schema.min,
                    displayMode: 'base'
                  }),
                  needDeleteProps: ['min'], // avoid self-limitation
                  label: 'minimum value',
                  valueType: 'number'
                }),

                getSchemaTpl('valueFormula', {
                  name: 'max',
                  rendererSchema: (schema: Schema) => ({
                    ...schema,
                    value: context?.schema.max,
                    displayMode: 'base'
                  }),
                  needDeleteProps: ['max'], // avoid self-limitation
                  label: 'maximum value',
                  valueType: 'number'
                }),
                {
                  type: 'switch',
                  label: 'Show up and down buttons',
                  name: 'showSteps',
                  value: true,
                  inputClassName: 'is-inline'
                },
                {
                  type: 'input-number',
                  name: 'step',
                  label: 'step length',
                  min: 0,
                  value: 1,
                  precision: '${precision}',
                  visibleOn: '${showSteps}',
                  strictMode: false
                },
                {
                  type: 'input-number',
                  name: 'precision',
                  label: tipedLabel(
                    'Number of decimal places',
                    'Round to the exact number of decimal places you set'
                  ),
                  min: 1,
                  max: 100
                },
                getSchemaTpl('prefix'),
                getSchemaTpl('suffix'),
                getSchemaTpl('combo-container', {
                  type: 'combo',
                  label: 'Unit options',
                  mode: 'normal',
                  name: 'unitOptions',
                  items: [
                    {
                      placeholder: 'text',
                      type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                      name: 'label'
                    },
                    {
                      placeholder: 'value',
                      type: 'input-text',
                      name: 'value'
                    }
                  ],
                  draggable: false,
                  multiple: true,
                  pipeIn: (value: any) => {
                    if (Array.isArray(value)) {
                      return value.map(item =>
                        typeof item === 'string'
                          ? {
                              label: item,
                              value: item
                            }
                          : item
                      );
                    }
                    return [];
                  },
                  pipeOut: (value: any[]) => {
                    if (!value.length) {
                      return undefined;
                    }
                    return value.map(item =>
                      item.value ? item : {label: item.label, value: item.label}
                    );
                  }
                }),
                getSchemaTpl('labelRemark'),
                getSchemaTpl('remark'),
                getSchemaTpl('placeholder'),
                getSchemaTpl('description'),
                getSchemaTpl('autoFillApi')
              ]
            },
            getSchemaTpl('status', {isFormItem: true}),
            getSchemaTpl('validation', {tag: ValidatorTag.MultiSelect})
          ],
          {...context?.schema, configTitle: 'props'}
        )
      },
      {
        title: 'Appearance',
        body: [
          getSchemaTpl(
            'collapseGroup',
            [
              getSchemaTpl('theme:formItem', {
                schema: [
                  {
                    label: 'Quick Edit',
                    name: 'displayMode',
                    type: 'select',
                    pipeIn: defaultValue('base'),
                    options: [
                      {
                        label: 'Single-side button',
                        value: 'base'
                      },
                      {
                        label: 'Buttons on both sides',
                        value: 'enhance'
                      }
                    ]
                  }
                ]
              }),
              getSchemaTpl('theme:form-label'),
              getSchemaTpl('theme:form-description'),
              {
                title: 'Number input box style',
                body: [
                  ...inputStateTpl(
                    'themeCss.inputControlClassName',
                    '--inputNumber-${displayMode || "base"}'
                  )
                ]
              },
              getSchemaTpl('theme:singleCssCode', {
                selectors: [
                  {
                    label: 'Basic style of form items',
                    isRoot: true,
                    selector: '.cxd-from-item'
                  },
                  {
                    label: 'Title style',
                    selector: '.cxd-Form-label'
                  },
                  {
                    label: 'Basic style of digital box',
                    selector: '.cxd-Number'
                  },
                  {
                    label: 'input box style',
                    selector: '.cxd-Number-input'
                  }
                ]
              })
            ],
            {...context?.schema, configTitle: 'style'}
          )
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
    return {
      type: 'number',
      title: node.schema?.label || node.schema?.name,
      rawType: RAW_TYPE_MAP[node.schema.type as SchemaType] || 'string',
      originalValue: node.schema?.value // Record the original value, required for circular reference detection
    };
  }
}

registerEditorPlugin(NumberControlPlugin);

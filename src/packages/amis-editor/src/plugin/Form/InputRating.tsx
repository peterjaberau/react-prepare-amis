import {
  EditorNodeType,
  defaultValue,
  getI18nEnabled,
  getSchemaTpl,
  isObject,
  undefinedPipeOut,
  RendererPluginAction,
  RendererPluginEvent,
  registerEditorPlugin,
  BasePlugin,
  BaseEventContext,
  tipedLabel
} from 'amis-editor-core';
import {ValidatorTag} from '../../validator';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';

export class RateControlPlugin extends BasePlugin {
  static id = 'RateControlPlugin';
  // Associated renderer name
  rendererName = 'input-rating';
  $schema = '/schemas/RatingControlSchema.json';

  // Component name
  name = 'Rating';
  isBaseComponent = true;
  icon = 'fa fa-star-o';
  pluginIcon = 'input-rating-plugin';
  description = 'Supports read-only and half-star selection';
  docLink = '/amis/zh-CN/components/form/input-rating';
  tags = ['form item'];
  scaffold = {
    type: 'input-rating',
    label: 'rating',
    name: 'rating'
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold,
        value: 3
      }
    ]
  };
  notRenderFormZone = true;

  panelTitle = 'Rating';

  count = 5;

  // Event definition
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: 'value change',
      description: 'Triggered when the rating value changes',
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
                  title: 'Current score'
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
      description: 'Clear rating value',
      ...getActionCommonProps('clear')
    },
    {
      actionType: 'reset',
      actionLabel: 'Reset',
      description: 'Reset the value to the initial value',
      ...getActionCommonProps('reset')
    },
    {
      actionType: 'setValue',
      actionLabel: 'Assignment',
      description: 'Trigger component data update',
      ...getActionCommonProps('setValue')
    }
  ];

  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
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

              getSchemaTpl('label', {
                label: 'Label'
              }),

              getSchemaTpl('valueFormula', {
                rendererSchema: {
                  ...context?.schema,
                  type: 'input-number'
                },
                valueType: 'number', // expected value type
                visibleOn: '!data.multiple'
              }),
              // The rating component does not have min and max attributes, but has a count attribute
              getSchemaTpl('valueFormula', {
                name: 'count',
                rendererSchema: {
                  ...context?.schema,
                  type: 'input-number',
                  max: 10,
                  min: 1,
                  step: 1,
                  precision: 0
                },
                needDeleteProps: ['count'], // avoid self-limiting
                label: 'maximum value',
                valueType: 'number'
              }),

              getSchemaTpl('switch', {
                name: 'allowClear',
                label: tipedLabel(
                  'clearable',
                  'allow clearing after clicking again'
                ),
                value: false
              }),

              getSchemaTpl('switch', {
                name: 'half',
                label: 'Allow half stars',
                value: false
              }),

              getSchemaTpl('labelRemark'),

              getSchemaTpl('remark'),
              getSchemaTpl('combo-container', {
                type: 'combo',
                label: 'Description',
                mode: 'normal',
                name: 'texts',
                items: [
                  {
                    placeholder: 'Key',
                    type: 'input-number',
                    unique: true,
                    name: 'key',
                    columnClassName: 'w-xs flex-none',
                    min: 0,
                    step: 1,
                    max: 10,
                    precision: 0
                  },
                  {
                    placeholder: 'Description content',
                    type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                    name: 'value'
                  }
                ],
                draggable: false,
                multiple: true,
                pipeIn: (value: any) => {
                  if (!isObject(value)) {
                    return Array.isArray(value) ? value : [];
                  }

                  const res = Object.keys(value).map((item: any) => {
                    return {
                      key: item || 0,
                      value: value[item] || ''
                    };
                  }); //.filter((item: any) => item.key <= this.count);

                  return res;
                },
                pipeOut: (value: any[]) => {
                  if (!value.length) {
                    return undefined;
                  }

                  const res: any = {};
                  const findMinCanUsedKey = (
                    keys: string[],
                    max: number
                  ): void | number => {
                    for (let i = 1; i <= max; i++) {
                      if (!keys.includes(String(i))) {
                        return i;
                      }
                    }
                  };

                  value.forEach(item => {
                    const key =
                      item.key !== undefined
                        ? Number(item.key)
                        : findMinCanUsedKey(Object.keys(res), this.count);

                    // && key <= this.count
                    if (key) {
                      res[key] = item?.value || '';
                    }
                  });
                  return res;
                }
              }),
              getSchemaTpl('autoFillApi')
            ]
          },
          getSchemaTpl('status', {isFormItem: true, readonly: true}),
          getSchemaTpl('validation', {
            tag: ValidatorTag.Check
          })
        ])
      },
      {
        title: 'Appearance',
        body: [
          getSchemaTpl('collapseGroup', [
            getSchemaTpl('style:formItem', {
              renderer: context.info.renderer
            }),
            {
              title: 'icon',
              body: [
                {
                  type: 'ae-switch-more',
                  label: 'Custom',
                  mode: 'normal',
                  formType: 'extend',
                  form: {
                    body: [
                      {
                        type: 'input-text',
                        label: 'character',
                        name: 'char'
                      }
                    ]
                  }
                },

                {
                  type: 'input-color',
                  label: tipedLabel(
                    'Unselected color value',
                    'The default unselected color value is #e7e7e8'
                  ),
                  name: 'inactiveColor',
                  pipeIn: defaultValue('#e7e7e8'),
                  pipeOut: undefinedPipeOut
                },

                getSchemaTpl('combo-container', {
                  type: 'combo',
                  label: 'Selected color value',
                  mode: 'normal',
                  name: 'colors',
                  items: [
                    {
                      placeholder: 'Key',
                      type: 'input-number',
                      unique: true,
                      name: 'key',
                      columnClassName: 'w-xs flex-none',
                      min: 0,
                      max: 10,
                      step: 1,
                      precision: 0
                    },

                    {
                      placeholder: 'Value',
                      type: 'input-color',
                      name: 'value'
                    }
                  ],
                  value: {
                    2: '#abadb1',
                    3: '#787b81',
                    5: '#ffa900'
                  },
                  draggable: false,
                  multiple: true,
                  pipeIn: (value: any) => {
                    if (!isObject(value)) {
                      return Array.isArray(value) ? value : [];
                    }

                    const res = Object.keys(value).map((item: any) => {
                      return {
                        key: item,
                        value: value[item] || ''
                      };
                    }); //.filter((item: any) => item.key <= this.count);

                    return res;
                  },
                  pipeOut: (value: any[]) => {
                    if (!value.length) {
                      return undefined;
                    }

                    const res: any = {};
                    const findMinCanUsedKey = (
                      keys: string[],
                      max: number
                    ): void | number => {
                      for (let i = 1; i <= max; i++) {
                        if (!keys.includes(String(i))) {
                          return i;
                        }
                      }
                    };

                    value.forEach(item => {
                      const key =
                        item.key !== undefined
                          ? Number(item.key)
                          : findMinCanUsedKey(Object.keys(res), this.count);

                      if (key) {
                        res[key] = item?.value || '';
                      }
                    });

                    return res;
                  }
                })
              ]
            },
            {
              title: 'Description',
              body: [
                getSchemaTpl('horizontal-align', {
                  name: 'textPosition',
                  pipeIn: defaultValue('right')
                })
              ]
            },
            getSchemaTpl('style:classNames', {
              schema: [
                getSchemaTpl('className', {
                  label: 'icon',
                  name: 'charClassName'
                }),

                getSchemaTpl('className', {
                  label: 'rating description',
                  name: 'textClassName'
                })
              ]
            })
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
    return {
      type: 'number',
      title: node.schema?.label || node.schema?.name,
      originalValue: node.schema?.value // Record the original value, required for circular reference detection
    };
  }
}

registerEditorPlugin(RateControlPlugin);

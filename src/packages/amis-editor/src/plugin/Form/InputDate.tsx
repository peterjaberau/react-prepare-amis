import {
  registerEditorPlugin,
  RendererPluginAction,
  RendererPluginEvent,
  defaultValue,
  getSchemaTpl,
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
import {FormulaDateType} from '../../renderer/FormulaControl';

const formatX = [
  {
    label: 'X(timestamp)',
    value: 'X'
  },
  {
    label: 'x(millisecond timestamp)',
    value: 'x'
  }
];

const DateType: {
  [key: string]: {
    format: string; // The default format for each type of time
    placeholder: string;
    formatOptions: Array<{label: string; value: string; timeFormat?: string}>; // Various types of time support display formats
  };
} = {
  date: {
    format: 'YYYY-MM-DD',
    placeholder: 'Please select a date',
    formatOptions: [
      ...formatX,
      {
        label: 'YYYY-MM-DD',
        value: 'YYYY-MM-DD'
      },
      {
        label: 'YYYY/MM/DD',
        value: 'YYYY/MM/DD'
      },
      {
        label: 'YYYY-MM-DD',
        value: 'YYYY year MM month DD day'
      }
    ]
  },
  datetime: {
    format: 'YYYY-MM-DD HH:mm:ss',
    placeholder: 'Please select a date and time',
    formatOptions: [
      ...formatX,
      {
        label: 'YYYY-MM-DD HH:mm:ss',
        value: 'YYYY-MM-DD HH:mm:ss'
      },
      {
        label: 'YYYY/MM/DD HH:mm:ss',
        value: 'YYYY/MM/DD HH:mm:ss'
      },
      {
        label: 'YYYY year MM month DD day HH hour mm minute ss second',
        value: 'YYYY year MM month DD day HH hour mm minute ss second'
      }
    ]
  },
  time: {
    format: 'HH:mm',
    placeholder: 'Please select a time',
    formatOptions: [
      {
        label: 'HH:mm',
        value: 'HH:mm'
      },
      {
        label: 'HH:mm:ss',
        value: 'HH:mm:ss'
      },
      {
        label: 'HH hour mm minute',
        value: 'HH hour mm minute'
      },
      {
        label: 'HH hour mm minute ss second',
        value: 'HH hour mm minute ss second'
      }
    ]
  },
  month: {
    format: 'YYYY-MM',
    placeholder: 'Please select a month',
    formatOptions: [
      ...formatX,
      {
        label: 'YYYY-MM',
        value: 'YYYY-MM'
      },
      {
        label: 'MM',
        value: 'MM'
      },
      {
        label: 'M',
        value: 'M'
      }
    ]
  },
  quarter: {
    format: 'YYYY [Q]Q',
    placeholder: 'Please select a quarter',
    formatOptions: [
      ...formatX,
      {
        label: 'YYYY-[Q]Q',
        value: 'YYYY-[Q]Q'
      },
      {
        label: 'Q',
        value: 'Q'
      }
    ]
  },
  year: {
    format: 'YYYY',
    placeholder: 'Please select year',
    formatOptions: [
      ...formatX,
      {
        label: 'YYYY',
        value: 'YYYY'
      }
    ]
  }
};

const dateTooltip =
  'Supports relative value usage such as: <code>now, +3days, -2weeks, +1hour, +2years</code>, etc. (minute|min|hour|day|week|month|year|weekday|second|millisecond)';

export class DateControlPlugin extends BasePlugin {
  static id = 'DateControlPlugin';
  // Associated renderer name
  rendererName = 'input-date';
  $schema = '/schemas/DateControlSchema.json';

  // Component name
  icon = 'fa fa-calendar';
  pluginIcon = 'input-date-plugin';
  name = 'Date';
  isBaseComponent = true;
  // Add the Chinese name and type field of the corresponding source component
  searchKeywords =
    'date box, input-datetime, date time box, input-time, time box, input-month, month box, input-quarter, quarter box, input-year, year box, year box, year selection';
  description =
    'Year, month, and day selection, supports relative value settings, such as <code>+2days</code> two days later';
  docLink = '/amis/zh-CN/components/form/input-date';
  tags = ['form item'];
  scaffold = {
    type: 'input-date',
    label: 'Date',
    name: 'date'
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

  notRenderFormZone = true;

  panelTitle = 'Date Configuration';

  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: 'value change',
      description: 'Trigger when the time value changes',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                value: {
                  type: 'string',
                  title: 'Current date'
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
      description:
        'Triggered when the input box gets focus (non-embedded mode)',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                value: {
                  type: 'string',
                  title: 'Current date'
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
      description:
        'Triggered when the input box loses focus (non-embedded mode)',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                value: {
                  type: 'string',
                  title: 'Current date'
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
      description: 'Clear the input box content',
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
    const renderer: any = context.info.renderer;

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
                getSchemaTpl('selectDateType', {
                  value: this.scaffold.type,
                  onChange: (
                    value: string,
                    oldValue: any,
                    model: any,
                    form: any
                  ) => {
                    let type: string = value.split('-')[1];

                    form.setValues({
                      placeholder: DateType[type]?.placeholder,
                      valueFormat: 'X',
                      displayFormat: DateType[type]?.format,
                      minDate: '',
                      maxDate: '',
                      value: ''
                    });
                  }
                }),
                {
                  type: 'input-text',
                  name: 'valueFormat',
                  label: tipedLabel(
                    'Value format',
                    'The data will be formatted according to the settings before submission. Please refer to <a href="https://momentjs.com/" target="_blank">moment</a> for format usage.'
                  ),
                  pipeIn: defaultValue('X'),
                  clearable: true,
                  onChange: (
                    value: string,
                    oldValue: any,
                    model: any,
                    form: any
                  ) => {
                    const type = form.data.type.split('-')[1];
                    model.setOptions(DateType[type].formatOptions);
                  },
                  options:
                    DateType[this.scaffold.type.split('-')[1]].formatOptions
                },
                {
                  type: 'input-text',
                  name: 'displayFormat',
                  label: tipedLabel(
                    'Display format',
                    'Please refer to <a href="https://momentjs.com/" target="_blank">moment</a> for format usage.'
                  ),
                  pipeIn: defaultValue('YYYY-MM-DD'),
                  clearable: true,
                  onChange: (
                    value: string,
                    oldValue: any,
                    model: any,
                    form: any
                  ) => {
                    const type = form.data.type.split('-')[1];
                    model.setOptions(DateType[type].formatOptions);
                  },
                  options:
                    DateType[this.scaffold.type.split('-')[1]].formatOptions
                },
                getSchemaTpl('utc'),
                getSchemaTpl('clearable', {
                  pipeIn: defaultValue(true)
                }),
                getSchemaTpl('inputForbid', {
                  pipeIn: defaultValue(false)
                }),
                getSchemaTpl('valueFormula', {
                  rendererSchema: (schema: Schema) => schema,
                  placeholder: 'Please select a static value',
                  header: 'expression or relative value',
                  DateTimeType: FormulaDateType.IsDate,
                  label: tipedLabel('Default value', dateTooltip)
                }),
                getSchemaTpl('valueFormula', {
                  name: 'minDate',
                  header: 'expression or relative value',
                  DateTimeType: FormulaDateType.IsDate,
                  rendererSchema: (schema: Schema) => {
                    return {
                      ...schema,
                      value: context?.schema.minDate
                    };
                  },
                  placeholder: 'Please select a static value',
                  needDeleteProps: ['minDate'], // Avoid self-limitation
                  label: tipedLabel('minimum value', dateTooltip)
                }),
                getSchemaTpl('valueFormula', {
                  name: 'maxDate',
                  header: 'expression or relative value',
                  DateTimeType: FormulaDateType.IsDate,
                  rendererSchema: (schema: Schema) => {
                    return {
                      ...schema,
                      value: context?.schema.maxDate
                    };
                  },
                  needDeleteProps: ['maxDate'], // avoid self-limitation
                  label: tipedLabel('maximum value', dateTooltip)
                }),
                getSchemaTpl('placeholder', {
                  pipeIn: defaultValue('Please select a date')
                }),
                getSchemaTpl('remark'),
                getSchemaTpl('labelRemark'),
                getSchemaTpl('description'),
                getSchemaTpl('autoFillApi')
              ]
            },
            getSchemaTpl('status', {isFormItem: true}),
            getSchemaTpl('validation', {
              tag: ValidatorTag.Date,
              rendererSchema: (schema: Schema) => {
                return {
                  ...schema,
                  label: 'value content',
                  validateName: 'equals'
                };
              }
            })
          ],
          {...context?.schema, configTitle: 'props'}
        )
      },
      {
        title: 'Appearance',
        body: getSchemaTpl(
          'collapseGroup',
          [
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
            getSchemaTpl('style:others', [
              {
                name: 'embed',
                type: 'button-group-select',
                size: 'md',
                label: 'mode',
                mode: 'row',
                pipeIn: defaultValue(false),
                options: [
                  {
                    label: 'Floating layer',
                    value: false
                  },
                  {
                    label: 'embedded',
                    value: true
                  }
                ]
              }
            ])
          ],
          {...context?.schema, configTitle: 'style'}
        )
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
}

registerEditorPlugin(DateControlPlugin);

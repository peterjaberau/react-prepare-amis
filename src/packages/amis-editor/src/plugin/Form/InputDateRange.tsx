import {
  defaultValue,
  getSchemaTpl,
  tipedLabel,
  registerEditorPlugin,
  BasePlugin,
  BaseEventContext,
  RendererPluginAction,
  RendererPluginEvent
} from '@/packages/amis-editor-core/src';
import {getRendererByName} from '@/packages/amis-core/src';
import omit from 'lodash/omit';
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
    format: string; // The default format for a certain type of time
    placeholder: string;
    shortcuts: string[];
    /** Compatible configuration of shortcuts, no configuration is required*/
    ranges?: string[];
    sizeMutable?: boolean;
    type?: string;
    timeFormat?: string;
    formatOptions: Array<{label: string; value: string; timeFormat?: string}>;
  };
} = {
  date: {
    ...getRendererByName('input-date-range'),
    format: 'YYYY-MM-DD',
    placeholder: 'Please select a date range',
    shortcuts: [
      'yesterday',
      '7daysago',
      'prevweek',
      'thismonth',
      'prevmonth',
      'prevquarter'
    ],
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
    ...getRendererByName('input-datetime-range'),
    format: 'YYYY-MM-DD HH:mm:ss',
    timeFormat: 'HH:mm:ss',
    placeholder: 'Please select the date and time range',
    shortcuts: [
      'yesterday',
      '7daysago',
      'prevweek',
      'thismonth',
      'prevmonth',
      'prevquarter'
    ],
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
    ...getRendererByName('input-time-range'),
    format: 'HH:mm',
    timeFormat: 'HH:mm:ss',
    placeholder: 'Please select a time range',
    shortcuts: [],
    formatOptions: [
      {
        label: 'HH:mm',
        value: 'HH:mm',
        timeFormat: 'HH:mm'
      },
      {
        label: 'HH:mm:ss',
        value: 'HH:mm:ss',
        timeFormat: 'HH:mm:ss'
      },
      {
        label: 'HH hour mm minute',
        value: 'HH hour mm minute',
        timeFormat: 'HH:mm'
      },
      {
        label: 'HH hour mm minute ss second',
        value: 'HH hour mm minute ss second',
        timeFormat: 'HH:mm:ss'
      }
    ]
  },
  month: {
    ...getRendererByName('input-month-range'),
    format: 'YYYY-MM',
    placeholder: 'Please select the month range',
    shortcuts: [],
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
    ...getRendererByName('input-quarter-range'),
    format: 'YYYY [Q]Q',
    placeholder: 'Please select the quarter range',
    shortcuts: ['thisquarter', 'prevquarter'],
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
    ...getRendererByName('input-year-range'),
    format: 'YYYY',
    placeholder: 'Please select the year range',
    shortcuts: ['thisyear', 'lastYear'],
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
  'Supports relative value usage such as: <code>now, +3days, -2weeks, +1hour, +2years</code>, etc. (minute|hour|day|week|month|year|weekday|second|millisecond)';
const rangTooltip =
  'Supports relative value usage such as <code>3days, 2weeks, 1hour, 2years</code> (minute|hour|day|week|month|year|weekday|second|millisecond)';

const sizeImmutableComponents = Object.values(DateType)
  .map(item => (item?.sizeMutable === false ? item.type : null))
  .filter(a => a);

export class DateRangeControlPlugin extends BasePlugin {
  static id = 'DateRangeControlPlugin';
  // Associated renderer name
  rendererName = 'input-date-range';
  $schema = '/schemas/DateRangeControlSchema.json';

  // Component name
  icon = 'fa fa-calendar';
  pluginIcon = 'input-date-range-plugin';
  name = 'Date Range';
  isBaseComponent = true;
  // Add the Chinese name and type field of the corresponding source component
  searchKeywords =
    'Date range box, input-datetime-range, datetime range, input-time-range, time range, input-month-range, month range, input-quarter-range, quarter range, input-year-range, year range, year range';
  description =
    'Date range selection, you can set the minimum and maximum dates through <code>minDate</code> and <code>maxDate</code>';
  docLink = '/amis/zh-CN/components/form/input-date-range';
  tags = ['form item'];
  scaffold = {
    type: 'input-date-range',
    label: 'Date range',
    name: 'date-range'
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

  panelTitle = 'Date Range';

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
                  title: 'Current time range'
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
                  title: 'Current time range'
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
                  title: 'Current time range'
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

                getSchemaTpl('formItemExtraName'),

                getSchemaTpl('label'),
                getSchemaTpl('selectDateRangeType', {
                  value: this.scaffold.type,
                  onChange: (
                    value: string,
                    oldValue: any,
                    model: any,
                    form: any
                  ) => {
                    const type: string = value.split('-')[1];
                    form.setValues({
                      displayFormat: DateType[type]?.format,
                      placeholder: DateType[type]?.placeholder,
                      valueFormat: type === 'time' ? 'HH:mm' : 'X',
                      minDate: '',
                      maxDate: '',
                      value: '',
                      shortcuts: DateType[type]?.shortcuts,
                      /** The ranges attribute is deprecated after amis 3.1.0*/
                      ranges: undefined,
                      // size immutable component removes the size field
                      size: sizeImmutableComponents.includes(value)
                        ? undefined
                        : form.data?.size
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
                    model.setOptions(
                      DateType[form.data.type.split('-')[1]].formatOptions
                    );
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
                    model.setOptions(
                      DateType[form.data.type.split('-')[1]].formatOptions
                    );
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
                  rendererSchema: (schema: Schema) => ({
                    ...schema,
                    size: 'full',
                    mode: 'inline'
                  }),
                  mode: 'vertical',
                  header: 'expression or relative value',
                  DateTimeType: FormulaDateType.IsRange,
                  label: tipedLabel('Default value', dateTooltip)
                }),
                getSchemaTpl('valueFormula', {
                  name: 'minDate',
                  header: 'expression or relative value',
                  DateTimeType: FormulaDateType.IsDate,
                  rendererSchema: (schema: Schema) => ({
                    ...omit(schema, ['shortcuts']),
                    value: schema?.minDate,
                    type: 'input-date'
                  }),
                  placeholder: 'Please select a static value',
                  needDeleteProps: ['minDate', 'ranges', 'shortcuts'], // avoid self-limitation
                  label: tipedLabel('minimum value', dateTooltip)
                }),
                getSchemaTpl('valueFormula', {
                  name: 'maxDate',
                  header: 'expression or relative value',
                  DateTimeType: FormulaDateType.IsDate,
                  rendererSchema: (schema: Schema) => ({
                    ...omit(schema, ['shortcuts']),
                    value: schema?.maxDate,
                    type: 'input-date'
                  }),
                  placeholder: 'Please select a static value',
                  needDeleteProps: ['maxDate', 'ranges', 'shortcuts'], // avoid self-limitation
                  label: tipedLabel('maximum value', dateTooltip)
                }),

                getSchemaTpl('valueFormula', {
                  name: 'minDuration',
                  header: 'expression',
                  DateTimeType: FormulaDateType.NotDate,
                  rendererSchema: (schema: Schema) => ({
                    ...schema,
                    value: schema?.minDuration,
                    type: 'input-text'
                  }),
                  placeholder: 'Please enter a relative value',
                  needDeleteProps: ['minDuration'], // Avoid self-limitation
                  label: tipedLabel('Minimum span', rangTooltip)
                }),

                getSchemaTpl('valueFormula', {
                  name: 'maxDuration',
                  header: 'expression',
                  DateTimeType: FormulaDateType.NotDate,
                  rendererSchema: (schema: Schema) => ({
                    ...schema,
                    value: schema?.maxDuration,
                    type: 'input-text'
                  }),
                  placeholder: 'Please enter a relative value',
                  needDeleteProps: ['maxDuration'], // avoid self-limiting
                  label: tipedLabel('Maximum span', rangTooltip)
                }),
                getSchemaTpl('dateShortCutControl', {
                  name: 'shortcuts',
                  mode: 'normal',
                  certainOptions: [
                    'today',
                    'yesterday',
                    'thisweek',
                    'prevweek',
                    'thismonth',
                    'prevmonth',
                    'thisquarter',
                    'prevquarter',
                    'thisyear'
                  ],
                  modifyOptions: [
                    '$daysago',
                    '$dayslater',
                    '$weeksago',
                    '$weekslater',
                    '$monthsago',
                    '$monthslater',
                    '$quartersago',
                    '$quarterslater',
                    '$yearsago',
                    '$yearslater'
                  ]
                }),
                getSchemaTpl('remark'),
                getSchemaTpl('labelRemark'),
                getSchemaTpl('startPlaceholder'),
                getSchemaTpl('endPlaceholder'),
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
            getSchemaTpl('style:formItem', {
              renderer: {...renderer, sizeMutable: false},
              schema: [
                // Need to be passed in as a string expression, because panelBodyCreator will not re-execute after switching type
                getSchemaTpl('formItemSize', {
                  hiddenOn: `["${sizeImmutableComponents.join(
                    '","'
                  )}"].includes(this.type)`
                })
              ]
            }),
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

registerEditorPlugin(DateRangeControlPlugin);

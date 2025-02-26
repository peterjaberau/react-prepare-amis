import {Button} from 'amis';
import React from 'react';
import {
  registerEditorPlugin,
  BaseEventContext,
  BasePlugin,
  RendererPluginAction,
  diff,
  defaultValue,
  getSchemaTpl,
  CodeEditor as AmisCodeEditor,
  RendererPluginEvent,
  tipedLabel
} from 'amis-editor-core';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../renderer/event-control/helper';

const ChartConfigEditor = ({value, onChange}: any) => {
  return (
    <div className="ae-JsonEditor">
      <AmisCodeEditor value={value} onChange={onChange} />
    </div>
  );
};

const DEFAULT_EVENT_PARAMS = [
  {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        title: 'Data',
        properties: {
          componentType: {
            type: 'string',
            title: 'componentType'
          },
          seriesType: {
            type: 'string',
            title: 'seriesType'
          },
          seriesIndex: {
            type: 'number',
            title: 'seriesIndex'
          },
          seriesName: {
            type: 'string',
            title: 'seriesName'
          },
          name: {
            type: 'string',
            title: 'name'
          },
          dataIndex: {
            type: 'number',
            title: 'dataIndex'
          },
          data: {
            type: 'object',
            title: 'data'
          },
          dataType: {
            type: 'string',
            title: 'dataType'
          },
          value: {
            type: 'number',
            title: 'value'
          },
          color: {
            type: 'string',
            title: 'color'
          }
        }
      }
    }
  }
];

const chartDefaultConfig = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line'
    }
  ],
  backgroundColor: 'transparent'
};

export class ChartPlugin extends BasePlugin {
  static id = 'ChartPlugin';
  // Associated renderer name
  rendererName = 'chart';
  $schema = '/schemas/ChartSchema.json';

  // Component name
  name = 'Chart';
  isBaseComponent = true;
  description =
    'Used to render charts, based on echarts chart library, theoretically all chart types of echarts are supported. ';
  docLink = '/amis/zh-CN/components/chart';
  tags = ['show'];
  icon = 'fa fa-pie-chart';
  pluginIcon = 'chart-plugin';
  scaffold = {
    type: 'chart',
    config: chartDefaultConfig,
    replaceChartOption: true
  };
  previewSchema = {
    ...this.scaffold
  };

  // Event definition
  events: RendererPluginEvent[] = [
    {
      eventName: 'init',
      eventLabel: 'Initialization',
      description:
        'Triggered when a component instance is created and inserted into the DOM',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              description:
                'The current data domain, you can read the corresponding value through the field name'
            }
          }
        }
      ]
    },
    {
      eventName: 'click',
      eventLabel: 'Mouse click',
      description: 'Triggered when the mouse is clicked',
      dataSchema: DEFAULT_EVENT_PARAMS
    },
    {
      eventName: 'mouseover',
      eventLabel: 'Mouse hover',
      description: 'Triggered when the mouse hovers',
      dataSchema: DEFAULT_EVENT_PARAMS
    },
    {
      eventName: 'legendselectchanged',
      eventLabel: 'Switch the legend selected state',
      description: 'Triggered when the legend is switched to selected state',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                name: {
                  type: 'string',
                  title: 'name'
                },
                selected: {
                  type: 'object',
                  title: 'selected'
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
      actionType: 'reload',
      actionLabel: 'Reload',
      description: 'Trigger component data refresh and re-rendering',
      ...getActionCommonProps('reload')
    },
    {
      actionType: 'setValue',
      actionLabel: 'Variable assignment',
      description: 'Trigger component data update',
      ...getActionCommonProps('setValue')
    }
    // There are too many feature actions, so we won't add them here. You can configure them by writing code
  ];

  panelTitle = 'Chart';
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    return [
      getSchemaTpl('tabs', [
        {
          title: 'Attributes',
          body: [
            getSchemaTpl('collapseGroup', [
              {
                title: 'Basic',
                body: [
                  getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                  getSchemaTpl('name')
                ]
              },
              {
                title: 'Data Settings',
                body: [
                  /*
                  {
                    type: 'select',
                    name: 'chartDataType',
                    label: 'Data acquisition method',
                    value: 'json',
                    onChange(value: any, oldValue: any, model: any, form: any) {
                      if (value === 'json') {
                        form.setValueByName('api', undefined);
                        form.setValueByName('config', chartDefaultConfig);
                      } else {
                        form.setValueByName('config', undefined);
                      }
                    },
                    options: [
                      {
                        label: 'Interface data',
                        value: 'dataApi'
                      },
                      {
                        label: 'Static JSON data',
                        value: 'json'
                      }
                    ]
                  },
                  */
                  getSchemaTpl('apiControl', {
                    label: tipedLabel(
                      'Data interface',
                      'The interface can return the complete configuration of the echart chart, or the chart data. It is recommended to return the chart data and map it to the Echarts configuration'
                    ),
                    mode: 'normal'
                    // visibleOn: 'chartDataType === "dataApi"'
                  }),

                  getSchemaTpl('switch', {
                    label: 'Whether to pull initially',
                    name: 'initFetch',
                    // visibleOn: 'chartDataType === "dataApi" && this.api',
                    visibleOn: 'this.api.url',
                    pipeIn: defaultValue(true)
                  }),
                  {
                    name: 'interval',
                    label: tipedLabel(
                      'Timed refresh interval',
                      'After setting, it will automatically refresh at a fixed time, with a minimum of 3000, in ms'
                    ),
                    type: 'input-number',
                    step: 500,
                    min: 1000,
                    // visibleOn: 'chartDataType === "dataApi" && this.api',
                    visibleOn: 'this.api.url',
                    unitOptions: ['ms']
                  },
                  getSchemaTpl('expressionFormulaControl', {
                    evalMode: false,
                    label: tipedLabel(
                      'Tracking Expression',
                      'If the value of this expression changes, the chart will be updated. Useful when data mapping is used in config'
                    ),
                    name: 'trackExpression',
                    placeholder: '\\${xxx}'
                  }),
                  {
                    name: 'config',
                    asFormItem: true,
                    // visibleOn: 'chartDataType === "json"',
                    component: ChartConfigEditor,
                    mode: 'normal',
                    // type: 'json-editor',
                    label: tipedLabel(
                      'Echarts Configuration',
                      'Supports data mapping, and can fill in the data returned by the interface'
                    )
                  },
                  {
                    name: 'dataFilter',
                    type: 'ae-functionEditorControl',
                    allowFullscreen: true,
                    mode: 'normal',
                    label: tipedLabel(
                      'Data Mapping (dataFilter)',
                      'If the backend does not directly return the Echart configuration, you can write a function to wrap it yourself'
                    ),
                    renderLabel: true,
                    params: [
                      {
                        label: 'config',
                        tip: 'Original data'
                      },
                      {
                        label: 'echarts',
                        tip: 'echarts object'
                      },
                      {
                        label: 'data',
                        tip: 'If a data interface is configured, the data returned by the interface is passed in through this variable'
                      }
                    ],
                    placeholder: `debugger; // You can debug at the browser breakpoint\n\n// View the original data\nconsole.log(config)\n\n// Return new results\nreturn {}`
                  },
                  getSchemaTpl('switch', {
                    label: tipedLabel(
                      'Chart configuration completely replaced',
                      'The default mode is append mode, the new configuration will be merged with the old configuration, if checked it will be completely overwritten'
                    ),
                    name: 'replaceChartOption'
                  })
                ]
              },
              {
                title: 'Drill down chart',
                body: [
                  {
                    name: 'clickAction',
                    asFormItem: true,
                    label: false,
                    children: ({onChange, value}: any) => (
                      <div className="m-b">
                        <Button
                          size="sm"
                          level={value ? 'danger' : 'info'}
                          onClick={this.editDrillDown.bind(this, context.id)}
                        >
                          Configuring DrillDown
                        </Button>

                        {value ? (
                          <Button
                            size="sm"
                            level="link"
                            className="m-l"
                            onClick={() => onChange('')}
                          >
                            Remove DrillDown
                          </Button>
                        ) : null}
                      </div>
                    )
                  }
                ]
              },
              getSchemaTpl('status')
            ])
          ]
        },
        {
          title: 'Appearance',
          body: getSchemaTpl('collapseGroup', [
            {
              title: 'Width and height settings',
              body: [
                getSchemaTpl('style:widthHeight', {
                  widthSchema: {
                    label: tipedLabel(
                      'width',
                      'The default width is the parent container width, the value unit is px by default, and percentage units are also supported, such as: 100%'
                    ),
                    pipeIn: defaultValue('100%')
                  },
                  heightSchema: {
                    label: tipedLabel(
                      'high',
                      'The default height is 300px, the value unit is px by default, and percentage units are also supported, such as: 100%'
                    ),
                    pipeIn: defaultValue('300px')
                  }
                })
              ]
            },
            ...getSchemaTpl('theme:common', {exclude: ['layout']})
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
      ])
    ];
  };

  editDrillDown(id: string) {
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id);
    const value = store.getValueOf(id);

    const dialog = (value.clickAction && value.clickAction.dialog) || {
      title: 'Title',
      body: ['<p>内容 <code>${value|json}</code></p>']
    };

    node &&
      value &&
      this.manager.openSubEditor({
        title: 'Configure DrillDown Details',
        value: {
          type: 'container',
          ...dialog
        },
        slot: {
          type: 'container',
          body: '$$'
        },
        typeMutable: false,
        onChange: newValue => {
          newValue = {
            ...value,
            clickAction: {
              actionType: 'dialog',
              dialog: newValue
            }
          };
          manager.panelChangeValue(newValue, diff(value, newValue));
        }
      });
  }
}

registerEditorPlugin(ChartPlugin);

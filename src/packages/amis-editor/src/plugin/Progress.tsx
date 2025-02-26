import {
  registerEditorPlugin,
  RendererPluginAction,
  BaseEventContext,
  BasePlugin,
  defaultValue,
  getSchemaTpl,
  tipedLabel
} from 'amis-editor-core';
import {getActionCommonProps} from '../renderer/event-control/helper';

export class ProgressPlugin extends BasePlugin {
  static id = 'ProgressPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'progress';
  $schema = '/schemas/ProgressSchema.json';

  // Component name
  name = 'Progress Display';
  searchKeywords = 'progress bar, progress';
  isBaseComponent = true;
  description =
    'Used to show progress. Each progress segment can be configured to display in different colors.';
  docLink = '/amis/zh-CN/components/progress';
  tags = ['show'];
  icon = 'fa fa-angle-double-right';
  pluginIcon = 'progress-plugin';
  scaffold = {
    type: 'progress',
    mode: 'line',
    value: 66,
    strokeWidth: 6,
    valueTpl: '${value}%'
  };
  previewSchema = {
    ...this.scaffold
  };

  //Action definition
  actions: RendererPluginAction[] = [
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

  panelTitle = 'Progress';

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    const isFormItem = !!context?.info.renderer.isFormItem;
    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              {
                label: 'type',
                name: 'mode',
                type: 'select',
                option: 'Inherit',
                pipeIn: defaultValue('line'),
                tiled: true,
                options: [
                  {
                    label: 'Linear',
                    value: 'line'
                  },

                  {
                    label: 'round',
                    value: 'circle'
                  },

                  {
                    label: 'Dashboard',
                    value: 'dashboard'
                  }
                ],
                onChange: (
                  value: any,
                  oldValue: boolean,
                  model: any,
                  form: any
                ) => {
                  if (value === 'circle') {
                    form.setValueByName('gapDegree', 0);
                    form.setValueByName('gapPosition', '');
                  } else if (value === 'dashboard') {
                    form.setValueByName('gapDegree', 75);
                    form.setValueByName('gapPosition', 'bottom');
                  }
                }
              },
              getSchemaTpl('valueFormula', {
                rendererSchema: {
                  ...context?.schema,
                  type: 'input-number'
                },
                needDeleteProps: ['placeholder'],
                valueType: 'number' // Expects a numeric type, but amis will try a string trans numeric type
              }),

              getSchemaTpl('switch', {
                name: 'showLabel',
                label: 'Progress value',
                pipeIn: defaultValue(true)
              }),

              getSchemaTpl('placeholder', {
                value: '-',
                placeholder: 'No data space prompt',
                label: tipedLabel(
                  'Placeholder tip',
                  'Value when the data field is undefined, excluding 0'
                )
              })
            ]
          },
          getSchemaTpl('status', {isFormItem})
        ])
      },
      {
        title: 'Appearance',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: [
              {
                type: 'select',
                name: 'progressClassName',
                label: 'Size',
                value: '',
                options: [
                  {
                    label: 'extremely small',
                    value: 'w-xs'
                  },

                  {
                    label: 'small',
                    value: 'w-sm'
                  },

                  {
                    label: 'Medium',
                    value: 'w-md'
                  },

                  {
                    label: 'big',
                    value: 'w-lg'
                  },

                  {
                    label: 'Default',
                    value: ''
                  }
                ]
              },
              {
                type: 'input-number',
                name: 'strokeWidth',
                label: 'Line width',
                value: 6,
                min: 0,
                max: 100
              },
              {
                type: 'input-number',
                name: 'gapDegree',
                visibleOn: 'this.mode === "dashboard"',
                label: 'Notch angle',
                value: 75,
                min: 0,
                max: 295
              },
              {
                label: 'Gap location',
                name: 'gapPosition',
                type: 'button-group-select',
                visibleOn: 'this.mode === "dashboard"',
                value: defaultValue('bottom'),
                tiled: true,
                options: [
                  {
                    label: 'up',
                    value: 'top'
                  },

                  {
                    label: 'Next',
                    value: 'bottom'
                  },

                  {
                    label: 'Left',
                    value: 'left'
                  },
                  {
                    label: 'Right',
                    value: 'right'
                  }
                ]
              },
              getSchemaTpl('switch', {
                name: 'animate',
                label: 'Show animation',
                visibleOn: 'this.mode === "line"'
              }),
              {
                type: 'button-group-select',
                name: 'styleType',
                label: 'Style',
                visibleOn: 'this.mode === "line"',
                options: [
                  {
                    label: 'Pure color',
                    value: 'purity'
                  },
                  {
                    label: 'stripes',
                    value: 'stripe'
                  }
                ],
                pipeIn: (value: any, form: any) => {
                  return form.data?.stripe ? 'stripe' : 'purity';
                },
                onChange(value: any, oldValue: boolean, model: any, form: any) {
                  form.setValueByName('stripe', value === 'stripe');
                }
              },
              getSchemaTpl('combo-container', {
                name: 'map',
                type: 'combo',
                mode: 'normal',
                multiple: true,
                label: tipedLabel(
                  'color',
                  'Assign different value segments and use different colors to prompt users. If you only configure a color without configuring a value, the default value is 100'
                ),
                items: [
                  {
                    placeholder: 'color',
                    type: 'input-color',
                    name: 'color'
                  },
                  {
                    type: 'input-number',
                    name: 'value',
                    placeholder: 'value',
                    columnClassName: 'w-xs',
                    unique: true,
                    requiredOn: 'this.map?.length > 1',
                    min: 0,
                    step: 10,
                    precision: 0
                  }
                ],
                value: [
                  {color: '#dc3545', value: 20},
                  {color: '#fad733', value: 60},
                  {color: '#28a745', value: 100}
                ],
                pipeIn: (mapItem: any) => {
                  // schema passed in
                  if (Array.isArray(mapItem) && mapItem.length) {
                    return typeof mapItem[0] === 'string'
                      ? mapItem.map((item: string, index: number) => {
                          const span = 100 / mapItem.length;
                          return {value: (index + 1) * span, color: item};
                        })
                      : mapItem.length === 1 && !mapItem[0].value
                      ? [{color: mapItem[0].color, value: 100}]
                      : mapItem;
                  } else {
                    return mapItem ? [mapItem] : [];
                  }
                },

                pipeOut: (mapItem: any, origin: any, data: any) => {
                  // Pass in the schema
                  if (mapItem.length === 1 && !mapItem[0].value) {
                    // If there is only one color and value is not set, the default value is 100
                    return [{color: mapItem[0].color, value: 100}];
                  } else {
                    return mapItem;
                  }
                }
              })
            ]
          },
          getSchemaTpl('style:classNames', {
            schema: [],
            isFormItem
          })
        ])
      }
    ]);
  };
}

registerEditorPlugin(ProgressPlugin);

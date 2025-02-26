import {isObject} from 'amis';
import type {IFormStore, IFormItemStore} from '@/packages/amis-core/src';
import {
  BasePlugin,
  defaultValue,
  getSchemaTpl,
  tipedLabel,
  registerEditorPlugin
} from '@/packages/amis-editor-core/src';
import type {
  EditorNodeType,
  RendererPluginAction,
  RendererPluginEvent,
  BaseEventContext,
  EditorManager
} from '@/packages/amis-editor-core/src';
import {ValidatorTag} from '../../validator';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';

export class RangeControlPlugin extends BasePlugin {
  static id = 'RangeControlPlugin';
  // Associated renderer name
  rendererName = 'input-range';
  $schema = '/schemas/RangeControlSchema.json';

  // Component name
  name = 'Slider';
  isBaseComponent = true;
  icon = 'fa fa-sliders';
  pluginIcon = 'input-range-plugin';
  description = 'Select a value or a range';
  docLink = '/amis/zh-CN/components/form/input-range';
  tags = ['form item'];
  scaffold = {
    type: 'input-range',
    label: 'Slider',
    name: 'range'
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

  // Event definition
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: 'value change',
      description: 'Triggered when the slider value changes',
      dataSchema: (manager: EditorManager) => {
        const node = manager.store.getNodeById(manager.store.activeId);
        const schemas = manager.dataSchema.current.schemas;
        const dataSchema = schemas.find(
          item => item.properties?.[node!.schema.name]
        );

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  value: {
                    type: 'number',
                    ...((dataSchema?.properties?.[node!.schema.name] as any) ??
                      {}),
                    title: 'Current slider value'
                  }
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
      description:
        'When showInput is set to true, it is triggered when the input box gets the focus',
      dataSchema: (manager: EditorManager) => {
        const node = manager.store.getNodeById(manager.store.activeId);
        const schemas = manager.dataSchema.current.schemas;
        const dataSchema = schemas.find(
          item => item.properties?.[node!.schema.name]
        );

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  value: {
                    type: 'number',
                    ...((dataSchema?.properties?.[node!.schema.name] as any) ??
                      {}),
                    title: 'Current value'
                  }
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
      description:
        'When showInput is set to true, it is triggered when the input box loses focus',
      dataSchema: (manager: EditorManager) => {
        const node = manager.store.getNodeById(manager.store.activeId);
        const schemas = manager.dataSchema.current.schemas;
        const dataSchema = schemas.find(
          item => item.properties?.[node!.schema.name]
        );

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  value: {
                    type: 'number',
                    ...((dataSchema?.properties?.[node!.schema.name] as any) ??
                      {}),
                    title: 'Current value'
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
      description: 'Clear input box',
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

  panelTitle = 'Slider';

  panelJustify = true;

  filterProps(props: Record<string, any>, node: EditorNodeType) {
    if (
      props.marks &&
      isObject(props.marks) &&
      props.marks.hasOwnProperty('$$id')
    ) {
      delete props.marks.$$id;
    }

    return props;
  }

  panelBodyCreator = (context: BaseEventContext) => {
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
              getSchemaTpl('switch', {
                label: 'Double slider',
                name: 'multiple'
              }),
              {
                type: 'container',
                className: 'ae-sub-content',
                visibleOn: 'this.multiple',
                body: [
                  getSchemaTpl('joinValues', {
                    onChange: (
                      value: boolean,
                      oldValue: boolean,
                      model: IFormItemStore,
                      form: IFormStore
                    ) => {
                      form.deleteValueByName('value');
                    }
                  }),
                  getSchemaTpl('delimiter', {
                    onChange: (
                      value: string,
                      oldValue: string,
                      model: IFormItemStore,
                      form: IFormStore
                    ) => {
                      form.deleteValueByName('value');
                    }
                  })
                ]
              },
              {
                type: 'ae-input-range-value',
                name: 'value',
                label: 'Default value',
                visibleOn: 'this.multiple',
                precision: '${precision}'
              },

              getSchemaTpl('valueFormula', {
                name: 'value',
                rendererSchema: {
                  ...context?.schema,
                  type: 'input-number'
                },
                valueType: 'number', // expected value type
                visibleOn: '!this.multiple',
                pipeIn: defaultValue(0),
                precision: '${precision}'
              }),

              getSchemaTpl('valueFormula', {
                name: 'min',
                rendererSchema: {
                  ...context?.schema,
                  type: 'input-number'
                },
                pipeIn: defaultValue(0),
                needDeleteProps: ['min'], // avoid self-limitation
                label: 'minimum value',
                valueType: 'number',
                precision: '${precision}'
              }),
              getSchemaTpl('valueFormula', {
                name: 'max',
                rendererSchema: {
                  ...context?.schema,
                  type: 'input-number'
                },
                pipeIn: defaultValue(100),
                needDeleteProps: ['max'], // avoid self-limitation
                label: 'maximum value',
                valueType: 'number',
                precision: '${precision}'
              }),
              {
                label: 'step length',
                name: 'step',
                type: 'input-number',
                value: 1,
                precision: '${precision}',
                pipeOut: (value?: number) => {
                  return value || 1;
                }
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

              getSchemaTpl('unit'),

              // When tooltipVisible is true, it will always be displayed. When it is undefined, it will be displayed when the mouse moves into the
              getSchemaTpl('switch', {
                name: 'tooltipVisible',
                label: 'value label',
                value: undefined,
                pipeOut: (value?: boolean) => {
                  return !!value ? undefined : false;
                },
                pipeIn: (value?: boolean) => {
                  return value === undefined || value === true ? true : false;
                }
              }),

              {
                type: 'container',
                className: 'ae-ExtendMore mb-2',
                visibleOn: 'this.tooltipVisible === undefined',
                body: [
                  {
                    type: 'select',
                    name: 'tooltipPlacement',
                    label: 'direction',
                    value: 'auto',
                    options: [
                      {label: 'Automatic', value: 'auto'},
                      {label: '上', value: 'top'},
                      {label: '下', value: 'bottom'},
                      {label: '左', value: 'left'},
                      {label: ' 右 ', value: ' right '}
                    ]
                  }
                ]
              },

              getSchemaTpl('switch', {
                name: 'showInput',
                label: 'Can be input',
                value: false
              }),

              getSchemaTpl('switch', {
                name: 'clearable',
                label: 'Resettable',
                value: false,
                visibleOn: '!!this.showInput'
              }),
              getSchemaTpl('autoFillApi')
            ]
          },
          {
            title: 'Track',
            body: [
              {
                type: 'ae-partsControl',
                mode: 'normal'
              },
              {
                type: 'ae-marksControl',
                mode: 'normal',
                name: 'marks'
              }
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
            getSchemaTpl('style:formItem', {renderer: context.info.renderer}),
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
    if (node.schema?.multiple && node.schema?.joinValues === false) {
      return {
        type: 'object',
        title: node.schema?.label || node.schema?.name,
        properties: {
          max: {
            type: 'number',
            title: 'Maximum value'
          },
          min: {
            type: 'number',
            title: 'Minimum value'
          }
        },
        originalValue: node.schema?.value // Record the original value, required for circular reference detection
      };
    }

    return {
      type: 'number',
      title: node.schema?.label || node.schema?.name,
      originalValue: node.schema?.value // Record the original value, required for circular reference detection
    };
  }
}

registerEditorPlugin(RangeControlPlugin);

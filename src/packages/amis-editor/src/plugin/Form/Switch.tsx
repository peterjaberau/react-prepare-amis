import {
  defaultValue,
  getSchemaTpl,
  undefinedPipeOut,
  registerEditorPlugin,
  BasePlugin,
  BaseEventContext,
  EditorManager,
  EditorNodeType,
  RendererPluginAction,
  RendererPluginEvent
} from 'amis-editor-core';
import {isExpression, isPureVariable} from 'amis-core';
import omit from 'lodash/omit';
import {ValidatorTag} from '../../validator';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';

export class SwitchControlPlugin extends BasePlugin {
  static id = 'SwitchControlPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'switch';
  $schema = '/schemas/SwitchControlSchema.json';

  // Component name
  name = 'switch';
  isBaseComponent = true;
  icon = 'fa fa-toggle-on';
  pluginIcon = 'switch-plugin';
  description = 'Switch control';
  docLink = '/amis/zh-CN/components/form/switch';
  tags = ['form item'];
  scaffold = {
    type: 'switch',
    label: 'switch',
    option: 'Description',
    name: 'switch',
    falseValue: false,
    trueValue: true
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold,
        label: 'Switch form'
      }
    ]
  };

  notRenderFormZone = true;

  panelTitle = 'Switch';

  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: 'value change',
      description: 'Trigger when the switch value changes',
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
                    type: 'string',
                    ...((dataSchema?.properties?.[node!.schema.name] as any) ??
                      {}),
                    title: 'Switch value'
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
      actionType: 'setValue',
      actionLabel: 'Assignment',
      description: 'Trigger component data update',
      ...getActionCommonProps('setValue')
    }
  ];

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) =>
    getSchemaTpl('tabs', [
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

              getSchemaTpl('switchOption'),

              {
                type: 'ae-switch-more',
                bulk: true,
                mode: 'normal',
                label: 'Fill text',
                formType: 'extend',
                form: {
                  body: [getSchemaTpl('onText'), getSchemaTpl('offText')]
                }
              },
              {
                type: 'ae-switch-more',
                mode: 'normal',
                label: 'value format',
                formType: 'extend',
                form: {
                  body: [
                    {
                      type: 'ae-valueFormat',
                      name: 'trueValue',
                      label: 'When turned on',
                      pipeIn: defaultValue(true),
                      pipeOut: undefinedPipeOut,
                      onChange: (
                        value: any,
                        oldValue: any,
                        model: any,
                        form: any
                      ) => {
                        const {value: defaultValue, trueValue} =
                          form?.data || {};
                        if (isPureVariable(defaultValue)) {
                          return;
                        }
                        if (trueValue === defaultValue && trueValue !== value) {
                          form.setValues({value});
                        }
                      }
                    },
                    {
                      type: 'ae-valueFormat',
                      name: 'falseValue',
                      label: 'When closed',
                      pipeIn: defaultValue(false),
                      pipeOut: undefinedPipeOut,
                      onChange: (
                        value: any,
                        oldValue: any,
                        model: any,
                        form: any
                      ) => {
                        const {value: defaultValue, falseValue} =
                          form?.data || {};
                        if (isPureVariable(defaultValue)) {
                          return;
                        }
                        if (
                          falseValue === defaultValue &&
                          falseValue !== value
                        ) {
                          form.setValues({value});
                        }
                      }
                    }
                  ]
                }
              },

              /* Old version setting default value
              getSchemaTpl('switch', {
                name: 'value',
                label: 'Enabled by default',
                pipeIn: (value: any, data: any) => {
                  const {trueValue = true} = data.data || {};
                  return value === trueValue ? true : false;
                },
                pipeOut: (value: any, origin: any, data: any) => {
                  return value
                    ? data.trueValue || true
                    : data.falseValue || false;
                }
              }),
              */
              getSchemaTpl('valueFormula', {
                rendererSchema: {
                  ...omit(context?.schema, ['trueValue', 'falseValue']),
                  type: 'switch'
                },
                needDeleteProps: ['option'],
                rendererWrapper: true, // Wrap with light-colored wireframe to increase the sense of border
                valueType: 'boolean',
                pipeIn: (value: any, data: any) => {
                  if (isPureVariable(value)) {
                    return value;
                  }
                  return value === (data?.data?.trueValue ?? true);
                },
                pipeOut: (value: any, origin: any, data: any) => {
                  // If it is an expression, return it directly
                  if (isExpression(value)) return value;
                  const {trueValue = true, falseValue = false} = data || {};
                  return value ? trueValue : falseValue;
                }
              }),
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('description'),
              getSchemaTpl('autoFillApi')
            ]
          },
          getSchemaTpl('status', {isFormItem: true}),
          getSchemaTpl('validation', {tag: ValidatorTag.Check})
        ])
      },
      {
        title: 'Appearance',
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('style:formItem', {renderer: context.info.renderer}),
          {
            title: 'Description',
            body: [
              getSchemaTpl('horizontal-align', {
                name: 'optionAtLeft',
                pipeIn: (v: boolean) => (v ? 'left' : 'right'),
                pipeOut: (v: string) => (v === 'left' ? true : undefined)
              })
            ]
          },
          getSchemaTpl('style:classNames')
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

  buildDataSchemas(node: EditorNodeType, region: EditorNodeType) {
    // By default trueValue and falseValue are of the same type
    return {
      type: node.schema?.trueValue ? typeof node.schema?.trueValue : 'boolean',
      title: node.schema?.label || node.schema?.name,
      originalValue: node.schema?.value // Record the original value, required for circular reference detection
    };
  }
}

registerEditorPlugin(SwitchControlPlugin);

import {
  defaultValue,
  setSchemaTpl,
  getSchemaTpl,
  undefinedPipeOut,
  EditorNodeType,
  EditorManager,
  registerEditorPlugin,
  BasePlugin,
  BaseEventContext,
  tipedLabel,
  RendererPluginAction,
  RendererPluginEvent
} from '@/packages/amis-editor-core/src';
import {isPureVariable} from '@/packages/src';
import omit from 'lodash/omit';
import {inputStateTpl} from '../../renderer/style-control/helper';
import {ValidatorTag} from '../../validator';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';

setSchemaTpl('option', {
  name: 'option',
  type: 'input-text',
  label: tipedLabel('Description', 'Option Description')
});
export class CheckboxControlPlugin extends BasePlugin {
  static id = 'CheckboxControlPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'checkbox';
  $schema = '/schemas/CheckboxControlSchema.json';

  // Component name
  name = 'Checkbox';
  isBaseComponent = true;
  icon = 'fa fa-check-square-o';
  pluginIcon = 'checkbox-plugin';
  description = 'Checkbox';
  docLink = '/amis/zh-CN/components/form/checkbox';
  tags = ['form item'];
  scaffold = {
    type: 'checkbox',
    option: 'check box',
    name: 'checkbox',
    label: 'Check box'
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    wrapWithPanel: false,
    mode: 'horizontal',
    body: [
      {
        value: true,
        ...this.scaffold,
        label: 'Check the form'
      }
    ]
  };
  notRenderFormZone = true;
  panelTitle = 'Checkbox';
  panelJustify = true;
  // Event definition
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: 'value change',
      description: 'Triggered when the selected state changes',
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
                    title: 'Status value'
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
              getSchemaTpl('option'),
              {
                type: 'ae-switch-more',
                hiddenOnDefault: false,
                mode: 'normal',
                label: 'value format',
                formType: 'extend',
                form: {
                  body: [
                    {
                      type: 'ae-valueFormat',
                      name: 'trueValue',
                      label: 'Check value',
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
                      label: 'Unchecked value',
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
              getSchemaTpl('valueFormula', {
                rendererSchema: {
                  ...omit(context?.schema, ['trueValue', 'falseValue']),
                  type: 'switch'
                },
                needDeleteProps: ['option'],
                label: 'Check by default',
                rendererWrapper: true, // Wrap with light-colored wireframe to increase the sense of border
                valueType: 'boolean',
                pipeIn: (value: any, data: any) => {
                  if (isPureVariable(value)) {
                    return value;
                  }
                  return value === (data?.data?.trueValue ?? true);
                },
                pipeOut: (value: any, origin: any, data: any) => {
                  if (isPureVariable(value)) {
                    return value;
                  }
                  const {trueValue = true, falseValue = false} = data;
                  return value ? trueValue : falseValue;
                }
              }),
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('description'),
              getSchemaTpl('autoFillApi', {
                trigger: 'change'
              })
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
            getSchemaTpl('theme:formItem', {
              schema: [
                {
                  type: 'select',
                  label: 'mode',
                  name: 'optionType',
                  value: 'default',
                  options: [
                    {
                      label: 'Default',
                      value: 'default'
                    },
                    {
                      label: 'button',
                      value: 'button'
                    }
                  ]
                }
              ]
            }),
            getSchemaTpl('theme:form-label'),
            getSchemaTpl('theme:form-description'),
            {
              title: 'Option Style',
              body: [
                ...inputStateTpl('themeCss.checkboxControlClassName', '', {
                  fontToken(state) {
                    const s = state.split('-');
                    if (s[0] === 'checked') {
                      return {
                        'color': `--checkbox-\${optionType}-checked-${s[1]}-text-color`,
                        '*': '--checkbox-${optionType}-default'
                      };
                    }
                    return {
                      'color': `--checkbox-\${optionType}-${s[1]}-text-color`,
                      '*': '--checkbox-${optionType}-default'
                    };
                  },
                  backgroundToken(state) {
                    const s = state.split('-');
                    if (s[0] === 'checked') {
                      return `\${optionType === "button" ? "--checkbox-" + optionType + "-checked-${s[1]}-bg-color" : ""}`;
                    }
                    return `\${optionType === "button" ? "--checkbox-" + optionType + "-${s[1]}-bg-color" : ""}`;
                  },
                  borderToken(state) {
                    const s = state.split('-');
                    const fn = (type: string, checked?: boolean) => {
                      return `\${optionType === "button" ? "--checkbox-" + optionType + "${
                        checked ? '-checked' : ''
                      }-${s[1]}-${type}" : ""}`;
                    };
                    if (s[0] === 'checked') {
                      return {
                        'topBorderColor': fn('top-border-color', true),
                        'rightBorderColor': fn('right-border-color', true),
                        'bottomBorderColor': fn('bottom-border-color', true),
                        'leftBorderColor': fn('left-border-color', true),
                        '*': '--checkbox-${optionType}-default'
                      };
                    }
                    return {
                      'topBorderColor': fn('top-border-color'),
                      'rightBorderColor': fn('right-border-color'),
                      'bottomBorderColor': fn('bottom-border-color'),
                      'leftBorderColor': fn('left-border-color'),
                      '*': '--checkbox-${optionType}-default'
                    };
                  },
                  radiusToken(state) {
                    return '${optionType === "button" ? "--checkbox-" + optionType + "-default": "-"}';
                  },
                  state: [
                    {
                      label: 'General',
                      value: 'checkbox-default'
                    },
                    {
                      label: 'Suspension',
                      value: 'checkbox-hover'
                    },
                    {
                      label: 'disable',
                      value: 'checkbox-disabled'
                    },
                    {
                      label: 'Selected',
                      value: 'checked-default'
                    },
                    {
                      label: 'Selected state suspension',
                      value: 'checked-hover'
                    },
                    {
                      label: 'Select to disable',
                      value: 'checked-disabled'
                    }
                  ]
                })
              ]
            },
            {
              title: 'Checkbox Style',
              body: [
                {
                  label: 'Hide checkbox',
                  type: 'switch',
                  name: 'themeCss.checkboxShowClassName.display',
                  trueValue: 'none'
                },
                ...inputStateTpl('themeCss.checkboxClassName', '', {
                  hideFont: true,
                  hideMargin: true,
                  hidePadding: true,
                  hiddenOn: 'themeCss.checkboxShowClassName.display === "none"',
                  backgroundToken(state) {
                    const s = state.split('-');
                    if (s[0] === 'checked') {
                      return `--checkbox-\${optionType}-checked-${s[1]}-\${optionType ==='button' ? 'icon-' : ''}bg-color`;
                    }
                    return `--checkbox-\${optionType}-${s[1]}-\${optionType ==='button' ? 'icon-' : ''}bg-color`;
                  },
                  borderToken(state) {
                    const s = state.split('-');
                    if (s[0] === 'checked') {
                      return `--checkbox-\${optionType}-checked-${s[1]}\${optionType ==='button' ? '-icon' : ''}`;
                    }
                    return `--checkbox-\${optionType}-${s[1]}\${optionType ==='button' ? '-icon' : ''}`;
                  },
                  radiusToken(state) {
                    const s = state.split('-');
                    if (s[0] === 'checked') {
                      return `--checkbox-\${optionType}-checked-${s[1]}`;
                    }
                    return `--checkbox-\${optionType}-${s[1]}\${optionType ==='button' ? '-icon' : ''}`;
                  },
                  state: [
                    {
                      label: 'General',
                      value: 'checkbox-default'
                    },
                    {
                      label: 'Suspension',
                      value: 'checkbox-hover'
                    },
                    {
                      label: 'disable',
                      value: 'checkbox-disabled'
                    },
                    {
                      label: 'Selected',
                      value: 'checked-default'
                    },
                    {
                      label: 'Selected state suspension',
                      value: 'checked-hover'
                    },
                    {
                      label: 'Select to disable',
                      value: 'checked-disabled'
                    }
                  ],
                  schema: [
                    {
                      name: 'themeCss.checkboxShowClassName.--checkbox-default-checked-default-icon',
                      visibleOn:
                        '${__editorStatethemeCss.checkboxClassName == "checked-default" || __editorStatethemeCss.checkboxClassName == "checked-hover" || __editorStatethemeCss.checkboxClassName == "checked-disabled"}',
                      label: 'icon',
                      type: 'icon-select',
                      returnSvg: true,
                      noSize: true
                    },
                    getSchemaTpl('theme:colorPicker', {
                      name: 'themeCss.checkboxInnerClassName.color:default',
                      visibleOn:
                        '${__editorStatethemeCss.checkboxClassName == "checked-default"}',
                      label: 'icon color',
                      labelMode: 'input',
                      editorValueToken:
                        '--checkbox-${optionType}-checked-default-icon-color'
                    }),
                    getSchemaTpl('theme:colorPicker', {
                      name: 'themeCss.checkboxInnerClassName.color:hover',
                      visibleOn:
                        '${__editorStatethemeCss.checkboxClassName == "checked-hover"}',
                      label: 'icon color',
                      labelMode: 'input',
                      editorValueToken:
                        '--checkbox-${optionType}-checked-default-icon-color'
                    }),
                    getSchemaTpl('theme:colorPicker', {
                      name: 'themeCss.checkboxInnerClassName.color:disabled',
                      visibleOn:
                        '${__editorStatethemeCss.checkboxClassName == "checked-disabled"}',
                      label: 'icon color',
                      labelMode: 'input',
                      editorValueToken:
                        '--checkbox-${optionType}-checked-disabled-icon-color'
                    })
                  ]
                })
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
    // By default trueValue and falseValue are of the same type
    return {
      type: node.schema?.trueValue ? typeof node.schema?.trueValue : 'boolean',
      title: node.schema?.label || node.schema?.name,
      originalValue: node.schema?.value // Record the original value, required for circular reference detection
    };
  }
}

registerEditorPlugin(CheckboxControlPlugin);

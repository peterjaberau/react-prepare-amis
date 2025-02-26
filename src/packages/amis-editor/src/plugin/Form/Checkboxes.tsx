import {
  defaultValue,
  setSchemaTpl,
  getSchemaTpl,
  valuePipeOut,
  EditorNodeType,
  EditorManager,
  undefinedPipeOut,
  RendererPluginAction,
  RendererPluginEvent,
  BasePlugin,
  BasicSubRenderInfo,
  RendererEventContext,
  SubRendererInfo,
  BaseEventContext,
  registerEditorPlugin
} from '@/packages/amis-editor-core/src';
import type {Schema} from 'amis';
import {ValidatorTag} from '../../validator';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';
import {
  OPTION_EDIT_EVENTS,
  resolveOptionEventDataSchame,
  resolveOptionType
} from '../../util';
import {inputStateTpl} from '../../renderer/style-control/helper';

export class CheckboxesControlPlugin extends BasePlugin {
  static id = 'CheckboxesControlPlugin';
  // Associated renderer name
  rendererName = 'checkboxes';
  $schema = '/schemas/CheckboxesControlSchema.json';

  // Component name
  name = 'Checkbox';
  isBaseComponent = true;
  icon = 'fa fa-check-square';
  pluginIcon = 'checkboxes-plugin';
  description =
    'Configure multiple checkboxes through <code>options</code>, and also pull options through <code>source</code>';
  docLink = '/amis/zh-CN/components/form/checkboxes';
  tags = ['form item'];
  scaffold = {
    type: 'checkboxes',
    label: 'Checkbox',
    name: 'checkboxes',
    multiple: true,
    options: [
      {
        label: 'Option A',
        value: 'A'
      },

      {
        label: 'Option B',
        value: 'B'
      }
    ]
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        value: 'A',
        ...this.scaffold
      }
    ]
  };

  notRenderFormZone = true;

  panelTitle = 'Checkbox';

  // Event definition
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: 'value change',
      description: 'Triggered when the selected value changes',
      dataSchema: (manager: EditorManager) => {
        const {value} = resolveOptionEventDataSchame(manager, true);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  value
                }
              }
            }
          }
        ];
      }
    },
    ...OPTION_EDIT_EVENTS
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
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    const renderer: any = context.info.renderer;

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
              [
                getSchemaTpl('switch', {
                  label: 'All selectable',
                  name: 'checkAll',
                  value: false,
                  visibleOn: 'this.multiple',
                  onChange: (value: any, origin: any, item: any, form: any) => {
                    if (!value) {
                      // When all selections can be closed, all selections must also be closed by default
                      form.setValueByName('defaultCheckAll', false);
                      form.setValueByName('checkAllText', undefined);
                    }
                  }
                }),
                {
                  type: 'container',
                  className: 'ae-ExtendMore mb-2',
                  visibleOn: 'this.checkAll',
                  body: [
                    getSchemaTpl('switch', {
                      label: 'Default all selected',
                      name: 'defaultCheckAll',
                      value: false
                    }),
                    {
                      type: 'input-text',
                      label: 'Select all text',
                      name: 'checkAllText'
                    }
                  ]
                }
              ],
              getSchemaTpl('joinValues', {
                visibleOn: true
              }),
              getSchemaTpl('delimiter', {
                visibleOn: 'this.joinValues === true'
              }),
              getSchemaTpl('extractValue'),
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('description'),
              getSchemaTpl('autoFillApi', {
                trigger: 'change'
              })
            ]
          },
          {
            title: 'Options',
            id: 'properties-options',
            body: [
              getSchemaTpl('optionControlV2', {
                multiple: true
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
              // Custom options template
              getSchemaTpl('optionsMenuTpl', {
                manager: this.manager
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
                getSchemaTpl('switch', {
                  label: 'One line of options displayed',
                  name: 'inline',
                  hiddenOn: 'this.mode === "inline"',
                  pipeIn: defaultValue(true)
                }),
                {
                  label: 'Number of options per line',
                  name: 'columnsCount',
                  hiddenOn: 'this.mode === "inline" || this.inline !== false',
                  type: 'input-range',
                  min: 1,
                  max: 6,
                  pipeIn: defaultValue(1)
                },
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
                ...inputStateTpl('themeCss.checkboxesControlClassName', '', {
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
                  name: 'themeCss.checkboxesShowClassName.display',
                  trueValue: 'none'
                },
                ...inputStateTpl('themeCss.checkboxesClassName', '', {
                  hideFont: true,
                  hideMargin: true,
                  hidePadding: true,
                  hiddenOn:
                    'themeCss.checkboxesShowClassName.display === "none"',
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
                      name: 'themeCss.checkboxesShowClassName.--checkbox-default-checked-default-icon',
                      visibleOn:
                        '${__editorStatethemeCss.checkboxesClassName == "checked-default" || __editorStatethemeCss.checkboxesClassName == "checked-hover" || __editorStatethemeCss.checkboxesClassName == "checked-disabled"}',
                      label: 'icon',
                      type: 'icon-select',
                      returnSvg: true,
                      noSize: true
                    },
                    getSchemaTpl('theme:colorPicker', {
                      name: 'themeCss.checkboxesInnerClassName.color:default',
                      visibleOn:
                        '${__editorStatethemeCss.checkboxesClassName == "checked-default"}',
                      label: 'icon color',
                      labelMode: 'input',
                      editorValueToken:
                        '--checkbox-${optionType}-checked-default-icon-color'
                    }),
                    getSchemaTpl('theme:colorPicker', {
                      name: 'themeCss.checkboxesInnerClassName.color:hover',
                      visibleOn:
                        '${__editorStatethemeCss.checkboxesClassName == "checked-hover"}',
                      label: 'icon color',
                      labelMode: 'input',
                      editorValueToken:
                        '--checkbox-${optionType}-checked-default-icon-color'
                    }),
                    getSchemaTpl('theme:colorPicker', {
                      name: 'themeCss.checkboxesInnerClassName.color:disabled',
                      visibleOn:
                        '${__editorStatethemeCss.checkboxesClassName == "checked-disabled"}',
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
    const type = resolveOptionType(node.schema);
    // todo: asynchronous data case
    let dataSchema: any = {
      type,
      title: node.schema?.label || node.schema?.name,
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

registerEditorPlugin(CheckboxesControlPlugin);

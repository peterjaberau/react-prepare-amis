import {
  EditorManager,
  EditorNodeType,
  RAW_TYPE_MAP,
  defaultValue,
  getSchemaTpl,
  registerEditorPlugin,
  BasePlugin,
  BaseEventContext,
  RendererPluginAction,
  RendererPluginEvent
} from '@/packages/amis-editor-core/src';
import type {Schema, SchemaType} from '@/packages/src';
import {ValidatorTag} from '../../validator';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';
import {resolveOptionEventDataSchame, resolveOptionType} from '../../util';
import {inputStateTpl} from '../../renderer/style-control/helper';

export class RadiosControlPlugin extends BasePlugin {
  static id = 'RadiosControlPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'radios';
  $schema = '/schemas/RadiosControlSchema.json';

  // Component name
  name = 'Radio Box';
  isBaseComponent = true;
  icon = 'fa fa-dot-circle-o';
  pluginIcon = 'radios-plugin';
  description =
    'Configure options through options, pull options through source';
  docLink = '/amis/zh-CN/components/form/radios';
  tags = ['form item'];
  scaffold = {
    type: 'radios',
    label: 'Radio box',
    name: 'radios',
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
        ...this.scaffold,
        value: 'A'
      }
    ]
  };

  notRenderFormZone = true;

  panelTitle = 'Radio Box';

  // Event definition
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: 'value change',
      description: 'Triggered when the selected value changes',
      dataSchema: (manager: EditorManager) => {
        const {value, selectedItems, items} = resolveOptionEventDataSchame(
          manager,
          false
        );

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  value,
                  selectedItems,
                  items
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
              getSchemaTpl('valueFormula', {
                rendererSchema: (schema: Schema) => schema,
                useSelectMode: true, // Use Select setting mode instead
                visibleOn: 'this.options && this.options.length > 0'
              }),
              // getSchemaTpl('autoFill')
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('autoFillApi', {
                trigger: 'change'
              })
            ]
          },
          {
            title: 'Options',
            id: 'properties-options',
            body: [getSchemaTpl('optionControlV2'), getSchemaTpl('selectFirst')]
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
                ...inputStateTpl('themeCss.radiosControlClassName', '', {
                  fontToken(state) {
                    const s = state.split('-');
                    if (s[1] === 'disabled') {
                      return {
                        'color': `--radio-\${optionType}-\${optionType === "default" ? "disabled-text-color" : "disabled-${
                          s[0] === 'checked' ? 'checked' : 'unchecked'
                        }-text-color"}`,
                        '*': '--radio-${optionType}-default'
                      };
                    }
                    if (s[0] === 'checked') {
                      return {
                        'color': '--radio-${optionType}-checked-text-color',
                        '*': '--radio-${optionType}-default'
                      };
                    }
                    return {
                      'color': `--radio-\${optionType}-${s[1]}-text-color`,
                      '*': '--radio-${optionType}-default'
                    };
                  },
                  backgroundToken(state) {
                    const s = state.split('-');
                    if (s[1] === 'disabled') {
                      return `--radio-\${optionType}-\${optionType === "default" ? "disabled-bg-color" : "disabled-${
                        s[0] === 'checked' ? 'checked' : 'unchecked'
                      }-bg-color"}`;
                    }
                    if (s[0] === 'checked') {
                      return '--radio-${optionType}-checked-bg-color';
                    }
                    return `--radio-\${optionType}-${s[1]}-bg-color`;
                  },
                  radiusToken() {
                    return '--radio-${optionType}-default';
                  },
                  borderToken(state) {
                    const s = state.split('-');
                    let str = s[0] === 'checked' ? 'checked' : s[1];
                    if (s[1] === 'disabled') {
                      str =
                        s[0] === 'checked'
                          ? 'disabled-checked'
                          : 'disabled-unchecked';
                    }
                    return {
                      'topBorderColor': `--radio-\${optionType}-${str}-top-border-color`,
                      'rightBorderColor': `--radio-\${optionType}-${str}-right-border-color`,
                      'bottomBorderColor': `--radio-\${optionType}-${str}-bottom-border-color`,
                      'leftBorderColor': `--radio-\${optionType}-${str}-left-border-color`,
                      '*': '--radio-${optionType}-default'
                    };
                  },
                  state: [
                    {
                      label: 'General',
                      value: 'radios-default'
                    },
                    {
                      label: 'Suspension',
                      value: 'radios-hover'
                    },
                    {
                      label: 'disable',
                      value: 'radios-disabled'
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
              title: 'Radio Box Style',
              hiddenOn: 'optionType === "button"',
              body: [
                {
                  label: 'Hide checkbox',
                  type: 'switch',
                  name: 'themeCss?.radiosShowClassName.display',
                  trueValue: 'none'
                },
                ...inputStateTpl('themeCss.radiosClassName', '', {
                  hideFont: true,
                  hideMargin: true,
                  hidePadding: true,
                  hiddenOn: 'themeCss?.radiosShowClassName.display === "none"',
                  backgroundToken: (state: string) => {
                    const s = state.split('-');
                    if (s[0] === 'checked' && s[1] !== 'disabled') {
                      return `--radio-default-checked-bg-color`;
                    }
                    return `--radio-default-${s[1]}-bg-color`;
                  },
                  borderToken: (state: string) => {
                    const s = state.split('-');
                    let color = `--radio-default-${s[1]}-border-color`;
                    if (s[0] === 'checked' && s[1] !== 'disabled') {
                      color = '--radio-default-checked-border-color';
                    }
                    return {
                      color,
                      width: 'var(--borders-width-2)',
                      style: 'var(--borders-style-2)'
                    };
                  },
                  radiusToken: () => {
                    return {'*': 'var(--borders-radius-7)'};
                  },
                  state: [
                    {
                      label: 'General',
                      value: 'radios-default'
                    },
                    {
                      label: 'Suspension',
                      value: 'radios-hover'
                    },
                    {
                      label: 'disable',
                      value: 'radios-disabled'
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
                      name: 'themeCss.radiosShowClassName.--radio-default-checked-icon',
                      visibleOn:
                        '${__editorStatethemeCss.radiosClassName == "checked-default" || __editorStatethemeCss.radiosClassName == "checked-hover" || __editorStatethemeCss.radiosClassName == "checked-disabled"}',
                      label: 'icon',
                      type: 'icon-select',
                      returnSvg: true,
                      noSize: true
                    },
                    getSchemaTpl('theme:colorPicker', {
                      name: 'themeCss.radiosCheckedInnerClassName.color:default',
                      visibleOn:
                        '${__editorStatethemeCss.radiosClassName == "checked-default"}',
                      label: 'icon color',
                      labelMode: 'input',
                      editorValueToken: '--radio-default-checked-icon-color'
                    }),
                    getSchemaTpl('theme:colorPicker', {
                      name: 'themeCss.radiosCheckedInnerClassName.color:hover',
                      visibleOn:
                        '${__editorStatethemeCss.radiosClassName == "checked-hover"}',
                      label: 'icon color',
                      labelMode: 'input',
                      editorValueToken: '--radio-default-checked-icon-color'
                    }),
                    getSchemaTpl('theme:colorPicker', {
                      name: 'themeCss.radiosCheckedInnerClassName.color:disabled',
                      visibleOn:
                        '${__editorStatethemeCss.radiosClassName == "checked-disabled"}',
                      label: 'icon color',
                      labelMode: 'input',
                      editorValueToken: '--radio-default-disabled-icon-color'
                    })
                  ]
                })
              ]
            },

            getSchemaTpl('theme:cssCode'),
            getSchemaTpl('style:classNames', {
              schema: [
                getSchemaTpl('className', {
                  label: 'Single option',
                  name: 'itemClassName'
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
    const type = resolveOptionType(node.schema);
    // todo: asynchronous data case
    let dataSchema: any = {
      type,
      title: node.schema?.label || node.schema?.name,
      rawType: RAW_TYPE_MAP[node.schema.type as SchemaType] || 'string',
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

    return dataSchema;
  }
}

registerEditorPlugin(RadiosControlPlugin);

import {
  EditorManager,
  EditorNodeType,
  RAW_TYPE_MAP,
  registerEditorPlugin,
  BasePlugin,
  BaseEventContext,
  defaultValue,
  getSchemaTpl,
  tipedLabel
} from '@/packages/amis-editor-core/src';
import type {SchemaType} from '@/packages/src';
import {ValidatorTag} from '../../validator';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';
import {inputStateTpl} from '../../renderer/style-control/helper';
import {resolveOptionEventDataSchame, resolveOptionType} from '../../util';

const isText = 'this.type === "input-text"';
const isPassword = 'this.type === "input-password"';
const isEmail = 'this.type === "input-email"';
const isUrl = 'this.type === "input-url"';
function isTextShow(value: string, name: boolean): boolean {
  return ['input-text'].includes(value) ? !!name : false;
}

export class TextControlPlugin extends BasePlugin {
  static id = 'TextControlPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'input-text';

  $schema = '/schemas/TextControlSchema.json';

  order = -600;
  // Add the Chinese name and type field of the corresponding source component
  searchKeywords =
    'text box, mailbox box, input-email, URL box, input-url, password box, input-password, password input box';
  // Component name
  name = 'text box';

  isBaseComponent = true;
  icon = 'fa fa-terminal';
  pluginIcon = 'input-text-plugin';

  description =
    'Text input box, supports normal text, password, URL, email and other content input';

  docLink = '/amis/zh-CN/components/form/input-text';

  tags = ['form item'];

  scaffold = {
    type: 'input-text',
    label: 'text',
    name: 'text'
  };

  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    wrapWithPanel: false,
    mode: 'horizontal',
    body: [
      {
        ...this.scaffold
      }
    ]
  };

  notRenderFormZone = true;

  panelTitle = 'Text box';

  events = [
    // {
    //   eventName: 'click',
    // eventLabel: 'Click',
    // description: 'Click event'
    // },
    {
      eventName: 'change',
      eventLabel: 'value change',
      description: 'Input box content changes',
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
                    title: 'Current text content'
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
      description: 'Input box gets focus',
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
                    title: 'Current text content'
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
      description: 'The input box loses focus',
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
                    title: 'Current text content'
                  }
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'review',
      eventLabel: 'View password',
      description: 'When you click the view password icon',
      dataSchema: (manager: EditorManager) => {
        const {value} = resolveOptionEventDataSchame(manager);

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
    {
      eventName: 'encrypt',
      eventLabel: 'Hide password',
      description: 'When you click the hide password icon',
      dataSchema: (manager: EditorManager) => {
        const {value} = resolveOptionEventDataSchame(manager);

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
    }
    // Seems invalid, download it first
    // {
    //   eventName: 'enter',
    // eventLabel: 'Enter',
    // description: 'Press Enter'
    // }
  ];

  actions = [
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
    },
    {
      actionType: 'review',
      actionLabel: 'View password',
      description: 'Password type triggers viewing of real password'
    },
    {
      actionType: 'encrypt',
      actionLabel: 'Hide password',
      description: 'The password type triggers hiding the real password'
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
                getSchemaTpl('inputType', {
                  value: this.scaffold.type,
                  onChange: (
                    value: string,
                    oldValue: string,
                    model: any,
                    form: any
                  ) => {
                    const {
                      showCounter,
                      validations,
                      validationErrors = {},
                      autoComplete
                    } = form.data;

                    const is_old_email = oldValue === 'input-email';
                    const is_old_url = oldValue === 'input-url';

                    if (is_old_email) {
                      validations && delete validations.isEmail;
                      validationErrors && delete validationErrors.isEmail;
                    }

                    if (is_old_url) {
                      validations && delete validations.isUrl;
                      validationErrors && delete validationErrors.isUrl;
                    }

                    form.setValues({
                      type: value,
                      showCounter: ['input-url', 'input-email'].includes(value)
                        ? undefined
                        : !!showCounter,
                      autoComplete: ['input-text'].includes(value)
                        ? autoComplete
                        : undefined
                    });
                    form.changeValue('validations', {...validations});
                    form.changeValue('validationErrors', {...validationErrors});
                  }
                }),
                getSchemaTpl('tplFormulaControl', {
                  name: 'value',
                  label: 'Default value'
                }),
                getSchemaTpl('clearable'),
                getSchemaTpl('showCounter', {
                  visibleOn: `${isText} || ${isPassword}`
                }),
                {
                  name: 'maxLength',
                  label: tipedLabel(
                    'Maximum number of characters',
                    'Limit the maximum number of characters to be entered'
                  ),
                  type: 'input-number',
                  min: 0,
                  step: 1
                },
                {
                  name: 'addOn',
                  label: tipedLabel(
                    'AddOn',
                    'Additional widgets on the left or right side of the input box'
                  ),
                  type: 'ae-switch-more',
                  mode: 'normal',
                  formType: 'extend',
                  title: 'AddOn',
                  bulk: false,
                  defaultData: {
                    label: 'button',
                    type: 'button'
                  },
                  form: {
                    body: [
                      {
                        name: 'type',
                        label: 'type',
                        type: 'button-group-select',
                        inputClassName: 'items-center',
                        pipeIn: defaultValue('button'),
                        options: [
                          {
                            label: 'text',
                            value: 'text'
                          },

                          {
                            label: 'button',
                            value: 'button'
                          },

                          {
                            label: 'Submit',
                            value: 'submit'
                          }
                        ]
                      },
                      getSchemaTpl('horizontal-align', {
                        name: 'position',
                        pipeIn: defaultValue('right')
                      }),
                      getSchemaTpl('addOnLabel'),
                      getSchemaTpl('icon')
                    ]
                  }
                },
                getSchemaTpl('labelRemark'),
                getSchemaTpl('remark'),
                getSchemaTpl('placeholder'),
                getSchemaTpl('description'),
                getSchemaTpl('autoFillApi')
              ]
            },
            {
              title: 'Options',
              visibleOn: `${isText} && (this.options  || this.autoComplete || this.source)`,
              body: [
                getSchemaTpl('optionControlV2'),
                getSchemaTpl('multiple', {
                  visibleOn: `${isText} || ${isUrl}`
                }),
                {
                  type: 'ae-Switch-More',
                  mode: 'normal',
                  label: tipedLabel(
                    'Autocomplete',
                    'According to the input content, call the interface to provide options. The current input value is available in the ${term} variable'
                  ),
                  visibleOn: isText,
                  formType: 'extend',
                  defaultData: {
                    autoComplete: {
                      method: 'get',
                      url: ''
                    }
                  },
                  form: {
                    body: [
                      getSchemaTpl('apiControl', {
                        name: 'autoComplete',
                        label: 'Interface',
                        description: '',
                        visibleOn: 'this.autoComplete !== false'
                      }),
                      {
                        label: tipedLabel(
                          'Display fields',
                          'Data fields corresponding to option text, please configure multiple fields through templates'
                        ),
                        type: 'input-text',
                        name: 'labelField',
                        placeholder: 'Field corresponding to the option text'
                      },
                      {
                        label: 'value field',
                        type: 'input-text',
                        name: 'valueField',
                        placeholder: 'Field corresponding to the value'
                      }
                    ]
                  }
                }
              ]
            },
            getSchemaTpl('status', {
              isFormItem: true,
              readonly: true
            }),
            getSchemaTpl('validation', {
              tag: (data: any) => {
                switch (data.type) {
                  case 'input-password':
                    return ValidatorTag.Password;
                  case 'input-email':
                    return ValidatorTag.Email;
                  case 'input-url':
                    return ValidatorTag.URL;
                  default:
                    return ValidatorTag.Text;
                }
              }
            })
            // {
            // title: 'Advanced',
            //   body: [
            //     getSchemaTpl('autoFill')
            //   ]
            // }
          ],
          {...context?.schema, configTitle: 'props'}
        )
      },
      {
        title: 'Appearance',
        body: getSchemaTpl(
          'collapseGroup',
          [
            getSchemaTpl('theme:formItem'),
            getSchemaTpl('theme:form-label'),
            getSchemaTpl('theme:form-description'),
            {
              title: 'Input box style',
              body: [
                ...inputStateTpl(
                  'themeCss.inputControlClassName',
                  '--input-default'
                )
              ]
            },
            {
              title: 'AddOn style',
              visibleOn: 'this.addOn && this.addOn.type === "text"',
              body: [
                getSchemaTpl('theme:font', {
                  label: 'character',
                  name: 'themeCss.addOnClassName.font:default'
                }),
                getSchemaTpl('theme:paddingAndMargin', {
                  name: 'themeCss.addOnClassName.padding-and-margin:default'
                })
              ]
            },
            getSchemaTpl('theme:singleCssCode', {
              selectors: [
                {
                  label: 'Basic style of form items',
                  isRoot: true,
                  selector: '.cxd-from-item'
                },
                {
                  label: 'Title style',
                  selector: '.cxd-Form-label'
                },
                {
                  label: 'text box basic style',
                  selector: '.cxd-TextControl'
                },
                {
                  label: 'Input box outer style',
                  selector: '.cxd-TextControl-input'
                },
                {
                  label: 'input box style',
                  selector: '.cxd-TextControl-input input'
                }
              ]
            })
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

  buildDataSchemas(node: EditorNodeType, region: EditorNodeType) {
    const type = resolveOptionType(node.schema);
    // todo: asynchronous data case
    let dataSchema: any = {
      type,
      title: node.schema?.label || node.schema?.name,
      rawType: RAW_TYPE_MAP[node.schema.type as SchemaType] || 'string',
      originalValue: node.schema?.value // Record the original value, required for circular reference detection
    };

    // Selector mode
    if (node.schema?.options) {
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
    }

    return dataSchema;
  }
}

registerEditorPlugin(TextControlPlugin);

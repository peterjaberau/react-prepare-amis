import React from 'react';
import {Button} from '@/packages/amis-ui/src';
import omit from 'lodash/omit';
import uniq from 'lodash/uniq';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import {
  EditorManager,
  EditorNodeType,
  getSchemaTpl,
  RendererPluginAction,
  RendererPluginEvent
} from '@/packages/amis-editor-core/src';
import {registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {
  BaseEventContext,
  BasePlugin,
  BasicToolbarItem,
  ContextMenuEventContext,
  ContextMenuItem,
  defaultValue,
  tipedLabel
} from '@/packages/amis-editor-core/src';
import {diff} from '@/packages/amis-editor-core/src';
import {isPureVariable} from '@/packages/amis-core/src';
import type {Schema} from '@/packages/amis-ui/src';
import {getEventControlConfig} from '../../renderer/event-control/helper';
import {resolveOptionEventDataSchame, resolveOptionType} from '../../util';
import {ValidatorTag} from '../../validator';

export class PickerControlPlugin extends BasePlugin {
  static id = 'PickerControlPlugin';
  // Associated renderer name
  rendererName = 'picker';
  $schema = '/schemas/PickerControlSchema.json';

  // Component name
  name = 'List selection';
  isBaseComponent = true;
  icon = 'fa fa-window-restore';
  pluginIcon = 'picker-plugin';
  description =
    'Configure the available data sources through pickerSchema to select the required data, supporting multiple selections';
  searchKeywords = 'List Selector';
  docLink = '/amis/zh-CN/components/form/picker';
  tags = ['form item'];
  scaffold = {
    type: 'picker',
    label: 'List selection',
    name: 'picker',
    options: [
      {
        label: 'Option A',
        value: 'A'
      },

      {
        label: 'Option B',
        value: 'B'
      }
    ],
    overflowConfig: {
      maxTagCount: -1
    },
    modalClassName: 'app-popover :AMISCSSWrapper'
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
      description: 'Triggered when the selected state changes',
      dataSchema: (manager: EditorManager) => {
        const {value, selectedItems} = resolveOptionEventDataSchame(manager);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  value,
                  selectedItems
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'itemClick',
      eventLabel: 'Click option',
      description: 'Triggered when the option is clicked',
      dataSchema: (manager: EditorManager) => {
        const {itemSchema} = resolveOptionEventDataSchame(manager);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Data',
                properties: {
                  item: {
                    type: 'object',
                    title: 'The option clicked',
                    properties: itemSchema
                  }
                }
              }
            }
          }
        ];
      }
    }
  ];
  panelJustify = true;
  panelTitle = 'List Selection';
  panelBodyCreator = (context: BaseEventContext) => {
    const pickStyleStateFunc = (visibleOn: string, state: string) => {
      const cssToken =
        state === 'default'
          ? 'base'
          : `status-${state === 'focused' ? 'focus' : state}`;
      return [
        getSchemaTpl('theme:border', {
          name: `themeCss.pickControlClassName.border:${state}`,
          editorValueToken: `--Pick-${cssToken}`,
          visibleOn: visibleOn
        }),
        getSchemaTpl('theme:colorPicker', {
          label: 'background',
          labelMode: 'input',
          needGradient: true,
          needImage: true,
          name: `themeCss.pickControlClassName.background:${state}`,
          editorValueToken: `--Pick-${cssToken}-bgColor`,
          visibleOn: visibleOn
        })
      ];
    };
    const getOverflowTagPopoverTpl = (schema: any = {}) => {
      const {namePre, title, key} = schema;
      delete schema.namePre;
      return {
        type: 'container',
        body: [
          {
            type: 'switch',
            label: title,
            name: `${namePre}.${key}`,
            inputClassName: 'is-inline',
            onChange: (value: any, origin: any, item: any, form: any) => {
              const overflowConfig = cloneDeep(form.data.overflowConfig) || {};
              const displayPosition = overflowConfig.displayPosition || [];
              if (value) {
                overflowConfig.displayPosition = uniq([
                  ...displayPosition,
                  key
                ]);
              } else {
                overflowConfig.displayPosition = displayPosition.filter(
                  (_: string) => _ !== key
                );
                const configKey =
                  key === 'select'
                    ? 'overflowTagPopover'
                    : 'overflowTagPopoverInCRUD';
                delete overflowConfig[configKey];
              }
              form.setValues({
                overflowConfig
              });
            }
          },
          {
            name: namePre ? `${namePre}.trigger` : 'trigger',
            type: 'select',
            label: tipedLabel(
              'Trigger mode',
              'The default mode is "mouse hover"'
            ),
            multiple: true,
            value: ['hover'],
            pipeIn: (value: any) =>
              Array.isArray(value) ? value.join(',') : [],
            pipeOut: (value: any) =>
              value && value.length ? value.split(',') : undefined,
            options: [
              {
                label: 'Mouse hover',
                value: 'hover'
              },

              {
                label: 'click',
                value: 'click'
              }
            ],
            visibleOn: `${namePre}.${key}`
          },
          {
            type: 'button-group-select',
            name: namePre ? `${namePre}.placement` : 'placement',
            label: 'Prompt location',
            size: 'sm',
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
            ],
            pipeIn: defaultValue('top'),
            visibleOn: `${namePre}.${key}`
          },
          {
            type: 'switch',
            label: tipedLabel(
              'Show floating layer arrow',
              'After closing, the tip floating layer does not show the pointing arrow'
            ),
            name: namePre ? `${namePre}.showArrow` : 'showArrow',
            inputClassName: 'is-inline',
            visibleOn: `${namePre}.${key}`
          },
          {
            type: 'input-group',
            label: tipedLabel(
              'Floating layer offset',
              'Prompt the floating layer position relative to the "horizontal" and "vertical" offset'
            ),
            body: [
              {
                type: 'input-number',
                name: namePre ? `${namePre}.offset` : 'offset',
                prefix: 'X：',
                pipeIn: (value: any) =>
                  Array.isArray(value) ? value[0] || 0 : 0,
                pipeOut: (value: any, oldValue: any, data: any) => {
                  const offset =
                    get(data, namePre ? `${namePre}.offset` : 'offset') || [];
                  return [value, offset[1] || 0];
                }
              },
              {
                type: 'input-number',
                name: namePre ? `${namePre}.offset` : 'offset',
                prefix: 'Y：',
                pipeIn: (value: any) =>
                  Array.isArray(value) ? value[1] || 0 : 0,
                pipeOut: (value: any, oldValue: any, data: any) => {
                  const offset =
                    get(data, namePre ? `${namePre}.offset` : 'offset') || [];
                  return [offset[0] || 0, value];
                }
              }
            ],
            visibleOn: `${namePre}.${key}`
          }
        ],
        ...schema
      };
    };
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
              {
                type: 'select',
                label: tipedLabel(
                  'Selection type',
                  'Embedded: displayed in a tiled manner on the page, the other two are displayed in a pop-up box or drawer form'
                ),
                name: 'modalMode',
                options: [
                  {
                    label: 'embedded',
                    value: 'inner'
                  },
                  {
                    label: 'Ball box',
                    value: 'dialog'
                  },
                  {
                    label: 'Drawer',
                    value: 'drawer'
                  }
                ],
                pipeIn: defaultValue('dialog'),
                onChange: (value: any, origin: any, item: any, form: any) => {
                  form.setValues({
                    embed: value === 'inner'
                  });
                  if (value !== 'inner') {
                    form.setValues({
                      modalMode: value
                    });
                  } else {
                    const overflowConfig = cloneDeep(form.data.overflowConfig);
                    delete overflowConfig.overflowTagPopoverInCRUD;
                    overflowConfig.displayPosition = ['select'];
                    form.setValues({
                      overflowConfig
                    });
                  }
                }
              },
              {
                label: 'Bullet frame size',
                type: 'select',
                name: 'size',
                pipeIn: defaultValue(''),
                visibleOn: '${modalMode !== "inner"}',
                options: [
                  {
                    label: 'Default',
                    value: ''
                  },
                  {
                    label: 'small',
                    value: 'sm'
                  },
                  {
                    label: 'Medium',
                    value: 'md'
                  },
                  {
                    label: 'big',
                    value: 'lg'
                  },
                  {
                    label: 'Extra Large',
                    value: 'xl'
                  }
                ]
              },
              getSchemaTpl('multiple'),
              {
                type: 'ae-switch-more',
                mode: 'normal',
                formType: 'extend',
                name: 'overflowConfig',
                bulk: false,
                isChecked: (v: any) => !!v,
                label: tipedLabel(
                  'Label storage',
                  'When the number of values ​​exceeds a certain amount, it can be stored and displayed'
                ),
                extendData: ['embed'],
                form: {
                  body: [
                    {
                      type: 'input-number',
                      name: 'maxTagCount',
                      label: 'maximum number of labels',
                      defaultValue: -1
                    },
                    getOverflowTagPopoverTpl({
                      namePre: 'overflowTagPopover',
                      title: 'Selector Collection',
                      key: 'select',
                      className: 'm-b-sm'
                    }),
                    getOverflowTagPopoverTpl({
                      namePre: 'overflowTagPopoverInCRUD',
                      title: 'CRUD Collection',
                      key: 'crud',
                      className: 'm-b-sm',
                      hiddenOn: '!!embed'
                    })
                  ]
                },
                visibleOn: 'this.multiple'
              },
              {
                type: 'switch',
                name: 'itemClearable',
                label: 'Selected items can be deleted',
                pipeIn: defaultValue(true),
                inputClassName: 'is-inline '
              },
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('placeholder'),
              getSchemaTpl('description')
            ]
          },
          {
            title: 'Options',
            body: [
              getSchemaTpl('optionControlV2'),
              getSchemaTpl('valueFormula', {
                mode: 'vertical',
                rendererSchema: (schema: Schema) => schema,
                useSelectMode: true,
                label: tipedLabel(
                  'default value',
                  `When configuring multiple selection values ​​in fx, you need to adapt the value format, for example:
                  The option value is
                  <pre>${JSON.stringify(
                    [
                      {label: 'Option A', value: 'A'},
                      {label: 'Option B', value: 'B'}
                    ],
                    null,
                    2
                  )}
                  </pre>Select Option A and Option B:
                  <ul>
                    <li>Open the concatenation value and the concatenation character is ',': value example 'A,B'</li>
                    <li>Turn off concatenated values ​​and turn on extracting only values. Example value: ['A', 'B']</li>
                    <li>Turn off splicing values, turn off extracting only values, value example: [
                      {label: 'Option A', value: 'A'},
                      {label: 'Option B', value: 'B'}
                    ]</li>
                  </ul>`
                )
              }),
              getSchemaTpl('textareaFormulaControl', {
                label: tipedLabel(
                  'label template',
                  'label display content of selected data'
                ),
                name: 'labelTpl',
                mode: 'normal',
                visibleOn: '!this.embed'
              }),
              {
                type: 'button',
                label: 'Configure selection box details',
                block: true,
                level: 'primary',
                visibleOn: '!this.pickerSchema',
                onClick: this.editDetail.bind(this, context.id)
              },
              {
                type: 'button',
                label: 'Configured checkbox details',
                block: true,
                level: 'primary',
                visibleOn: 'this.pickerSchema',
                onClick: this.editDetail.bind(this, context.id)
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
          getSchemaTpl(
            'collapseGroup',
            [
              getSchemaTpl('style:formItem', {
                renderer: context.info.renderer,
                hiddenList: ['labelHide']
              }),
              {
                title: 'Basic',
                body: [
                  {
                    type: 'select',
                    name: '__editorState',
                    label: 'status',
                    selectFirst: true,
                    options: [
                      {
                        label: 'General',
                        value: 'default'
                      },
                      {
                        label: 'Suspension',
                        value: 'hover'
                      },
                      {
                        label: 'Focus',
                        value: 'focused'
                      },
                      {
                        label: 'disable',
                        value: 'disabled'
                      }
                    ]
                  },
                  ...pickStyleStateFunc(
                    "${__editorState == 'default' || !__editorState}",
                    'default'
                  ),
                  ...pickStyleStateFunc("${__editorState == 'hover'}", 'hover'),
                  ...pickStyleStateFunc(
                    "${__editorState == 'focused'}",
                    'focused'
                  ),
                  ...pickStyleStateFunc(
                    "${__editorState == 'disabled'}",
                    'disabled'
                  )
                ]
              },
              {
                title: 'Selected value',
                body: [
                  getSchemaTpl('theme:font', {
                    name: 'themeCss.pickFontClassName.font:default',
                    editorValueToken: '--Pick-base-value'
                  }),
                  getSchemaTpl('theme:colorPicker', {
                    label: 'background',
                    labelMode: 'input',
                    needGradient: true,
                    needImage: true,
                    name: 'themeCss.pickValueWrapClassName.background',
                    editorValueToken: '--Pick-base-value-bgColor'
                  }),
                  getSchemaTpl('theme:border', {
                    name: 'themeCss.pickValueWrapClassName.border:default',
                    editorValueToken: '--Pick-base-value'
                  }),
                  getSchemaTpl('theme:radius', {
                    name: 'themeCss.pickValueWrapClassName.radius',
                    editorValueToken: '--Pick-base'
                  }),
                  getSchemaTpl('theme:colorPicker', {
                    label: 'icon color',
                    labelMode: 'input',
                    needGradient: true,
                    needImage: true,
                    name: 'themeCss.pickValueIconClassName.color',
                    editorValueToken: '--Pick-base-value-icon-color'
                  }),
                  getSchemaTpl('theme:colorPicker', {
                    label: 'icon hover color',
                    labelMode: 'input',
                    needGradient: true,
                    needImage: true,
                    name: 'themeCss.pickValueIconClassName.color:hover',
                    editorValueToken: '--Pick-base-value-hover-icon-color'
                  })
                ]
              },
              {
                title: 'icon',
                body: [
                  {
                    name: 'themeCss.pickControlClassName.--Pick-base-icon',
                    label: 'Select icon',
                    type: 'icon-select',
                    returnSvg: true
                  },
                  // The new version size setting is incompatible, do not add it yet
                  // getSchemaTpl('theme:size', {
                  //   name: 'themeCss.pickControlClassName.--Pick-base-icon-size',
                  // label: 'icon size',
                  //   editorValueToken: `default.body.icon-size`
                  // }),
                  getSchemaTpl('theme:colorPicker', {
                    label: 'color',
                    labelMode: 'input',
                    needGradient: true,
                    needImage: true,
                    name: 'themeCss.pickIconClassName.color',
                    editorValueToken: '--Pick-base-icon-color'
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
                    label: 'List selection basic style',
                    selector: '.cxd-Picker'
                  },
                  {
                    label: 'input box style',
                    selector: '.cxd-Picker-input'
                  }
                ]
              })
            ],
            {...context?.schema, configTitle: 'style'}
          )
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

  buildEditorToolbar(
    {id, info}: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) {
    if (info.renderer.name === this.rendererName) {
      toolbars.push({
        icon: 'fa fa-expand',
        order: 100,
        tooltip: 'Configure selection box details',
        onClick: this.editDetail.bind(this, id)
      });
    }
  }

  buildEditorContextMenu(
    {id, schema, region, info}: ContextMenuEventContext,
    menus: Array<ContextMenuItem>
  ) {
    if (info.renderer.name === this.rendererName) {
      menus.push('|', {
        label: 'Configure selection box details',
        onSelect: this.editDetail.bind(this, id)
      });
    }
  }

  editDetail(id: string) {
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id)!;
    const value = store.getValueOf(id);

    if (!node || !value) {
      return;
    }

    const component = node.getComponent();

    const schema = {
      type: 'crud',
      mode: 'list',
      ...(value.pickerSchema || {
        listItem: {
          title: value.labelField ? '${' + value.labelField + '}' : '${label}'
        }
      }),
      pickerMode: true,
      multiple: value.multiple,
      labelField: value.labelField || 'label',
      valueField: value.valueField || 'value'
    };
    // Does not support context variables to build CRUD
    if (!isPureVariable(value.source)) {
      schema.api = value.source;
    }

    this.manager.openSubEditor({
      title: 'Configure selection box details',
      value: schema,
      data: {options: component.props.options},
      onChange: newValue => {
        newValue = {
          ...value,
          pickerSchema: {...newValue},
          source: newValue.api
        };

        delete newValue.pickerSchema.api;
        delete newValue.pickerSchema.type;
        delete newValue.pickerSchema.pickerMode;
        delete newValue.pickerSchema.multiple;

        manager.panelChangeValue(newValue, diff(value, newValue));
      }
    });
  }

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

registerEditorPlugin(PickerControlPlugin);

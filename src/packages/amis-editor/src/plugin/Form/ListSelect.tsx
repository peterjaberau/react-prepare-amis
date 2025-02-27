import {
  EditorNodeType,
  JSONPipeIn,
  JSONPipeOut,
  getSchemaTpl,
  registerEditorPlugin,
  BasePlugin,
  BaseEventContext,
  diff
} from '@/packages/amis-editor-core/src';
import type {
  EditorManager,
  RendererPluginAction,
  RendererPluginEvent
} from '@/packages/amis-editor-core/src';
import type {Schema} from '@/packages/src';
import {formItemControl} from '../../component/BaseControl';
import {
  resolveOptionEventDataSchame,
  resolveOptionType,
  schemaArrayFormat
} from '../../util';
import {getActionCommonProps} from '../../renderer/event-control/helper';

export class ListControlPlugin extends BasePlugin {
  static id = 'ListControlPlugin';
  // Associated renderer name
  rendererName = 'list-select';
  $schema = '/schemas/ListControlSchema.json';

  // Component name
  name = 'List selection';
  isBaseComponent = true;
  icon = 'fa fa-ellipsis-h';
  pluginIcon = 'list-select-plugin';
  description =
    'Single or multiple selection, support source pull options, options can be configured with pictures, and can also customize HTML configuration';
  docLink = '/amis/zh-CN/components/form/list-select';
  tags = ['form item'];
  scaffold = {
    type: 'list-select',
    label: 'list',
    name: 'list',
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

  panelTitle = 'List Selection';

  panelJustify = true;

  // Event definition
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: 'value change',
      description: 'Triggered when the selected value changes',
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

  getSubEditorVariable(schema: any): Array<{label: string; children: any}> {
    let labelField = schema?.labelField || 'label';
    let valueField = schema?.valueField || 'value';

    return [
      {
        label: 'Current option',
        children: [
          {
            label: 'option name',
            value: labelField
          },
          {
            label: 'option value',
            value: valueField
          }
        ]
      }
    ];
  }

  panelBodyCreator = (context: BaseEventContext) => {
    return formItemControl(
      {
        common: {
          replace: true,
          body: [
            getSchemaTpl('layout:originPosition', {value: 'left-top'}),
            getSchemaTpl('formItemName', {
              required: true
            }),
            getSchemaTpl('label'),
            getSchemaTpl('multiple'),
            getSchemaTpl('extractValue'),
            getSchemaTpl('valueFormula', {
              // Sidebar rendering does not render custom styles, which will interfere with CSS generation
              rendererSchema: (schema: Schema) => ({
                ...(schema || {}),
                itemSchema: null
              }),
              useSelectMode: true, // Use Select setting mode instead
              visibleOn: 'this.options && this.options.length > 0'
            })
          ]
        },
        option: {
          body: [
            getSchemaTpl('optionControlV2'),
            {
              type: 'ae-switch-more',
              mode: 'normal',
              label: 'Custom display template',
              formType: 'extend',
              form: {
                body: [
                  {
                    type: 'dropdown-button',
                    label: 'Configure display template',
                    level: 'enhance',
                    buttons: [
                      {
                        type: 'button',
                        block: true,
                        onClick: this.editDetail.bind(
                          this,
                          context.id,
                          'itemSchema'
                        ),
                        label: 'Configure default template'
                      },
                      {
                        type: 'button',
                        block: true,
                        onClick: this.editDetail.bind(
                          this,
                          context.id,
                          'activeItemSchema'
                        ),
                        label: 'Configure active template'
                      }
                    ]
                  }
                ]
              },
              pipeIn: (value: any) => {
                return value !== undefined;
              },
              pipeOut: (value: any, originValue: any, data: any) => {
                if (value === true) {
                  return {
                    type: 'container',
                    body: [
                      {
                        type: 'tpl',
                        tpl: `\${${this.getDisplayField(data)}}`,
                        wrapperComponent: '',
                        inline: true
                      }
                    ]
                  };
                }
                return value ? value : undefined;
              }
            }
          ]
        },
        status: {}
      },
      context
    );
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

  filterProps(props: any) {
    // Disable selection of child nodes
    return JSONPipeOut(props);
  }

  getDisplayField(data: any) {
    return data?.labelField ?? 'label';
  }

  editDetail(id: string, field: string) {
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id);
    const value = store.getValueOf(id);
    let defaultItemSchema = {
      type: 'container',
      body: [
        {
          type: 'tpl',
          tpl: `\${${this.getDisplayField(value)}}`,
          inline: true,
          wrapperComponent: ''
        }
      ]
    };

    // Automatically copy the default state when editing the active state style for the first time
    if (field !== 'itemSchema' && value?.itemSchema) {
      defaultItemSchema = JSONPipeIn(value.itemSchema, true);
    }

    node &&
      value &&
      this.manager.openSubEditor({
        title: 'Configure display template',
        value: value[field] ?? defaultItemSchema,
        slot: {
          type: 'container',
          body: '$$'
        },
        onChange: (newValue: any) => {
          newValue = {...value, [field]: schemaArrayFormat(newValue)};
          manager.panelChangeValue(newValue, diff(value, newValue));
        },
        data: {
          [value.labelField || 'label']: 'option name',
          [value.valueField || 'value']: 'option value',
          item: 'false data'
        }
      });
  }
}

registerEditorPlugin(ListControlPlugin);

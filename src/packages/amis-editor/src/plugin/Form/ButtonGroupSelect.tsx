import {
  EditorManager,
  EditorNodeType,
  registerEditorPlugin,
  BasePlugin,
  BaseEventContext,
  RendererPluginAction,
  RendererPluginEvent,
  tipedLabel,
  getSchemaTpl,
  defaultValue
} from '@/packages/amis-editor-core/src';
import type {Schema} from '@/packages/src';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';
import {ValidatorTag} from '../../validator';
import {resolveOptionEventDataSchame, resolveOptionType} from '../../util';

export class ButtonGroupControlPlugin extends BasePlugin {
  static id = 'ButtonGroupControlPlugin';
  // Associated renderer name
  rendererName = 'button-group-select';
  $schema = '/schemas/ButtonGroupControlSchema.json';

  // Component name
  name = 'Button click';
  isBaseComponent = true;
  icon = 'fa fa-object-group';
  pluginIcon = 'btn-select-plugin';
  description =
    'Used to display multiple buttons, which will be presented as a whole visually and can also be used as a form item option selector. ';
  docLink = '/friends/zh-CN/components/button-group';
  tags = ['form item'];
  scaffold = {
    type: 'button-group-select',
    name: 'buttonGroupSelect',
    label: 'Button click',
    inline: false,
    options: [
      {
        label: 'Option 1',
        value: 'a'
      },
      {
        label: 'Option 2',
        value: 'b'
      }
    ]
  };
  previewSchema: any = {
    type: 'form',
    wrapWithPanel: false,
    mode: 'horizontal',
    body: {
      ...this.scaffold,
      value: 'a',
      label: 'Button click',
      description: 'Button clicks can be used as options.'
    }
  };

  notRenderFormZone = true;

  panelTitle = 'Button Click';

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

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              title: 'Basic',
              body: [
                getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                getSchemaTpl('formItemName', {
                  required: true
                }),
                getSchemaTpl('label'),
                getSchemaTpl('multiple'),
                getSchemaTpl('valueFormula', {
                  rendererSchema: (schema: Schema) => schema,
                  useSelectMode: true
                }),
                getSchemaTpl('description')
              ]
            },
            {
              title: 'Button Management',
              body: [getSchemaTpl('nav-badge'), getSchemaTpl('optionControlV2')]
            },
            getSchemaTpl('status', {
              isFormItem: true
            }),
            getSchemaTpl('validation', {tag: ValidatorTag.MultiSelect})
          ])
        ]
      },
      {
        title: 'Appearance',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              title: 'Basic',
              body: [
                getSchemaTpl('formItemMode'),
                getSchemaTpl('horizontal', {
                  label: '',
                  visibleOn:
                    'this.mode == "horizontal" && this.label !== false && this.horizontal'
                }),
                getSchemaTpl('switch', {
                  name: 'tiled',
                  label: tipedLabel(
                    'Tile mode',
                    'Make the button width fill the parent container and the width of each button adaptive'
                  ),
                  pipeIn: defaultValue(false),
                  visibleOn: 'this.mode !== "inline"'
                }),
                getSchemaTpl('size'),
                getSchemaTpl('buttonLevel', {
                  label: 'Button style',
                  name: 'btnLevel'
                }),
                getSchemaTpl('buttonLevel', {
                  label: 'Button selection style',
                  name: 'btnActiveLevel',
                  pipeIn: defaultValue('primary')
                })
              ]
            },
            getSchemaTpl('style:classNames', {
              isFormItem: true,
              schema: [
                getSchemaTpl('className', {
                  label: 'button',
                  name: 'btnClassName'
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

registerEditorPlugin(ButtonGroupControlPlugin);

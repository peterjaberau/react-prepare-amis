import {
  EditorManager,
  EditorNodeType,
  getSchemaTpl,
  tipedLabel,
  BasePlugin,
  BaseEventContext,
  registerEditorPlugin,
  RendererPluginAction,
  RendererPluginEvent
} from 'amis-editor-core';
import {formItemControl} from '../../component/BaseControl';
import {resolveOptionEventDataSchame, resolveOptionType} from '../../util';
import type {Schema} from 'amis';
import {getActionCommonProps} from '../../renderer/event-control/helper';

export class TagControlPlugin extends BasePlugin {
  static id = 'TagControlPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'input-tag';
  $schema = '/schemas/TagControlSchema.json';

  // Component name
  name = 'Label selection';
  isBaseComponent = true;
  icon = 'fa fa-tag';
  pluginIcon = 'input-tag-plugin';
  description = 'Configuring options can achieve selection options';
  searchKeywords = 'Tag selector';
  docLink = '/amis/zh-CN/components/form/input-tag';
  tags = ['form item'];
  scaffold = {
    type: 'input-tag',
    label: 'label',
    name: 'tag',
    options: [
      {label: 'red', value: 'red'},
      {label: 'green', value: 'green'},
      {label: 'blue', value: 'blue'}
    ]
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: {
      ...this.scaffold,
      value: 'red'
    }
  };

  notRenderFormZone = true;

  panelTitle = 'Labels';
  panelJustify = true;

  // Event definition
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: 'value change',
      description: 'Selected value changes',
      dataSchema: (manager: EditorManager) => {
        const {value, selectedItems, items} = resolveOptionEventDataSchame(
          manager,
          true
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
    },
    {
      eventName: 'focus',
      eventLabel: 'Get focus',
      description: 'Get focus',
      dataSchema: (manager: EditorManager) => {
        const {value, selectedItems, items} = resolveOptionEventDataSchame(
          manager,
          true
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
    },
    {
      eventName: 'blur',
      eventLabel: 'Lost focus',
      description: 'Lost focus',
      dataSchema: (manager: EditorManager) => {
        const {value, selectedItems, items} = resolveOptionEventDataSchame(
          manager,
          true
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
            getSchemaTpl('clearable'),
            getSchemaTpl('optionsTip'),
            getSchemaTpl('valueFormula', {
              rendererSchema: (schema: Schema) => schema,
              mode: 'vertical' // Change to up and down display mode
            }),
            getSchemaTpl('joinValues'),
            getSchemaTpl('delimiter'),
            getSchemaTpl('extractValue'),
            {
              type: 'input-number',
              name: 'max',
              label: tipedLabel(
                'Maximum number of labels',
                'Maximum number of selected labels'
              ),
              min: 1
            },
            getSchemaTpl('autoFillApi', {
              visibleOn:
                '!this.autoFill || this.autoFill.scene && this.autoFill.action'
            }),
            getSchemaTpl('autoFill', {
              visibleOn:
                '!this.autoFill || !this.autoFill.scene && !this.autoFill.action'
            })
          ]
        },
        option: {
          body: [
            getSchemaTpl('optionControlV2', {
              description:
                'After setting the options, these options will be dropped down for user reference when entering.'
            })
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
        },
        originalValue: dataSchema.originalValue
      };
    }

    return dataSchema;
  }
}

registerEditorPlugin(TagControlPlugin);

import {
  registerEditorPlugin,
  BasePlugin,
  BaseEventContext,
  RendererPluginAction,
  RendererPluginEvent,
  tipedLabel,
  defaultValue,
  getSchemaTpl,
  EditorNodeType
} from 'amis-editor-core';
import {ValidatorTag} from '../../validator';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';

export class MatrixControlPlugin extends BasePlugin {
  static id = 'MatrixControlPlugin';
  // Associated renderer name
  rendererName = 'matrix-checkboxes';
  $schema = '/schemas/MatrixControlSchema.json';

  // Component name
  name = 'Matrix switch';
  isBaseComponent = true;
  icon = 'fa fa-th-large';
  pluginIcon = 'matrix-checkboxes-plugin';
  description =
    'You can configure single selection for rows, single selection for columns, single selection for all options, or multiple selection for all options';
  docLink = '/amis/zh-CN/components/form/matrix-checkboxes';
  tags = ['form item'];
  scaffold = {
    type: 'matrix-checkboxes',
    name: 'matrix',
    label: 'Matrix switch',
    rowLabel: 'row title description',
    columns: [
      {
        label: 'Column 1'
      },
      {
        label: 'Column 2'
      }
    ],
    rows: [
      {
        label: 'Line 1'
      },
      {
        label: 'Line 2'
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
        ...this.scaffold
      }
    ]
  };

  notRenderFormZone = true;

  panelTitle = 'Matrix Switch';
  panelJustify = true;
  // Event definition
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: 'value change',
      description: 'Selected value changes',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                value: {
                  type: 'array',
                  title: 'Selected value'
                }
              }
            }
          }
        }
      ]
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
                name: 'multiple',
                label: 'Multiple selections possible',
                pipeIn: defaultValue(true)
              }),
              {
                label: tipedLabel(
                  'Mode',
                  'Row level, column level or single cell selection'
                ),
                name: 'singleSelectMode',
                type: 'button-group-select',
                size: 'sm',
                option: 'column level',
                horizontal: {
                  left: 2,
                  justify: true
                },
                visibleOn: '!data.multiple',
                options: [
                  {
                    label: 'row level',
                    value: 'row'
                  },
                  {
                    label: 'column level',
                    value: 'column'
                  },
                  {
                    label: 'Single unit',
                    value: 'cell'
                  }
                ],
                pipeIn: defaultValue('column')
              },
              getSchemaTpl('switch', {
                name: 'yCheckAll',
                label: tipedLabel('Select all columns', 'Select all columns')
              }),
              getSchemaTpl('switch', {
                name: 'xCheckAll',
                label: tipedLabel(
                  'Select all rows',
                  'Select all rows at the row level'
                )
              }),
              getSchemaTpl('autoFillApi')
            ]
          },
          {
            title: 'Options',
            body: [
              [
                getSchemaTpl('combo-container', {
                  label: 'column configuration',
                  mode: 'normal',
                  name: 'columns',
                  type: 'combo',
                  multiple: true,
                  addButtonText: 'Add a column',
                  scaffold: {
                    label: 'Column description'
                  },
                  items: [getSchemaTpl('matrixColumnLabel')]
                }),
                getSchemaTpl('matrixRowTitle'),
                getSchemaTpl('combo-container', {
                  label: 'row configuration',
                  name: 'rows',
                  type: 'combo',
                  mode: 'normal',
                  multiple: true,
                  scaffold: {
                    label: 'Line description'
                  },
                  addButtonText: 'Add a row',
                  items: [getSchemaTpl('matrixRowLabel')]
                })
              ],
              getSchemaTpl('apiControl', {
                label: tipedLabel('Interface', 'Get matrix data interface'),
                name: 'source',
                mode: 'normal'
              }),
              getSchemaTpl('loadingConfig', {}, {context})
              // getSchemaTpl('value')
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
            getSchemaTpl('style:classNames'),
            {
              label: tipedLabel(
                'Alignment',
                'Default is left-aligned when all selection is turned on'
              ),
              name: 'textAlign',
              type: 'select',
              options: [
                {
                  label: 'Center',
                  value: 'center'
                },
                {
                  label: 'left',
                  value: 'left'
                },
                {
                  label: 'right',
                  value: 'right'
                },
                {
                  label: 'Justify both ends',
                  value: 'justify'
                }
              ]
            }
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
    // Let’s do a simple processing first
    return {
      type: 'array',
      title: node.schema?.label || node.schema?.name,
      riginalValue: node.schema?.value // Record the original value, required for circular reference detection
    };
  }
}

registerEditorPlugin(MatrixControlPlugin);

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
} from 'amis-editor-core';
import type {Schema} from 'amis';
import {ValidatorTag} from '../../validator';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';
import {resolveOptionEventDataSchame} from '../../util';
import {inputStateTpl} from '../../renderer/style-control/helper';

export class ChainedSelectControlPlugin extends BasePlugin {
  static id = 'ChainedSelectControlPlugin';
  // Associated renderer name
  rendererName = 'chained-select';
  $schema = '/schemas/ChainedSelectControlSchema.json';

  // Component name
  name = 'Chain drop-down box';
  isBaseComponent = true;
  icon = 'fa fa-th-list';
  pluginIcon = 'chained-select-plugin';
  description =
    'With the <code>source</code> pull option, you can increase the level infinitely as long as there are results returned';
  docLink = '/amis/zh-CN/components/form/chain-select';
  tags = ['form item'];
  scaffold = {
    type: 'chained-select',
    label: 'Chain drop-down',
    name: 'chainedSelect',
    joinValues: true
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    wrapWithPanel: false,
    mode: 'horizontal',
    body: {
      ...this.scaffold
    }
  };

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

  panelTitle = 'Chain Drop-Down';

  notRenderFormZone = true;
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
                mode: 'vertical', // Change to up and down display mode
                rendererWrapper: true,
                label: tipedLabel(
                  'Default value',
                  'Please fill in the value in Options'
                )
              }),

              getSchemaTpl('switch', {
                label: tipedLabel(
                  'Splice value',
                  'After turning it on, the values ​​of the selected options will be concatenated with a connector as the value of the current form item'
                ),
                name: 'joinValues',
                pipeIn: defaultValue(true)
              }),

              getSchemaTpl('delimiter', {
                visibleOn: 'this.joinValues !== false',
                clearValueOnHidden: true
              }),

              getSchemaTpl('extractValue', {
                visibleOn: 'this.joinValues === false',
                clearValueOnHidden: true
              }),

              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('placeholder'),
              getSchemaTpl('description'),
              getSchemaTpl('autoFillApi')
            ]
          },
          {
            title: 'Options',
            body: [
              getSchemaTpl('apiControl', {
                name: 'source',
                mode: 'normal',
                label: tipedLabel(
                  'Get options interface',
                  `<div> Available variable description</div><ul>
                      <li><code>value</code>Current value</li>
                      <li><code>level</code> pulls the level, starting from <code>1</code>. </li>
                      <li><code>parentId</code>The value of the selected <code>value</code> in the previous layer</li>
                      <li><code>parent</code> is the selected option of the previous level, including the value of <code>label</code> and <code>value</code>. </li>
                  </ul>`,
                  {
                    maxWidth: 'unset'
                  }
                )
              }),

              getSchemaTpl(
                'loadingConfig',
                {
                  visibleOn: 'this.source || !this.options'
                },
                {context}
              ),

              {
                type: 'input-text',
                name: 'labelField',
                label: tipedLabel(
                  'Option Label Field',
                  'The default rendering option group will get the label variable in each item as the display text'
                ),
                pipeIn: defaultValue('label')
              },

              {
                type: 'input-text',
                name: 'valueField',
                label: tipedLabel(
                  'Option value field',
                  'The default rendering option group will get the value variable in each item as the form item value'
                ),
                pipeIn: defaultValue('value')
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
          getSchemaTpl('collapseGroup', [
            getSchemaTpl('theme:formItem'),
            getSchemaTpl('theme:form-label'),
            getSchemaTpl('theme:form-description'),
            {
              title: 'Selection box style',
              body: [
                ...inputStateTpl(
                  'themeCss.chainedSelectControlClassName',
                  '--select-base'
                )
              ]
            },
            {
              title: 'Drop-down box style',
              body: [
                ...inputStateTpl(
                  'themeCss.chainedSelectPopoverClassName',
                  '--select-base-${state}-option',
                  {
                    state: [
                      {label: 'Normal', value: 'default'},
                      {label: 'Hover', value: 'hover'},
                      {label: 'selected', value: 'focused'}
                    ]
                  }
                )
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
    //Default text, todo: asynchronous data case
    const type = 'string';
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

registerEditorPlugin(ChainedSelectControlPlugin);

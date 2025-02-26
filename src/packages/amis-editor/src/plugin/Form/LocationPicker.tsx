import {
  EditorNodeType,
  getSchemaTpl,
  tipedLabel,
  registerEditorPlugin,
  BasePlugin,
  BaseEventContext,
  RendererPluginAction,
  RendererPluginEvent
} from 'amis-editor-core';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';
import {inputStateTpl} from '../../renderer/style-control/helper';
import {ValidatorTag} from '../../validator';

export class LocationControlPlugin extends BasePlugin {
  static id = 'LocationControlPlugin';
  // Associated renderer name
  rendererName = 'location-picker';
  $schema = '/schemas/LocationControlSchema.json';

  // Component name
  name = 'Geographic location selection';
  isBaseComponent = true;
  notRenderFormZone = true;
  icon = 'fa fa-location-arrow';
  pluginIcon = 'location-picker-plugin';
  description = 'Geographic location selection';
  docLink = '/amis/zh-CN/components/form/location-picker';
  tags = ['form item'];
  scaffold = {
    type: 'location-picker',
    name: 'location',
    label: 'Location selection'
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

  panelTitle = 'Geographic location selection';

  // Event definition
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: 'value change',
      description: 'Triggered when the selected value changes',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                value: {
                  type: 'object',
                  title: 'Selected value',
                  properties: {
                    address: {
                      type: 'string',
                      title: 'Address'
                    },
                    lng: {
                      type: 'number',
                      title: 'Longitude'
                    },
                    years: {
                      type: 'number',
                      title: 'Latitude'
                    },
                    vendor: {
                      type: 'string',
                      title: 'Manufacturer'
                    }
                  }
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

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    const renderer: any = context.info.renderer;
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
                /* Note: Temporarily closed
                getSchemaTpl('valueFormula', {
                  rendererSchema: context?.schema,
                }),
                */
                getSchemaTpl('formulaControl', {
                  name: 'ak',
                  label: 'AK on Baidu Maps',
                  required: true,
                  validationErrors: {
                    isRequired:
                      'AK cannot be empty, please visit http://lbsyun.baidu.com/ to obtain the key (AK)'
                  },
                  description:
                    'Please obtain it from <a href="http://lbsyun.baidu.com/" target="_blank" class="text-sm">Baidu Map Open Platform</a>'
                }),
                {
                  type: 'select',
                  name: 'coordinatesType',
                  label: 'Coordinate format',
                  value: 'bd09',
                  options: [
                    {label: 'Baidu coordinates', value: 'bd09'},
                    {
                      label:
                        'National Bureau of Surveying and Mapping Coordinates',
                      value: 'gcj02'
                    }
                  ]
                },
                getSchemaTpl('formulaControl', {
                  name: 'value',
                  label: tipedLabel(
                    'default value',
                    `The incoming parameter format should meet the following requirements:<br/>
                    <pre>${JSON.stringify(
                      {
                        address: 'string',
                        lat: 'number',
                        lng: 'number',
                        vendor: 'baidu|gaode'
                      },
                      null,
                      2
                    )}</pre>`
                  ),
                  size: 'lg',
                  mode: 'horizontal',
                  // required: true, // Default value is not recommended
                  placeholder: 'Please enter the variable value'
                }),
                getSchemaTpl('switch', {
                  name: 'autoSelectCurrentLoc',
                  label: tipedLabel(
                    'Auto Select',
                    "After turning it on, the user's current location will be automatically selected"
                  )
                }),
                getSchemaTpl('switch', {
                  name: 'onlySelectCurrentLoc',
                  label: tipedLabel(
                    'Restricted Mode',
                    'After turning it on, only the current location can be used, and other locations cannot be selected'
                  )
                }),
                getSchemaTpl('clearable'),
                getSchemaTpl('labelRemark'),
                getSchemaTpl('remark'),
                getSchemaTpl('placeholder', {
                  visibleOn: '!onlySelectCurrentLoc'
                }),
                getSchemaTpl('placeholder', {
                  name: 'getLocationPlaceholder',
                  visibleOn: 'onlySelectCurrentLoc'
                }),
                getSchemaTpl('description')
              ]
            },
            getSchemaTpl('status', {
              isFormItem: true,
              readonly: false
            }),
            getSchemaTpl('validation', {tag: ValidatorTag.File})
          ])
        ]
      },
      {
        title: 'Appearance',
        body: [
          getSchemaTpl('collapseGroup', [
            getSchemaTpl('style:formItem', {renderer}),
            getSchemaTpl('theme:form-label'),
            getSchemaTpl('theme:classNames', {
              schema: [
                {
                  type: 'theme-classname',
                  label: 'Controls',
                  name: 'inputClassName'
                },
                {
                  type: 'theme-classname',
                  label: 'Form item',
                  name: 'className'
                },
                {
                  type: 'theme-classname',
                  label: 'Static form item',
                  name: 'staticClassName'
                }
              ]
            }),
            getSchemaTpl('theme:cssCode', {
              themeClass: [
                {
                  name: 'input box',
                  value: '',
                  className: 'inputControlClassName',
                  state: ['default', 'hover', 'active']
                },
                {
                  name: 'addOn',
                  value: 'addOn',
                  className: 'addOnClassName'
                }
              ],
              isFormItem: true
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
    return {
      type: 'object',
      title: node.schema?.label || node.schema?.name,
      properties: {
        address: {
          type: 'string',
          title: 'Address'
        },
        lng: {
          type: 'number',
          title: 'Longitude'
        },
        years: {
          type: 'number',
          title: 'Latitude'
        },
        vendor: {
          type: 'string',
          title: 'Map Manufacturer'
        }
      },
      originalValue: node.schema?.value // Record the original value, required for circular reference detection
    };
  }
}

registerEditorPlugin(LocationControlPlugin);

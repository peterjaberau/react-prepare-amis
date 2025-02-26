import {
  BasePlugin,
  BaseEventContext,
  RendererPluginAction,
  RendererPluginEvent,
  registerEditorPlugin,
  EditorManager,
  EditorNodeType,
  defaultValue,
  getSchemaTpl
} from 'amis-editor-core';
import cloneDeep from 'lodash/cloneDeep';
import type {Schema} from 'amis';
import {ValidatorTag} from '../../validator';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';

export class CityControlPlugin extends BasePlugin {
  static id = 'CityControlPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'input-city';
  $schema = '/schemas/CityControlSchema.json';

  // Component name
  name = 'City Selection';
  isBaseComponent = true;
  icon = 'fa fa-building-o';
  pluginIcon = 'input-city-plugin';
  description = 'You can configure whether to select region or city';
  searchKeywords = 'City Selector';
  docLink = '/amis/zh-CN/components/form/input-city';
  tags = ['form item'];
  scaffold = {
    type: 'input-city',
    label: 'City selection',
    name: 'city',
    allowCity: true,
    allowDistrict: true,
    extractValue: true
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

  panelTitle = 'City Selection';

  // Event definition
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: 'value change',
      description: 'Selected value changes',
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
                    title: 'Current city'
                  }
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
                rendererWrapper: true,
                mode: 'vertical' // Change to up and down display mode
              }),
              {
                name: 'extractValue',
                label: 'value format',
                type: 'button-group-select',
                size: 'sm',
                options: [
                  {label: 'Administrative code', value: true},
                  {label: 'Object structure', value: false}
                ]
              },

              getSchemaTpl('switch', {
                name: 'allowCity',
                label: 'Optional city',
                pipeIn: defaultValue(true),
                onChange: (
                  value: string,
                  oldValue: string,
                  item: any,
                  form: any
                ) => {
                  if (!value) {
                    const schema = cloneDeep(form.data);
                    form.setValueByName('allowDistrict', undefined);
                    form.setValueByName('value', schema.extractValue ? '' : {});
                  }
                }
              }),

              getSchemaTpl('switch', {
                name: 'allowDistrict',
                label: 'Optional area',
                visibleOn: 'this.allowCity',
                pipeIn: defaultValue(true),
                onChange: (
                  value: string,
                  oldValue: string,
                  item: any,
                  form: any
                ) => {
                  if (!value) {
                    const schema = cloneDeep(form.data);
                    form.setValueByName('value', schema.extractValue ? '' : {});
                  }
                }
              }),

              getSchemaTpl('switch', {
                name: 'searchable',
                label: 'Searchable',
                pipeIn: defaultValue(false)
              }),

              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('description')
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
    let dataSchema: any = {
      type: 'string',
      title: node.schema?.label || node.schema?.name,
      originalValue: node.schema?.value // Record the original value, required for circular reference detection
    };

    if (node.schema?.extractValue === false) {
      dataSchema = {
        ...dataSchema,
        type: 'object',
        title: node.schema?.label || node.schema?.name,
        properties: {
          code: {
            type: 'number',
            title: 'Encoding'
          },
          provinceCode: {
            type: 'number',
            title: 'Province code'
          },
          province: {
            type: 'string',
            title: 'Province'
          },
          cityCode: {
            type: 'number',
            title: 'City Code'
          },
          city: {
            type: 'string',
            title: 'City'
          },
          districtCode: {
            type: 'number',
            title: 'Region Code'
          },
          district: {
            type: 'string',
            title: 'Region'
          },
          street: {
            type: 'string',
            title: 'Street'
          }
        }
      };
    }

    return dataSchema;
  }
}

registerEditorPlugin(CityControlPlugin);

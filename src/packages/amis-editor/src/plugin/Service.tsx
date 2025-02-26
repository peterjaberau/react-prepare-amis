import React from 'react';
import DeepDiff from 'deep-diff';
import pick from 'lodash/pick';
import {render as amisRender} from 'amis';
import flattenDeep from 'lodash/flattenDeep';
import {
  EditorNodeType,
  JSONPipeOut,
  jsonToJsonSchema,
  registerEditorPlugin,
  BaseEventContext,
  BasePlugin,
  RegionConfig,
  getSchemaTpl,
  tipedLabel
} from '@/packages/amis-editor-core/src';
import {DSBuilderManager} from '../builder/DSBuilderManager';
import {DSFeatureEnum, ModelDSBuilderKey, ApiDSBuilderKey} from '../builder';
import {
  getEventControlConfig,
  getActionCommonProps,
  buildLinkActionDesc
} from '../renderer/event-control/helper';

import type {Schema} from 'amis-core';
import type {
  EditorManager,
  RendererPluginAction,
  RendererPluginEvent
} from '@/packages/amis-editor-core/src';

export class ServicePlugin extends BasePlugin {
  static id = 'ServicePlugin';
  // Associated renderer name
  rendererName = 'service';

  name = 'Service';

  panelTitle = 'Service';

  icon = 'fa fa-server';

  pluginIcon = 'service-plugin';

  panelIcon = 'service-plugin';

  $schema = '/schemas/ServiceSchema.json';

  isBaseComponent = true;

  order = -850;

  description =
    'Functional container that can be used to load data or load renderer configuration. The loaded data can be used in the container. ';

  searchKeywords = 'Functional container';

  docLink = '/amis/zh-CN/components/service';

  tags = ['data container'];

  scaffold = {
    type: 'service',
    /** The placeholder in the region will expand the content area*/
    body: []
  };
  previewSchema = {
    type: 'service',
    body: [
      {
        type: 'tpl',
        tpl: 'Content area',
        inline: false,
        className: 'bg-light wrapper'
      }
    ]
  };

  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: 'Content area',
      placeholder: amisRender({
        type: 'wrapper',
        size: 'lg',
        body: {type: 'tpl', tpl: 'Content area'}
      })
    }
  ];

  events: RendererPluginEvent[] = [
    {
      eventName: 'init',
      eventLabel: 'Initialization',
      description:
        'Triggered when a component instance is created and inserted into the DOM',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              description:
                'The current data domain, you can read the corresponding value through the field name'
            }
          }
        }
      ]
    },
    {
      eventName: 'fetchInited',
      eventLabel: 'Initialization data interface request completed',
      description:
        'Triggered when the remote initialization data interface request is completed',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                responseData: {
                  type: 'object',
                  title: 'Response data'
                },
                responseStatus: {
                  type: 'number',
                  title: 'Response status (0 means success)'
                },
                responseMsg: {
                  type: 'string',
                  title: 'Response message'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'fetchSchemaInited',
      eventLabel: 'Initialization Schema interface request completed',
      description:
        'Triggered when the remote initialization Schema interface request is completed',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                responseData: {
                  type: 'object',
                  title: 'Response data'
                },
                responseStatus: {
                  type: 'number',
                  title: 'Response status (0 means success)'
                },
                responseMsg: {
                  type: 'string',
                  title: 'Response message'
                }
              }
            }
          }
        }
      ]
    }
  ];

  actions: RendererPluginAction[] = [
    {
      actionType: 'reload',
      actionLabel: 'Reload',
      description: 'Trigger component data refresh and re-rendering',
      ...getActionCommonProps('reload')
    },
    {
      actionType: 'rebuild',
      actionLabel: 'Rebuild',
      description: 'Trigger schemaApi refresh and rebuild Schema',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            Reconstruction
            {buildLinkActionDesc(props.manager, info)}
            Schema
          </div>
        );
      }
    },
    {
      actionType: 'setValue',
      actionLabel: 'Variable assignment',
      description: 'Update data domain data',
      ...getActionCommonProps('setValue')
    }
  ];

  dsManager: DSBuilderManager;

  constructor(manager: EditorManager) {
    super(manager);
    this.dsManager = new DSBuilderManager(manager);
  }

  panelBodyCreator = (context: BaseEventContext) => {
    const dsManager = this.dsManager;
    /** Data source control */
    const generateDSControls = () => {
      const dsTypeSelector = dsManager.getDSSelectorSchema(
        {
          type: 'select',
          mode: 'horizontal',
          horizontal: {
            justify: true,
            left: 'col-sm-4'
          },
          onChange: (value: any, oldValue: any, model: any, form: any) => {
            if (value !== oldValue) {
              const data = form.data;
              Object.keys(data).forEach(key => {
                if (
                  key?.toLowerCase()?.endsWith('fields') ||
                  key?.toLowerCase().endsWith('api')
                ) {
                  form.deleteValueByName(key);
                }
              });
              form.deleteValueByName('__fields');
              form.deleteValueByName('__relations');
              form.setValueByName('api', undefined);
            }
            return value;
          }
        },
        {schema: context?.schema, sourceKey: 'api'}
      );
      /**Default data source type*/
      const defaultDsType = dsTypeSelector.value;
      const dsSettings = dsManager.buildCollectionFromBuilders(
        (builder, builderKey) => {
          return {
            type: 'container',
            visibleOn: `data.dsType == null ? '${builderKey}' === '${
              defaultDsType || ApiDSBuilderKey
            }' : data.dsType === '${builderKey}'`,
            body: flattenDeep([
              builder.makeSourceSettingForm({
                feat: 'View',
                renderer: 'service',
                inScaffold: false,
                sourceSettings: {
                  name: 'api',
                  label: 'Interface configuration',
                  mode: 'horizontal',
                  ...(builderKey === 'api' || builderKey === 'apicenter'
                    ? {
                        horizontalConfig: {
                          labelAlign: 'left',
                          horizontal: {
                            justify: true,
                            left: 4
                          }
                        }
                      }
                    : {}),
                  useFieldManager: builderKey === ModelDSBuilderKey
                }
              })
            ])
          };
        }
      );

      return [dsTypeSelector, ...dsSettings];
    };

    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        className: 'p-none',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              title: 'Basic',
              body: [
                getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                ...generateDSControls()
              ]
            },
            {
              title: 'Advanced',
              body: [
                getSchemaTpl('combo-container', {
                  type: 'input-kv',
                  mode: 'normal',
                  name: 'data',
                  label: 'Initialize static data'
                }),
                getSchemaTpl('apiControl', {
                  name: 'schemaApi',
                  label: tipedLabel(
                    'Schema data source',
                    'After configuring schemaApi, you can dynamically render page content'
                  )
                }),
                getSchemaTpl('initFetch', {
                  name: 'initFetchSchema',
                  label: 'Whether Schema is initially loaded',
                  visibleOn:
                    'typeof this.schemaApi === "string" ? this.schemaApi : this.schemaApi && this.schemaApi.url'
                }),
                {
                  name: 'ws',
                  type: 'input-text',
                  label: tipedLabel(
                    'WebSocket interface',
                    'Service supports obtaining data through WebSocket (ws), which is used to obtain real-time updated data.'
                  )
                },
                {
                  type: 'js-editor',
                  allowFullscreen: true,
                  name: 'dataProvider',
                  label: tipedLabel(
                    'Custom function to obtain data',
                    'For complex data acquisition situations, you can use external functions to obtain data'
                  ),
                  placeholder:
                    '/**\n * @param data context data\n * @param setData function to update data\n * @param env environment variable\n */\ninterface DataProvider {\n (data: any, setData: (data: any) => void, env: any): void;\n}\n'
                }
              ]
            },
            {
              title: 'Status',
              body: [getSchemaTpl('visible'), getSchemaTpl('hidden')]
            }
          ])
        ]
      },
      {
        title: 'Appearance',
        body: [getSchemaTpl('className')]
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

  panelFormPipeOut = async (schema: any, oldSchema: any) => {
    const entity = schema?.api?.entity;

    if (!entity || schema?.dsType !== ModelDSBuilderKey) {
      return schema;
    }

    const builder = this.dsManager.getBuilderBySchema(schema);
    const observedFields = ['api'];
    const diff = DeepDiff.diff(
      pick(oldSchema, observedFields),
      pick(schema, observedFields)
    );

    if (!diff) {
      return schema;
    }

    try {
      const updatedSchema = await builder.buildApiSchema({
        schema,
        renderer: 'service',
        sourceKey: 'api',
        apiSettings: {
          diffConfig: {
            enable: true,
            schemaDiff: diff
          }
        }
      });
      return updatedSchema;
    } catch (e) {
      console.error(e);
    }

    return schema;
  };

  patchSchema(schema: Schema) {
    return schema.hasOwnProperty('dsType') &&
      schema.dsType != null &&
      typeof schema.dsType === 'string'
      ? schema
      : {...schema, dsType: ApiDSBuilderKey};
  }

  async buildDataSchemas(
    node: EditorNodeType,
    region?: EditorNodeType,
    trigger?: EditorNodeType
  ) {
    let jsonschema: any = {
      ...jsonToJsonSchema(JSONPipeOut(node.schema.data ?? {}))
    };
    const pool = node.children.concat();

    while (pool.length) {
      const current = pool.shift() as EditorNodeType;
      const schema = current.schema;

      if (current.rendererConfig?.isFormItem && schema?.name) {
        const tmpSchema = await current.info.plugin.buildDataSchemas?.(
          current,
          undefined,
          trigger,
          node
        );
        jsonschema.properties[schema.name] = {
          ...tmpSchema,
          ...(tmpSchema?.$id ? {} : {$id: `${current.id}-${current.type}`})
        };
      } else if (!current.rendererConfig?.storeType) {
        pool.push(...current.children);
      }
    }

    return jsonschema;
  }

  rendererBeforeDispatchEvent(node: EditorNodeType, e: any, data: any) {
    if (e === 'fetchInited') {
      const scope = this.manager.dataSchema.getScope(`${node.id}-${node.type}`);
      const jsonschema: any = {
        $id: 'serviceFetchInitedData',
        ...jsonToJsonSchema(data.responseData)
      };

      scope?.removeSchema(jsonschema.$id);
      scope?.addSchema(jsonschema);
    }
  }

  async getAvailableContextFields(
    scopeNode: EditorNodeType,
    node: EditorNodeType,
    region?: EditorNodeType
  ) {
    const builder = this.dsManager.getBuilderBySchema(scopeNode.schema);

    if (builder && scopeNode.schema.api) {
      return builder.getAvailableContextFields(
        {
          schema: scopeNode.schema,
          sourceKey: 'api',
          feat: DSFeatureEnum.List
        },
        node
      );
    }
  }
}

registerEditorPlugin(ServicePlugin);

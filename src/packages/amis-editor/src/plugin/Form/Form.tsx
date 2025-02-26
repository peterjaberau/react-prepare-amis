import React from 'react';
import cx from 'classnames';
import DeepDiff from 'deep-diff';
import flatten from 'lodash/flatten';
import cloneDeep from 'lodash/cloneDeep';
import pick from 'lodash/pick';
import {isObject, getRendererByName, setVariable} from 'amis-core';
import {
  BasePlugin,
  tipedLabel,
  ChangeEventContext,
  BaseEventContext,
  PluginEvent,
  EditorManager,
  defaultValue,
  getSchemaTpl,
  jsonToJsonSchema,
  RendererPluginAction,
  RendererPluginEvent,
  EditorNodeType,
  ScaffoldForm,
  RegionConfig,
  registerEditorPlugin,
  JSONPipeOut
} from 'amis-editor-core';
import type {FormSchema} from 'amis';
import type {
  IFormStore,
  IFormItemStore,
  Schema,
  RendererConfig
} from 'amis-core';
import {
  DSFeatureType,
  DSBuilderManager,
  DSFeatureEnum,
  ModelDSBuilderKey,
  ApiDSBuilderKey
} from '../../builder';
import {FormOperatorMap} from '../../builder/constants';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';
import {FieldSetting} from '../../renderer/FieldSetting';
import {_isModelComp, generateId} from '../../util';
import {InlineEditableElement} from 'amis-editor-core';

import type {FormScaffoldConfig} from '../../builder';

export type FormPluginFeat = Extract<
  DSFeatureType,
  'Insert' | 'Edit' | 'BulkEdit' | 'View'
>;

export interface ExtendFormSchema extends FormSchema {
  feat?: FormPluginFeat;
  dsType?: string;
}

/** Dynamically registered controls */
export type FormDynamicControls = Partial<
  Record<string, (context: BaseEventContext) => any>
>;

export class FormPlugin extends BasePlugin {
  static id = 'FormPlugin';

  name = 'Form';

  panelTitle = 'Form';
  // Associated renderer name
  rendererName = 'form';

  isBaseComponent = true;

  description =
    'It can be used to create, edit or display data. The configuration initialization interface can load data from the remote end, and the configuration submission interface can send data to the remote end. In addition, data can also be submitted to other components and communicate with other components. ';

  docLink = '/amis/zh-CN/components/form/index';

  $schema = '/schemas/FormSchema.json';

  tags = ['data container'];

  order = -900;

  icon = 'fa fa-list-alt';

  pluginIcon = 'form-plugin';

  panelIcon = 'form-plugin';

  panelJustify = true;

  scaffold = {
    type: 'form',
    title: 'Form',
    body: [
      {
        label: 'text box',
        type: 'input-text',
        id: generateId(),
        name: 'text'
      }
    ]
  };

  previewSchema = {
    type: 'form',
    panelClassName: 'Panel--default text-left m-b-none',
    mode: 'horizontal',
    body: [
      {
        label: 'text',
        name: 'a',
        type: 'input-text'
      }
    ]
  };

  //Container configuration
  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: 'Form collection',
      matchRegion: (elem: JSX.Element) => !!elem?.props.noValidate,
      renderMethod: 'renderBody',
      preferTag: 'Form item',
      dndMode: (schema: any) => {
        if (schema.mode === 'flex') {
          return 'flex';
        }
        return 'default';
      }
    },

    {
      label: 'Operation area',
      key: 'actions',
      preferTag: 'button'
    }
  ];

  // Define elements that can be edited inline
  inlineEditableElements: Array<InlineEditableElement> = [
    {
      match: ':scope.cxd-Panel .cxd-Panel-title',
      key: 'title'
    }
  ];

  // Event definition
  events: RendererPluginEvent[] = [
    {
      eventName: 'inited',
      eventLabel: 'Initialization data interface request completed',
      description:
        'Triggered when the remote initialization data interface request is completed',
      // Form data is form variables
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
      eventName: 'change',
      eventLabel: 'Value change',
      description: 'Triggered when form value changes',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              description:
                'The current form data can be read through the field name'
            }
          }
        }
      ]
    },
    {
      eventName: 'formItemValidateSucc',
      eventLabel: 'Form item verification successful',
      description: 'Triggered after form item verification succeeds',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              description:
                'The current form data can be read through the field name'
            }
          }
        }
      ]
    },
    {
      eventName: 'formItemValidateError',
      eventLabel: 'Form item verification failed',
      description: 'Triggered after form item validation fails',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              description:
                'The current form data can be read through the field name'
            }
          }
        }
      ]
    },
    {
      eventName: 'validateSucc',
      eventLabel: 'Form verification successful',
      description: 'Triggered after successful form validation',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              description:
                'The current form data can be read through the field name'
            }
          }
        }
      ]
    },
    {
      eventName: 'validateError',
      eventLabel: 'Form validation failed',
      description: 'Triggered after form validation fails',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              description:
                'The current form data can be read through the field name'
            }
          }
        }
      ]
    },
    {
      eventName: 'submit',
      eventLabel: 'Form submission',
      strongDesc:
        'After configuring this event, the default validation, submission to API or target, etc. when the form is submitted will not be triggered. All behaviors need to be configured by yourself',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              description:
                'The current form data can be read through the field name'
            }
          }
        }
      ]
    },
    {
      eventName: 'submitSucc',
      eventLabel: 'Submission successful',
      description:
        'Triggered after the form is submitted successfully. If the event source is a button and the button type is "Submit", then the submission success event will be triggered even if the current form is not configured with a "Save Interface".',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                result: {
                  type: 'object',
                  title:
                    'Save the data returned after the interface request is successful'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'submitFail',
      eventLabel: 'Submission failed',
      description: 'Triggered after the form submission request fails',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                error: {
                  type: 'object',
                  title:
                    'Save the error information returned after the interface request fails'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'asyncApiFinished',
      eventLabel: 'Remote request polling ends',
      description: 'asyncApi remote request is triggered after polling ends',
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
    }
  ];

  //Action definition
  actions: RendererPluginAction[] = [
    {
      actionLabel: 'Submit the form',
      actionType: 'submit',
      description: 'Trigger form submission',
      ...getActionCommonProps('submit')
    },
    {
      actionLabel: 'Reset form',
      actionType: 'reset',
      description: 'Trigger form reset',
      ...getActionCommonProps('reset')
    },
    {
      actionLabel: 'Clear form',
      actionType: 'clear',
      description: 'Trigger form clearing',
      ...getActionCommonProps('clear')
    },
    {
      actionLabel: 'Verify form',
      actionType: 'validate',
      description: 'Trigger form validation',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            check
            <span className="variable-left variable-right">
              {info?.rendererLabel}
            </span>
            Data
          </div>
        );
      }
    },
    {
      actionLabel: 'Reload',
      actionType: 'reload',
      description: 'Trigger component data refresh and re-rendering',
      ...getActionCommonProps('reload')
    },
    {
      actionLabel: 'Variable assignment',
      actionType: 'setValue',
      description: 'Trigger component data update',
      ...getActionCommonProps('setValue')
    },
    {
      actionLabel: 'Clear verification status',
      actionType: 'clearError',
      description: 'Clear the error status generated by form validation'
    }
  ];

  Features: Array<{
    label: string;
    value: DSFeatureType;
    disabled?: boolean;
  }> = [
    {label: 'New', value: DSFeatureEnum.Insert},
    {label: 'Edit', value: DSFeatureEnum.Edit},
    {label: 'View', value: DSFeatureEnum.View},
    {label: 'Bulk Edit', value: DSFeatureEnum.BulkEdit, disabled: true}
  ];

  dsManager: DSBuilderManager;

  protected _dynamicControls: FormDynamicControls = {};

  constructor(manager: EditorManager) {
    super(manager);
    this.dsManager = new DSBuilderManager(manager);
  }

  /** Form scaffolding */
  get scaffoldForm(): ScaffoldForm {
    const features = this.Features.filter(f => !f.disabled);

    return {
      title: 'Form Creation Wizard',
      mode: {
        mode: 'horizontal',
        horizontal: {
          leftFixed: 'sm'
        }
      },
      canRebuild: true,
      className: 'ae-Scaffold-Modal ae-Scaffold-Modal-content :AMISCSSWrapper',
      body: [
        {
          type: 'radios',
          name: 'feat',
          label: 'Usage scenario',
          value: DSFeatureEnum.Insert,
          options: features,
          onChange: (
            value: FormPluginFeat,
            oldValue: FormPluginFeat,
            model: IFormItemStore,
            form: IFormStore
          ) => {
            if (value !== oldValue) {
              const data = form.data;

              Object.keys(data).forEach(key => {
                if (
                  /^(insert|edit|bulkEdit|view)Fields$/i.test(key) ||
                  /^(insert|edit|bulkEdit|view)Api$/i.test(key)
                ) {
                  form.deleteValueByName(key);
                }
              });
              form.deleteValueByName('__fields');
              form.deleteValueByName('__relations');
              form.setValues({
                dsType: this.dsManager.getDefaultBuilderKey(),
                initApi:
                  DSFeatureEnum.Insert === value ||
                  DSFeatureEnum.BulkEdit === value
                    ? undefined
                    : ''
              });
            }
          }
        },
        /** Data source selector */
        this.dsManager.getDSSelectorSchema({
          onChange: (
            value: string,
            oldValue: string,
            model: IFormItemStore,
            form: IFormStore
          ) => {
            if (value !== oldValue) {
              const data = form.data;

              Object.keys(data).forEach(key => {
                if (
                  /^(insert|edit|bulkEdit|view)Fields$/i.test(key) ||
                  /^(insert|edit|bulkEdit|view)Api$/i.test(key)
                ) {
                  form.deleteValueByName(key);
                }
              });
              form.deleteValueByName('__fields');
              form.deleteValueByName('__relations');
              form.setValues({
                initApi:
                  DSFeatureEnum.Insert === value ||
                  DSFeatureEnum.BulkEdit === value
                    ? undefined
                    : ''
              });
            }

            return value;
          }
        }),
        /** Data source related configuration*/
        ...flatten(
          features.map(feat =>
            this.dsManager.buildCollectionFromBuilders(
              (builder, builderKey) => {
                return {
                  type: 'container',
                  className: 'form-item-gap',
                  visibleOn: `$\{feat === '${feat.value}' && (!dsType || dsType === '${builderKey}')}`,
                  body: flatten([
                    builder.makeSourceSettingForm({
                      feat: feat.value,
                      renderer: 'form',
                      inScaffold: true,
                      sourceSettings: {
                        userOrders: false
                      }
                    }),
                    builder.makeFieldsSettingForm({
                      feat: feat.value,
                      renderer: 'form',
                      inScaffold: true
                    })
                  ])
                };
              }
            )
          )
        ),
        {
          name: 'operators',
          label: 'Operation',
          type: 'checkboxes',
          value: ['submit'],
          joinValues: false,
          extractValue: false,
          options: [
            FormOperatorMap['reset'],
            FormOperatorMap['submit'],
            FormOperatorMap['cancel']
          ]
        }
      ],
      pipeIn: async (schema: ExtendFormSchema) => {
        /** Data source type*/
        const dsType = schema?.dsType ?? this.dsManager.getDefaultBuilderKey();
        const builder = this.dsManager.getBuilderByKey(dsType);

        if (!builder) {
          return {dsType};
        }

        const config = await builder.guessFormScaffoldConfig({schema});

        return {...config};
      },
      pipeOut: async (config: FormScaffoldConfig) => {
        const scaffold: any = cloneDeep(this.scaffold);
        const builder = this.dsManager.getBuilderByScaffoldSetting(config);

        if (!builder) {
          return scaffold;
        }

        const schema = await builder.buildFormSchema({
          feat: config.feat,
          renderer: 'form',
          inScaffold: true,
          entitySource: config?.entitySource,
          fallbackSchema: scaffold,
          scaffoldConfig: config
        });

        /** Add an identifier to the Schema built by the scaffold to avoid addChild replacing the Schema ID */
        schema.__origin = 'scaffold';

        return schema;
      },
      validate: (data: FormScaffoldConfig, form: IFormStore) => {
        const {feat} = data;
        const builder = this.dsManager.getBuilderByScaffoldSetting(data);
        const featValue = builder?.getFeatValueByKey(
          feat ?? DSFeatureEnum.Insert
        );
        const apiKey = `${featValue}Api`;
        const fieldsKey = `${featValue}Fields`;
        const errors: Record<string, string> = {};

        if (data?.dsType === ModelDSBuilderKey) {
          return errors;
        }

        // if (!form.data[apiKey]) {
        // errors[apiKey] = 'Please enter the interface information';
        // }

        // if (feat === 'Edit' && !form.data?.initApi) {
        // errors['initApi'] = 'Please enter the initialization interface information';
        // }

        const fieldErrors = FieldSetting.validator(form.data[fieldsKey]);

        if (fieldErrors) {
          errors[fieldsKey] = fieldErrors;
        }

        return errors;
      }
    };
  }

  get dynamicControls() {
    return this._dynamicControls;
  }

  set dynamicControls(controls: FormDynamicControls) {
    if (!controls || !isObject(controls)) {
      throw new Error(
        '[amis-editor][FormPlugin] The value of dynamicControls must be an object'
      );
    }

    this._dynamicControls = {...this._dynamicControls, ...controls};
  }

  /** Get possible usage scenarios */
  guessDSFeatFromSchema(schema: Record<string, any>): FormPluginFeat {
    const validFeat = [
      DSFeatureEnum.Insert,
      DSFeatureEnum.Edit,
      DSFeatureEnum.BulkEdit,
      DSFeatureEnum.View
    ];
    if (schema.hasOwnProperty('feat')) {
      return validFeat.includes(schema.feat)
        ? schema.feat
        : DSFeatureEnum.Insert;
    }

    if (schema.initApi != null && schema.api != null) {
      return DSFeatureEnum.Edit;
    } else if (schema.initApi != null && schema.api == null) {
      return DSFeatureEnum.View;
    } else {
      return DSFeatureEnum.Insert;
    }
  }

  panelBodyCreator = (context: BaseEventContext) => {
    /** Is it a CRUD filter form? */
    const isCRUDFilter: boolean =
      /\/crud\/filter\/form$/.test(context.path) ||
      /\/crud2\/filter\/\d\/form$/.test(context.path) ||
      /\/crud2\/filter\/form$/.test(context.path) ||
      /body\/0\/filter$/.test(context.schemaPath);
    /** Is the form in a Dialog? */
    const isInDialog: boolean =
      context.path?.includes?.('dialog/') ||
      context.path?.includes?.('drawer/');
    /** Whether to use Panel package*/
    const isWrapped = 'this.wrapWithPanel !== false';
    const justifyLayout = (left: number = 2) => ({
      mode: 'horizontal',
      horizontal: {
        left,
        justify: true
      }
    });
    const schema = context?.node?.schema ?? context?.schema;
    /** New version of data source control */
    const generateDSControls = () => {
      const dsTypeSelector = this.dsManager.getDSSelectorSchema(
        {
          type: 'select',
          label: 'data source',
          onChange: (
            value: string,
            oldValue: string,
            model: IFormItemStore,
            form: IFormStore
          ) => {
            if (value !== oldValue) {
              const data = form.data;

              Object.keys(data).forEach(key => {
                if (
                  /^(insert|edit|bulkEdit|view)Fields$/i.test(key) ||
                  /^(insert|edit|bulkEdit|view)Api$/i.test(key)
                ) {
                  form.deleteValueByName(key);
                }
              });
              form.deleteValueByName('__fields');
              form.deleteValueByName('__relations');
              form.deleteValueByName('initApi');
              form.deleteValueByName('api');
            }
            return value;
          }
        },
        {
          schema: context?.schema,
          sourceKey: 'api',
          getDefautlValue: (key, builder) => {
            const schema = context?.schema;
            let dsType = schema?.dsType;

            // TODO: api and initApi may be mixed mode scenarios
            if (
              builder.match(schema, 'api') ||
              builder.match(schema, 'initApi')
            ) {
              dsType = key;
            }

            return dsType;
          }
        }
      );
      /**Default data source type*/
      const defaultDsType = dsTypeSelector.value;
      /** Data source configuration */
      const dsSettings = flatten(
        this.Features.map(feat =>
          this.dsManager.buildCollectionFromBuilders(
            (builder, builderKey, index) => {
              return {
                type: 'container',
                className: 'form-item-gap',
                visibleOn: `$\{feat === '${
                  feat.value
                }' && (dsType == null ? '${builderKey}' === '${
                  defaultDsType || ApiDSBuilderKey
                }' : dsType === '${builderKey}')}`,
                body: flatten([
                  builder.makeSourceSettingForm({
                    feat: feat.value,
                    renderer: 'form',
                    inScaffold: false,
                    sourceSettings: {
                      renderLabel: true,
                      userOrders: false,
                      /**
                       * name is automatically generated based on the scene by default
                       * 1. In the scaffolding, the default generated is viewApi
                       * 2. In the configuration panel, the Schema configuration needs to be read, so initApi is used
                       */
                      ...(feat.value === DSFeatureEnum.View
                        ? {name: 'initApi'}
                        : {})
                    }
                  })
                ])
              };
            }
          )
        )
      );

      return [dsTypeSelector, ...dsSettings];
    };

    /** Data source */
    const generateDSCollapse = () => {
      if (isCRUDFilter) {
        /** CRUD query table header data source is entrusted to CRUD hosting*/
        return null;
      } else if (_isModelComp(schema)) {
        /** Model component uses the old version of data source configuration */
        return {
          title: 'Data Source',
          body: [
            getSchemaTpl('apiControl', {
              label: 'Save interface',
              sampleBuilder: () => {
                return `{\n "status": 0,\n "msg": "",\n // It can be returned or not. If the data is returned, it will be merged in. \n data: {}\n}`;
              }
            }),
            getSchemaTpl('apiControl', {
              name: 'asyncApi',
              label: tipedLabel(
                'Asynchronous detection interface',
                'After setting this property, after the form is submitted and the save interface is sent, the polling request to the interface will continue until the returned finished property is true'
              ),
              visibleOn: 'this.asyncApi != null'
            }),
            getSchemaTpl('apiControl', {
              name: 'initAsyncApi',
              label: tipedLabel(
                'Asynchronous detection interface',
                'After setting this property, after the form requests initApi, it will continue to poll and request the interface until the returned finished property is true'
              ),
              visibleOn: 'this.initAsyncApi != null'
            }),
            getSchemaTpl('apiControl', {
              name: 'initApi',
              label: 'Initialize interface',
              sampleBuilder: () => {
                const data = {};
                const schema = context?.schema;

                if (Array.isArray(schema?.body)) {
                  schema.body.forEach((control: any) => {
                    if (
                      control.name &&
                      !~['combo', 'input-array', 'form'].indexOf(control.type)
                    ) {
                      setVariable(data, control.name, 'sample');
                    }
                  });
                }

                return JSON.stringify(
                  {
                    status: 0,
                    msg: '',
                    data: data
                  },
                  null,
                  2
                );
              }
            })
          ]
        };
      } else {
        return {
          title: 'Data Source',
          body: [
            {
              type: 'select',
              name: 'feat',
              label: 'Usage scenario',
              options: this.Features,
              pipeIn: (
                value: FormPluginFeat | undefined,
                formStore: IFormStore
              ) => {
                let feat = value;

                if (!value) {
                  feat = this.guessDSFeatFromSchema(formStore?.data);
                }

                return feat;
              },
              onChange: (
                value: FormPluginFeat,
                oldValue: FormPluginFeat,
                model: IFormItemStore,
                form: IFormStore
              ) => {
                if (value !== oldValue) {
                  form.setValues({
                    dsType: this.dsManager.getDefaultBuilderKey(),
                    initApi:
                      DSFeatureEnum.Insert === value ||
                      DSFeatureEnum.BulkEdit === value
                        ? undefined
                        : '',
                    api: undefined
                  });
                }
              }
            },
            ...generateDSControls()
          ]
        };
      }
    };

    return [
      getSchemaTpl('tabs', [
        {
          title: 'Attributes',
          body: getSchemaTpl(
            'collapseGroup',
            [
              generateDSCollapse(),
              {
                title: 'Basic',
                body: [
                  {
                    name: 'title',
                    type: 'input-text',
                    label: 'Title',
                    visibleOn: isWrapped
                  },
                  getSchemaTpl('switch', {
                    name: 'autoFocus',
                    label: tipedLabel(
                      'Auto Focus',
                      'After setting, the first input form item in the form will get the focus'
                    )
                  }),
                  getSchemaTpl('switch', {
                    name: 'persistData',
                    label: tipedLabel(
                      'Local Cache',
                      'When enabled, the form data will be cached in the browser, and switching pages or closing the pop-up window will not clear the data in the current form'
                    ),
                    pipeIn: (value: boolean | string | undefined) => !!value
                  }),
                  {
                    type: 'container',
                    className: 'ae-ExtendMore mb-3',
                    visibleOn: 'this.persistData',
                    body: [
                      getSchemaTpl('tplFormulaControl', {
                        name: 'persistData',
                        label: tipedLabel(
                          'Persistent Key',
                          'Use static data or variables: <code>"\\${id}"</code> to specify a unique Key for the Form'
                        ),
                        pipeIn: (value: boolean | string | undefined) =>
                          typeof value === 'string' ? value : ''
                      }),
                      {
                        type: 'input-array',
                        label: tipedLabel(
                          'Retain Field Collection',
                          'If you only need to save some field values ​​in the Form, please configure the field name set that needs to be saved. If you leave it blank, all fields will be retained'
                        ),
                        name: 'persistDataKeys',
                        items: {
                          type: 'input-text',
                          placeholder: 'Please enter the field name',
                          options: flatten(
                            schema?.body ?? schema?.controls ?? []
                          )
                            .map((item: Record<string, any>) => {
                              const isFormItem = getRendererByName(
                                item?.type
                              )?.isFormItem;

                              return isFormItem &&
                                typeof item?.name === 'string'
                                ? {label: item.name, value: item.name}
                                : false;
                            })
                            .filter(Boolean)
                        },
                        itemClassName: 'bg-transparent'
                      },
                      getSchemaTpl('switch', {
                        name: 'clearPersistDataAfterSubmit',
                        label: tipedLabel(
                          'Clear cache after successful submission',
                          'After turning on local cache and this configuration item, the cache data of the current form in the browser will be automatically cleared after the form is submitted successfully'
                        ),
                        pipeIn: defaultValue(false)
                      })
                    ]
                  },
                  getSchemaTpl('switch', {
                    name: 'canAccessSuperData',
                    label: tipedLabel(
                      'Automatically fill in data fields with variables of the same name',
                      'The default form can obtain data in the complete data chain. If you want to make the data field of the form independent, please turn off this configuration'
                    ),
                    pipeIn: defaultValue(true)
                  }),
                  getSchemaTpl(
                    'loadingConfig',
                    {label: 'Loading settings'},
                    {context}
                  )
                ]
              },
              {
                title: 'Submit settings',
                body: [
                  {
                    name: 'submitText',
                    type: 'input-text',
                    label: tipedLabel(
                      'Submit button name',
                      'If the bottom button is not a custom button, you can use this configuration to quickly modify the button name. If it is set to empty, the default button can be removed.'
                    ),
                    pipeIn: defaultValue('submit'),
                    visibleOn: `${isWrapped} && !this.actions && (!Array.isArray(this.body) || !this.body.some(function(item) {return !!~['submit','button','reset','button-group'].indexOf(item.type);}))`,
                    ...justifyLayout(4)
                  },
                  getSchemaTpl('switch', {
                    name: 'submitOnChange',
                    label: tipedLabel(
                      'Submit after modification',
                      'After setting, every modification in the form will trigger a submission'
                    )
                  }),
                  getSchemaTpl('switch', {
                    name: 'resetAfterSubmit',
                    label: tipedLabel(
                      'Reset form after submit',
                      'After the form is submitted, restore the values ​​of all form items to their initial values'
                    )
                  }),
                  getSchemaTpl('switch', {
                    name: 'preventEnterSubmit',
                    label: tipedLabel(
                      'Prevent carriage return submission',
                      'By default, pressing the Enter key triggers form submission. This behavior will be prevented after turning it on'
                    )
                  }),
                  // isCRUDFilter
                  //   ? null
                  //   : getSchemaTpl('switch', {
                  //       name: 'submitOnInit',
                  //       label: tipedLabel(
                  // 'Submit once after initialization',
                  // 'When enabled, the initial completion of the form will trigger a submission'
                  //       )
                  //     }),
                  isInDialog
                    ? getSchemaTpl('switch', {
                        label: 'Close the dialog box after submitting',
                        name: 'closeDialogOnSubmit',
                        pipeIn: (value: any) => value !== false
                      })
                    : null
                  // isCRUDFilter
                  //   ? null
                  //   : {
                  //       label: tipedLabel(
                  // 'Submit other components',
                  // 'You can submit the current form value to the target component by setting this property, instead of saving it through the interface. Please fill in the <code>name</code> property of the target component. Separate multiple components with commas. When <code>target</code> is <code>window</code>, the form data is attached to the address bar.'
                  //       ),
                  //       name: 'target',
                  //       type: 'input-text',
                  // placeholder: 'Please enter the component name',
                  //       ...justifyLayout(4)
                  //     },
                  // getSchemaTpl('reload', {
                  //   test: !isCRUDFilter
                  // }),
                  // isCRUDFilter
                  //   ? null
                  //   : {
                  //       type: 'ae-switch-more',
                  //       mode: 'normal',
                  //       label: tipedLabel(
                  // 'Jump after submitting',
                  // 'When this value is set, the form will jump to the target address after submission'
                  //       ),
                  //       formType: 'extend',
                  //       form: {
                  //         mode: 'horizontal',
                  //         horizontal: {
                  //           justify: true,
                  //           left: 4
                  //         },
                  //         body: [
                  //           {
                  // label: 'jump address',
                  //             name: 'redirect',
                  //             type: 'input-text',
                  // placeholder: 'Please enter the target address'
                  //           }
                  //         ]
                  //       }
                  //     }
                ]
              },
              {
                title: 'Combination Check',
                body: [
                  {
                    name: 'rules',
                    label: false,
                    type: 'combo',
                    multiple: true,
                    multiLine: true,
                    subFormMode: 'horizontal',
                    placeholder: '',
                    addBtn: {
                      label: 'Add verification rules',
                      block: true,
                      icon: 'fa fa-plus',
                      className: cx('ae-Button--enhance')
                    },
                    items: [
                      {
                        type: 'ae-formulaControl',
                        name: 'rule',
                        label: 'Verification rules',
                        ...justifyLayout(4)
                      },
                      {
                        name: 'message',
                        label: 'Error message',
                        type: 'input-text',
                        ...justifyLayout(4)
                      }
                    ]
                  }
                ]
              },
              {
                title: 'Status',
                body: [
                  getSchemaTpl('disabled'),
                  getSchemaTpl('visible'),
                  getSchemaTpl('static')
                ]
              },
              {
                title: 'Advanced',
                body: [
                  getSchemaTpl('switch', {
                    name: 'debug',
                    label: tipedLabel(
                      'Turn on debugging',
                      "Show the current form's data at the top of the form"
                    )
                  })
                ]
              }
            ].filter(Boolean)
          )
        },
        {
          title: 'Appearance',
          body: getSchemaTpl('collapseGroup', [
            {
              title: 'Layout',
              body: [
                {
                  label: 'Layout',
                  name: 'mode',
                  type: 'select',
                  pipeIn: defaultValue('flex'),
                  options: [
                    {
                      label: 'grid',
                      value: 'flex'
                    },
                    {
                      label: 'Inline',
                      value: 'inline'
                    },
                    {
                      label: 'horizontal',
                      value: 'horizontal'
                    },
                    {
                      label: 'vertical',
                      value: 'normal'
                    }
                  ],
                  pipeOut: (v: string) => (v ? v : undefined),
                  onChange: (
                    value: string,
                    oldValue: string,
                    model: any,
                    form: any
                  ) => {
                    const body = [...form.data.body];
                    let temp = body;
                    if (value === 'flex') {
                      temp = body?.map((item: any, index: number) => {
                        return {
                          ...item,
                          row: index,
                          mode: undefined
                        };
                      });
                    } else {
                      temp = body?.map((item: any, index: number) => {
                        return {
                          ...item,
                          row: undefined,
                          colSize: undefined,
                          labelAlign: undefined,
                          mode: undefined
                        };
                      });
                    }
                    form.setValueByName('body', temp);
                  }
                },
                {
                  type: 'col-count',
                  name: '__rolCount',
                  label: tipedLabel(
                    'Number of columns',
                    'Only valid for PC pages'
                  ),
                  visibleOn: 'this.mode === "flex"'
                },
                {
                  label: 'Number of columns',
                  name: 'columnCount',
                  type: 'input-number',
                  step: 1,
                  min: 1,
                  precision: 0,
                  resetValue: '',
                  unitOptions: ['列'],
                  hiddenOn: 'this.mode === "flex"',
                  pipeOut: (value: string) => {
                    if (value && typeof value === 'string') {
                      const count = Number.parseInt(
                        value?.replace(/\D+/g, ''),
                        10
                      );

                      return isNaN(count) ? undefined : count;
                    } else if (value && typeof value === 'number') {
                      return value;
                    } else {
                      return undefined;
                    }
                  }
                },
                getSchemaTpl('switch', {
                  name: 'wrapWithPanel',
                  label: tipedLabel(
                    'Panel package',
                    'After closing, the form will only display the form items, and the title and action bar will not be displayed.'
                  ),
                  pipeIn: defaultValue(true)
                }),
                getSchemaTpl('switch', {
                  name: 'affixFooter',
                  label: tipedLabel(
                    'Adsorb the operation bar',
                    'When turned on, the bottom operation area will be suspended when scrolling the form content area'
                  ),
                  visibleOn: isWrapped
                })
              ]
            },
            getSchemaTpl('theme:base', {
              classname: 'formControlClassName',
              title: 'Form Style',
              needState: false,
              hiddenOn: isWrapped
            }),
            getSchemaTpl('theme:base', {
              classname: 'panelClassName',
              title: 'Panel style',
              editorValueToken: '--Panel',
              hidePadding: true,
              needState: false,
              visibleOn: isWrapped
            }),
            getSchemaTpl('theme:base', {
              classname: 'headerControlClassName',
              title: 'Title area style',
              visibleOn: isWrapped,
              editorValueToken: '--Panel-heading',
              hideRadius: true,
              hideShadow: true,
              hideMargin: true,
              needState: false,
              extra: [
                getSchemaTpl('theme:font', {
                  name: 'themeCss.headerTitleControlClassName.font',
                  editorValueToken: '--Panel-heading'
                })
              ]
            }),

            getSchemaTpl('theme:base', {
              classname: 'bodyControlClassName',
              title: 'Content area style',
              editorValueToken: '--Panel-body',
              hideRadius: true,
              hideShadow: true,
              hideBorder: true,
              hideMargin: true,
              hideBackground: true,
              needState: false,
              visibleOn: isWrapped
            }),
            {
              title: 'Form item style',
              body: [
                {
                  type: 'select',
                  name: 'labelAlign',
                  label: 'Title position',
                  selectFirst: true,
                  hiddenOn:
                    'this.mode === "normal" || this.mode === "inline" || this.mode === "horizontal"',
                  options: [
                    {
                      label: 'Top and bottom layout',
                      value: 'top'
                    },
                    {
                      label: 'Horizontal left',
                      value: 'left'
                    },
                    {
                      label: 'Horizontal right',
                      value: 'right'
                    }
                  ]
                },
                {
                  type: 'select',
                  name: 'labelAlign',
                  label: 'Title position',
                  selectFirst: true,
                  hiddenOn:
                    'this.mode === "normal" || this.mode === "inline" || this.mode === "flex"',
                  options: [
                    {
                      label: 'Horizontal left',
                      value: 'left'
                    },
                    {
                      label: 'Horizontal right',
                      value: 'right'
                    }
                  ]
                },
                getSchemaTpl('theme:select', {
                  label: 'Title width',
                  name: 'labelWidth',
                  hiddenOn:
                    'this.mode === "normal" || this.labelAlign === "top"'
                }),

                getSchemaTpl('theme:font', {
                  label: 'Title text',
                  editorValueToken: '--Form-item',
                  hasSenior: false,
                  name: 'themeCss.itemLabelClassName.font'
                }),
                getSchemaTpl('theme:paddingAndMargin', {
                  label: 'Title margin',
                  hidePadding: true,
                  name: 'themeCss.itemLabelClassName.padding-and-margin'
                }),
                getSchemaTpl('theme:paddingAndMargin', {
                  label: 'Form item margin',
                  hidePadding: true,
                  name: 'themeCss.itemClassName.padding-and-margin'
                }),
                getSchemaTpl('theme:font', {
                  label: 'Static display text',
                  editorValueToken: '--Form-static',
                  name: 'themeCss.staticClassName.font',
                  visibleOn: '!!this.static || !!this.staticOn'
                })
              ]
            },
            getSchemaTpl('theme:base', {
              classname: 'actionsControlClassName',
              title: 'Operation area style',
              editorValueToken: '--Panel-footer',
              hideRadius: true,
              hideShadow: true,
              hideMargin: true,
              needState: false,
              visibleOn: isWrapped
            }),
            {
              title: 'Custom style',
              body: [
                {
                  type: 'theme-cssCode',
                  label: false
                }
              ]
            },
            /** */
            getSchemaTpl('style:classNames', {
              isFormItem: false,
              schema: [
                getSchemaTpl('className', {
                  name: 'panelClassName',
                  label: 'Panel',
                  visibleOn: isWrapped
                }),
                getSchemaTpl('className', {
                  name: 'headerClassName',
                  label: 'Title area',
                  visibleOn: isWrapped
                }),
                getSchemaTpl('className', {
                  name: 'bodyClassName',
                  label: 'Content area',
                  visibleOn: isWrapped
                }),
                getSchemaTpl('className', {
                  name: 'actionsClassName',
                  label: 'Operation area',
                  visibleOn: isWrapped
                })
              ]
            })
          ])
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
      ])
    ];
  };

  filterProps(props: Record<string, any>, node: EditorNodeType) {
    ['rules'].forEach(name => {
      if (props.hasOwnProperty(name)) {
        props[name] = JSONPipeOut(props[name], false);
      }
    });

    return props;
  }

  /** Rebuild the API */
  panelFormPipeOut = async (schema: any, oldSchema: any) => {
    // In the viewing scenario, there is no api, only initApi
    const entity = schema?.api?.entity || schema?.initApi?.entity;

    if (!entity || schema?.dsType !== ModelDSBuilderKey) {
      return schema;
    }

    const builder = this.dsManager.getBuilderBySchema(schema);
    const observedFields = ['api', 'initApi', 'body', 'feat'];
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
        renderer: 'form',
        sourceKey: DSFeatureEnum.View === schema.feat ? 'initApi' : 'api',
        feat: schema.feat ?? 'Insert',
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

  afterUpdate(event: PluginEvent<ChangeEventContext>) {
    const context = event.context;

    if (
      context.info.renderer.name === 'form' &&
      context.diff?.some(change => change.path?.join('.') === 'wrapWithPanel')
    ) {
      this.manager.buildPanels();
    }
  }

  async buildDataSchemas(
    node: EditorNodeType,
    region: EditorNodeType,
    trigger?: EditorNodeType
  ) {
    const jsonschema: any = {
      ...jsonToJsonSchema(JSONPipeOut(node.schema.data))
    };
    const pool = node.children.concat();

    while (pool.length) {
      const current = pool.shift() as EditorNodeType;
      const schema = current.schema;

      if (current.rendererConfig?.isFormItem && schema.name) {
        const tmpSchema = await current.info.plugin.buildDataSchemas?.(
          current,
          region,
          trigger,
          node
        );
        jsonschema.properties[schema.name] = {
          ...tmpSchema,
          ...(tmpSchema?.$id ? {} : {$id: `${current.id}-${current.type}`})
        };
      } else {
        pool.push(...current.children);
      }
    }

    return jsonschema;
  }

  rendererBeforeDispatchEvent(node: EditorNodeType, e: any, data: any) {
    if (e === 'inited') {
      // Listen for the inited event of the form and add the data to the context
      const scope = this.manager.dataSchema.getScope(`${node.id}-${node.type}`);
      const jsonschema: any = {
        $id: 'formInitedData',
        ...jsonToJsonSchema(data.responseData)
      };

      scope?.removeSchema(jsonschema.$id);
      scope?.addSchema(jsonschema);
    }
  }

  /**
   * To make the form's buttons editable
   */
  patchSchema(schema: Schema, info: RendererConfig, props: any) {
    let shouldUpdateSchema = false;
    let patchedSchema: Schema = {...schema};

    if (
      !(
        Array.isArray(schema.actions) ||
        schema.wrapWithPanel === false ||
        (Array.isArray(schema.body) &&
          schema.body.some(
            (item: any) =>
              item &&
              !!~['submit', 'button', 'button-group', 'reset'].indexOf(
                (item as any)?.body?.[0]?.type ||
                  (item as any)?.body?.type ||
                  (item as any).type
              )
          ))
      )
    ) {
      shouldUpdateSchema = true;
      patchedSchema = {
        ...patchedSchema,
        actions: [
          {
            type: 'submit',
            label:
              props?.translate(props?.submitText) ||
              schema.submitText ||
              'submit',
            primary: true
          }
        ]
      };
    }

    if (!_isModelComp(schema)) {
      /** The existing data may not have feat set, so it needs to be added*/
      if (!schema.feat) {
        shouldUpdateSchema = true;
        patchedSchema = {
          ...patchedSchema,
          feat: this.guessDSFeatFromSchema(schema)
        };
      }
    }

    return shouldUpdateSchema ? patchedSchema : undefined;
  }

  async getAvailableContextFields(
    scopeNode: EditorNodeType,
    target: EditorNodeType,
    region?: EditorNodeType
  ) {
    const rendererInfo = target.info.renderer;
    /** Some components that use the Renderer decorator are also form items*/
    const specialRenderer = ['user-select', 'department-select'];
    // Only form item components can use the data fields of form components
    if (
      rendererInfo.isFormItem ||
      (rendererInfo.type && specialRenderer.includes(rendererInfo.type)) ||
      target.sameIdChild?.info.renderer.isFormItem
    ) {
      let parentNode = scopeNode.parent;

      while (parentNode && parentNode?.type !== 'crud2') {
        parentNode = parentNode?.parent;
      }

      if (
        parentNode?.type === 'crud2' &&
        (scopeNode?.type === 'form' ||
          /^body\/\d+\/filter/.test(scopeNode.schemaPath ?? ''))
      ) {
        return parentNode.info.plugin.getAvailableContextFields?.(
          parentNode,
          target,
          region
        );
      }

      if (
        scopeNode.parent?.type === 'service' &&
        scopeNode.parent?.parent?.path?.endsWith('service')
      ) {
        return scopeNode.parent.parent.info.plugin.getAvailableContextFields?.(
          scopeNode.parent.parent,
          target,
          region
        );
      }

      // First get the available fields from the data source
      const builder = this.dsManager.getBuilderBySchema(scopeNode.schema);
      if (builder && scopeNode.schema.api) {
        return builder.getAvailableContextFields(
          {
            schema: scopeNode.schema,
            sourceKey: 'api',
            feat: scopeNode.schema?.feat ?? DSFeatureEnum.Insert
          },
          target
        );
      }
    }
  }
}

registerEditorPlugin(FormPlugin);

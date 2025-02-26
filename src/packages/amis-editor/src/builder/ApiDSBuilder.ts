/**
 * @file ApiDsBuilder
 * @desc External API interface data source constructor
 */

import sortBy from 'lodash/sortBy';
import pick from 'lodash/pick';
import get from 'lodash/get';
import uniq from 'lodash/uniq';
import omit from 'lodash/omit';
import intersection from 'lodash/intersection';
import isFunction from 'lodash/isFunction';
import {isObject} from 'amis-core';
import {toast} from 'amis';
import {
  getSchemaTpl,
  tipedLabel,
  generateNodeId,
  JSONPipeOut
} from '@/packages/amis-editor-core/src';
import {DSBuilder, registerDSBuilder} from './DSBuilder';
import {FormOperatorMap, DSFeatureEnum, DSFeature} from './constants';
import {traverseSchemaDeep, displayType2inputType} from './utils';

// @ts-ignore
import type {ColumnSchema} from 'amis/lib/renderers/Table2';
import type {EditorNodeType} from '@/packages/amis-editor-core/src';
import type {ButtonSchema} from 'amis';
import type {
  DSRendererType,
  DSFeatureType,
  GenericSchema,
  FormOperatorValue,
  ScaffoldField,
  ScaffoldConfig,
  FormScaffoldConfig,
  CRUDScaffoldConfig
} from './type';
import type {DSBuilderBaseOptions} from './DSBuilder';

export interface ApiDSBuilderOptions<R extends DSRendererType>
  extends DSBuilderBaseOptions {
  /** Renderer type */
  renderer: DSRendererType;
  /** Scaffolding configuration */
  scaffoldConfig?: R extends 'crud' ? CRUDScaffoldConfig : FormScaffoldConfig;
  /**Configure panel settings*/
  sourceSettings?: {
    /**Data source field name*/
    name?: string;
    /** Data source field title*/
    label?: any;
    renderLabel?: boolean;
    labelClassName?: string;
    mode?: 'horizontal' | 'normal';
    horizontalConfig?: {justify: boolean; left?: number; right?: number};
    visibleOn?: string;
  };
  /** Field management configuration */
  fieldSettings?: {
    renderLabel?: boolean;
  };
  /** Control configuration */
  controlSettings?: {
    fieldMapper?: <T extends Record<string, any>>(option: any) => T | false;
  };
}

export class ApiDSBuilder extends DSBuilder<
  ApiDSBuilderOptions<DSRendererType>
> {
  static key = 'api';

  isDefault = true;

  readonly name: string = 'API interface';

  readonly order: number = 1;

  readonly features = [
    'List',
    'Insert',
    'View',
    'Edit',
    'Delete',
    'BulkEdit',
    'BulkDelete',
    'SimpleQuery'
  ] as DSFeatureType[];

  /**
   * Get the key value.
   */
  get key() {
    return (this.constructor as typeof ApiDSBuilder).key;
  }

  match(schema: any, key?: string) {
    const sourceKey = key && typeof key === 'string' ? key : 'api';
    const apiSchema = schema?.[sourceKey];

    if (schema?.dsType != null || apiSchema?.sourceType != null) {
      return schema?.dsType === this.key || apiSchema?.sourceType === this.key;
    }

    /**
     * Carrying jsonql is definitely not an API interface
     * Carry strategy to generate entity interface through mixed construction strategy
     *  */
    if (
      isObject(apiSchema) &&
      (apiSchema.jsonql != null || apiSchema.strategy != null)
    ) {
      return false;
    }

    const maybeApiUrl =
      typeof apiSchema === 'string'
        ? apiSchema
        : isObject(apiSchema)
        ? apiSchema?.url || ''
        : '';

    if (
      typeof maybeApiUrl === 'string' &&
      (/^(get|post|put|delete|patch|option|jsonp):/.test(apiSchema) ||
        !~maybeApiUrl.indexOf('api://'))
    ) {
      return true;
    }

    return false;
  }

  async getContextFields(options: ApiDSBuilderOptions<DSRendererType>) {
    return [];
  }

  async getAvailableContextFields<T extends DSRendererType>(
    options: ApiDSBuilderOptions<T>,
    target: EditorNodeType
  ): Promise<any> {
    return;
  }

  async getCRUDListFields<T extends Record<string, any>>(
    options: ApiDSBuilderOptions<DSRendererType>
  ): Promise<T[]> {
    const {schema, controlSettings} = options || {};
    const {fieldMapper} = controlSettings || {};

    const columns = (schema?.columns ?? []) as any[];
    const result: T[] = [];

    columns.forEach(item => {
      const option = isFunction(fieldMapper) ? fieldMapper<T>(item) : false;

      if (option !== false) {
        result.push(option);
      }
    });

    return result;
  }

  async getCRUDSimpleQueryFields<T extends Record<string, any>>(
    options: ApiDSBuilderOptions<DSRendererType>
  ): Promise<T[]> {
    const {schema, controlSettings} = options || {};
    const {fieldMapper} = controlSettings || {};
    const filterSchema = schema?.filter
      ? Array.isArray(schema.filter)
        ? schema.filter.find(
            (item: GenericSchema) =>
              item.behavior &&
              Array.isArray(item.behavior) &&
              item.type === 'form'
          )
        : schema.filter?.type === 'form'
        ? schema.filter
        : undefined
      : undefined;
    let result: T[] = [];

    (filterSchema?.body ?? []).forEach((formItem: any) => {
      if (
        formItem.type === 'condition-builder' ||
        formItem.behavior === DSFeatureEnum.AdvancedQuery
      ) {
        return;
      }

      const option = isFunction(fieldMapper) ? fieldMapper<T>(formItem) : false;

      if (option !== false) {
        result.push(option);
      }
    });

    return result;
  }

  makeSourceSettingForm(options: ApiDSBuilderOptions<DSRendererType>): any[] {
    const {feat, renderer, inScaffold, sourceSettings, sourceKey} =
      options || {};

    if (!feat) {
      return [];
    }

    const {
      label,
      name,
      renderLabel,
      labelClassName,
      mode,
      horizontalConfig,
      visibleOn
    } = sourceSettings || {};
    const isCRUD = renderer === 'crud';
    /** Process Label */
    const labelText =
      label ??
      (isCRUD && feat !== 'List'
        ? this.getFeatLabelByKey(feat) + 'interface'
        : 'interface');
    let normalizedLabel: any = labelText;
    if (feat === 'Insert') {
      normalizedLabel = tipedLabel(
        labelText,
        `Used to save data, and pass the data to this interface after the form is submitted.<br/>
        Interface response body requirements (if there is data in data, the data will be merged into the form context): <br/>
        <pre>${JSON.stringify({status: 0, msg: '', data: {}}, null, 2)}</pre>`
      );
    } else if (feat === 'List') {
      normalizedLabel = tipedLabel(
        labelText,
        `Interface response body requirements:<br/>
        <pre>${JSON.stringify(
          {status: 0, msg: '', items: {}, page: 0, total: 0},
          null,
          2
        )}</pre>`
      );
    }

    const layoutMode = mode ?? 'horizontal';
    const baseApiSchemaConfig = {
      renderLabel: renderLabel ?? true,
      label: normalizedLabel,
      name: name ?? (inScaffold ? this.getFeatValueByKey(feat) + 'Api' : 'api'),
      mode: layoutMode,
      labelClassName: labelClassName,
      inputClassName: 'm-b-none',
      ...(layoutMode === 'horizontal' ? horizontalConfig ?? {} : {}),
      ...(visibleOn && typeof visibleOn === 'string' ? {visibleOn} : {}),
      onPickerConfirm: (value: any) => {
        let transformedValue = value;
        const transform = (apiObj: any) =>
          `${apiObj?.api?.method || 'post'}:api://${apiObj?.key || ''}`;

        if (value) {
          transformedValue = Array.isArray(value)
            ? value.map(transform).join(',')
            : transform(value);
        }

        return transformedValue;
      }
    };

    const isServiceCmpt = renderer === 'service';
    const shouldRenderApiControl = isServiceCmpt
      ? true
      : feat !== DSFeatureEnum.View;
    const shouldRenderInitApiControl = isServiceCmpt
      ? false
      : (feat === DSFeatureEnum.Edit || feat === DSFeatureEnum.View) &&
        (renderer === 'form' || sourceKey === 'initApi');
    const shouldRenderQuickApiControl = isServiceCmpt
      ? false
      : feat === DSFeatureEnum.List && renderer === 'crud' && !inScaffold;

    return [
      /** Submission interface */
      shouldRenderApiControl
        ? getSchemaTpl('apiControl', baseApiSchemaConfig)
        : null,
      /** Form initialization interface*/
      shouldRenderInitApiControl
        ? getSchemaTpl('apiControl', {
            ...baseApiSchemaConfig,
            name: 'initApi',
            label: tipedLabel(
              'Initialize interface',
              `Interface response body requirements:<br/>
              <pre>${JSON.stringify(
                {status: 0, msg: '', data: {}},
                null,
                2
              )}</pre>`
            )
          })
        : null,
      /** CRUD quick edit interface */
      ...(shouldRenderQuickApiControl
        ? [
            getSchemaTpl('apiControl', {
              ...baseApiSchemaConfig,
              name: 'quickSaveApi',
              label: tipedLabel(
                'Quick Save',
                'API for batch saving after quick editing'
              )
            }),
            getSchemaTpl('apiControl', {
              ...baseApiSchemaConfig,
              name: 'quickSaveItemApi',
              label: tipedLabel(
                'Quickly save a single entry',
                'API used for instant saving'
              )
            })
          ]
        : [])
    ].filter(Boolean);
  }

  makeFieldsSettingForm(options: ApiDSBuilderOptions<DSRendererType>) {
    const {feat, inScaffold, renderer, fieldSettings} = options || {};
    const {renderLabel} = fieldSettings || {};

    if (
      !feat ||
      !inScaffold ||
      ['Import', 'Export', 'FuzzyQuery', 'Delete', 'BulkDelete'].includes(feat)
    ) {
      return [];
    }

    const result = [
      {
        type: 'ae-field-setting',
        name: this.getFieldsKey(options),
        label: renderLabel === false ? false : 'field',
        renderer,
        feat,
        fieldKeys: this.features.map(f => this.getFieldsKey({feat: f})),
        config: {
          showInputType:
            (renderer === 'form' && feat !== DSFeatureEnum.View) ||
            (renderer === 'crud' &&
              [
                'Edit',
                'BulkEdit',
                'Insert',
                'View',
                'SimpleQuery',
                'List'
              ].includes(feat)),
          showDisplayType:
            (renderer === 'form' && feat === DSFeatureEnum.View) ||
            (renderer === 'crud' && ['List'].includes(feat))
        },
        onAutoGenerateFields: this.autoGenerateFields.bind(this)
      }
    ];

    return result;
  }

  /**
   * Generate fields based on interfaces
   * Note the return format of the CRUD interface. Currently, it is compatible with the items, rows, and options fields. Otherwise, take the first array element under data (aligned with the CRUD loading logic)
   */
  async autoGenerateFields({
    api,
    props,
    setState
  }: {
    api: any;
    props: Record<string, any>;
    setState: (state: any) => void;
  }) {
    const {manager, env, data: ctx, feat} = props;
    const schemaFilter = manager?.store?.schemaFilter;

    if (schemaFilter) {
      api = schemaFilter({api}).api;
    }

    const result = await env?.fetcher(api, ctx);

    if (!result.ok) {
      toast.warning(
        result.defaultMsg ??
          result.msg ??
          'The API response format is incorrect, please check the interface response format requirements'
      );
      return;
    }

    const fields: ScaffoldField[] = [];
    const responseData = result.data;
    let sampleRow: Record<string, any>;
    if (feat === 'List') {
      let items =
        responseData?.rows ||
        responseData?.items ||
        responseData?.options ||
        responseData;

      // Get the first array element under data
      if (!Array.isArray(items)) {
        for (const key of Object.keys(responseData)) {
          if (
            responseData.hasOwnProperty(key) &&
            Array.isArray(responseData[key])
          ) {
            items = responseData[key];
            break;
          }
        }
      } else if (items == null) {
        items = [];
      }

      sampleRow = items?.[0];
    } else {
      sampleRow = responseData;
    }

    if (sampleRow) {
      Object.entries(sampleRow).forEach(([key, value]) => {
        let inputType = 'input-text';

        if (Array.isArray(value)) {
          inputType = 'select';
        } else if (isObject(value)) {
          inputType = 'combo';
        } else if (typeof value === 'number') {
          inputType = 'input-number';
        }

        fields.push({
          label: key,
          name: key,
          displayType: 'tpl',
          inputType,
          checked: true
        });
      });
    }

    return fields;
  }

  getApiKey(options: Partial<{feat: DSFeatureType; [propName: string]: any}>) {
    const {feat} = options || {};
    return feat ? `${this.getFeatValueByKey(feat)}Api` : 'api';
  }

  getFieldsKey(
    options: Partial<{feat: DSFeatureType; [propName: string]: any}>
  ) {
    const {feat} = options || {};
    return feat ? `${this.getFeatValueByKey(feat)}Fields` : '';
  }

  buildBaseButtonSchema(
    options: ApiDSBuilderOptions<DSRendererType>,
    schemaPatch?: {
      formSchema: GenericSchema;
      buttonSchema?: {
        label?: string;
        level?: ButtonSchema['level'];
        order?: number;
        [propName: string]: any;
      };
      dialogSchema?: {
        title?: string;
        actions: GenericSchema[];
      };
      componentId?: string;
    }
  ) {
    const {feat} = options || {};
    const {buttonSchema, formSchema, dialogSchema, componentId} =
      schemaPatch || {};

    if (!feat) {
      return {...buttonSchema};
    }

    const labelMap: Partial<Record<DSFeatureType, string>> = {
      Insert: 'Add',
      View: 'View',
      Edit: 'Edit',
      BulkEdit: 'Batch Edit',
      Delete: 'Delete',
      BulkDelete: 'Batch delete'
    };
    const titleMap: Partial<Record<DSFeatureType, string>> = {
      Insert: 'Add new data',
      View: 'View data',
      Edit: 'Edit data',
      BulkEdit: 'Batch edit data',
      Delete: 'Delete data',
      BulkDelete: 'Batch delete data'
    };

    let schema: GenericSchema = {
      type: 'button',
      label: labelMap[feat] ?? 'button',
      ...buttonSchema,
      behavior: feat,
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'dialog',
              dialog: {
                body: {
                  ...formSchema,
                  onEvent: {
                    submitSucc: {
                      actions: [
                        {
                          actionType: 'search',
                          groupType: 'component',
                          componentId: componentId
                        }
                      ]
                    }
                  }
                },
                title: titleMap[feat] ?? 'Popup',
                size: 'md',
                actions: [
                  {type: 'button', actionType: 'cancel', label: '关闭'}
                ],
                ...dialogSchema
              }
            }
          ]
        }
      }
    };

    return schema;
  }

  /** Build the form button operation area*/
  buildFormOperators(
    options: ApiDSBuilderOptions<'form'>,
    componentId: string
  ) {
    const {feat, scaffoldConfig} = options || {};
    const {operators} = (scaffoldConfig as FormScaffoldConfig) || {};

    const schema = sortBy(operators ?? Object.values(FormOperatorMap), [
      'order'
    ]).map(item => {
      return {
        type: 'button',
        label: item.label,
        onEvent: {
          click: {
            actions: [
              {
                actionType: item.value,
                componentId: componentId
              }
            ]
          }
        },
        ...item.schema
      };
    });

    return schema;
  }

  /**
   * Added initialization Schema configuration for input controls to avoid rendering errors for certain types of components
   */
  appendSchema2InputControl(inputType: string) {
    if (inputType === 'combo') {
      return {
        items: [
          {
            type: 'input-text',
            name: 'input-text',
            placeholder: 'text'
          }
        ]
      };
    } else {
      return {};
    }
  }

  buildBaseFormSchema(
    options: ApiDSBuilderOptions<DSRendererType>,
    schemaPatch?: GenericSchema,
    componentId?: string
  ) {
    schemaPatch = schemaPatch || {};
    const {feat, renderer, scaffoldConfig} = options || {};

    if (!feat) {
      return {...schemaPatch, ...(componentId ? {id: componentId} : {})};
    }

    const fieldsKey = this.getFieldsKey(options);
    const apiKey = this.getApiKey(options);
    const fields: ScaffoldField[] = (scaffoldConfig as any)?.[fieldsKey] ?? [];
    const apiSchema = (scaffoldConfig as any)?.[apiKey];
    const id = componentId ?? generateNodeId();
    let schema: GenericSchema = {
      id,
      type: 'form',
      title: 'Form',
      mode: 'flex',
      labelAlign: 'top',
      dsType: this.key,
      feat: feat,
      body: fields.map((f, index) => {
        const type = f.inputType
          ? displayType2inputType(f.inputType) ?? 'input-text'
          : 'input-text';

        return {
          ...pick(f, ['name', 'label']),
          row: index,
          type,
          ...this.appendSchema2InputControl(type)
        };
      }),
      api: apiSchema,
      ...(renderer === 'form'
        ? {
            actions: this.buildFormOperators(
              options as ApiDSBuilderOptions<'form'>,
              id
            )
          }
        : {})
    };

    if (['Insert', 'Edit', 'BulkEdit'].includes(feat)) {
      schema.resetAfterSubmit = true;
    }

    if (feat === DSFeatureEnum.View) {
      delete schema.api;
      schema.static = true;
    }

    return {...schema, ...schemaPatch, id};
  }

  async buildInsertSchema<T extends DSRendererType>(
    options: ApiDSBuilderOptions<T>,
    componentId?: string
  ) {
    const {renderer, scaffoldConfig} = options || {};
    const {insertApi} = scaffoldConfig || {};

    if (renderer === 'form') {
      return this.buildBaseFormSchema({...options}, undefined, componentId);
    }

    const formId = componentId ?? generateNodeId();
    const formActions = [
      {
        type: 'button',
        actionType: 'cancel',
        label: 'Cancel'
      },
      {
        type: 'button',
        actionType: 'submit',
        label: 'Submit',
        level: 'primary'
      }
    ];
    const title = 'New data';
    const formSchema = this.buildBaseFormSchema(
      {...options, feat: DSFeatureEnum.Insert},
      {
        id: formId,
        title: title,
        api: insertApi,
        actions: formActions
      }
    );

    return {
      ...this.buildBaseButtonSchema(
        {...options, feat: DSFeatureEnum.Insert},
        {
          buttonSchema: {
            level: 'primary',
            className: 'm-r-xs'
          },
          dialogSchema: {
            title,
            actions: formActions
          },
          formSchema,
          componentId
        }
      )
    };
  }

  async buildViewSchema<T extends DSRendererType>(
    options: ApiDSBuilderOptions<T>,
    componentId?: string
  ) {
    const {renderer} = options || {};
    const scaffoldConfig = options.scaffoldConfig || {};
    const isForm = renderer === 'form';
    const viewApi =
      renderer === 'form'
        ? (scaffoldConfig as CRUDScaffoldConfig)?.initApi
        : (scaffoldConfig as CRUDScaffoldConfig)?.viewApi;

    const formActions = [
      {
        type: 'button',
        actionType: 'cancel',
        label: 'Close'
      }
    ];
    const title = 'View data';
    const formSchema = this.buildBaseFormSchema(
      {...options, feat: DSFeatureEnum.View},
      /** Form is built based on scaffolding configuration, while CRUD is internal logic*/
      isForm
        ? {initApi: viewApi}
        : {
            title: title,
            initApi: viewApi,
            actions: formActions
          }
    );

    if (renderer === 'crud') {
      const buttonSchema = {
        ...this.buildBaseButtonSchema(
          {...options, feat: DSFeatureEnum.View},
          {
            buttonSchema: {
              level: 'link'
            },
            dialogSchema: {
              title,
              actions: formActions
            },
            formSchema,
            componentId
          }
        )
      };

      return buttonSchema;
    }

    return formSchema;
  }

  async buildEditSchema<T extends DSRendererType>(
    options: ApiDSBuilderOptions<T>,
    componentId?: string
  ) {
    const {renderer, scaffoldConfig} = options || {};
    const isForm = renderer === 'form';

    if (isForm) {
      return this.buildBaseFormSchema(options, undefined, componentId);
    }

    const {editApi, initApi} = scaffoldConfig || {};
    const formId = generateNodeId();
    const formActions = [
      {
        type: 'button',
        actionType: 'cancel',
        label: 'Cancel'
      },
      {
        type: 'button',
        actionType: 'submit',
        label: 'Submit',
        level: 'primary'
      }
    ];
    const title = 'Edit data';
    const formSchema = this.buildBaseFormSchema(
      {...options, feat: DSFeatureEnum.Edit},
      {
        id: formId,
        title: title,
        initApi: initApi,
        api: editApi,
        actions: formActions
      }
    );

    return {
      ...this.buildBaseButtonSchema(
        {...options, feat: DSFeatureEnum.Edit},
        {
          buttonSchema: {
            level: 'link'
          },
          dialogSchema: {
            title,
            actions: formActions
          },
          formSchema,
          componentId
        }
      )
    };
  }

  async buildBulkEditSchema<T extends DSRendererType>(
    options: ApiDSBuilderOptions<T>,
    componentId?: string
  ) {
    const {renderer, scaffoldConfig} = options;
    const {bulkEditApi} = scaffoldConfig || {};
    const isForm = renderer === 'form';

    if (isForm) {
      return this.buildBaseFormSchema(options, undefined, componentId);
    }

    const formId = generateNodeId();
    const formActions = [
      {
        type: 'button',
        actionType: 'cancel',
        label: 'Cancel'
      },
      {
        type: 'button',
        actionType: 'submit',
        label: 'Submit',
        level: 'primary'
      }
    ];
    const title = 'Batch Edit';
    const formSchema = this.buildBaseFormSchema(
      {...options, feat: DSFeatureEnum.BulkEdit},
      {
        id: formId,
        title: title,
        api: bulkEditApi,
        actions: formActions
      }
    );

    return {
      ...this.buildBaseButtonSchema(
        {...options, feat: DSFeatureEnum.BulkEdit},
        {
          buttonSchema: {
            className: 'm-r-xs',
            disabledOn: '${selectedItems != null && selectedItems.length < 1}'
          },
          dialogSchema: {
            title,
            actions: formActions
          },
          formSchema,
          componentId
        }
      )
    };
  }

  async buildCRUDDeleteSchema(
    options: ApiDSBuilderOptions<'crud'>,
    componentId?: string
  ) {
    const {scaffoldConfig} = options || {};
    const {deleteApi} = scaffoldConfig || {};

    return {
      type: 'button',
      label: 'Delete',
      behavior: 'Delete',
      className: 'm-r-xs text-danger',
      level: 'link',
      confirmText: 'Confirm to delete data',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'ajax',
              api: deleteApi,
              data: {
                '&': '$$'
              }
            },
            {
              actionType: 'search',
              groupType: 'component',
              componentId: componentId
            }
          ]
        }
      }
    };
  }

  async buildCRUDBulkDeleteSchema(
    options: ApiDSBuilderOptions<'crud'>,
    componentId?: string
  ) {
    const {scaffoldConfig} = options || {};
    const {bulkDeleteApi, primaryField = 'id'} = scaffoldConfig || {};

    return {
      type: 'button',
      label: 'Batch delete',
      behavior: 'BulkDelete',
      level: 'danger',
      className: 'm-r-xs',
      confirmText:
        'Confirm to delete data in batches' +
        `「\${JOIN(ARRAYMAP(selectedItems, item => item.${primaryField}), ',')}」`,
      disabledOn: '${selectedItems != null && selectedItems.length < 1}',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'ajax',
              api: bulkDeleteApi
            },
            {
              actionType: 'search',
              groupType: 'component',
              componentId: componentId
            }
          ]
        }
      }
    };
  }

  async buildSimpleQueryCollectionSchema(
    options: ApiDSBuilderOptions<'crud'>
  ): Promise<GenericSchema[] | undefined> {
    const {renderer, schema} = options || {};

    if (renderer !== 'crud') {
      return;
    }

    const simpleQueryFields = (schema?.columns ?? [])
      .filter((item: ColumnSchema) => item.type !== 'operation')
      .map((item: ColumnSchema) => {
        const inputType = item.type
          ? displayType2inputType(item.type) ?? 'input-text'
          : 'input-text';

        return {
          type: item.type ?? 'input-text',
          inputType,
          name: item.name,
          label: item.title,
          size: 'full',
          required: false,
          behavior: 'SimpleQuery'
        };
      });

    const filter = await this.buildCRUDFilterSchema(
      {
        ...options,
        scaffoldConfig: {
          dsType: this.key,
          simpleQueryFields
        }
      },
      schema?.id
    );

    return filter.body;
  }

  async buildCRUDFilterSchema(
    options: ApiDSBuilderOptions<'crud'>,
    componentId?: string
  ) {
    const {scaffoldConfig} = options || {};
    const {simpleQueryFields} = scaffoldConfig || {};
    const fields = simpleQueryFields ?? [];
    const formSchema = {
      type: 'form',
      title: 'Conditional Query',
      mode: 'inline',
      columnCount: 3,
      clearValueOnHidden: true,
      behavior: ['SimpleQuery'],
      body: fields.map(f => {
        const type = f.inputType ?? 'input-text';

        return {
          ...pick(f, ['name', 'label']),
          type,
          size: 'full',
          required: false,
          behavior: 'SimpleQuery',
          ...this.appendSchema2InputControl(type)
        };
      }),
      actions: [
        {type: 'reset', label: 'Reset'},
        {type: 'submit', label: 'Query', level: 'primary'}
      ]
    };

    return formSchema;
  }

  async buildCRUDOpColumn(
    options: ApiDSBuilderOptions<'crud'>,
    componentId?: string
  ) {
    const {feats} = options || {};
    const buttons = [];

    if (feats?.includes('View')) {
      buttons.push(await this.buildViewSchema(options, componentId));
    }

    if (feats?.includes('Edit')) {
      buttons.push(await this.buildEditSchema(options, componentId));
    }

    if (feats?.includes('Delete')) {
      buttons.push(await this.buildCRUDDeleteSchema(options, componentId));
    }

    return {
      type: 'operation',
      title: 'Operation',
      buttons: buttons
    };
  }

  async buildCRUDColumn(
    field: ScaffoldField,
    options: ApiDSBuilderOptions<'crud'>,
    componentId?: string
  ) {
    return {
      type: field.displayType,
      title: field.label,
      name: field.name
      /** Bind column value, seems unnecessary*/
      // [f.typeKey || 'value']: `\${f.key}`
    };
  }

  async buildCRUDColumnsSchema(
    options: ApiDSBuilderOptions<'crud'>,
    componentId?: string
  ) {
    const {scaffoldConfig} = options;
    const {listFields} = (scaffoldConfig as CRUDScaffoldConfig) || {};
    const fields = listFields ?? [];
    const opColumn = await this.buildCRUDOpColumn(options, componentId);
    const columns = (
      await Promise.all(
        fields.map(async f => this.buildCRUDColumn(f, options, componentId))
      )
    ).filter(Boolean);

    return [...columns, ...(opColumn.buttons.length !== 0 ? [opColumn] : [])];
  }

  buildToolbarContainer(
    align: 'left' | 'right',
    body: GenericSchema[] = [],
    behaviors?: DSFeatureType[]
  ) {
    body = Array.isArray(body) ? body : [body];

    return {
      type: 'container',
      align: align,
      /** Positioning identifier */
      ...(behaviors ? {behavior: behaviors} : {}),
      body: Array.isArray(body) ? body : [body],
      wrapperBody: false,
      style: {
        flexGrow: 1,
        flex: '1 1 auto',
        position: 'static',
        display: 'flex',
        flexBasic: 'auto',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'stretch',
        ...(align
          ? {
              justifyContent: align === 'left' ? 'flex-start' : 'flex-end'
            }
          : {})
      }
    };
  }

  buildToolbarFlex(
    position: 'header' | 'footer',
    left: GenericSchema[],
    right: GenericSchema[]
  ) {
    return [
      {
        type: 'flex',
        direction: 'row',
        justify: 'flex-start',
        alignItems: 'stretch',
        style: {
          position: 'static'
        },
        items: [
          this.buildToolbarContainer(
            'left',
            left,
            position === 'header'
              ? [
                  DSFeatureEnum.Insert,
                  DSFeatureEnum.BulkEdit,
                  DSFeatureEnum.BulkDelete
                ]
              : undefined
          ),
          this.buildToolbarContainer(
            'right',
            right,
            position === 'header' ? [DSFeatureEnum.FuzzyQuery] : undefined
          )
        ].filter(Boolean)
      }
    ];
  }

  async buildHeaderToolbar(
    options: ApiDSBuilderOptions<'crud'>,
    componentId?: string
  ) {
    const {feats} = options || {};
    const collection: GenericSchema[] = [];

    if (feats?.includes('Insert')) {
      collection.push(await this.buildInsertSchema(options, componentId));
    }
    if (feats?.includes('BulkEdit')) {
      collection.push(await this.buildBulkEditSchema(options, componentId));
    }
    if (feats?.includes('BulkDelete')) {
      collection.push(
        await this.buildCRUDBulkDeleteSchema(options, componentId)
      );
    }

    return this.buildToolbarFlex('header', collection, []);
  }

  buildFooterToolbar(
    options: ApiDSBuilderOptions<'crud'>,
    componentId: string
  ) {
    return this.buildToolbarFlex(
      'footer',
      [],
      [
        {
          type: 'pagination',
          behavior: 'Pagination',
          layout: ['total', 'perPage', 'pager'],
          perPage: 10,
          perPageAvailable: [10, 20, 50, 100],
          align: 'right'
        }
      ]
    );
  }

  guessFormScaffoldConfig<FormScaffoldConfig>(options: {
    schema: GenericSchema;
    [propName: string]: any;
  }) {
    const {schema} = options || {};
    const dsType = this.key;

    if (!schema.dsType || schema.dsType !== dsType) {
      return {dsType} as FormScaffoldConfig;
    }

    const feat = schema?.feat ?? 'Insert';
    /** Form operation */
    const operators = (schema.actions ?? [])
      .map((item: any) => {
        const opValue = get(
          item,
          'onEvent.click.actions[0].actionType'
        ) as FormOperatorValue;

        if (
          typeof opValue === 'string' &&
          opValue &&
          ['submit', 'reset', 'cancel'].includes(opValue)
        ) {
          return FormOperatorMap[opValue];
        }

        return undefined;
      })
      .filter(Boolean);
    const featValue = this.getFeatValueByKey(feat);
    const fieldKey = featValue ? `${featValue}Fields` : '';
    const apiKey = featValue ? `${featValue}Api` : '';
    const fields = (Array.isArray(schema?.body) ? schema.body : [schema.body])
      .map(item => {
        if (!item) {
          return false;
        }

        return {
          name: item.name,
          label: item.label,
          displayType: 'tpl' /** This attribute is useless for form*/,
          inputType: item.type
        };
      })
      .filter(
        (f): f is Exclude<typeof f, null | false | undefined> => f != null
      );

    const config = {
      feat: feat,
      dsType,
      ...(fieldKey ? {[fieldKey]: fields} : {}),
      ...(apiKey ? {[apiKey]: JSONPipeOut(schema?.api)} : {}),
      ...(feat === 'Edit' || schema.initApi != null
        ? {initApi: JSONPipeOut(schema?.initApi)}
        : {}),
      operators:
        operators.length < 1
          ? [FormOperatorMap['cancel'], FormOperatorMap['submit']]
          : operators,
      __pristineSchema: omit(JSONPipeOut(schema), [
        ...Object.values(DSFeature).map(item => `${item.value}Fields`)
      ])
    } as FormScaffoldConfig;

    return config;
  }

  guessCRUDScaffoldConfig<CRUDScaffoldConfig>(options: {
    schema: GenericSchema;
    [propName: string]: any;
  }) {
    const {schema} = options || {};
    const dsType = this.key;

    if (!schema.dsType || schema.dsType !== dsType) {
      return {dsType, primaryField: 'id'} as CRUDScaffoldConfig;
    }

    const listFields = (
      Array.isArray(schema?.columns) ? schema.columns : [schema.columns]
    )
      .filter(item => item.type !== 'operation')
      .map(item => {
        if (!item) {
          return;
        }

        return {
          name: item.name,
          label: item.title,
          displayType: item.type,
          inputType: 'input-text' /** This attribute is not useful for CRUD*/
        };
      })
      .filter(
        (f): f is Exclude<typeof f, null | false | undefined> => f != null
      );
    let viewFields: ScaffoldField[] = [];
    let viewApi: any;
    let insertFields: ScaffoldField[] = [];
    let insertApi: any;
    let editFields: ScaffoldField[] = [];
    let editApi: any;
    let bulkEditFields: ScaffoldField[] = [];
    let bulkEditApi: any;
    let simpleQueryFields: ScaffoldField[] = [];
    let bulkDeleteApi: any;
    let deleteApi: any;

    /** Features enabled */
    const feats: DSFeatureType[] = [];

    const collectFormFields = (body: any[]) =>
      body.map((item: any) => ({
        ...pick(item, ['name', 'label']),
        inputType: item.type ?? 'input-text',
        displayType: 'tpl'
      }));

    traverseSchemaDeep(
      schema,
      (key: string, value: any, host: Record<string, any>) => {
        if (key === 'feat') {
          if (value === 'Insert') {
            feats.push('Insert');
            insertFields = collectFormFields(host?.body ?? []);
            insertApi = host?.api;
          } else if (value === 'Edit') {
            feats.push('Edit');
            editFields = collectFormFields(host?.body ?? []);
            editApi = host?.api;
          } else if (value === 'BulkEdit') {
            feats.push('BulkEdit');
            bulkEditFields = collectFormFields(host?.body ?? []);
            bulkEditApi = host?.api;
          } else if (value === 'View') {
            feats.push('View');
            viewFields = collectFormFields(host?.body ?? []);
            viewApi = host?.initApi;
          }
        }

        if (key === 'behavior') {
          if (value === 'BulkDelete') {
            feats.push('BulkDelete');

            const actions = get(host, 'onEvent.click.actions', []);
            const actionSchema = actions.find(
              (action: any) =>
                action?.actionType === 'ajax' &&
                (action?.api != null || action?.args?.api != null)
            );
            bulkDeleteApi =
              get(actionSchema, 'api', '') || get(actionSchema, 'args.api', '');
          } else if (value === 'Delete') {
            feats.push('Delete');

            const actions = get(host, 'onEvent.click.actions', []);
            const actionSchema = actions.find(
              (action: any) =>
                action?.actionType === 'ajax' &&
                (action?.api != null || action?.args?.api != null)
            );
            deleteApi =
              get(actionSchema, 'api', '') || get(actionSchema, 'args.api', '');
          } else if (Array.isArray(value) && value.includes('SimpleQuery')) {
            feats.push('SimpleQuery');

            simpleQueryFields = (host?.body ?? []).map((item: any) => ({
              ...pick(item, ['name', 'label']),
              inputType: item.type ?? 'input-text',
              isplayType: 'tpl'
            }));
          }
        }

        return [key, value];
      }
    );
    const finalFeats = uniq(feats);

    const config = {
      dsType,
      tools: intersection(finalFeats, [
        DSFeatureEnum.Insert,
        DSFeatureEnum.BulkDelete,
        DSFeatureEnum.BulkEdit
      ]) as DSFeatureType[],
      /**Data operation*/
      operators: intersection(finalFeats, [
        DSFeatureEnum.View,
        DSFeatureEnum.Edit,
        DSFeatureEnum.Delete
      ]) as DSFeatureType[],
      /** Conditional query*/
      filters: intersection(finalFeats, [
        DSFeatureEnum.FuzzyQuery,
        DSFeatureEnum.SimpleQuery,
        DSFeatureEnum.AdvancedQuery
      ]) as DSFeatureType[],
      listFields,
      listApi: JSONPipeOut(schema?.api),
      viewFields,
      viewApi: JSONPipeOut(viewApi),
      insertFields,
      insertApi: JSONPipeOut(insertApi),
      editFields,
      editApi: JSONPipeOut(editApi),
      bulkEditFields,
      bulkEditApi: JSONPipeOut(bulkEditApi),
      deleteApi: JSONPipeOut(deleteApi),
      bulkDeleteApi: JSONPipeOut(bulkDeleteApi),
      simpleQueryFields,
      primaryField: schema?.primaryField ?? 'id',
      __pristineSchema: omit(JSONPipeOut(schema), [
        ...Object.values(DSFeature).map(item => `${item.value}Fields`)
      ])
    };

    return config as CRUDScaffoldConfig;
  }

  async buildCRUDSchema(options: ApiDSBuilderOptions<'crud'>) {
    const {feats, scaffoldConfig} = options;
    const {
      primaryField = 'id',
      listApi,
      editApi,
      bulkEditApi
    } = scaffoldConfig || {};
    const enableBulkEdit = feats?.includes('BulkEdit');
    const enableBulkDelete = feats?.includes('BulkDelete');
    const enableEdit = feats?.includes('Edit');
    const enableMultiple = enableBulkEdit || enableBulkDelete;

    const id = generateNodeId();
    /** Don't consider cards and lists for now */
    return {
      id,
      type: 'crud2',
      mode: 'table2',
      dsType: this.key,
      syncLocation: true,
      /** CRUD2 uses selectable + multiple control, Table2 uses rowSelection control*/
      ...(enableMultiple ? {selectable: true, multiple: true} : {}),
      primaryField: primaryField,
      loadType: 'pagination',
      api: listApi,
      ...(enableBulkEdit ? {quickSaveApi: bulkEditApi} : {}),
      ...(enableEdit ? {quickSaveItemApi: editApi} : {}),
      ...(feats?.includes(DSFeatureEnum.SimpleQuery)
        ? {filter: await this.buildCRUDFilterSchema(options, id)}
        : {}),
      headerToolbar: await this.buildHeaderToolbar(options, id),
      footerToolbar: this.buildFooterToolbar(options, id),
      columns: await this.buildCRUDColumnsSchema(options, id)
    };
  }

  async buildFormSchema(options: ApiDSBuilderOptions<'form'>) {
    const {feat, scaffoldConfig} = options;
    const {initApi, __pristineSchema} = scaffoldConfig || {};
    let formSchema: GenericSchema;
    const id = __pristineSchema?.id ?? generateNodeId();

    if (feat === DSFeatureEnum.Insert) {
      formSchema = await this.buildInsertSchema<'form'>(options, id);
    } else if (feat === DSFeatureEnum.Edit) {
      formSchema = await this.buildEditSchema(options, id);
    } else if (feat === DSFeatureEnum.View) {
      formSchema = await this.buildViewSchema(options, id);
    } else {
      formSchema = await this.buildBulkEditSchema(options, id);
    }

    const baseSchema = {
      ...formSchema,
      ...(feat === 'Edit' ? {initApi} : {}),
      dsType: this.key
    };

    if (__pristineSchema && isObject(__pristineSchema)) {
      return {
        ...__pristineSchema,
        ...baseSchema,
        id: id
      };
    }

    return baseSchema;
  }

  async buildApiSchema(options: ApiDSBuilderOptions<any>) {
    const {schema} = options;

    return schema;
  }
}

registerDSBuilder(ApiDSBuilder);

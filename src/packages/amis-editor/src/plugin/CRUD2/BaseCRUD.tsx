/**
 * @file BaseCRUD
 * @desc CRUD2 configuration panel base class
 */

import React from 'react';
import DeepDiff from 'deep-diff';
import isFunction from 'lodash/isFunction';
import flattenDeep from 'lodash/flattenDeep';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import uniq from 'lodash/uniq';
import sortBy from 'lodash/sortBy';
import pick from 'lodash/pick';
import {toast, autobind, isObject} from '@/packages/amis-ui/src';
import {
  BasePlugin,
  EditorManager,
  defaultValue,
  getSchemaTpl,
  tipedLabel
} from '@/packages/amis-editor-core/src';
import {
  DSBuilderManager,
  DSFeatureEnum,
  DSFeatureType,
  ModelDSBuilderKey,
  ApiDSBuilderKey
} from '../../builder';
import {
  getEventControlConfig,
  getArgsWrapper,
  getActionCommonProps,
  buildLinkActionDesc
} from '../../renderer/event-control/helper';
import {CRUD2Schema} from '@/packages/amis-ui/src';
import {deepRemove, findObj, findSchema} from './utils';
import {
  ToolsConfig,
  FiltersConfig,
  OperatorsConfig,
  DefaultMaxDisplayRows
} from './constants';
import {FieldSetting} from '../../renderer/FieldSetting';

import type {IFormItemStore, IFormStore} from '@/packages/amis-core/src';
import type {CRUDScaffoldConfig} from '../../builder/type';
import type {
  ScaffoldForm,
  BuildPanelEventContext,
  EditorNodeType,
  RendererPluginEvent,
  RendererPluginAction
} from '@/packages/amis-editor-core/src';

/** Attributes that need to be dynamically controlled*/
export type CRUD2DynamicControls = Partial<
  Record<
    'columns' | 'toolbar' | 'filters' | 'primaryField',
    (context: BuildPanelEventContext) => any
  >
>;
export class BaseCRUDPlugin extends BasePlugin {
  static id = 'CRUD2Plugin';

  rendererName = 'crud2';

  name = 'Table 2.0';

  panelTitle = 'Table 2.0';

  subPanelTitle = 'Table 2.0';

  icon = 'fa fa-table';

  panelIcon = 'fa fa-table';

  subPanelIcon = 'fill-table';

  pluginIcon = 'table-plugin';

  panelJustify = true;

  multifactor = true;

  order = -1000;

  $schema = '/schemas/CRUD2Schema.json';

  docLink = '/amis/zh-CN/components/table2';

  tags = ['data container'];

  events: RendererPluginEvent[];

  actions: RendererPluginAction[];

  scaffold: CRUD2Schema;

  dsManager: DSBuilderManager;

  constructor(
    manager: EditorManager,
    events?: RendererPluginEvent[],
    actions?: RendererPluginAction[]
  ) {
    super(manager);

    this.dsManager = new DSBuilderManager(manager);
    this.events = uniqBy([...(events || [])], 'eventName');
    this.actions = uniqBy(
      [
        {
          actionType: 'search',
          actionLabel: 'Data Query',
          description: 'Complete list data query using specified conditions',
          descDetail: (info: any, context: any, props: any) => {
            return (
              <div className="action-desc">
                trigger
                {buildLinkActionDesc(props.manager, info)}
                Data Query
              </div>
            );
          },
          schema: getArgsWrapper({
            name: 'query',
            label: 'Query conditions',
            type: 'ae-formulaControl',
            variables: '${variables}',
            size: 'md',
            mode: 'horizontal'
          })
        },
        {
          actionType: 'loadMore',
          actionLabel: 'Load more',
          description: 'Load more data into the list container',
          descDetail: (info: any, context: any, props: any) => {
            return (
              <div className="action-desc">
                load
                {buildLinkActionDesc(props.manager, info)}
                More data
              </div>
            );
          }
        },
        {
          actionType: 'startAutoRefresh',
          actionLabel: 'Start automatic refresh',
          description: 'Start automatic refresh'
        },
        {
          actionType: 'stopAutoRefresh',
          actionLabel: 'Stop automatic refresh',
          description: 'Stop automatic refresh'
        },
        {
          actionType: 'reload',
          actionLabel: 'Reload',
          description: 'Trigger component data refresh and re-rendering',
          ...getActionCommonProps('reload')
        },
        ...(actions || [])
      ],
      'actionType'
    );
  }

  get scaffoldForm(): ScaffoldForm {
    return {
      title: `${this.name} Creation Wizard`,
      mode: {
        mode: 'horizontal',
        horizontal: {
          leftFixed: 'sm'
        }
      },
      className:
        'ae-Scaffold-Modal ae-Scaffold-Modal--CRUD ae-Scaffold-Modal-content :AMISCSSWrapper', //  ae-formItemControl
      stepsBody: true,
      canSkip: true,
      canRebuild: true,
      body: [
        {
          title: 'Data Configuration',
          body: [
            /**Data source selection*/
            this.dsManager.getDSSelectorSchema({
              onChange: (value: any, oldValue: any, model: any, form: any) => {
                if (value !== oldValue) {
                  const data = form.data;

                  Object.keys(data).forEach(key => {
                    if (
                      key?.toLowerCase()?.endsWith('fields') ||
                      key?.toLowerCase()?.endsWith('api')
                    ) {
                      form.deleteValueByName(key);
                    }
                  });
                  form.deleteValueByName('__fields');
                  form.deleteValueByName('__relations');
                }
                return value;
              }
            }),
            /** Data source configuration */
            ...this.dsManager.buildCollectionFromBuilders(
              (builder, builderKey) => {
                return {
                  type: 'container',
                  visibleOn: `!this.dsType || this.dsType === '${builderKey}'`,
                  body: flattenDeep([
                    builder.makeSourceSettingForm({
                      feat: DSFeatureEnum.List,
                      renderer: 'crud',
                      inScaffold: true,
                      sourceSettings: {
                        userOrders: true
                      }
                    }),
                    builder.makeFieldsSettingForm({
                      feat: DSFeatureEnum.List,
                      renderer: 'crud',
                      inScaffold: true
                    })
                  ])
                };
              }
            ),
            getSchemaTpl('primaryField', {
              visibleOn: `!this.dsType || this.dsType !== '${ModelDSBuilderKey}'`
            })
          ]
        },
        {
          title: 'Function Configuration',
          body: [
            /** Function scenario selection */
            ...this.dsManager.buildCollectionFromBuilders(
              (builder, builderKey) => {
                return {
                  type: 'container',
                  visibleOn: `dsType == null || dsType === '${builderKey}'`,
                  body: [
                    {
                      type: 'checkboxes',
                      label: 'Toolbar',
                      name: ToolsConfig.groupName,
                      joinValues: false,
                      extractValue: true,
                      multiple: true,
                      options: ToolsConfig.options.filter(item =>
                        builder.filterByFeat(item.value)
                      )
                    },
                    {
                      type: 'checkboxes',
                      label: 'Conditional query',
                      name: FiltersConfig.groupName,
                      multiple: true,
                      joinValues: false,
                      extractValue: true,
                      options: FiltersConfig.options.filter(item =>
                        builder.filterByFeat(item.value)
                      )
                    },
                    {
                      type: 'checkboxes',
                      label: 'Data operation',
                      name: OperatorsConfig.groupName,
                      multiple: true,
                      joinValues: false,
                      extractValue: true,
                      options: OperatorsConfig.options.filter(item =>
                        builder.filterByFeat(item.value)
                      )
                    },
                    // Placeholder, the last form item has no spacing
                    {
                      type: 'container'
                    }
                  ]
                };
              }
            ),
            /** Field settings for each scene*/
            {
              type: 'tabs',
              tabsMode: 'vertical',
              className: 'ae-Scaffold-Modal-tabs',
              tabs: this.getScaffoldFeatureTab()
            }
          ]
        }
      ],
      /** Data backfill for reconstruction */
      pipeIn: async (schema: any) => {
        /** Data source type*/
        const dsType = schema?.dsType ?? this.dsManager.getDefaultBuilderKey();
        const builder = this.dsManager.getBuilderByKey(dsType);

        if (!builder) {
          return {dsType};
        }

        const config = await builder.guessCRUDScaffoldConfig({schema});

        return {...config};
      },
      pipeOut: async (config: CRUDScaffoldConfig) => {
        const scaffold: any = cloneDeep(this.scaffold);
        const builder = this.dsManager.getBuilderByScaffoldSetting(config);

        if (!builder) {
          return scaffold;
        }

        const schema = await builder.buildCRUDSchema({
          feats: uniq(
            [
              DSFeatureEnum.List as 'List',
              ...(config.tools ?? []),
              ...(config.filters ?? []),
              ...(config.operators ?? [])
            ].filter(Boolean)
          ),
          renderer: 'crud',
          inScaffold: true,
          entitySource: config?.entitySource,
          fallbackSchema: scaffold,
          scaffoldConfig: config
        });

        /** Add an identifier to the Schema built by the scaffold to avoid addChild replacing the Schema ID */
        schema.__origin = 'scaffold';

        return schema;
      },
      validate: (data: CRUDScaffoldConfig, form: IFormStore) => {
        const feat = DSFeatureEnum.List;
        const builder = this.dsManager.getBuilderByScaffoldSetting(data);
        const featValue = builder?.getFeatValueByKey(feat);
        const fieldsKey = `${featValue}Fields`;
        const errors: Record<string, string> = {};

        if (
          data?.dsType === ModelDSBuilderKey ||
          builder?.key === ModelDSBuilderKey
        ) {
          return errors;
        }

        const fieldErrors = false;
        // FieldSetting.validator(form.data[fieldsKey]);

        if (fieldErrors) {
          errors[fieldsKey] = fieldErrors;
        }

        return errors;
      }
    };
  }

  /** Schema for setting fields in each scenario */
  getScaffoldFeatureTab() {
    const tabs: {title: string; icon: string; body: any; visibleOn: string}[] =
      [];
    [
      {
        groupName: '',
        options: [
          {
            label: 'List display',
            value: 'List',
            icon: 'fa fa-list'
          }
        ]
      },
      ToolsConfig,
      FiltersConfig,
      OperatorsConfig
    ].forEach(group => {
      group.options.forEach(
        (
          item: {value: DSFeatureType; label: string; icon: string},
          index: number
        ) => {
          this.dsManager.buildCollectionFromBuilders((builder, builderKey) => {
            if (!builder.features.includes(item.value)) {
              return null;
            }

            const tabContent =
              builderKey === ModelDSBuilderKey
                ? [
                    ...builder.makeFieldsSettingForm({
                      feat: item.value,
                      renderer: 'crud',
                      inScaffold: true
                    })
                  ]
                : [
                    ...(item.value === 'Edit'
                      ? /** CRUD editing requires initialization interface*/ builder.makeSourceSettingForm(
                          {
                            feat: item.value,
                            renderer: 'crud',
                            inScaffold: true,
                            sourceKey: 'initApi'
                          }
                        )
                      : !['List', 'SimpleQuery'].includes(item.value)
                      ? builder.makeSourceSettingForm({
                          feat: item.value,
                          renderer: 'crud',
                          inScaffold: true
                        })
                      : []),
                    ...builder.makeFieldsSettingForm({
                      feat: item.value,
                      renderer: 'crud',
                      inScaffold: true,
                      fieldSettings: {
                        renderLabel: false
                      }
                    })
                  ];

            if (!tabContent || tabContent.length === 0) {
              return null;
            }

            const groupName = group.groupName;
            const extraVisibleOn = groupName
              ? `data["${groupName}"] && ~data['${groupName}'].indexOf('${item.value}')`
              : true;

            tabs.push({
              title: item.label,
              icon: item.icon,
              visibleOn: `(!this.dsType || this.dsType === '${builderKey}') && ${extraVisibleOn}`,
              body: tabContent
                .filter(Boolean)
                .map(formItem => ({...formItem, mode: 'normal'}))
            });

            return;
          });
        }
      );
    });

    return tabs;
  }

  protected _dynamicControls: CRUD2DynamicControls = {
    /** Column configuration */
    columns: context => this.renderColumnsControl(context),
    /** Toolbar configuration */
    toolbar: context => this.renderToolbarCollapse(context),
    /**Search bar*/
    filters: context => this.renderFiltersCollapse(context),
    /** Primary key */
    primaryField: context => getSchemaTpl('primaryField')
  };

  /** Controls that need dynamic control*/
  get dynamicControls() {
    return this._dynamicControls;
  }

  set dynamicControls(controls: CRUD2DynamicControls) {
    if (!controls || !isObject(controls)) {
      throw new Error(
        '[amis-editor][CRUD2Plugin] The value of dynamicControls must be an object'
      );
    }

    this._dynamicControls = {...this._dynamicControls, ...controls};
  }

  /**CRUD public configuration panel*/
  baseCRUDPanelBody = (context: BuildPanelEventContext) => {
    return getSchemaTpl('tabs', [
      this.renderPropsTab(context),
      // this.renderStylesTab(context),
      this.renderEventTab(context)
    ]);
  };

  /** Disassemble the basic panel configuration of CURD to facilitate modular combination in different modes*/
  /** Property panel */
  renderPropsTab(context: BuildPanelEventContext) {
    /** Dynamically loaded configuration collection */
    const dc = this.dynamicControls;

    return {
      title: 'Attributes',
      className: 'p-none',
      body: [
        getSchemaTpl(
          'collapseGroup',
          [
            /** Basic configuration category */
            this.renderBasicPropsCollapse(context),
            /** Column settings category */
            isFunction(dc.columns) ? dc.columns(context) : dc.columns,
            /**Search categories*/
            isFunction(dc.filters) ? dc.filters(context) : dc.filters,
            /** Toolbar category */
            isFunction(dc.toolbar) ? dc.toolbar(context) : dc.toolbar,
            /** Pagination category */
            this.renderPaginationCollapse(context),
            /** Other categories*/
            this.renderOthersCollapse(context),
            /** Status category */
            {
              title: 'Status',
              body: [getSchemaTpl('hidden'), getSchemaTpl('visible')]
            },
            this.renderMockPropsCollapse(context)
          ].filter(Boolean)
        )
      ]
    };
  }

  /** Basic configuration */
  renderBasicPropsCollapse(context: BuildPanelEventContext) {
    /** Dynamically loaded configuration collection */
    const dc = this.dynamicControls;
    /** Data source control */
    const generateDSControls = () => {
      /** Data source type*/
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
                  key?.toLowerCase()?.endsWith('fields') ||
                  key?.toLowerCase()?.endsWith('api')
                ) {
                  form.deleteValueByName(key);
                }
              });
              form.deleteValueByName('__fields');
              form.deleteValueByName('__relations');
            }
            return value;
          }
        },
        {schema: context?.schema, sourceKey: 'api'}
      );
      /**Default data source type*/
      const defaultDsType = dsTypeSelector.value;
      /** Data source configuration */
      const dsSettings = this.dsManager.buildCollectionFromBuilders(
        (builder, builderKey) => {
          return {
            type: 'container',
            visibleOn: `this.dsType == null ? '${builderKey}' === '${
              defaultDsType || ApiDSBuilderKey
            }' : this.dsType === '${builderKey}'`,
            body: builder.makeSourceSettingForm({
              feat: 'List',
              renderer: 'crud',
              inScaffold: false,
              sourceSettings: {
                userOrders: true
              }
            }),
            /** Because it will be packaged in container, add a margin-bottom */
            className: 'mb-3'
          };
        }
      );

      return [dsTypeSelector, ...dsSettings];
    };

    return {
      title: 'Basic',
      order: 1,
      body: [
        ...generateDSControls(),
        /** Primary key configuration, TODO: support joint primary key */
        dc?.primaryField?.(context),
        /** Optional configuration, the configuration here will override the configuration in the rowSelection of the underlying Table*/
        getSchemaTpl('switch', {
          name: 'selectable',
          label: tipedLabel(
            'Selectable',
            'Supports selection of table row data after enabling'
          ),
          pipeIn: (value: boolean | undefined, formStore: IFormStore) => {
            if (typeof value === 'boolean') {
              return value;
            }

            const rowSelection = formStore?.data?.rowSelection;
            return rowSelection && isObject(rowSelection);
          }
        }),
        {
          type: 'container',
          className: 'ae-ExtendMore mb-3',
          visibleOn:
            "this.selectable || (this.rowSelection && this.rowSelection?.type !== 'radio')",
          body: [
            getSchemaTpl('switch', {
              name: 'multiple',
              label: 'Multiple selections possible',
              pipeIn: (value: boolean | undefined, formStore: IFormStore) => {
                if (typeof value === 'boolean') {
                  return value;
                }

                const rowSelection = formStore?.data?.rowSelection;

                return rowSelection && isObject(rowSelection)
                  ? rowSelection.type !== 'radio'
                  : false;
              }
            })
          ]
        },
        {
          name: 'placeholder',
          pipeIn: defaultValue('No data yet'),
          type: 'input-text',
          label: 'Placeholder content'
        },
        getSchemaTpl('switch', {
          name: 'syncLocation',
          label: tipedLabel(
            'Synchronize address bar',
            'After turning it on, the query condition data and paging information will be synchronized to the address bar. If there are multiple addresses on the page, it is recommended to keep only one synchronization address bar, otherwise they will affect each other.'
          ),
          pipeIn: defaultValue(true)
        })
      ]
    };
  }

  @autobind
  renderColumnsControl(context: BuildPanelEventContext) {
    const builder = this.dsManager.getBuilderBySchema(context.node.schema);

    return {
      title: 'Column Settings',
      order: 5,
      body: [
        {
          type: 'ae-crud-column-control',
          name: 'columns',
          nodeId: context.id,
          builder
        }
      ]
    };
  }

  @autobind
  renderToolbarCollapse(context: BuildPanelEventContext) {
    const builder = this.dsManager.getBuilderBySchema(context.node.schema);

    return {
      order: 20,
      title: 'Toolbar',
      body: [
        {
          type: 'ae-crud-toolbar-control',
          name: 'headerToolbar',
          nodeId: context.id,
          builder
        }
      ]
    };
  }

  @autobind
  renderFiltersCollapse(context: BuildPanelEventContext) {
    const builder = this.dsManager.getBuilderBySchema(context.node.schema);
    const collection: any[] = [];
    const order = [
      DSFeatureEnum.SimpleQuery,
      DSFeatureEnum.AdvancedQuery,
      DSFeatureEnum.FuzzyQuery
    ] as DSFeatureType[];
    const sortedFeats = sortBy(builder.features, [feat => order.indexOf(feat)]);

    sortedFeats.forEach(feat => {
      if (/Query$/.test(feat)) {
        collection.push({
          type: 'ae-crud-filters-control',
          name:
            feat === DSFeatureEnum.SimpleQuery ||
            feat === DSFeatureEnum.AdvancedQuery
              ? 'filter'
              : feat === DSFeatureEnum.FuzzyQuery
              ? 'headerToolbar'
              : undefined,
          label:
            feat === DSFeatureEnum.SimpleQuery
              ? 'Simple query'
              : feat === DSFeatureEnum.AdvancedQuery
              ? 'Advanced search'
              : 'Fuzzy query',
          nodeId: context.id,
          feat: feat,
          builder
        });
      }
    });

    return collection.length > 0
      ? {
          order: 10,
          title: 'Search settings',
          body: collection
        }
      : undefined;
  }

  /** Pagination category */
  renderPaginationCollapse(context: BuildPanelEventContext) {
    const isPagination = 'this.loadType === "pagination"';
    const isInfinity = 'this.loadType === "more"';

    return {
      order: 30,
      title: 'Paging settings',
      body: [
        {
          label: 'Paging mode',
          type: 'select',
          name: 'loadType',
          options: [
            {
              label: 'None',
              value: ''
            },
            {
              label: 'Pagination',
              value: 'pagination'
            },
            {
              label: 'Load more',
              value: 'more'
            }
          ],
          pipeIn: (data: any) => data || '',
          pipeOut: (data: string) => {
            return data;
          },
          onChange: (value: string, oldValue: any, model: any, form: any) => {
            const schema = cloneDeep(form.data);
            if (oldValue) {
              deepRemove(schema, item => {
                return oldValue === 'more'
                  ? item.behavior === 'loadMore'
                  : item.type === 'pagination';
              });
            }

            if (value) {
              // The newly inserted one is placed at the end of the second column in the footerToolbar by default. If there is no position, it will be placed upwards by default.
              // oldValue && deepRemove(schema);
              const newCompSchema =
                value === 'pagination'
                  ? {
                      type: 'pagination',
                      behavior: 'Pagination',
                      layout: ['total', 'perPage', 'pager'],
                      perPageAvailable: [10, 20, 50, 100]
                    }
                  : {
                      type: 'button',
                      behavior: 'loadMore',
                      label: 'Load more',
                      onEvent: {
                        click: {
                          actions: [
                            {
                              componentId: schema.id,
                              groupType: 'component',
                              actionType: 'loadMore'
                            }
                          ],
                          weight: 0
                        }
                      }
                    };

              this.addFeatToToolbar(schema, newCompSchema, 'footer', 'right');
            }
            form.setValues({
              perPage: value !== 'more' ? undefined : schema.perPage,
              footerToolbar: schema.footerToolbar,
              headerToolbar: schema.headerToolbar
            });
          }
        },
        getSchemaTpl('switch', {
          name: 'loadDataOnce',
          label: 'Front-end paging',
          visibleOn: isPagination
        }),
        getSchemaTpl('switch', {
          name: 'loadDataOnceFetchOnFilter',
          label: tipedLabel(
            'Refresh when filtering',
            'When the front-end paging is turned on, whether to re-request the initialization API after the header filtering'
          ),
          visibleOn: isPagination + ' && this.loadDataOnce'
        }),
        getSchemaTpl('switch', {
          name: 'keepItemSelectionOnPageChange',
          label: tipedLabel(
            'Keep selection',
            "By default, after switching pages or searching, the user's selections will be cleared. After turning on this feature, the user's selections will be retained, and batch operations across pages can be performed."
          ),
          pipeIn: defaultValue(false),
          visibleOn: isPagination
        }),
        getSchemaTpl('switch', {
          name: 'autoJumpToTopOnPagerChange',
          label: tipedLabel(
            'Return to the top after turning the page',
            'When splitting pages, whether to automatically jump to the top'
          ),
          pipeIn: defaultValue(true),
          visibleOn: isPagination
        }),
        {
          name: 'perPage',
          type: 'input-number',
          label: tipedLabel(
            'Number per page',
            'When loading infinitely, set the number of items to load per page according to this option. If left blank, the default is 10'
          ),
          clearValueOnEmpty: true,
          clearable: true,
          pipeIn: defaultValue(10),
          visibleOn: isInfinity
        },
        {
          type: 'button',
          label: 'Click to edit the paging component',
          block: true,
          className: 'mb-1',
          level: 'enhance',
          visibleOn: 'this.loadType === "pagination"',
          onClick: () => {
            const findPage: any = findSchema(
              context?.node?.schema ?? {},
              item =>
                item.type === 'pagination' || item.behavior === 'Pagination',
              'headerToolbar',
              'footerToolbar'
            );

            if (!findPage || !findPage.$$id) {
              toast.error('Pagination component not found');
              return;
            }
            this.manager.setActiveId(findPage.$$id);
          }
        }
      ]
    };
  }

  /** Other categories*/
  renderOthersCollapse(context: BuildPanelEventContext) {
    return {
      order: 25,
      title: 'Other',
      body: [
        {
          type: 'ae-switch-more',
          mode: 'normal',
          formType: 'extend',
          visibleOn: 'this.api',
          label: tipedLabel(
            'Interface polling',
            'Turn on initialization interface polling. Once turned on, the interface will be polled and called at the set time interval'
          ),
          autoFocus: false,
          form: {
            body: [
              {
                type: 'input-number',
                name: 'interval',
                label: tipedLabel(
                  'Polling interval',
                  'Timed refresh interval, unit: ms'
                ),
                step: 10,
                min: 1000
              },
              getSchemaTpl('expressionFormulaControl', {
                name: 'stopAutoRefreshWhen',
                label: tipedLabel(
                  'Stop condition',
                  'The expression for stopping the timed refresh will stop the timed refresh when the condition is met, otherwise the initialization interface will be continuously polled and called.'
                ),
                visibleOn: '!!this.interval'
              }),
              getSchemaTpl('switch', {
                name: 'stopAutoRefreshWhenModalIsOpen',
                label: tipedLabel(
                  'Stop during modal window',
                  'Stop interface polling when there is a pop-up window on the page to avoid interrupting operations'
                )
              })
            ]
          }
        },
        getSchemaTpl('switch', {
          name: 'silentPolling',
          label: tipedLabel(
            'Pull silently',
            'Hide loading animation when refreshing'
          ),
          pipeIn: defaultValue(false)
        })
      ]
    };
  }

  renderMockPropsCollapse(context: BuildPanelEventContext) {
    return {
      title: 'Mock configuration',
      order: 35,
      body: [
        {
          type: 'switch',
          label: tipedLabel(
            'Data Mock',
            'When enabled, when the data source is empty, Mock data will be used'
          ),
          name: 'editorSetting.mock.enable',
          value: true
        },
        {
          type: 'input-number',
          label: tipedLabel(
            'Maximum number of display rows',
            'After setting, data will be displayed according to the set quantity, which can improve the design state rendering speed, reduce the table height, and facilitate layout setting. Set it to <code>-1</code> for no limit'
          ),
          name: 'editorSetting.mock.maxDisplayRows',
          step: 1,
          min: -1,
          resetValue: -1,
          value: DefaultMaxDisplayRows
        }
      ]
    };
  }

  /** Appearance panel */
  renderStylesTab(context: BuildPanelEventContext) {
    return {
      title: 'Appearance',
      className: 'p-none',
      body: getSchemaTpl('collapseGroup', [
        getSchemaTpl('style:classNames', {
          isFormItem: false,
          schema: [
            getSchemaTpl('className', {
              name: 'bodyClassName',
              label: 'Table area'
            }),

            getSchemaTpl('className', {
              name: 'headerToolbarClassName',
              label: 'Top toolbar'
            }),

            getSchemaTpl('className', {
              name: 'footerToolbarClassName',
              label: 'Bottom toolbar'
            })
          ]
        })
      ])
    };
  }

  /** Event panel */
  renderEventTab(context: BuildPanelEventContext) {
    return {
      title: 'Event',
      className: 'p-none',
      body: [
        getSchemaTpl('eventControl', {
          name: 'onEvent',
          ...getEventControlConfig(this.manager, context)
        })
      ]
    };
  }

  /** Rebuild the API */
  panelFormPipeOut = async (schema: any, oldSchema: any) => {
    const entity = schema?.api?.entity;

    if (!entity || schema?.dsType !== ModelDSBuilderKey) {
      return schema;
    }

    const builder = this.dsManager.getBuilderBySchema(schema);
    const observedFields = [
      'api',
      'quickSaveApi',
      'quickSaveItemApi',
      'columns',
      'dsType',
      'primaryField',
      'filter',
      'headerToolbar',
      'footerToolbar',
      'columns'
    ];
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
        renderer: 'crud',
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

  emptyContainer = (align?: 'left' | 'right', body: any[] = []) => ({
    type: 'container',
    body,
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
  });

  emptyFlex = (items: any[] = []) => ({
    type: 'flex',
    items,
    style: {
      position: 'static'
    },
    direction: 'row',
    justify: 'flex-start',
    alignItems: 'stretch'
  });

  // The layout of headerToolbar and footerToolbar is changed to flex wrap container
  addFeatToToolbar(
    schema: any,
    content: any,
    position: 'header' | 'footer',
    align: 'left' | 'right'
  ) {
    const region = `${position}Toolbar`;
    if (
      !schema[region] ||
      isEmpty(schema[region]) ||
      !Array.isArray(schema[region])
    ) {
      const isArr = Array.isArray(schema[region]);
      const newSchema = this.emptyFlex([
        this.emptyContainer(
          'left',
          isArr || !schema[region] ? [] : [schema[region]]
        ),
        this.emptyContainer('right')
      ]);

      (isArr && schema[region].push(newSchema)) ||
        (schema[region] = [newSchema]);
    }

    // Try to put it first on the left, otherwise it can only be placed outside
    try {
      // Prioritize the case where there is no right column to avoid going to catch and causing too many nested layers
      if (align === 'right' && schema[region][0].items.length < 2) {
        schema[region][0].items.push(this.emptyContainer('right'));
      }

      schema[region][0].items[
        align === 'left' ? 0 : schema[region][0].items.length - 1
      ].body.push(content);
    } catch (e) {
      const olds = [...schema[region]];
      schema[region].length = 0;
      schema[region].push(
        this.emptyFlex([
          this.emptyContainer('left', olds),
          this.emptyContainer('right', content)
        ])
      );
    }
  }

  async buildDataSchemas(
    node: EditorNodeType,
    region?: EditorNodeType,
    trigger?: EditorNodeType
  ) {
    const child: EditorNodeType = node.children.find(
      item => !!~['table2', 'cards', 'list'].indexOf(item.type)
    );

    if (!child?.info?.plugin?.buildDataSchemas) {
      return;
    }

    const tmpSchema = await child.info.plugin.buildDataSchemas?.(
      child,
      region,
      trigger,
      node
    );

    const childDataSchema = {
      ...tmpSchema,
      ...(tmpSchema?.$id ? {} : {$id: `${child.id}-${child.type}`})
    };

    const items =
      childDataSchema?.properties?.rows ?? childDataSchema?.properties?.items;
    const schema: any = {
      $id: 'crud2',
      type: 'object',
      properties: {
        items: {
          ...items,
          title: 'All data'
        },
        selectedItems: {
          ...items,
          title: 'Selected data'
        },
        unSelectedItems: {
          ...items,
          title: 'Unselected data'
        },
        page: {
          type: 'number',
          title: 'Current page number'
        },
        total: {
          type: 'number',
          Title: 'Total number of data items'
        }
      }
    };

    return schema;
  }

  async getAvailableContextFields(
    scopeNode: EditorNodeType,
    node: EditorNodeType,
    region?: EditorNodeType
  ) {
    // First get the available fields from the data source
    const builder = this.dsManager.getBuilderBySchema(scopeNode.schema);

    if (builder && scopeNode.schema.api) {
      return builder.getAvailableContextFields(
        {
          schema: scopeNode.schema,
          sourceKey: 'api',
          feat: scopeNode.schema?.feat ?? 'List'
        },
        node
      );
    }
  }

  generateScaffold(mode: 'table2' | 'cards' | 'list') {
    let schema: any;

    if (mode === 'table2') {
      schema = {
        type: 'crud2',
        mode: 'table2',
        columns: [
          {
            name: 'id',
            title: 'ID',
            type: 'container',
            body: [
              {
                type: 'text'
              }
            ]
          },
          {
            name: 'engine',
            title: 'Example',
            type: 'container',
            body: [
              {
                type: 'text'
              }
            ]
          }
        ]
      };
    } else if (mode === 'cards') {
      schema = {
        type: 'crud2',
        mode: 'cards',
        card: {
          type: 'card2',
          body: [
            {
              type: 'container',
              body: [
                {
                  type: 'tpl',
                  tpl: 'Title',
                  inline: false,
                  style: {
                    marginTop: '0',
                    marginBottom: '0',
                    paddingTop: '',
                    paddingBottom: ''
                  },
                  wrapperComponent: 'h2'
                },
                {
                  type: 'form',
                  body: [
                    {
                      type: 'static-tpl',
                      label: 'field',
                      tpl: 'content'
                    }
                  ]
                },
                {
                  type: 'divider'
                },
                {
                  type: 'button-group'
                }
                // {
                //   type: 'tpl',
                // tpl: 'Subtitle content',
                // inline: false,
                //   wrapperComponent: '',
                //   style: {
                //     color: '#9b9b9b',
                //     marginTop: '0',
                //     marginBottom: '0'
                //   }
                // }
              ]
              // style: {
              //   borderStyle: 'solid',
              //   borderColor: '#ebebeb',
              //   borderWidth: '1px',
              //   'borderRadius': '5px',
              //   'paddingTop': '10px',
              //   'paddingRight': '10px',
              //   'paddingBottom': '0',
              //   'paddingLeft': '10px'
              // }
            }
          ]
        }
      };
    } else if (mode === 'list') {
      schema = {
        type: 'crud2',
        mode: 'list',
        listItem: {
          body: [
            {
              type: 'container',
              body: [
                {
                  type: 'tpl',
                  tpl: 'Title',
                  inline: false,
                  style: {
                    marginTop: '0',
                    marginBottom: '0',
                    paddingTop: '',
                    paddingBottom: ''
                  },
                  wrapperComponent: 'h2'
                },
                {
                  type: 'tpl',
                  tpl: 'Subtitle content',
                  inline: false,
                  wrapperComponent: '',
                  style: {
                    color: '#9b9b9b',
                    marginTop: '0',
                    marginBottom: '0'
                  }
                }
              ]
            }
          ]
        }
      };
    }

    return schema;
  }

  /** Generate preview Schema */
  generatePreviewSchema = (mode: 'table2' | 'cards' | 'list') => {
    const columnSchema: any = [
      {
        label: 'Engine',
        name: 'engine'
      },
      {
        label: 'Browser',
        name: 'browser'
      },
      {
        name: 'version',
        label: 'Version'
      }
    ];

    const actionSchema = {
      type: 'button',
      level: 'link',
      icon: 'fa fa-eye',
      actionType: 'dialog',
      dialog: {
        title: 'View details',
        body: {
          type: 'form',
          body: [
            {
              label: 'Engine',
              name: 'engine',
              type: 'static'
            },
            {
              name: 'browser',
              label: 'Browser',
              type: 'static'
            },
            {
              name: 'version',
              label: 'Version',
              type: 'static'
            }
          ]
        }
      }
    };

    const itemSchema =
      mode === 'cards'
        ? {card: {body: columnSchema, actions: actionSchema}}
        : mode === 'list'
        ? {
            listItem: {
              body: {
                type: 'hbox',
                columns: columnSchema
              }
            },
            actions: actionSchema
          }
        : {
            columns: columnSchema.concat([
              {
                name: 'operation',
                title: 'Operation',
                buttons: [actionSchema]
              }
            ])
          };

    return {
      type: 'crud2',
      mode,
      source: '$items',
      data: {
        items: [
          {
            engine: 'Trident',
            browser: 'Internet Explorer 4.0',
            platform: 'Win 95+',
            version: '4',
            grade: 'X'
          }
        ]
      },
      ...itemSchema
    };
  };
}

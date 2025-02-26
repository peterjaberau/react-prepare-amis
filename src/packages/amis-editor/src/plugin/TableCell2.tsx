import React, {StrictMode} from 'react';
import get from 'lodash/get';
import flattenDeep from 'lodash/flattenDeep';
import {Button, Icon} from '@/packages/amis/src';
import {dataMapping, getVariable, isObject} from '@/packages/amis-core/src';
import {
  BasePlugin,
  BasicRendererInfo,
  registerEditorPlugin,
  RendererInfoResolveEventContext,
  ReplaceEventContext,
  PluginEvent,
  AfterBuildPanelBody,
  defaultValue,
  getSchemaTpl,
  tipedLabel,
  BaseEventContext
} from '@/packages/amis-editor-core/src';
import {remarkTpl} from '../component/BaseControl';

import type {DSField} from '../builder';
import {schemaToArray} from '../util';
import omit from 'lodash/omit';

export type TableCell2DynamicControls = Partial<
  Record<
    | 'name'
    | 'key'
    | 'sorter'
    | 'relationBuildSetting'
    | 'searchable'
    | 'quickEdit'
    | 'popover',
    (context: BaseEventContext) => any
  >
>;

export class TableCell2Plugin extends BasePlugin {
  static id = 'TableCell2Plugin';

  rendererName = 'cell-field';

  panelTitle = 'Column Configuration';

  panelIcon = 'fa fa-columns';

  panelJustify = true;

  /** Is it an operation column? */
  _isOpColumn?: boolean;

  /** NodeStore needs to add some information when building*/
  getRendererInfo(
    context: RendererInfoResolveEventContext
  ): BasicRendererInfo | void {
    const {renderer, schema} = context;

    if (this.rendererName === renderer?.name) {
      return {
        name: schema.title ? `<${schema.title}>Column` : 'Anonymous column',
        $schema: '/schemas/TableSchema.json',
        multifactor: true,
        wrapperResolve: (dom: HTMLDivElement) => {
          //Fix this structure. If you change it in amis, you have to change it here too.
          const parent = dom.parentElement?.parentElement;
          const col = parent?.getAttribute('data-col');
          const wrapper = dom.closest('table')!.parentElement?.parentElement;
          return [].slice.call(
            wrapper?.querySelectorAll(
              `th[data-col="${col}"],
              td[data-col="${col}"]`
            )
          );
        }
        // filterProps: (props: any) => {
        //   props = JSONPipeOut(props, true);
        //   return props;
        // }
      };
    }

    return super.getRendererInfo(context);
  }

  /** Update the event before the renderer, or right-click to paste the configuration*/
  beforeReplace(event: PluginEvent<ReplaceEventContext>) {
    const context = event.context;

    // Keep label and name values ​​when replacing fields.
    if (context.info.plugin === this && context.data) {
      context.data.title = context.data.title || context.schema.title;
      context.data.key = context.data.key || context.schema.key;
    }
  }

  afterBuildPanelBody(event: PluginEvent<AfterBuildPanelBody>) {
    const {context, data} = event.context;
    if (
      !context.node.parent?.parent?.type ||
      context.node.parent.parent.type !== 'table2'
    ) {
      return;
    }

    // @ts-ignore
    const base: Array<{
      sameName?: string;
      [propName: string]: any;
    }> = [
      // context.node.info.plugin.withDataSource === false
      //   ? false
      //   : {
      //       sameName: context.info.renderer.isFormItem ? 'name' : undefined,
      //       name: 'name',
      //       type: 'ae-DataBindingControl',
      // label: 'column field',
      //       onBindingChange(
      //         field: DSField,
      //         onBulkChange: (value: any) => void
      //       ) {
      //         const schema = field?.resolveColumnSchema?.('List') || {
      //           title: field.label
      //         };
      // onBulkChange(schema);
      //       }
      //     },
      {
        sameName: context.info.renderer.isFormItem ? 'name' : undefined,
        name: 'name',
        type: 'ae-DataBindingControl',
        label: 'column field',
        onBindingChange(field: DSField, onBulkChange: (value: any) => void) {
          const schema = field?.resolveColumnSchema?.('List') || {
            title: field.label
          };
          onBulkChange(schema);
        }
      },
      {
        sameName: context.info.renderer.isFormItem ? 'label' : undefined,
        name: 'title',
        label: 'column title',
        type: 'input-text'
      },

      remarkTpl({
        name: 'remark',
        label: 'Title Tip',
        labelRemark: 'Show hint next to title'
      }),

      {
        name: 'placeholder',
        type: 'input-text',
        label: tipedLabel(
          'Placeholder tip',
          'Use this to display when there is no value.'
        ),
        value: '-'
      }
    ].filter(Boolean);
    const advanced = [
      getSchemaTpl('switch', {
        name: 'sorter',
        label: tipedLabel(
          'Sortable',
          'After turning it on, you can sort by the current column, and the interface type will add sorting parameters.'
        )
      }),

      getSchemaTpl('switch', {
        name: 'searchable',
        label: 'Searchable',
        pipeIn: (value: any) => !!value
      }),

      {
        visibleOn: 'this.searchable',
        name: 'searchable',
        asFormItem: true,
        label: false,
        children: ({value, onChange, data}: any) => {
          if (value === true) {
            value = {};
          } else if (typeof value === 'undefined') {
            value = getVariable(data, 'searchable');
          }
        }
      }
    ];
  }

  protected _dynamicControls: TableCell2DynamicControls = {
    /** Field configuration */
    name: () =>
      getSchemaTpl('formItemName', {
        name: 'name',
        label: 'column field',
        visibleOn: 'this.name !== undefined || this.key === undefined'
      }),
    /** Field configuration, compatible with key */
    key: () =>
      getSchemaTpl('formItemName', {
        name: 'key',
        label: 'column field',
        visibleOn: 'this.name === undefined && this.key'
      }),
    /** Sorting configuration */
    sorter: () =>
      getSchemaTpl('switch', {
        name: 'sorter',
        hidden: this._isOpColumn,
        label: tipedLabel(
          'Sortable',
          'After turning it on, you can sort by the current column, and the interface type will add sorting parameters.'
        )
      }),
    /**Searchable*/
    searchable: () => {
      return [
        getSchemaTpl('switch', {
          name: 'searchable',
          label: 'Searchable',
          hidden: this._isOpColumn,
          pipeIn: (value: any) => !!value
        }),
        {
          name: 'searchable',
          visibleOn: 'this.searchable',
          asFormItem: true,
          label: false,
          children: ({value, onChange, data}: any) => {
            if (value === true) {
              value = {};
            } else if (typeof value === 'undefined') {
              value = getVariable(data, 'searchable');
            }
            const originMode = value.mode;
            value = {
              ...value,
              type: 'form',
              mode: 'normal',
              wrapWithPanel: false,
              body: value?.body?.length
                ? value.body
                : [
                    {
                      type: 'input-text',
                      name: data.key
                    }
                  ]
            };

            delete value.mode;
            // It seems that todo multiple quick edit form modes can only be edited in code mode.
            return (
              <Button
                className="w-full flex flex-col items-center"
                onClick={() => {
                  this.manager.openSubEditor({
                    title: 'Configure column search type',
                    value: value,
                    onChange: value =>
                      onChange(
                        {
                          ...value,
                          mode: originMode
                        },
                        'searchable'
                      )
                  });
                }}
              >
                <span className="inline-flex items-center">
                  <Icon icon="edit" className="mr-1 w-3" />
                  Configure column search type
                </span>
              </Button>
            );
          }
        }
      ];
    },
    /** Quick View */
    popover: () => {
      return {
        name: 'popOver',
        label: 'Pop-up box',
        type: 'ae-switch-more',
        hidden: this._isOpColumn,
        bulk: false,
        mode: 'normal',
        formType: 'extend',
        defaultData: {
          mode: 'popOver',
          body: [
            {
              type: 'tpl',
              tpl: 'Popup box content',
              wrapperComponent: ''
            }
          ]
        },
        form: {
          body: [
            {
              name: 'mode',
              type: 'button-group-select',
              label: 'mode',
              value: 'popOver',
              options: [
                {
                  label: 'prompt',
                  value: 'popOver'
                },
                {
                  label: 'Popup',
                  value: 'dialog'
                },
                {
                  label: 'Drawer',
                  value: 'drawer'
                }
              ]
            },
            getSchemaTpl('formItemSize', {
              name: 'size',
              clearValueOnHidden: true,
              visibleOn: 'mode !== "popOver"'
            }),
            {
              type: 'select',
              name: 'position',
              label: 'Popup location',
              visibleOn: 'mode === "popOver"',
              options: [
                'center',
                'left-top',
                'right-top',
                'left-bottom',
                'right-bottom'
              ],
              clearValueOnHidden: true
            },
            {
              name: 'trigger',
              type: 'button-group-select',
              label: 'Trigger method',
              options: [
                {
                  label: 'click',
                  value: 'click'
                },
                {
                  label: 'Mouse move in',
                  value: 'hover'
                }
              ],
              pipeIn: defaultValue('click')
            },
            getSchemaTpl('switch', {
              name: 'showIcon',
              label: 'Show icon'
            }),
            {
              type: 'input-text',
              name: 'title',
              label: 'Title'
            },
            {
              name: 'body',
              asFormItem: true,
              label: false,
              children: ({value: originValue, onChange}: any) => {
                return (
                  <Button
                    className="w-full flex flex-col items-center"
                    onClick={() => {
                      this.manager.openSubEditor({
                        title: 'Configure pop-up box',
                        value: schemaToArray(originValue),
                        slot: {
                          type: 'container',
                          body: '$$'
                        },
                        onChange
                      });
                    }}
                  >
                    <span className="inline-flex items-center">
                      <Icon icon="edit" className="mr-1 w-3" />
                      Configure pop-up boxes
                    </span>
                  </Button>
                );
              }
            }
          ]
        }
      };
    },
    /** Quick Edit */
    quickEdit: context => {
      return {
        name: 'quickEdit',
        label: tipedLabel(
          'Quick Edit',
          'Additional widgets on the left or right side of the input box'
        ),
        type: 'ae-switch-more',
        hidden: this._isOpColumn,
        mode: 'normal',
        bulk: false,
        formType: 'extend',
        defaultData: {
          mode: 'popOver'
        },
        form: {
          body: [
            {
              name: 'mode',
              type: 'button-group-select',
              label: 'mode',
              value: 'popOver',
              options: [
                {
                  label: 'Pull down',
                  value: 'popOver'
                },
                {
                  label: 'embedded',
                  value: 'inline'
                }
              ]
            },

            getSchemaTpl('icon', {
              name: 'icon'
            }),

            getSchemaTpl('switch', {
              name: 'saveImmediately',
              label: tipedLabel(
                'Save changes immediately',
                'After turning it on, modifications are submitted immediately, rather than batch submission. You need to configure a quick save interface to submit data.'
              ),
              pipeIn: (value: any) => !!value
            }),

            getSchemaTpl('apiControl', {
              label: 'Save the interface immediately',
              description:
                'By default, the table\'s "Quick Save Single Line" interface is used. If a separate immediate save configuration interface is given, local configuration is used first. ',
              name: 'saveImmediately.api',
              visibleOn: 'this.saveImmediately'
            }),

            {
              asFormItem: true,
              label: false,
              children: ({onBulkChange}: any) => {
                // It seems that todo multiple quick edit form modes can only be edited in code mode.
                return (
                  <Button
                    className="w-full flex flex-col items-center"
                    onClick={() => {
                      let data = context.node.schema.quickEdit
                        ? omit(context.node.schema.quickEdit, [
                            'saveImmediately',
                            'icon',
                            'mode'
                          ])
                        : {};
                      let originValue = data?.type
                        ? ['container', 'wrapper'].includes(data.type)
                          ? data
                          : {
                              // The container exists in the schema, just use your own
                              type: 'container',
                              body: [data]
                            }
                        : {
                            type: 'container',
                            body: [
                              {
                                type: 'input-text',
                                name: context.node.schema.name
                              }
                            ]
                          };

                      this.manager.openSubEditor({
                        title: 'Configure quick edit type',
                        value: originValue,
                        onChange: value => onBulkChange(value)
                      });
                    }}
                  >
                    <span className="inline-flex items-center">
                      <Icon icon="edit" className="mr-1 w-3" />
                      Configuring the Edit Form
                    </span>
                  </Button>
                );
              }
            }
          ]
        }
      };
    }
  };

  /** Controls that need dynamic control*/
  get dynamicControls() {
    return this._dynamicControls;
  }

  set dynamicControls(controls: TableCell2DynamicControls) {
    if (!controls || !isObject(controls)) {
      throw new Error(
        '[amis-editor][TableCell2Plugin] The value of dynamicControls must be an object'
      );
    }

    this._dynamicControls = {...this._dynamicControls, ...controls};
  }

  panelBodyCreator = (context: BaseEventContext) => {
    const manager = this.manager;
    const dc = this.dynamicControls;
    this._isOpColumn = context?.schema?.type === 'operation';

    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl(
          'collapseGroup',
          [
            {
              title: 'Data Source',
              hidden: this._isOpColumn,
              body: flattenDeep([
                /** Field configuration */
                dc?.name?.(context),
                /** Field configuration, compatible with key */
                dc?.key?.(context),
                {
                  name: 'title',
                  label: 'column title',
                  type: 'input-text'
                },
                remarkTpl({
                  name: 'remark',
                  label: 'Title Tip',
                  labelRemark: 'Show hint next to title'
                }),
                {
                  name: 'placeholder',
                  type: 'input-text',
                  label: tipedLabel(
                    'Placeholder tip',
                    'Use this to display when there is no value.'
                  ),
                  value: '-'
                }
              ]).filter(Boolean)
            },
            dc?.relationBuildSetting?.(context),
            /** Action bar button configuration */
            {
              title: 'Operation button',
              hidden: !this._isOpColumn,
              body: [
                {
                  type: 'ae-feature-control',
                  strictMode: false, // Note that you need to add this to get form data changes in time
                  label: false,
                  manager,
                  addable: true,
                  sortable: true,
                  removeable: true,
                  features: () => {
                    const node = manager.store.getNodeById(context.id);

                    return (node?.schema?.buttons ?? []).map(
                      (item: any, index: number) => ({
                        label: item.label,
                        value: item.$$id || '',
                        remove: (schema: any) => {
                          if (schema?.buttons?.length) {
                            schema.buttons.splice(index, 1);
                          }
                        }
                      })
                    );
                  },
                  goFeatureComp: (feat: any) => feat.value,
                  onSort: (schema: any, e: any) => {
                    if (schema?.buttons?.length > 1) {
                      schema.buttons[e.oldIndex] = schema.buttons.splice(
                        e.newIndex,
                        1,
                        schema.buttons[e.oldIndex]
                      )[0];
                    }
                  },
                  customAction: (props: any) => {
                    const {onBulkChange, schema} = props;

                    return {
                      type: 'button',
                      label: 'Add button',
                      level: 'enhance',
                      className: 'ae-FeatureControl-action',
                      onClick: () => {
                        schema.buttons.push({
                          label: 'Add button',
                          level: 'link'
                        });
                        onBulkChange(schema);
                      }
                    };
                  }
                }
              ]
            },
            {
              title: 'Column Settings',
              body: flattenDeep([
                {
                  type: 'ae-columnWidthControl',
                  name: 'width',
                  label: false,
                  formLabel: 'column width'
                },
                {
                  type: 'select',
                  name: 'align',
                  label: 'Alignment',
                  hidden: this._isOpColumn,
                  options: [
                    {label: 'left', value: 'left'},
                    {label: 'center', value: 'center'},
                    {label: 'right', value: 'right'}
                  ]
                },
                {
                  type: 'select',
                  name: 'headerAlign',
                  label: 'header alignment',
                  pipeIn: defaultValue(''),
                  options: [
                    {label: 'Reuse alignment', value: ''},
                    {label: 'left', value: 'left'},
                    {label: 'center', value: 'center'},
                    {label: 'right', value: 'right'}
                  ]
                },
                {
                  type: 'select',
                  name: 'vAlign',
                  label: 'Vertical alignment',
                  pipeIn: defaultValue('middle'),
                  options: [
                    {label: 'Top alignment', value: 'top'},
                    {label: 'vertical center', value: 'middle'},
                    {label: 'Bottom alignment', value: 'bottom'}
                  ]
                },
                {
                  name: 'textOverflow',
                  type: 'button-group-select',
                  label: 'Text exceeds processing limit',
                  size: 'xs',
                  inputClassName: 'mt-1',
                  pipeIn: defaultValue('default'),
                  options: [
                    {
                      label: 'Default',
                      value: 'default'
                    },
                    {
                      label: 'Overflow hidden',
                      value: 'ellipsis'
                    },
                    {
                      label: 'Cancel line break',
                      value: 'noWrap'
                    }
                  ]
                },
                getSchemaTpl('switch', {
                  name: 'className',
                  label: tipedLabel(
                    'Allow any character to break the line',
                    'If this option is turned on, line break processing will break at any letter, long English words or long English characters will be cut off, such as URL links'
                  ),
                  pipeIn: (value: any) =>
                    typeof value === 'string' && /\word\-break\b/.test(value),
                  pipeOut: (value: any, originValue: any) =>
                    (value ? 'word-break ' : '') +
                    (originValue || '').replace(/\bword\-break\b/g, '').trim()
                }),
                {
                  type: 'select',
                  name: 'fixed',
                  label: 'Fix the current column',
                  hidden: this._isOpColumn,
                  options: [
                    {label: 'Not fixed', value: false},
                    {label: 'Fixed on the left', value: 'left'},
                    {label: 'Fixed on the right', value: 'right'}
                  ]
                },
                {
                  type: 'ae-Switch-More',
                  mode: 'normal',
                  name: 'copyable',
                  label: 'Copyable',
                  trueValue: true,
                  formType: 'extend',
                  bulk: false,
                  form: {
                    body: [
                      {
                        name: 'content',
                        type: 'ae-formulaControl',
                        label: 'Copy content'
                      }
                    ]
                  }
                },
                /** Sorting settings */
                dc?.sorter?.(context),
                /**Searchable*/
                dc?.searchable?.(context),
                /** Quick View */
                dc?.popover?.(context),
                /** Quick Edit */
                dc?.quickEdit?.(context)
              ]).filter(Boolean)
            }
          ].filter(Boolean)
        )
      }
      // {
      // title: 'Appearance',
      //   body: [
      //     getSchemaTpl('className'),
      //     getSchemaTpl('className', {
      //       name: 'innerClassName',
      // label: 'internal CSS class name'
      //     })
      //   ]
      // }
    ]);
  };
}

registerEditorPlugin(TableCell2Plugin);

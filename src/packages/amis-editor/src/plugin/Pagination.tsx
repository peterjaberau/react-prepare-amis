import {
  BasePlugin,
  RegionConfig,
  BaseEventContext,
  tipedLabel,
  defaultValue,
  getSchemaTpl,
  RendererPluginEvent,
  registerEditorPlugin
} from 'amis-editor-core';
import sortBy from 'lodash/sortBy';
import {getEventControlConfig} from '../renderer/event-control/helper';

export class PaginationPlugin extends BasePlugin {
  static id = 'PaginationPlugin';
  // Associated renderer name
  rendererName = 'pagination';
  $schema = '/schemas/PaginationSchema.json';

  // Component name
  name = 'Pagination component';
  isBaseComponent = true;
  description =
    'Pagination component, which can display the list in pages to improve page performance';
  docLink = '/amis/zh-CN/components/pagination';
  tags = ['show'];
  icon = 'fa fa-window-minimize';
  lastLayoutSetting = ['pager'];
  layoutOptions = [
    {text: 'Total', value: 'total', checked: false},
    {text: 'Number of items per page', value: 'perPage', checked: false},
    {text: 'Pagination', value: 'pager', checked: true},
    {text: 'Jump to page', value: 'go', checked: false}
  ];
  scaffold = {
    type: 'pagination',
    mode: 'normal',
    layout: ['pager'],
    activePage: 1,
    lastPage: 1,
    total: 1,
    hasNext: false,
    disabled: false,
    perPageAvailable: [10, 20, 50, 100],
    perPage: 10,
    maxButtons: 7,
    ellipsisPageGap: 5
  };
  previewSchema = {
    ...this.scaffold
  };
  panelTitle = 'Pager';

  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: 'value change',
      description: 'Input content changes',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                page: {
                  type: 'number',
                  title: 'Current page value'
                },
                perPage: {
                  type: 'number',
                  title: 'Number of records displayed per page'
                }
              },
              description:
                'The current data domain, you can read the corresponding value through the field name'
            }
          }
        }
      ]
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
              {
                name: 'mode',
                label: 'mode',
                type: 'button-group-select',
                size: 'sm',
                pipeIn: defaultValue('normal'),
                options: [
                  {
                    label: 'Default',
                    value: 'normal'
                  },
                  {
                    label: 'Simple',
                    value: 'simple'
                  }
                ]
              },
              // {
              //   name: 'hasNext',
              // label: 'Is there a next page',
              //   mode: 'row',
              //   inputClassName: 'inline-flex justify-between flex-row-reverse',
              //   type: 'switch',
              //   visibleOn: 'this.mode === "simple"'
              // },
              // {
              //   name: 'activePage',
              // label: tipedLabel('Current page', 'Supports using \\${xxx} to obtain variables'),
              //   type: 'input-text'
              // },
              // {
              //   name: 'lastPage',
              // label: tipedLabel('Last page number', 'Supports using \\${xxx} to obtain variables'),
              //   type: 'input-text',
              //   visibleOn: 'this.mode === "normal"'
              // },
              // {
              //   name: 'total',
              // label: tipedLabel('Total number', 'Supports the use of \\${xxx} to obtain variables'),
              //   type: 'input-text',
              //   visibleOn: 'this.mode === "normal"'
              // },
              getSchemaTpl('combo-container', {
                name: 'layout',
                type: 'combo',
                label: tipedLabel(
                  'Enable feature',
                  'Selecting this option enables the function, and you can drag and drop to adjust the order of the functions'
                ),
                visibleOn: '!this.mode || this.mode === "normal"',
                mode: 'normal',
                multiple: true,
                multiLine: false,
                addable: false,
                removable: false,
                draggable: true,
                editable: false,
                minLength: 1,
                tabsStyle: 'inline',
                formClassName: 'ae-pagination-layout-item',
                items: [
                  {
                    type: 'checkbox',
                    name: 'checked',
                    inputClassName: 'p-t-none mt-1.5'
                  },
                  {
                    type: 'tpl',
                    name: 'text',
                    className: 'inline-block pt-1.5'
                  }
                ],
                pipeIn: (value: any) => {
                  if (typeof value === 'string') {
                    value = (value as string).split(',');
                  } else if (!value || !Array.isArray(value)) {
                    value = this.lastLayoutSetting;
                  }

                  return sortBy(
                    this.layoutOptions.map(op => ({
                      ...op,
                      checked: value.includes(op.value)
                    })),
                    [
                      item => {
                        const idx = value.findIndex(
                          (v: string) => v === item.value
                        );
                        return ~idx ? idx : Infinity;
                      }
                    ]
                  );

                  // return this.layoutOptions.map(v => ({
                  // ...in,
                  //   checked: value.includes(v.value)
                  // }));
                },
                pipeOut: (value: any[]) => {
                  this.lastLayoutSetting = value
                    .filter(v => v.checked)
                    .map(v => v.value);
                  return this.lastLayoutSetting.concat();
                }
              }),
              // {
              //   name: 'showPerPage',
              // label: 'Show the number of items per page',
              //   mode: 'row',
              //   inputClassName: 'inline-flex justify-between flex-row-reverse',
              //   type: 'switch',
              //   visibleOn: 'this.mode === "normal"'
              // },
              getSchemaTpl('combo-container', {
                name: 'perPageAvailable',
                type: 'combo',
                label: 'Number of items per page',
                visibleOn:
                  '(!this.mode || this.mode === "normal") && this.layout && this.layout.includes("perPage")',
                mode: 'normal',
                multiple: true,
                multiLine: false,
                addable: true,
                removable: true,
                draggable: true,
                editable: true,
                minLength: 1,
                tabsStyle: 'inline',
                addButtonClassName: 'm-b-sm',
                items: [
                  {
                    type: 'input-number',
                    name: 'value',
                    min: 1
                  }
                ],
                pipeIn: (value: any[]) => {
                  return value?.map(v => ({value: v})) || [10];
                },
                pipeOut: (value: any[]) => {
                  const pages = value.map(v => v.value);
                  return pages.map(
                    page => page || Math.max(...pages.filter(Boolean)) + 5
                  );
                }
              }),
              {
                name: 'perPage',
                type: 'input-number',
                label: 'Default number of entries per page',
                visibleOn:
                  '(!this.mode || this.mode === "normal") && this.layout?.includes("perPage")'
              },
              {
                name: 'maxButtons',
                label: tipedLabel(
                  'Maximum number of buttons',
                  'How many paging buttons can be displayed at most, the minimum is 5 and the maximum is 20'
                ),
                type: 'input-number',
                min: 5,
                max: 20,
                pipeOut: (value: any) => value || 5,
                visibleOn: '!this.mode || this.mode === "normal"'
              },
              {
                name: 'ellipsisPageGap',
                label: 'Number of multi-page jumps',
                type: 'input-number',
                min: 1,
                pipeIn: (value: any) => value || 5,
                pipeOut: (value: any) => value || 5,
                visibleOn: 'this.mode && this.mode === "normal"'
              }
            ]
          },
          {
            title: 'Status',
            body: [
              getSchemaTpl('disabled'),
              getSchemaTpl('hidden'),
              getSchemaTpl('visible')
            ]
          }
        ])
      },
      {
        title: 'Appearance',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: [
              {
                type: 'select',
                name: 'size',
                label: 'Size',
                value: '',
                pipeIn: defaultValue('md'),
                options: [
                  {
                    label: 'Normal',
                    value: 'md'
                  },

                  {
                    label: 'Micro',
                    value: 'sm'
                  }
                ]
              }
            ]
          },
          getSchemaTpl('style:classNames', {isFormItem: false})
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
    ]);
  };

  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: 'Content area'
    }
  ];
}

registerEditorPlugin(PaginationPlugin);

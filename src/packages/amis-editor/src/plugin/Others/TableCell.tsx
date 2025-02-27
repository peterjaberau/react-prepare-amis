import {Button} from '@/packages/amis-ui/src';
import React from 'react';
import get from 'lodash/get';
import {
  getI18nEnabled,
  registerEditorPlugin,
  tipedLabel
} from '@/packages/amis-editor-core/src';
import {
  BasePlugin,
  BasicRendererInfo,
  BaseEventContext,
  RendererInfoResolveEventContext,
  ReplaceEventContext,
  PluginEvent
} from '@/packages/amis-editor-core/src';
import {defaultValue, getSchemaTpl} from '@/packages/amis-editor-core/src';
import {getVariable} from '@/packages/amis-core/src';

export class TableCellPlugin extends BasePlugin {
  static id = 'TableCellPlugin';
  panelTitle = 'Column Configuration';
  panelIcon = 'fa fa-columns';
  panelBodyCreator = (context: BaseEventContext) => {
    const i18nEnabled = getI18nEnabled();
    return [
      getSchemaTpl('tabs', [
        {
          title: 'General',
          body: [
            /*{
              children: (
                <Button
                  size="sm"
                  level="info"
                  className="m-b"
                  block
                  onClick={this.exchangeRenderer.bind(this, context.id)}
                >
                  Changing the renderer type
                </Button>
              )
            },*/
            getSchemaTpl('label', {
              label: 'column name'
            }),

            getSchemaTpl('formItemName', {
              label: 'Bound field name'
            }),

            getSchemaTpl('tableCellRemark'),

            getSchemaTpl('tableCellPlaceholder'),

            getSchemaTpl('switch', {
              name: 'sortable',
              label: 'Is it sortable',
              description:
                'After turning it on, you can sort by the current column (backend sorting).'
            })
          ]
        },
        {
          title: 'Advanced',
          body: [
            {
              name: 'groupName',
              label: 'column group name',
              type: i18nEnabled ? 'input-text-i18n' : 'input-text',
              description:
                'When the group names of multiple columns are set to the same, the table will display the super header above the displayed header, <a href="https://baidu.github.io/amis/zh-CN/components/table#%E8%B6%85%E7%BA%A7%E8%A1%A8%E5%A4%B4" target="_blank">Example</a>'
            },

            getSchemaTpl('switch', {
              name: 'quickEdit',
              label: 'Enable quick edit',
              isChecked: (e: any) => {
                const {data, name} = e;
                return !!get(data, name);
              },
              pipeIn: (value: any) => !!value
            }),

            {
              visibleOn: 'this.quickEdit',
              name: 'quickEdit.mode',
              type: 'button-group-select',
              value: 'popOver',
              label: 'Quick edit mode',
              size: 'xs',
              mode: 'inline',
              className: 'w-full',
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
              name: 'quickEdit.icon'
            }),

            getSchemaTpl('switch', {
              name: 'quickEdit.saveImmediately',
              label: 'Save immediately',
              visibleOn: 'this.quickEdit',
              description:
                'After turning it on, modifications are submitted immediately, rather than marking modifications and submitting them in batches.',
              descriptionClassName: 'help-block m-b-none',
              pipeIn: (value: any) => !!value
            }),

            getSchemaTpl('apiControl', {
              label: 'Save the interface immediately',
              description:
                'Whether to give a separate immediate save configuration interface, if not configured, the quickSaveItemApi will be used by default. ',
              name: 'quickEdit.saveImmediately.api',
              visibleOn: 'this.quickEdit && this.quickEdit.saveImmediately'
            }),

            {
              visibleOn: 'this.quickEdit',
              name: 'quickEdit',
              asFormItem: true,
              children: ({value, onChange, data}: any) => {
                if (value === true) {
                  value = {};
                } else if (typeof value === 'undefined') {
                  value = getVariable(data, 'quickEdit');
                }
                value = {...value};
                const originMode = value.mode || 'popOver';
                if (value.mode) {
                  delete value.mode;
                }
                const originSaveImmediately = value.saveImmediately;
                if (value.saveImmediately) {
                  delete value.saveImmediately;
                }
                value =
                  value.body && ['container', 'wrapper'].includes(value.type)
                    ? {
                        // The container exists in the schema, just use your own
                        type: 'wrapper',
                        body: [],
                        ...value
                      }
                    : {
                        // The container does not exist in the schema, and a layer needs to be wrapped when opening the sub-editor
                        type: 'wrapper',
                        body: [
                          {
                            type: 'input-text',
                            name: data.name,
                            ...value
                          }
                        ]
                      };

                // It seems that todo multiple quick edit form modes can only be edited in code mode.
                return (
                  <Button
                    level="info"
                    className="m-b"
                    size="sm"
                    block
                    onClick={() => {
                      this.manager.openSubEditor({
                        title: 'Configure quick edit type',
                        value: value,
                        onChange: value =>
                          onChange(
                            {
                              ...value,
                              mode: originMode,
                              saveImmediately: originSaveImmediately
                            },
                            'quickEdit'
                          )
                      });
                    }}
                  >
                    Configuring Quick Edit
                  </Button>
                );
              }
            },

            getSchemaTpl('switch', {
              name: 'popOver',
              label: 'Enable view more displays',
              pipeIn: (value: any) => !!value
            }),

            {
              name: 'popOver.mode',
              label: 'View more pop-up modes',
              type: 'select',
              visibleOn: 'this.popOver',
              pipeIn: defaultValue('popOver'),
              options: [
                {
                  label: 'Default',
                  value: 'popOver'
                },

                {
                  label: 'Ball box',
                  value: 'dialog'
                },

                {
                  label: 'Pull-out pop-up box',
                  value: 'drawer'
                }
              ]
            },

            {
              name: 'popOver.position',
              label: 'View more pop-up modes',
              type: 'select',
              visibleOn: 'this.popOver && this.popOver.mode === "popOver"',
              pipeIn: defaultValue('center'),
              options: [
                {
                  label: 'target center',
                  value: 'center'
                },

                {
                  label: 'Upper left corner of target',
                  value: 'left-top'
                },

                {
                  label: 'Upper right corner of target',
                  value: 'right-top'
                },

                {
                  label: 'Lower left corner of target',
                  value: 'left-bottom'
                },

                {
                  label: 'target lower right corner',
                  value: 'right-bottom'
                },

                {
                  label: 'Upper left corner of the page',
                  value: 'fixed-left-top'
                },

                {
                  label: 'upper right corner of the page',
                  value: 'fixed-right-top'
                },

                {
                  label: 'lower left corner of the page',
                  value: 'fixed-left-bottom'
                },

                {
                  label: 'lower right corner of the page',
                  value: 'fixed-right-bottom'
                }
              ]
            },

            {
              visibleOn: 'this.popOver',
              name: 'popOver',
              asFormItem: true,
              children: ({value, onChange}: any) => {
                value = {
                  type: 'panel',
                  title: 'View details',
                  body: 'Content details',
                  ...value
                };

                return (
                  <Button
                    level="info"
                    className="m-b"
                    size="sm"
                    block
                    onClick={() => {
                      this.manager.openSubEditor({
                        title: 'Configure to view more display content',
                        value: value,
                        onChange: value => onChange(value, 'popOver')
                      });
                    }}
                  >
                    See more content configuration
                  </Button>
                );
              }
            },

            getSchemaTpl('switch', {
              name: 'copyable',
              label: 'Enable content copying',
              pipeIn: (value: any) => !!value
            }),

            {
              visibleOn: 'this.copyable',
              name: 'copyable.content',
              type: 'textarea',
              label: 'Copy content template',
              description: 'Defaults to the current field value, customizable.'
            }
          ]
        },
        {
          title: 'Appearance',
          body: [
            {
              type: 'select',
              name: 'align',
              label: 'Alignment',
              pipeIn: defaultValue('left'),
              options: [
                {label: 'left', value: 'left'},
                {label: 'center', value: 'center'},
                {label: 'right', value: 'right'},
                {label: 'Justify', value: 'justify'}
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
                {label: 'right', value: 'right'},
                {label: 'Justify', value: 'justify'}
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
              name: 'fixed',
              type: 'button-group-select',
              label: 'Fixed position',
              pipeIn: defaultValue(''),
              size: 'xs',
              mode: 'inline',
              inputClassName: 'mt-1 w-full',
              options: [
                {
                  value: '',
                  label: 'Not fixed'
                },

                {
                  value: 'left',
                  label: 'Left side'
                },

                {
                  value: 'right',
                  label: 'right side'
                }
              ]
            },

            getSchemaTpl('switch', {
              name: 'toggled',
              label: 'Default display',
              pipeIn: defaultValue(true)
            }),

            {
              name: 'breakpoint',
              type: 'button-group-select',
              label: 'Trigger bottom display conditions',
              visibleOn: 'this.tableFootableEnabled',
              size: 'xs',
              multiple: true,
              options: [
                {
                  label: 'Always',
                  value: '*'
                },
                {
                  label: 'Mobile',
                  value: 'xs'
                },
                {
                  label: 'Tablet',
                  value: 'sm'
                },
                {
                  label: 'PC small screen',
                  value: 'md'
                },
                {
                  label: 'PC large screen',
                  value: 'lg'
                }
              ],
              pipeIn: (value: any) =>
                value ? (typeof value === 'string' ? value : '*') : '',
              pipeOut: (value: any) =>
                typeof value === 'string' &&
                ~value.indexOf('*') &&
                /xs|sm|md|lg/.test(value)
                  ? value.replace(/\*\s*,\s*|\s*,\s*\*/g, '')
                  : value
            },
            {
              name: 'textOverflow',
              type: 'button-group-select',
              label: 'Text exceeds processing limit',
              size: 'xs',
              mode: 'inline',
              inputClassName: 'mt-1 w-full',
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

            getSchemaTpl('className'),
            getSchemaTpl('className', {
              name: 'innerClassName',
              label: 'Internal CSS class name'
            }),

            {
              name: 'width',
              type: 'input-number',
              label: 'column width',
              description: 'Fixed column width, not recommended.'
            }
          ]
        }
      ])
    ];
  };

  // filterProps(props: any) {
  //   props = JSONPipeOut(props, true);
  //   return props;
  // }

  getRendererInfo({
    renderer,
    schema
  }: RendererInfoResolveEventContext): BasicRendererInfo | void {
    if (renderer.name === 'table-cell') {
      return {
        name: schema.label ? `<${schema.label}>Column` : 'Anonymous column',
        $schema: '/schemas/TableColumn.json',
        multifactor: true,
        wrapperResolve: (dom: HTMLTableCellElement) => {
          const siblings = [].slice.call(dom.parentElement!.children);
          const index = siblings.indexOf(dom) + 1;
          const table = dom.closest('table')!;

          return [].slice.call(
            table.querySelectorAll(
              `th:nth-child(${index}):not([data-editor-id="${schema.id}"]),
              td:nth-child(${index}):not([data-editor-id="${schema.id}"])`
            )
          );
        }
        // filterProps: this.filterProps
      };
    }
  }

  /*exchangeRenderer(id: string) {
    this.manager.showReplacePanel(id, '展示');
  }*/

  beforeReplace(event: PluginEvent<ReplaceEventContext>) {
    const context = event.context;

    // Keep label and name values ​​when replacing fields.
    if (context.info.plugin === this && context.data) {
      context.data.label = context.data.label || context.schema.label;
      context.data.name = context.data.name || context.schema.name;
    }
  }
}

registerEditorPlugin(TableCellPlugin);

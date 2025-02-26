import {Button} from 'amis';
import React from 'react';
import {registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {
  BaseEventContext,
  BasePlugin,
  ContextMenuEventContext,
  ContextMenuItem,
  PluginEvent,
  ResizeMoveEventContext,
  RendererJSONSchemaResolveEventContext,
  VRendererConfig
} from '@/packages/amis-editor-core/src';
import {defaultValue, getSchemaTpl} from '@/packages/amis-editor-core/src';
import {EditorNodeType} from '@/packages/amis-editor-core/src';
import {Schema} from 'amis';
import {VRenderer} from '@/packages/amis-editor-core/src';
import {RegionWrapper as Region} from '@/packages/amis-editor-core/src';
import {Icon} from '@/packages/amis-editor-core/src';
import {JSONChangeInArray, JSONPipeIn, repeatArray} from '@/packages/amis-editor-core/src';

export class GridPlugin extends BasePlugin {
  static id = 'GridPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'grid';
  $schema = '/schemas/GridSchema.json';

  // Component name
  name = 'Column';
  isBaseComponent = true;
  description = 'Column layout';
  searchKeywords = 'Horizontal column';
  docLink = '/amis/zh-CN/components/grid';
  tags = ['layout container'];
  order = -2;
  icon = 'fa fa-th';
  pluginIcon = 'grid-plugin';

  /*
  scaffolds = [
    {
      name: 'Two columns',
      description: 'Two-column layout',
      scaffold: {
        type: 'grid',
        columns: [
          {
            body: []
          },
          {
            body: []
          }
        ]
      },

      previewSchema: {
        type: 'grid',
        columns: [
          {
            body: [
              {
                type: 'tpl',
                tpl: 'bar',
                inline: false,
                wrapperComponent: '',
                className: 'bg-light wrapper'
              }
            ]
          },
          {
            body: [
              {
                type: 'tpl',
                tpl: 'bar',
                wrapperComponent: '',
                className: 'bg-light wrapper',
                inline: false
              }
            ]
          }
        ]
      }
    },

    {
      name: 'Three columns',
      description: 'Three-column layout',
      scaffold: {
        type: 'grid',
        columns: [
          {
            body: []
          },
          {
            body: []
          },
          {
            body: []
          }
        ]
      },

      previewSchema: {
        type: 'grid',
        columns: [
          {
            body: [
              {
                type: 'tpl',
                tpl: 'bar',
                inline: false,
                className: 'bg-light wrapper'
              }
            ]
          },
          {
            body: [
              {
                type: 'tpl',
                tpl: 'bar',
                wrapperComponent: '',
                className: 'bg-light wrapper',
                inline: false
              }
            ]
          },
          {
            body: [
              {
                type: 'tpl',
                tpl: 'bar',
                wrapperComponent: '',
                className: 'bg-light wrapper',
                inline: false
              }
            ]
          }
        ]
      }
    }
  ];
  */

  // Only keep one column layout
  scaffold = {
    type: 'grid',
    columns: [
      {
        body: []
      },
      {
        body: []
      }
    ]
  };

  previewSchema = {
    type: 'grid',
    columns: [
      {
        body: [
          {
            type: 'tpl',
            tpl: 'bar',
            inline: false,
            wrapperComponent: '',
            className: 'bg-light wrapper'
          }
        ]
      },
      {
        body: [
          {
            type: 'tpl',
            tpl: 'bar',
            wrapperComponent: '',
            className: 'bg-light wrapper',
            inline: false
          }
        ]
      }
    ]
  };

  panelTitle = 'Column layout';
  panelWithOutOthers = false;
  panelBodyCreator(context: BaseEventContext) {
    const asSecondFactor = context.secondFactor;

    return [
      getSchemaTpl('tabs', [
        {
          title: 'Attributes',
          className: 'p-none',
          body: [
            getSchemaTpl('collapseGroup', [
              {
                title: 'Insert',
                body: [
                  asSecondFactor
                    ? null
                    : {
                        type: 'wrapper',
                        size: 'none',
                        className: 'grid grid-cols-2 gap-4 mb-4',
                        body: [
                          {
                            children: (
                              <Button
                                size="sm"
                                onClick={() =>
                                  this.insertRowAfter(context.node)
                                }
                              >
                                <Icon className="icon" icon="arrow-to-bottom" />
                                <span>Insert new line below</span>
                              </Button>
                            )
                          },
                          {
                            children: (
                              <Button
                                size="sm"
                                onClick={() =>
                                  this.insertRowBefore(context.node)
                                }
                              >
                                <Icon
                                  className="icon"
                                  icon="top-arrow-to-top"
                                />
                                <span>Insert new line above</span>
                              </Button>
                            )
                          }
                        ]
                      }
                ].filter(item => item)
              },
              {
                title: 'Layout',
                body: [
                  getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                  {
                    label: 'Number of columns',
                    name: 'columns',
                    type: 'select',
                    pipeIn: (value: any) =>
                      Array.isArray(value) ? value.length : undefined,
                    pipeOut: (value: any, origin: any) => {
                      if (Array.isArray(origin)) {
                        if (origin.length > value) {
                          origin = origin.concat();
                          origin.splice(value - 1, origin.length - value);
                        } else {
                          origin = origin.concat(
                            repeatArray(
                              {
                                body: []
                              },
                              value - origin.length
                            )
                          );
                        }
                      }

                      return origin;
                    },
                    options: repeatArray(null, 12).map((_, index) => ({
                      label: `${index + 1}`,
                      value: index + 1
                    }))
                  },

                  {
                    type: 'button-group-select',
                    name: 'gap',
                    label: 'Column spacing',
                    size: 'sm',
                    clearable: true,
                    tiled: true,
                    options: [
                      {
                        label: 'None',
                        value: 'none'
                      },
                      {
                        label: 'extremely small',
                        value: 'xs'
                      },
                      {
                        label: 'small',
                        value: 'sm'
                      },
                      {
                        label: 'Normal',
                        value: 'base'
                      },
                      {
                        label: 'Medium',
                        value: 'md'
                      },
                      {
                        label: 'big',
                        value: 'lg'
                      }
                    ]
                  },
                  {
                    type: 'button-group-select',
                    name: 'align',
                    size: 'sm',
                    label: 'Horizontal alignment',
                    tiled: true,
                    pipeIn: defaultValue('left'),
                    inputClassName: 'flex-nowrap',
                    options: [
                      {
                        value: 'left',
                        label: 'Left aligned'
                      },
                      {
                        value: 'center',
                        label: 'center alignment'
                      },
                      {
                        value: 'right',
                        label: 'right aligned'
                      },
                      {
                        value: 'between',
                        label: 'Justify both ends'
                      }
                    ]
                  },
                  {
                    type: 'button-group-select',
                    name: 'valign',
                    size: 'sm',
                    label: 'Vertical alignment',
                    tiled: true,
                    pipeIn: defaultValue('top'),
                    inputClassName: 'flex-nowrap',
                    options: [
                      {
                        value: 'top',
                        label: 'Top Aligned'
                      },
                      {
                        value: 'middle',
                        label: 'center alignment'
                      },
                      {
                        value: 'bottom',
                        label: 'Bottom alignment'
                      },
                      {
                        value: 'between',
                        label: 'Justify both ends'
                      }
                    ]
                  }
                ]
              }
            ])
          ]
        },
        this.panelWithOutOthers
          ? null
          : {
              title: 'Appearance',
              body: [
                getSchemaTpl('collapseGroup', [
                  getSchemaTpl('subFormItemMode'),
                  getSchemaTpl('subFormHorizontalMode'),
                  getSchemaTpl('subFormHorizontal'),
                  ...getSchemaTpl('theme:common', {exclude: ['layout']})
                ])
              ]
            }
      ])
    ];
  }

  vRendererConfig: VRendererConfig = {
    regions: {
      body: {
        key: 'body',
        label: 'Content area',
        placeholder: 'column',
        wrapperResolve: (dom: HTMLElement) => dom
      }
    },
    panelTitle: '栏',
    panelBodyCreator: (context: BaseEventContext) => {
      const host = context.node.host;

      return [
        getSchemaTpl('tabs', [
          {
            title: 'Attributes',
            className: 'p-none',
            body: [
              getSchemaTpl('collapseGroup', [
                getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                {
                  title: 'Insert',
                  body: [
                    {
                      type: 'wrapper',
                      size: 'none',
                      className: 'grid grid-cols-2 gap-4',
                      body: [
                        host.isSecondFactor
                          ? null
                          : {
                              children: (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    this.insertRowAfter(context.node.host)
                                  }
                                >
                                  <Icon
                                    className="icon"
                                    icon="arrow-to-bottom"
                                  />
                                  <span>Insert new line below</span>
                                </Button>
                              )
                            },
                        host.isSecondFactor
                          ? null
                          : {
                              children: (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    this.insertRowBefore(context.node.host)
                                  }
                                >
                                  <Icon
                                    className="icon"
                                    icon="top-arrow-to-top"
                                  />
                                  <span>Insert new line above</span>
                                </Button>
                              )
                            },
                        {
                          children: (
                            <Button
                              size="sm"
                              onClick={() => this.insertColumnBefore(context)}
                            >
                              <Icon
                                className="icon"
                                icon="left-arrow-to-left"
                              />
                              <span>Insert new column on the left</span>
                            </Button>
                          )
                        },
                        {
                          children: (
                            <Button
                              size="sm"
                              onClick={() => this.insertColumnAfter(context)}
                            >
                              <Icon className="icon" icon="arrow-to-right" />
                              <span>Insert new column on the right</span>
                            </Button>
                          )
                        }
                      ].filter(item => item)
                    }
                  ]
                },
                {
                  title: 'Width',
                  body: [
                    {
                      type: 'button-group-select',
                      name: 'md',
                      size: 'sm',
                      label: false,
                      pipeIn: (value: any) =>
                        typeof value === 'number' ? 'manual' : value || '',
                      pipeOut: (value: any) => (value === 'manual' ? 1 : value),
                      tiled: true,
                      options: [
                        {
                          value: '',
                          label: 'Fit width'
                        },
                        {
                          value: 'auto',
                          label: 'Adaptive content'
                        },
                        {
                          value: 'manual',
                          label: 'manual'
                        }
                      ]
                    },
                    {
                      visibleOn: 'typeof this.md === "number"',
                      label: 'width ratio',
                      type: 'input-range',
                      name: 'md',
                      min: 1,
                      max: 12,
                      step: 1
                    }
                  ]
                },
                {
                  title: 'Layout',
                  body: [
                    {
                      type: 'button-group-select',
                      name: 'valign',
                      size: 'sm',
                      label: false,
                      tiled: true,
                      clearable: true,
                      inputClassName: 'flex-nowrap',
                      options: [
                        {
                          value: 'top',
                          label: 'Top Aligned'
                        },
                        {
                          value: 'middle',
                          label: 'center alignment'
                        },
                        {
                          value: 'bottom',
                          label: 'Bottom alignment'
                        },
                        {
                          value: 'between',
                          label: 'Justify both ends'
                        }
                      ]
                    }
                  ]
                }
              ])
            ]
          },
          {
            title: 'Appearance',
            body: [
              getSchemaTpl('collapseGroup', [
                ...getSchemaTpl('theme:common', {exclude: ['layout']})
              ])
            ]
          }
        ])
      ];
    }
  };

  vWrapperResolve = (dom: HTMLElement) => dom;
  overrides = {
    renderColumn: function (
      this: any,
      node: Schema,
      index: number,
      length: number
    ) {
      let dom = this.super(node, index, length);
      const info = this.props.$$editor;

      if (info && node.$$id) {
        const plugin: GridPlugin = info.plugin as any;
        const region = plugin.vRendererConfig?.regions?.body;
        if (!region) {
          return dom;
        }

        return (
          <VRenderer
            key={`${node.$$id}-${index}`}
            type={info.type}
            plugin={info.plugin}
            renderer={info.renderer}
            $schema="/schemas/GridColumn.json"
            hostId={info.id}
            memberIndex={index}
            name={`Column ${index + 1}`}
            id={node.$$id}
            draggable={false}
            schemaPath={`${info.schemaPath}/grid/${index}`}
            wrapperResolve={plugin.vWrapperResolve}
            path={`${this.props.$path}/${index}`} // seems useless
            data={this.props.data} // seems useless
            widthMutable
          >
            {region ? (
              <Region
                key={region.key}
                preferTag={region.preferTag}
                name={region.key}
                label={region.label}
                regionConfig={region}
                placeholder={region.placeholder}
                editorStore={plugin.manager.store}
                manager={plugin.manager}
                children={dom}
                wrapperResolve={region.wrapperResolve}
                rendererName={info.renderer.name}
              />
            ) : (
              dom
            )}
          </VRenderer>
        );
      }
      return dom;
    }
  };

  afterResolveJsonSchema(
    event: PluginEvent<RendererJSONSchemaResolveEventContext>
  ) {
    const context = event.context;
    const parent = context.node.parent?.host as EditorNodeType;

    if (parent?.info?.plugin === this) {
      event.setData('/schemas/GridColumn.json');
    }
  }

  buildEditorContextMenu(
    context: ContextMenuEventContext,
    menus: Array<ContextMenuItem>
  ) {
    if (context.selections.length || context.info?.plugin !== this) {
      return;
    }

    if (context.node.isVitualRenderer) {
      menus.push('|');

      menus.push({
        label: 'Insert a column on the left',
        onSelect: () => this.insertColumnBefore(context)
      });

      menus.push({
        label: 'Insert a column on the right',
        onSelect: () => this.insertColumnAfter(context)
      });

      menus.push('|');

      menus.push({
        label: 'Insert a row above',
        onSelect: () => this.insertRowBefore(context.node.host)
      });

      menus.push({
        label: 'Insert a row below',
        onSelect: () => this.insertRowAfter(context.node.host)
      });
    } else {
      menus.push('|');

      menus.push({
        label: 'Insert a row above',
        onSelect: () => this.insertRowBefore(context.node)
      });

      menus.push({
        label: 'Insert a row below',
        onSelect: () => this.insertRowAfter(context.node)
      });
    }
  }

  onWidthChangeStart(
    event: PluginEvent<
      ResizeMoveEventContext,
      {
        onMove(e: MouseEvent): void;
        onEnd(e: MouseEvent): void;
      }
    >
  ) {
    const context = event.context;
    const node = context.node;
    if (node.info?.plugin !== this) {
      return;
    }
    const host = node.host;
    if (!host || host.info?.plugin !== this) {
      return;
    }

    const dom = context.dom;
    const parent = dom.parentElement as HTMLElement;
    if (!parent) {
      return;
    }
    const resizer = context.resizer;
    const frameRect = parent.getBoundingClientRect();
    let columns = host.schema.columns;
    const index = node.index;
    let finalMd = columns[index].md;
    const rect = dom.getBoundingClientRect();

    event.setData({
      onMove: (e: MouseEvent) => {
        const width = e.pageX - rect.left;
        const md = (finalMd = Math.max(
          1,
          Math.min(12, Math.round((12 * width) / frameRect.width))
        ));
        columns = columns.concat();
        columns[index] = {
          ...columns[index],
          md
        };
        resizer.setAttribute('data-value', `${md}`);

        host.updateState({
          columns
        });
        requestAnimationFrame(() => {
          node.calculateHighlightBox();
        });
      },
      onEnd: () => {
        host.updateState({}, true);
        resizer.removeAttribute('data-value');
        node.updateSchema({
          md: finalMd
        });
        requestAnimationFrame(() => {
          node.calculateHighlightBox();
        });
      }
    });
  }

  insertRowAfter(node: EditorNodeType) {
    if (node.info?.plugin !== this) {
      return;
    }
    const store = this.manager.store;
    const schema = store.schema;
    const id = node.id;
    store.traceableSetSchema(
      JSONChangeInArray(schema, id, (arr: any[], node: any, index: number) => {
        arr.splice(
          index + 1,
          0,
          JSONPipeIn({
            type: this.rendererName || 'grid',
            align: node.align,
            valign: node.valign,
            columns: node.columns.map((column: any) => ({
              body: [],
              md: column?.md
            }))
          })
        );
      })
    );
  }
  insertRowBefore(node: EditorNodeType) {
    if (node.info?.plugin !== this) {
      return;
    }
    const store = this.manager.store;
    const schema = store.schema;
    const id = node.id;
    store.traceableSetSchema(
      JSONChangeInArray(schema, id, (arr: any[], node: any, index: number) => {
        arr.splice(
          index,
          0,
          JSONPipeIn({
            type: this.rendererName || 'grid',
            align: node.align,
            valign: node.valign,
            columns: node.columns.map((column: any) => ({
              body: [],
              md: column?.md
            }))
          })
        );
      })
    );
  }
  insertColumnBefore(context: BaseEventContext) {
    const node = context.node;
    if (node.info?.plugin !== this) {
      return;
    }
    const store = this.manager.store;
    const id = context.id;
    const schema = store.schema;
    store.traceableSetSchema(
      JSONChangeInArray(schema, id, (arr: any[], node: any, index: number) => {
        arr.splice(
          index,
          0,
          JSONPipeIn({
            body: []
          })
        );
      })
    );
  }
  insertColumnAfter(context: BaseEventContext) {
    const node = context.node;
    if (node.info?.plugin !== this) {
      return;
    }
    const store = this.manager.store;
    const schema = store.schema;
    const id = context.id;
    store.traceableSetSchema(
      JSONChangeInArray(schema, id, (arr: any[], node: any, index: number) => {
        arr.splice(
          index + 1,
          0,
          JSONPipeIn({
            body: []
          })
        );
      })
    );
  }
}

registerEditorPlugin(GridPlugin);

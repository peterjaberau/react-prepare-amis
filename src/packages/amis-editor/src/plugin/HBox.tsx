import {Button} from 'amis';
import React from 'react';
import {registerEditorPlugin} from 'amis-editor-core';
import {
  BaseEventContext,
  BasePlugin,
  ContextMenuEventContext,
  ContextMenuItem,
  PluginEvent,
  RendererJSONSchemaResolveEventContext,
  VRendererConfig,
  ResizeMoveEventContext
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {EditorNodeType} from 'amis-editor-core';
import {Schema} from 'amis';
import {VRenderer} from 'amis-editor-core';
import {RegionWrapper as Region} from 'amis-editor-core';
import {JSONChangeInArray, JSONPipeIn, repeatArray} from 'amis-editor-core';
import {Icon} from 'amis-editor-core';

export class HBoxPlugin extends BasePlugin {
  static id = 'HBoxPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'hbox';
  $schema = '/schemas/HBoxSchema.json';
  disabledRendererPlugin = true; // The component panel is not displayed

  // Component name
  name = 'HBox';
  isBaseComponent = true;
  icon = 'fa fa-columns';
  description =
    'Used to implement left and right layout, evenly distributed by default, and the width of a column can be configured through columnClassName. ';
  docLink = '/amis/zh-CN/components/hbox';
  tags = ['container'];
  scaffold = {
    type: 'hbox',
    gap: 'base',
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
    type: 'hbox',
    columns: [
      {
        type: 'tpl',
        tpl: 'Fixed width<br />w-xs',
        columnClassName: 'bg-primary w-xs'
      },
      {
        type: 'tpl',
        tpl: 'Autofill',
        columnClassName: 'bg-success'
      }
    ]
  };

  panelTitle = 'HBox';
  panelBodyCreator = (context: BaseEventContext) => [
    getSchemaTpl('tabs', [
      {
        title: 'General',
        body: [
          getSchemaTpl('layout:originPosition', {value: 'left-top'}),
          getSchemaTpl('fieldSet', {
            title: 'Insert',
            collapsable: false,
            body: [
              {
                type: 'wrapper',
                size: 'none',
                className: 'grid grid-cols-2 gap-4 mb-4',
                body: [
                  {
                    children: (
                      <Button
                        size="sm"
                        onClick={() => this.insertRowAfter(context.node)}
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
                        onClick={() => this.insertRowBefore(context.node)}
                      >
                        <Icon className="icon" icon="top-arrow-to-top" />
                        <span>Insert new line above</span>
                      </Button>
                    )
                  }
                ]
              },

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
              }
            ]
          }),

          {
            type: 'list-select',
            name: 'gap',
            label: 'Column spacing',
            size: 'sm',
            clearable: true,
            tiled: true,
            options: [
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

          getSchemaTpl('combo-container', {
            name: 'columns',
            label: 'column collection',
            type: 'combo',
            scaffold: {
              body: []
            },
            minLength: 1,
            multiple: true,
            // draggable: true,
            draggableTip: '',
            items: [
              {
                type: 'tpl',
                tpl: `<span class="label label-default">${'列'}\${index | plus}</span>`,
                columnClassName: 'no-grow v-middle'
              },
              getSchemaTpl('className', {
                name: 'columnClassName',
                labelRemark: '',
                label: ''
              })
            ]
          }),
          getSchemaTpl('fieldSet', {
            title: 'Horizontal alignment',
            collapsable: false,
            body: [
              {
                type: 'button-group-select',
                name: 'align',
                size: 'sm',
                label: false,
                tiled: true,
                pipeIn: defaultValue('left'),
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
              }
            ]
          }),

          getSchemaTpl('fieldSet', {
            title: 'Vertical alignment',
            collapsable: false,
            body: [
              {
                type: 'button-group-select',
                name: 'valign',
                size: 'sm',
                label: false,
                tiled: true,
                pipeIn: defaultValue('top'),
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
          })
        ]
      },
      {
        title: 'Appearance',
        body: [
          getSchemaTpl('className'),
          getSchemaTpl('subFormItemMode'),
          getSchemaTpl('subFormHorizontalMode'),
          getSchemaTpl('subFormHorizontal')
        ]
      },
      {
        title: 'Show and hide',
        body: [getSchemaTpl('visible')]
      }
    ])
  ];

  vRendererConfig: VRendererConfig = {
    regions: {
      body: {
        key: 'body',
        label: 'Content area',
        placeholder: '列',
        wrapperResolve: (dom: HTMLElement) => dom
      }
    },
    panelTitle: '列',
    panelBodyCreator: (context: BaseEventContext) => {
      return [
        getSchemaTpl('tabs', [
          {
            title: 'General',
            body: [
              getSchemaTpl('fieldSet', {
                title: 'Insert',
                collapsable: false,
                body: [
                  {
                    type: 'wrapper',
                    size: 'none',
                    className: 'grid grid-cols-2 gap-4',
                    body: [
                      {
                        children: (
                          <Button
                            size="sm"
                            onClick={() =>
                              this.insertRowAfter(context.node.host)
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
                              this.insertRowBefore(context.node.host)
                            }
                          >
                            <Icon className="icon" icon="top-arrow-to-top" />
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
                            <Icon className="icon" icon="left-arrow-to-left" />
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
                    ]
                  }
                ]
              }),

              getSchemaTpl('fieldSet', {
                title: 'Width setting',
                collapsable: false,
                body: [
                  {
                    type: 'button-group-select',
                    name: 'width',
                    size: 'sm',
                    label: false,
                    pipeIn: (value: any) =>
                      value && value !== 'auto' ? 'manual' : value || '',
                    pipeOut: (value: any) =>
                      value === 'manual' ? '20%' : value,
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
                    ],
                    description: `<% if (this.width && this.width !== "auto") {%>${'Please press and hold the square on the right side of the highlighted box and drag to adjust the width'}<%}%>`
                  }
                ]
              }),

              getSchemaTpl('fieldSet', {
                title: 'Vertical alignment',
                collapsable: false,
                body: [
                  {
                    type: 'button-group-select',
                    name: 'valign',
                    size: 'sm',
                    label: false,
                    tiled: true,
                    clearable: true,
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
              })
            ]
          },
          {
            title: 'Appearance',
            body: [
              getSchemaTpl('className', {
                name: 'columnClassName',
                label: 'Column CSS class name',
                description:
                  'You can add width class styles to adjust the width. The default width is evenly distributed.'
              })
            ]
          }
        ])
      ];
    }
  };

  vWrapperResolve = (dom: HTMLElement) => dom;
  overrides = {
    renderColumn: function (this: any, node: Schema, index: number) {
      const dom = this.super(node, index);
      const info = this.props.$$editor;

      if (info && node.$$id) {
        const plugin: HBoxPlugin = info.plugin as any;
        const region = plugin.vRendererConfig?.regions?.body;
        if (!region) {
          return dom;
        }

        return (
          <VRenderer
            key={node.$$id}
            type={info.type}
            plugin={info.plugin}
            renderer={info.renderer}
            $schema="" // /schemas/GridColumn.json
            hostId={info.id}
            memberIndex={index}
            name={`column ${index + 1}`}
            id={node.$$id}
            draggable={false}
            schemaPath={`${info.schemaPath}/hbox/${index}`}
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

  // buildEditorPanel(context: BaseEventContext, panels: Array<BasicPanelItem>) {
  //   super.buildEditorPanel(context, panels);
  //   const parent = context.node.parent?.host as EditorNodeType;

  //   if (
  //     parent?.info?.plugin === this &&
  //     (this.vRendererConfig.panelControls ||
  //       this.vRendererConfig.panelControlsCreator)
  //   ) {
  //     panels.push({
  //       key: 'grid',
  //       order: 100,
  //       icon: this.vRendererConfig.panelIcon || 'fa fa-tablet',
  //       title: this.vRendererConfig.panelTitle || '格子',
  //       render: this.manager.makeSchemaFormRender({
  //         body: this.vRendererConfig.panelControlsCreator
  //           ? this.vRendererConfig.panelControlsCreator(context)
  //           : this.vRendererConfig.panelControls!
  //       })
  //     });
  //   }
  // }

  afterResolveJsonSchema(
    event: PluginEvent<RendererJSONSchemaResolveEventContext>
  ) {
    const context = event.context;
    const parent = context.node.parent?.host as EditorNodeType;

    if (parent?.info?.plugin === this) {
      event.setData('/schemas/HBoxColumn.json');
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
    let finalWidth = columns[index].width;
    const rect = dom.getBoundingClientRect();

    event.setData({
      onMove: (e: MouseEvent) => {
        const width = e.pageX - rect.left;
        const percent = (finalWidth = `${Math.max(
          1,
          Math.min(99, Math.round((100 * width) / frameRect.width))
        )}%`);
        columns = columns.concat();
        columns[index] = {
          ...columns[index],
          width: percent
        };
        resizer.setAttribute('data-value', percent);

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
          width: finalWidth
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
            type: 'hbox',
            align: node.align,
            valign: node.valign,
            columns: node.columns.map((column: any) => ({
              body: [],
              width: column?.width
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
    const id = node.id;
    const schema = store.schema;
    store.traceableSetSchema(
      JSONChangeInArray(schema, id, (arr: any[], node: any, index: number) => {
        arr.splice(
          index,
          0,
          JSONPipeIn({
            type: 'hbox',
            align: node.align,
            valign: node.valign,
            columns: node.columns.map((column: any) => ({
              body: [],
              width: column?.width
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
    const schema = store.schema;
    const id = context.id;
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
    const id = context.id;
    const store = this.manager.store;
    const schema = store.schema;
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

registerEditorPlugin(HBoxPlugin);

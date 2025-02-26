import React from 'react';
import {Button} from '@/packages/amis/src';
import {Icon} from '@/packages/amis-editor-core/src';
import {
  ActiveEventContext,
  BaseEventContext,
  LayoutBasePlugin,
  RegionConfig,
  PluginEvent,
  ResizeMoveEventContext,
  registerEditorPlugin,
  defaultValue,
  getSchemaTpl,
  RendererPluginEvent
} from '@/packages/amis-editor-core/src';
import {getEventControlConfig} from '../renderer/event-control';
// @ts-ignore
import {EditorNodeType} from 'packages/amis-editor-core/lib';
import {defaultFlexColumnSchema} from './Layout/FlexPluginBase';

export class ContainerPlugin extends LayoutBasePlugin {
  static id = 'ContainerPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'container';
  $schema = '/schemes/ContainerSchema.json';

  // Component name
  name = 'Container';
  isBaseComponent = true;
  description = 'A simple container that can hold multiple renderers together.';
  docLink = '/amis/zh-CN/components/container';
  tags = ['layout container'];
  order = -2;
  icon = 'fa fa-square-o';
  pluginIcon = 'container-plugin';
  scaffold = {
    type: 'container',
    body: [],
    style: {
      position: 'relative',
      display: 'flex',
      inset: 'auto',
      flexWrap: 'nowrap',
      flexDirection: 'column',
      alignItems: 'flex-start'
    },
    size: 'none',
    wrapperBody: false
  };
  previewSchema = {
    ...this.scaffold
  };

  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: 'Content area'
    }
  ];

  panelTitle = 'Container';

  panelJustify = true;

  // Event definition
  events: RendererPluginEvent[] = [
    {
      eventName: 'click',
      eventLabel: 'click',
      description: 'Triggered when clicked',
      dataSchema: [
        {
          type: 'object',
          properties: {
            context: {
              type: 'object',
              title: 'Context',
              properties: {
                nativeEvent: {
                  type: 'object',
                  title: 'Mouse event object'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'mouseenter',
      eventLabel: 'Mouse Move',
      description: 'Triggered when the mouse moves in',
      dataSchema: [
        {
          type: 'object',
          properties: {
            context: {
              type: 'object',
              title: 'Context',
              properties: {
                nativeEvent: {
                  type: 'object',
                  title: 'Mouse event object'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'mouseleave',
      eventLabel: 'Mouse out',
      description: 'Triggered when the mouse moves out',
      dataSchema: [
        {
          type: 'object',
          properties: {
            context: {
              type: 'object',
              title: 'Context',
              properties: {
                nativeEvent: {
                  type: 'object',
                  title: 'Mouse event object'
                }
              }
            }
          }
        }
      ]
    }
  ];

  onActive(event: PluginEvent<ActiveEventContext>) {
    const context = event.context;

    if (context.info?.plugin !== this || !context.node) {
      return;
    }

    const node = context.node!;
    const isFlexItem = this.manager?.isFlexItem(node.id);
    if (isFlexItem) {
      let isColumnFlex = this.manager.isFlexColumnItem(node.id);
      context?.node.setHeightMutable(
        node?.schema?.isFixedHeight && !isColumnFlex
      );
      context?.node.setWidthMutable(
        (!isColumnFlex && context.node.parent?.children?.length > 1) ||
          node.schema?.style?.flex === '0 0 150px'
      );
    } else {
      context?.node.setHeightMutable(node.schema?.isFixedHeight);
      context?.node.setWidthMutable(node.schema?.isFixedWidth);
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
    const host = node.host;

    const dom = context.dom;
    const parent = dom.parentElement as HTMLElement;
    if (!parent) {
      return;
    }
    const resizer = context.resizer;
    const frameRect = parent.getBoundingClientRect();
    const rect = dom.getBoundingClientRect();
    const isFlexItem = this.manager?.isFlexItem(node.id);
    const isColumnFlex = this.manager?.isFlexColumnItem(node.id);
    const schema = node.schema;
    const index = node.index;
    const isFlexSize =
      schema.style?.flex === '1 1 auto' &&
      (schema.style?.position === 'static' ||
        schema.style?.position === 'relative');

    let flexGrow = 1;
    let width = 0;

    event.setData({
      onMove: (e: MouseEvent) => {
        const children = parent.children;

        width = e.pageX - rect.left;
        flexGrow = Math.max(
          1,
          Math.min(12, Math.round((12 * width) / frameRect.width))
        );

        resizer.setAttribute(
          'data-value',
          isFlexSize ? `${flexGrow}` : width + 'px'
        );

        if (isFlexSize) {
          // Need to recalculate the proportion of each subcomponent under flex, and calculate it according to 12 equal parts
          for (let i = 0; i < children.length; i++) {
            if (i !== index) {
              let width = children[i].clientWidth;
              if (width > 0) {
                let grow = Math.max(
                  1,
                  Math.min(12, Math.round((12 * width) / frameRect.width))
                );
                host.children[i]?.updateState({
                  style: {
                    ...host.children[i].schema.style,
                    flexGrow: grow
                  }
                });
              }
            } else {
              node.updateState({
                style: {
                  ...node.schema.style,
                  flexGrow: +flexGrow
                }
              });
            }
          }
        } else {
          if (isFlexItem && !isColumnFlex) {
            node.updateState({
              style: {
                ...node.schema.style,
                flex: '0 0 150px',
                flexBasis: `${width}px`
              }
            });
          } else {
            node.updateState({
              style: {
                ...node.schema.style,
                width: `${width}px`
              }
            });
          }
        }

        requestAnimationFrame(() => {
          node.calculateHighlightBox();
        });
      },
      onEnd: () => {
        resizer.removeAttribute('data-value');

        if (isFlexSize) {
          host?.children.forEach((item: EditorNodeType) => {
            item.updateSchema({
              style: {
                ...node.schema.style,
                flexGrow: item.state.style?.flexGrow ?? 1
              }
            });
            item.updateState({}, true);
          });
        } else {
          if (isFlexItem && !isColumnFlex) {
            node.updateSchema({
              style: {
                ...node.schema.style,
                flex: `0 0 150px`,
                flexBasis: `${width}px`
              }
            });
          } else {
            node.updateSchema({
              style: {
                ...node.schema.style,
                width: `${width}px`
              }
            });
          }
          node.updateState({}, true);
        }

        requestAnimationFrame(() => {
          node.calculateHighlightBox();
        });
      }
    });
  }

  // onHeightChangeStart(
  //   event: PluginEvent<
  //     ResizeMoveEventContext,
  //     {
  //       onMove(e: MouseEvent): void;
  //       onEnd(e: MouseEvent): void;
  //     }
  //   >
  // ) {
  //   // console.log('on height change start');
  //   // return this.onSizeChangeStart(event, 'vertical');
  // }

  panelBodyCreator = (context: BaseEventContext) => {
    const curRendererSchema = context?.schema;
    const isRowContent =
      curRendererSchema?.direction === 'row' ||
      curRendererSchema?.direction === 'row-reverse';
    // const isFlexContainer = this.manager?.isFlexContainer(context?.id);
    const isFreeContainer = curRendererSchema?.isFreeContainer || false;
    const isFlexItem = this.manager?.isFlexItem(context?.id);
    const isFlexColumnItem = this.manager?.isFlexColumnItem(context?.id);
    const node = context.node;

    const parent = node.parent?.schema;
    const draggableContainer = this.manager.draggableContainer(context?.id);
    const canAppendSiblings =
      parent &&
      isFlexItem &&
      !draggableContainer &&
      this.manager?.canAppendSiblings();

    const newItemSchema = isFlexColumnItem
      ? defaultFlexColumnSchema('', false)
      : defaultFlexColumnSchema();

    const displayTpl = [
      getSchemaTpl('layout:display'),

      getSchemaTpl('layout:flex-setting', {
        visibleOn:
          'this.style && (this.style.display === "flex" || this.style.display === "inline-flex")',
        direction: curRendererSchema.direction,
        justify: curRendererSchema.justify,
        alignItems: curRendererSchema.alignItems
      }),

      getSchemaTpl('layout:flex-wrap', {
        visibleOn:
          'this.style && (this.style.display === "flex" || this.style.display === "inline-flex")'
      })
    ];

    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl('collapseGroup', [
          // {
          // title: 'Basic',
          //   body: [
          //     {
          //       name: 'wrapperComponent',
          // label: 'Container label',
          //       type: 'select',
          //       searchable: true,
          //       options: [
          //         'div',
          //         'p',
          // 'h1',
          //         'h2',
          // 'h3',
          // 'h4',
          // 'h5',
          // 'h6',
          //         'article',
          //         'aside',
          //         'code',
          //         'footer',
          //         'header',
          //         'section'
          //       ],
          //       pipeIn: defaultValue('div'),
          //       validations: {
          //         isAlphanumeric: true,
          // matchRegexp: '/^(?!.*script).*$/' // Disable the script tag
          //       },
          //       validationErrors: {
          // isAlpha: 'The HTML tag is illegal, please re-enter',
          // matchRegexp: 'The HTML tag is illegal, please re-enter'
          //       },
          //       validateOnChange: false
          //     },
          //     getSchemaTpl('layout:padding')
          //   ]
          // },
          {
            title: 'Basic',
            body: [
              canAppendSiblings && {
                type: 'wrapper',
                size: 'none',
                className: 'grid grid-cols-2 gap-4 mb-4',
                body: [
                  {
                    children: (
                      <Button
                        size="sm"
                        onClick={() =>
                          this.manager.appendSiblingSchema(
                            newItemSchema,
                            true,
                            true
                          )
                        }
                      >
                        <Icon
                          className="icon"
                          icon={
                            isFlexColumnItem
                              ? 'top-arrow-to-top'
                              : 'left-arrow-to-left'
                          }
                        />
                        <span>
                          {isFlexColumnItem ? 'above' : 'left'} insert a
                          {isFlexColumnItem ? 'row' : 'column'}
                        </span>
                      </Button>
                    )
                  },
                  {
                    children: (
                      <Button
                        size="sm"
                        onClick={() =>
                          this.manager.appendSiblingSchema(
                            newItemSchema,
                            false,
                            true
                          )
                        }
                      >
                        <Icon
                          className="icon"
                          icon={
                            isFlexColumnItem
                              ? 'arrow-to-bottom'
                              : 'arrow-to-right'
                          }
                        />
                        <span>
                          {isFlexColumnItem ? 'below' : 'right'} insert a
                          {isFlexColumnItem ? 'row' : 'column'}
                        </span>
                      </Button>
                    )
                  }
                ]
              },

              getSchemaTpl('theme:paddingAndMargin', {
                name: 'themeCss.baseControlClassName.padding-and-margin:default'
              }),
              getSchemaTpl('theme:border', {
                name: `themeCss.baseControlClassName.border:default`
              }),
              getSchemaTpl('theme:colorPicker', {
                name: 'themeCss.baseControlClassName.background:default',
                label: 'background',
                needCustom: true,
                needGradient: true,
                needImage: true,
                labelMode: 'input'
              }),

              // Free containers do not require display related configuration items
              ...(!isFreeContainer ? displayTpl : []),

              ...(isFlexItem
                ? [
                    getSchemaTpl('layout:flex', {
                      isFlexColumnItem,
                      label: isFlexColumnItem
                        ? 'Height setting'
                        : 'Width setting',
                      visibleOn:
                        'this.style && (this.style.position === "static" || this.style.position === "relative")'
                    }),
                    getSchemaTpl('layout:flex-grow', {
                      visibleOn:
                        'this.style && this.style.flex === "1 1 auto" && (this.style.position === "static" || this.style.position === "relative")'
                    }),
                    getSchemaTpl('layout:flex-basis', {
                      label: isFlexColumnItem
                        ? 'Flexible height'
                        : 'Flexible width',
                      visibleOn:
                        'this.style && (this.style.position === "static" || this.style.position === "relative") && this.style.flex === "1 1 auto"'
                    }),
                    getSchemaTpl('layout:flex-basis', {
                      label: isFlexColumnItem ? 'Fixed height' : 'Fixed width',
                      visibleOn:
                        'this.style && (this.style.position === "static" || this.style.position === "relative") && this.style.flex === "0 0 150px"'
                    })
                  ]
                : []),

              getSchemaTpl('layout:overflow-x', {
                visibleOn: `${
                  isFlexItem && !isFlexColumnItem
                } && this.style.flex === '0 0 150px'`
              }),

              getSchemaTpl('layout:isFixedHeight', {
                visibleOn: `${!isFlexItem || !isFlexColumnItem}`,
                onChange: (value: boolean) => {
                  context?.node.setHeightMutable(value);
                }
              }),
              getSchemaTpl('layout:height', {
                visibleOn: `${!isFlexItem || !isFlexColumnItem}`
              }),
              getSchemaTpl('layout:max-height', {
                visibleOn: `${!isFlexItem || !isFlexColumnItem}`
              }),
              getSchemaTpl('layout:min-height', {
                visibleOn: `${!isFlexItem || !isFlexColumnItem}`
              }),
              getSchemaTpl('layout:overflow-y', {
                visibleOn: `${
                  !isFlexItem || !isFlexColumnItem
                } && (this.isFixedHeight || this.style && this.style.maxHeight) || (${
                  isFlexItem && isFlexColumnItem
                } && this.style.flex === '0 0 150px')`
              }),

              getSchemaTpl('layout:isFixedWidth', {
                visibleOn: `${!isFlexItem || isFlexColumnItem}`,
                onChange: (value: boolean) => {
                  if (
                    !isFlexItem ||
                    context.node.parent?.children?.length > 1
                  ) {
                    context?.node.setWidthMutable(value);
                  }
                }
              }),
              getSchemaTpl('layout:width', {
                visibleOn: `${!isFlexItem || isFlexColumnItem}`
              }),
              getSchemaTpl('layout:max-width', {
                visibleOn: `${
                  !isFlexItem || isFlexColumnItem
                } || ${isFlexItem} && this.style.flex !== '0 0 150px'`
              }),
              getSchemaTpl('layout:min-width', {
                visibleOn: `${
                  !isFlexItem || isFlexColumnItem
                } || ${isFlexItem} && this.style.flex !== '0 0 150px'`
              }),

              getSchemaTpl('layout:overflow-x', {
                visibleOn: `${
                  !isFlexItem || isFlexColumnItem
                } && (this.isFixedWidth || this.style && this.style.maxWidth)`
              }),

              !isFlexItem ? getSchemaTpl('layout:margin-center') : null,
              !isFlexItem && !isFreeContainer
                ? getSchemaTpl('layout:textAlign', {
                    name: 'style.textAlign',
                    label: 'Internal alignment',
                    visibleOn:
                      'this.style && this.style.display !== "flex" && this.style.display !== "inline-flex"'
                  })
                : null,
              getSchemaTpl('layout:z-index')
            ]
          },
          getSchemaTpl('status'),
          {
            title: 'Advanced',
            body: [
              getSchemaTpl('layout:position', {
                visibleOn: '!this.stickyStatus'
              }),
              getSchemaTpl('layout:originPosition'),
              getSchemaTpl('layout:inset', {
                mode: 'vertical'
              }),
              getSchemaTpl('layout:sticky', {
                visibleOn:
                  'this.style && (this.style.position !== "fixed" && this.style.position !== "absolute")'
              }),
              getSchemaTpl('layout:stickyPosition')
            ]
          }
        ])
      },
      {
        title: 'Appearance',
        className: 'p-none',
        body: getSchemaTpl('collapseGroup', [
          ...getSchemaTpl('theme:common', {exclude: ['layout']})
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
}

registerEditorPlugin(ContainerPlugin);

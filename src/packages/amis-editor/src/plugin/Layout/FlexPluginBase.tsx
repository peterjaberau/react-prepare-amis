/**
 * @file Flex common layout 1:3
 */
import React from 'react';
import {
  JSONPipeOut,
  LayoutBasePlugin,
  PluginEvent,
  reGenerateID,
  tipedLabel
} from '@/packages/amis-editor-core/src';
import {getSchemaTpl} from '@/packages/amis-editor-core/src';
import {Button, PlainObject} from '@/packages/src';
import type {
  BaseEventContext,
  EditorNodeType,
  RegionConfig,
  RendererJSONSchemaResolveEventContext,
  BasicToolbarItem,
  PluginInterface
} from '@/packages/amis-editor-core/src';
import {Icon} from '@/packages/amis-editor-core/src';
import {JSONChangeInArray, JSONPipeIn, repeatArray} from '@/packages/amis-editor-core/src';
import {isAlive} from 'mobx-state-tree';

//Default column container Schema
export const defaultFlexColumnSchema = (
  title?: string,
  disableFlexBasis: boolean = true
) => {
  let style: PlainObject = {
    position: 'static',
    display: 'block',
    flex: '1 1 auto',
    flexGrow: 1
  };
  if (disableFlexBasis) {
    style.flexBasis = 0;
  }
  return {
    type: 'container',
    body: [],
    size: 'none',
    style,
    wrapperBody: false,
    isFixedHeight: false,
    isFixedWidth: false
  };
};

const defaultFlexPreviewSchema = (title?: string) => {
  return {
    type: 'tpl',
    tpl: title,
    wrapperComponent: '',
    className: 'bg-light center',
    style: {
      display: 'block',
      flex: '1 1 auto',
      flexBasis: 0,
      textAlign: 'center',
      marginRight: 10
    },
    inline: false
  };
};

//Default layout container Schema
const defaultFlexContainerSchema = (
  flexItemSchema: (title?: string) => any = defaultFlexColumnSchema
) => ({
  type: 'flex',
  items: [
    flexItemSchema('first column'),
    flexItemSchema('Second column'),
    flexItemSchema('third column')
  ],
  style: {
    position: 'relative',
    rowGap: '10px',
    columnGap: '10px'
  }
});

export class FlexPluginBase extends LayoutBasePlugin {
  static id = 'FlexPluginBase';
  rendererName = 'flex';
  $schema = '/schemas/FlexSchema.json';
  disabledRendererPlugin = false;

  name = 'Layout container';
  order = -1200;
  isBaseComponent = true;
  icon = 'fa fa-columns';
  pluginIcon = 'flex-container-plugin';
  description =
    'Layout container is a layout effect based on CSS Flex. It has stronger control over the position of child nodes than Grid and HBox, and is easier to use than using CSS classes';
  docLink = '/amis/zh-CN/components/flex';
  tags = ['layout container'];
  scaffold: any = defaultFlexContainerSchema();
  previewSchema = defaultFlexContainerSchema(defaultFlexPreviewSchema);

  panelTitle = 'Layout container';

  panelJustify = true; // The right configuration items are displayed on the left and right by default

  // Set the default layout ratio of the column
  setFlexLayout = (node: EditorNodeType, value: string) => {
    if (/^[\d:]+$/.test(value) && isAlive(node)) {
      let list = value.trim().split(':');
      let children = node.children || [];
      const isColumn = String(node.schema?.style?.flexDirection).includes(
        'column'
      );

      // Update flex layout
      for (let i = 0; i < children.length; i++) {
        let child = children[i];
        child.updateSchemaStyle({
          flexGrow: +list[i],
          width: undefined,
          flexBasis: isColumn ? 'auto' : 0,
          flex: '1 1 auto'
        });
      }

      // Add or delete columns
      if (children.length < list.length) {
        for (let i = 0; i < list.length - children.length; i++) {
          let newColumnSchema = defaultFlexColumnSchema('', !isColumn);
          newColumnSchema.style.flexGrow = +list[i];
          (this.manager as any).addElem(newColumnSchema, true, false);
        }
      } else if (children.length > list.length) {
        // If there are elements in the deleted column, truncate and generate a new flex file and put it behind the component
        const newSchema = JSONPipeIn(JSONPipeOut(node.schema));
        newSchema.items = newSchema.items.slice(list.length);

        node.updateSchema({
          items: node.schema.items.slice(0, list.length)
        });

        if (
          (newSchema.items as PlainObject[]).some(
            (item, index) => item.body?.length
          )
        ) {
          const parent = node.parent;
          this.manager.addChild(
            parent.id,
            parent.region,
            newSchema,
            parent?.children?.[node.index + 1]?.id
          );
        }
      }
    }
    return undefined;
  };

  resetFlexBasis = (node: EditorNodeType, flexSetting: PlainObject = {}) => {
    let schema = node.schema;
    if (
      String(flexSetting.flexDirection).includes('column') &&
      !schema?.style?.height
    ) {
      (node.children || []).forEach(child => {
        if (
          !child.schema?.style?.height ||
          /^0/.test(child.schema?.style?.flexBasis)
        ) {
          child.updateSchemaStyle({
            flexBasis: undefined
          });
        }
      });
    }
  };

  insertItem = (node: EditorNodeType, direction: string) => {
    if (node.info?.plugin !== this) {
      return;
    }
    const store = this.manager.store;
    const newSchema = JSONPipeIn(JSONPipeOut(node.schema));

    const parent = node.parent;
    const nextId =
      direction === 'upper' ? node.id : parent?.children?.[node.index + 1]?.id;
    const child = this.manager.addChild(
      parent.id,
      parent.region,
      newSchema,
      nextId
    );
    if (child) {
      // mobx modifies data asynchronously
      setTimeout(() => {
        store.setActiveId(child.$$id);
      }, 100);
    }
  };

  panelBodyCreator = (context: BaseEventContext) => {
    const curRendererSchema = context?.schema || {};
    const isRowContent =
      curRendererSchema?.direction === 'row' ||
      curRendererSchema?.direction === 'row-reverse';
    const isFlexContainer = this.manager?.isFlexContainer(context?.id);
    const isFlexItem = this.manager?.isFlexItem(context?.id);
    const isFlexColumnItem = this.manager?.isFlexColumnItem(context?.id);
    // Determine whether it is an adsorption container
    const isSorptionContainer = curRendererSchema?.isSorptionContainer || false;
    const flexDirection = context.node?.schema?.style?.flexDirection || 'row';

    const positionTpl = [
      getSchemaTpl('layout:position', {
        visibleOn: '!this.stickyStatus'
      }),
      getSchemaTpl('layout:originPosition'),
      getSchemaTpl('layout:inset', {
        mode: 'vertical'
      })
    ];

    return [
      getSchemaTpl('tabs', [
        {
          title: 'Attributes',
          className: 'p-none',
          body: [
            getSchemaTpl('collapseGroup', [
              {
                title: 'Basics',
                body: [
                  context.node &&
                    getSchemaTpl('layout:flex-layout', {
                      name: 'layout',
                      label: 'Quick layout settings',
                      flexDirection,
                      strictMode: false,
                      pipeIn: () => {
                        if (isAlive(context.node)) {
                          let children = context.node?.children || [];
                          if (
                            children.every(
                              item => item.schema?.style?.flex === '1 1 auto'
                            )
                          ) {
                            return children
                              .map(item => item.schema?.style?.flexGrow || 1)
                              .join(':');
                          }
                        }
                        return undefined;
                      },
                      pipeOut: (value: string) =>
                        this.setFlexLayout(context.node, value)
                    }),

                  {
                    type: 'wrapper',
                    size: 'none',
                    className: 'grid grid-cols-2 gap-4 mb-4',
                    body: [
                      {
                        children: (
                          <Button
                            size="sm"
                            onClick={() =>
                              this.insertItem(context.node, 'under')
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
                              this.insertItem(context.node, 'upper')
                            }
                          >
                            <Icon className="icon" icon="top-arrow-to-top" />
                            <span>Insert new line above</span>
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

                  getSchemaTpl('layout:flex-setting', {
                    label: 'Internal alignment settings',
                    direction: curRendererSchema.direction,
                    justify: curRendererSchema.justify || 'center',
                    alignItems: curRendererSchema.alignItems,
                    pipeOut: (value: any) => {
                      // Remove the flexBasis of 0 from the non-fixed height flex container child elements arranged vertically
                      this.resetFlexBasis(context.node, value);
                      return value;
                    }
                  }),

                  getSchemaTpl('layout:flex-wrap'),

                  getSchemaTpl('layout:flex-basis', {
                    label: 'row interval',
                    tooltip:
                      'The spacing between internal containers when arranged vertically',
                    name: 'style.rowGap'
                  }),
                  getSchemaTpl('layout:flex-basis', {
                    label: 'column interval',
                    tooltip:
                      'The spacing between internal containers when arranged horizontally',
                    name: 'style.columnGap'
                  }),

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
                          label: isFlexColumnItem
                            ? 'Fixed height'
                            : 'Fixed width',
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
                      context?.node.setWidthMutable(value);
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
                  getSchemaTpl('layout:z-index'),
                  !isSorptionContainer &&
                    getSchemaTpl('layout:sticky', {
                      visibleOn:
                        'this.style && (this.style.position !== "fixed" && this.style.position !== "absolute")'
                    }),
                  getSchemaTpl('layout:stickyPosition')
                ]
              },
              getSchemaTpl('status'),
              {
                title: 'Advanced',
                body: [
                  isSorptionContainer ? getSchemaTpl('layout:sorption') : null,
                  // The adsorption container does not display positioning related configuration items
                  ...(isSorptionContainer ? [] : positionTpl)
                ]
              }
            ])
          ]
        },
        {
          title: 'Appearance',
          className: 'p-none',
          body: getSchemaTpl('collapseGroup', [
            ...getSchemaTpl('theme:common', {exclude: ['layout']})
          ])
        }
      ])
    ];
  };

  regions: Array<RegionConfig> = [
    {
      key: 'items',
      label: 'child node collection'
    }
  ];

  buildEditorToolbar(
    {id, info, schema, node}: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) {
    // const store = this.manager.store;
    const parent = node.parent?.schema; // 或者 store.getSchemaParentById(id, true);
    const draggableContainer = this.manager.draggableContainer(id);
    const isFlexItem = this.manager?.isFlexItem(id);
    const isFlexColumnItem = this.manager?.isFlexColumnItem(id);
    const newColumnSchema = isFlexColumnItem
      ? defaultFlexColumnSchema('', false)
      : defaultFlexColumnSchema();
    const canAppendSiblings = this.manager?.canAppendSiblings();
    const toolbarsTooltips: any = {};
    toolbars.forEach(toolbar => {
      if (toolbar.tooltip) {
        toolbarsTooltips[toolbar.tooltip] = 1;
      }
    });

    if (
      parent &&
      (info.renderer?.name === 'flex' || info.renderer?.name === 'container') &&
      !draggableContainer &&
      !schema?.isFreeContainer
    ) {
      // Non-special layout elements (fixed, absolute) support the function of inserting additional layout elements before and after icon
      // Note: If it is a column-level element, it does not need to be displayed
      if (
        !toolbarsTooltips['Insert layout container above'] &&
        !isFlexItem &&
        canAppendSiblings
      ) {
        toolbars.push(
          {
            iconSvg: 'add-btn',
            tooltip: 'Insert layout container above',
            level: 'special',
            placement: 'right',
            className: 'ae-InsertBefore is-vertical',
            onClick: () =>
              this.manager.appendSiblingSchema(
                defaultFlexContainerSchema(),
                true,
                true
              )
          },
          {
            iconSvg: 'add-btn',
            tooltip: 'Insert layout container below',
            level: 'special',
            placement: 'right',
            className: 'ae-InsertAfter is-vertical',
            onClick: () =>
              this.manager.appendSiblingSchema(
                defaultFlexContainerSchema(),
                false,
                true
              )
          }
        );
      }

      //Insert child elements in the upper right corner of the layout container
      if (info.renderer?.name === 'flex') {
        if (!toolbarsTooltips['Add column-level elements']) {
          toolbars.push({
            iconSvg: 'add-btn',
            tooltip: 'Add column-level element',
            level: 'special',
            placement: 'bottom',
            className: 'ae-AppendChild',
            onClick: () =>
              (this.manager as any).addElem(defaultFlexColumnSchema('', true))
          });
        }
      }
    }

    if (
      parent &&
      (parent.type === 'flex' || parent.type === 'container') &&
      isFlexItem &&
      !draggableContainer &&
      canAppendSiblings
    ) {
      if (
        !toolbarsTooltips[
          `${isFlexColumnItem ? 'above' : 'left'}Insert column-level container`
        ]
      ) {
        // Add left and right insert icons to the column-level elements of the layout container
        toolbars.push(
          {
            iconSvg: 'add-btn',
            tooltip: `${
              isFlexColumnItem ? 'above' : 'left'
            }Insert column-level container`,
            level: 'special',
            placement: 'right',
            className: isFlexColumnItem
              ? 'ae-InsertBefore is-vertical'
              : 'ae-InsertBefore',
            onClick: () =>
              this.manager.appendSiblingSchema(newColumnSchema, true, true)
          },
          {
            iconSvg: 'add-btn',
            tooltip: `${
              isFlexColumnItem ? 'below' : 'right'
            } insert column-level container`,
            level: 'special',
            placement: isFlexColumnItem ? 'right' : 'left',
            className: isFlexColumnItem
              ? 'ae-InsertAfter is-vertical'
              : 'ae-InsertAfter',
            onClick: () =>
              this.manager.appendSiblingSchema(newColumnSchema, false, true)
          }
        );
      }
    }
  }

  afterResolveJsonSchema(
    event: PluginEvent<RendererJSONSchemaResolveEventContext>
  ) {
    const context = event.context;
    const parent = context.node.parent?.host as EditorNodeType;

    if (parent?.info?.plugin === this) {
      event.setData('/schemas/FlexColumn.json');
    }
  }
}

import {Button, JSONValueMap, isObject} from 'amis';
import React from 'react';
import {EditorNodeType, registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {
  BaseEventContext,
  BasePlugin,
  BasicPanelItem,
  BasicRendererInfo,
  BasicToolbarItem,
  ContextMenuEventContext,
  ContextMenuItem,
  PluginInterface,
  RegionConfig,
  RendererInfo,
  RendererInfoResolveEventContext
} from '@/packages/amis-editor-core/src';
import {defaultValue, getSchemaTpl} from '@/packages/amis-editor-core/src';
import {diff, JSONPipeOut, repeatArray} from '@/packages/amis-editor-core/src';
import set from 'lodash/set';
import merge from 'lodash/merge';
import {escapeFormula, generateId, resolveArrayDatasource} from '../util';

export class CardsPlugin extends BasePlugin {
  static id = 'CardsPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'cards';
  $schema = '/schemas/CardsSchema.json';

  // Component name
  name = 'Card List';
  isBaseComponent = true;
  isListComponent = true;
  memberImmutable = true;
  description =
    'The function is similar to a table, but it uses small cards to display data. The current component needs to configure the data source and does not have its own data pull. Please use the "CRUD" component first. ';
  searchKeywords = 'Card Deck';
  docLink = '/amis/zh-CN/components/cards';
  tags = ['show'];
  icon = 'fa fa-window-maximize';
  pluginIcon = 'cards-plugin';
  scaffold = {
    type: 'cards',
    columnsCount: 4,
    card: {
      type: 'container',
      body: [
        {
          type: 'container',
          body: [
            {
              type: 'icon',
              icon: 'fa fa-check',
              vendor: '',
              themeCss: {
                className: {
                  'font': {
                    color: 'var(--colors-brand-6)',
                    fontSize: '20px'
                  },
                  'padding-and-margin:default': {
                    marginRight: '10px'
                  }
                }
              },
              id: generateId()
            },
            {
              type: 'tpl',
              tpl: 'Pipeline task instance',
              inline: true,
              wrapperComponent: '',
              editorSetting: {
                mock: {}
              },
              style: {},
              themeCss: {
                baseControlClassName: {
                  'font:default': {
                    fontSize: 'var(--fonts-size-6)',
                    color: 'var(--colors-neutral-text-2)',
                    fontWeight: 'var(--fonts-weight-3)'
                  }
                }
              },
              id: generateId()
            }
          ],
          style: {
            position: 'static',
            display: 'flex',
            flexWrap: 'nowrap',
            alignItems: 'center'
          },
          wrapperBody: false,
          isFixedHeight: false,
          isFixedWidth: false,
          size: 'none',
          themeCss: {
            baseControlClassName: {
              'padding-and-margin:default': {
                marginBottom: '15px'
              }
            }
          },
          id: generateId()
        },
        {
          type: 'flex',
          className: 'p-1',
          items: [
            {
              type: 'container',
              body: [
                {
                  type: 'container',
                  body: [
                    {
                      type: 'tpl',
                      tpl: '12/',
                      inline: true,
                      wrapperComponent: '',
                      style: {},
                      themeCss: {
                        baseControlClassName: {
                          'font:default': {
                            fontSize: 'var(--fonts-size-6)',
                            color: 'var(--colors-neutral-text-2)',
                            fontWeight: 'var(--fonts-weight-3)'
                          }
                        }
                      },
                      id: generateId()
                    },
                    {
                      type: 'tpl',
                      tpl: '19',
                      inline: true,
                      wrapperComponent: '',
                      style: {},
                      themeCss: {
                        baseControlClassName: {
                          'font:default': {
                            color: 'var(--colors-neutral-text-6)',
                            fontSize: 'var(--fonts-size-6)'
                          }
                        }
                      },
                      id: generateId()
                    }
                  ],
                  style: {
                    position: 'static',
                    display: 'block',
                    flex: '0 0 auto'
                  },
                  wrapperBody: false,
                  isFixedWidth: false,
                  size: 'none',
                  themeCss: {
                    baseControlClassName: {
                      'padding-and-margin:default': {
                        marginTop: 'var(--sizes-size-0)',
                        marginRight: 'var(--sizes-size-0)',
                        marginBottom: 'var(--sizes-size-0)',
                        marginLeft: 'var(--sizes-size-0)'
                      }
                    }
                  },
                  id: generateId()
                },
                {
                  type: 'container',
                  body: [
                    {
                      type: 'tpl',
                      tpl: 'Unit Test',
                      inline: true,
                      wrapperComponent: '',
                      style: {},
                      themeCss: {
                        baseControlClassName: {
                          'font:default': {
                            color: 'var(--colors-neutral-text-5)'
                          }
                        }
                      },
                      id: generateId()
                    }
                  ],
                  style: {
                    position: 'static',
                    display: 'flex',
                    flexWrap: 'nowrap',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: '0 0 auto'
                  },
                  wrapperBody: false,
                  isFixedHeight: false,
                  isFixedWidth: false,
                  size: 'none',
                  id: generateId()
                }
              ],
              size: 'xs',
              style: {
                position: 'static',
                display: 'flex',
                flex: '1 1 auto',
                flexGrow: 1,
                flexBasic: 'auto',
                flexWrap: 'nowrap',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              },
              wrapperBody: false,
              isFixedHeight: false,
              isFixedWidth: false,
              id: generateId()
            },
            {
              type: 'container',
              body: [
                {
                  type: 'tpl',
                  tpl: '100%',
                  inline: true,
                  wrapperComponent: '',
                  style: {},
                  themeCss: {
                    baseControlClassName: {
                      'font:default': {
                        fontSize: 'var(--fonts-size-6)',
                        color: 'var(--colors-neutral-text-2)',
                        fontWeight: 'var(--fonts-weight-3)'
                      }
                    }
                  },
                  id: generateId()
                },
                {
                  type: 'tpl',
                  tpl: 'Pass rate',
                  inline: true,
                  wrapperComponent: '',
                  style: {},
                  themeCss: {
                    baseControlClassName: {
                      'font:default': {
                        color: 'var(--colors-neutral-text-5)'
                      }
                    }
                  },
                  id: generateId()
                }
              ],
              size: 'xs',
              style: {
                position: 'static',
                display: 'flex',
                flex: '1 1 auto',
                flexGrow: 1,
                flexBasic: 'auto',
                flexWrap: 'nowrap',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center'
              },
              wrapperBody: false,
              isFixedHeight: false,
              isFixedWidth: false,
              id: generateId()
            },
            {
              type: 'container',
              body: [
                {
                  type: 'tpl',
                  tpl: '99.9%',
                  inline: true,
                  wrapperComponent: '',
                  style: {},
                  themeCss: {
                    baseControlClassName: {
                      'font:default': {
                        fontSize: 'var(--fonts-size-6)',
                        color: 'var(--colors-neutral-text-2)',
                        fontWeight: 'var(--fonts-weight-3)'
                      }
                    }
                  },
                  id: generateId()
                },
                {
                  type: 'tpl',
                  tpl: 'Task instance',
                  inline: true,
                  wrapperComponent: '',
                  style: {},
                  themeCss: {
                    baseControlClassName: {
                      'font:default': {
                        color: 'var(--colors-neutral-text-5)'
                      }
                    }
                  },
                  id: generateId()
                }
              ],
              size: 'xs',
              style: {
                position: 'static',
                display: 'flex',
                flex: '1 1 auto',
                flexGrow: 1,
                flexBasic: 'auto',
                flexWrap: 'nowrap',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
              },
              wrapperBody: false,
              isFixedHeight: false,
              isFixedWidth: false,
              id: generateId()
            }
          ],
          style: {
            position: 'relative'
          },
          id: generateId()
        },
        {
          type: 'container',
          body: [
            {
              type: 'tpl',
              tpl: 'Report',
              inline: true,
              wrapperComponent: '',
              style: {},
              themeCss: {
                baseControlClassName: {
                  'font:default': {
                    fontSize: '14px',
                    color: 'var(--colors-neutral-text-5)'
                  }
                }
              },
              id: generateId()
            },
            {
              type: 'tpl',
              tpl: '2023-01-01 12:00',
              inline: true,
              wrapperComponent: '',
              style: {},
              themeCss: {
                baseControlClassName: {
                  'font:default': {
                    fontSize: '12px',
                    color: 'var(--colors-neutral-text-6)'
                  }
                }
              },
              id: generateId()
            }
          ],
          style: {
            position: 'static',
            display: 'flex',
            flexWrap: 'nowrap',
            justifyContent: 'space-between'
          },
          wrapperBody: false,
          isFixedHeight: false,
          isFixedWidth: false,
          themeCss: {
            baseControlClassName: {
              'padding-and-margin:default': {
                marginTop: '20px'
              }
            }
          },
          id: generateId()
        }
      ],
      size: 'none',
      style: {
        position: 'static',
        display: 'block',
        flex: '0 0 150px',
        flexBasis: '100%'
      },
      wrapperBody: false,
      isFixedHeight: false,
      isFixedWidth: true,
      onEvent: {
        click: {
          weight: 0,
          actions: []
        }
      },
      themeCss: {
        baseControlClassName: {
          'radius:default': {
            'top-left-border-radius': '6px',
            'top-right-border-radius': '6px',
            'bottom-left-border-radius': '6px',
            'bottom-right-border-radius': '6px'
          },
          'border:default': {
            'top-border-width': 'var(--borders-width-4)',
            'left-border-width': 'var(--borders-width-2)',
            'right-border-width': 'var(--borders-width-2)',
            'bottom-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'left-border-style': 'var(--borders-style-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'top-border-color': 'var(--colors-brand-6)',
            'left-border-color': 'var(--colors-brand-10)',
            'right-border-color': 'var(--colors-brand-10)',
            'bottom-border-color': 'var(--colors-brand-10)'
          },
          'padding-and-margin:default': {
            paddingTop: '10px',
            paddingRight: '10px',
            paddingBottom: '10px',
            paddingLeft: '10px',
            marginRight: '15px'
          }
        }
      },
      id: generateId()
    },
    placeholder: '',
    name: '',
    style: {
      boysX: 15,
      gutterY: 15
    },
    id: generateId()
  };
  previewSchema = {
    ...this.scaffold,
    className: 'text-left',
    name: 'items',
    columnsCount: 2,
    style: {
      ...this.scaffold.style,
      transform: 'scale(0.5)',
      width: '600px',
      transformOrigin: 'left top'
    },
    items: [{}, {}, {}, {}]
  };

  panelTitle = 'Card Set';
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    const isCRUDBody = context.schema.type === 'crud';
    const curPosition = context?.schema?.style?.position;
    const isAbsolute = curPosition === 'fixed' || curPosition === 'absolute';

    return [
      getSchemaTpl('tabs', [
        {
          title: 'Attributes',
          body: getSchemaTpl('collapseGroup', [
            {
              title: 'Basic',
              body: [
                {
                  type: 'input-text',
                  label: 'component name',
                  name: 'editorSetting.displayName'
                },
                isCRUDBody
                  ? null
                  : getSchemaTpl('formItemName', {
                      label: 'Bound field name'
                    }),
                getSchemaTpl('cardsPlaceholder')
              ]
            },
            getSchemaTpl('status')
          ])
        },
        {
          title: 'Appearance',
          body: getSchemaTpl('collapseGroup', [
            {
              title: 'Component',
              body: [
                {
                  name: 'columnsCount',
                  type: 'input-range',
                  visibleOn: '!this.leftFixed',
                  min: 0,
                  max: 12,
                  step: 1,
                  label: 'Number of rows',
                  description:
                    'When not set, it is determined by the card CSS class name'
                },
                {
                  type: 'input-number',
                  label: 'left and right spacing',
                  name: 'style.gutterX'
                },
                {
                  type: 'input-number',
                  label: 'upper and lower spacing',
                  name: 'style.gutterY'
                },
                getSchemaTpl('switch', {
                  name: 'masonryLayout',
                  label: 'Enable waterfall flow'
                }),
                getSchemaTpl('layout:originPosition', {
                  visibleOn: isAbsolute ? isAbsolute : undefined,
                  value: 'left-top'
                })
              ]
            },
            ...getSchemaTpl('theme:common', {exclude: ['layout']})
          ])
        }
      ])
    ];
  };

  buildDataSchemas(node: EditorNodeType, region: EditorNodeType) {
    let dataSchema: any = {
      $id: 'cards',
      type: 'object',
      title: 'Current list item',
      properties: {}
    };

    let match =
      node.schema.source && String(node.schema.source).match(/{([\w-_]+)}/);
    let field = node.schema.name || match?.[1];
    const scope = this.manager.dataSchema.getScope(`${node.id}-${node.type}`);

    if (scope) {
      const origin = this.manager.dataSchema.current;
      this.manager.dataSchema.switchTo(scope.parent!);
      const schema = this.manager.dataSchema.getSchemaByPath(field);
      this.manager.dataSchema.switchTo(origin);
      if (isObject(schema?.items)) {
        dataSchema = {
          ...dataSchema,
          ...(schema!.items as any)
        };

        // Add serial numbers to the list for easy processing
        set(dataSchema, 'properties.index', {
          type: 'number',
          title: 'Index'
        });
      }
    }

    return dataSchema;
  }

  filterProps(props: any, node: EditorNodeType) {
    // Display two lines of fake data when editing
    const count = (props.columnsCount || 3) * 2;
    if (!node.state.value) {
      node.updateState({
        value: repeatArray({}, count).map((item, index) => {
          return {
            ...item,
            id: index + 1
          };
        })
      });
    }

    props.className = `${props.className || ''} ae-Editor-list`;
    props.itemsClassName = `${props.itemsClassName || ''} cards-items`;
    if (props.card && !props.card.className?.includes('listItem')) {
      props.card = merge(
        {
          className: `${props.card.className || ''} ae-Editor-listItem`
        },
        props.card
      );
    }

    // The text element in the list type displays the original formula
    props = escapeFormula(props);

    return props;
  }

  getRendererInfo(
    context: RendererInfoResolveEventContext
  ): BasicRendererInfo | void {
    const plugin: PluginInterface = this;
    const {renderer, schema} = context;
    if (
      !schema.$$id &&
      schema.$$editor?.renderer.name === 'crud' &&
      renderer.name === 'cards'
    ) {
      return {
        ...({id: schema.$$editor.id} as any),
        name: plugin.name!,
        regions: plugin.regions,
        patchContainers: plugin.patchContainers,
        vRendererConfig: plugin.vRendererConfig,
        wrapperProps: plugin.wrapperProps,
        wrapperResolve: plugin.wrapperResolve,
        filterProps: plugin.filterProps,
        $schema: plugin.$schema,
        renderRenderer: plugin.renderRenderer,
        memberImmutable: plugin.memberImmutable
      };
    }

    return super.getRendererInfo(context);
  }
}

registerEditorPlugin(CardsPlugin);

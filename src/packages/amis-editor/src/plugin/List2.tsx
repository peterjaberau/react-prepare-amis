import {Button, JSONValueMap, isObject} from 'amis';
import React from 'react';
import {EditorNodeType, registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {
  BaseEventContext,
  BasePlugin,
  BasicRendererInfo,
  PluginInterface,
  RendererInfoResolveEventContext
} from '@/packages/amis-editor-core/src';
import {defaultValue, getSchemaTpl} from '@/packages/amis-editor-core/src';
import {repeatArray} from '@/packages/amis-editor-core/src';
import set from 'lodash/set';
import {escapeFormula, generateId, resolveArrayDatasource} from '../util';
import merge from 'lodash/merge';

export class List2Plugin extends BasePlugin {
  static id = 'List2Plugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'cards';
  $schema = '/schemas/CardsSchema.json';

  // Component name
  name = 'list';
  isBaseComponent = true;
  isListComponent = true;
  memberImmutable = true;
  description =
    'The function is similar to a table, but it uses small cards to display data. The current component needs to configure the data source and does not have its own data pull. Please use the "CRUD" component first. ';
  docLink = '/amis/zh-CN/components/cards';
  tags = ['show'];
  icon = 'fa fa-window-maximize';
  pluginIcon = 'cards-plugin';
  scaffold = {
    type: 'cards',
    columnsCount: 1,
    card: {
      type: 'container',
      body: [
        {
          type: 'container',
          body: [
            {
              type: 'tpl',
              tpl: '01',
              inline: true,
              wrapperComponent: '',
              style: {},
              themeCss: {
                baseControlClassName: {
                  'padding-and-margin:default': {
                    marginRight: '10px'
                  },
                  'font:default': {
                    color: 'var(--colors-neutral-text-2)',
                    fontSize: 'var(--fonts-size-3)',
                    fontWeight: 'var(--fonts-weight-5)'
                  }
                }
              },
              id: generateId()
            },
            {
              type: 'tpl',
              tpl: '/',
              inline: true,
              wrapperComponent: '',
              style: {},
              id: generateId(),
              themeCss: {
                baseControlClassName: {
                  'padding-and-margin:default': {
                    marginRight: '10px'
                  },
                  'font:default': {
                    fontSize: 'var(--fonts-size-3)',
                    color: '#cccccc'
                  }
                }
              }
            },
            {
              type: 'container',
              body: [
                {
                  type: 'tpl',
                  tpl: 'March',
                  inline: true,
                  wrapperComponent: '',
                  style: {},
                  themeCss: {
                    baseControlClassName: {
                      'font:default': {
                        fontSize: 'var(--fonts-size-6)'
                      }
                    }
                  },
                  id: generateId()
                },
                {
                  type: 'tpl',
                  tpl: '2023',
                  inline: true,
                  wrapperComponent: '',
                  style: {},
                  themeCss: {
                    baseControlClassName: {
                      'font:default': {
                        fontSize: 'var(--fonts-size-6)'
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
                alignItems: 'center',
                justifyContent: 'center'
              },
              wrapperBody: false,
              isFixedHeight: false,
              isFixedWidth: false,
              id: generateId()
            }
          ],
          size: 'none',
          style: {
            position: 'static',
            display: 'flex',
            flex: '1 1 auto',
            flexGrow: 0,
            flexBasic: 'auto',
            flexWrap: 'nowrap',
            justifyContent: 'flex-start',
            alignItems: 'center'
          },
          wrapperBody: false,
          isFixedHeight: false,
          isFixedWidth: false,
          themeCss: {
            baseControlClassName: {
              'border:default': {
                'right-border-width': 'var(--borders-width-2)',
                'right-border-style': 'var(--borders-style-2)',
                'right-border-color': '#ececec'
              },
              'padding-and-margin:default': {
                paddingLeft: '20px',
                paddingRight: '40px',
                marginRight: '40px'
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
              tpl: 'List title',
              inline: true,
              wrapperComponent: '',
              style: {},
              maxLine: 1,
              id: generateId(),
              themeCss: {
                baseControlClassName: {
                  'padding-and-margin:default': {
                    marginBottom: '10px'
                  },
                  'font:default': {
                    fontSize: 'var(--fonts-size-5)',
                    color: 'var(--colors-neutral-text-4)',
                    fontWeight: 'var(--fonts-weight-4)'
                  }
                }
              }
            },
            {
              type: 'tpl',
              tpl: 'This is the content introduction, you can set the number of lines to display',
              inline: true,
              wrapperComponent: '',
              maxLine: 1,
              style: {},
              themeCss: {
                baseControlClassName: {
                  'font:default': {
                    fontSize: '13px',
                    color: 'var(--colors-neutral-text-5)'
                  }
                }
              },
              id: generateId()
            }
          ],
          size: 'none',
          style: {
            position: 'static',
            display: 'flex',
            flex: '1 1 auto',
            flexGrow: 1,
            flexBasic: 'auto',
            flexWrap: 'nowrap',
            flexDirection: 'column',
            alignItems: 'flex-start'
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
              type: 'button',
              label: 'View details',
              onEvent: {
                click: {
                  actions: []
                }
              },
              level: 'default',
              size: 'default',
              themeCss: {
                className: {
                  'border:default': {
                    'top-border-width': 'var(--borders-width-2)',
                    'left-border-width': 'var(--borders-width-2)',
                    'right-border-width': 'var(--borders-width-2)',
                    'bottom-border-width': 'var(--borders-width-2)',
                    'top-border-style': 'var(--borders-style-2)',
                    'left-border-style': 'var(--borders-style-2)',
                    'right-border-style': 'var(--borders-style-2)',
                    'bottom-border-style': 'var(--borders-style-2)',
                    'top-border-color': 'var(--colors-brand-6)',
                    'left-border-color': 'var(--colors-brand-6)',
                    'right-border-color': 'var(--colors-brand-6)',
                    'bottom-border-color': 'var(--colors-brand-6)'
                  },
                  'padding-and-margin:default': {
                    paddingLeft: '20px',
                    paddingRight: '20px'
                  },
                  'radius:default': {
                    'top-left-border-radius': '20px',
                    'top-right-border-radius': '20px',
                    'bottom-left-border-radius': '20px',
                    'bottom-right-border-radius': '20px'
                  },
                  'font:default': {
                    color: 'var(--colors-brand-6)'
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
            flexGrow: 0,
            flexBasic: 'auto',
            flexWrap: 'nowrap',
            flexDirection: 'column',
            justifyContent: 'center'
          },
          wrapperBody: false,
          isFixedHeight: false,
          isFixedWidth: false,
          id: generateId()
        }
      ],
      wrapperBody: false,
      style: {
        position: 'relative',
        display: 'flex',
        width: '100%'
      },
      themeCss: {
        baseControlClassName: {
          'radius:default': {
            'top-left-border-radius': '6px',
            'top-right-border-radius': '6px',
            'bottom-left-border-radius': '6px',
            'bottom-right-border-radius': '6px'
          },
          'boxShadow:default': ' 0px 0px 10px 0px var(--colors-neutral-line-8)',
          'border:default': {
            'top-border-width': 'var(--borders-width-1)',
            'left-border-width': 'var(--borders-width-1)',
            'right-border-width': 'var(--borders-width-1)',
            'bottom-border-width': 'var(--borders-width-1)',
            'top-border-style': 'var(--borders-style-1)',
            'left-border-style': 'var(--borders-style-1)',
            'right-border-style': 'var(--borders-style-1)',
            'bottom-border-style': 'var(--borders-style-1)',
            'top-border-color': '#3be157',
            'left-border-color': '#3be157',
            'right-border-color': '#3be157',
            'bottom-border-color': '#3be157'
          },
          'padding-and-margin:default': {
            paddingTop: '10px',
            paddingRight: '10px',
            paddingBottom: '10px',
            paddingLeft: '10px'
          }
        }
      },
      id: generateId()
    },
    placeholder: '',
    style: {
      gutterY: 10
    },
    id: generateId()
  };

  previewSchema = {
    ...this.scaffold,
    className: 'text-left ',
    items: [{}, {}, {}],
    style: {
      gutterY: 10,
      transform: 'scale(0.7)',
      width: '1200px',
      transformOrigin: 'left top'
    },
    name: 'items'
  };

  panelTitle = 'List';
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
                  min: 1,
                  max: 12,
                  step: 1,
                  label: 'Number of rows'
                },
                {
                  type: 'input-number',
                  label: 'left and right spacing',
                  name: 'style.gutterX',
                  visibleOn: 'this.columnsCount > 1'
                },
                {
                  type: 'input-number',
                  label: 'upper and lower spacing',
                  name: 'style.gutterY'
                },
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

registerEditorPlugin(List2Plugin);

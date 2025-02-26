import {ContainerWrapper, JSONPipeOut} from '@/packages/amis-editor-core/src';
import {registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {
  BaseEventContext,
  BasePlugin,
  getSchemaTpl,
  defaultValue
} from '@/packages/amis-editor-core/src';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../renderer/event-control/helper';
import {RendererPluginAction, RendererPluginEvent} from '@/packages/amis-editor-core/src';
import type {SchemaObject} from '@/packages/amis/src';
import {tipedLabel} from '@/packages/amis-editor-core/src';
import {jsonToJsonSchema, EditorNodeType} from '@/packages/amis-editor-core/src';
import omit from 'lodash/omit';
import {generateId} from '../util';
import {InlineEditableElement} from '@/packages/amis-editor-core/src';

export class PagePlugin extends BasePlugin {
  static id = 'PagePlugin';
  // Associated renderer name
  rendererName = 'page';
  $schema = '/schemas/PageSchema.json';

  // Component name
  name = 'Page';
  isBaseComponent = true;
  // This page component is only used at the top level
  disabledRendererPlugin = true;
  description =
    'Page renderer, the top-level entry of the page. Contains multiple areas, you can choose to place different renderers in different areas. ';
  docLink = '/friends/zh-CN/components/page';
  tags = 'container';
  icon = 'fa fa-desktop';
  // pluginIcon = 'page-plugin'; // No new icon yet
  scaffold: SchemaObject = {
    type: 'page',
    regions: ['body'],
    body: [
      {
        type: 'tpl',
        tpl: 'content',
        id: generateId()
      }
    ]
  };
  previewSchema: SchemaObject = {
    type: 'page',
    className: 'text-left b-a',
    asideClassName: 'w-xs',
    title: 'Title',
    subTitle: 'Subtitle',
    aside: 'Sidebar',
    body: 'content'
  };

  events: RendererPluginEvent[] = [
    {
      eventName: 'init',
      eventLabel: 'Initialization',
      description:
        'Triggered when a component instance is created and inserted into the DOM',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              description:
                'The current data domain, you can read the corresponding value through the field name'
            }
          }
        }
      ]
    },
    {
      eventName: 'inited',
      eventLabel: 'Initialization data interface request completed',
      description:
        'Triggered when the remote initialization data interface request is completed',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                responseData: {
                  type: 'object',
                  title: 'Response data'
                },
                responseStatus: {
                  type: 'number',
                  title: 'Response status (0 means success)'
                },
                responseMsg: {
                  type: 'string',
                  title: 'Response message'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'pullRefresh',
      eventLabel: 'Pull down to refresh',
      description:
        'After the pull-down refresh is turned on, it is triggered after the pull-down is released (only for mobile devices)'
    }
  ];

  //Action definition
  actions: RendererPluginAction[] = [
    {
      actionType: 'reload',
      actionLabel: 'Reload',
      description: 'Trigger component data refresh and re-rendering',
      ...getActionCommonProps('reload')
    },
    {
      actionType: 'setValue',
      actionLabel: 'Variable assignment',
      description: 'Trigger component data update',
      ...getActionCommonProps('setValue')
    }
  ];

  // Ordinary container class renderer configuration
  regions = [
    {key: 'toolbar', label: 'Toolbar', preferTag: 'Toolbar content'},
    {key: 'aside', label: 'Sidebar', placeholder: 'Sidebar content'},
    {key: 'body', label: 'Content area', placeholder: 'Page content'}
  ];

  // Define elements that can be edited inline
  inlineEditableElements: Array<InlineEditableElement> = [
    {
      match: '.cxd-Page-title',
      key: 'title'
    },
    {
      match: '.cxd-Page-subTitle',
      key: 'subTitle'
    }
  ];

  wrapper = ContainerWrapper;

  panelTitle = 'Page';
  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    return [
      getSchemaTpl('tabs', [
        {
          title: 'Attributes',
          body: [
            getSchemaTpl('collapseGroup', [
              {
                title: 'Basic',
                body: [
                  {
                    type: 'checkboxes',
                    name: 'regions',
                    label: 'Regional display',
                    pipeIn: (value: any) =>
                      Array.isArray(value)
                        ? value
                        : ['body', 'toolbar', 'aside', 'header'],
                    pipeOut: (value: any) => {
                      return Array.isArray(value) && value.length
                        ? value
                        : ['body', 'toolbar', 'aside', 'header'];
                    },
                    joinValues: false,
                    extractValue: true,
                    inline: false,
                    options: [
                      {
                        label: 'Content area',
                        value: 'body'
                      },
                      {
                        label: 'Title bar',
                        value: 'header'
                      },
                      {
                        label: 'Toolbar',
                        value: 'toolbar'
                      },
                      {
                        label: 'Sidebar',
                        value: 'aside'
                      }
                    ]
                  },
                  getSchemaTpl('pageTitle'),
                  getSchemaTpl('pageSubTitle'),
                  getSchemaTpl('remark', {
                    label: 'Title Tip',
                    hiddenOn:
                      'this.regions && !this.regions.includes("header") || !this.title'
                  }),
                  {
                    type: 'ae-Switch-More',
                    name: 'asideResizor',
                    mode: 'normal',
                    label: 'Sidebar width is adjustable',
                    hiddenOn: 'this.regions && !this.regions.includes("aside")',
                    value: false,
                    hiddenOnDefault: true,
                    formType: 'extend',
                    form: {
                      body: [
                        {
                          type: 'input-number',
                          label: 'Minimum width',
                          min: 0,
                          name: 'asideMinWidth',
                          pipeIn: defaultValue(160),
                          pipeOut: (value: any) => value || 0
                        },
                        {
                          type: 'input-number',
                          label: 'maximum width',
                          min: 0,
                          name: 'asideMaxWidth',
                          pipeIn: defaultValue(350),
                          pipeOut: (value: any) => value || 0
                        }
                      ]
                    }
                  },
                  {
                    type: 'switch',
                    label: tipedLabel(
                      'Sidebar fixed',
                      'Whether the sidebar content is fixed, that is, it does not scroll with the content area'
                    ),
                    name: 'asideSticky',
                    inputClassName: 'is-inline',
                    pipeIn: defaultValue(true),
                    hiddenOn: 'this.regions && !this.regions.includes("aside")'
                  },
                  {
                    type: 'button-group-select',
                    name: 'asidePosition',
                    size: 'sm',
                    label: 'Sidebar position',
                    pipeIn: defaultValue('left'),
                    options: [
                      {
                        label: 'Left',
                        value: 'left'
                      },
                      {
                        label: 'Right',
                        value: 'right'
                      }
                    ],
                    hiddenOn: 'this.regions && !this.regions.includes("aside")'
                  }
                ]
              },
              {
                title: 'Data',
                body: [
                  getSchemaTpl('pageData'),
                  getSchemaTpl('apiControl', {
                    name: 'initApi',
                    mode: 'row',
                    labelClassName: 'none',
                    label: tipedLabel(
                      'Initialize interface',
                      'The API used to obtain the initial data. The returned data can be used at the entire page level.'
                    )
                  })
                ]
              },
              ,
              {
                title: 'Mobile',
                body: [
                  {
                    type: 'combo',
                    name: 'pullRefresh',
                    mode: 'normal',
                    noBorder: true,
                    items: [
                      {
                        type: 'ae-Switch-More',
                        mode: 'normal',
                        label: 'Pull down to refresh',
                        name: 'disabled',
                        formType: 'extend',
                        value: true,
                        trueValue: false,
                        falseValue: true,
                        autoFocus: false,
                        form: {
                          body: [
                            {
                              name: 'pullingText',
                              label: tipedLabel(
                                'Pull-down copy',
                                'Pull-down process prompt copy'
                              ),
                              type: 'input-text'
                            },
                            {
                              name: 'loosingText',
                              label: tipedLabel(
                                'Release text',
                                'Release process tip text'
                              ),
                              type: 'input-text'
                            }
                          ]
                        }
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
          className: 'p-none',
          body: [
            getSchemaTpl('collapseGroup', [
              ...getSchemaTpl('theme:common', {
                exclude: ['layout', 'theme-css-code'],
                classname: 'baseControlClassName',
                baseTitle: 'Basic style',
                extra: [
                  getSchemaTpl('theme:base', {
                    classname: 'bodyControlClassName',
                    title: 'Content area style',
                    hiddenOn: 'this.regions && !this.regions.includes("body")'
                  }),
                  getSchemaTpl('theme:base', {
                    classname: 'headerControlClassName',
                    title: 'Title bar style',
                    extra: [
                      getSchemaTpl('theme:font', {
                        label: 'character',
                        name: 'themeCss.titleControlClassName.font'
                      })
                    ],
                    hiddenOn: 'this.regions && !this.regions.includes("header")'
                  }),
                  getSchemaTpl('theme:base', {
                    classname: 'toolbarControlClassName',
                    title: 'Toolbar Style',
                    hiddenOn:
                      'this.regions && !this.regions.includes("toolbar")'
                  }),
                  getSchemaTpl('theme:base', {
                    classname: 'asideControlClassName',
                    title: 'Sidebar Style',
                    hiddenOn: 'this.regions && !this.regions.includes("aside")'
                  })
                ]
              }),
              getSchemaTpl('theme:singleCssCode', {
                selectors: [
                  {
                    label: 'Basic page style',
                    isRoot: true,
                    selector: '.cxd-Page'
                  },
                  {
                    label: 'Page content area style',
                    selector: '.cxd-Page-body'
                  },
                  {
                    label: 'Page title bar style',
                    selector: '.cxd-Page-title'
                  },
                  {
                    label: 'Page toolbar style',
                    selector: '.cxd-Page-toolbar'
                  },
                  {
                    label: 'Page sidebar style',
                    selector: '.cxd-Page-aside'
                  }
                ]
              })
            ])
          ]
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

        // {
        //   type: 'combo',
        //   name: 'definitions',
        //   multiple: true,
        //   multiLine: true,
        // label: 'Definition',
        // description: 'Defines the type, which can be referenced by child nodes after definition.',
        //   pipeIn: (value: any) =>
        //     value
        //       ? Object.keys(value).map(key => ({
        //           key,
        //           value: value[key]
        //         }))
        //       : [],
        //   pipeOut: (value: any) =>
        //     Array.isArray(value)
        //       ? value.reduce(
        //           (obj, current) => ({
        //             ...obj,
        //             [current.key || '']: current.value
        //               ? current.value
        // : {type: 'tpl', tpl: 'content', wrapperComponent: ''}
        //           }),
        //           {}
        //         )
        //       : undefined,
        //   items: [
        //     {
        //       type: 'input-text',
        //       name: 'key',
        //       label: 'Key',
        //       required: true
        //     },

        //     {
        //       children: ({index}: any) => (
        //         <Button
        //           size="sm"
        //           level="danger"
        //           // onClick={this.handleEditDefinitionDetail.bind(
        //           //   this,
        //           //   index
        //           // )}
        //           block
        //         >
        // Configuration details
        //         </Button>
        //       )
        //     }
        //   ]
        // }
        // ]
        // }
      ])
    ];
  };

  async buildDataSchemas(
    node: EditorNodeType,
    region?: EditorNodeType,
    trigger?: EditorNodeType
  ) {
    let jsonschema = {
      ...jsonToJsonSchema(JSONPipeOut(node.schema.data))
    };

    const pool = node.children.concat();

    while (pool.length) {
      const current = pool.shift() as EditorNodeType;
      const schema = current.schema;

      if (current.rendererConfig?.isFormItem && schema?.name) {
        const tmpSchema = await current.info.plugin.buildDataSchemas?.(
          current,
          undefined,
          trigger,
          node
        );
        jsonschema.properties[schema.name] = {
          ...tmpSchema,
          ...(tmpSchema?.$id ? {} : {$id: `${current.id}-${current.type}`})
        };
      } else if (!current.rendererConfig?.storeType) {
        pool.push(...current.children);
      }
    }

    return jsonschema;
  }

  rendererBeforeDispatchEvent(node: EditorNodeType, e: any, data: any) {
    if (e === 'inited') {
      const scope = this.manager.dataSchema.getScope(`${node.id}-${node.type}`);
      const jsonschema: any = {
        $id: 'pageInitedData',
        ...jsonToJsonSchema(data.responseData)
      };

      scope?.removeSchema(jsonschema.$id);
      scope?.addSchema(jsonschema);
    }
  }
}

registerEditorPlugin(PagePlugin);

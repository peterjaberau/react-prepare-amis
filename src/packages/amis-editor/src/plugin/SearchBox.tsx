import {
  registerEditorPlugin,
  BaseEventContext,
  BasePlugin,
  RendererPluginEvent,
  RendererPluginAction,
  getSchemaTpl
} from '@/packages/amis-editor-core/src';
import {type Schema} from '@/packages/amis-core/src';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../renderer/event-control/helper';
import {generateId} from '../util';

export class SearchBoxPlugin extends BasePlugin {
  static id = 'SearchBoxPlugin';
  // Associated renderer name
  rendererName = 'search-box';
  $schema = '/schemas/SearchBoxSchema.json';

  // Component name
  name = 'Search box';
  searchKeywords = 'search box, searchbox';
  isBaseComponent = true;
  description =
    "Used to display a simple search box, usually used with other components. For example, after the page is configured with initApi, it can be used to implement simple data filtering and searching, and the name keywords will be passed as parameters to the page's initApi. ";
  docLink = '/amis/zh-CN/components/search-box';
  icon = 'fa fa-search';
  pluginIcon = 'search-box-plugin';
  tags = ['form item'];

  scaffold: Schema = {
    type: 'search-box',
    name: 'keyword',
    body: {
      type: 'tpl',
      tpl: 'Search box',
      wrapperComponent: '',
      inline: false,
      id: generateId()
    },
    level: 'info'
  };

  previewSchema: any = {
    ...this.scaffold,
    className: 'text-left',
    showCloseButton: true
  };

  regions = [
    {key: 'body', label: 'Content area', placeholder: 'Search box content'}
  ];

  // Event definition
  events: RendererPluginEvent[] = [
    {
      eventName: 'search',
      eventLabel: 'Click to search',
      description: 'Triggered when clicking the search icon',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                value: {
                  type: 'string',
                  title: 'Search value'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'change',
      eventLabel: 'value change',
      description: 'Triggered when the input box value changes',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                value: {
                  type: 'string',
                  title: 'Search value'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'focus',
      eventLabel: 'Get focus',
      description: 'Triggered when the input box gets focus',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                value: {
                  type: 'string',
                  title: 'Search value'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'blur',
      eventLabel: 'Lost focus',
      description: 'Triggered when the input box loses focus',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                value: {
                  type: 'string',
                  title: 'Search value'
                }
              }
            }
          }
        }
      ]
    }
  ];

  actions: RendererPluginAction[] = [
    {
      actionType: 'clear',
      actionLabel: 'Clear',
      description: 'Clear input box',
      ...getActionCommonProps('clear')
    },
    {
      actionType: 'setValue',
      actionLabel: 'Update data',
      description: 'Update data',
      ...getActionCommonProps('setValue')
    }
  ];

  notRenderFormZone = true;
  panelTitle = 'Search box';
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basics',
            body: [
              getSchemaTpl('formItemName', {
                required: true
              }),
              getSchemaTpl('switch', {
                label: 'clearable',
                name: 'clearable'
              }),
              getSchemaTpl('switch', {
                label: 'Search immediately after clearing',
                name: 'clearAndSubmit'
              }),
              getSchemaTpl('switch', {
                label: 'Search now',
                name: 'searchImediately'
              }),
              getSchemaTpl('switch', {
                label: 'mini version',
                name: 'mini'
              }),
              getSchemaTpl('switch', {
                label: 'Enhance style',
                name: 'enhance',
                visibleOn: '!data.mini'
              }),
              getSchemaTpl('placeholder')
            ]
          },
          getSchemaTpl('status')
        ])
      },
      {
        title: 'Appearance',
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('style:classNames', {isFormItem: false})
        ])
      },
      {
        title: 'Event',
        className: 'p-none',
        body: getSchemaTpl('eventControl', {
          name: 'onEvent',
          ...getEventControlConfig(this.manager, context)
        })
      }
    ]);
  };
}
registerEditorPlugin(SearchBoxPlugin);

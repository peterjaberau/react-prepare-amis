import {
  RendererPluginEvent,
  getI18nEnabled,
  registerEditorPlugin
} from '@/packages/amis-editor-core/src';
import {BasePlugin, RegionConfig, BaseEventContext} from '@/packages/amis-editor-core/src';
import {defaultValue, getSchemaTpl} from '@/packages/amis-editor-core/src';

import {tipedLabel} from '@/packages/amis-editor-core/src';
import {isObject} from '@/packages/amis-editor-core/src';
import {getEventControlConfig} from '../renderer/event-control/helper';
import {generateId} from '../util';

export class CollapseGroupPlugin extends BasePlugin {
  static id = 'CollapseGroupPlugin';
  // Associated renderer name
  rendererName = 'collapse-group';
  $schema = '/schemas/CollapseGroupSchema.json';

  // Component name
  name = 'Folding Panel';
  isBaseComponent = true;
  description =
    'Folding panel, when the amount of information is large and there are many categories, you can use the folding panel to classify and store it. ';
  docLink = '/amis/zh-CN/components/collapse';
  tags = ['layout container'];
  icon = 'fa fa-align-justify';
  pluginIcon = 'collapse-plugin';
  scaffold = {
    type: 'collapse-group',
    enableFieldSetStyle: true,
    activeKey: ['1'],
    body: [
      {
        type: 'collapse',
        key: '1',
        active: true,
        header: 'Title 1',
        id: generateId(),
        body: [
          {
            type: 'tpl',
            tpl: 'Here is content 1',
            wrapperComponent: '',
            inline: false,
            id: generateId()
          }
        ]
      },
      {
        type: 'collapse',
        key: '2',
        header: 'Title 2',
        id: generateId(),
        body: [
          {
            type: 'tpl',
            tpl: 'Here is content 1',
            wrapperComponent: '',
            inline: false,
            id: generateId()
          }
        ]
      }
    ]
  };
  previewSchema = {
    ...this.scaffold
  };

  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: 'Folding state changed',
      description:
        'Triggered when the folding state of the folding panel changes',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              title: 'Data',
              type: 'object',
              properties: {
                activeKeys: {
                  type: 'array',
                  title: 'Currently expanded index list'
                },
                collapseId: {
                  type: 'string',
                  title: 'Folder Index'
                },
                collapsed: {
                  type: 'boolean',
                  title: 'Folder Status'
                }
              }
            }
          }
        }
      ]
    }
  ];

  activeKeyData: any = [];
  panelTitle = 'Folding Panel';

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    const isInForm = context.path.includes('/form/');
    const i18nEnabled = getI18nEnabled();
    return [
      getSchemaTpl('tabs', [
        {
          title: 'Attributes',
          body: getSchemaTpl('collapseGroup', [
            {
              title: 'Basic',
              body: [
                getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                {
                  name: 'enableFieldSetStyle',
                  label: 'Display style',
                  visible: isInForm,
                  type: 'button-group-select',
                  options: [
                    {
                      label: 'Default',
                      value: false
                    },
                    {
                      label: 'simple',
                      value: true
                    }
                  ]
                },
                {
                  name: 'expandIconPosition',
                  label: 'icon position',
                  type: 'button-group-select',

                  pipeIn: defaultValue('left'),
                  options: [
                    {
                      label: 'left',
                      value: 'left',
                      icon: 'fa fa-align-left'
                    },
                    {
                      label: 'right',
                      value: 'right',
                      icon: 'fa fa-align-right'
                    }
                  ]
                },
                {
                  type: 'ae-switch-more',
                  label: 'Custom icon',
                  bulk: true,
                  mode: 'normal',
                  value: false,
                  formType: 'extend',
                  autoFocus: false,
                  form: {
                    body: [
                      getSchemaTpl('icon', {
                        name: 'expandIcon',
                        label: 'icon',
                        value: {
                          type: 'icon',
                          vendor: ''
                        },
                        pipeIn: (value: any) => value?.icon,
                        pipeOut: (value: any) => ({
                          type: 'icon',
                          vendor: '',
                          icon: value ? value : undefined
                        })
                      })
                    ]
                  },
                  pipeIn: (value: string) => {
                    if (typeof value === 'string' && value.length) {
                      return {
                        character: value
                      };
                    }
                    return undefined;
                  },
                  pipeOut: (value: any) => {
                    if (!isObject(value)) {
                      return undefined;
                    }
                    return typeof value.character === 'string'
                      ? value.character
                      : undefined;
                  }
                },
                {
                  name: 'accordion',
                  label: tipedLabel(
                    'Accordion mode',
                    'Accordion mode, only allows a single panel to be expanded'
                  ),
                  mode: 'row',
                  inputClassName:
                    'inline-flex justify-between flex-row-reverse',
                  type: 'switch',
                  pipeIn: defaultValue(false)
                },
                getSchemaTpl('combo-container', {
                  name: 'body',
                  type: 'combo',
                  label: 'Panel Management',
                  mode: 'normal',
                  multiple: true,
                  addable: true,
                  columnClassName: 'w-20',
                  addButtonText: 'Add a new folder',
                  minLength: 1,
                  draggable: true,
                  draggableTip: '',
                  placeholder: 'Please add a folder',
                  items: [
                    {
                      type: 'container',
                      columnClassName: 'flex-none',
                      body: tipedLabel(
                        [
                          {
                            name: 'active',
                            type: 'checkbox'
                          }
                        ],
                        'Expand this panel by default'
                      )
                    },
                    getSchemaTpl('title', {
                      name: 'header',
                      placeholder: 'Title'
                    })
                  ],
                  onChange: (
                    value: Array<any>,
                    oldValue: Array<any>,
                    model: any,
                    form: any
                  ) => {
                    const activeKey = value.reduce((arr: any, item: any) => {
                      item.active === true && arr.push(item.key);
                      return arr;
                    }, []);
                    form.setValues({
                      activeKey
                    });
                  },
                  pipeOut: (value: any[], oldValue: any, data: any) => {
                    const keys = value.map(item => item.key);
                    const findMinCanUsedKey = (
                      keys: string[],
                      max: number
                    ): void | string => {
                      for (let i = 1; i <= max; i++) {
                        if (!keys.includes(String(i))) {
                          return String(i);
                        }
                      }
                    };
                    value.forEach(item => {
                      if (!item.key) {
                        const key = findMinCanUsedKey(keys, value.length);
                        item.key = key;
                        item.header = `Title${key}`;
                      }
                    });
                    return value;
                  },
                  scaffold: {
                    type: 'collapse',
                    header: 'Title',
                    body: [
                      {
                        type: 'tpl',
                        tpl: 'content',
                        wrapperComponent: '',
                        inline: false
                      }
                    ],
                    key: ''
                  }
                })
              ]
            }
          ])
        },
        {
          title: 'Appearance',
          body: getSchemaTpl('collapseGroup', [
            {
              title: 'Basic style',
              body: [
                getSchemaTpl('theme:paddingAndMargin', {
                  name: `themeCss.className.padding-and-margin`,
                  hidePadding: true
                })
              ]
            },
            getSchemaTpl('theme:cssCode'),
            getSchemaTpl('animation'),
            getSchemaTpl('style:classNames', {
              isFormItem: false
            })
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
      ])
    ];
  };

  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: 'Content area',
      renderMethod: 'render',
      insertPosition: 'inner'
    }
  ];
}

registerEditorPlugin(CollapseGroupPlugin);

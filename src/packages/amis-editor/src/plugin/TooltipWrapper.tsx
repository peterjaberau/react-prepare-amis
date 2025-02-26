/**
 * @file text prompt container
 */
import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin, RegionConfig, BaseEventContext} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {tipedLabel} from 'amis-editor-core';
import {generateId} from '../util';

export class TooltipWrapperPlugin extends BasePlugin {
  static id = 'TooltipWrapperPlugin';
  static scene = ['layout'];
  rendererName = 'tooltip-wrapper';
  $schema = '/schemas/TooltipWrapperSchema.json';

  isBaseComponent = true;
  name = 'Text prompt';
  description =
    'Similar to a container, multiple renderers can be placed together. When the user hovers over or clicks the container, a text prompt floating layer is displayed';
  searchKeywords = 'character presentation container';
  docLink = '/amis/zh-CN/components/tooltip';
  tags = ['function'];
  icon = 'fa fa-comment-alt';
  pluginIcon = 'tooltip-wrapper-plugin';

  scaffold = {
    type: 'tooltip-wrapper',
    tooltip: 'prompt text',
    body: [
      {
        type: 'tpl',
        wrapperComponent: '',
        tpl: 'content',
        id: generateId()
      }
    ],
    enterable: true,
    showArrow: true,
    offset: [0, 0]
  };

  previewSchema = {
    ...this.scaffold,
    className: 'p-1 mr-3 border-2 border-solid border-indigo-400'
  };

  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: 'Content area'
    }
  ];

  panelTitle = this.name;

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    return [
      getSchemaTpl('tabs', [
        {
          title: 'Attributes',
          className: 'p-none',
          body: [
            getSchemaTpl('collapseGroup', [
              {
                title: 'Basic',
                body: [
                  getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                  getSchemaTpl('title', {
                    label: 'Prompt title'
                  }),
                  getSchemaTpl('tooltip'),

                  {
                    name: 'trigger',
                    type: 'select',
                    label: tipedLabel(
                      'Trigger mode',
                      'The default mode is "mouse hover"'
                    ),
                    multiple: true,
                    value: ['hover'],
                    pipeIn: (value: any) =>
                      Array.isArray(value) ? value.join(',') : [],
                    pipeOut: (value: any) =>
                      value && value.length ? value.split(',') : undefined,
                    options: [
                      {
                        label: 'Mouse hover',
                        value: 'hover'
                      },

                      {
                        label: 'click',
                        value: 'click'
                      }
                    ]
                  },
                  {
                    type: 'button-group-select',
                    name: 'placement',
                    label: 'Prompt location',
                    size: 'sm',
                    className: 'ae-buttonGroupSelect--justify',
                    options: [
                      {
                        label: 'up',
                        value: 'top'
                        // icon: 'fa fa-arrow-up'
                      },
                      {
                        label: 'Next',
                        value: 'bottom'
                        // icon: 'fa fa-arrow-down'
                      },
                      {
                        label: 'Left',
                        value: 'left'
                        // icon: 'fa fa-arrow-left'
                      },
                      {
                        label: 'Right',
                        value: 'right'
                        // icon: 'fa fa-arrow-right'
                      }
                    ],
                    pipeIn: defaultValue('top')
                  },
                  {
                    type: 'button-group-select',
                    name: 'tooltipTheme',
                    label: 'Theme color',
                    size: 'sm',
                    className: 'ae-buttonGroupSelect--justify',
                    options: [
                      {
                        label: 'bright color',
                        value: 'light',
                        icon: 'far fa-sun'
                      },
                      {
                        label: 'dark',
                        value: 'dark',
                        icon: 'far fa-moon'
                      }
                    ],
                    pipeIn: defaultValue('light')
                  },
                  {
                    name: 'inline',
                    label: 'Container inline',
                    type: 'switch',
                    mode: 'row',
                    inputClassName:
                      'inline-flex justify-between flex-row-reverse'
                  },
                  {
                    name: 'rootClose',
                    visibleOn: '~this.trigger.indexOf("click")',
                    label: 'Click outside the container to close the prompt',
                    type: 'switch',
                    mode: 'row',
                    inputClassName:
                      'inline-flex justify-between flex-row-reverse'
                  }
                ]
              },
              {
                title: 'Advanced',
                body: [
                  {
                    name: 'wrapperComponent',
                    label: 'Container label',
                    type: 'input-text',
                    options: [
                      'article',
                      'aside',
                      'code',
                      'div',
                      'footer',
                      'header',
                      'p',
                      'section'
                    ],
                    validations: {
                      isAlphanumeric: true,
                      matchRegexp: '/^(?!.*script).*$/' // Disable the script tag
                    },
                    validationErrors: {
                      isAlpha: 'The HTML tag is illegal, please re-enter',
                      matchRegexp: 'The HTML tag is illegal, please re-enter'
                    },
                    validateOnChange: false
                  },
                  {
                    type: 'input-group',
                    label: tipedLabel(
                      'Floating layer offset',
                      'Prompt the floating layer position relative to the "horizontal" and "vertical" offset'
                    ),
                    body: [
                      {
                        type: 'input-number',
                        name: 'offset',
                        suffix: 'px',
                        pipeIn: (value: any) =>
                          Array.isArray(value) ? value[0] || 0 : 0,
                        pipeOut: (value: any, oldValue: any, data: any) => [
                          value,
                          data.offset?.[1] || 0
                        ]
                      },
                      {
                        type: 'input-number',
                        name: 'offset',
                        suffix: 'px',
                        pipeIn: (value: any) =>
                          Array.isArray(value) ? value[1] || 0 : 0,
                        pipeOut: (value: any, oldValue: any, data: any) => [
                          data.offset?.[0] || 0,
                          value
                        ]
                      }
                    ]
                  },
                  {
                    type: 'switch',
                    label: tipedLabel(
                      'Accessible floating layer',
                      'After closing, the floating layer will also be closed when the mouse enters the prompt floating layer'
                    ),
                    name: 'enterable',
                    inputClassName: 'is-inline'
                  },
                  {
                    type: 'switch',
                    label: tipedLabel(
                      'Show floating arrow',
                      'After closing, the prompt pop-up layer does not display the pointing arrow'
                    ),
                    name: 'showArrow',
                    inputClassName: 'is-inline'
                  },
                  {
                    type: 'input-group',
                    name: 'mouseEnterDelay',
                    label: 'Delay opening',
                    body: [
                      {
                        type: 'input-number',
                        min: 0,
                        step: 100,
                        name: 'mouseEnterDelay',
                        pipeIn: defaultValue(0)
                      },
                      {
                        type: 'tpl',
                        addOnclassName: 'border-0 bg-none',
                        tpl: 'ms'
                      }
                    ]
                  },
                  {
                    type: 'input-group',
                    name: 'mouseLeaveDelay',
                    label: 'Delayed closing',
                    body: [
                      {
                        label: 'Delayed closing',
                        type: 'input-number',
                        min: 0,
                        step: 100,
                        name: 'mouseLeaveDelay',
                        pipeIn: defaultValue(0)
                      },
                      {
                        type: 'tpl',
                        addOnclassName: 'border-0 bg-none',
                        tpl: 'ms'
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
          body: getSchemaTpl('collapseGroup', [
            ...getSchemaTpl('theme:common', {
              layoutExtra: [
                getSchemaTpl('theme:size', {
                  label: 'Size',
                  name: 'themeCss.baseControlClassName.size:default'
                })
              ],
              extra: [
                getSchemaTpl('theme:base', {
                  classname: 'tooltipControlClassName',
                  title: 'Floating style'
                })
              ]
            })
          ])
        }
      ])
    ];
  };
}

registerEditorPlugin(TooltipWrapperPlugin);

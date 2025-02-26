import {registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {
  BaseEventContext,
  BasePlugin,
  BasicRendererInfo,
  PluginInterface,
  RendererInfoResolveEventContext,
  tipedLabel
} from '@/packages/amis-editor-core/src';
import {defaultValue, getSchemaTpl} from '@/packages/amis-editor-core/src';
import {BUTTON_DEFAULT_ACTION} from '../component/BaseControl';
import {getEventControlConfig} from '../renderer/event-control/helper';
import {RendererPluginAction, RendererPluginEvent} from '@/packages/amis-editor-core/src';
import type {SchemaObject} from '@/packages/amis/src';
import {getOldActionSchema} from '../renderer/event-control/helper';
import {buttonStateFunc} from '../renderer/style-control/helper';
import {InlineEditableElement} from '@/packages/amis-editor-core/src';

export class EuiButtonPlugin extends BasePlugin {
  static id = 'EuiButtonPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'eui-button';
  $schema = '/schemas/ActionSchema.json';

  order = -400;

  // Component name
  name = 'eui-button';
  isBaseComponent = true;
  description =
    'Used to display a button. You can configure different display styles and different click behaviors. ';
  docLink = '/amis/zh-CN/components/button';
  tags = ['function'];
  icon = 'fa fa-square';
  pluginIcon = 'eui-button-plugin';
  scaffold: SchemaObject = {
    type: 'button',
    label: 'eui-button',
    ...BUTTON_DEFAULT_ACTION
  };
  previewSchema: any = {
    type: 'eui-button',
    label: 'button'
  };

  panelTitle = 'Button';

  // Event definition
  events: RendererPluginEvent[] = [
    {
      eventName: 'click',
      eventLabel: 'click',
      description: 'Triggered when clicked',
      defaultShow: true,
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
    // {
    //   eventName: 'doubleClick',
    // eventLabel: 'Double click',
    // description: 'Mouse double-click event'
    // }
  ];

  // Define elements that can be edited inline
  inlineEditableElements: Array<InlineEditableElement> = [
    {
      match: ':scope>span',
      key: 'label'
    }
  ];

  //Action definition
  actions: RendererPluginAction[] = [];

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    const isInDialog = /(?:\/|^)dialog\/.+$/.test(context.path);
    const isInDrawer = /(?:\/|^)drawer\/.+$/.test(context.path);

    // TODO: The old method cannot be judged, there is no dropdown-button information in the context, temporary implementation
    // const isInDropdown = /(?:\/|^)dropdown-button\/.+$/.test(context.path);
    const isInDropdown = /^button-group\/.+$/.test(context.path);

    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              getSchemaTpl('label', {
                label: 'name'
              }),
              {
                label: 'type',
                type: 'button-group-select',
                name: 'type',
                size: 'sm',
                visibleOn: 'type === "submit" || type === "reset" ',
                options: [
                  {
                    label: 'button',
                    value: 'button'
                  },

                  {
                    label: 'Submit',
                    value: 'submit'
                  },

                  {
                    label: 'Reset',
                    value: 'reset'
                  }
                ]
              },

              getSchemaTpl('switch', {
                name: 'close',
                label: 'Is it closed',
                clearValueOnHidden: true,
                labelRemark: `Specify that the current ${
                  isInDialog ? 'dialog' : 'drawer'
                }`,
                hidden: !isInDialog && !isInDrawer,
                pipeIn: defaultValue(false)
              }),

              {
                type: 'ae-switch-more',
                mode: 'normal',
                formType: 'extend',
                label: tipedLabel(
                  'Second confirmation',
                  'After clicking, ask the user first, and then execute the action after manual confirmation to avoid accidental touches. The value can be taken from the data domain variable.'
                ),
                form: {
                  body: [
                    getSchemaTpl('textareaFormulaControl', {
                      label: 'Confirm content',
                      mode: 'normal',
                      name: 'confirmText'
                    })
                  ]
                }
              },

              {
                type: 'ae-switch-more',
                formType: 'extend',
                mode: 'normal',
                label: 'Bubble prompt',
                id: 'button-tooltip', //Easy to expand positioning
                hidden: isInDropdown,
                form: {
                  body: [
                    getSchemaTpl('textareaFormulaControl', {
                      name: 'tooltip',
                      mode: 'normal',
                      label: tipedLabel(
                        'Normal prompt',
                        'The prompt content under normal conditions. If you do not fill it in, no prompt will pop up. You can get the value from the data domain variable.'
                      )
                    }),
                    getSchemaTpl('textareaFormulaControl', {
                      name: 'disabledTip',
                      mode: 'normal',
                      label: tipedLabel(
                        'Disable prompt',
                        'Prompt content in disabled state. If left blank, a normal prompt will pop up. The value can be taken from the data domain variable.'
                      ),
                      clearValueOnHidden: true,
                      visibleOn: 'this.tooltipTrigger !== "focus"'
                    }),
                    {
                      type: 'button-group-select',
                      name: 'tooltipTrigger',
                      label: 'Trigger method',
                      // visibleOn: 'this.tooltip || this.disabledTip',
                      size: 'sm',
                      options: [
                        {
                          label: 'Mouse hover',
                          value: 'hover'
                        },
                        {
                          label: 'Focus',
                          value: 'focus'
                        }
                      ],
                      pipeIn: defaultValue('hover')
                    },
                    {
                      type: 'button-group-select',
                      name: 'tooltipPlacement',
                      // visibleOn: 'this.tooltip || this.disabledTip',
                      label: 'Prompt location',
                      size: 'sm',
                      options: [
                        {
                          label: 'up',
                          value: 'top'
                        },
                        {
                          label: 'Right',
                          value: 'right'
                        },
                        {
                          label: 'Next',
                          value: 'bottom'
                        },
                        {
                          label: 'Left',
                          value: 'left'
                        }
                      ],
                      pipeIn: defaultValue('bottom')
                    }
                  ]
                }
              },

              getSchemaTpl('icon', {
                label: 'left icon'
              }),

              getSchemaTpl('icon', {
                name: 'rightIcon',
                label: 'right icon'
              }),
              getSchemaTpl('badge'),
              getSchemaTpl('switch', {
                name: 'disabledOnAction',
                label: 'Disable until action is complete',
                value: false
              })
            ]
          },
          getSchemaTpl('status', {
            disabled: true
          })
        ])
      },
      {
        title: 'Appearance',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: [
              getSchemaTpl('buttonLevel', {
                label: 'Style',
                name: 'level',
                hidden: isInDropdown
              }),

              getSchemaTpl('buttonLevel', {
                label: 'Highlight style',
                name: 'activeLevel',
                hidden: isInDropdown,
                visibleOn: 'this.active'
              }),

              getSchemaTpl('switch', {
                name: 'block',
                label: 'Block display',
                hidden: isInDropdown
              }),

              getSchemaTpl('size', {
                label: 'Size',
                hidden: isInDropdown
              })
            ]
          },
          {
            title: 'Basic style',
            body: [
              {
                type: 'select',
                name: '__editorState',
                label: 'status',
                selectFirst: true,
                options: [
                  {
                    label: 'General',
                    value: 'default'
                  },
                  {
                    label: 'Suspension',
                    value: 'hover'
                  },
                  {
                    label: 'click',
                    value: 'active'
                  }
                ]
              },
              ...buttonStateFunc(
                "${__editorState == 'default' || !__editorState}",
                'default'
              ),
              ...buttonStateFunc("${__editorState == 'hover'}", 'hover'),
              ...buttonStateFunc("${__editorState == 'active'}", 'active')
            ]
          },
          getSchemaTpl('theme:singleCssCode', {
            selectors: [
              {
                label: 'Button basic style',
                isRoot: true,
                selector: '.cxd-Button'
              },
              {
                label: 'Button content style',
                selector: 'span'
              }
            ]
          })
        ])
      },
      {
        title: 'Event',
        className: 'p-none',
        body:
          !!context.schema.actionType ||
          ['submit', 'reset'].includes(context.schema.type)
            ? [
                getSchemaTpl('eventControl', {
                  name: 'onEvent',
                  ...getEventControlConfig(this.manager, context),
                  rawType: 'button'
                }),
                getOldActionSchema(this.manager, context)
              ]
            : [
                getSchemaTpl('eventControl', {
                  name: 'onEvent',
                  ...getEventControlConfig(this.manager, context),
                  rawType: 'button'
                })
              ]
      }
    ]);
  };

  /**
   * If disabled, it cannot be edited
   */
  filterProps(props: any) {
    props.disabled = false;
    return props;
  }

  /**
   * If there is rendererName in the configuration, the renderer information is automatically returned.
   * @param renderer
   */
  getRendererInfo({
    renderer,
    schema
  }: RendererInfoResolveEventContext): BasicRendererInfo | void {
    const plugin: PluginInterface = this;

    if (
      schema.$$id &&
      plugin.name &&
      plugin.rendererName &&
      plugin.rendererName === renderer.name
    ) {
      // Copy some information out
      return {
        name: schema.label ? schema.label : plugin.name,
        regions: plugin.regions,
        patchContainers: plugin.patchContainers,
        // wrapper: plugin.wrapper,
        vRendererConfig: plugin.vRendererConfig,
        wrapperProps: plugin.wrapperProps,
        wrapperResolve: plugin.wrapperResolve,
        filterProps: plugin.filterProps,
        $schema: plugin.$schema,
        renderRenderer: plugin.renderRenderer,
        inlineEditableElements: plugin.inlineEditableElements
      };
    }
  }
}

registerEditorPlugin(EuiButtonPlugin);

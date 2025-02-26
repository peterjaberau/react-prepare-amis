import React from 'react';
import {
  EditorNodeType,
  getI18nEnabled,
  jsonToJsonSchema,
  registerEditorPlugin,
  BaseEventContext,
  BasePlugin,
  BasicToolbarItem,
  RendererInfo,
  VRendererConfig,
  getSchemaTpl,
  VRenderer,
  mapReactElement,
  RegionWrapper as Region,
  RendererPluginAction,
  RendererPluginEvent
} from 'amis-editor-core';
import {
  getArgsWrapper,
  getEventControlConfig,
  getActionCommonProps,
  buildLinkActionDesc
} from '../renderer/event-control/helper';
import {generateId} from '../util';

export class WizardPlugin extends BasePlugin {
  static id = 'WizardPlugin';
  // Associated renderer name
  rendererName = 'wizard';
  $schema = '/schemas/WizardSchema.json';

  name = 'Wizard';
  isBaseComponent = true;
  description =
    'Form wizard can split complex form items into multiple steps, guiding users to complete the filling step by step. ';
  docLink = '/amis/zh-CN/components/wizard';
  tags = ['function'];
  icon = 'fa fa-list-ol';
  pluginIcon = 'wizard-plugin';

  scaffold = {
    type: 'wizard',
    steps: [
      {
        title: 'First Step',
        body: [
          {
            type: 'input-text',
            label: 'text',
            name: 'var1',
            id: generateId()
          }
        ]
      },

      {
        Title: 'Step 2',
        body: [
          {
            type: 'input-text',
            label: 'text 2',
            name: 'var2',
            id: generateId()
          }
        ]
      }
    ]
  };

  previewSchema = {
    type: 'wizard',
    className: 'text-left m-b-none',
    steps: [
      {
        title: 'First Step',
        body: [
          {
            type: 'input-text',
            label: 'text',
            name: 'var1'
          }
        ]
      },

      {
        Title: 'Step 2',
        body: []
      }
    ]
  };

  // Event definition
  events: RendererPluginEvent[] = [
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
      eventName: 'finished',
      eventLabel: 'Click to finish',
      description: 'Triggered on final submission',
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
      eventName: 'stepChange',
      eventLabel: 'Step switch',
      description: 'Triggered when switching steps',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                step: {
                  type: 'string',
                  title: 'Step Index'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'change',
      eventLabel: 'Value change',
      description: 'Triggered when form value changes',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data'
            }
          }
        }
      ]
    },
    {
      eventName: 'submitSucc',
      eventLabel: 'Submission successful',
      description: 'Triggered when the final submission is successful',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                result: {
                  type: 'object',
                  title: 'Data returned after successful submission'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'submitFail',
      eventLabel: 'Submission failed',
      description: 'Triggered when the final submission fails',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                error: {
                  type: 'object',
                  title: 'Error message returned after submission fails'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'stepSubmitSucc',
      eventLabel: 'Step submission successful',
      description: 'Single step submission successful'
    },
    {
      eventName: 'stepSubmitFail',
      eventLabel: 'Step submission failed',
      description: 'Single step submission failed',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                error: {
                  type: 'object',
                  title:
                    'Error message returned after a single step submission fails'
                }
              }
            }
          }
        }
      ]
    }
  ];

  //Action definition
  actions: RendererPluginAction[] = [
    {
      actionType: 'submit',
      actionLabel: 'Submit All',
      description: 'Submit all data',
      ...getActionCommonProps('submit')
    },
    {
      actionType: 'stepSubmit',
      actionLabel: 'Submit in steps',
      description: 'Submit current step data',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            submit
            {buildLinkActionDesc(props.manager, info)}
            Current step data
          </div>
        );
      }
    },
    {
      actionType: 'prev',
      actionLabel: 'Previous step',
      description: 'Return to the previous step',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            {info?.__rendererName === 'carousel' ? 'Scroll' : null}
            {info?.__rendererName === 'wizard' ? 'Return' : null}
            {buildLinkActionDesc(props.manager, info)}
            {info?.__rendererName === 'carousel' ? 'Previous' : null}
            {info?.__rendererName === 'wizard' ? 'Previous step' : null}
          </div>
        );
      }
    },
    {
      actionType: 'next',
      actionLabel: 'Next',
      description: 'Submit current step data',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            {info?.__rendererName === 'carousel' ? 'Scroll' : null}
            {info?.__rendererName === 'wizard' ? 'Submit' : null}
            {buildLinkActionDesc(props.manager, info)}
            {info?.__rendererName === 'carousel' ? 'To next' : null}
            {info?.__rendererName === 'wizard' ? 'Current step data' : null}
          </div>
        );
      }
    },
    {
      actionType: 'goto-step',
      actionLabel: 'Location step',
      description: 'Switch to the specified step',
      innerArgs: ['step'],
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            Switch
            {buildLinkActionDesc(props.manager, info)}
            To
            <span className="variable-left variable-right">
              {info?.args?.step}
            </span>
            step
          </div>
        );
      },
      schema: getArgsWrapper([
        getSchemaTpl('formulaControl', {
          name: 'step',
          label: 'Target step',
          variables: '${variables}',
          size: 'lg',
          mode: 'horizontal',
          required: true
        })
      ])
    },
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

  panelTitle = 'Wizard';
  panelBodyCreator = (context: BaseEventContext) => {
    const i18nEnabled = getI18nEnabled();
    return [
      getSchemaTpl('tabs', [
        {
          title: 'General',
          body: [
            getSchemaTpl('layout:originPosition', {value: 'left-top'}),
            {
              name: 'steps',
              label: 'Step settings',
              type: 'combo',
              multiple: true,
              multiLine: true,
              addButtonText: 'Add a new step',
              scaffold: {
                title: 'Title',
                items: [
                  {
                    type: 'input-text',
                    name: 'var1',
                    label: 'text'
                  }
                ]
              },
              items: [
                {
                  name: 'title',
                  type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                  label: 'Title',
                  pipeIn: (value: any, data: any) => value || data.label
                },

                {
                  type: 'fieldSet',
                  title: 'Other settings',
                  collapsed: true,
                  collapsable: true,
                  className: 'fieldset m-b-none',
                  body: [
                    {
                      name: 'mode',
                      label: 'Display mode',
                      type: 'button-group-select',
                      size: 'xs',
                      mode: 'inline',
                      className: 'w-full',
                      value: 'normal',
                      options: [
                        {
                          label: 'Default',
                          value: 'normal'
                        },
                        {
                          label: 'Place left and right',
                          value: 'horizontal'
                        },
                        {
                          label: 'Inline',
                          value: 'inline'
                        }
                      ]
                    },

                    getSchemaTpl('horizontal', {
                      visibleOn: 'this.mode == "horizontal"'
                    }),

                    getSchemaTpl('apiControl', {
                      label: 'Save interface',
                      description:
                        'If the interface returns a <code>step</code> variable and the value is a numeric type, such as <code>3</code>, jump back to step 3 after submission'
                    }),

                    getSchemaTpl('switch', {
                      label: 'Asynchronous method?',
                      name: 'asyncApi',
                      visibleOn: 'this.api',
                      labelRemark: {
                        trigger: 'click',
                        rootClose: true,
                        title: 'What is asynchronous mode? ',
                        content:
                          'The asynchronous method is mainly used to solve the request timeout problem. After the asynchronous method is enabled, the program will periodically poll additional interfaces to inquire whether the operation is completed after the request is completed. Therefore, the interface can return quickly without waiting for the process to be actually completed. ',
                        placement: 'left'
                      },
                      pipeIn: (value: any) => value != null,
                      pipeOut: (value: any) => (value ? '' : undefined)
                    }),

                    getSchemaTpl('apiControl', {
                      name: 'asyncApi',
                      label: 'Asynchronous detection interface',
                      visibleOn: 'this.asyncApi != null',
                      description:
                        'After setting this property, after the form is submitted and the save interface is sent, the interface will continue to be requested in a poll until the returned finished property is true'
                    }),

                    {
                      type: 'divider'
                    },

                    getSchemaTpl('apiControl', {
                      name: 'initApi',
                      label: 'Initialize interface',
                      description: 'Used to initialize form data'
                    }),

                    getSchemaTpl('switch', {
                      label: 'Asynchronous method?',
                      name: 'initAsyncApi',
                      visibleOn: 'this.initApi',
                      labelRemark: {
                        trigger: 'click',
                        rootClose: true,
                        title: 'What is asynchronous mode? ',
                        content:
                          'The asynchronous method is mainly used to solve the request timeout problem. After the asynchronous method is enabled, the program will periodically poll additional interfaces to inquire whether the operation is completed after the request is completed. Therefore, the interface can return quickly without waiting for the process to be actually completed. ',
                        placement: 'left'
                      },
                      pipeIn: (value: any) => value != null,
                      pipeOut: (value: any) => (value ? '' : undefined)
                    }),

                    getSchemaTpl('apiControl', {
                      name: 'initAsyncApi',
                      label: 'Asynchronous detection interface',
                      visibleOn: 'this.initAsyncApi != null',
                      description:
                        'After setting this property, after the form requests initApi, it will continue to request this interface in a poll until the returned finished property is true'
                    }),

                    getSchemaTpl('initFetch'),

                    {
                      label: 'Can it be clicked?',
                      type: 'input-text',
                      name: 'jumpableOn',
                      description:
                        'Use an expression to determine whether the current step can be clicked. Additional available variables: currentStep represents the current step.'
                    }
                  ]
                }
              ]
            },
            {
              type: 'input-text',
              name: 'startStep',
              label: 'Starting default value',
              description:
                'Start from the step. Templates are supported, but the template is rendered and the current step is set only when the component is created. When the component is refreshed later, the current step will not change according to the startStep'
            }
          ]
        },

        {
          title: 'Interface',
          body: [
            getSchemaTpl('apiControl', {
              name: 'initApi',
              label: 'Initialize interface',
              description:
                'Used to initialize wizard data. When the <code>step</code> field is returned in the interface, you can control the default step to jump to. Note that the value must be a numeric type. When <code>submiting</code> is returned and there is an asynchronous save interface in the current step, the wizard can be initially put into the asynchronous submission state.'
            }),

            getSchemaTpl('switch', {
              label: 'Asynchronous method?',
              name: 'initAsyncApi',
              visibleOn: 'this.initApi',
              labelRemark: {
                trigger: 'click',
                rootClose: true,
                title: 'What is asynchronous mode? ',
                content:
                  'The asynchronous method is mainly used to solve the request timeout problem. After the asynchronous method is enabled, the program will periodically poll additional interfaces to inquire whether the operation is completed after the request is completed. Therefore, the interface can return quickly without waiting for the process to be actually completed. ',
                placement: 'left'
              },

              pipeIn: (value: any) => value != null,
              pipeOut: (value: any) => (value ? '' : undefined)
            }),

            getSchemaTpl('apiControl', {
              name: 'initAsyncApi',
              label: 'Asynchronous detection interface',
              visibleOn: 'this.initAsyncApi != null',
              description:
                'After setting this property, after the form requests initApi, it will continue to request this interface in a poll until the returned finished property is true'
            }),

            {
              name: 'initFetch',
              type: 'radios',
              label: 'Whether to pull initially',
              inline: true,
              onChange: () => {},
              options: [
                {
                  label: 'Yes',
                  value: true
                },

                {
                  label: 'No',
                  value: false
                },

                {
                  label: 'expression',
                  value: ''
                }
              ]
            },

            {
              name: 'initFetchOn',
              autoComplete: false,
              visibleOn: 'typeof this.initFetch !== "boolean"',
              type: 'input-text',
              placeholder: '',
              className: 'm-t-n-sm'
            },

            {
              type: 'divider'
            },

            getSchemaTpl('apiControl', {
              label: 'Save interface',
              description:
                'Used to save form data, triggered by clicking Finish in the last step. <code>If the save interface has been set in the last step, the setting here will be invalid. </code>'
            }),

            getSchemaTpl('switch', {
              label: 'Asynchronous method?',
              name: 'asyncApi',
              visibleOn: 'this.api',
              labelRemark: {
                trigger: 'click',
                rootClose: true,
                title: 'What is asynchronous mode? ',
                content:
                  'The asynchronous method is mainly used to solve the request timeout problem. After the asynchronous method is enabled, the program will periodically poll additional interfaces to inquire whether the operation is completed after the request is completed. Therefore, the interface can return quickly without waiting for the process to be actually completed. ',
                placement: 'left'
              },
              pipeIn: (value: any) => value != null,
              pipeOut: (value: any) => (value ? '' : undefined)
            }),

            getSchemaTpl('apiControl', {
              name: 'asyncApi',
              label: 'Asynchronous detection interface',
              visibleOn: 'this.asyncApi != null',
              description:
                'After setting this property, after the form is submitted and the save interface is sent, the interface will continue to be requested in a poll until the returned finished property is true'
            }),

            {
              type: 'divider'
            },

            getSchemaTpl('loadingConfig', {}, {context})
          ]
        },

        {
          title: 'Appearance',
          body: [
            {
              name: 'mode',
              label: 'Display mode',
              type: 'button-group-select',
              size: 'sm',
              mode: 'inline',
              className: 'w-full',
              value: 'horizontal',
              options: [
                {
                  label: 'horizontal',
                  value: 'horizontal'
                },

                {
                  label: 'vertical',
                  value: 'vertical'
                }
              ]
            },

            getSchemaTpl('actionPrevLabel'),

            getSchemaTpl('actionNextLabel'),

            getSchemaTpl('actionNextSaveLabel'),

            getSchemaTpl('actionFinishLabel'),

            // {
            //   type: 'alert',
            //   level: 'info',
            // body: `Warm Tips: Each step of the operation button can be configured separately. Please switch to the step that needs to be configured separately on the right, and click [Customize Button] below to customize it. `
            // },

            getSchemaTpl('className'),
            getSchemaTpl('className', {
              name: 'actionClassName',
              label: 'Button CSS class name'
            })
          ]
        },

        {
          title: 'Other',
          body: [
            getSchemaTpl('ref'),
            getSchemaTpl('name'),
            getSchemaTpl('reload'),

            {
              label: 'Jump',
              name: 'redirect',
              type: 'input-text',
              description:
                'When this value is set, the form will jump to the target address after submission.'
            },

            getSchemaTpl('visible')
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
      ])
    ];
  };

  /**
   * Added switching toolbar
   * @param context
   * @param toolbars
   */
  buildEditorToolbar(
    context: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) {
    if (
      context.info.plugin === this &&
      context.info.renderer.name === this.rendererName &&
      !context.info.hostId
    ) {
      const node = context.node;

      toolbars.push({
        level: 'secondary',
        icon: 'fa fa-chevron-left',
        tooltip: 'Previous step',
        onClick: () => {
          const control = node.getComponent();

          if (control?.gotoStep) {
            const currentIndex = control.state.currentStep;
            control.gotoStep(currentIndex - 1);
          }
        }
      });

      toolbars.push({
        level: 'secondary',
        icon: 'fa fa-chevron-right',
        tooltip: 'Next step',
        onClick: () => {
          const control = node.getComponent();

          if (control?.gotoStep) {
            const currentIndex = control.state.currentStep;
            control.gotoStep(currentIndex + 1);
          }
        }
      });
    }
  }

  filterProps(props: any) {
    props.affixFooter = false;

    return props;
  }

  patchContainers = ['steps.body'];
  vRendererConfig: VRendererConfig = {
    regions: {
      body: {
        key: 'body',
        label: 'Form collection',
        wrapperResolve: (dom: HTMLElement) => dom
      },
      actions: {
        label: 'Button Group',
        key: 'actions',
        preferTag: 'button',
        wrapperResolve: (dom: HTMLElement) => dom
      }
    },
    panelTitle: 'Steps',
    panelBodyCreator: (context: BaseEventContext) => {
      return getSchemaTpl('tabs', [
        {
          title: 'General',
          body: [
            getSchemaTpl('title', {
              pipeIn: (value: any, data: any) => value || data.label
            }),
            getSchemaTpl('apiControl', {
              label: 'Save interface',
              description:
                'If the interface returns a <code>step</code> variable and the value is a numeric type, such as <code>3</code>, jump back to step 3 after submission'
            }),

            getSchemaTpl('switch', {
              label: 'Asynchronous method?',
              name: 'asyncApi',
              visibleOn: 'this.api',
              labelRemark: {
                trigger: 'click',
                rootClose: true,
                title: 'What is asynchronous mode? ',
                content:
                  'The asynchronous method is mainly used to solve the request timeout problem. After the asynchronous method is enabled, the program will periodically poll additional interfaces to inquire whether the operation is completed after the request is completed. Therefore, the interface can return quickly without waiting for the process to be actually completed. ',
                placement: 'left'
              },
              pipeIn: (value: any) => value != null,
              pipeOut: (value: any) => (value ? '' : undefined)
            }),

            getSchemaTpl('apiControl', {
              name: 'asyncApi',
              label: 'Asynchronous detection interface',
              visibleOn: 'this.asyncApi != null',
              description:
                'After setting this property, after the form is submitted and the save interface is sent, the interface will continue to be requested in a poll until the returned finished property is true'
            }),
            {
              type: 'divider'
            },
            getSchemaTpl('apiControl', {
              name: 'initApi',
              label: 'Initialize interface',
              description: 'Used to initialize form data'
            }),

            getSchemaTpl('switch', {
              label: 'Asynchronous method?',
              name: 'initAsyncApi',
              visibleOn: 'this.initApi',
              labelRemark: {
                trigger: 'click',
                rootClose: true,
                title: 'What is asynchronous mode? ',
                content:
                  'The asynchronous method is mainly used to solve the request timeout problem. After the asynchronous method is enabled, the program will periodically poll additional interfaces to inquire whether the operation is completed after the request is completed. Therefore, the interface can return quickly without waiting for the process to be actually completed. ',
                placement: 'left'
              },
              pipeIn: (value: any) => value != null,
              pipeOut: (value: any) => (value ? '' : undefined)
            }),

            getSchemaTpl('apiControl', {
              name: 'initAsyncApi',
              label: 'Asynchronous detection interface',
              visibleOn: 'this.initAsyncApi != null',
              description:
                'After setting this property, after the form requests initApi, it will continue to request this interface in a poll until the returned finished property is true'
            }),
            getSchemaTpl('initFetch')
          ]
        },
        {
          title: 'Appearance',
          body: [
            {
              name: 'mode',
              label: 'Display mode',
              type: 'button-group-select',
              size: 'xs',
              mode: 'inline',
              className: 'w-full',
              value: 'normal',
              options: [
                {
                  label: 'Default',
                  value: 'normal'
                },
                {
                  label: 'Place left and right',
                  value: 'horizontal'
                },
                {
                  label: 'Inline',
                  value: 'inline'
                }
              ]
            },
            getSchemaTpl('horizontal', {
              visibleOn: 'this.mode == "horizontal"'
            })
            // getSchemaTpl('className', {
            //   name: 'tabClassName',
            // label: 'tab member CSS class name'
            // })
          ]
        },
        {
          title: 'Other',
          body: [
            {
              label: 'Can it be clicked?',
              type: 'input-text',
              name: 'jumpableOn',
              description:
                'Use an expression to determine whether the current step can be clicked. Additional available variables: currentStep represents the current step.'
            }
          ]
        }
      ]);
    }
  };

  wizardWrapperResolve = (dom: HTMLElement) =>
    [].slice.call(
      dom.querySelectorAll('[role="wizard-body"],[role="wizard-footer"]')
    );
  overrides = {
    renderWizard: function (this: any) {
      const info: RendererInfo = this.props.$$editor;
      const steps = this.props.steps;
      const currentStep = this.state.currentStep;
      const dom = this.super();

      if (!info || !steps?.[currentStep - 1]) {
        return dom;
      }

      const index = currentStep - 1;
      const step = steps[index];
      const id = step.$$id;
      const plugin: WizardPlugin = info.plugin as any;

      return mapReactElement(dom, (child: JSX.Element) => {
        if (/Wizard-step\b/.test(child.props.className)) {
          return (
            <VRenderer
              key={id}
              type={info.type}
              plugin={info.plugin}
              renderer={info.renderer}
              $schema="/schemas/WizardStepSchema.json"
              hostId={info.id}
              memberIndex={index}
              name={step.title || `Step ${index + 1}`}
              id={id}
              draggable={false}
              wrapperResolve={plugin.wizardWrapperResolve}
              schemaPath={`${info.schemaPath}/steps/${index}`}
              path={`${this.props.$path}/${index}`} // seems useless
              data={this.props.data} // seems useless
            >
              {mapReactElement(child, (child2: any, index: number) => {
                if (child2.props.schema?.body && child2.props.schema.$$id) {
                  const region = plugin.vRendererConfig?.regions?.body;

                  if (!region) {
                    return child2;
                  }

                  const schema = {
                    ...child2.props.schema
                  };
                  delete schema.$$id;
                  return (
                    <Region
                      key={region.key}
                      preferTag={region.preferTag}
                      name={region.key}
                      label={region.label}
                      regionConfig={region}
                      placeholder={region.placeholder}
                      editorStore={plugin.manager.store}
                      manager={plugin.manager}
                      children={React.cloneElement(child2, {
                        schema: schema
                      })}
                      wrapperResolve={region.wrapperResolve}
                      rendererName={info.renderer.name}
                    />
                  );
                }

                return child2;
              })}
            </VRenderer>
          );
        }

        return child;
      });
    },

    renderFooter: function (this: any) {
      const info: RendererInfo = this.props.$$editor;
      const steps = this.props.steps;
      const currentStep = this.state.currentStep;
      const dom = this.super();

      if (!info || !steps?.[currentStep - 1]) {
        return dom;
      }

      const plugin: WizardPlugin = info.plugin as any;
      const region = plugin.vRendererConfig?.regions?.actions;

      if (!region) {
        return dom;
      }

      return (
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
      );
    }
  };

  rendererBeforeDispatchEvent(node: EditorNodeType, e: any, data: any) {
    if (e === 'inited') {
      const scope = this.manager.dataSchema.getScope(`${node.id}-${node.type}`);
      const jsonschema: any = {
        $id: 'wizardInitedData',
        ...jsonToJsonSchema(data.responseData)
      };

      scope?.removeSchema(jsonschema.$id);
      scope?.addSchema(jsonschema);
    }
  }
}

registerEditorPlugin(WizardPlugin);

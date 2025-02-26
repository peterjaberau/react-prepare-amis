import React from 'react';
import get from 'lodash/get';
import {getVariable} from '@/packages/amis-core/src';
import {Button} from 'amis';
import {
  defaultValue,
  getSchemaTpl,
  setSchemaTpl,
  tipedLabel,
  RendererPluginEvent,
  diff
} from '@/packages/amis-editor-core/src';
import {registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {BaseEventContext, BasePlugin} from '@/packages/amis-editor-core/src';
import {EditorNodeType} from '@/packages/amis-editor-core/src';
import {mockValue} from '@/packages/amis-editor-core/src';

//Copyable
setSchemaTpl('copyable', {
  type: 'ae-switch-more',
  mode: 'normal',
  name: 'copyable',
  label: 'Copyable',
  hiddenOnDefault: true,
  trueValue: true,
  bulk: false,
  formType: 'extend',
  pipeIn: (value: any) => !!value,
  form: {
    body: [
      {
        label: 'Content template',
        name: 'content',
        type: 'textarea',
        mode: 'row',
        maxRow: 2,
        description: 'Defaults to the current field value, customizable.'
      }
    ]
  }
});

export class StaticControlPlugin extends BasePlugin {
  static id = 'StaticControlPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'static';
  $schema = '/schemas/StaticControlSchema.json';

  // Component name
  name = 'Static display box';
  isBaseComponent = true;
  icon = 'fa fa-info';
  pluginIcon = 'static-plugin';
  description =
    'Purely used to display data, can be used to display json, date, image, progress and other data';
  docLink = '/amis/zh-CN/components/form/static';
  tags = ['form item'];
  scaffold = {
    type: 'static',
    label: 'Description'
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold,
        value: 'static value'
      }
    ]
  };
  multifactor = true;
  notRenderFormZone = true;
  panelTitle = 'Static display';
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    const renderer: any = context.info.renderer;

    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: [
              getSchemaTpl('formItemName', {
                required: false
              }),
              getSchemaTpl('label'),
              // getSchemaTpl('value'),
              getSchemaTpl('valueFormula', {
                name: 'tpl',
                onChange: (value: any, oldValue: any, item: any, form: any) => {
                  value === '' &&
                    form.setValues({
                      value: undefined
                    });
                }
                // rendererSchema: {
                //   ...context?.schema,
                // type: 'textarea', // use multi-line text editing instead
                // value: context?.schema.tpl // Avoid losing the default value
                // }
              }),
              {
                type: 'ae-switch-more',
                mode: 'normal',
                name: 'quickEdit',
                label: 'Quickly editable',
                hiddenOnDefault: true,
                formType: 'extend',
                defaultData: {
                  mode: 'popOver'
                },
                bulk: false,
                form: {
                  body: [
                    {
                      label: 'Edit mode',
                      name: 'mode',
                      type: 'button-group-select',
                      inputClassName: 'items-center',
                      pipeIn: defaultValue('popOver'),
                      options: [
                        {
                          label: 'Pull down',
                          value: 'popOver'
                        },
                        {
                          label: 'embedded',
                          value: 'inline'
                        }
                      ]
                    },
                    getSchemaTpl('icon', {
                      name: 'icon'
                    }),
                    getSchemaTpl('switch', {
                      name: 'saveImmediately',
                      label: tipedLabel(
                        'Save now',
                        'After turning it on, modifications are submitted immediately, rather than marking modifications and submitting them in batches.'
                      ),
                      visibleOn: 'this.quickEdit',
                      pipeIn: (value: any) => !!value
                    }),
                    getSchemaTpl('apiControl', {
                      name: 'saveImmediately.api',
                      label: 'Save interface',
                      mode: 'row',
                      description:
                        'Give a separate configuration interface for immediate saving. If not configured, quickSaveItemApi will be used by default. ',
                      visibleOn: 'this.saveImmediately'
                    }),
                    {
                      type: 'button',
                      block: true,
                      onClick: this.editDetail.bind(
                        this,
                        context.id,
                        'quickEdit',
                        (nodeSchema: any) => ({
                          type: 'container',
                          body: [
                            {
                              type: 'input-text',
                              name: nodeSchema.name
                            }
                          ]
                        })
                      ),
                      label: 'Configure editing template'
                    }
                  ]
                }
              },
              {
                type: 'ae-switch-more',
                mode: 'normal',
                name: 'popOver',
                label: 'View more displays',
                hiddenOnDefault: true,
                defaultData: {
                  mode: 'popOver'
                },
                formType: 'extend',
                bulk: false,
                pipeIn: (value: any) => !!value,
                form: {
                  body: [
                    {
                      label: 'Popup mode',
                      name: 'mode',
                      type: 'button-group-select',
                      pipeIn: defaultValue('popOver'),
                      options: [
                        {
                          label: 'Floating layer',
                          value: 'popOver'
                        },

                        {
                          label: 'Ball box',
                          value: 'dialog'
                        },

                        {
                          label: 'Drawer',
                          value: 'drawer'
                        }
                      ]
                    },
                    {
                      name: 'position',
                      label: 'Floating layer position',
                      type: 'select',
                      visibleOn: 'this.mode === "popOver" || !this.mode',
                      pipeIn: defaultValue('center'),
                      options: [
                        {
                          label: 'Upper left corner of target',
                          value: 'left-top'
                        },
                        {
                          label: 'Upper right corner of target',
                          value: 'right-top'
                        },
                        {
                          label: 'target center',
                          value: 'center'
                        },
                        {
                          label: 'Lower left corner of target',
                          value: 'left-bottom'
                        },
                        {
                          label: 'target lower right corner',
                          value: 'right-bottom'
                        },
                        {
                          label: 'Upper left corner of the page',
                          value: 'fixed-left-top'
                        },
                        {
                          label: 'upper right corner of the page',
                          value: 'fixed-right-top'
                        },
                        {
                          label: 'lower left corner of the page',
                          value: 'fixed-left-bottom'
                        },
                        {
                          label: 'lower right corner of the page',
                          value: 'fixed-right-bottom'
                        }
                      ]
                    },
                    {
                      type: 'button',
                      block: true,
                      onClick: this.editDetail.bind(
                        this,
                        context.id,
                        'popOver',
                        (schema: any) => ({
                          type: 'panel',
                          title: 'View details',
                          body: [
                            {
                              type: 'tpl',
                              tpl: '${' + schema.name + '}',
                              wrapperComponent: '',
                              inline: true,
                              editorSetting: {
                                mock: {
                                  tpl: 'Content details'
                                }
                              }
                            }
                          ]
                        })
                      ),
                      label: 'View more content configuration'
                    }
                  ]
                }
              },
              getSchemaTpl('copyable'),
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('placeholder'),
              getSchemaTpl('description')
              /*{
                  children: (
                    <Button
                      size="sm"
                      level="info"
                      className="m-b"
                      block
                      onClick={this.exchangeRenderer.bind(this, context.id)}
                    >
                      Changing the renderer type
                    </Button>
                  )
              },*/
            ]
          },
          getSchemaTpl('status', {
            isFormItem: true,
            unsupportStatic: true
          })
        ])
      },
      {
        title: 'Appearance',
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('style:formItem', {renderer}),
          {
            title: 'Controls',
            body: [getSchemaTpl('borderMode')]
          },
          {
            title: 'CSS class name',
            body: [
              getSchemaTpl('className', {
                label: 'Overall'
              }),
              getSchemaTpl('className', {
                label: 'label',
                name: 'labelClassName'
              }),
              getSchemaTpl('className', {
                label: 'Controls',
                name: 'inputClassName'
              }),
              getSchemaTpl('className', {
                label: 'Description',
                name: 'descriptionClassName',
                visibleOn: 'this.description'
              })
            ]
          }
        ])
      }
    ]);
  };

  filterProps(props: any, node: EditorNodeType) {
    props.$$id = node.id;

    if (typeof props.value === 'undefined' && !node.state.value) {
      node.updateState({
        value: mockValue(props)
      });
    }
    return props;
  }

  editDetail(id: string, field: string, defaultSchema: (schema: any) => any) {
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id);
    const value = store.getValueOf(id);
    const data = value[field];

    let originValue = data.type
      ? ['container', 'wrapper'].includes(data.type)
        ? data
        : {
            // The container exists in the schema, just use your own
            type: 'container',
            body: [data]
          }
      : defaultSchema(value);

    node &&
      value &&
      this.manager.openSubEditor({
        title: 'Configure display template',
        value: originValue,
        // slot: {
        //   type: 'container',
        //   body: '$$'
        // },
        onChange: (newValue: any) => {
          newValue = {...originValue, [field]: newValue};
          manager.panelChangeValue(newValue, diff(originValue, newValue));
        },
        data: {
          [value.labelField || 'label']: 'option name',
          [value.valueField || 'value']: 'option value',
          item: 'false data'
        }
      });
  }

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

  /*exchangeRenderer(id: string) {
    this.manager.showReplacePanel(id, '展示');
  }*/
}

registerEditorPlugin(StaticControlPlugin);

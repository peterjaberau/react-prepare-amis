import React from 'react';
import {Button, Drawer, Icon, Modal} from '@/packages/amis-ui/src';
import {
  registerEditorPlugin,
  BaseEventContext,
  BasePlugin,
  RegionConfig,
  RendererInfo,
  getSchemaTpl,
  noop,
  defaultValue,
  EditorNodeType,
  isEmpty,
  getI18nEnabled,
  BuildPanelEventContext,
  BasicPanelItem,
  PluginEvent,
  ChangeEventContext,
  JSONPipeOut
} from '@/packages/amis-editor-core/src';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../renderer/event-control/helper';
import omit from 'lodash/omit';
import type {RendererConfig, Schema} from 'amis-core';
// @ts-ignore
import {ModalProps} from '@/packages/amis-ui/src/components/Modal';
import ModalSettingPanel from '../component/ModalSettingPanel';
import find from 'lodash/find';

interface InlineModalProps extends ModalProps {
  type: string;
  children: any;
  dialogType?: string;
  cancelText?: string;
  confirmText?: string;
  cancelBtnLevel?: string;
  confirmBtnLevel?: string;
  editorDialogMountNode?: HTMLDivElement;
}

export class DialogPlugin extends BasePlugin {
  static id = 'DialogPlugin';
  // Associated renderer name
  rendererName = 'dialog';
  $schema = '/schemas/DialogSchema.json';

  // Component name
  name = 'Popup';
  isBaseComponent = true;

  wrapperProps = {
    wrapperComponent: InlineModal,
    onClose: noop,
    show: true
  };

  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: 'Content area',
      renderMethod: 'renderBody',
      renderMethodOverride: (regions, insertRegion) =>
        function (this: any, ...args: any[]) {
          const info: RendererInfo = this.props.$$editor;
          const dom = this.super(...args);

          if (info && args[1] === 'body') {
            return insertRegion(this, dom, regions, info, info.plugin.manager);
          }

          return dom;
        }
    },
    {
      key: 'actions',
      label: 'Button Group',
      renderMethod: 'renderFooter',
      wrapperResolve: dom => dom
    }
  ];

  // Not useful now, will be useful after the pop-up window is optimized
  events = [
    {
      eventName: 'confirm',
      eventLabel: 'Confirm',
      description: 'Triggered when clicking the pop-up confirmation button',
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
      eventName: 'cancel',
      eventLabel: 'Cancel',
      description: 'Triggered when the pop-up cancel button is clicked',
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
    }
  ];

  actions = [
    {
      actionType: 'confirm',
      actionLabel: 'Confirm',
      description: 'Trigger pop-up window to confirm the operation',
      descDetail: (info: any) => <div>Open confirmation dialog</div>
    },
    {
      actionType: 'cancel',
      actionLabel: 'Cancel',
      description: 'Trigger pop-up window to cancel the operation'
    },
    {
      actionType: 'setValue',
      actionLabel: 'Variable assignment',
      description: 'Trigger component data update',
      ...getActionCommonProps('setValue')
    }
  ];

  panelTitle = 'panel';
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    const i18nEnabled = getI18nEnabled();
    // Confirm the dialog configuration panel
    if (context.schema?.dialogType === 'confirm') {
      return getSchemaTpl('tabs', [
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

                {
                  type: 'radios',
                  label: 'Popup mode',
                  name: 'actionType',
                  pipeIn: (value: any, store: any, data: any) =>
                    value ?? data.type,
                  inline: false,
                  options: [
                    {
                      label: 'Popup',
                      value: 'dialog'
                    },
                    {
                      label: 'Drawer',
                      value: 'drawer'
                    },
                    {
                      label: 'Confirmation dialog',
                      value: 'confirmDialog'
                    }
                  ]
                },

                {
                  label: 'Title',
                  type: 'input-text',
                  name: 'title'
                },
                {
                  label: 'Confirm button text',
                  type: 'input-text',
                  name: 'confirmText'
                },
                {
                  label: 'Cancel button text',
                  type: 'input-text',
                  name: 'cancelText'
                },
                getSchemaTpl('switch', {
                  label: 'Press Esc to close',
                  name: 'closeOnEsc',
                  value: false
                })
              ]
            }
          ])
        },
        {
          title: 'Appearance',
          body: getSchemaTpl('collapseGroup', [
            {
              title: 'Basic',
              body: [
                {
                  label: 'Size',
                  type: 'button-group-select',
                  name: 'size',
                  size: 'sm',
                  options: [
                    {
                      label: 'Standard',
                      value: ''
                    },
                    {
                      label: 'small',
                      value: 'sm'
                    },
                    {
                      label: 'Medium',
                      value: 'md'
                    },
                    {
                      label: 'big',
                      value: 'lg'
                    },
                    {
                      label: 'super large',
                      value: 'xl'
                    }
                  ],
                  pipeIn: defaultValue(''),
                  pipeOut: (value: string) => (value ? value : undefined)
                },
                getSchemaTpl('buttonLevel', {
                  label: 'Confirm button style',
                  name: 'confirmBtnLevel'
                }),
                getSchemaTpl('buttonLevel', {
                  label: 'Cancel button style',
                  name: 'cancelBtnLevel'
                })
              ]
            }
          ])
        }
      ]);
    }
    return getSchemaTpl('tabs', [
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

              {
                type: 'radios',
                label: 'Popup mode',
                name: 'actionType',
                pipeIn: (value: any, store: any, data: any) =>
                  value ?? data.type,
                inline: false,
                options: [
                  {
                    label: 'Popup',
                    value: 'dialog'
                  },
                  {
                    label: 'Drawer',
                    value: 'drawer'
                  },
                  {
                    label: 'Confirmation dialog',
                    value: 'confirmDialog'
                  }
                ]
              },

              getSchemaTpl('layout:originPosition', {value: 'left-top'}),

              {
                label: 'Title',
                type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                name: 'title'
              },

              getSchemaTpl('button-manager'),

              getSchemaTpl('switch', {
                label: 'Show close button',
                name: 'showCloseButton',
                value: true
              }),
              getSchemaTpl('switch', {
                label: 'Click the mask to close',
                name: 'closeOnOutside',
                value: false
              }),
              getSchemaTpl('switch', {
                label: 'Press Esc to close',
                name: 'closeOnEsc',
                value: false
              }),
              {
                type: 'ae-StatusControl',
                label: 'Hide button area',
                mode: 'normal',
                name: 'hideActions',
                expressionName: 'hideActionsOn'
              },
              getSchemaTpl('switch', {
                label: 'Show error message in the lower left corner',
                name: 'showErrorMsg',
                value: true
              }),
              getSchemaTpl('switch', {
                label: 'Show loading animation in the lower left corner',
                name: 'showLoading',
                value: true
              }),
              getSchemaTpl('switch', {
                label: 'Is it draggable',
                name: 'draggable',
                value: false
              }),
              getSchemaTpl('dataMap')
            ]
          }
        ])
      },
      {
        title: 'Appearance',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Style',
            body: [
              {
                label: 'Size',
                type: 'button-group-select',
                name: 'size',
                size: 'xs',
                options: [
                  {
                    label: 'Standard',
                    value: ''
                  },
                  {
                    label: 'small',
                    value: 'sm'
                  },
                  {
                    label: 'Medium',
                    value: 'md'
                  },
                  {
                    label: 'big',
                    value: 'lg'
                  },
                  {
                    label: 'super large',
                    value: 'xl'
                  },
                  {
                    label: 'Custom',
                    value: 'custom'
                  }
                ],
                pipeIn: defaultValue(''),
                pipeOut: (value: string) => (value ? value : undefined),
                onChange: (
                  value: string,
                  oldValue: string,
                  model: any,
                  form: any
                ) => {
                  if (value !== 'custom') {
                    form.setValueByName('style', undefined);
                  }
                }
              },
              {
                type: 'input-number',
                label: 'width',
                name: 'style.width',
                disabled: true,
                clearable: true,
                unitOptions: ['px', '%', 'em', 'vh', 'vw'],
                visibleOn: 'this.size !== "custom"',
                pipeIn: (value: any, form: any) => {
                  if (!form.data.size) {
                    return '500px';
                  } else if (form.data.size === 'sm') {
                    return '350px';
                  } else if (form.data.size === 'md') {
                    return '800px';
                  } else if (form.data.size === 'lg') {
                    return '1100px';
                  } else if (form.data.size === 'xl') {
                    return '90%';
                  }
                  return '';
                }
              },
              {
                type: 'input-number',
                label: 'width',
                name: 'style.width',
                clearable: true,
                unitOptions: ['px', '%', 'em', 'vh', 'vw'],
                visibleOn: 'this.size === "custom"',
                pipeOut: (value: string) => {
                  const curValue = parseInt(value);
                  if (value === 'auto' || curValue || curValue === 0) {
                    return value;
                  } else {
                    return undefined;
                  }
                }
              },
              {
                type: 'input-number',
                label: 'Height',
                name: 'style.height',
                disabled: true,
                visibleOn: 'this.size !== "custom"',
                clearable: true,
                unitOptions: ['px', '%', 'em', 'vh', 'vw']
              },
              {
                type: 'input-number',
                label: 'Height',
                name: 'style.height',
                visibleOn: 'this.size === "custom"',
                clearable: true,
                unitOptions: ['px', '%', 'em', 'vh', 'vw'],
                pipeOut: (value: string) => {
                  const curValue = parseInt(value);
                  if (value === 'auto' || curValue || curValue === 0) {
                    return value;
                  } else {
                    return undefined;
                  }
                }
              },
              getSchemaTpl('theme:border', {
                name: 'themeCss.dialogClassName.border'
              }),
              getSchemaTpl('theme:radius', {
                name: 'themeCss.dialogClassName.radius'
              }),
              getSchemaTpl('theme:shadow', {
                name: 'themeCss.dialogClassName.box-shadow'
              }),
              getSchemaTpl('theme:colorPicker', {
                label: 'background',
                name: 'themeCss.dialogClassName.background',
                labelMode: 'input'
              }),
              getSchemaTpl('theme:colorPicker', {
                label: 'mask color',
                name: 'themeCss.dialogMaskClassName.background',
                labelMode: 'input'
              })
            ]
          },
          {
            title: 'Title area',
            body: [
              getSchemaTpl('theme:font', {
                label: 'character',
                name: 'themeCss.dialogTitleClassName.font',
                hasVertical: false
              }),
              getSchemaTpl('theme:paddingAndMargin', {
                name: 'themeCss.dialogHeaderClassName.padding-and-margin',
                label: 'spacing'
              }),
              getSchemaTpl('theme:colorPicker', {
                label: 'background',
                name: 'themeCss.dialogHeaderClassName.background',
                labelMode: 'input'
              })
            ]
          },
          {
            title: 'Content Area',
            body: [
              getSchemaTpl('theme:border', {
                name: 'themeCss.dialogBodyClassName.border'
              }),
              getSchemaTpl('theme:radius', {
                name: 'themeCss.dialogBodyClassName.radius'
              }),
              getSchemaTpl('theme:paddingAndMargin', {
                name: 'themeCss.dialogBodyClassName.padding-and-margin',
                label: 'spacing'
              }),
              getSchemaTpl('theme:colorPicker', {
                label: 'background',
                name: 'themeCss.dialogBodyClassName.background',
                labelMode: 'input'
              })
            ]
          },
          {
            title: 'Bottom area',
            body: [
              getSchemaTpl('theme:paddingAndMargin', {
                name: 'themeCss.dialogFooterClassName.padding-and-margin',
                label: 'spacing'
              }),
              getSchemaTpl('theme:colorPicker', {
                label: 'background',
                name: 'themeCss.dialogFooterClassName.background',
                labelMode: 'input'
              })
            ]
          }
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
    ]);
  };

  afterUpdate(event: PluginEvent<ChangeEventContext>) {
    const context = event.context;

    // When the popup mode changes, switch the renderer type
    if (
      context.info.renderer.type &&
      ['dialog', 'drawer'].includes(context.info.renderer.type) &&
      context.diff?.some(change => change.path?.join('.') === 'actionType')
    ) {
      const change: any = find(
        context.diff,
        change => change.path?.join('.') === 'actionType'
      )!;

      let value = change?.rhs;
      const newType = value === 'drawer' ? 'drawer' : 'dialog';

      if (
        newType !== context.schema.type &&
        this.manager.replaceChild(context.id, {
          ...context.schema,
          type: value === 'drawer' ? 'drawer' : 'dialog'
        })
      ) {
        setTimeout(() => {
          this.manager.rebuild();
        }, 4);
      }
    }
  }

  buildSubRenderers() {}

  /**
   * The highlighted area of ​​dialog should be the content inside
   */
  wrapperResolve(dom: HTMLElement): HTMLElement | Array<HTMLElement> {
    return dom.lastChild as HTMLElement;
  }

  async buildDataSchemas(
    node: EditorNodeType,
    region?: EditorNodeType,
    trigger?: EditorNodeType
  ) {
    const renderer = this.manager.store.getNodeById(node.id)?.getComponent();
    const data = omit(renderer.props.$schema.data, '$$id');
    const inputParams = JSONPipeOut(renderer.props.$schema.inputParams);
    let dataSchema: any = {
      ...inputParams?.properties
    };

    if (renderer.props.$schema.data === undefined || !isEmpty(data)) {
      // Static data
      for (const key in data) {
        if (!['&'].includes(key)) {
          dataSchema[key] = {
            type: typeof data[key] ?? 'string', // default text, hard to determine type
            title: key
          };
        }
      }

      // The pop-up window revision may have multiple buttons triggering a pop-up window, and the context of the button cannot be determined
      //TODO data link
      // const hostNodeDataSchema =
      //   await this.manager.config.getHostNodeDataSchema?.();
      // hostNodeDataSchema
      //   ?.filter(
      //     (item: any) => !['system-variable', 'page-global'].includes(item.$id)
      //   )
      //   ?.forEach((item: any) => {
      // dataSchema = {
      // ...dataSchema,
      //       ...item.properties
      //     };
      //   });
    }

    return {
      $id: 'dialog',
      type: 'object',
      ...inputParams,
      title: node.schema?.label || node.schema?.name,
      properties: dataSchema
    };
  }

  /**
   * To make the dialog button editable
   */
  patchSchema(schema: Schema, info: RendererConfig, props?: any) {
    if (Array.isArray(schema.actions)) {
      return;
    }

    return {
      ...schema,
      actions: [
        {
          type: 'button',
          actionType: 'cancel',
          label: 'Cancel'
        },

        props?.confirm
          ? {
              type: 'button',
              actionType: 'confirm',
              label: 'OK',
              primary: true
            }
          : null
      ].filter((item: any) => item)
    };
  }

  buildEditorPanel(
    context: BuildPanelEventContext,
    panels: Array<BasicPanelItem>
  ) {
    if (
      this.manager.store.isSubEditor &&
      ['dialog', 'drawer'].includes(this.manager.store.schema?.type)
    ) {
      panels.push({
        key: 'modal-setting',
        icon: '', // 'fa fa-code',
        title: (
          <span
            className="editor-tab-icon editor-tab-s-icon"
            editor-tooltip="Popup parameters"
          >
            <Icon icon="modal-setting" />
          </span>
        ),
        position: 'left',
        component: ModalSettingPanel,
        order: -99999
      });
    }
    super.buildEditorPanel(context, panels);
  }
}

registerEditorPlugin(DialogPlugin);

export class InlineModal extends React.Component<InlineModalProps, any> {
  componentDidMount() {}

  render() {
    let {
      type,
      children,
      dialogType,
      cancelText,
      confirmText,
      cancelBtnLevel,
      confirmBtnLevel,
      editorDialogMountNode
    } = this.props;
    const Container = type === 'drawer' ? Drawer : Modal;

    if (dialogType === 'confirm') {
      children = children.filter((item: any) => item?.key !== 'actions');
      return (
        <Modal {...(this.props as any)} container={editorDialogMountNode}>
          <div className="ae-InlineModal">
            {children}
            <div className="ae-InlineModal-footer">
              <Button
                className="ae-InlineModal-footer-btn"
                level={cancelBtnLevel}
              >
                {cancelText || 'Cancel'}
              </Button>
              <Button
                className="ae-InlineModal-footer-btn"
                level={confirmBtnLevel}
              >
                {confirmText || 'Confirm'}
              </Button>
            </div>
          </div>
        </Modal>
      );
    }
    return (
      <Container {...(this.props as any)} container={editorDialogMountNode}>
        {children}
      </Container>
    );
  }
}

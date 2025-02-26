import React from 'react';
import {
  registerEditorPlugin,
  BaseEventContext,
  BasePlugin,
  RegionConfig,
  RendererInfo,
  defaultValue,
  getSchemaTpl,
  noop,
  EditorNodeType,
  isEmpty,
  getI18nEnabled,
  JSONPipeOut
} from '@/packages/amis-editor-core/src';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../renderer/event-control/helper';
import {tipedLabel} from '@/packages/amis-editor-core/src';
import omit from 'lodash/omit';
import {InlineModal} from './Dialog';

export class DrawerPlugin extends BasePlugin {
  static id = 'DrawerPlugin';
  // Associated renderer name
  rendererName = 'drawer';
  $schema = '/schemas/DrawerSchema.json';

  // Component name
  name = 'Drawer-style pop-up box';
  isBaseComponent = true;
  wrapperProps = {
    wrapperComponent: InlineModal,
    onClose: noop,
    resizable: false,
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
      description: 'Triggered when the drawer confirmation button is clicked',
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
      description: 'Triggered when the drawer cancel button is clicked',
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
      description: 'Trigger drawer confirmation operation',
      descDetail: (info: any) => <div>Trigger confirmation operation</div>
    },
    {
      actionType: 'cancel',
      actionLabel: 'Cancel',
      description: 'Trigger the drawer cancel operation'
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
              getSchemaTpl('switch', {
                name: 'overlay',
                label: 'Show mask',
                pipeIn: defaultValue(true)
              }),
              getSchemaTpl('button-manager'),
              getSchemaTpl('switch', {
                name: 'showCloseButton',
                label: 'Show close button',
                pipeIn: defaultValue(true)
              }),
              getSchemaTpl('switch', {
                name: 'closeOnOutside',
                label: 'Click the mask to close'
              }),
              getSchemaTpl('switch', {
                label: 'Press Esc to close',
                name: 'closeOnEsc'
              }),
              {
                type: 'ae-StatusControl',
                label: 'Hide button area',
                mode: 'normal',
                name: 'hideActions',
                expressionName: 'hideActionsOn'
              },
              getSchemaTpl('switch', {
                name: 'resizable',
                label: 'Draggable drawer size',
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
                type: 'button-group-select',
                name: 'position',
                label: 'Location',
                mode: 'horizontal',
                options: [
                  {
                    label: 'Left',
                    value: 'left'
                  },
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
                  }
                ],
                pipeIn: defaultValue('right'),
                pipeOut: (value: any) => (value ? value : 'right'),
                onChange: (
                  value: string,
                  oldValue: string,
                  model: any,
                  form: any
                ) => {
                  if (value === 'left' || value === 'right') {
                    form.deleteValueByName('height');
                  } else if (value === 'top' || value === 'bottom') {
                    form.deleteValueByName('width');
                  }
                }
              },
              {
                type: 'button-group-select',
                name: 'size',
                label: 'Size',
                size: 'sm',
                mode: 'horizontal',
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
              getSchemaTpl('style:widthHeight', {
                widthSchema: {
                  label: tipedLabel(
                    'width',
                    'Effective when the position is "left" or "right". The default width is the width configured in the "Size" field. The value unit defaults to px, and also supports percentage units, such as: 100%'
                  ),
                  visibleOn:
                    'this.position === "left" || this.position === "right" || !this.position'
                },
                heightSchema: {
                  label: tipedLabel(
                    'high',
                    'Effective when the position is "up" or "down". The default width is the height configured in the "size" field. The value unit is px by default, and percentage units are also supported, such as: 100%'
                  ),
                  visibleOn:
                    'this.position === "top" || this.position === "bottom"'
                }
              }),
              getSchemaTpl('theme:border', {
                name: 'themeCss.drawerClassName.border'
              }),
              getSchemaTpl('theme:radius', {
                name: 'themeCss.drawerClassName.radius'
              }),
              getSchemaTpl('theme:shadow', {
                name: 'themeCss.drawerClassName.box-shadow'
              }),
              getSchemaTpl('theme:colorPicker', {
                label: 'background',
                name: 'themeCss.drawerClassName.background',
                labelMode: 'input'
              }),
              getSchemaTpl('theme:colorPicker', {
                label: 'mask color',
                name: 'themeCss.drawerMaskClassName.background',
                labelMode: 'input'
              })
            ]
          },
          {
            title: 'Title area',
            body: [
              getSchemaTpl('theme:font', {
                label: 'character',
                name: 'themeCss.drawerTitleClassName.font'
              }),
              getSchemaTpl('theme:paddingAndMargin', {
                name: 'themeCss.drawerHeaderClassName.padding-and-margin',
                label: 'spacing'
              }),
              getSchemaTpl('theme:colorPicker', {
                label: 'background',
                name: 'themeCss.drawerHeaderClassName.background',
                labelMode: 'input'
              })
            ]
          },
          {
            title: 'Content Area',
            body: [
              getSchemaTpl('theme:border', {
                name: 'themeCss.drawerBodyClassName.border'
              }),
              getSchemaTpl('theme:radius', {
                name: 'themeCss.drawerBodyClassName.radius'
              }),
              getSchemaTpl('theme:paddingAndMargin', {
                name: 'themeCss.drawerBodyClassName.padding-and-margin',
                label: 'spacing'
              }),
              getSchemaTpl('theme:colorPicker', {
                label: 'background',
                name: 'themeCss.drawerBodyClassName.background',
                labelMode: 'input'
              })
            ]
          },
          {
            title: 'Bottom area',
            body: [
              getSchemaTpl('theme:paddingAndMargin', {
                name: 'themeCss.drawerFooterClassName.padding-and-margin',
                label: 'spacing'
              }),
              getSchemaTpl('theme:colorPicker', {
                label: 'background',
                name: 'themeCss.drawerFooterClassName.background',
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

  buildSubRenderers() {}

  /**
   * The highlighted area of ​​the drawer should be the content inside
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
      //Data link
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
      $id: 'drawer',
      type: 'object',
      ...inputParams,
      title: node.schema?.label || node.schema?.name,
      properties: dataSchema
    };
  }
}

registerEditorPlugin(DrawerPlugin);

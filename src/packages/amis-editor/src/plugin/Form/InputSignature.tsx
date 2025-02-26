import {EditorNodeType, getSchemaTpl} from '@/packages/amis-editor-core/src';
import {registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {BasePlugin, BaseEventContext} from '@/packages/amis-editor-core/src';
import {ValidatorTag} from '../../validator';
import {getEventControlConfig} from '../../renderer/event-control/helper';
import {RendererPluginAction, RendererPluginEvent} from '@/packages/amis-editor-core/src';

export class SignaturePlugin extends BasePlugin {
  static id = 'SignaturePlugin';
  // Associated renderer name
  rendererName = 'input-signature';
  $schema = '/schemas/InputSignatureSchema.json';

  // Component name
  name = 'Handwritten signature';
  isBaseComponent = true;
  icon = 'fa fa-star-o';
  pluginIcon = 'input-signature-plugin';
  description = 'Handwritten signature panel';
  docLink = '/amis/zh-CN/components/form/input-signature';
  tags = ['form item'];
  scaffold = {
    type: 'input-signature',
    label: 'Signature',
    name: 'signature'
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold,
        embed: true
      }
    ]
  };
  notRenderFormZone = true;

  panelTitle = 'Signature Panel';

  // Event definition
  events: RendererPluginEvent[] = [];

  //Action definition
  actions: RendererPluginAction[] = [];

  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              getSchemaTpl('formItemName', {
                required: true
              }),
              getSchemaTpl('label'),
              getSchemaTpl('labelRemark'),
              {
                type: 'button-group-select',
                label: 'Signature mode',
                name: 'embed',
                tiled: true,
                value: false,
                options: [
                  {
                    label: 'embedded',
                    value: false
                  },
                  {
                    label: 'Popup',
                    value: true
                  }
                ]
              },
              {
                type: 'control',
                label: 'Function button configuration',
                mode: 'normal',
                body: [
                  {
                    type: 'container',
                    wrapperComponent: 'div',
                    className: 'px-3 py-2',
                    style: {
                      backgroundColor: '#f7f7f9'
                    },
                    body: [
                      {
                        type: 'wrapper',
                        size: 'none',
                        visibleOn: 'this.embed === true',
                        body: [
                          getSchemaTpl('signBtn', {
                            label: 'Confirm signature',
                            name: 'embedConfirmLabel',
                            icon: 'embedConfirmIcon'
                          })
                        ]
                      },
                      {
                        type: 'wrapper',
                        size: 'none',
                        visibleOn: 'this.embed === false',
                        body: [
                          getSchemaTpl('signBtn', {
                            label: 'Confirm signature',
                            name: 'confirmBtnLabel',
                            icon: 'confirmBtnIcon'
                          })
                        ]
                      },
                      {
                        type: 'wrapper',
                        size: 'none',
                        visibleOn: 'this.embed === true',
                        body: [
                          getSchemaTpl('signBtn', {
                            label: 'Cancel signature',
                            name: 'ebmedCancelLabel',
                            icon: 'ebmedCancelIcon'
                          })
                        ]
                      },
                      getSchemaTpl('signBtn', {
                        label: 'revoke signature',
                        name: 'undoBtnLabel',
                        icon: 'undoBtnIcon'
                      }),
                      getSchemaTpl('signBtn', {
                        label: 'Clear signature',
                        name: 'clearBtnLabel',
                        icon: 'clearBtnIcon'
                      }),
                      {
                        type: 'wrapper',
                        size: 'none',
                        visibleOn: 'this.embed === true',
                        body: [
                          getSchemaTpl('signBtn', {
                            label: 'Signature button',
                            name: 'embedBtnLabel',
                            icon: 'embedBtnIcon'
                          })
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          getSchemaTpl('status', {
            isFormItem: true,
            unsupportStatic: true
          }),
          getSchemaTpl('validation', {
            tag: ValidatorTag.Check
          })
        ])
      },
      {
        title: 'Appearance',
        body: [
          getSchemaTpl('collapseGroup', [
            getSchemaTpl('style:formItem', {
              renderer: context.info.renderer
            }),
            getSchemaTpl('style:classNames', {unsupportStatic: true})
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
    ]);
  };

  buildDataSchemas(node: EditorNodeType, region: EditorNodeType) {
    return {
      type: 'number',
      title: node.schema?.label || node.schema?.name,
      originalValue: node.schema?.value // Record the original value, required for circular reference detection
    };
  }
}

registerEditorPlugin(SignaturePlugin);

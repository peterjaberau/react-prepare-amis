import {Button} from '@/packages/amis/src';
import React from 'react';
import {
  BaseEventContext,
  BasePlugin,
  BasicToolbarItem,
  ContextMenuEventContext,
  ContextMenuItem,
  registerEditorPlugin,
  tipedLabel,
  defaultValue,
  getSchemaTpl,
  diff
} from '@/packages/amis-editor-core/src';
import {BUTTON_DEFAULT_ACTION} from '../component/BaseControl';
import {buttonStateFunc} from '../renderer/style-control/helper';
import {generateId} from '../util';
export class DropDownButtonPlugin extends BasePlugin {
  static id = 'DropDownButtonPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'dropdown-button';
  $schema = '/schemas/DropdownButtonSchema.json';

  // Component name
  name = 'Drop-down button';
  isBaseComponent = true;
  description =
    'Drop-down button, more buttons will be displayed after clicking.';
  searchKeywords = 'Drop-down menu';
  tags = ['form item'];
  icon = 'fa fa-chevron-down';
  pluginIcon = 'dropdown-btn-plugin';

  docLink = '/amis/zh-CN/components/dropdown-button';
  scaffold = {
    type: 'dropdown-button',
    label: 'Drop-down button',
    buttons: [
      {
        type: 'button',
        label: 'Button 1',
        id: generateId(),
        ...BUTTON_DEFAULT_ACTION
      },

      {
        type: 'button',
        label: 'Button 2',
        id: generateId(),
        ...BUTTON_DEFAULT_ACTION
      }
    ]
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = 'Drop-down button';

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
              {
                children: (
                  <div className="mb-3">
                    <Button
                      level="info"
                      size="sm"
                      className="m-b-sm"
                      block
                      onClick={this.editDetail.bind(this, context.id)}
                    >
                      Configure the drop-down button collection
                    </Button>
                  </div>
                )
              },
              getSchemaTpl('label', {
                label: 'Button text'
              }),
              {
                type: 'button-group-select',
                name: 'trigger',
                label: 'Trigger method',
                size: 'sm',
                options: [
                  {
                    label: 'click',
                    value: 'click'
                  },
                  {
                    label: 'Mouse over',
                    value: 'hover'
                  }
                ],
                pipeIn: defaultValue('click')
              },

              getSchemaTpl('switch', {
                name: 'closeOnOutside',
                label: 'Click outside to close',
                pipeIn: defaultValue(true)
              }),

              getSchemaTpl('switch', {
                name: 'closeOnClick',
                label: 'Click content to close'
              }),

              getSchemaTpl('switch', {
                label: tipedLabel(
                  'Expand by default',
                  'The drop-down menu will expand by default after selection'
                ),
                name: 'defaultIsOpened'
              }),

              {
                type: 'button-group-select',
                name: 'align',
                label: 'Menu alignment',
                size: 'sm',
                options: [
                  {
                    label: 'left aligned',
                    value: 'left'
                  },
                  {
                    label: 'right aligned',
                    value: 'right'
                  }
                ],
                pipeIn: defaultValue('left')
              }
            ]
          },
          getSchemaTpl('status', {
            disabled: true
          })
        ])
      },
      {
        title: 'Appearance',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              title: 'Basic',
              body: [
                getSchemaTpl('size', {
                  label: 'Size',
                  pipeIn: defaultValue('md')
                }),

                getSchemaTpl('switch', {
                  name: 'block',
                  label: tipedLabel(
                    'Block display',
                    'After selection, the button occupies the full width of the parent container'
                  )
                }),

                getSchemaTpl('buttonLevel', {
                  label: 'Display style',
                  name: 'level'
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
            {
              title: 'icon',
              body: [
                // getSchemaTpl('switch', {
                // label: 'Only display icon',
                //   name: 'iconOnly'
                // }),

                getSchemaTpl('switch', {
                  label: 'Hide drop-down icon',
                  name: 'hideCaret'
                }),

                getSchemaTpl('icon', {
                  label: 'left icon'
                }),

                getSchemaTpl('icon', {
                  name: 'rightIcon',
                  label: 'right icon'
                })
              ]
            },
            getSchemaTpl('theme:cssCode', {
              themeClass: [
                {
                  value: '',
                  state: ['default', 'hover', 'active']
                }
              ]
            }),
            getSchemaTpl('style:classNames', {
              isFormItem: false,
              schema: [
                getSchemaTpl('className', {
                  name: 'btnClassName',
                  label: 'button'
                }),

                getSchemaTpl('className', {
                  name: 'menuClassName',
                  label: 'Drop-down menu'
                })
              ]
            })
          ])
        ]
      }
    ]);
  };

  buildEditorToolbar(
    {id, info}: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) {
    if (info.renderer.name === 'dropdown-button') {
      toolbars.push({
        icon: 'fa fa-expand',
        order: 100,
        tooltip: 'Configure drop-down button set',
        onClick: this.editDetail.bind(this, id)
      });
    }
  }

  editDetail(id: string) {
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id);
    const value = store.getValueOf(id);

    node &&
      value &&
      this.manager.openSubEditor({
        title: 'Configure drop-down button set',
        value: value.buttons,
        slot: {
          type: 'button-group',
          buttons: '$$',
          block: true
        },
        onChange: newValue => {
          newValue = {...value, buttons: newValue};
          manager.panelChangeValue(newValue, diff(value, newValue));
        }
      });
  }

  buildEditorContextMenu(
    {id, schema, region, info, selections}: ContextMenuEventContext,
    menus: Array<ContextMenuItem>
  ) {
    if (selections.length || info?.plugin !== this) {
      return;
    }
    if (info.renderer.name === 'dropdown-button') {
      menus.push('|', {
        label: 'Configure drop-down button set',
        onSelect: this.editDetail.bind(this, id)
      });
    }
  }

  filterProps(props: any) {
    // A trigger of hover will affect the editing experience.
    props.trigger = 'click';
    return props;
  }
}

registerEditorPlugin(DropDownButtonPlugin);

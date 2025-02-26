import {
  BasePlugin,
  RegionConfig,
  BaseEventContext,
  tipedLabel,
  defaultValue,
  getSchemaTpl,
  registerEditorPlugin,
  translateSchema
} from 'amis-editor-core';
import {BUTTON_DEFAULT_ACTION} from '../component/BaseControl';
import {generateId} from '../util';

export class ButtonGroupPlugin extends BasePlugin {
  static id = 'ButtonGroupPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'button-group';
  $schema = '/schemas/ButtonGroupSchema.json';

  // Component name
  name = 'Button Group';
  isBaseComponent = true;
  description =
    'Used to display multiple buttons, visually presented as a whole.';
  tags = ['function'];
  icon = 'fa fa-object-group';
  pluginIcon = 'btn-group-plugin';
  docLink = '/friends/zh-CN/components/button-group';
  scaffold = {
    type: 'button-group',
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

  panelTitle = 'Button Group';

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
                type: 'button-group-select',
                name: 'vertical',
                label: 'Layout direction',
                options: [
                  {
                    label: 'horizontal',
                    value: false
                  },
                  {
                    label: 'vertical',
                    value: true
                  }
                ],
                pipeIn: defaultValue(false)
              },

              getSchemaTpl('switch', {
                name: 'tiled',
                label: tipedLabel(
                  'Tile mode',
                  'Make the button group width fill the parent container, and each button width is adaptive'
                ),
                pipeIn: defaultValue(false)
              }),

              getSchemaTpl('combo-container', {
                type: 'combo',
                label: 'Button Management',
                name: 'buttons',
                mode: 'normal',
                multiple: true,
                addable: true,
                minLength: 1,
                draggable: true,
                editable: false,
                pipeIn: (value: any, data: any) => translateSchema(value),
                items: [
                  {
                    type: 'tpl',
                    inline: false,
                    className: 'p-t-xs',
                    tpl: `<span class="label label-default"><% if (data.type === "button-group") { %> ${'按钮组'} <% } else { %><%= data.label %><% if (data.icon) { %><i class="<%= data.icon %>"/><% }%><% } %></span>`
                  }
                ],
                addButtonText: 'Add a new button',
                scaffold: {
                  type: 'button',
                  label: 'button'
                }
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
        body: [
          getSchemaTpl('collapseGroup', [
            {
              title: 'Basic',
              body: [
                getSchemaTpl('buttonLevel', {
                  label: 'Style',
                  name: 'btnLevel'
                }),
                getSchemaTpl('size', {
                  label: 'Size'
                })
              ]
            },
            getSchemaTpl('style:classNames', {
              isFormItem: false,
              schema: [
                getSchemaTpl('className', {
                  label: 'button',
                  name: 'btnClassName'
                })
              ]
            })
          ])
        ]
      }
    ]);
  };

  regions: Array<RegionConfig> = [
    {
      key: 'buttons',
      label: 'Sub-button',
      renderMethod: 'render',
      preferTag: 'button',
      insertPosition: 'inner'
    }
  ];
}

registerEditorPlugin(ButtonGroupPlugin);

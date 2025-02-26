import {registerEditorPlugin, translateSchema} from '@/packages/amis-editor-core/src';
import {BasePlugin, RegionConfig, BaseEventContext} from '@/packages/amis-editor-core/src';
import {getSchemaTpl} from '@/packages/amis-editor-core/src';

import {
  BUTTON_DEFAULT_ACTION,
  formItemControl
} from '../../component/BaseControl';
import {generateId} from '../../util';

export class ButtonToolbarControlPlugin extends BasePlugin {
  static id = 'ButtonToolbarControlPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'button-toolbar';
  $schema = '/schemas/ButtonToolbarControlSchema.json';

  // Component name
  name = 'Button Toolbar';
  isBaseComponent = true;
  icon = 'fa fa-ellipsis-h';
  pluginIcon = 'btn-toolbar-plugin';
  description =
    'Can be used to place multiple buttons or button groups, there will be a certain amount of space between the buttons';
  docLink = '/amis/zh-CN/components/form/button-toolbar';
  tags = ['form item'];
  scaffold = {
    type: 'button-toolbar',
    label: 'Button toolbar',
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
  previewSchema: any = {
    type: 'form',
    wrapWithPanel: false,
    mode: 'horizontal',
    body: {
      ...this.scaffold
    }
  };

  //Container configuration
  regions: Array<RegionConfig> = [
    {
      key: 'buttons',
      label: 'button collection',
      preferTag: 'button',
      renderMethod: 'renderButtons'
    }
  ];

  notRenderFormZone = true;

  panelTitle = 'Toolbar';

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              title: 'Basic',
              body: [
                getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                getSchemaTpl('label'),
                getSchemaTpl('labelRemark'),
                getSchemaTpl('remark'),
                getSchemaTpl('description'),
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
                  pipeIn: (value: any) => translateSchema(value),
                  items: [
                    {
                      type: 'tpl',
                      inline: false,
                      className: 'p-t-xs',
                      tpl: `<span class="label label-default"><% if (this.type === "button-group") { %> ${'按钮组'} <% } else { %><%= this.label %><% if (this.icon) { %><i class="<%= this.icon %>"/><% }%><% } %></span>`
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
            getSchemaTpl('status')
          ])
        ]
      },
      {
        title: 'Appearance',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              title: 'Basic',
              body: [
                getSchemaTpl('formItemMode'),
                getSchemaTpl('horizontal', {
                  label: '',
                  visibleOn:
                    'this.mode == "horizontal" && this.label !== false && this.horizontal'
                })
              ]
            },
            getSchemaTpl('style:classNames', {
              isFormItem: true,
              unsupportStatic: true,
              schema: [
                getSchemaTpl('className', {
                  label: 'Description',
                  name: 'descriptionClassName',
                  visibleOn: 'this.description'
                })
              ]
            })
          ])
        ]
      }
    ]);
  };
}

registerEditorPlugin(ButtonToolbarControlPlugin);

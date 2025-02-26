import React from 'react';
import {
  defaultValue,
  getSchemaTpl,
  registerEditorPlugin,
  BasePlugin,
  BaseEventContext,
  tipedLabel
} from '@/packages/amis-editor-core/src';
import {ValidatorTag} from '../../validator';
import {generateId} from '../../util';

export class InputGroupControlPlugin extends BasePlugin {
  static id = 'InputGroupControlPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'input-group';
  $schema = '/schemas/InputGroupControlSchema.json';

  // Component name
  name = 'Input combination';
  isBaseComponent = true;
  icon = 'fa fa-object-group';
  pluginIcon = 'input-group-plugin';
  description =
    'Input combination, supports multiple types of control combinations';
  searchKeywords = 'input box combination';
  docLink = '/amis/zh-CN/components/form/input-group';
  tags = ['form item'];
  scaffold = {
    type: 'input-group',
    name: 'input-group',
    label: 'input combination',
    body: [
      {
        type: 'input-text',
        inputClassName: 'b-r-none p-r-none',
        id: generateId(),
        name: 'input-group'
      },
      {
        type: 'submit',
        label: 'Submit',
        id: generateId(),
        level: 'primary'
      }
    ]
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold
      }
    ]
  };

  panelTitle = 'Input combination';

  regions = [
    {
      key: 'body',
      label: 'Content area',
      preferTag: 'content area',
      renderMethod: 'render',
      matchRegion: (element: JSX.Element) => !!element
    }
  ];

  notRenderFormZone = true;

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: [
              getSchemaTpl('label'),
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('description')
            ]
          },
          getSchemaTpl('status', {isFormItem: true}),
          getSchemaTpl('validation', {tag: ValidatorTag.MultiSelect})
        ])
      },
      {
        title: 'Appearance',
        body: [
          getSchemaTpl('collapseGroup', [
            getSchemaTpl('style:formItem', {
              renderer: context.info.renderer,
              schema: [
                getSchemaTpl('switch', {
                  label: 'Inline mode',
                  name: 'inline',
                  pipeIn: defaultValue(false)
                })
              ]
            }),
            getSchemaTpl('style:classNames')
          ])
        ]
      }
    ]);
  };
}

registerEditorPlugin(InputGroupControlPlugin);

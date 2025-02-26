import React from 'react';
import {registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';
import type {SchemaObject} from 'amis';
import {generateId} from '../util';

export class AlertPlugin extends BasePlugin {
  static id = 'AlertPlugin';
  static scene = ['layout'];

  // Associated renderer name
  rendererName = 'alert';
  $schema = '/schemas/AlertSchema.json';

  // Component name
  name = 'prompt';
  isBaseComponent = true;
  description =
    'Used for special text prompts, divided into four categories: prompt, success, warning and danger. Can be combined with <code>visibleOn</code> to be used as error message prompts. ';
  docLink = '/amis/zh-CN/components/alert';
  icon = 'fa fa-exclamation-circle';
  pluginIcon = 'tooltip-plugin';
  tags = ['function'];

  scaffold: SchemaObject = {
    type: 'alert',
    body: {
      type: 'tpl',
      tpl: 'prompt content',
      wrapperComponent: '',
      inline: false,
      id: generateId()
    },
    level: 'info'
  };
  previewSchema: any = {
    ...this.scaffold,
    className: 'text-left',
    showCloseButton: true
  };

  // Ordinary container class renderer configuration
  regions = [
    {key: 'body', label: 'Content area', placeholder: 'Prompt content'}
  ];

  notRenderFormZone = true;
  panelTitle = 'Tips';
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
                label: 'type',
                name: 'level',
                type: 'select',
                options: [
                  {
                    label: 'prompt',
                    value: 'info'
                  },
                  {
                    label: 'Success',
                    value: 'success'
                  },
                  {
                    label: 'Warning',
                    value: 'warning'
                  },
                  {
                    label: 'Serious',
                    value: 'danger'
                  }
                ]
              },
              getSchemaTpl('label', {
                name: 'title'
              }),
              getSchemaTpl('switch', {
                label: 'Can be closed',
                name: 'showCloseButton'
              }),
              {
                type: 'ae-switch-more',
                mode: 'normal',
                name: 'showIcon',
                label: 'icon',
                hiddenOnDefault: !context.schema.icon,
                formType: 'extend',
                form: {
                  body: [
                    getSchemaTpl('icon', {
                      label: 'Custom icon'
                    })
                  ]
                }
              }
            ]
          },
          getSchemaTpl('status')
        ])
      },
      {
        title: 'Appearance',
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('style:classNames', {isFormItem: false})
        ])
      }
    ]);
  };
}

registerEditorPlugin(AlertPlugin);

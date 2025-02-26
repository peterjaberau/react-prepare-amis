/**
 * @file breadcrumbs
 */
import {registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';

export class BreadcrumbPlugin extends BasePlugin {
  static id = 'BreadcrumbPlugin';
  // Associated renderer name
  rendererName = 'breadcrumb';
  $schema = '/schemas/BreadcrumbSchema.json';
  disabledRendererPlugin = true;

  // Component name
  name = 'Breadcrumbs';
  isBaseComponent = true;
  icon = 'fa fa-list';
  pluginIcon = 'breadcrumb-plugin';
  description = 'Breadcrumbs';
  docLink = '/amis/zh-CN/components/breadcrumb';
  tags = ['other'];
  scaffold = {
    type: 'breadcrumb',
    items: [
      {
        label: 'Homepage',
        href: '/',
        icon: 'fa fa-home'
      },
      {
        label: 'Previous page'
      },
      {
        label: '<b>Current page</b>'
      }
    ]
  };
  previewSchema: any = {
    ...this.scaffold
  };

  panelTitle = 'Breadcrumbs';
  panelBody = [
    getSchemaTpl('tabs', [
      {
        title: 'General',
        body: [
          getSchemaTpl('layout:originPosition', {value: 'left-top'}),
          {
            label: 'Separator',
            type: 'input-text',
            name: 'separator'
          },
          getSchemaTpl('apiControl', {
            label: 'Dynamic data',
            name: 'source'
          }),
          {
            label: 'Breadcrumbs',
            name: 'items',
            type: 'combo',
            multiple: true,
            multiLine: true,
            draggable: true,
            addButtonText: 'Add',
            items: [
              {
                type: 'input-text',
                placeholder: 'text',
                name: 'label'
              },
              {
                type: 'input-text',
                name: 'href',
                placeholder: 'Link'
              },
              getSchemaTpl('icon', {
                name: 'icon',
                label: 'icon'
              })
            ]
          }
        ]
      },
      {
        title: 'Appearance',
        body: [
          getSchemaTpl('className'),
          getSchemaTpl('className', {
            name: 'itemClassName',
            label: 'CSS class name of breadcrumbs'
          }),
          ,
          getSchemaTpl('className', {
            name: 'separatorClassName',
            label: 'CSS class name of the separator'
          })
        ]
      },
      {
        title: 'Show and hide',
        body: [getSchemaTpl('ref'), getSchemaTpl('visible')]
      }
    ])
  ];
}

registerEditorPlugin(BreadcrumbPlugin);

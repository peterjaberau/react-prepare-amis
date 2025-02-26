/**
 * @file property table
 */
import {registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';

export class PropertyPlugin extends BasePlugin {
  static id = 'PropertyPlugin';
  // Associated renderer name
  rendererName = 'property';
  $schema = '/schemas/PropertySchema.json';

  // Component name
  name = 'Property Table';
  isBaseComponent = true;
  icon = 'fa fa-list';
  pluginIcon = 'property-sheet-plugin';
  description = 'Attribute table';
  docLink = '/amis/zh-CN/components/property';
  tags = ['function'];
  scaffold = {
    type: 'property',
    title: 'Machine Configuration',
    items: [
      {
        label: 'cpu',
        content: '1 core'
      },
      {
        label: 'memory',
        content: '4G'
      },
      {
        label: 'disk',
        content: '80G'
      },
      {
        label: 'network',
        content: '4M',
        span: 2
      },
      {
        label: 'IDC',
        content: 'beijing'
      },
      {
        label: 'Note',
        content: 'Other instructions',
        span: 3
      }
    ]
  };
  previewSchema: any = {
    ...this.scaffold
  };

  panelTitle = 'Property Table';
  panelBody = [
    getSchemaTpl('tabs', [
      {
        title: 'General',
        body: [
          getSchemaTpl('layout:originPosition', {value: 'left-top'}),
          getSchemaTpl('propertyTitle'),
          {
            label: 'How many columns are displayed per row',
            type: 'input-number',
            value: 3,
            name: 'column'
          },
          {
            type: 'radios',
            name: 'mode',
            inline: true,
            value: 'table',
            label: 'Display mode',
            options: ['table', 'simple']
          },
          {
            label: 'Separator',
            type: 'input-text',
            name: 'separator',
            visibleOn: 'this.mode === "simple"'
          },
          {
            label: 'Attributes taken from variables',
            type: 'input-text',
            name: 'source'
          },
          {
            label: 'attribute list',
            name: 'items',
            type: 'combo',
            multiple: true,
            multiLine: true,
            draggable: true,
            addButtonText: 'Add',
            scaffold: {
              label: '',
              content: '',
              span: 1
            },
            items: [
              getSchemaTpl('propertyLabel'),
              getSchemaTpl('propertyContent'),
              {
                type: 'input-number',
                mode: 'inline',
                size: 'sm',
                label: 'Spanning several columns',
                value: 1,
                name: 'span'
              }
            ]
          }
        ]
      },
      {
        title: 'Appearance',
        body: [getSchemaTpl('className')]
      },
      {
        title: 'Visible and Invisible',
        body: [getSchemaTpl('ref'), getSchemaTpl('visible')]
      }
    ])
  ];
}

registerEditorPlugin(PropertyPlugin);

import {Button} from '@/packages/amis-ui/src';
import React from 'react';
import {registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {
  BasePlugin,
  ContextMenuEventContext,
  ContextMenuItem,
  RegionConfig
} from '@/packages/amis-editor-core/src';
import {defaultValue, getSchemaTpl} from '@/packages/amis-editor-core/src';
import {JSONPipeIn, JSONUpdate, makeHorizontalDeeper} from '@/packages/amis-editor-core/src';
import {generateId} from '../../util';

export class GroupControlPlugin extends BasePlugin {
  static id = 'GroupControlPlugin';
  // Associated renderer name
  rendererName = 'group';
  $schema = '/schemas/GroupControlSchema.json';
  disabledRendererPlugin = true; // The component panel is not displayed

  // Component name
  name = 'Form Group';
  isBaseComponent = true;
  icon = 'fa fa-id-card-o';
  pluginIcon = 'form-group-plugin';
  description = 'Display multiple form items horizontally';
  docLink = '/amis/zh-CN/components/form/group';
  tags = ['form item'];
  scaffold = {
    type: 'group',
    body: [
      {
        type: 'input-text',
        label: 'text',
        id: generateId(),
        name: 'var1'
      },

      {
        type: 'input-text',
        label: 'text',
        id: generateId(),
        name: 'var2'
      }
    ],
    label: false
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    wrapWithPanel: false,
    mode: 'horizontal',
    body: [
      {
        ...this.scaffold,
        mode: 'normal'
      }
    ]
  };

  //Container configuration
  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: 'Subform',
      renderMethod: 'renderInput',
      preferTag: 'Form item',
      wrapperResolve: (dom: HTMLElement) => dom
    }
  ];

  panelTitle = 'Form Group';
  panelBody = [
    getSchemaTpl('tabs', [
      {
        title: 'General',
        body: [
          getSchemaTpl('layout:originPosition', {value: 'left-top'}),
          getSchemaTpl('label'),

          getSchemaTpl('description', {
            visible: 'this.label'
          }),

          {
            children: (
              <Button
                className="m-b"
                onClick={() => {
                  // this.manager.showInsertPanel('body')
                  this.manager.showRendererPanel(
                    'Form item',
                    'Please click Add Form Item from the component panel on the left'
                  );
                }}
                level="danger"
                tooltip="Insert a new element"
                size="sm"
                block
              >
                New elements
              </Button>
            )
          },

          getSchemaTpl('remark'),
          getSchemaTpl('labelRemark')
        ]
      },

      {
        title: 'Appearance',
        body: [
          getSchemaTpl('formItemMode'),
          getSchemaTpl('horizontalMode'),
          getSchemaTpl('horizontal', {
            visibleOn:
              '(this.$$formMode == "horizontal" || this.mode == "horizontal") && this.label !== false && this.horizontal',
            pipeIn: (value: any, data: any) => {
              value =
                value ||
                (data.formHorizontal &&
                  makeHorizontalDeeper(data.formHorizontal, data.body.length));

              return {
                leftRate:
                  value && typeof value.left === 'number'
                    ? value.left
                    : value &&
                      /\bcol\-(?:xs|sm|md|lg)\-(\d+)\b/.test(value.left)
                    ? parseInt(RegExp.$1, 10)
                    : 2,
                leftFixed: (value && value.leftFixed) || ''
              };
            }
          }),

          getSchemaTpl('subFormItemMode'),
          getSchemaTpl('subFormHorizontalMode'),
          getSchemaTpl('subFormHorizontal'),

          {
            name: 'body',
            type: 'combo',
            label: 'column width configuration',
            multiple: true,
            removable: false,
            addable: false,
            multiLine: true,
            visibleOn: 'this.$$formMode != "inline"',
            items: [
              {
                type: 'button-group-select',
                name: 'columnRatio',
                label: 'Width settings',
                tiled: true,
                pipeIn: (value: any, data: any) => {
                  if (typeof value === 'number') {
                    return 'custom';
                  } else if (
                    data.columnClassName &&
                    /\bcol\-(?:xs|sm|md|lg)\-(\d+)\b/.test(
                      data.columnClassName as string
                    )
                  ) {
                    return 'custom';
                  }
                  return value || '';
                },
                pipeOut: (value: any) => (value === 'custom' ? 2 : value),
                options: [
                  {
                    value: '',
                    label: 'Fit width'
                  },

                  {
                    value: 'auto',
                    label: 'Adaptive content'
                  },

                  {
                    value: 'custom',
                    label: 'Custom'
                  }
                ]
              },
              {
                label: 'width ratio',
                type: 'input-range',
                name: 'columnRatio',
                visibleOn:
                  'typeof this.columnRatio === "number" || this.columnClassName && /\\bcol\\-(?:xs|sm|md|lg)\\-(\\d+)\\b/.test(this.columnClassName)',
                pipeIn: (value: any, data: any) => {
                  if (typeof value === 'number') {
                    return value;
                  }

                  if (
                    !data.columnClassName ||
                    !/\bcol\-(?:xs|sm|md|lg)\-(\d+)\b/.test(
                      data.columnClassName as string
                    )
                  ) {
                    return 2;
                  }

                  return parseInt(RegExp.$1, 10) || 2;
                },
                min: 1,
                max: 12,
                step: 1
              }
            ]
          },

          {
            type: 'button-group-select',
            name: 'gap',
            label: 'interval size',
            pipeIn: defaultValue(''),
            size: 'sm',
            tiled: true,
            clearable: true,
            options: [
              {
                value: 'xs',
                label: 'extremely small'
              },

              {
                value: 'sm',
                label: 'small'
              },

              {
                value: 'md',
                label: 'Medium'
              },

              {
                value: 'lg',
                label: 'big'
              }
            ]
          },

          getSchemaTpl('className'),

          {
            name: 'body',
            type: 'combo',
            label: 'Column CSS class name configuration',
            multiple: true,
            removable: false,
            addable: false,
            items: [
              {
                type: 'input-text',
                name: 'columnClassName'
              }
            ]
          }
        ]
      },

      {
        title: 'Visible and Invisible',
        body: [getSchemaTpl('ref'), getSchemaTpl('visible')]
      }
    ])
  ];

  buildEditorContextMenu(
    {id, schema, region, selections, info}: ContextMenuEventContext,
    menus: Array<ContextMenuItem>
  ) {
    if (
      selections.length ||
      info.plugin !== this ||
      !Array.isArray(schema.body) ||
      schema.body.length < 2
    ) {
      return;
    }

    menus.push({
      label: 'Change to multiple lines',
      onSelect: () => {
        const store = this.manager.store;
        let rootSchema = store.schema;

        rootSchema = JSONUpdate(rootSchema, id, JSONPipeIn(schema.body), true);

        store.traceableSetSchema(rootSchema);
      }
    });
  }
}

registerEditorPlugin(GroupControlPlugin);

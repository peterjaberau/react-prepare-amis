import {registerEditorPlugin, RendererPluginEvent} from '@/packages/amis-editor-core/src';

import {TransferPlugin} from './Transfer';

export class TransferPickerPlugin extends TransferPlugin {
  static id = 'TransferPickerPlugin';
  // Associated renderer name
  rendererName = 'transfer-picker';
  $schema = '/schemas/TransferPickerControlSchema.json';

  // Component name
  name = 'Shuttle Selector';
  isBaseComponent = true;
  icon = 'fa fa-th-list';
  pluginIcon = 'transfer-plugin';
  description = 'Shuttle selector component';
  docLink = '/amis/zh-CN/components/form/transfer-picker';
  tags = ['form item'];
  scaffold = {
    label: 'Grouping',
    type: 'transfer-picker',
    name: 'transfer-picker',
    options: [
      {
        label: 'Zhuge Liang',
        value: 'zhugeliang'
      },
      {
        label: 'Cao Cao',
        value: 'caocao'
      }
    ],
    selectMode: 'list',
    resultListModeFollowSelect: false
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

  events: RendererPluginEvent[] = [
    ...this.events,
    {
      eventName: 'itemClick',
      eventLabel: 'Click option',
      description: 'Triggered when the option is clicked',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                item: {
                  type: 'object',
                  title: 'Current options'
                }
              }
            }
          }
        }
      ]
    }
  ];

  notRenderFormZone = true;
}

registerEditorPlugin(TransferPickerPlugin);

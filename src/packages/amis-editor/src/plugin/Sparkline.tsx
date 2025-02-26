/**
 * @file trend chart
 */

import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin, BaseEventContext} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';

export class SparklinePlugin extends BasePlugin {
  static id = 'SparklinePlugin';
  // Associated renderer name
  rendererName = 'sparkline';
  $schema = '/schemas/SparklineSchema.json';

  // Component name
  name = 'Trend Chart';
  isBaseComponent = true;
  description = 'For embedded display of simple charts';
  docLink = '/amis/zh-CN/components/sparkline';
  tags = ['show'];
  icon = 'fa fa-area-chart';
  pluginIcon = 'sparkline-plugin';
  scaffold = {
    type: 'sparkline',
    height: 30,
    value: [3, 5, 2, 4, 1, 8, 3, 7]
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = 'Trend Chart';

  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    return [
      getSchemaTpl('tabs', [
        {
          title: 'Attributes',
          body: [
            getSchemaTpl('collapseGroup', [
              {
                title: 'Basic',
                body: [
                  getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                  getSchemaTpl('name')
                ]
              },
              {
                title: 'Width and height settings',
                body: [
                  {
                    name: 'width',
                    type: 'input-number',
                    label: 'width'
                  },
                  {
                    name: 'height',
                    type: 'input-number',
                    label: 'Height'
                  }
                ]
              },
              getSchemaTpl('status')
            ])
          ]
        },
        {
          title: 'Appearance',
          body: getSchemaTpl('collapseGroup', [
            ...getSchemaTpl('theme:common', {exclude: ['layout']})
          ])
        }
      ])
    ];
  };
}

registerEditorPlugin(SparklinePlugin);

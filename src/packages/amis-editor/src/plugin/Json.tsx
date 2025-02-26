import {registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {BaseEventContext, BasePlugin} from '@/packages/amis-editor-core/src';
import {defaultValue, getSchemaTpl} from '@/packages/amis-editor-core/src';
import flatten from 'lodash/flatten';
export class JsonPlugin extends BasePlugin {
  static id = 'JsonPlugin';
  // Associated renderer name
  rendererName = 'json';
  $schema = '/schemas/JsonSchema.json';

  // Component name
  name = 'JSON display';
  isBaseComponent = true;
  description = 'Used to display JSON data.';
  docLink = '/amis/zh-CN/components/json';
  tags = ['show'];
  icon = 'fa fa-code';
  pluginIcon = 'json-view-plugin';
  scaffold = {
    type: 'json'
  };
  previewSchema = {
    ...this.scaffold,
    name: 'json',
    value: {
      a: 1,
      b: {
        c: 2
      }
    }
  };

  panelTitle = 'JSON';
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    const isUnderField = /\/field\/\w+$/.test(context.path as string);
    return [
      getSchemaTpl('tabs', [
        {
          title: 'Attributes',
          body: getSchemaTpl('collapseGroup', [
            {
              title: 'Basic',
              body: [
                isUnderField
                  ? {
                      type: 'tpl',
                      inline: false,
                      className: 'text-info text-sm',
                      tpl: '<p>Currently the field content node is configured, select the upper layer for more configuration</p>'
                    }
                  : null,

                {
                  name: 'levelExpand',
                  type: 'input-number',
                  label: 'Default expansion level',
                  pipeIn: defaultValue(1)
                }
              ]
            },
            getSchemaTpl('status')
          ])
        },
        getSchemaTpl('onlyClassNameTab')
      ])
    ];
  };
}

registerEditorPlugin(JsonPlugin);

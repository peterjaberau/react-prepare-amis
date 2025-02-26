/**
 * @file code highlighting
 */
import {registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {BaseEventContext, BasePlugin} from '@/packages/amis-editor-core/src';
import {getSchemaTpl} from '@/packages/amis-editor-core/src';

export class CodeViewPlugin extends BasePlugin {
  static id = 'CodeViewPlugin';
  // Associated renderer name
  rendererName = 'code';
  $schema = '/schemas/CodeSchema.json';

  // Component name
  name = 'Code Highlight';
  isBaseComponent = true;
  icon = 'fa fa-code';
  pluginIcon = 'code-plugin';
  description = 'Code highlighting';
  docLink = '/amis/zh-CN/components/code';
  tags = ['show'];
  scaffold = {
    type: 'code',
    language: 'html',
    value: '<div>html</div>'
  };
  previewSchema: any = {
    ...this.scaffold
  };

  panelTitle = 'Code Highlight';
  panelBodyCreator = (context: BaseEventContext) => {
    return getSchemaTpl('tabs', [
      {
        title: 'General',
        body: [
          getSchemaTpl('layout:originPosition', {value: 'left-top'}),
          {
            type: 'input-text',
            label: 'name',
            name: 'name'
          },
          {
            type: 'editor',
            label: 'fixed value',
            allowFullscreen: true,
            name: 'value'
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
    ]);
  };
}

registerEditorPlugin(CodeViewPlugin);

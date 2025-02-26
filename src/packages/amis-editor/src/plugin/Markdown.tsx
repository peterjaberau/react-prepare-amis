import {registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {BaseEventContext, BasePlugin} from '@/packages/amis-editor-core/src';
import {defaultValue, getSchemaTpl} from '@/packages/amis-editor-core/src';

export class MarkdownPlugin extends BasePlugin {
  static id = 'MarkdownPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'markdown';
  $schema = '/schemas/MarkdownSchema.json';

  // Component name
  name = 'Markdown';
  isBaseComponent = true;
  description = 'Show markdown content';
  docLink = '/amis/zh-CN/components/markdown';
  tags = ['show'];
  icon = 'fa fa-file-text';
  pluginIcon = 'markdown-plugin';
  scaffold = {
    type: 'markdown',
    value: '## This is a title'
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = 'MD';
  panelBodyCreator = (context: BaseEventContext) => {
    const isUnderField = /\/field\/\w+$/.test(context.path as string);
    return [
      getSchemaTpl('tabs', [
        {
          title: 'General',
          body: [
            getSchemaTpl('layout:originPosition', {value: 'left-top'}),
            getSchemaTpl('markdownBody')
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
  };
}

registerEditorPlugin(MarkdownPlugin);

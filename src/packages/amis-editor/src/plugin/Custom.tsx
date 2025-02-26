/**
 * @file custom code
 */

import {registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {
  BasePlugin,
  BasicSubRenderInfo,
  RendererEventContext,
  SubRendererInfo
} from '@/packages/amis-editor-core/src';
import {getSchemaTpl} from '@/packages/amis-editor-core/src';

export class CustomPlugin extends BasePlugin {
  static id = 'CustomPlugin';
  // Associated renderer name
  rendererName = 'custom';
  $schema = '/schemas/CustomSchema.json';

  // Component name
  name = 'Custom code';
  isBaseComponent = true;
  description = 'Functionality is achieved through embedded code';
  tags = ['function'];
  icon = 'fa fa-gears';
  pluginIcon = 'custom-plugin';
  docLink = '/amis/zh-CN/components/custom';
  scaffold = {
    type: 'custom',
    html: '<div><h2>hello, world!</h2></div>',
    onMount: `
      const button = document.createElement('button');
      button.innerText = 'Click to modify name';
      button.onclick = event => {
        event.preventDefault();
      };
      dom.appendChild(button);`
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = 'Custom code';
  panelBody = [
    getSchemaTpl('layout:originPosition', {value: 'left-top'}),
    getSchemaTpl('fieldSet', {
      title: 'HTML content',
      body: [
        {
          label: 'HTML content',
          name: 'html',
          type: 'editor',
          allowFullscreen: true
        }
      ]
    }),
    getSchemaTpl('fieldSet', {
      title: 'onMount',
      body: [
        {
          name: 'onMount',
          type: 'editor',
          allowFullscreen: true,
          size: 'xxl',
          label: 'onMount code',
          options: {
            lineNumbers: 'off',
            glyphMargin: false,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 0
          }
        }
      ]
    }),
    getSchemaTpl('fieldSet', {
      title: 'onUpdate',
      body: [
        {
          name: 'onUpdate',
          type: 'editor',
          allowFullscreen: true,
          size: 'xxl',
          label: 'onUpdate code'
        }
      ]
    }),
    getSchemaTpl('fieldSet', {
      title: 'onUnmount',
      body: [
        {
          name: 'onUnmount',
          type: 'editor',
          allowFullscreen: true,
          size: 'xxl',
          label: 'onUnmount code'
        }
      ]
    })
  ];

  buildSubRenderers(
    context: RendererEventContext,
    renderers: Array<SubRendererInfo>
  ): BasicSubRenderInfo | Array<BasicSubRenderInfo> | void {
    const info = super.buildSubRenderers.apply(this, arguments);
    //Only in form can onChange be called
    // if (
    //   context.info.renderer.name === 'form' ||
    //   context.node.childRegions.some(i => i.region === 'body')
    // ) {
    (info as BasicSubRenderInfo).scaffold.onMount = `
        const button = document.createElement('button');
        button.innerText = 'Click to modify name ddd';
        button.onclick = event => {
          onChange('new name');
          event.preventDefault();
        };
        dom.appendChild(button);`;
    // }

    return info;
  }
}

registerEditorPlugin(CustomPlugin);

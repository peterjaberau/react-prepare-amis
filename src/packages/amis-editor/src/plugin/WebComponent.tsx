import {
  registerEditorPlugin,
  BasePlugin,
  BaseEventContext,
  getSchemaTpl
} from '@/packages/amis-editor-core/src';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
import {tipedLabel} from '@/packages/amis-editor-core/src';

// Need an example, otherwise the default one with no height cannot be selected
class WebComponentDemo extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({mode: 'open'});
    shadow.textContent = 'web-component-demo';
  }
}
try {
  customElements.define('web-component-demo', WebComponentDemo);
} catch (error: any) {
  console.log('[amis-editor]', error);
}

export class WebComponentPlugin extends BasePlugin {
  static id = 'WebComponentPlugin';
  // Associated renderer name
  rendererName = 'web-component';
  $schema = '/schemas/WebComponentSchema.json';

  // Component name
  name = 'Web Component';
  isBaseComponent = true;
  description = 'Used to render Web Component components';
  docLink = '/amis/zh-CN/components/web-component';
  tags = ['function'];
  icon = 'fa fa-square-o';
  pluginIcon = 'web-component-plugin';
  scaffold = {
    type: 'web-component',
    tag: 'web-component-demo'
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = 'Package';

  notRenderFormZone = true;

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              className: 'p-none',
              title: 'Basic',
              body: [
                getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                {
                  type: 'input-text',
                  label: 'label',
                  name: 'tag'
                },
                getSchemaTpl('combo-container', {
                  type: 'input-kv',
                  mode: 'normal',
                  draggable: false,
                  name: 'props',
                  valueSchema: getSchemaTpl('formulaControl', {
                    placeholder: 'Value'
                  }),
                  label: 'attribute'
                })
              ]
            }
          ])
        ]
      }
    ]);
  };
}

registerEditorPlugin(WebComponentPlugin);

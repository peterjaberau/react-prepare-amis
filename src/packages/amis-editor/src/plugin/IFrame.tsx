import {registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {
  BasePlugin,
  RegionConfig,
  RendererInfo,
  BaseEventContext,
  tipedLabel
} from '@/packages/amis-editor-core/src';
import {defaultValue, getSchemaTpl, valuePipeOut} from '@/packages/amis-editor-core/src';

export class IFramePlugin extends BasePlugin {
  static id = 'IFramePlugin';
  // Associated renderer name
  rendererName = 'iframe';
  $schema = '/schemas/IFrameSchema.json';

  // Component name
  name = 'iFrame';
  isBaseComponent = true;
  description = 'Can be embedded into existing pages.';
  docLink = '/amis/zh-CN/components/iframe';
  tags = ['function'];
  icon = 'fa fa-window-maximize';
  pluginIcon = 'iframe-plugin';
  scaffold = {
    type: 'iframe',
    src: '//www.baidu.com'
  };
  previewSchema = {
    type: 'tpl',
    tpl: 'iFrame'
  };

  panelTitle = 'iFrame';
  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              getSchemaTpl('textareaFormulaControl', {
                name: 'src',
                mode: 'normal',
                label: 'Page address'
              })
            ]
          },
          getSchemaTpl('status')
        ])
      },
      {
        title: 'Appearance',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              title: 'Basic',
              body: [
                getSchemaTpl('style:widthHeight', {
                  widthSchema: {
                    label: tipedLabel(
                      'width',
                      'The default width is the parent container width, the value unit is px by default, and percentage units are also supported, such as: 100%'
                    ),
                    pipeIn: defaultValue('100%')
                  },
                  heightSchema: {
                    label: tipedLabel(
                      'high',
                      'The default height is the parent container height, the value unit is px by default, and percentage units are also supported, such as: 100%'
                    ),
                    pipeIn: defaultValue('100%')
                  }
                })
              ]
            },
            ...getSchemaTpl('theme:common', {exclude: ['layout']})
          ])
        ]
      }
    ]);
  };

  renderRenderer(props: any) {
    return this.renderPlaceholder(
      `IFrame page (${props.src})`,
      props.key,
      props.style
    );
  }
}

registerEditorPlugin(IFramePlugin);

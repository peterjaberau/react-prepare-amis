import {RendererPluginAction, registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';

export class PdfViewerPlugin extends BasePlugin {
  static id = 'PdfViewerPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'pdf-viewer';
  $schema = '/schemas/PdfViewerSchema.json';

  // Component name
  name = 'PDF Preview';
  isBaseComponent = true;
  description = 'PDF file preview';
  docLink = '/amis/zh-CN/components/pdf-viewer';
  tags = ['show'];
  icon = 'fa fa-file-pdf';
  pluginIcon = 'pdfViewer-plugin';
  scaffold = {
    type: 'pdf-viewer'
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = 'PDF Preview';

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
                  {
                    type: 'button-group-select',
                    label: 'File source',
                    name: 'source',
                    tiled: true,
                    value: 'src',
                    options: [
                      {
                        label: 'File link',
                        value: 'src'
                      },
                      {
                        label: 'Local file',
                        value: 'file'
                      }
                    ]
                  },
                  getSchemaTpl('tplFormulaControl', {
                    name: 'src',
                    label: 'Link address',
                    visibleOn: 'this.source === "src"'
                  }),
                  {
                    type: 'input-file',
                    label: 'File upload',
                    autoUpload: true,
                    proxy: true,
                    accept: '.pdf',
                    name: '__file',
                    visibleOn: 'this.source === "file"',
                    autoFill: {
                      src: '${url}'
                    }
                  }
                ]
              },
              getSchemaTpl('status', {
                isFormItem: false
              })
            ])
          ]
        },
        {
          title: 'Appearance',
          body: getSchemaTpl('collapseGroup', [
            getSchemaTpl('style:classNames', {isFormItem: false})
          ])
        }
      ])
    ];
  };
}

registerEditorPlugin(PdfViewerPlugin);

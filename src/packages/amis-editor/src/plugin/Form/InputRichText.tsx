import {
  BaseEventContext,
  getSchemaTpl,
  defaultValue,
  RendererPluginEvent,
  tipedLabel
} from '@/packages/amis-editor-core/src';
import {registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {BasePlugin} from '@/packages/amis-editor-core/src';
import {getEventControlConfig} from '../../renderer/event-control/helper';
import {ValidatorTag} from '../../validator';

const tinymceToolbarsDelimiter = ' ';

const tinymceOptions = [
  'advlist',
  'autolink',
  'link',
  'image',
  'lists',
  'charmap',
  'preview',
  'anchor',
  'pagebreak',
  'searchreplace',
  'wordcount',
  'visualblocks',
  'visualchars',
  'code',
  'fullscreen',
  'insertdatetime',
  'media',
  'nonbreaking',
  'table',
  'emoticons',
  'template',
  'help'
];

const tinymceToolbars = [
  'undo',
  'redo',
  'bold',
  'italic',
  'backcolor',
  'alignleft',
  'formatselect',
  'aligncenter',
  'alignright',
  'alignjustify',
  'bullist',
  'numlist',
  'outdent',
  'indent',
  'removeformat',
  'help',
  'charmap',
  'anchor',
  'pagebreak',
  'searchreplace',
  'wordcount',
  'visualblocks',
  'visualchars',
  'code',
  'fullscreen',
  'insertdatetime',
  'media',
  'nonbreaking',
  'table',
  'tableprops',
  'tabledelete',
  'tablecellprops',
  'tablemergecells',
  'tablesplitcells',
  'tableinsertrowbefore',
  'tableinsertrowafter',
  'tabledeleterow',
  'tablerowprops',
  'tableinsertcolbefore',
  'tableinsertcolafter',
  'tabledeletecol',
  'tablecutrow',
  'tablecopyrow',
  'tablepasterowbefore',
  'tablepasterowafter',
  'tablecutcol',
  'tablecopycol',
  'tablepastecolbefore',
  'tablepastecolafter',
  'tableinsertdialog',
  'tablecellvalign',
  'tablecellborderwidth',
  'tablecellborderstyle',
  'tablecellbackgroundcolor',
  'tablecellbordercolor',
  'tablecaption',
  'tablerowheader',
  'tablecolheader',
  'emoticons',
  'template',
  'link',
  'openlink',
  'unlink',
  'image',
  'preview',
  'alignnone',
  'underline',
  'strikethrough',
  'subscript',
  'superscript',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'cut',
  'copy',
  'paste',
  'selectall',
  'newdocument',
  'remove',
  'print',
  'hr',
  'blockquote',
  'forecolor',
  'visualaid',
  'lineheight',
  'pastetext'
];

const froalaOptions = [
  'paragraphFormat',
  'quote',
  'bold',
  'italic',
  'underline',
  'strikeThrough',
  'formatOL',
  'format',
  'align',
  'insertLink',
  'insertImage',
  'insertTable',
  'undo',
  'redo',
  'html'
];

const froalaOptionsPipeOut = (arr: Array<string>) => {
  return froalaOptions.filter(item => arr.find(a => a === item));
};

export class RichTextControlPlugin extends BasePlugin {
  static id = 'RichTextControlPlugin';
  // Associated renderer name
  rendererName = 'input-rich-text';
  $schema = '/schemas/RichTextControlSchema.json';

  // Component name
  name = 'Rich Text Editor';
  isBaseComponent = true;
  icon = 'fa fa-newspaper-o';
  pluginIcon = 'input-rich-text-plugin';
  description = 'Configuration bar with customizable rich text';
  docLink = '/amis/zh-CN/components/form/input-rich-text';
  tags = ['form item'];
  scaffold = {
    type: 'input-rich-text',
    label: 'Rich text',
    name: 'rich-text',
    vendor: 'tinymce'
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

  panelTitle = 'Rich Text';

  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: 'value change',
      description: 'Input content changes',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                value: {
                  type: 'string',
                  title: 'Rich text value'
                }
              },
              description:
                'The current data domain, you can read the corresponding value through the field name'
            }
          }
        }
      ]
    }
  ];

  notRenderFormZone = true;

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    // If this is set, froala will be used by default
    const hasRichTextToken = !!this.manager.env?.richTextToken;
    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: [
              getSchemaTpl('formItemName', {
                required: true
              }),
              getSchemaTpl('label'),
              getSchemaTpl('valueFormula', {
                rendererSchema: {
                  ...context?.schema,
                  type: 'textarea'
                },
                label: 'Default value'
              }),
              {
                type: 'select',
                name: 'vendor',
                label: 'type',
                value: hasRichTextToken ? 'froala' : 'tinymce',
                options: ['tinymce', 'froala'],
                onChange: (
                  value: any,
                  oldValue: any,
                  model: any,
                  form: any
                ) => {
                  if (value === 'tinymce') {
                    form.changeValue('options', {
                      height: 400,
                      width: undefined,
                      menubar: true,
                      quickInsertEnabled: undefined,
                      charCounterCount: undefined,
                      toolbarButtons: undefined,
                      toolbarButtonsMD: undefined,
                      toolbarButtonsSM: undefined
                    });
                  } else if (value === 'froala') {
                    form.changeValue('options', {
                      height: undefined,
                      width: undefined,
                      toolbar: undefined,
                      menubar: undefined,
                      quickInsertEnabled: true,
                      charCounterCount: true
                    });
                  }
                }
              },

              // tinymce
              {
                type: 'select',
                multiple: true,
                label: tipedLabel(
                  'Plugins',
                  'See https://www.tiny.cloud/docs/general-configuration-guide/basic-setup/ documentation'
                ),
                name: 'options.plugins',
                visibleOn: 'this.vendor === "tinymce"',
                value: [...tinymceOptions].join(','),
                searchable: true,
                maxTagCount: 5,
                overflowTagPopover: {
                  title: 'Plugin',
                  offset: [0, 5]
                },
                options: tinymceOptions
              },
              {
                type: 'select',
                name: 'options.toolbar',
                multiple: true,
                label: 'Toolbar',
                searchable: true,
                maxTagCount: 5,
                overflowTagPopover: {
                  title: 'Plugin',
                  offset: [0, 5]
                },
                visibleOn: 'this.vendor === "tinymce"',
                delimiter: tinymceToolbarsDelimiter,
                value:
                  'undo redo formatselect bold italic backcolor alignleft aligncenter alignright alignjustify bullist numlist outdent indent removeformat help',
                pipeOut: (value: string) => {
                  const arr = value?.split(tinymceToolbarsDelimiter) ?? [];
                  return tinymceToolbars
                    .filter(item => arr.find(a => a === item))
                    .join(' ');
                },
                options: tinymceToolbars
              },
              getSchemaTpl('switch', {
                label: 'Show menu bar',
                value: true,
                name: 'options.menubar',
                visibleOn: 'this.vendor === "tinymce"'
              }),

              // froala
              {
                type: 'select',
                name: 'options.toolbarButtons',
                multiple: true,
                visibleOn: 'this.vendor === "froala"',
                maxTagCount: 5,
                overflowTagPopover: {
                  title: 'Plugin',
                  offset: [0, 5]
                },
                label: tipedLabel(
                  'Toolbar-Large Screen',
                  'Screen width ≥ 1200px, refer to the document: https://froala.com/wysiwyg-editor/docs/options/'
                ),
                value: [...froalaOptions],
                joinValues: false,
                extractValue: true,
                options: [...froalaOptions],
                pipeOut: froalaOptionsPipeOut
              },
              {
                type: 'select',
                name: 'options.toolbarButtonsMD',
                multiple: true,
                visibleOn: 'this.vendor === "froala"',
                maxTagCount: 5,
                overflowTagPopover: {
                  title: 'Plugin',
                  offset: [0, 5]
                },
                label: tipedLabel(
                  'Toolbar-Middle Screen',
                  'Screen width ≥ 992px, if not configured, the toolbar will be consistent with the large screen settings, refer to the document: https://froala.com/wysiwyg-editor/docs/options/'
                ),
                joinValues: false,
                extractValue: true,
                options: [...froalaOptions],
                pipeOut: froalaOptionsPipeOut
              },
              {
                type: 'select',
                name: 'options.toolbarButtonsSM',
                multiple: true,
                visibleOn: 'this.vendor === "froala"',
                maxTagCount: 5,
                overflowTagPopover: {
                  title: 'Plugin',
                  offset: [0, 5]
                },
                label: tipedLabel(
                  'Toolbar-Small Screen',
                  'Screen width ≥ 768px, if not configured, the toolbar will be consistent with the large screen settings, refer to the document: https://froala.com/wysiwyg-editor/docs/options/'
                ),
                joinValues: false,
                extractValue: true,
                options: [...froalaOptions],
                pipeOut: froalaOptionsPipeOut
              },
              getSchemaTpl('switch', {
                label: 'Quick Insert',
                value: true,
                name: 'options.quickInsertEnabled',
                visibleOn: 'this.vendor === "froala"'
              }),
              getSchemaTpl('switch', {
                label: 'Word count',
                value: true,
                name: 'options.charCounterCount',
                visibleOn: 'this.vendor === "froala"'
              }),

              // Public part
              getSchemaTpl('apiControl', {
                mode: 'row',
                labelClassName: 'none',
                name: 'receiver',
                label: 'Image receiving interface',
                visibleOn:
                  '${vendor === "tinymce" && CONTAINS(options.plugins, "image")}'
              }),

              getSchemaTpl('apiControl', {
                mode: 'row',
                labelClassName: 'none',
                name: 'receiver',
                label: 'Image receiving interface',
                visibleOn: 'this.vendor === "froala"'
              }),

              getSchemaTpl('apiControl', {
                mode: 'row',
                labelClassName: 'none',
                name: 'videoReceiver',
                label: 'Video receiving interface',
                visibleOn: 'this.vendor === "froala"'
              }),
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('placeholder', {
                visibleOn: 'this.vendor !== "tinymce"'
              }),
              getSchemaTpl('description')
            ]
          },
          getSchemaTpl('status', {isFormItem: true}),
          getSchemaTpl('validation', {tag: ValidatorTag.Code})
        ])
      },
      {
        title: 'Appearance',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              title: '${vendor === "tinymce" ? "Editor" : "Editing Area"}',
              body: [
                {
                  type: 'input-number',
                  label: 'Height',
                  min: 0,
                  name: 'options.height',
                  visibleOn: 'this.vendor === "tinymce"'
                },
                {
                  type: 'input-number',
                  label: 'Height',
                  min: 150,
                  max: 400,
                  name: 'options.height',
                  visibleOn: 'this.vendor === "froala"'
                }
              ]
            },
            getSchemaTpl('style:formItem', {
              renderer: context.info.renderer
            }),
            getSchemaTpl('style:classNames')
          ])
        ]
      },
      {
        title: 'Event',
        className: 'p-none',
        body: [
          getSchemaTpl('eventControl', {
            name: 'onEvent',
            ...getEventControlConfig(this.manager, context)
          })
        ]
      }
    ]);
  };
}

registerEditorPlugin(RichTextControlPlugin);

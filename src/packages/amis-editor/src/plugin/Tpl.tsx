import {
  registerEditorPlugin,
  RendererPluginAction,
  RendererPluginEvent
} from '@/packages/amis-editor-core/src';
import {BaseEventContext, BasePlugin} from '@/packages/amis-editor-core/src';
import {defaultValue, getSchemaTpl, setSchemaTpl} from '@/packages/amis-editor-core/src';
import {tipedLabel} from '@/packages/amis-editor-core/src';
import {getEventControlConfig} from '../renderer/event-control/helper';
import {ValidatorTag} from '../validator';
import {InlineEditableElement} from '@/packages/amis-editor-core/src';

setSchemaTpl(
  'tpl:content',
  getSchemaTpl('textareaFormulaControl', {
    label: 'Text content',
    mode: 'normal',
    visibleOn: 'this.wrapperComponent !== undefined',
    pipeIn: (value: any, data: any) => value || (data && data.html),
    name: 'tpl'
  })
);

setSchemaTpl('tpl:rich-text', {
  label: 'content',
  type: 'input-rich-text',
  mode: 'normal',
  buttons: [
    'paragraphFormat',
    'quote',
    'textColor',
    'backgroundColor',
    '|',
    'bold',
    'italic',
    'underline',
    'strikeThrough',
    '|',
    'formatOL',
    'format',
    'align',
    '|',
    'insertLink',
    'insertImage',
    'insertTable',
    '|',
    'undo',
    'redo',
    'fullscreen'
  ],
  minRows: 5,
  language: 'html',
  visibleOn: 'this.wrapperComponent === undefined',
  pipeIn: (value: any, data: any) => value || (data && data.html),
  name: 'tpl'
});

setSchemaTpl('tpl:wrapperComponent', {
  name: 'wrapperComponent',
  type: 'select',
  pipeIn: (value: any) => (value === undefined ? 'rich-text' : value),
  pipeOut: (value: any) => (value === 'rich-text' ? undefined : value),
  label: 'text format',
  options: [
    {
      label: 'Normal characters',
      value: ''
    },
    {
      label: 'Paragraph',
      value: 'p'
    },
    {
      label: 'First level title',
      value: 'h1'
    },
    {
      label: 'Secondary Title',
      value: 'h2'
    },
    {
      label: 'Level 3 title',
      value: 'h3'
    },
    {
      label: 'Level 4 title',
      value: 'h4'
    },
    {
      label: 'Level 5 title',
      value: 'h5'
    },
    {
      label: 'Level 6 title',
      value: 'h6'
    },
    {
      label: 'Rich text',
      value: 'rich-text'
    }
  ],
  onChange: (value: string, oldValue: string, model: any, form: any) => {
    (value === undefined || oldValue === undefined) &&
      form.setValueByName('tpl', '');
  }
});

export class TplPlugin extends BasePlugin {
  static id = 'TplPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'tpl';
  $schema = '/schemas/TplSchema.json';

  order = -200;

  // Component name
  name = 'character';
  isBaseComponent = true;
  icon = 'fa fa-file-o';
  pluginIcon = 'plain-plugin'; // Use text icon
  description =
    'Used to display text or paragraphs, supports template syntax to associate dynamic data. ';
  docLink = '/amis/zh-CN/components/tpl';
  tags = ['show'];
  previewSchema = {
    type: 'tpl',
    tpl: 'This is the current time of the template content <%- new Date() %>'
  };
  scaffold: any = {
    type: 'tpl',
    tpl: 'Please edit the content',
    inline: true,
    wrapperComponent: ''
  };

  // Define elements that can be edited inline
  inlineEditableElements: Array<InlineEditableElement> = [
    {
      match: ':scope > *',
      key: 'tpl',
      mode: 'rich-text'
    }
  ];

  panelTitle = 'character';
  panelJustify = true;

  // Event definition
  events: RendererPluginEvent[] = [
    {
      eventName: 'click',
      eventLabel: 'click',
      description: 'Triggered when clicked',
      dataSchema: [
        {
          type: 'object',
          properties: {
            context: {
              type: 'object',
              title: 'Context',
              properties: {
                nativeEvent: {
                  type: 'object',
                  title: 'Mouse event object'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'mouseenter',
      eventLabel: 'Mouse Move',
      description: 'Triggered when the mouse moves in',
      dataSchema: [
        {
          type: 'object',
          properties: {
            context: {
              type: 'object',
              title: 'Context',
              properties: {
                nativeEvent: {
                  type: 'object',
                  title: 'Mouse event object'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'mouseleave',
      eventLabel: 'Mouse out',
      description: 'Triggered when the mouse moves out',
      dataSchema: [
        {
          type: 'object',
          properties: {
            context: {
              type: 'object',
              title: 'Context',
              properties: {
                nativeEvent: {
                  type: 'object',
                  title: 'Mouse event object'
                }
              }
            }
          }
        }
      ]
    }
  ];

  //Action definition
  actions: RendererPluginAction[] = [];

  panelBodyCreator = (context: BaseEventContext) => {
    // In a column of a table/CRUD/model list
    const isInTable: boolean = /\/cell\/field\/tpl$/.test(context.path);

    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              !isInTable ? getSchemaTpl('tpl:wrapperComponent') : null,
              getSchemaTpl('switch', {
                label: tipedLabel(
                  'Inline mode',
                  'Inline mode uses the <code>span</code> tag to wrap content by default, and non-inline mode uses the <code>div</code> tag as the container by default.'
                ),
                name: 'inline',
                pipeIn: defaultValue(true),
                hiddenOn: 'this.wrapperComponent !== ""'
              }),
              {
                type: 'input-number',
                label: 'Maximum number of displayed rows',
                name: 'maxLine',
                min: 0
              },
              getSchemaTpl('tpl:content'),
              {
                type: 'textarea',
                name: 'editorSetting.mock.tpl',
                mode: 'vertical',
                label: tipedLabel(
                  'Fill in fake data',
                  'The fake data text is only displayed in the editing area, and the actual content of the text will be displayed during runtime'
                ),
                pipeOut: (value: any) => (value === '' ? undefined : value)
              },
              getSchemaTpl('tpl:rich-text')
            ]
          },
          getSchemaTpl('status')
        ])
      },
      {
        title: 'Appearance',
        body: getSchemaTpl('collapseGroup', [
          ...getSchemaTpl('theme:common', {
            exclude: ['layout'],
            baseExtra: [
              getSchemaTpl('theme:font', {
                label: 'character',
                name: 'themeCss.baseControlClassName.font'
              })
            ]
          })
        ])
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

  popOverBody = [
    getSchemaTpl('tpl:content'),
    getSchemaTpl('tpl:rich-text'),
    getSchemaTpl('tpl:wrapperComponent')
  ];
}

registerEditorPlugin(TplPlugin);

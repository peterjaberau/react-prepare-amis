import {
  registerEditorPlugin,
  BasePlugin,
  getSchemaTpl,
  tipedLabel
} from '@/packages/amis-editor-core/src';

export class LinkPlugin extends BasePlugin {
  static id = 'LinkPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'link';
  $schema = '/schemas/LinkSchema.json';

  // Component name
  name = 'Link';
  isBaseComponent = true;
  description = 'Used to display text links';
  tags = ['show'];
  icon = 'fa fa-link';
  pluginIcon = 'url-plugin';
  scaffold = {
    type: 'link',
    value: 'http://www.baidu.com/'
  };
  previewSchema = {
    ...this.scaffold,
    label: this.name
  };

  panelTitle = 'Link';
  panelJustify = true;
  panelBody = [
    getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              getSchemaTpl('valueFormula', {
                name: 'href',
                label: tipedLabel(
                  'Destination address',
                  'Supports variable retrieval. If the field name has been bound, you do not need to set it.'
                ),
                rendererSchema: {
                  type: 'input-text'
                }
              }),
              {
                label: tipedLabel(
                  'content',
                  'If not filled in, the target address value will be used automatically'
                ),
                type: 'ae-textareaFormulaControl',
                mode: 'normal',
                pipeIn: (value: any, data: any) => value || (data && data.html),
                name: 'body'
              },
              getSchemaTpl('switch', {
                name: 'blank',
                label: 'Open in a new window'
              }),

              getSchemaTpl('iconLink', {
                name: 'icon',
                label: 'left icon'
              }),

              getSchemaTpl('iconLink', {
                name: 'rightIcon',
                label: 'right icon'
              })
            ]
          },
          getSchemaTpl('collapseGroup', [
            {
              title: 'Advanced Settings',
              body: [
                {
                  name: 'htmlTarget',
                  type: 'input-text',
                  label: tipedLabel(
                    'Anchor point',
                    'The target attribute of the HTML <a> element, which specifies where to display the linked resource'
                  )
                }
              ]
            }
          ]),
          getSchemaTpl('status', {
            disabled: true
          })
        ])
      },
      {
        title: 'Appearance',
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('style:classNames', {
            isFormItem: false,
            schema: [
              getSchemaTpl('className', {
                name: 'iconClassName',
                label: 'left icon',
                visibleOn: 'this.icon'
              }),
              getSchemaTpl('className', {
                name: 'rightIconClassName',
                label: 'right icon',
                visibleOn: 'this.rightIcon'
              })
            ]
          })
        ])
      }
    ])
  ];
}

registerEditorPlugin(LinkPlugin);

import {
  BaseEventContext,
  BasePlugin,
  RegionConfig,
  defaultValue,
  getSchemaTpl,
  tipedLabel,
  registerEditorPlugin
} from '@/packages/amis-editor-core/src';

export class Card2Plugin extends BasePlugin {
  static id = 'Card2Plugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'card2';
  $schema = '/schemas/Card2Schema.json';

  // Component name
  name = 'Card';
  isBaseComponent = true;
  disabledRendererPlugin = true;
  description = 'Show a single card.';
  tags = ['show'];
  icon = '';
  scaffold = {
    type: 'card2',
    body: 'content'
  };
  previewSchema = {
    ...this.scaffold
  };

  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: 'Content area',
      renderMethod: 'renderBody',
      preferTag: 'display'
    }
  ];

  panelTitle = 'Card';

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    return [
      getSchemaTpl('tabs', [
        {
          title: 'Attributes',
          body: getSchemaTpl('collapseGroup', [
            {
              title: 'Basic',
              body: [
                getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                {
                  type: 'button-group-select',
                  label: tipedLabel(
                    'Select area',
                    'Click to trigger the selected or unselected area'
                  ),
                  name: 'checkOnItemClick',
                  options: [
                    {label: 'whole', value: true},
                    {label: 'Selection box', value: false}
                  ],
                  pipeIn: defaultValue(false)
                },
                getSchemaTpl('switch', {
                  label: tipedLabel(
                    'Hide selection box',
                    'The selection box is no longer displayed, and the selected style can be achieved by customizing the selected state appearance'
                  ),
                  name: 'hideCheckToggler',
                  visibleOn: 'this.checkOnItemClick'
                })
              ]
            },
            getSchemaTpl('status', {isFormItem: false})
          ])
        },
        {
          title: 'Appearance',
          body: getSchemaTpl('collapseGroup', [
            getSchemaTpl('style:classNames', {
              isFormItem: false,
              schema: [
                getSchemaTpl('className', {
                  name: 'bodyClassName',
                  label: 'Content area',
                  visibleOn: 'this.icon'
                }),
                // ALL
                getSchemaTpl('className', {
                  name: 'selectedClassName',
                  label: 'Selected',
                  visibleOn: 'this.icon'
                })
              ]
            })
          ])
        }
      ])
    ];
  };
}

registerEditorPlugin(Card2Plugin);

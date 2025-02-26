import {
  registerEditorPlugin,
  BasePlugin,
  getSchemaTpl,
  tipedLabel,
  RegionConfig,
  BaseEventContext,
  BasicToolbarItem
} from '@/packages/amis-editor-core/src';

export class SliderPlugin extends BasePlugin {
  static id = 'SliderPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'slider';
  $schema = '/schemas/SliderSchema.json';

  // Component name
  name = 'Slider';
  isBaseComponent = true;
  description =
    'Mainly used to support left and right sliding to display more content on mobile terminals, and more content is displayed on the right side on desktop terminals';
  tags = ['show'];
  icon = 'fa fa-link';
  pluginIcon = 'url-plugin';
  scaffold = {
    type: 'slider',
    body: [],
    left: [],
    right: []
  };
  previewSchema = {
    ...this.scaffold,
    label: this.name
  };

  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: 'Main content area'
    },
    {
      key: 'left',
      label: 'Left content area',
      hiddenOn: schema => !schema.left
    },
    {
      key: 'right',
      label: 'right content area',
      hiddenOn: schema => !schema.right
    }
  ];

  panelTitle = 'Slider';
  panelJustify = true;
  panelBody = [
    getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: [
              {
                type: 'checkboxes',
                name: '$$area',
                multiple: true,
                label: 'Regional display',
                options: [
                  {
                    label: 'Left content area',
                    value: 'left'
                  },
                  {
                    label: 'right content area',
                    value: 'right'
                  }
                ],
                pipeIn: (value: any, data: any, schema: any) => {
                  let res = [];
                  if (schema.left) {
                    res.push('left');
                  }
                  if (schema.right) {
                    res.push('right');
                  }
                  return res.join(',');
                },
                onChange: (
                  value: string,
                  data: any,
                  schema: any,
                  props: any
                ) => {
                  if (value.includes('left')) {
                    props.setValueByName(
                      'left',
                      props.getValueByName('$$left') || []
                    );
                  } else {
                    props.setValueByName(
                      '$$left',
                      props.getValueByName('left')
                    );
                    props.setValueByName('left', undefined);
                  }

                  if (value.includes('right')) {
                    props.setValueByName(
                      'right',
                      props.getValueByName('$$right') || []
                    );
                  } else {
                    props.setValueByName(
                      '$$right',
                      props.getValueByName('right')
                    );
                    props.setValueByName('right', undefined);
                  }
                }
              },
              {
                type: 'input-text',
                name: 'bodyWidth',
                value: '60%',
                label: tipedLabel(
                  'Content area width',
                  'Main content area width ratio, default 60%'
                )
              }
            ]
          },
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

  filterProps(props: any) {
    // Cannot switch while editing
    props.canSwitch = false;
    return props;
  }

  /**
   * Added switching toolbar
   * @param context
   * @param toolbars
   */
  buildEditorToolbar(
    context: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) {
    if (
      context.info.plugin === this &&
      context.info.renderer.name === 'slider' &&
      !context.info.hostId
    ) {
      const node = context.node;
      const schema = context.schema;

      if (schema.left) {
        toolbars.push({
          level: 'secondary',
          icon: 'fa fa-chevron-left',
          tooltip: 'Show content on the left',
          onClick: () => {
            const control = node.getComponent();
            control?.showLeft?.();
            control?.hideRight?.();
          }
        });
      }

      if (schema.right) {
        toolbars.push({
          level: 'secondary',
          icon: 'fa fa-chevron-right',
          tooltip: 'Show content on the right',
          onClick: () => {
            const control = node.getComponent();
            control?.showRight?.();
            control?.hideLeft?.();
          }
        });
      }
    }
  }
}

registerEditorPlugin(SliderPlugin);

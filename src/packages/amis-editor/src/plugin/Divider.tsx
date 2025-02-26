import {
  BasePlugin,
  BaseEventContext,
  defaultValue,
  getI18nEnabled,
  getSchemaTpl,
  registerEditorPlugin,
  tipedLabel,
  valuePipeOut
} from 'amis-editor-core';

export class DividerPlugin extends BasePlugin {
  static id = 'DividerPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'divider';
  $schema = '/schemas/DividerSchema.json';

  // Component name
  name = 'Separator';
  isBaseComponent = true;
  icon = 'fa fa-minus';
  pluginIcon = 'divider-plugin';
  description =
    'Used to display a dividing line, which can be used for visual isolation. ';
  docLink = '/amis/zh-CN/components/divider';
  scaffold = {
    type: 'divider',
    $$dragMode: 'hv'
  };
  previewSchema: any = {
    type: 'divider',
    className: 'm-t-none m-b-none'
  };

  panelTitle = 'Separator';
  panelJustify = true;
  tags = ['show'];

  panelBodyCreator = (context: BaseEventContext) => {
    const i18nEnabled = getI18nEnabled();
    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: [
              i18nEnabled
                ? {
                    type: 'input-text-i18n',
                    name: 'title',
                    label: 'Title',
                    placeholder: 'Please enter a title'
                  }
                : getSchemaTpl('valueFormula', {
                    name: 'title',
                    label: 'Title',
                    placeholder: 'Please enter a title',
                    rendererSchema: {
                      type: 'input-text'
                    }
                  })
            ]
          },
          getSchemaTpl('status')
        ])
      },
      {
        title: 'Appearance',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic style',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              getSchemaTpl('layout:width:v2', {
                visibleOn:
                  'this.style && this.style.position && (this.style.position === "fixed" || this.style.position === "absolute")'
              }),
              {
                mode: 'horizontal',
                type: 'select',
                label: 'type',
                name: 'lineStyle',
                value: 'solid',
                options: [
                  {
                    value: 'solid',
                    label: 'solid line'
                  },
                  {
                    value: 'dashed',
                    label: 'dashed line'
                  }
                ]
              },
              {
                mode: 'horizontal',
                type: 'select',
                label: 'direction',
                name: 'direction',
                value: 'horizontal',
                options: [
                  {
                    value: 'horizontal',
                    label: 'horizontal'
                  },
                  {
                    value: 'vertical',
                    label: 'vertical'
                  }
                ]
              },
              {
                mode: 'horizontal',
                type: 'input-number',
                label: 'angle',
                name: 'rotate',
                value: 0,
                min: -360,
                max: 360
              },
              getSchemaTpl('theme:select', {
                mode: 'horizontal',
                label: 'Line length',
                name: 'style.width',
                placeholder: '100%',
                visibleOn: 'this.direction !== "vertical"',
                clearValueOnHidden: true
              }),
              getSchemaTpl('theme:select', {
                mode: 'horizontal',
                label: 'Line length',
                name: 'style.height',
                placeholder: 'var(--sizes-base-15)',
                visibleOn: 'this.direction === "vertical"',
                clearValueOnHidden: true
              }),
              getSchemaTpl('theme:select', {
                mode: 'horizontal',
                label: 'Line width',
                name: 'style.borderWidth',
                placeholder: '1px',
                visibleOn: '!this.title || this.direction === "vertical"'
              }),
              getSchemaTpl('theme:select', {
                mode: 'horizontal',
                label: 'Line width',
                name: 'themeCss.titleWrapperControlClassName.border-bottom-width',
                placeholder: '1px',
                visibleOn: '!!this.title && this.direction !== "vertical"',
                clearValueOnHidden: true,
                pipeIn: (value: any, form: any) => {
                  if (
                    value === undefined &&
                    form.data?.style?.borderWidth !== undefined
                  ) {
                    const bwidth = form.data.style.borderWidth;
                    setTimeout(() =>
                      form.setValueByName(
                        'themeCss.titleWrapperControlClassName.border-bottom-width',
                        bwidth
                      )
                    );
                    return bwidth;
                  }
                  return value;
                }
              }),
              getSchemaTpl('theme:colorPicker', {
                mode: 'horizontal',
                label: 'color',
                name: 'color',
                placeholder: 'var(--colors-neutral-line-8)',
                labelMode: 'input',
                needGradient: true
              }),
              getSchemaTpl('theme:paddingAndMargin', {
                name: 'style',
                hidePadding: true
              })
            ]
          },
          {
            title: 'Title style',
            visibleOn: '!!this.title && this.direction !== "vertical"',
            body: [
              {
                type: 'select',
                name: 'titlePosition',
                label: 'Location',
                pipeIn: defaultValue('center'),
                options: [
                  {
                    value: 'left',
                    label: 'left'
                  },
                  {
                    value: 'center',
                    label: 'Center'
                  },
                  {
                    value: 'right',
                    label: 'right'
                  }
                ],
                clearValueOnHidden: true
              },
              getSchemaTpl('theme:select', {
                label: tipedLabel(
                  'distance',
                  'The distance between the title and the nearest left and right borders, the default value is 5%'
                ),
                name: 'themeCss.titleWrapperControlClassName.flex-basis',
                placeholder: '5%',
                visibleOn:
                  'this.titlePosition === "left" || this.titlePosition === "right"',
                clearValueOnHidden: true
              }),
              getSchemaTpl('theme:font', {
                title: 'Character',
                name: 'themeCss.titleControlClassName.font',
                textAlign: false,
                clearValueOnHidden: true
              }),
              getSchemaTpl('theme:paddingAndMargin', {
                name: 'themeCss.titleControlClassName.padding-and-margin',
                hidePadding: true,
                clearValueOnHidden: true
              })
            ]
          }
        ])
      }
    ]);
  };
}

registerEditorPlugin(DividerPlugin);

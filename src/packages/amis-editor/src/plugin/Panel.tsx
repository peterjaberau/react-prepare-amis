import {Button} from 'amis';
import React from 'react';
import {
  BasePlugin,
  BaseEventContext,
  BasicPanelItem,
  RegionConfig,
  RendererInfo,
  BuildPanelEventContext,
  defaultValue,
  getSchemaTpl,
  registerEditorPlugin,
  PluginInterface
} from 'amis-editor-core';
import {InlineEditableElement} from 'amis-editor-core';

export class PanelPlugin extends BasePlugin {
  static id = 'PanelPlugin';
  // Associated renderer name
  rendererName = 'panel';
  $schema = '/schemas/panelSchema.json';

  name = 'Panel';
  isBaseComponent = true;
  icon = 'fa fa-window-maximize';
  pluginIcon = 'panel-plugin';
  description = 'Shows a panel with configurable title and content area.';
  docLink = '/amis/zh-CN/components/panel';
  tags = ['layout container'];
  scaffold = {
    type: 'panel',
    title: 'Title',
    body: 'content'
  };
  previewSchema = {
    type: 'panel',
    title: 'This is a panel',
    body: 'This is the content area',
    className: 'Panel--default text-left m-b-none',
    actions: [
      {
        label: 'Button 1',
        type: 'button'
      },
      {
        label: 'Button 2',
        type: 'button'
      }
    ]
  };

  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: 'Content area',

      // Override the renderBody method in the renderer
      renderMethod: 'renderBody',

      // This case is very different and needs to be written by yourself. The form directly reuses the Panel to output content.
      // This case should skip the wrapping Region
      // Only wrap when it outputs itself, the form is called to send children to complete the rendering
      // Own words are other ways.
      renderMethodOverride: (regions, insertRegion) =>
        function (this: any, ...args: any[]) {
          const info: RendererInfo = this.props.$$editor;
          const dom = this.super(...args);

          if (info && !this.props.children) {
            return insertRegion(this, dom, regions, info, info.plugin.manager);
          }

          return dom;
        }
    },

    {
      key: 'actions',
      label: 'Button Group',
      renderMethod: 'renderActions',
      preferTag: 'button'
    }
  ];

  // Define elements that can be edited inline
  inlineEditableElements: Array<InlineEditableElement> = [
    {
      match: ':scope.cxd-Panel .cxd-Panel-title',
      key: 'title'
    }
  ];

  panelTitle = 'Panel';

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    const isForm =
      /(?:^|\/)form$/.test(context.path) || context?.schema?.type === 'form';

    return [
      getSchemaTpl('tabs', [
        {
          title: 'Attributes',
          body: [
            getSchemaTpl('collapseGroup', [
              {
                className: 'p-none',
                id: 'properties-basic',
                title: 'Basic',
                body: [
                  getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                  getSchemaTpl('title'),
                  isForm
                    ? null
                    : {
                        children: (
                          <Button
                            size="sm"
                            level="info"
                            className="m-b"
                            onClick={() => {
                              // this.manager.showInsertPanel('body')
                              this.manager.showRendererPanel('');
                            }}
                            block
                          >
                            New content in the content area
                          </Button>
                        )
                      }
                ]
              },
              getSchemaTpl('status')
            ])
          ]
        },
        {
          title: 'Appearance',
          body: [
            getSchemaTpl('collapseGroup', [
              ...getSchemaTpl('theme:common', {
                exclude: ['layout'],
                classname: 'baseControlClassName',
                needState: false,
                baseTitle: 'Basic style',
                extra: [
                  getSchemaTpl('theme:base', {
                    classname: 'headerControlClassName',
                    needState: false,
                    title: 'Title area style',
                    extra: [
                      getSchemaTpl('theme:font', {
                        label: 'character',
                        name: 'themeCss.titleControlClassName.font'
                      })
                    ]
                  }),
                  getSchemaTpl('theme:base', {
                    classname: 'bodyControlClassName',
                    needState: false,
                    title: 'Content area style',
                    extra: [
                      getSchemaTpl('subFormItemMode', {
                        label: 'Form display mode'
                      }),
                      getSchemaTpl('subFormHorizontalMode', {
                        label: 'Form horizontal proportion'
                      }),
                      getSchemaTpl('subFormHorizontal')
                    ]
                  }),
                  getSchemaTpl('theme:base', {
                    classname: 'footerControlClassName',
                    needState: false,
                    title: 'Bottom area style',
                    extra: [
                      getSchemaTpl('switch', {
                        name: 'affixFooter',
                        label: 'Fixed bottom',
                        value: false
                      })
                    ]
                  })
                ]
              }),
              getSchemaTpl('style:classNames', {
                isFormItem: false,
                schema: [
                  getSchemaTpl('className', {
                    name: 'headerClassName',
                    label: 'Head area'
                  }),

                  getSchemaTpl('className', {
                    name: 'bodyClassName',
                    label: 'Content area'
                  }),

                  getSchemaTpl('className', {
                    name: 'footerClassName',
                    label: 'Bottom area'
                  }),

                  getSchemaTpl('className', {
                    name: 'actionsClassName',
                    label: 'button outer layer'
                  }),
                  {
                    name: isForm ? 'panelClassName' : 'className',
                    label: 'Topic',
                    type: 'select',
                    size: 'sm',
                    id: 'panel-settings-panelClassName',
                    pipeIn: (value: any) =>
                      typeof value === 'string' &&
                      /(?:^|\s)(Panel\-\-(\w+))(?:$|\s)/.test(value)
                        ? RegExp.$1
                        : 'Panel--default',
                    pipeOut: (value: string, origin: string) =>
                      origin
                        ? `${origin.replace(
                            /(?:^|\s)(Panel\-\-(\w+))(?=($|\s))/g,
                            ''
                          )} ${value}`
                            .replace(/\s+/g, ' ')
                            .trim()
                        : value,
                    options: [
                      {
                        label: 'Default',
                        value: 'Panel--default'
                      },
                      {
                        label: 'main color',
                        value: 'Panel--primary'
                      },
                      {
                        label: 'prompt',
                        value: 'Panel--info'
                      },
                      {
                        label: 'Success',
                        value: 'Panel--success'
                      },
                      {
                        label: 'Warning',
                        value: 'Panel--warning'
                      },
                      {
                        label: 'danger',
                        value: 'Panel--danger'
                      }
                    ]
                  }
                ]
              })
            ])
          ]
        }
      ])
    ];
  };

  buildEditorPanel(
    context: BuildPanelEventContext,
    panels: Array<BasicPanelItem>
  ) {
    const plugin: PluginInterface = this;
    const schema = context.schema;
    const store = this.manager.store;

    if (
      context.info.renderer.name === 'form' &&
      schema.wrapWithPanel !== false &&
      !context.selections.length &&
      false
    ) {
      /** Panel related configurations are integrated into From*/
      panels.push({
        key: 'panel',
        icon: 'fa fa-list-alt',
        pluginIcon: plugin.pluginIcon,
        title: this.panelTitle,
        render: this.manager.makeSchemaFormRender({
          body: this.panelBodyCreator(context),
          panelById: store.activeId
        })
      });
    } else {
      super.buildEditorPanel(context, panels);
    }
  }
}

registerEditorPlugin(PanelPlugin);

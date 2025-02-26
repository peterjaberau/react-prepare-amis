import {RendererPluginAction, registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import React from 'react';
import {buildLinkActionDesc} from '../renderer/event-control';

export class OfficeViewerPlugin extends BasePlugin {
  static id = 'OfficeViewerPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'office-viewer';
  $schema = '/schemas/OfficeViewerSchema.json';

  // Component name
  name = 'Document Preview';
  isBaseComponent = true;
  description = 'Office Document Preview';
  docLink = '/amis/zh-CN/components/office-viewer';
  tags = ['show'];
  icon = 'fa fa-file-word';
  pluginIcon = 'officeViewer-plugin';
  scaffold = {
    type: 'office-viewer'
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = 'Document Preview';

  panelJustify = true;

  actions: RendererPluginAction[] = [
    {
      actionType: 'print',
      actionLabel: 'Print',
      description: 'Print document',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            Print a document
            {buildLinkActionDesc(props.manager, info)}
          </div>
        );
      }
    },
    {
      actionType: 'saveAs',
      actionLabel: 'Download',
      description: 'Download document',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            Download Document
            {buildLinkActionDesc(props.manager, info)}
          </div>
        );
      }
    }
  ];

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
                  getSchemaTpl('officeUrl', {
                    name: 'src',
                    type: 'input-text',
                    label: 'Document address'
                  }),

                  getSchemaTpl('switch', {
                    type: 'switch',
                    label: 'Whether to render',
                    name: 'display',
                    pipeIn: defaultValue(true),
                    inline: true
                  })
                ]
              },

              {
                title: 'Word Rendering Configuration',
                collapsed: true,
                body: [
                  {
                    type: 'combo',
                    name: 'wordOptions',
                    // Need to add this under panelJustify
                    mode: 'normal',
                    noBorder: true,
                    multiLine: true,
                    items: [
                      getSchemaTpl('switch', {
                        label: 'Ignore width',
                        inline: true,
                        name: 'ignoreWidth'
                      }),
                      {
                        type: 'input-text',
                        label: 'Page margin',
                        name: 'padding'
                      },
                      getSchemaTpl('switch', {
                        label: 'List font used',
                        pipeIn: defaultValue(true),
                        name: 'bulletUseFont',
                        inline: true
                      }),
                      getSchemaTpl('switch', {
                        label: 'Variable replacement',
                        name: 'enableVar',
                        inline: true
                      }),
                      {
                        type: 'input-text',
                        label: 'Forced line height',
                        name: 'forceLineHeight'
                      },
                      {
                        type: 'input-kv',
                        label: 'font mapping',
                        name: 'fontMapping'
                      },
                      getSchemaTpl('switch', {
                        label: 'Whether to enable page rendering',
                        name: 'page',
                        inline: true
                      }),
                      {
                        type: 'input-number',
                        label: 'Page top and bottom margins',
                        name: 'pageMarginBottom',
                        visibleOn: 'this.page'
                      },
                      {
                        type: 'input-color',
                        label: 'Page background color',
                        pipeIn: defaultValue('#FFFFFF'),
                        name: 'pageBackground',
                        visibleOn: 'this.page'
                      },
                      getSchemaTpl('switch', {
                        label: 'Whether to display page shadow',
                        name: 'pageShadow',
                        inline: true,
                        visibleOn: 'this.page'
                      }),
                      getSchemaTpl('switch', {
                        label: 'Whether to display page package',
                        name: 'pageWrap',
                        inline: true,
                        visibleOn: 'this.page'
                      }),
                      {
                        type: 'input-number',
                        label: 'Page wrapping width',
                        name: 'pageWrapPadding',
                        visibleOn: 'this.page'
                      },
                      {
                        type: 'input-color',
                        label: 'Page wrap background color',
                        pipeIn: defaultValue('#ECECEC'),
                        name: 'pageWrapBackground',
                        visibleOn: 'this.page'
                      },
                      {
                        type: 'input-number',
                        label: 'scaling ratio',
                        min: 0.1,
                        max: 1,
                        name: 'zoom',
                        visibleOn: 'this.page'
                      },
                      getSchemaTpl('switch', {
                        label: 'Adaptive width',
                        name: 'zoomFitWidth',
                        inline: true,
                        visibleOn: 'this.page'
                      })
                    ]
                  }
                ]
              }
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

registerEditorPlugin(OfficeViewerPlugin);

import {Button} from '@/packages/amis-ui/src';
import React from 'react';
import {registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {
  BaseEventContext,
  BasePlugin,
  BasicRendererInfo,
  InsertEventContext,
  PluginEvent,
  PluginInterface,
  RegionConfig,
  RendererInfo,
  RendererInfoResolveEventContext,
  VRendererConfig
} from '@/packages/amis-editor-core/src';
import {defaultValue, getSchemaTpl} from '@/packages/amis-editor-core/src';
import flatten from 'lodash/flatten';
import {VRenderer} from '@/packages/amis-editor-core/src';
import {generateId} from '../util';

export class CardPlugin extends BasePlugin {
  static id = 'CardPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'card';
  $schema = '/schemas/CardSchema.json';

  // Component name
  name = 'Card';
  isBaseComponent = true;
  description = 'Show a single card.';
  docLink = '/amis/zh-CN/components/card';
  tags = ['show'];
  icon = '';
  pluginIcon = 'card-plugin';
  scaffold = {
    type: 'card',
    header: {
      title: 'Title',
      subTitle: 'Subtitle'
    },
    body: 'content',
    actions: [
      {
        type: 'button',
        label: 'button',
        actionType: 'dialog',
        id: generateId(),
        dialog: {
          title: 'Title',
          body: 'content'
        }
      }
    ]
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
    },

    {
      key: 'actions',
      label: 'Button Group',
      renderMethod: 'renderActions',
      wrapperResolve: (dom: HTMLElement) => dom,
      preferTag: 'button'
    }
  ];

  panelTitle = 'Card';
  panelBodyCreator = (context: BaseEventContext) => {
    return [
      getSchemaTpl('tabs', [
        {
          title: 'General',
          body: flatten([
            getSchemaTpl('layout:originPosition', {value: 'left-top'}),
            {
              children: (
                <div>
                  <Button
                    block
                    level="primary"
                    size="sm"
                    onClick={() =>
                      // this.manager.showInsertPanel('body', context.id)
                      this.manager.showRendererPanel(
                        'exhibit',
                        'Please click Add Content Element from the component panel on the left'
                      )
                    }
                  >
                    What's New
                  </Button>
                </div>
              )
            },
            {
              type: 'divider'
            },
            getSchemaTpl('cardTitle'),
            getSchemaTpl('cardSubTitle'),
            {
              name: 'header.avatar',
              type: 'input-text',
              label: 'Image address',
              description:
                'Support template syntax such as: <code>\\${xxx}</code>'
            },
            {
              name: 'href',
              type: 'input-text',
              label: 'Open external link'
            },
            getSchemaTpl('cardDesc'),
            {
              name: 'header.highlight',
              type: 'input-text',
              label: 'Whether to highlight the expression',
              description: '如： <code>this.isOwner</code>'
            }
          ])
        },
        {
          title: 'Appearance',
          body: [
            {
              type: 'input-range',
              name: 'actionsCount',
              pipeIn: defaultValue(4),
              min: 1,
              max: 10,
              step: 1,
              label:
                'The maximum number of buttons that can be placed in a card row'
            },
            getSchemaTpl('className', {
              name: 'titleClassName',
              label: 'Title CSS class name'
            }),
            getSchemaTpl('className', {
              name: 'highlightClassName',
              label: 'Highlight CSS class name'
            }),
            getSchemaTpl('className', {
              name: 'subTitleClassName',
              label: 'Subtitle CSS class name'
            }),
            getSchemaTpl('className', {
              name: 'descClassName',
              label: 'Description CSS class name'
            }),
            getSchemaTpl('className', {
              name: 'avatarClassName',
              label: 'Image outer CSS class name'
            }),
            getSchemaTpl('className', {
              name: 'imageClassName',
              label: 'Image CSS class name'
            }),
            getSchemaTpl('className', {
              name: 'bodyClassName',
              label: 'Content area CSS class name'
            }),
            getSchemaTpl('className')
          ]
        },
        {
          title: 'Show and hide',
          body: [getSchemaTpl('ref'), getSchemaTpl('visible')]
        }
      ])
    ];
  };

  /*exchangeRenderer(id: string) {
    this.manager.showReplacePanel(id, '展示');
  }*/

  fieldWrapperResolve = (dom: HTMLElement) => dom;

  overrides = {
    renderFeild: function (
      this: any,
      region: string,
      field: any,
      index: any,
      props: any
    ) {
      const dom = this.super(region, field, index, props);
      const info: RendererInfo = this.props.$$editor;

      if (!info || !field.$$id) {
        return dom;
      }

      const plugin = info.plugin as CardPlugin;
      const id = field.$$id;
      return (
        <VRenderer
          type={info.type}
          plugin={info.plugin}
          renderer={info.renderer}
          multifactor
          key={id}
          $schema="/schemas/CardBodyField.json"
          hostId={info.id}
          memberIndex={index}
          name={`${`field${index + 1}`}`}
          id={id}
          draggable={false}
          wrapperResolve={plugin.fieldWrapperResolve}
          schemaPath={`${info.schemaPath}/body/${index}`}
          path={`${this.props.$path}/${index}`} // seems useless
          data={this.props.data} // seems useless
        >
          {dom}
        </VRenderer>
      );
    }
  };

  vRendererConfig: VRendererConfig = {
    panelTitle: 'Fields',
    panelBodyCreator: (context: BaseEventContext) => {
      return [
        getSchemaTpl('label'),
        getSchemaTpl('className', {
          name: 'labelClassName',
          label: 'Label CSS class name',
          visibleOn: 'this.label'
        })
        /*{
          children: (
            <Button
              size="sm"
              level="info"
              className="m-b"
              block
              onClick={this.exchangeRenderer.bind(this, context.id)}
            >
              Changing the renderer type
            </Button>
          )
        }*/
      ];
    }
  };

  // Automatically insert label
  beforeInsert(event: PluginEvent<InsertEventContext>) {
    const context = event.context;

    if (
      (context.info.plugin === this ||
        context.node.sameIdChild?.info.plugin === this) &&
      context.region === 'body'
    ) {
      context.data = {
        ...context.data,
        label: context.data.label ?? context.subRenderer?.name ?? 'Column name'
      };
    }
  }
}

registerEditorPlugin(CardPlugin);

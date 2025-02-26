import React from 'react';
import {registerEditorPlugin, translateSchema} from '@/packages/amis-editor-core/src';
import {getSchemaTpl} from '@/packages/amis-editor-core/src';
import {BasePlugin, RendererInfo, VRendererConfig} from '@/packages/amis-editor-core/src';
import {VRenderer} from '@/packages/amis-editor-core/src';
import {mapReactElement} from '@/packages/amis-editor-core/src';
import findIndex from 'lodash/findIndex';
import {RegionWrapper as Region} from '@/packages/amis-editor-core/src';
import {AnchorNavSection} from '@/packages/amis-ui/src';
import {registerFilter} from 'amis-formula';
import {generateId} from '../util';
registerFilter('appTranslate', (input: any) => translateSchema(input));

export class AnchorNavPlugin extends BasePlugin {
  static id = 'AnchorNavPlugin';
  // Associated renderer name
  rendererName = 'anchor-nav';
  $schema = '/schemas/AnchorNavSchema.json';

  // Component name
  name = 'Anchor Navigation';
  isBaseComponent = true;
  description =
    'Anchor navigation, when displaying multiple lines of content, you can display the content in the form of anchor navigation groups. Click the navigation menu to locate the corresponding content area. ';
  docLink = '/amis/zh-CN/components/anchor-nav';
  tags = ['function'];
  icon = 'fa fa-link';
  pluginIcon = 'anchor-nav-plugin';
  scaffold = {
    type: 'anchor-nav',
    links: [
      {
        title: 'Anchor point 1',
        href: '1',
        body: [
          {
            type: 'tpl',
            tpl: 'Here is the anchor content 1',
            wrapperComponent: '',
            inline: false,
            id: generateId()
          }
        ]
      },
      {
        title: 'Anchor 2',
        href: '2',
        body: [
          {
            type: 'tpl',
            tpl: 'Here is the anchor content 2',
            wrapperComponent: '',
            inline: false,
            id: generateId()
          }
        ]
      },
      {
        title: 'Anchor point 3',
        href: '3',
        body: [
          {
            type: 'tpl',
            tpl: 'Here is the anchor content 3',
            wrapperComponent: '',
            inline: false,
            id: generateId()
          }
        ]
      }
    ]
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = 'Anchor Navigation';
  panelJustify = true;

  panelBody = [
    getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            id: 'properties-basic',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              getSchemaTpl('combo-container', {
                type: 'combo',
                name: 'links',
                label: 'Anchor point settings',
                mode: 'normal',
                multiple: true,
                draggable: true,
                minLength: 1,
                addButtonText: 'Add anchor',
                deleteBtn: {
                  icon: 'fa fa-trash'
                },
                items: [getSchemaTpl('anchorTitle')],
                scaffold: {
                  title: 'Anchor',
                  href: '',
                  body: [
                    {
                      type: 'tpl',
                      tpl: 'Here is the anchor content',
                      wrapperComponent: '',
                      inline: false
                    }
                  ]
                },
                draggableTip: '',
                onChange: (
                  value: Array<any>,
                  oldValue: Array<any>,
                  model: any,
                  form: any
                ) => {
                  const {active} = form.data;
                  const isInclude =
                    value.findIndex((link: any) => link.href === active) > -1;
                  form.setValues({
                    active: isInclude ? active : value[0].href
                  });
                },
                pipeOut: (value: any[]) => {
                  const hrefs = value.map(item => item.href);
                  const findMinCanUsedKey = (
                    keys: string[],
                    max: number
                  ): void | string => {
                    for (let i = 1; i <= max; i++) {
                      if (!keys.includes(String(i))) {
                        return String(i);
                      }
                    }
                  };
                  value.forEach((item: any) => {
                    if (!item.href) {
                      const key = findMinCanUsedKey(hrefs, value.length);
                      item.href = key;
                      item.title = `Anchor ${key}`;
                      item.body[0].tpl = `Here is the anchor content ${key}`;
                    }
                  });
                  return value;
                }
              }),
              {
                name: 'active',
                type: 'select',
                label: 'Default positioning area',
                source: '${links|appTranslate}',
                labelField: 'title',
                valueField: 'href',
                value: '1'
              }
            ]
          },
          getSchemaTpl('status')
        ])
      },
      {
        title: 'Appearance',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            id: 'appearance-basic',
            body: [
              {
                type: 'button-group-select',
                name: 'direction',
                label: 'Navigation layout',
                value: 'vertical',
                options: [
                  {
                    label: 'horizontal',
                    value: 'horizontal'
                  },
                  {
                    label: 'vertical',
                    value: 'vertical'
                  }
                ]
              }
            ]
          },
          getSchemaTpl('style:classNames', {
            isFormItem: false,
            schema: [
              getSchemaTpl('className', {
                name: 'linkClassName',
                label: 'Navigation'
              }),
              getSchemaTpl('className', {
                name: 'sectionClassName',
                label: 'Regional content'
              })
            ]
          })
        ])
      }
    ])
  ];

  patchContainers = ['anchor-nav.body'];

  vRendererConfig: VRendererConfig = {
    regions: {
      body: {
        key: 'body',
        label: 'Content area',
        renderMethod: 'renderBody',
        renderMethodOverride: (regions, insertRegion) =>
          function (this: any, ...args: any[]) {
            const info: RendererInfo = this.props.$$editor;
            const dom = this.super(...args);

            if (info && !this.props.children) {
              return insertRegion(
                this,
                dom,
                regions,
                info,
                info.plugin.manager
              );
            }

            return dom;
          }
      }
    },
    panelTitle: 'Content Area',
    panelJustify: true,
    panelBody: [
      getSchemaTpl('tabs', [
        {
          title: 'Attributes',
          body: [
            getSchemaTpl('collapseGroup', [
              {
                title: 'Basic',
                body: [getSchemaTpl('anchorNavTitle')]
              }
            ])
          ]
        },
        {
          title: 'Appearance',
          body: [
            getSchemaTpl('collapseGroup', [
              {
                title: 'CSS class name',
                body: [getSchemaTpl('className')]
              }
            ])
          ]
        }
      ])
    ]
  };

  wrapperProps = {
    unmountOnExit: true,
    mountOnEnter: true
  };

  sectionWrapperResolve = (dom: HTMLElement) => dom.parentElement!;
  overrides = {
    render(this: any) {
      const dom = this.super();

      if (!this.renderSection && this.props.$$editor && dom) {
        const links = this.props.links;
        return mapReactElement(dom, item => {
          if (item.type === AnchorNavSection && item.props.$$id) {
            const id = item.props.$$id;
            const index = findIndex(links, (link: any) => link.$$id === id);
            const info: RendererInfo = this.props.$$editor;
            const plugin: AnchorNavPlugin = info.plugin as any;

            if (~index) {
              const region = plugin.vRendererConfig?.regions?.body;

              if (!region) {
                return item;
              }

              return React.cloneElement(item, {
                children: (
                  <VRenderer
                    key={id}
                    type={info.type}
                    plugin={info.plugin}
                    renderer={info.renderer}
                    $schema="/schemas/SectionSchema.json"
                    hostId={info.id}
                    memberIndex={index}
                    name={`${
                      item.props.title || `anchor content ${index + 1}`
                    }`}
                    id={id}
                    draggable={false}
                    removable={false}
                    wrapperResolve={plugin.sectionWrapperResolve}
                    schemaPath={`${info.schemaPath}/anchor-nav/${index}`}
                    path={`${this.props.$path}/${index}`} // seems useless
                    data={this.props.data} // seems useless
                  >
                    <Region
                      key={region.key}
                      preferTag={region.preferTag}
                      name={region.key}
                      label={region.label}
                      regionConfig={region}
                      placeholder={region.placeholder}
                      editorStore={plugin.manager.store}
                      manager={plugin.manager}
                      children={item.props.children}
                      wrapperResolve={region.wrapperResolve}
                      rendererName={info.renderer.name}
                    />
                  </VRenderer>
                )
              });
            }
          }

          return item;
        });
      }

      return dom;
    }
  };
}

registerEditorPlugin(AnchorNavPlugin);

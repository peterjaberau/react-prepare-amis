import {Button, isObject} from 'amis';
import React from 'react';
import {
  EditorNodeType,
  getI18nEnabled,
  registerEditorPlugin
} from '@/packages/amis-editor-core/src';
import {
  BaseEventContext,
  BasePlugin,
  BasicRendererInfo,
  BasicToolbarItem,
  ContextMenuEventContext,
  ContextMenuItem,
  PluginInterface,
  RendererInfoResolveEventContext
} from '@/packages/amis-editor-core/src';
import {defaultValue, getSchemaTpl} from '@/packages/amis-editor-core/src';
import {diff, JSONPipeOut, repeatArray} from '@/packages/amis-editor-core/src';
import set from 'lodash/set';
import {
  schemaArrayFormat,
  resolveArrayDatasource,
  schemaToArray,
  generateId
} from '../util';

export class ListPlugin extends BasePlugin {
  static id = 'ListPlugin';
  // Associated renderer name
  rendererName = 'list';
  $schema = '/schemas/ListSchema.json';

  // Component name
  name = 'list';
  isBaseComponent = true;
  isListComponent = true;
  disabledRendererPlugin = true;
  memberImmutable = true;
  description =
    'Show a list, you can customize the title, subtitle, content and button group. The current component needs to configure the data source and does not have its own data pull. Please use the "CRUD" component first. ';
  docLink = '/amis/zh-CN/components/list';
  tags = ['show'];
  icon = 'fa fa-list';
  pluginIcon = 'list-plugin';
  scaffold = {
    type: 'list',
    listItem: {
      body: [
        {
          type: 'tpl',
          tpl: 'Simple display of data: $a $b',
          wrapperComponent: '',
          id: generateId()
        }
      ],
      actions: [
        {
          icon: 'fa fa-eye',
          type: 'button'
        }
      ]
    }
  };
  previewSchema = {
    ...this.scaffold,
    items: [
      {a: 1, b: 2},
      {a: 3, b: 4},
      {a: 5, b: 6}
    ]
  };

  panelTitle = 'List';
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    const isCRUDBody = ['crud', 'crud2'].includes(context.schema.type);
    const i18nEnabled = getI18nEnabled();
    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: [
              // {
              //   children: (
              //     <Button
              //       level="primary"
              //       size="sm"
              //       block
              //       onClick={this.editDetail.bind(this, context.id)}
              //     >
              //Configure member details
              //     </Button>
              //   )
              // },
              // {
              //   type: 'divider'
              // },
              {
                name: 'title',
                type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                label: 'Title'
              },
              isCRUDBody
                ? null
                : getSchemaTpl('formItemName', {
                    label: 'Bound field name'
                  }),
              {
                name: 'placeholder',
                pipeIn: defaultValue('no data'),
                type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                label: 'No data prompt'
              },
              {
                type: 'ae-switch-more',
                mode: 'normal',
                formType: 'extend',
                label: 'head',
                name: 'showHeader',
                falseValue: false, // The default value when the component is rendered is true, so it is set to false instead of deleting the attribute when closed
                form: {
                  body: [
                    {
                      children: (
                        <Button
                          level="primary"
                          size="sm"
                          block
                          onClick={this.editHeaderDetail.bind(this, context.id)}
                        >
                          Configuring the Header
                        </Button>
                      )
                    }
                  ]
                }
              },
              {
                type: 'ae-switch-more',
                mode: 'normal',
                formType: 'extend',
                label: 'Bottom',
                name: 'showFooter',
                falseValue: false, // The default value when the component is rendered is true, so it is set to false instead of deleting the attribute when closed
                form: {
                  body: [
                    {
                      children: (
                        <Button
                          level="primary"
                          size="sm"
                          block
                          onClick={this.editFooterDetail.bind(this, context.id)}
                        >
                          Configuration bottom
                        </Button>
                      )
                    }
                  ]
                }
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
            title: 'CSS class name',
            body: [
              getSchemaTpl('className', {
                label: 'Outer layer'
              }),
              getSchemaTpl('className', {
                name: 'itemClassName',
                label: 'ListItem'
              }),
              getSchemaTpl('className', {
                name: 'headerClassName',
                label: 'Head'
              }),
              getSchemaTpl('className', {
                name: 'footerClassName',
                label: 'Bottom'
              })
            ]
          }
        ])
      }
    ]);
  };

  filterProps(props: any, node: EditorNodeType) {
    if (!node.state.value) {
      if (props.isSlot) {
        node.updateState({
          value: [props.data]
        });
        return;
      }

      const data = {
        ...props.defaultData,
        ...props.data
      };
      const arr = resolveArrayDatasource({
        value: props.value,
        data,
        source: props.source
      });

      if (!Array.isArray(arr) || !arr.length) {
        const mockedData: any = this.buildMockData();
        node.updateState({
          value: repeatArray(mockedData, 1).map((item, index) => ({
            ...item,
            id: index + 1
          }))
        });
      }
    }

    const {$schema, ...rest} = props;

    return {
      // ...JSONPipeOut(rest),
      ...rest,
      $schema
    };
  }

  buildMockData() {
    return {
      id: 666,
      title: 'Fake data',
      description: 'Fake data',
      a: 'false data',
      b: 'False data'
    };
  }

  editHeaderDetail(id: string) {
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id);
    const value = store.getValueOf(id);

    const defaultHeader = {
      type: 'tpl',
      tpl: 'head',
      wrapperComponent: ''
    };

    node &&
      value &&
      this.manager.openSubEditor({
        title: 'Configure Header',
        value: schemaToArray(value.header ?? defaultHeader),
        slot: {
          type: 'container',
          body: '$$'
        },
        onChange: newValue => {
          newValue = {...value, header: schemaArrayFormat(newValue)};
          manager.panelChangeValue(newValue, diff(value, newValue));
        }
      });
  }

  editFooterDetail(id: string) {
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id);
    const value = store.getValueOf(id);

    const defaultFooter = {
      type: 'tpl',
      tpl: 'Bottom',
      wrapperComponent: ''
    };

    node &&
      value &&
      this.manager.openSubEditor({
        title: 'Configure bottom',
        value: schemaToArray(value.footer ?? defaultFooter),
        slot: {
          type: 'container',
          body: '$$'
        },
        onChange: newValue => {
          newValue = {...value, footer: schemaArrayFormat(newValue)};
          manager.panelChangeValue(newValue, diff(value, newValue));
        }
      });
  }

  editDetail(id: string) {
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id);
    const value = store.getValueOf(id);

    node &&
      value &&
      this.manager.openSubEditor({
        title: 'Configure member renderer',
        value: {
          ...value.listItem
        },
        slot: {
          type: 'list',
          listItem: '$$'
        },
        onChange: newValue => {
          newValue = {...value, listItem: newValue};
          manager.panelChangeValue(newValue, diff(value, newValue));
        },
        data: {
          // TODO The default data is incorrect
          items: [this.buildMockData()]
        }
      });
  }

  buildEditorToolbar(
    {id, info, schema}: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) {
    if (
      info.renderer.name === 'list' ||
      (info.renderer.name === 'crud' && schema.mode === 'list')
    ) {
      toolbars.push({
        icon: 'fa fa-expand',
        order: 100,
        tooltip: 'Configure member renderer',
        onClick: this.editDetail.bind(this, id)
      });
    }
  }

  buildDataSchemas(node: EditorNodeType, region?: EditorNodeType) {
    let dataSchema: any = {
      $id: 'each',
      type: 'object',
      title: 'Current loop item',
      properties: {}
    };

    let match =
      node.schema.source && String(node.schema.source).match(/{([\w-_]+)}/);
    let field = node.schema.name || match?.[1];
    const scope = this.manager.dataSchema.getScope(`${node.id}-${node.type}`);

    if (scope) {
      const origin = this.manager.dataSchema.current;
      this.manager.dataSchema.switchTo(scope.parent!);
      const schema = this.manager.dataSchema.getSchemaByPath(field);
      this.manager.dataSchema.switchTo(origin);
      if (isObject(schema?.items)) {
        dataSchema = {
          ...dataSchema,
          ...(schema!.items as any)
        };

        // Add serial numbers to the list for easy processing
        set(dataSchema, 'properties.index', {
          type: 'number',
          title: 'Index'
        });
      }
    }

    return dataSchema;
  }

  buildEditorContextMenu(
    {id, schema, region, info, selections}: ContextMenuEventContext,
    menus: Array<ContextMenuItem>
  ) {
    if (selections.length || info?.plugin !== this) {
      return;
    }
    if (
      info.renderer.name === 'list' ||
      (info.renderer.name === 'crud' && schema.mode === 'list')
    ) {
      menus.push('|', {
        label: 'Configure member renderer',
        onSelect: this.editDetail.bind(this, id)
      });
    }
  }

  // In order to be able to automatically inject data.
  getRendererInfo(
    context: RendererInfoResolveEventContext
  ): BasicRendererInfo | void {
    const plugin: PluginInterface = this;
    const {renderer, schema} = context;
    if (
      !schema.$$id &&
      ['crud', 'crud2'].includes(schema.$$editor?.renderer.name) &&
      renderer.name === 'list'
    ) {
      return {
        ...({id: schema.$$editor.id} as any),
        name: plugin.name!,
        regions: plugin.regions,
        patchContainers: plugin.patchContainers,
        vRendererConfig: plugin.vRendererConfig,
        wrapperProps: plugin.wrapperProps,
        wrapperResolve: plugin.wrapperResolve,
        filterProps: plugin.filterProps,
        $schema: plugin.$schema,
        renderRenderer: plugin.renderRenderer,
        memberImmutable: plugin.memberImmutable
      };
    }

    return super.getRendererInfo(context);
  }
}

registerEditorPlugin(ListPlugin);

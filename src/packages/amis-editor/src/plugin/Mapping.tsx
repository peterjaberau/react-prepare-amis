import {
  registerEditorPlugin,
  BaseEventContext,
  BasePlugin,
  defaultValue,
  getSchemaTpl,
  diff,
  JSONPipeOut,
  BasicToolbarItem,
  ContextMenuEventContext,
  ContextMenuItem
} from '@/packages/amis-editor-core/src';
import {schemaArrayFormat, schemaToArray} from '../util';

export class MappingPlugin extends BasePlugin {
  static id = 'MappingPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'mapping';
  $schema = '/schemas/MappingSchema.json';

  // Component name
  name = 'Mapping';
  isBaseComponent = true;
  description =
    'Map and display the existing values. For example, if the original values ​​are: 1, 2, 3..., they need to be displayed as: offline, online, expired, etc. ';
  docLink = '/amis/zh-CN/components/mapping';
  tags = ['show'];
  icon = 'fa fa-exchange';
  pluginIcon = 'mapping-plugin';
  scaffold = {
    type: 'mapping',
    value: 1,
    map: {
      1: 'Happy',
      2: 'Angry',
      3: 'Sad',
      4: 'Indifference',
      '*': 'generally'
    },
    itemSchema: {
      type: 'tag',
      label: '${item}'
    }
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = 'Mapping';
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    const isUnderField = /\/field\/\w+$/.test(context.path as string);
    return [
      getSchemaTpl('tabs', [
        {
          title: 'Attributes',
          body: getSchemaTpl('collapseGroup', [
            {
              title: 'Basic',
              id: 'properties-basic',
              body: [
                isUnderField
                  ? {
                      type: 'tpl',
                      inline: false,
                      className: 'text-info text-sm',
                      tpl: '<p>Currently the field content node is configured, select the upper layer for more configuration</p>'
                    }
                  : null,
                getSchemaTpl('mapSourceControl'),
                {
                  type: 'ae-switch-more',
                  mode: 'normal',
                  label: 'Custom display template',
                  bulk: false,
                  name: 'itemSchema',
                  formType: 'extend',
                  defaultData: this.scaffold.itemSchema,
                  form: {
                    body: [
                      {
                        type: 'button',
                        level: 'primary',
                        size: 'sm',
                        block: true,
                        onClick: this.editDetail.bind(this, context.id),
                        label: 'Configure display template'
                      }
                    ]
                  },
                  pipeIn: (value: any) => {
                    return value !== undefined;
                  },
                  pipeOut: (value: any, originValue: any, data: any) => {
                    if (value === true) {
                      return {
                        type: 'tag',
                        label: `\${${this.getDisplayField(
                          data
                        )} | default: "-"}`
                      };
                    }
                    return value ? value : undefined;
                  }
                },
                getSchemaTpl('valueFormula', {
                  pipeOut: (value: any) => {
                    return value == null || value === '' ? undefined : value;
                  }
                }),
                getSchemaTpl('placeholder', {
                  pipeIn: defaultValue('-'),
                  label: 'Placeholder'
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
              title: 'CSS class name',
              body: [
                getSchemaTpl('className', {
                  label: 'Outer layer'
                })
              ]
            }
          ])
        }
      ])
    ];
  };

  getDisplayField(data: any) {
    if (
      data.source ||
      (data.map &&
        Array.isArray(data.map) &&
        data.map[0] &&
        Object.keys(data.map[0]).length > 1)
    ) {
      return data.labelField ?? 'label';
    }
    return 'item';
  }

  buildEditorToolbar(
    {id, info, schema}: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) {
    if (info.renderer.name === 'mapping') {
      toolbars.push({
        icon: 'fa fa-expand',
        order: 100,
        tooltip: 'Configure display template',
        onClick: this.editDetail.bind(this, id)
      });
    }
  }

  buildEditorContextMenu(
    {id, schema, region, info, selections}: ContextMenuEventContext,
    menus: Array<ContextMenuItem>
  ) {
    if (selections.length || info?.plugin !== this) {
      return;
    }
    if (info.renderer.name === 'mapping') {
      menus.push('|', {
        label: 'Configure display template',
        onSelect: this.editDetail.bind(this, id)
      });
    }
  }

  editDetail(id: string) {
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id);
    const value = store.getValueOf(id);
    const defaultItemSchema = {
      type: 'tag',
      label: `\${${this.getDisplayField(value)}}`
    };

    node &&
      value &&
      this.manager.openSubEditor({
        title: 'Configure display template',
        value: schemaToArray(value.itemSchema ?? defaultItemSchema),
        slot: {
          type: 'container',
          body: '$$'
        },
        onChange: (newValue: any) => {
          newValue = {...value, itemSchema: schemaArrayFormat(newValue)};
          manager.panelChangeValue(newValue, diff(value, newValue));
        },
        data: {
          [value.labelField || 'label']: 'False data',
          [value.valueField || 'value']: 'false data',
          item: 'false data'
        }
      });
  }
}

registerEditorPlugin(MappingPlugin);

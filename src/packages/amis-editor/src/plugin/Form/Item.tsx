import {
  registerEditorPlugin,
  RendererInfoResolveEventContext
} from '@/packages/amis-editor-core/src';
import {
  BasePlugin,
  BaseEventContext,
  BasicPanelItem,
  PluginEvent,
  DragEventContext,
  ChangeEventContext,
  ReplaceEventContext,
  BuildPanelEventContext,
  ContextMenuEventContext,
  ContextMenuItem,
  PluginInterface
} from '@/packages/amis-editor-core/src';
import {defaultValue, getSchemaTpl} from '@/packages/amis-editor-core/src';
import find from 'lodash/find';
import {JSONDelete, JSONPipeIn, JSONUpdate} from '@/packages/amis-editor-core/src';
import {NO_SUPPORT_STATIC_FORMITEM_CMPTS} from '../../renderer/event-control/constants';
import {
  isExpression,
  resolveVariableAndFilter,
  getRendererByName
} from '@/packages/amis-core/src';

export class ItemPlugin extends BasePlugin {
  static id = 'ItemPlugin';
  // panelTitle = 'Form item wildcard';
  panelTitle = 'Form Items';
  order = -990;
  pluginIcon = 'form-plugin';

  afterResolveEditorInfo(event: PluginEvent<RendererInfoResolveEventContext>) {
    if (event.data && event.context.renderer.isFormItem) {
      // Add quick inline editing function to form item label and description
      let inlineEditableElements =
        event.data.inlineEditableElements?.concat() || [];

      inlineEditableElements.push(
        {
          match: '.cxd-Form-label',
          key: 'label'
        },
        {
          match: '.cxd-Form-description',
          key: 'description'
        }
      );

      event.setData({
        ...event.data,
        inlineEditableElements
      });
    }
  }

  buildEditorPanel(
    context: BuildPanelEventContext,
    panels: Array<BasicPanelItem>
  ) {
    const thisPlugin: PluginInterface = this;
    const renderer = context.info.renderer;
    const store = this.manager.store;

    if (context.selections.length) {
      return;
    }
    const plugin = context.info.plugin;
    // If it is a form item
    if (
      !context.info.hostId &&
      renderer?.isFormItem &&
      !plugin?.notRenderFormZone
    ) {
      panels.push({
        key: 'form-item',
        icon: 'fa fa-desktop',
        pluginIcon: thisPlugin.pluginIcon,
        title: this.panelTitle,
        render: this.manager.makeSchemaFormRender({
          body: this.panelBodyCreator(context),
          panelById: store.activeId,
          formKey: 'form-item'
        }),
        order: -200
      });
    }
  }
  panelBodyCreator = (context: BaseEventContext) => {
    const type = context.schema.type || '';
    const render = getRendererByName(type);
    // Support static form item conditions: It is a form item component, and must not be in a component that does not support static list
    const supportStatic =
      !!render?.isFormItem && !NO_SUPPORT_STATIC_FORMITEM_CMPTS.includes(type);
    const ignoreName = ~['button', 'submit', 'reset'].indexOf(type);
    const notRequiredName = ~[
      'button-toobar',
      'container',
      'fieldSet',
      'group',
      'grid',
      'hbox',
      'input-group',
      'panel',
      'service',
      'tabs',
      'table',
      'elevator',
      'static'
    ].indexOf(type);
    const hasReadOnly = ~[
      'switch',
      'wizard',
      'diff-editor',
      'editor',
      'input-rating',
      'input-text',
      'textarea'
    ].indexOf(type);
    /** Components that do not support configuration validation properties*/
    const ignoreValidator = !!~['input-group'].indexOf(type);
    const renderer: any = context.info.renderer;
    return [
      getSchemaTpl('tabs', [
        {
          title: 'General',
          body: [
            getSchemaTpl('layout:originPosition', {value: 'left-top'}),
            ignoreName
              ? null
              : getSchemaTpl('formItemName', {
                  required: notRequiredName ? false : true
                }),
            renderer.renderLabel !== false ? getSchemaTpl('label') : null,
            hasReadOnly
              ? getSchemaTpl('switch', {
                  name: 'readOnly',
                  label: 'Read-only mode'
                })
              : null,
            getSchemaTpl('disabled'),
            ignoreValidator ? null : getSchemaTpl('required'),
            getSchemaTpl('description'),
            getSchemaTpl('placeholder'),
            getSchemaTpl('remark', {
              mode: 'row'
            }),
            renderer.renderLabel !== false
              ? getSchemaTpl('labelRemark', {
                  mode: 'row'
                })
              : null
          ]
        },

        {
          title: 'Appearance',
          body: [
            getSchemaTpl('formItemMode'),
            getSchemaTpl('horizontalMode'),
            getSchemaTpl('horizontal', {
              label: '',
              visibleOn:
                'this.mode == "horizontal" && this.label !== false && this.horizontal'
            }),

            renderer.sizeMutable !== false
              ? getSchemaTpl('formItemSize', {
                  options: [
                    {
                      label: 'small',
                      value: 'sm'
                    },

                    {
                      label: 'Medium',
                      value: 'md'
                    },

                    {
                      label: 'big',
                      value: 'lg'
                    },
                    {
                      label: 'Default (full)',
                      value: 'full'
                    }
                  ]
                })
              : null,
            getSchemaTpl('formItemInline'),

            getSchemaTpl('className'),
            getSchemaTpl('className', {
              label: 'Label CSS class name',
              name: 'labelClassName'
            }),
            getSchemaTpl('className', {
              label: 'Control CSS class name',
              name: 'inputClassName'
            }),
            getSchemaTpl('className', {
              label: 'Description CSS class name',
              name: 'descriptionClassName',
              visibleOn: 'this.description'
            }),
            ...(!supportStatic
              ? []
              : [
                  getSchemaTpl('className', {
                    label: 'Static CSS class name',
                    name: 'staticClassName'
                  })
                ])
          ]
        },

        {
          title: 'Visible and Invisible',
          body: [
            getSchemaTpl('visible'),
            supportStatic ? getSchemaTpl('static') : null,
            getSchemaTpl('switch', {
              name: 'clearValueOnHidden',
              label: 'Delete form item value when hidden'
            })
          ]
        },
        ignoreValidator
          ? null
          : {
              title: 'Verification',
              body: [
                // getSchemaTplByName('ref'),
                getSchemaTpl('validations'),
                getSchemaTpl('validationErrors'),
                getSchemaTpl('validateOnChange'),
                getSchemaTpl('submitOnChange'),
                getSchemaTpl('apiControl', {
                  name: 'validateApi',
                  label: 'Verification interface',
                  description:
                    'An interface for checking this form item separately'
                })
              ]
            }
      ])
    ];
  };

  afterUpdate(event: PluginEvent<ChangeEventContext>) {
    const context = event.context;

    if (
      context.info.renderer.isFormItem &&
      context.diff?.some(change => change.path?.join('.') === 'value')
    ) {
      let value = context.value.value;
      const component = context.node?.getComponent();

      if (typeof value === 'string' && isExpression(value)) {
        const data = component?.props.data || {};
        value = resolveVariableAndFilter(value, data, '| raw');
      }
      component?.props.onChange(value);
    }
  }

  beforeReplace(event: PluginEvent<ReplaceEventContext>) {
    const context = event.context;

    if (
      context.info.renderer.isFormItem &&
      context.data &&
      context.subRenderer &&
      !~context.subRenderer.tags!.indexOf('form item') &&
      ~context.subRenderer.tags!.indexOf('Exhibit')
    ) {
      context.data = {
        ...context.data,
        type: `static-${context.data.type}`,
        label: context.data.label || context.schema.label,
        name: context.data.name || context.schema.name
      };
    }

    //Retain name when replacing fields
    if (context.schema) {
      context.data.name = context.schema.name || context.data.name;
    }
  }

  buildEditorContextMenu(
    {id, schema, region, selections}: ContextMenuEventContext,
    menus: Array<ContextMenuItem>
  ) {
    if (this.manager.store.toolbarMode === 'mini') {
      return;
    }
    if (!selections.length || selections.length > 3) {
      // Return directly when single selection or more than 3 selections are made
      return;
    }

    const arr = selections.concat();
    const first = arr.shift()!;
    const parent = first.node.parent;

    // If it is not in a parent node or there is a non-form item, skip it directly
    if (
      arr.some(
        elem => elem.node.parent !== parent || !elem.info.renderer?.isFormItem
      )
    ) {
      // Note: isFormItem is generated when amis registers the renderer, and isFormItem is true for all form class renderers
      return;
    }

    menus.unshift(
      {
        label: 'Synthesize a row',
        icon: 'merge-icon',
        onSelect: () => {
          const store = this.manager.store;
          const arr = selections.concat();
          const first = arr.shift()!;
          let schema = store.schema;

          const group = [
            {
              ...first.schema
            }
          ];

          // Let the following JSONPipeIn change an id
          // Because when updating, the group id will not change
          // Two ids cannot be the same, otherwise the selection will be messed up.
          delete group[0].$$id;

          arr.forEach(elem => {
            group.push(elem.node.schema);
            schema = JSONDelete(schema, elem.id);
          });

          const curNewGroup = JSONPipeIn({
            type: 'group',
            body: group
          });
          schema = JSONUpdate(schema, first.id, curNewGroup, true);
          store.traceableSetSchema(schema);
          setTimeout(() => {
            // Automatically select the parent element after merging into one line
            store.setActiveId(first.id);
          }, 40);
        }
      },
      '|'
    );
  }

  // beforeInsert(event: PluginEvent<InsertEventContext>) {
  //   const context = event.context;
  //   if (
  //     context.region === 'controls' &&
  //     Array.isArray(context.subRenderer?.tags) &&
  // !~context.subRenderer!.tags!.indexOf('form item') &&
  // ~context.subRenderer!.tags!.indexOf('Exhibit')
  //   ) {
  //     context.data = {
  //       ...context.data,
  //       type: `static-${context.data.type}`,
  //       label: context.data.label || context.subRenderer!.name,
  //       name: context.data.name || 'var1'
  //     };
  //   }
  // }
}

registerEditorPlugin(ItemPlugin);

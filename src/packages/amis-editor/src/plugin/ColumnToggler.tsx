import update from 'lodash/update';
import {
  BaseEventContext,
  BasePlugin,
  BasicRendererInfo,
  PluginInterface,
  RendererInfoResolveEventContext,
  getSchemaTpl,
  registerEditorPlugin
} from '@/packages/amis-editor-core/src';

export class ColumnToggler extends BasePlugin {
  static id = 'ColumnToggler';

  rendererName = 'column-toggler';

  name = 'Custom display columns';

  panelTitle = 'Custom display columns';

  icon = 'fa fa-square';

  tags = ['Custom display columns'];

  $schema = '/schemas/ColumnTogglerSchema.json';

  description =
    'A custom column button used to display the table. You can configure different display styles.';

  panelJustify = true;

  isBaseComponent = true;

  disabledRendererPlugin = true;

  crudInfo: {id: any; columns: any[]; schema: any};

  panelBodyCreator = (context: BaseEventContext) => {
    const crud = context?.node?.getClosestParentByType('crud2');

    if (crud) {
      this.crudInfo = {
        id: crud.id,
        columns: crud.schema.columns || [],
        schema: crud.schema
      };
    }

    const columns = (this.crudInfo?.schema?.columns ?? []).map(
      (item: any, index: number) => ({
        label: item.title,
        value: index
      })
    );

    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: [
              {
                label: 'button text',
                type: 'input-text',
                name: 'label'
              },
              {
                label: 'Button prompt',
                type: 'input-text',
                name: 'tooltip'
              },
              getSchemaTpl('switch', {
                name: 'defaultIsOpened',
                label: 'Whether to expand by default'
              }),
              getSchemaTpl('icon', {
                label: 'button icon'
              }),
              {
                type: 'button-group-select',
                label: 'Drop-down menu alignment',
                size: 'xs',
                name: 'align',
                value: 'right',
                options: [
                  {
                    label: 'left side',
                    value: 'left'
                  },
                  {
                    label: 'right side',
                    value: 'right'
                  }
                ]
              }
            ]
          },
          {
            title: 'Column default display',
            body: [
              {
                name: `__toggled`,
                value: '',
                type: 'checkboxes',
                // className: 'b-a p-sm',
                label: false,
                inline: false,
                joinValues: false,
                extractValue: true,
                options: columns,
                // style: {
                //   maxHeight: '200px',
                //   overflow: 'auto'
                // },
                pipeIn: (value: any, form: any) => {
                  const showColumnIndex: number[] = [];
                  this.crudInfo?.schema?.columns?.forEach(
                    (item: any, index: number) => {
                      if (item.toggled !== false) {
                        showColumnIndex.push(index);
                      }
                    }
                  );

                  return showColumnIndex;
                },
                onChange: (value: number[]) => {
                  if (!this.crudInfo) {
                    return;
                  }

                  let newColumns = this.crudInfo.schema.columns;

                  newColumns = newColumns.map((item: any, index: number) => ({
                    ...item,
                    toggled: value.includes(index) ? undefined : false
                  }));

                  const updatedSchema = update(
                    this.crudInfo.schema,
                    'columns',
                    (origin: any) => {
                      return newColumns;
                    }
                  );

                  this.manager.store.changeValueById(
                    this.crudInfo.id,
                    updatedSchema
                  );
                  this.crudInfo.schema = updatedSchema;
                }
              }
            ]
          }
        ])
      },
      {
        title: 'Appearance',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: [
              getSchemaTpl('size', {
                label: 'Button size'
              })
            ]
          },
          {
            title: 'CSS class name',
            body: [
              getSchemaTpl('className', {
                name: 'className',
                label: 'Display column style'
              }),

              getSchemaTpl('className', {
                name: 'btnClassName',
                label: 'Button style'
              })
            ]
          }
        ])
      }
    ]);
  };

  /**
   * If disabled, it cannot be edited
   */
  filterProps(props: any) {
    props.disabled = false;
    return props;
  }

  /**
   * If there is rendererName in the configuration, the renderer information is automatically returned.
   * @param renderer
   */
  getRendererInfo({
    renderer,
    schema
  }: RendererInfoResolveEventContext): BasicRendererInfo | void {
    const plugin: PluginInterface = this;

    if (
      schema.$$id &&
      plugin.name &&
      plugin.rendererName &&
      plugin.rendererName === renderer.name
    ) {
      // Copy some information out
      return {
        name: schema.label ? schema.label : plugin.name,
        regions: plugin.regions,
        patchContainers: plugin.patchContainers,
        // wrapper: plugin.wrapper,
        vRendererConfig: plugin.vRendererConfig,
        wrapperProps: plugin.wrapperProps,
        wrapperResolve: plugin.wrapperResolve,
        filterProps: plugin.filterProps,
        $schema: plugin.$schema,
        renderRenderer: plugin.renderRenderer
      };
    }
  }
}

registerEditorPlugin(ColumnToggler);

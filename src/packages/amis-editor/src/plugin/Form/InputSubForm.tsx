import {Button} from 'amis';
import type {SchemaCollection} from 'amis';
import React from 'react';
import {
  BaseEventContext,
  BasePlugin,
  BasicToolbarItem,
  ContextMenuEventContext,
  ContextMenuItem,
  getSchemaTpl,
  registerEditorPlugin,
  diff,
  JSONPipeOut,
  EditorNodeType,
  jsonToJsonSchema
} from 'amis-editor-core';
import {generateId} from '../../util';

export class SubFormControlPlugin extends BasePlugin {
  static id = 'SubFormControlPlugin';
  // Associated renderer name
  rendererName = 'input-sub-form';
  $schema = '/schemas/SubFormControlSchema.json';

  // Component name
  name = 'Subform item';
  isBaseComponent = true;
  icon = 'fa fa-window-restore';
  pluginIcon = 'sub-form-plugin';
  description = 'SubForm, configure a subform as the current form item';
  docLink = '/amis/zh-CN/components/form/input-sub-form';
  tags = ['form item'];
  scaffold = {
    type: 'input-sub-form',
    name: 'subform',
    label: 'Subform',
    form: {
      title: 'Title',
      body: [
        {
          type: 'input-text',
          label: 'text',
          id: generateId(),
          name: 'text'
        }
      ]
    }
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold
      }
    ]
  };

  panelTitle = 'Subform Item';
  panelBodyCreator = (context: BaseEventContext) => {
    return [
      getSchemaTpl('layout:originPosition', {value: 'left-top'}),
      {
        children: ({value, onChange}: any) => {
          return (
            <Button
              size="sm"
              level="primary"
              className="m-b"
              block
              onClick={this.editDetail.bind(this, context.id)}
            >
              Configuring member renderers
            </Button>
          );
        }
      },
      {
        name: 'labelField',
        type: 'input-text',
        value: 'label',
        label: 'Name field name',
        description:
          'When this field exists in the value, the button name will be displayed using the value of this field.'
      },
      getSchemaTpl('btnLabel', {
        label: 'button label name',
        value: 'settings'
      }),
      {
        name: 'minLength',
        visibleOn: 'this.multiple',
        label: 'Minimum number allowed',
        type: 'input-number'
      },

      {
        name: 'maxLength',
        visibleOn: 'this.multiple',
        label: 'Maximum number allowed',
        type: 'input-number'
      }
    ] as SchemaCollection;
  };

  filterProps(props: any, node: EditorNodeType) {
    props = JSONPipeOut(props);

    // Display at least one member, otherwise display nothing.
    // Display at least one member, otherwise display nothing.
    if (!node.state.value && !props.value) {
      node.updateState({
        value: ['']
      });
    }

    return props;
  }

  buildEditorToolbar(
    {id, info}: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) {
    if (info.renderer.name === 'input-sub-form') {
      toolbars.push({
        icon: 'fa fa-expand',
        order: 100,
        tooltip: 'Configure member renderer',
        onClick: this.editDetail.bind(this, id)
      });
    }
  }

  buildEditorContextMenu(
    {id, schema, region, info}: ContextMenuEventContext,
    menus: Array<ContextMenuItem>
  ) {
    if (info.renderer.name === 'input-sub-form') {
      menus.push('|', {
        label: 'Configure member renderer',
        onSelect: this.editDetail.bind(this, id)
      });
    }
  }

  editDetail(id: string) {
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id);
    const value = store.getValueOf(id);
    if (!node || !value) {
      return;
    }

    const {
      title,
      actions,
      name,
      size,
      closeOnEsc,
      showCloseButton,
      bodyClassName,
      type,
      ...rest
    } = value.form;
    const schema = {
      title,
      actions,
      name,
      size,
      closeOnEsc,
      showCloseButton,
      bodyClassName,
      type: 'dialog',
      body: {
        type: 'form',
        className: 'h-full pl-4 pr-4',
        ...rest
      }
    };

    this.manager.openSubEditor({
      title: 'Configure subform items',
      value: schema,
      memberImmutable: ['body'],
      onChange: newValue => {
        const {
          title,
          actions,
          name,
          size,
          closeOnEsc,
          showCloseButton,
          bodyClassName,
          body
        } = newValue;

        newValue = {
          ...value,
          form: {
            title,
            actions,
            name,
            size,
            closeOnEsc,
            showCloseButton,
            bodyClassName,
            ...body[0]
          }
        };
        // delete newValue.form.body;
        delete newValue.form.type;
        manager.panelChangeValue(newValue, diff(value, newValue));
      }
    });
  }

  async buildDataSchemas(
    node: EditorNodeType,
    region: EditorNodeType,
    trigger?: EditorNodeType
  ) {
    // The child can only be retrieved after rendering, so the subform cannot be obtained now, so only the basic type is provided here and not expanded
    let dataSchema: any = {
      type: 'object',
      title: node.schema?.label || node.schema?.name,
      originalValue: node.schema?.value // Record the original value, required for circular reference detection
    };

    if (node.schema?.multiple) {
      dataSchema = {
        type: 'array',
        title: node.schema?.label || node.schema?.name,
        originalValue: dataSchema.originalValue
      };
    }

    return dataSchema;
  }
}

registerEditorPlugin(SubFormControlPlugin);

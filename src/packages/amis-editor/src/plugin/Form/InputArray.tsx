import {Button} from '@/packages/src';
import {EditorNodeType, registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {
  BaseEventContext,
  BasePlugin,
  BasicSubRenderInfo,
  BasicToolbarItem,
  ContextMenuEventContext,
  ContextMenuItem,
  RendererEventContext,
  SubRendererInfo
} from '@/packages/amis-editor-core/src';
import {defaultValue, getSchemaTpl, valuePipeOut} from '@/packages/amis-editor-core/src';
import React from 'react';
import {diff, JSONPipeOut} from '@/packages/amis-editor-core/src';
import {generateId} from '../../util';

export class ArrayControlPlugin extends BasePlugin {
  static id = 'ArrayControlPlugin';
  // Associated renderer name
  rendererName = 'input-array';
  $schema = '/schemas/ArrayControlSchema.json';
  disabledRendererPlugin = true;

  // Component name
  name = 'Array input box';
  isBaseComponent = true;
  icon = 'fa fa-bars';
  pluginIcon = 'input-array-plugin';
  description =
    'Array array input box, you can customize the member input form. In fact, it is a way to flatten the value of Combo, and you can directly use combo instead. ';
  docLink = '/amis/zh-CN/components/form/input-array';
  tags = ['form item'];
  scaffold = {
    type: 'input-array',
    label: 'array input box',
    name: 'array',
    items: {
      type: 'input-text',
      id: generateId(),
      placeholder: 'Please enter'
    }
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    wrapWithPanel: false,
    mode: 'horizontal',
    body: [
      {
        ...this.scaffold,
        value: ['row1', ''],
        draggable: true
      }
    ]
  };

  panelTitle = 'Array Box';
  panelBodyCreator = (context: BaseEventContext) => {
    return [
      getSchemaTpl('layout:originPosition', {value: 'left-top'}),
      getSchemaTpl('switchDefaultValue'),
      {
        type: 'textarea',
        name: 'value',
        label: 'Default value',
        visibleOn: 'typeof this.value !== "undefined"',
        pipeOut: valuePipeOut
      },
      {
        children: (
          <Button
            size="sm"
            level="danger"
            className="m-b"
            block
            onClick={this.editDetail.bind(this, context.id)}
          >
            Configuring Subform Items
          </Button>
        )
      },

      getSchemaTpl('switch', {
        label: 'Can I add new ones',
        name: 'addable',
        pipeIn: defaultValue(true)
      }),

      {
        label: 'Add button text',
        name: 'addButtonText',
        type: 'input-text',
        visibleOn: 'this.addable',
        pipeIn: defaultValue('new')
      },

      {
        type: 'textarea',
        name: 'scaffold',
        label: 'Add initial value',
        visibleOn: 'this.addable !== false',
        pipeOut: valuePipeOut,
        pipeIn: defaultValue('')
      },

      getSchemaTpl('switch', {
        label: 'Can it be deleted',
        name: 'removable',
        pipeIn: defaultValue(true)
      }),

      getSchemaTpl('apiControl', {
        name: 'deleteApi',
        label: 'Request before deletion',
        visibleOn: 'this.removable'
      }),

      {
        label: 'Delete confirmation prompt',
        name: 'deleteConfirmText',
        type: 'input-text',
        visibleOn: 'this.deleteApi',
        pipeIn: defaultValue('Confirm to delete')
      },

      getSchemaTpl('switch', {
        name: 'draggable',
        label: 'Enable drag sorting'
      }),

      {
        name: 'draggableTip',
        visibleOn: 'this.draggable',
        type: 'input-text',
        label: 'Draggable sorting prompt text',
        pipeIn: defaultValue(
          'You can adjust the order by dragging the [Swap] button in each row'
        )
      },

      {
        name: 'addButtonText',
        type: 'input-text',
        label: 'Add button text',
        pipeIn: defaultValue('new')
      },

      getSchemaTpl('minLength'),
      getSchemaTpl('maxLength')
    ];
  };

  filterProps(props: any, node: EditorNodeType) {
    props = JSONPipeOut(props);

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
    if (info.renderer.name === 'input-array') {
      toolbars.push({
        icon: 'fa fa-expand',
        order: 100,
        tooltip: 'Configure subform items',
        onClick: this.editDetail.bind(this, id)
      });
    }
  }

  buildEditorContextMenu(
    {id, schema, region, info}: ContextMenuEventContext,
    menus: Array<ContextMenuItem>
  ) {
    if (info.renderer.name === 'input-array') {
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

    node &&
      value &&
      this.manager.openSubEditor({
        title: 'Configure subform items',
        value: value.items,
        slot: {
          type: 'form',
          mode: 'normal',
          body: '$$',
          wrapWithPanel: false,
          className: 'wrapper'
        },
        onChange: newValue => {
          newValue = {
            ...value,
            items: newValue
          };
          manager.panelChangeValue(newValue, diff(value, newValue));
        }
      });
  }
}

registerEditorPlugin(ArrayControlPlugin);

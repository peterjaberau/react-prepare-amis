/**
 * @file input-kv component element
 */
import {
  RendererPluginAction,
  RendererPluginEvent,
  defaultValue,
  getSchemaTpl,
  registerEditorPlugin,
  BasePlugin
} from '@/packages/amis-editor-core/src';
import {getActionCommonProps} from '../../renderer/event-control/helper';
export class KVControlPlugin extends BasePlugin {
  static id = 'KVControlPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'input-kv';
  $schema = '/schemas/KVControlSchema.json';

  // Component name
  name = 'KV key-value pair';
  isBaseComponent = true;
  icon = 'fa fa-eyedropper';
  pluginIcon = 'input-kv-plugin';
  description = 'Used to edit key-value pair type data';
  docLink = '/amis/zh-CN/components/form/input-kv';
  tags = ['form item'];
  scaffold = {
    type: 'input-kv',
    label: 'KV',
    name: 'kv'
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

  patchSchema: any = (patched: any) => {
    if (patched.pipeIn || patched.pipeOut) {
      patched = {...patched};
      delete patched.pipeIn;
      delete patched.pipeOut;
    }
    return patched;
  };

  // Event definition, just defined, the configuration panel has not been upgraded, and the entry has not been exposed
  events: RendererPluginEvent[] = [
    {
      eventName: 'add',
      eventLabel: 'Add',
      description: 'Triggered when adding a combination item',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                value: {
                  type: 'string',
                  title: 'Value of the combined item'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'delete',
      eventLabel: 'Delete',
      description: 'Delete combination item',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                key: {
                  type: 'string',
                  title: 'Deleted index'
                },
                value: {
                  type: 'string',
                  title: 'Value of the combined item'
                },
                item: {
                  type: 'object',
                  title: 'Deleted items'
                }
              }
            }
          }
        }
      ]
    }
  ];

  //Action definition
  actions: RendererPluginAction[] = [
    {
      actionType: 'clear',
      actionLabel: 'Clear',
      description: 'Clear selected value',
      ...getActionCommonProps('clear')
    },
    {
      actionType: 'reset',
      actionLabel: 'Reset',
      description: 'Reset the value to the initial value',
      ...getActionCommonProps('reset')
    },
    {
      actionType: 'setValue',
      actionLabel: 'Assignment',
      description: 'Trigger component data update',
      ...getActionCommonProps('setValue')
    }
  ];

  panelTitle = 'KV key-value pair';
  panelBody = [
    getSchemaTpl('layout:originPosition', {value: 'left-top'}),
    {
      type: 'input-text',
      name: 'valueType',
      label: 'value type',
      pipeIn: defaultValue('input-text')
    },
    {
      type: 'input-text',
      name: 'keyPlaceholder',
      label: 'key prompt information'
    },
    {
      type: 'input-text',
      name: 'valuePlaceholder',
      label: 'value prompt information'
    },
    {
      type: 'switch',
      name: 'draggable',
      label: 'Is it sortable',
      pipeIn: defaultValue(true)
    }
  ];
}

registerEditorPlugin(KVControlPlugin);

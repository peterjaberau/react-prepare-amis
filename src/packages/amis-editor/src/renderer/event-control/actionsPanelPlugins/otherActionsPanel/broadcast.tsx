import React from 'react';
import {registerActionPanel} from '../../actionsPanelManager';
import {getSchemaTpl, EditorManager} from 'amis-editor-core';

registerActionPanel('broadcast', {
  label: 'Global broadcast event',
  tag: 'Other',
  description: 'Trigger global broadcast event',
  innerArgs: [],
  descDetail: (info: any, context: any, props: any) => {
    const globalEvents = props.manager.store.globalEvents;
    const event = globalEvents.find(
      (item: any) => item.name === info?.eventName
    );
    return (
      <div>
        trigger
        <span className="ml-1 mr-1">{event?.label || info?.eventName}</span>
        Global broadcast events
      </div>
    );
  },
  schema: (manager: EditorManager, data: any) => {
    const globalEvents = manager.store.globalEvents;
    return {
      type: 'wrapper',
      body: [
        {
          type: 'select',
          name: 'eventName',
          required: true,
          label: 'Please select a global event',
          options: globalEvents.map(item => ({
            label: item.label,
            value: item.name,
            mapping: item.mapping,
            disabled: item.name === data.eventKey
          })),
          size: 'lg',
          mode: 'horizontal',
          initAutoFill: true,
          autoFill: {
            __mapping: '${mapping}'
          },
          onChange: async (val: any, oldVal: any, props: any, form: any) => {
            form.setValueByName('data', void 0);
          }
        },
        {
          type: 'input-kv',
          name: 'data',
          label: 'Parameter mapping',
          mode: 'horizontal',
          draggable: false,
          visibleOn: 'this.eventName',
          keySchema: {
            type: 'select',
            label: false,
            name: 'key',
            source: '${ARRAYMAP(__mapping, i => i.key)}'
          },
          valueSchema: getSchemaTpl('tplFormulaControl', {
            label: false,
            name: 'value',
            clearable: true,
            placeholder: 'Please enter the parameter value',
            variables: '${variables}',
            header: 'Configuration parameter value'
          })
        }
      ]
    };
  }
});

import React from 'react';
import {getRendererByName} from 'amis-core';
import {
  getSchemaTpl,
  defaultValue,
  JSONGetById,
  tipedLabel,
  EditorManager
} from '@/packages/amis-editor-core/src';
import {registerActionPanel} from '../../actionsPanelManager';
import {renderCmptSelect, renderCmptIdInput} from './helper';
import {buildLinkActionDesc} from '../../helper';

registerActionPanel('reload', {
  label: 'Re-request data',
  tag: 'component',
  description:
    'If sending data is enabled, the configuration data will be sent to the target component first, and then the data will be requested again. ',
  descDetail: (info: any, context: any, props: any) => {
    // TODO: actionConfig
    return (
      <div className="action-desc">
        refresh
        {buildLinkActionDesc(props.manager, info)}
        Components
      </div>
    );
  },
  supportComponents: 'byComponent',
  schema: (manager: EditorManager) => [
    {
      type: 'wrapper',
      size: 'sm',
      className: 'p-0',
      body: [
        ...renderCmptSelect(
          'Target component',
          true,
          (value: string, oldVal: any, data: any, form: any) => {
            form.setValueByName('args.resetPage', true);
            form.setValueByName('__addParam', false);
            form.setValueByName('__containerType', 'all');
            form.setValueByName('__reloadParam', []);
          },
          true
        )
      ]
    },
    renderCmptIdInput((value: string, oldVal: any, data: any, form: any) => {
      // Find the component and set the relevant properties
      let schema = JSONGetById(manager.store.schema, value, 'id');
      if (schema) {
        const render = getRendererByName(schema.type);
        let __isScopeContainer = !!render?.storeType;
        let __rendererName = schema.type;
        form.setValues({
          __isScopeContainer,
          __rendererName
        });
      } else {
        form.setValues({
          __isScopeContainer: false,
          __rendererName: ''
        });
      }
    }),
    {
      type: 'switch',
      name: '__resetPage',
      label: tipedLabel(
        'Reset page number',
        'If you select "Yes", the first page of data will be requested again.'
      ),
      onText: 'Yes',
      offText: 'No',
      mode: 'horizontal',
      pipeIn: defaultValue(true),
      visibleOn: `this.actionType === "reload" && this.__rendererName === "crud"`
    },
    {
      type: 'switch',
      name: '__addParam',
      label: tipedLabel(
        'Send data',
        'After turning on "Send Data", the configured data will be sent to the target component, and these data will be merged or overwritten with the target component data domain'
      ),
      onText: 'Yes',
      offText: 'No',
      mode: 'horizontal',
      pipeIn: defaultValue(false),
      visibleOn: `this.actionType === "reload" &&  this.__isScopeContainer`,
      onChange: (value: string, oldVal: any, data: any, form: any) => {
        form.setValueByName('__containerType', 'all');
      }
    },
    {
      type: 'radios',
      name: '__containerType',
      mode: 'horizontal',
      label: '',
      pipeIn: defaultValue('all'),
      visibleOn: `this.__addParam && this.actionType === "reload" && this.__isScopeContainer`,
      options: [
        {
          label: 'Direct assignment',
          value: 'all'
        },
        {
          label: 'Member assignment',
          value: 'appoint'
        }
      ],
      onChange: (value: string, oldVal: any, data: any, form: any) => {
        form.setValueByName('__reloadParams', []);
        form.setValueByName('__valueInput', undefined);
      }
    },
    getSchemaTpl('formulaControl', {
      name: '__valueInput',
      label: '',
      variables: '${variables}',
      size: 'lg',
      mode: 'horizontal',
      required: true,
      visibleOn: `this.__addParam && this.__containerType === "all" && this.actionType === "reload" && this.__isScopeContainer`
    }),
    {
      type: 'combo',
      name: '__reloadParams',
      label: '',
      multiple: true,
      removable: true,
      addable: true,
      strictMode: false,
      canAccessSuperData: true,
      size: 'lg',
      mode: 'horizontal',
      formClassName: 'event-action-combo',
      itemClassName: 'event-action-combo-item',
      items: [
        {
          name: 'key',
          type: 'input-text',
          placeholder: 'parameter name',
          labelField: 'label',
          valueField: 'value',
          required: true
        },
        getSchemaTpl('formulaControl', {
          name: 'val',
          variables: '${variables}',
          placeholder: 'parameter value',
          columnClassName: 'flex-1'
        })
      ],
      visibleOn: `this.__addParam && this.__containerType === "appoint" && this.actionType === "reload" && this.__isScopeContainer`
    },
    {
      type: 'radios',
      name: 'dataMergeMode',
      mode: 'horizontal',
      label: tipedLabel(
        'Data processing method',
        'When "Merge" is selected, the data will be merged into the data domain of the target component. <br/>When "Overwrite" is selected, the data will directly overwrite the data domain of the target component. '
      ),
      pipeIn: defaultValue('merge'),
      visibleOn: `this.__addParam && this.actionType === "reload" && this.__isScopeContainer`,
      options: [
        {
          label: 'Merge',
          value: 'merge'
        },
        {
          label: 'cover',
          value: 'override'
        }
      ]
    }
  ]
});

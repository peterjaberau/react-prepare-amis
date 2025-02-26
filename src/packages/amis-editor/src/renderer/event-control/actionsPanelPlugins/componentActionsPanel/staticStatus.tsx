import React from 'react';
import {defaultValue} from 'amis-editor-core';
import without from 'lodash/without';
import {registerActionPanel} from '../../actionsPanelManager';
import {renderCmptSelect, renderCmptIdInput} from './helper';
import {buildLinkActionDesc} from '../../helper';

registerActionPanel('staticStatus', {
  label: 'Component display status',
  tag: 'component',
  description: 'Control the input state/static of the selected component',
  actions: [
    {
      actionType: 'static',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            {buildLinkActionDesc(props.manager, info)} Switch to static display
          </div>
        );
      }
    },
    {
      actionType: 'nonstatic',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            <span className="variable-right">
              {info?.rendererLabel || info.componentId}
            </span>
            The component switches to input state
          </div>
        );
      }
    }
  ],
  supportComponents: ['form', 'isStaticFormItem'],
  schema: [
    ...renderCmptSelect('Select component', true),
    renderCmptIdInput(),
    {
      type: 'radios',
      label: 'component status',
      name: 'groupType',
      mode: 'horizontal',
      inputClassName: 'event-action-radio',
      value: 'nonstatic',
      required: true,
      pipeIn: defaultValue('nonstatic'),
      options: [
        {
          label: 'Form input',
          value: 'nonstatic'
        },
        {
          label: 'Form static',
          value: 'static'
        }
      ]
    }
  ]
});

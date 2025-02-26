import React from 'react';
import {registerActionPanel} from '../../actionsPanelManager';
import {renderCmptSelect, renderCmptIdInput} from './helper';
import {buildLinkActionDesc} from '../../helper';

registerActionPanel('submit', {
  label: 'Submit form',
  tag: 'component',
  description: 'Trigger form submission',
  descDetail: (info: any, context: any, props: any) => {
    return (
      <div className="action-desc">
        submit
        {buildLinkActionDesc(props.manager, info)}
        Data
      </div>
    );
  },
  supportComponents: 'form',
  schema: () => [
    ...renderCmptSelect('target component', true),
    renderCmptIdInput(),
    {
      name: 'outputVar',
      type: 'input-text',
      label: 'Submit result',
      placeholder:
        'Please enter the variable name to store the submission result',
      description:
        'If you need to perform multiple form submissions, you can modify this variable name to distinguish different submission results',
      mode: 'horizontal',
      size: 'lg',
      value: 'submitResult',
      required: true
    }
  ],
  outputVarDataSchema: [
    {
      type: 'object',
      title: 'submitResult',
      properties: {
        error: {
          type: 'string',
          title: 'Error message'
        },
        errors: {
          type: 'object',
          title: 'Error details'
        },
        payload: {
          type: 'object',
          title: 'Submitted form data'
        },
        responseData: {
          type: 'object',
          title: 'Response data of the submission request'
        }
      }
    }
  ]
});

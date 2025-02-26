import React from 'react';
import {registerActionPanel} from '../../actionsPanelManager';
import {renderCmptSelect, renderCmptIdInput} from './helper';
import {buildLinkActionDesc} from '../../helper';

registerActionPanel('validate', {
  label: 'Verify form',
  tag: 'component',
  description: 'Verify form data',
  descDetail: (info: any, context: any, props: any) => {
    return (
      <div className="action-desc">
        check
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
      label: 'Verification results',
      placeholder:
        'Please enter the variable name to store the verification results',
      description:
        'If you need to perform multiple form validations, you can modify this variable name to distinguish different validation results',
      mode: 'horizontal',
      size: 'lg',
      value: 'validateResult',
      required: true
    }
  ],
  outputVarDataSchema: [
    {
      type: 'object',
      title: 'validateResult',
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
        }
      }
    }
  ]
});

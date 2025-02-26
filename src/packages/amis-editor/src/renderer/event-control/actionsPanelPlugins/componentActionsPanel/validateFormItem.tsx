import React from 'react';
import {registerActionPanel} from '../../actionsPanelManager';
import {renderCmptSelect, renderCmptIdInput} from './helper';
import {buildLinkActionDesc} from '../../helper';

registerActionPanel('validateFormItem', {
  label: 'Check form items',
  tag: 'component',
  description: 'Check single form item data',
  descDetail: (info: any, context: any, props: any) => {
    return (
      <div className="action-desc">
        check
        {buildLinkActionDesc(props.manager, info)}
        Data
      </div>
    );
  },
  supportComponents: ['isFormItem'],
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
      value: 'validateFormItemResult',
      required: true
    }
  ],
  outputVarDataSchema: [
    {
      type: 'object',
      title: 'validateFormItemResult',
      properties: {
        error: {
          type: 'string',
          title: 'Error message'
        },
        value: {
          type: 'object',
          title: 'The value of the form item to be verified'
        }
      }
    }
  ]
});

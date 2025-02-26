import React from 'react';
import {registerActionPanel} from '../../actionsPanelManager';
import {defaultValue, getSchemaTpl, tipedLabel} from 'amis-editor-core';
import {normalizeApi} from 'amis-core';

registerActionPanel('ajax', {
  label: 'Send request',
  tag: 'service',
  description: 'Configure and send API request',
  // innerArgs: ['api', 'options'],
  descDetail: (info: any, context: any, props: any) => {
    let apiInfo = info?.api ?? info?.args?.api;
    if (typeof apiInfo === 'string') {
      apiInfo = normalizeApi(apiInfo);
    }
    return (
      <div className="action-desc">
        send
        <span className="variable-right variable-left">
          {apiInfo?.method || '-'}
        </span>
        ask:
        <span className="variable-left">{apiInfo?.url || '-'}</span>
      </div>
    );
  },
  schema: () => [
    {
      type: 'wrapper',
      className: 'p-none',
      body: [
        getSchemaTpl('apiControl', {
          name: 'api',
          label: 'Configuration request',
          mode: 'horizontal',
          size: 'lg',
          inputClassName: 'm-b-none',
          renderLabel: true,
          required: true
        }),
        {
          name: 'options',
          type: 'combo',
          label: tipedLabel(
            'Silent Request',
            'When enabled, service requests will be sent in silent mode, meaning no success or error notification will pop up.'
          ),
          mode: 'horizontal',
          items: [
            {
              type: 'switch',
              name: 'silent',
              label: false,
              onText: 'Open',
              offText: 'Close',
              mode: 'horizontal',
              pipeIn: defaultValue(false)
            }
          ]
        },
        {
          name: 'outputVar',
          type: 'input-text',
          label: 'Request result',
          placeholder:
            'Please enter the variable name to store the request result',
          description:
            'If you need to send multiple requests, you can modify this variable name to distinguish the results returned by different requests',
          mode: 'horizontal',
          size: 'lg',
          value: 'responseResult',
          required: true
        }
      ]
    }
  ],
  outputVarDataSchema: [
    {
      type: 'object',
      title: 'responseResult',
      properties: {
        responseData: {
          type: 'object',
          title: 'Response data'
        },
        responseStatus: {
          type: 'number',
          title: 'Status ID'
        },
        responseMsg: {
          type: 'string',
          title: 'Prompt information'
        }
      }
    }
  ]
});

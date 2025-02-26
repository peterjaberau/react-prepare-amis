import React from 'react';
import {getSchemaTpl} from '@/packages/amis-editor-core/src';
import {registerActionPanel} from '../../actionsPanelManager';
import {getArgsWrapper} from '../../helper';

const MSG_TYPES: {[key: string]: string} = {
  info: 'Tips',
  warning: 'Warning',
  success: 'success',
  error: 'Error'
};

registerActionPanel('toast', {
  label: 'Message reminder',
  tag: 'Pop-up message',
  description: 'Pop-up message reminder',
  innerArgs: [
    'title',
    'msgType',
    'msg',
    'position',
    'timeout',
    'closeButton',
    'showIcon',
    'className'
  ],
  descDetail: (info: any, context: any, props: any) => {
    return (
      <div className="action-desc">
        {MSG_TYPES[info?.args?.msgType] || ''}
        <span className="variable-left">{info?.args?.msg || '-'}</span>
      </div>
    );
  },
  schema: getArgsWrapper({
    type: 'wrapper',
    body: [
      {
        type: 'button-group-select',
        name: 'msgType',
        label: 'Message type',
        value: 'info',
        required: true,
        mode: 'horizontal',
        options: Object.keys(MSG_TYPES).map(key => ({
          label: MSG_TYPES[key],
          value: key,
          level: 'default'
        }))
      },
      getSchemaTpl('textareaFormulaControl', {
        name: 'msg',
        label: 'Message content',
        mode: 'horizontal',
        variables: '${variables}',
        size: 'lg',
        required: true
      }),
      getSchemaTpl('textareaFormulaControl', {
        name: 'title',
        label: 'Title content',
        variables: '${variables}',
        mode: 'horizontal',
        size: 'lg'
      }),
      getSchemaTpl('formulaControl', {
        name: 'timeout',
        label: 'Duration (ms)',
        rendererSchema: {
          type: 'input-number'
        },
        valueType: 'number',
        variables: '${variables}',
        size: 'lg',
        mode: 'horizontal'
      }),
      {
        type: 'button-group-select',
        name: 'position',
        value: 'top-right',
        mode: 'horizontal',
        label: 'Display location',
        options: [
          {
            label: 'Upper left',
            value: 'top-left'
          },

          {
            label: 'Upper middle',
            value: 'top-center'
          },

          {
            label: 'upper right',
            value: 'top-right'
          },

          {
            label: 'lower left',
            value: 'bottom-left'
          },
          {
            label: 'lower middle',
            value: 'bottom-center'
          },

          {
            label: 'lower right',
            value: 'bottom-right'
          }
        ]
      },
      {
        type: 'switch',
        name: 'closeButton',
        value: true,
        label: 'Show close button',
        mode: 'horizontal'
      },
      {
        type: 'switch',
        name: 'showIcon',
        value: true,
        label: 'Display icon',
        mode: 'horizontal'
      }
    ]
  })
});

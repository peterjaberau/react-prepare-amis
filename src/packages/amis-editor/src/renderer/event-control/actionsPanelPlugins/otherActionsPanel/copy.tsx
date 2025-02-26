import React from 'react';
import {registerActionPanel} from '../../actionsPanelManager';
import {getArgsWrapper} from '../../helper';
import {getSchemaTpl} from 'amis-editor-core';

registerActionPanel('copy', {
  label: 'Copy content',
  tag: 'Other',
  description: 'Copy the text to the clipboard',
  innerArgs: ['content', 'copyFormat'],
  descDetail: (info: any, context: any, props: any) => {
    return (
      <div className="action-desc">
        Copy content:
        <span className="variable-left">{info?.args?.content || '-'}</span>
      </div>
    );
  },
  schema: () =>
    getArgsWrapper({
      type: 'wrapper',
      body: [
        getSchemaTpl('textareaFormulaControl', {
          name: 'content',
          label: 'Content template',
          variables: '${variables}',
          mode: 'horizontal',
          size: 'lg',
          visibleOn: 'this.actionType === "copy"',
          required: true
        }),
        {
          type: 'select',
          name: 'copyFormat',
          mode: 'horizontal',
          value: 'text/plain',
          size: 'lg',
          options: [
            {
              label: 'Plain text',
              value: 'text/plain'
            },
            {
              label: 'Rich text',
              value: 'text/html'
            }
          ],
          label: 'Copy format'
        }
      ]
    })
});

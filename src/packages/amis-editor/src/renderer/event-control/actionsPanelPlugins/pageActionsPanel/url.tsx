import React from 'react';
import {registerActionPanel} from '../../actionsPanelManager';
import {getArgsWrapper} from '../../helper';
import {defaultValue, getSchemaTpl} from '@/packages/amis-editor-core/src';

registerActionPanel('url', {
  label: 'Jump link',
  tag: 'page',
  description: 'Jump to the page of the specified link',
  innerArgs: ['url', 'params', 'blank'],
  descDetail: (info: any, context: any, props: any) => {
    return (
      <div className="action-desc">
        Jump to
        <span className="variable-left">{info?.args?.url || '-'}</span>
      </div>
    );
  },
  schema: () => {
    const data = getArgsWrapper([
      {
        type: 'wrapper',
        body: [
          getSchemaTpl('textareaFormulaControl', {
            name: 'url',
            label: 'Page address',
            variables: '${variables}',
            mode: 'horizontal',
            // placeholder: 'http://', ​​long text is not supported yet
            size: 'lg',
            required: true,
            visibleOn: 'this.actionType === "url"'
          }),
          {
            type: 'combo',
            name: 'params',
            label: 'Page parameters',
            multiple: true,
            mode: 'horizontal',
            size: 'lg',
            formClassName: 'event-action-combo',
            itemClassName: 'event-action-combo-item',
            items: [
              {
                name: 'key',
                placeholder: 'parameter name',
                type: 'input-text'
              },
              getSchemaTpl('formulaControl', {
                variables: '${variables}',
                name: 'val',
                placeholder: 'parameter value',
                columnClassName: 'flex-1'
              })
            ]
          },
          {
            type: 'switch',
            name: 'blank',
            label: 'Open in a new window',
            onText: 'Yes',
            offText: 'No',
            mode: 'horizontal',
            pipeIn: defaultValue(true)
          }
        ]
      }
    ]);
    return data;
  }
});

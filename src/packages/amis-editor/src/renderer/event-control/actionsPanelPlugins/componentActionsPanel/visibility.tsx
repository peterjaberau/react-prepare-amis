import React from 'react';
import {getSchemaTpl, defaultValue} from '@/packages/amis-editor-core/src';
import {registerActionPanel} from '../../actionsPanelManager';
import {renderCmptSelect, renderCmptIdInput} from './helper';
import {buildLinkActionDesc} from '../../helper';

registerActionPanel('visibility', {
  label: 'Component visibility',
  tag: 'component',
  description: 'Controls the display/hide of the selected component',
  actions: [
    {
      actionType: 'show',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            show
            {buildLinkActionDesc(props.manager, info)}
            Components
          </div>
        );
      }
    },
    {
      actionType: 'hidden',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            hide
            {buildLinkActionDesc(props.manager, info)}
            Components
          </div>
        );
      }
    },
    {
      actionType: 'visibility',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            Components
            {buildLinkActionDesc(props.manager, info)}
            Expression configured
          </div>
        );
      }
    }
  ],
  supportComponents: '*',
  schema: () => [
    ...renderCmptSelect('target component', true),
    renderCmptIdInput(),
    {
      type: 'radios',
      label: 'conditions',
      name: 'groupType',
      mode: 'horizontal',
      value: 'static',
      required: true,
      inputClassName: 'event-action-radio',
      options: [
        {
          label: 'static',
          value: 'static'
        },
        {
          label: 'expression',
          value: 'visibility'
        }
      ]
    },
    {
      type: 'radios',
      label: 'Show/Hide',
      name: '__statusType',
      mode: 'horizontal',
      value: 'show',
      required: true,
      pipeIn: defaultValue('show'),
      inputClassName: 'event-action-radio',
      visibleOn: "this.groupType === 'static'",
      options: [
        {
          label: 'display',
          value: 'show'
        },
        {
          label: 'Hide',
          value: 'hidden'
        }
      ]
    },
    getSchemaTpl('expressionFormulaControl', {
      mode: 'horizontal',
      label: 'expression',
      required: true,
      size: 'lg',
      variables: '${variables}',
      evalMode: true,
      name: '__actionExpression',
      visibleOn: "this.groupType === 'visibility'"
    })
  ]
});

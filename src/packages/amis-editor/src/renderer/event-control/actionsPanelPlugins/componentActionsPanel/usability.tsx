import React from 'react';
import {getSchemaTpl, defaultValue} from '@/packages/amis-editor-core/src';
import {registerActionPanel} from '../../actionsPanelManager';
import {renderCmptSelect, renderCmptIdInput} from './helper';
import {buildLinkActionDesc} from '../../helper';

const SUPPORT_DISABLED_CMPTS = [
  'button-group',
  'action',
  'button',
  'submit',
  'reset',
  'collapse',
  'container',
  'dropdown-button',
  'flex',
  'flex-item',
  'grid',
  'grid-2d',
  'link',
  'not',
  'wizard'
  // 'card2'
];

registerActionPanel('usability', {
  label: 'Component availability',
  tag: 'component',
  description: 'Controls the enable/disable of the selected component',
  actions: [
    {
      actionType: 'enabled',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            Enable
            {buildLinkActionDesc(props.manager, info)}
            Components
          </div>
        );
      }
    },
    {
      actionType: 'disabled',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            Disable
            {buildLinkActionDesc(props.manager, info)}
            Components
          </div>
        );
      }
    },
    {
      actionType: 'usability',
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
  supportComponents: ['form', 'isFormItem', ...SUPPORT_DISABLED_CMPTS],
  schema: [
    ...renderCmptSelect('target component', true),
    renderCmptIdInput(),
    {
      type: 'radios',
      label: 'conditions',
      name: 'groupType',
      mode: 'horizontal',
      inputClassName: 'event-action-radio',
      value: 'static',
      required: true,
      options: [
        {
          label: 'static',
          value: 'static'
        },
        {
          label: 'expression',
          value: 'usability'
        }
      ]
    },
    {
      type: 'radios',
      label: 'Enable/Disable',
      name: '__statusType',
      mode: 'horizontal',
      inputClassName: 'event-action-radio',
      value: 'enabled',
      required: true,
      pipeIn: defaultValue('enabled'),
      visibleOn: "this.groupType === 'static'",
      options: [
        {
          label: 'Enable',
          value: 'enabled'
        },
        {
          label: 'disable',
          value: 'disabled'
        }
      ]
    },
    getSchemaTpl('expressionFormulaControl', {
      mode: 'horizontal',
      label: 'expression',
      required: true,
      size: 'lg',
      evalMode: true,
      name: '__actionExpression',
      visibleOn: "this.groupType === 'usability'"
    })
  ]
});

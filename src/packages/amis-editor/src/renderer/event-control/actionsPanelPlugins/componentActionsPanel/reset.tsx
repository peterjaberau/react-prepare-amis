import React from 'react';
import {registerActionPanel} from '../../actionsPanelManager';
import {renderCmptSelect, renderCmptIdInput} from './helper';
import {buildLinkActionDesc} from '../../helper';

registerActionPanel('reset', {
  label: 'Reset form',
  tag: 'component',
  description: 'Reset form data',
  descDetail: (info: any, context: any, props: any) => {
    return (
      <div className="action-desc">
        Reset
        {buildLinkActionDesc(props.manager, info)}
        Data
      </div>
    );
  },
  supportComponents: 'form',
  schema: () => [
    ...renderCmptSelect('target component', true),
    renderCmptIdInput()
  ]
});

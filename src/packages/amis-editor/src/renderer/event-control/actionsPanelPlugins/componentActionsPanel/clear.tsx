import React from 'react';
import {registerActionPanel} from '../../actionsPanelManager';
import {renderCmptSelect, renderCmptIdInput} from './helper';
import {buildLinkActionDesc} from '../../helper';

registerActionPanel('clear', {
  label: 'Clear form',
  tag: 'component',
  description: 'Clear form data',
  descDetail: (info: any, context: any, props: any) => {
    return (
      <div className="action-desc">
        Clear
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

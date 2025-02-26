import React from 'react';
import {registerActionPanel} from '../../actionsPanelManager';

registerActionPanel('refresh', {
  label: 'Refresh page',
  tag: 'page',
  description: 'Trigger the browser to refresh the page',
  descDetail: (info: any, context: any, props: any) => {
    return <div className="action-desc">{info?.label}</div>;
  }
});

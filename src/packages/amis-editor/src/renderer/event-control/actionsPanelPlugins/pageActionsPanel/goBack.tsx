import React from 'react';
import {registerActionPanel} from '../../actionsPanelManager';

registerActionPanel('goBack', {
  label: 'Back to page',
  tag: 'page',
  description: 'Browser fallback',
  descDetail: (info: any, context: any, props: any) => {
    return <div className="action-desc">Return to the previous page</div>;
  }
});

import { useState } from 'react';

import { PageLayoutType } from '@data/index';
import { Box } from '@grafana-ui/index';
import { Page } from '~/core/components/Page/Page';

import { EmbeddedDashboard } from './EmbeddedDashboard';

export function EmbeddedDashboardTestPage() {
  const [state, setState] = useState('?from=now-5m&to=now');

  return (
    <Page
      navId="dashboards/browse"
      pageNav={{ text: 'Embedding dashboard', subTitle: 'Showing dashboard: Panel Tests - Pie chart' }}
      layout={PageLayoutType.Canvas}
    >
      <Box paddingY={2}>Internal url state: {state}</Box>
      <EmbeddedDashboard uid="lVE-2YFMz" initialState={state} onStateChange={setState} />
    </Page>
  );
}

export default EmbeddedDashboardTestPage;

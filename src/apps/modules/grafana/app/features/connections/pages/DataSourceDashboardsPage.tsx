import { useParams } from 'react-router-dom-v5-compat';

import { Page } from '@grafana-module/app/core/components/Page/Page';
import { DataSourceDashboards } from '@grafana-module/app/features/datasources/components/DataSourceDashboards';

import { useDataSourceSettingsNav } from '../hooks/useDataSourceSettingsNav';

export function DataSourceDashboardsPage() {
  const { uid = '' } = useParams<{ uid: string }>();
  const { navId, pageNav } = useDataSourceSettingsNav('dashboards');

  return (
    <Page navId={navId} pageNav={pageNav}>
      <Page.Contents>
        <DataSourceDashboards uid={uid} />
      </Page.Contents>
    </Page>
  );
}

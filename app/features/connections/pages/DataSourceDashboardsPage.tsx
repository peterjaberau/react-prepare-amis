import { useParams } from 'react-router';

import { Page } from '~/core/components/Page/Page';
import { DataSourceDashboards } from '~/features/datasources/components/DataSourceDashboards';

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

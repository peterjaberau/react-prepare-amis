import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { getDataSourceSrv, locationService } from '@runtime/index';
import { Page } from '~/core/components/Page/Page';
import { useDispatch } from '~/types';

import { setInitialDatasource } from '../state/reducers';

export default function NewDashboardWithDS() {
  const [error, setError] = useState<string | null>(null);
  const { datasourceUid } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const ds = getDataSourceSrv().getInstanceSettings(datasourceUid);
    if (!ds) {
      setError('Data source not found');
      return;
    }

    dispatch(setInitialDatasource(datasourceUid));

    locationService.replace('/dashboard/new');
  }, [datasourceUid, dispatch]);

  if (error) {
    return (
      <Page navId="dashboards">
        <Page.Contents>
          <div>Data source with UID &quot;{datasourceUid}&quot; not found.</div>
        </Page.Contents>
      </Page>
    );
  }

  return null;
}

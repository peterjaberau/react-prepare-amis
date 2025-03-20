import { Page } from '@grafana-module/app/core/components/Page/Page';
import { DataSourceAddButton } from '@grafana-module/app/features/datasources/components/DataSourceAddButton';
import { DataSourcesList } from '@grafana-module/app/features/datasources/components/DataSourcesList';
import { getDataSourcesCount } from '@grafana-module/app/features/datasources/state';
import { StoreState, useSelector } from '@grafana-module/app/types';

export function DataSourcesListPage() {
  const dataSourcesCount = useSelector(({ dataSources }: StoreState) => getDataSourcesCount(dataSources));

  const actions = dataSourcesCount > 0 ? <DataSourceAddButton /> : undefined;
  return (
    <Page navId={'connections-datasources'} actions={actions}>
      <Page.Contents>
        <DataSourcesList />
      </Page.Contents>
    </Page>
  );
}

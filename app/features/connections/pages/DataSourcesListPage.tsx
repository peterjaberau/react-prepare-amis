import { Page } from '~/core/components/Page/Page';
import { DataSourceAddButton } from '~/features/datasources/components/DataSourceAddButton';
import { DataSourcesList } from '~/features/datasources/components/DataSourcesList';
import { getDataSourcesCount } from '~/features/datasources/state';
import { StoreState, useSelector } from '~/types';

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

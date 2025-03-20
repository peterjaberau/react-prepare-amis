import { Page } from '~/core/components/Page/Page';
import { NewDataSource } from '~/features/datasources/components/NewDataSource';

export function NewDataSourcePage() {
  return (
    <Page
      navId={'connections-datasources'}
      pageNav={{ text: 'Add data source', subTitle: 'Choose a data source type', active: true }}
    >
      <Page.Contents>
        <NewDataSource />
      </Page.Contents>
    </Page>
  );
}

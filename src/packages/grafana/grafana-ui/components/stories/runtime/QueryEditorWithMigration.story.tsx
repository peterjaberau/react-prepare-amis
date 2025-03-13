import { action } from '@storybook/addon-actions';
import { StoryFn, Meta } from '@storybook/react';

import { DataSourceInstanceSettings, QueryEditorProps } from '@grafana/data';
import { DataQuery, DataSourceJsonData } from '@grafana/schema';

import { QueryEditorWithMigration } from '../../../../../grafana-runtime/src/components/QueryEditorWithMigration';
import { DataSourceWithBackend } from '../../../../../grafana-runtime/src/utils/DataSourceWithBackend';
import { MigrationHandler } from '../../../../../grafana-runtime/src/utils/migrationHandler';

interface MyQuery extends DataQuery {}

class MyDataSource extends DataSourceWithBackend<MyQuery, DataSourceJsonData> implements MigrationHandler {
  hasBackendMigration: boolean;

  constructor(instanceSettings: DataSourceInstanceSettings<DataSourceJsonData>) {
    super(instanceSettings);
    this.hasBackendMigration = true;
  }

  shouldMigrate(query: DataQuery): boolean {
    return true;
  }
}

type Props = QueryEditorProps<MyDataSource, MyQuery, DataSourceJsonData>;

function QueryEditor(props: Props) {
  return <div>{JSON.stringify(props.query)}</div>;
}

function createMockDatasource(otherSettings?: Partial<DataSourceInstanceSettings<DataSourceJsonData>>) {
  const settings = {
    name: 'test',
    id: 1234,
    uid: 'abc',
    type: 'dummy',
    jsonData: {},
    ...otherSettings,
  } as DataSourceInstanceSettings<DataSourceJsonData>;

  return new MyDataSource(settings);
}

const meta: Meta = {
  title: 'QueryEditor/QueryEditorWithMigration',
  component: (props) => {
    const WithMigration = QueryEditorWithMigration(QueryEditor);
    return <WithMigration {...props} />;
  },
  parameters: {
    controls: { exclude: ['onRemove'] },
  },
};

export const Basic: StoryFn<typeof QueryEditorWithMigration> = (args) => {
  const WithMigration = QueryEditorWithMigration(QueryEditor);
  const ds = createMockDatasource();
  const originalQuery = { refId: 'A', datasource: { type: 'dummy' }, foo: 'bar' };

  return (
    <WithMigration
      {...args}
      datasource={ds}
      query={originalQuery}
      onChange={action('onChange')}
      onRunQuery={action('onRunQuery')}
    />
  );
};

Basic.args = {
  title: 'Basic',
};

export const MigratedQuery: StoryFn<typeof QueryEditorWithMigration> = (args) => {
  const WithMigration = QueryEditorWithMigration(QueryEditor);
  const ds = createMockDatasource();
  const originalQuery = { refId: 'A', datasource: { type: 'dummy' }, foo: 'bar' };
  // const migratedQuery = { refId: 'A', datasource: { type: 'dummy' }, foobar: 'barfoo' };

  return (
    <WithMigration
      {...args}
      datasource={ds}
      query={originalQuery}
      onChange={action('onChange')}
      onRunQuery={action('onRunQuery')}
    />
  );
};

MigratedQuery.args = {
  title: 'Migrated Query',
};

export const LoadingSkeleton: StoryFn<typeof QueryEditorWithMigration> = (args) => {
  const WithMigration = QueryEditorWithMigration(QueryEditor);
  const ds = createMockDatasource();
  const originalQuery = { refId: 'A', datasource: { type: 'dummy' }, foo: 'bar' };

  return (
    <WithMigration
      {...args}
      datasource={ds}
      query={originalQuery}
      onChange={action('onChange')}
      onRunQuery={action('onRunQuery')}
    />
  );
};

LoadingSkeleton.args = {
  title: 'Loading Skeleton',
};

export default meta;

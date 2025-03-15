import { QueryEditorProps } from '@data/index';
import { SqlQueryEditorLazy, SQLOptions, SQLQuery, QueryHeaderProps } from '@grafana-sql/index';

import { PostgresDatasource } from './datasource';

const queryHeaderProps: Pick<QueryHeaderProps, 'dialect'> = { dialect: 'postgres' };

export function PostgresQueryEditor(props: QueryEditorProps<PostgresDatasource, SQLQuery, SQLOptions>) {
  return <SqlQueryEditorLazy {...props} queryHeaderProps={queryHeaderProps} />;
}

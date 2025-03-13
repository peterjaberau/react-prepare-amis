import {
  DataQuery as SchemaDataQuery,
  DataSourceRef as SchemaDataSourceRef,
  DataTopic as SchemaDataTopic,
} from '@schema/index';

/**
 * @deprecated use the type from @schema/index
 */
export interface DataQuery extends SchemaDataQuery {}

/**
 * @deprecated use the type from @schema/index
 */
export interface DataSourceRef extends SchemaDataSourceRef {}

/**
 * Attached to query results (not persisted)
 *
 * @deprecated use the type from @schema/index
 */
export { SchemaDataTopic as DataTopic };

/**
 * Abstract representation of any label-based query
 * @internal
 */
export interface AbstractQuery extends SchemaDataQuery {
  labelMatchers: AbstractLabelMatcher[];
}

/**
 * @internal
 */
export enum AbstractLabelOperator {
  Equal = 'Equal',
  NotEqual = 'NotEqual',
  EqualRegEx = 'EqualRegEx',
  NotEqualRegEx = 'NotEqualRegEx',
}

/**
 * @internal
 */
export type AbstractLabelMatcher = {
  name: string;
  value: string;
  operator: AbstractLabelOperator;
};

/**
 * @internal
 */
export interface DataSourceWithQueryImportSupport<TQuery extends SchemaDataQuery> {
  importFromAbstractQueries(labelBasedQuery: AbstractQuery[]): Promise<TQuery[]>;
}

/**
 * @internal
 */
export interface DataSourceWithQueryExportSupport<TQuery extends SchemaDataQuery> {
  exportToAbstractQueries(query: TQuery[]): Promise<AbstractQuery[]>;
}

/**
 * @internal
 */
export const hasQueryImportSupport = <TQuery extends SchemaDataQuery>(
  datasource: unknown
): datasource is DataSourceWithQueryImportSupport<TQuery> => {
  if (!datasource || typeof datasource !== 'object') {
    return false;
  }

  return 'importFromAbstractQueries' in datasource;
};

/**
 * @internal
 */
export const hasQueryExportSupport = <TQuery extends SchemaDataQuery>(
  datasource: unknown
): datasource is DataSourceWithQueryExportSupport<TQuery> => {
  if (!datasource || typeof datasource !== 'object') {
    return false;
  }
  return 'exportToAbstractQueries' in datasource;
};

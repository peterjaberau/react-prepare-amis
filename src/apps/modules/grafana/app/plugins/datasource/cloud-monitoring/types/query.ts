import { CloudMonitoringQuery as CloudMonitoringQueryBase, QueryType } from '../dataquery';

export { QueryType };
export { PreprocessorType, MetricKind, AlignmentTypes, ValueTypes, MetricFindQueryTypes } from '../dataquery';
export type {
  TimeSeriesQuery,
  SLOQuery,
  TimeSeriesList,
  MetricQuery,
  PromQLQuery,
  LegacyCloudMonitoringAnnotationQuery,
  Filter,
} from '../dataquery';

/**
 * Represents the query as it moves through the frontend query editor and datasource files.
 * It can represent new queries that are still being edited, so all properties are optional
 */
// TODO: This is a workaround until the type extensions issue is resolved in CUE
export interface CloudMonitoringQuery extends CloudMonitoringQueryBase {
  queryType?: QueryType;
}

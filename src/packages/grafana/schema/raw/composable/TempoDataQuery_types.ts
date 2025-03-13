
import * as common from '@schema';

export const pluginVersion = "%VERSION%";

export interface TempoQuery extends common.DataQuery {
  /**
   * For metric queries, how many exemplars to request, 0 means no exemplars
   */
  exemplars?: number;
  filters: Array<TraceqlFilter>;
  /**
   * Filters that are used to query the metrics summary
   */
  groupBy?: Array<TraceqlFilter>;
  /**
   * Defines the maximum number of traces that are returned from Tempo
   */
  limit?: number;
  /**
   * @deprecated Define the maximum duration to select traces. Use duration format, for example: 1.2s, 100ms
   */
  maxDuration?: string;
  /**
   * For metric queries, whether to run instant or range queries
   */
  metricsQueryType?: MetricsQueryType;
  /**
   * @deprecated Define the minimum duration to select traces. Use duration format, for example: 1.2s, 100ms
   */
  minDuration?: string;
  /**
   * TraceQL query or trace ID
   */
  query?: string;
  /**
   * @deprecated Logfmt query to filter traces by their tags. Example: http.status_code=200 error=true
   */
  search?: string;
  /**
   * Use service.namespace in addition to service.name to uniquely identify a service.
   */
  serviceMapIncludeNamespace?: boolean;
  /**
   * Filters to be included in a PromQL query to select data for the service graph. Example: {client="app",service="app"}. Providing multiple values will produce union of results for each filter, using PromQL OR operator internally.
   */
  serviceMapQuery?: (string | Array<string>);
  /**
   * @deprecated Query traces by service name
   */
  serviceName?: string;
  /**
   * @deprecated Query traces by span name
   */
  spanName?: string;
  /**
   * Defines the maximum number of spans per spanset that are returned from Tempo
   */
  spss?: number;
  /**
   * For metric queries, the step size to use
   */
  step?: string;
  /**
   * The type of the table that is used to display the search results
   */
  tableType?: SearchTableType;
}

export const defaultTempoQuery: Partial<TempoQuery> = {
  filters: [],
  groupBy: [],
};

export type TempoQueryType = ('traceql' | 'traceqlSearch' | 'serviceMap' | 'upload' | 'nativeSearch' | 'traceId' | 'clear');

export enum MetricsQueryType {
  Instant = 'instant',
  Range = 'range',
}

/**
 * The state of the TraceQL streaming search query
 */
export enum SearchStreamingState {
  Done = 'done',
  Error = 'error',
  Pending = 'pending',
  Streaming = 'streaming',
}

/**
 * The type of the table that is used to display the search results
 */
export enum SearchTableType {
  Raw = 'raw',
  Spans = 'spans',
  Traces = 'traces',
}

/**
 * static fields are pre-set in the UI, dynamic fields are added by the user
 */
export enum TraceqlSearchScope {
  Event = 'event',
  Instrumentation = 'instrumentation',
  Intrinsic = 'intrinsic',
  Link = 'link',
  Resource = 'resource',
  Span = 'span',
  Unscoped = 'unscoped',
}

export interface TraceqlFilter {
  /**
   * Uniquely identify the filter, will not be used in the query generation
   */
  id: string;
  /**
   * The operator that connects the tag to the value, for example: =, >, !=, =~
   */
  operator?: string;
  /**
   * The scope of the filter, can either be unscoped/all scopes, resource or span
   */
  scope?: TraceqlSearchScope;
  /**
   * The tag for the search filter, for example: .http.status_code, .service.name, status
   */
  tag?: string;
  /**
   * The value for the search filter
   */
  value?: (string | Array<string>);
  /**
   * The type of the value, used for example to check whether we need to wrap the value in quotes when generating the query
   */
  valueType?: string;
}

export interface TempoDataQuery {}

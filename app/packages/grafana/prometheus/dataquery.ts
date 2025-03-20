// Core Grafana history https://github.com/grafana/grafana/blob/v11.0.0-preview/public/app/plugins/datasource/prometheus/dataquery.ts
import { Scope, ScopeSpec, ScopeSpecFilter } from '@data/index';
import * as common from '@grafana/schema';

export enum QueryEditorMode {
  Builder = 'builder',
  Code = 'code',
}

export type PromQueryFormat = 'time_series' | 'table' | 'heatmap';

export interface Prometheus extends common.DataQuery {
  /**
   * Specifies which editor is being used to prepare the query. It can be "code" or "builder"
   */
  editorMode?: QueryEditorMode;
  /**
   * Execute an additional query to identify interesting raw samples relevant for the given expr
   */
  exemplar?: boolean;
  /**
   * The actual expression/query that will be evaluated by Prometheus
   */
  expr: string;
  /**
   * Query format to determine how to display data points in panel. It can be "time_series", "table", "heatmap"
   */
  format?: PromQueryFormat;
  /**
   * Returns only the latest value that Prometheus has scraped for the requested time series
   */
  instant?: boolean;
  /**
   * @deprecated Used to specify how many times to divide max data points by. We use max data points under query options
   * See https://github.com/grafana/grafana/issues/48081
   */
  intervalFactor?: number;
  /**
   * Series name override or template. Ex. {{hostname}} will be replaced with label value for hostname
   */
  legendFormat?: string;
  /**
   * Returns a Range vector, comprised of a set of time series containing a range of data points over time for each time series
   */
  range?: boolean;
  scopes?: Array<ScopeSpec & Pick<Scope['metadata'], 'name'>>;
  adhocFilters?: ScopeSpecFilter[];
  groupByKeys?: string[];
}

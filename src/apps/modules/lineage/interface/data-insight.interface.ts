import { TooltipProps } from 'recharts';
import { DataInsightIndex } from '../enums/DataInsight.enum';
import { ReportData } from '../generated/analytics/reportData';
import { DataReportIndex } from '../generated/dataInsight/dataInsightChart';
import { DataInsightChartType } from '../generated/dataInsight/dataInsightChartResult';
import { KpiResult, KpiTargetType } from '../generated/dataInsight/kpi/kpi';
import { KeysOfUnion } from './search.interface';

export interface ChartAggregateParam {
  dataInsightChartName: DataInsightChartType;
  dataReportIndex: DataReportIndex;
  startTs?: number;
  endTs?: number;
  from?: number;
  size?: number;
  queryFilter?: string;
  tier?: string;
  team?: string;
}

export interface ChartFilter {
  team?: string;
  tier?: string;
  startTs: number;
  endTs: number;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DataInsightChartTooltipProps extends TooltipProps<any, any> {
  isPercentage?: boolean;
  isTier?: boolean;
  dateTimeFormatter?: (date?: number, format?: string) => string;
  valueFormatter?: (value: number | string, key?: string) => string | number;
  timeStampKey?: string;
  transformLabel?: boolean;
  customValueKey?: string;
}

export interface UIKpiResult extends KpiResult {
  target: number;
  metricType: KpiTargetType;
  startDate: number;
  endDate: number;
  displayName: string;
}

export enum DataInsightTabs {
  DATA_ASSETS = 'data-assets',
  APP_ANALYTICS = 'app-analytics',
  KPIS = 'kpi',
  COST_ANALYSIS = 'cost-analysis',
}

export enum KpiDate {
  START_DATE = 'startDate',
  END_DATE = 'endDate',
}

export type ChartValue = string | number | undefined;

export type AggregatedCostAnalysisReportDataSearchSource = ReportData; // extends EntityInterface

export type DataInsightSearchRequest = {
  pageNumber?: number;
  pageSize?: number;
  searchIndex?: DataInsightIndex.AGGREGATED_COST_ANALYSIS_REPORT_DATA;
  query?: string;
  queryFilter?: Record<string, unknown>;
  postFilter?: Record<string, unknown>;
  sortField?: string;
  sortOrder?: string;
  includeDeleted?: boolean;
  trackTotalHits?: boolean;
  filters?: string;
} & (
  | {
      fetchSource: true;
      includeFields?: KeysOfUnion<AggregatedCostAnalysisReportDataSearchSource>[];
    }
  | {
      fetchSource?: false;
    }
);

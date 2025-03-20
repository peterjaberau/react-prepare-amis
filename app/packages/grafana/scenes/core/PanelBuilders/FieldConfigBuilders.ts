import { TableFieldOptions as TableFieldConfig } from '@schema/index';

import {
  FieldConfig as BarChartFieldConfig,
  defaultFieldConfig as defaultBarChartFieldConfig,
} from '@schema/index';
import { FieldConfig as HeatmapFieldConfig } from '@schema/index';
import {
  FieldConfig as HistogramFieldConfig,
  defaultFieldConfig as defaultHistogramFieldConfig,
} from '@schema/index';
import { FieldConfig as PieChartFieldConfig } from '@schema/index';
import {
  FieldConfig as StateTimelineFieldConfig,
  defaultFieldConfig as defaultStateTimelineFieldConfig,
} from '@schema/index';
import {
  FieldConfig as StatusHistoryFieldConfig,
  defaultFieldConfig as defaultStatusHistoryFieldConfig,
} from '@schema/index';
import { FieldConfig as TimeSeriesFieldConfig } from '@schema/index';
import { FieldConfig as TrendFieldConfig } from '@schema/index';
import { defaultFieldConfig as defaultXYChartFieldConfig } from '@schema/index';
import { FieldConfigBuilder } from './FieldConfigBuilder';

export const FieldConfigBuilders = {
  barchart() {
    return new FieldConfigBuilder<BarChartFieldConfig>(() => defaultBarChartFieldConfig);
  },
  bargauge() {
    return new FieldConfigBuilder<{}>();
  },
  datagrid() {
    return new FieldConfigBuilder<{}>();
  },
  flamegraph() {
    return new FieldConfigBuilder<{}>();
  },
  gauge() {
    return new FieldConfigBuilder<{}>();
  },
  geomap() {
    return new FieldConfigBuilder<{}>();
  },
  heatmap() {
    return new FieldConfigBuilder<HeatmapFieldConfig>();
  },
  histogram() {
    return new FieldConfigBuilder<HistogramFieldConfig>(() => defaultHistogramFieldConfig);
  },
  logs() {
    return new FieldConfigBuilder<{}>();
  },
  news() {
    return new FieldConfigBuilder<{}>();
  },
  nodegraph() {
    return new FieldConfigBuilder<{}>();
  },
  piechart() {
    return new FieldConfigBuilder<PieChartFieldConfig>();
  },
  stat() {
    return new FieldConfigBuilder<{}>();
  },
  statetimeline() {
    return new FieldConfigBuilder<StateTimelineFieldConfig>(() => defaultStateTimelineFieldConfig);
  },
  statushistory() {
    return new FieldConfigBuilder<StatusHistoryFieldConfig>(() => defaultStatusHistoryFieldConfig);
  },
  table() {
    return new FieldConfigBuilder<TableFieldConfig>();
  },
  text() {
    return new FieldConfigBuilder<{}>();
  },
  timeseries() {
    return new FieldConfigBuilder<TimeSeriesFieldConfig>();
  },
  trend() {
    return new FieldConfigBuilder<{}>();
  },
  traces() {
    return new FieldConfigBuilder<TrendFieldConfig>();
  },
  xychart() {
    return new FieldConfigBuilder<{}>(() => defaultXYChartFieldConfig);
  },
};

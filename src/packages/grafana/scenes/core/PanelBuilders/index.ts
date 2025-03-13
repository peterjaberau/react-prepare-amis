import { TableFieldOptions as TableFieldConfig } from '@schema/index';

import {
  Options as BarChartOptions,
  FieldConfig as BarChartFieldConfig,
  defaultOptions as defaultBarChartOptions,
  defaultFieldConfig as defaultBarChartFieldConfig,
} from '@schema/raw/composable/BarChartPanelCfg_types';
import {
  Options as BarGaugeOptions,
  defaultOptions as defaultBarGaugeOptions,
} from '@schema/raw/composable/BarGaugePanelCfg_types';
import {
  Options as DataGridOptions,
  defaultOptions as defaultDataGridOptions,
} from '@schema/raw/composable/DatagridPanelCfg_types';
import {
  Options as GaugeOptions,
  defaultOptions as defaultGaugeOptions,
} from '@schema/raw/composable/GaugePanelCfg_types';
import {
  Options as GeomapOptions,
  defaultOptions as defaultGeomapOptions,
} from '@schema/raw/composable/GeomapPanelCfg_types';
import {
  Options as HeatmapOptions,
  FieldConfig as HeatmapFieldConfig,
  defaultOptions as defaultHeatmapOptions,
} from '@schema/raw/composable/HeatmapPanelCfg_types';
import {
  Options as HistogramOptions,
  FieldConfig as HistogramFieldConfig,
  defaultOptions as defaultHistogramOptions,
  defaultFieldConfig as defaultHistogramFieldConfig,
} from '@schema/raw/composable/HistogramPanelCfg_types';
import { Options as LogsOptions } from '@schema/raw/composable/LogsPanelCfg_types';
import {
  Options as NewsOptions,
  defaultOptions as defaultNewsOptions,
} from '@schema/raw/composable/NewsPanelCfg_types';
import { Options as NodeGraphOptions } from '@schema/raw/composable/NodeGraphPanelCfg_types';
import {
  Options as PieChartOptions,
  FieldConfig as PieChartFieldConfig,
  defaultOptions as defaultPieChartOptions,
} from '@schema/raw/composable/PieChartPanelCfg_types';
import {
  Options as StatOptions,
  defaultOptions as defaultStatOptions,
} from '@schema/raw/composable/StatPanelCfg_types';
import {
  Options as StateTimelineOptions,
  FieldConfig as StateTimelineFieldConfig,
  defaultOptions as defaultStateTimelineOptions,
  defaultFieldConfig as defaultStateTimelineFieldConfig,
} from '@schema/raw/composable/StateTimelinePanelCfg_types';
import {
  Options as StatusHistoryOptions,
  FieldConfig as StatusHistoryFieldConfig,
  defaultOptions as defaultStatusHistoryOptions,
  defaultFieldConfig as defaultStatusHistoryFieldConfig,
} from '@schema/raw/composable/StatusHistoryPanelCfg_types';
import {
  Options as TableOptions,
  defaultOptions as defaultTableOptions,
} from '@schema/raw/composable/TablePanelCfg_types';
import {
  Options as TextOptions,
  defaultOptions as defaultTextOptions,
} from '@schema/raw/composable/TextPanelCfg_types';
import {
  Options as TimeSeriesOptions,
  FieldConfig as TimeSeriesFieldConfig,
} from '@schema/raw/composable/TimeSeriesPanelCfg_types';
import {
  Options as TrendOptions,
  FieldConfig as TrendFieldConfig,
} from '@schema/raw/composable/TrendPanelCfg_types';
import {
  Options as XYChartOptions,
  defaultOptions as defaultXYChartOptions,
  defaultFieldConfig as defaultXYChartFieldConfig,
} from '@schema/raw/composable/XYChartPanelCfg_types';

import { VizPanelBuilder } from './VizPanelBuilder';

export const PanelBuilders = {
  barchart() {
    return new VizPanelBuilder<BarChartOptions, BarChartFieldConfig>(
      'barchart',
      '10.0.0',
      () => defaultBarChartOptions,
      () => defaultBarChartFieldConfig
    );
  },
  bargauge() {
    return new VizPanelBuilder<BarGaugeOptions, {}>('bargauge', '10.0.0', () => defaultBarGaugeOptions);
  },
  datagrid() {
    return new VizPanelBuilder<DataGridOptions, {}>('datagrid', '10.0.0', () => defaultDataGridOptions);
  },
  flamegraph() {
    return new VizPanelBuilder<{}, {}>('flamegraph', '10.0.0');
  },
  gauge() {
    return new VizPanelBuilder<GaugeOptions, {}>('gauge', '10.0.0', () => defaultGaugeOptions);
  },
  geomap() {
    return new VizPanelBuilder<GeomapOptions, {}>('geomap', '10.0.0', () => defaultGeomapOptions);
  },
  heatmap() {
    return new VizPanelBuilder<HeatmapOptions, HeatmapFieldConfig>('heatmap', '10.0.0', () => defaultHeatmapOptions);
  },
  histogram() {
    return new VizPanelBuilder<HistogramOptions, HistogramFieldConfig>(
      'histogram',
      '10.0.0',
      () => defaultHistogramOptions,
      () => defaultHistogramFieldConfig
    );
  },
  logs() {
    return new VizPanelBuilder<LogsOptions, {}>('logs', '10.0.0');
  },
  news() {
    return new VizPanelBuilder<NewsOptions, {}>('news', '10.0.0', () => defaultNewsOptions);
  },
  nodegraph() {
    return new VizPanelBuilder<NodeGraphOptions, {}>('nodeGraph', '10.0.0');
  },
  piechart() {
    return new VizPanelBuilder<PieChartOptions, PieChartFieldConfig>(
      'piechart',
      '10.0.0',
      () => defaultPieChartOptions
    );
  },
  stat() {
    return new VizPanelBuilder<StatOptions, {}>('stat', '10.0.0', () => defaultStatOptions);
  },
  statetimeline() {
    return new VizPanelBuilder<StateTimelineOptions, StateTimelineFieldConfig>(
      'state-timeline',
      '10.0.0',
      () => defaultStateTimelineOptions,
      () => defaultStateTimelineFieldConfig
    );
  },
  statushistory() {
    return new VizPanelBuilder<StatusHistoryOptions, StatusHistoryFieldConfig>(
      'status-history',
      '10.0.0',
      () => defaultStatusHistoryOptions,
      () => defaultStatusHistoryFieldConfig
    );
  },
  table() {
    return new VizPanelBuilder<TableOptions, TableFieldConfig>('table', '10.0.0', () => defaultTableOptions);
  },
  text() {
    return new VizPanelBuilder<TextOptions, {}>('text', '10.0.0', () => defaultTextOptions);
  },
  timeseries() {
    return new VizPanelBuilder<TimeSeriesOptions, TimeSeriesFieldConfig>('timeseries', '10.0.0');
  },
  trend() {
    return new VizPanelBuilder<{}, {}>('trend', '10.0.0');
  },
  traces() {
    return new VizPanelBuilder<TrendOptions, TrendFieldConfig>('traces', '10.0.0');
  },
  xychart() {
    return new VizPanelBuilder<XYChartOptions, {}>(
      'xychart',
      '10.0.0',
      () => defaultXYChartOptions,
      () => defaultXYChartFieldConfig
    );
  },
};

export { PanelOptionsBuilders } from './PanelOptionsBuilders';
export { FieldConfigBuilders } from './FieldConfigBuilders';
export { FieldConfigOverridesBuilder } from './FieldConfigOverridesBuilder';

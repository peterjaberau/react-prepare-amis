import {
  Options as BarChartOptions,
  defaultOptions as defaultBarChartOptions,
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
  defaultOptions as defaultHeatmapOptions,
} from '@schema/raw/composable/HeatmapPanelCfg_types';
import {
  Options as HistogramOptions,
  defaultOptions as defaultHistogramOptions,
} from '@schema/raw/composable/HistogramPanelCfg_types';
import { Options as LogsOptions } from '@schema/raw/composable/LogsPanelCfg_types';
import {
  Options as NewsOptions,
  defaultOptions as defaultNewsOptions,
} from '@schema/raw/composable/NewsPanelCfg_types';
import { Options as NodeGraphOptions } from '@schema/raw/composable/NodeGraphPanelCfg_types';
import {
  Options as PieChartOptions,
  defaultOptions as defaultPieChartOptions,
} from '@schema/raw/composable/PieChartPanelCfg_types';
import {
  Options as StatOptions,
  defaultOptions as defaultStatOptions,
} from '@schema/raw/composable/StatPanelCfg_types';
import {
  Options as StateTimelineOptions,
  defaultOptions as defaultStateTimelineOptions,
} from '@schema/raw/composable/StateTimelinePanelCfg_types';
import {
  Options as StatusHistoryOptions,
  defaultOptions as defaultStatusHistoryOptions,
} from '@schema/raw/composable/StatusHistoryPanelCfg_types';
import {
  Options as TableOptions,
  defaultOptions as defaultTableOptions,
} from '@schema/raw/composable/TablePanelCfg_types';
import {
  Options as TextOptions,
  defaultOptions as defaultTextOptions,
} from '@schema/raw/composable/TextPanelCfg_types';
import { Options as TimeSeriesOptions } from '@schema/raw/composable/TimeSeriesPanelCfg_types';
import { Options as TrendOptions } from '@schema/raw/composable/TrendPanelCfg_types';
import {
  Options as XYChartOptions,
  defaultOptions as defaultXYChartOptions,
} from '@schema/raw/composable/XYChartPanelCfg_types';

import { PanelOptionsBuilder } from './PanelOptionsBuilder';

export const PanelOptionsBuilders = {
  barchart() {
    return new PanelOptionsBuilder<BarChartOptions>(() => defaultBarChartOptions);
  },
  bargauge() {
    return new PanelOptionsBuilder<BarGaugeOptions>(() => defaultBarGaugeOptions);
  },
  datagrid() {
    return new PanelOptionsBuilder<DataGridOptions>(() => defaultDataGridOptions);
  },
  flamegraph() {
    return new PanelOptionsBuilder<{}>();
  },
  gauge() {
    return new PanelOptionsBuilder<GaugeOptions>(() => defaultGaugeOptions);
  },
  geomap() {
    return new PanelOptionsBuilder<GeomapOptions>(() => defaultGeomapOptions);
  },
  heatmap() {
    return new PanelOptionsBuilder<HeatmapOptions>(() => defaultHeatmapOptions);
  },
  histogram() {
    return new PanelOptionsBuilder<HistogramOptions>(() => defaultHistogramOptions);
  },
  logs() {
    return new PanelOptionsBuilder<LogsOptions>();
  },
  news() {
    return new PanelOptionsBuilder<NewsOptions>(() => defaultNewsOptions);
  },
  nodegraph() {
    return new PanelOptionsBuilder<NodeGraphOptions>();
  },
  piechart() {
    return new PanelOptionsBuilder<PieChartOptions>(() => defaultPieChartOptions);
  },
  stat() {
    return new PanelOptionsBuilder<StatOptions>(() => defaultStatOptions);
  },
  statetimeline() {
    return new PanelOptionsBuilder<StateTimelineOptions>(() => defaultStateTimelineOptions);
  },
  statushistory() {
    return new PanelOptionsBuilder<StatusHistoryOptions>(() => defaultStatusHistoryOptions);
  },
  table() {
    return new PanelOptionsBuilder<TableOptions>(() => defaultTableOptions);
  },
  text() {
    return new PanelOptionsBuilder<TextOptions>(() => defaultTextOptions);
  },
  timeseries() {
    return new PanelOptionsBuilder<TimeSeriesOptions>();
  },
  trend() {
    return new PanelOptionsBuilder<{}>();
  },
  traces() {
    return new PanelOptionsBuilder<TrendOptions>();
  },
  xychart() {
    return new PanelOptionsBuilder<XYChartOptions>(() => defaultXYChartOptions);
  },
};

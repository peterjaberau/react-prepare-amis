const graphitePlugin = async () =>
  await import(/* webpackChunkName: "graphitePlugin" */ '@grafana-module/app/plugins/datasource/graphite/module');
const cloudwatchPlugin = async () =>
  await import(/* webpackChunkName: "cloudwatchPlugin" */ '@grafana-module/app/plugins/datasource/cloudwatch/module');
const dashboardDSPlugin = async () =>
  await import(/* webpackChunkName "dashboardDSPlugin" */ '@grafana-module/app/plugins/datasource/dashboard/module');
const elasticsearchPlugin = async () =>
  await import(/* webpackChunkName: "elasticsearchPlugin" */ '@grafana-module/app/plugins/datasource/elasticsearch/module');
const opentsdbPlugin = async () =>
  await import(/* webpackChunkName: "opentsdbPlugin" */ '@grafana-module/app/plugins/datasource/opentsdb/module');
const grafanaPlugin = async () =>
  await import(/* webpackChunkName: "grafanaPlugin" */ '@grafana-module/app/plugins/datasource/grafana/module');
const influxdbPlugin = async () =>
  await import(/* webpackChunkName: "influxdbPlugin" */ '@grafana-module/app/plugins/datasource/influxdb/module');
const lokiPlugin = async () => await import(/* webpackChunkName: "lokiPlugin" */ '@grafana-module/app/plugins/datasource/loki/module');
const mixedPlugin = async () =>
  await import(/* webpackChunkName: "mixedPlugin" */ '@grafana-module/app/plugins/datasource/mixed/module');
const prometheusPlugin = async () =>
  await import(/* webpackChunkName: "prometheusPlugin" */ '@grafana-module/app/plugins/datasource/prometheus/module');
const alertmanagerPlugin = async () =>
  await import(/* webpackChunkName: "alertmanagerPlugin" */ '@grafana-module/app/plugins/datasource/alertmanager/module');

// Async loaded panels
const alertListPanel = async () =>
  await import(/* webpackChunkName: "alertListPanel" */ '@grafana-module/app/plugins/panel/alertlist/module');
const annoListPanel = async () =>
  await import(/* webpackChunkName: "annoListPanel" */ '@grafana-module/app/plugins/panel/annolist/module');
const barChartPanel = async () =>
  await import(/* webpackChunkName: "barChartPanel" */ '@grafana-module/app/plugins/panel/barchart/module');
const barGaugePanel = async () =>
  await import(/* webpackChunkName: "barGaugePanel" */ '@grafana-module/app/plugins/panel/bargauge/module');
const candlestickPanel = async () =>
  await import(/* webpackChunkName: "candlestickPanel" */ '@grafana-module/app/plugins/panel/candlestick/module');
const dashListPanel = async () =>
  await import(/* webpackChunkName: "dashListPanel" */ '@grafana-module/app/plugins/panel/dashlist/module');
const dataGridPanel = async () =>
  await import(/* webpackChunkName: "dataGridPanel" */ '@grafana-module/app/plugins/panel/datagrid/module');
const debugPanel = async () => await import(/* webpackChunkName: "debugPanel" */ '@grafana-module/app/plugins/panel/debug/module');
const flamegraphPanel = async () =>
  await import(/* webpackChunkName: "flamegraphPanel" */ '@grafana-module/app/plugins/panel/flamegraph/module');
const gaugePanel = async () => await import(/* webpackChunkName: "gaugePanel" */ '@grafana-module/app/plugins/panel/gauge/module');
const gettingStartedPanel = async () =>
  await import(/* webpackChunkName: "gettingStartedPanel" */ '@grafana-module/app/plugins/panel/gettingstarted/module');
const histogramPanel = async () =>
  await import(/* webpackChunkName: "histogramPanel" */ '@grafana-module/app/plugins/panel/histogram/module');
const livePanel = async () => await import(/* webpackChunkName: "livePanel" */ '@grafana-module/app/plugins/panel/live/module');
const logsPanel = async () => await import(/* webpackChunkName: "logsPanel" */ '@grafana-module/app/plugins/panel/logs/module');
const newLogsPanel = async () =>
  await import(/* webpackChunkName: "newLogsPanel" */ '@grafana-module/app/plugins/panel/logs-new/module');
const newsPanel = async () => await import(/* webpackChunkName: "newsPanel" */ '@grafana-module/app/plugins/panel/news/module');
const pieChartPanel = async () =>
  await import(/* webpackChunkName: "pieChartPanel" */ '@grafana-module/app/plugins/panel/piechart/module');
const statPanel = async () => await import(/* webpackChunkName: "statPanel" */ '@grafana-module/app/plugins/panel/stat/module');
const stateTimelinePanel = async () =>
  await import(/* webpackChunkName: "stateTimelinePanel" */ '@grafana-module/app/plugins/panel/state-timeline/module');
const statusHistoryPanel = async () =>
  await import(/* webpackChunkName: "statusHistoryPanel" */ '@grafana-module/app/plugins/panel/status-history/module');
const tablePanel = async () => await import(/* webpackChunkName: "tablePanel" */ '@grafana-module/app/plugins/panel/table/module');
const textPanel = async () => await import(/* webpackChunkName: "textPanel" */ '@grafana-module/app/plugins/panel/text/module');
const timeseriesPanel = async () =>
  await import(/* webpackChunkName: "timeseriesPanel" */ '@grafana-module/app/plugins/panel/timeseries/module');
const tracesPanel = async () => await import(/* webpackChunkName: "tracesPanel" */ '@grafana-module/app/plugins/panel/traces/module');
const trendPanel = async () => await import(/* webpackChunkName: "trendPanel" */ '@grafana-module/app/plugins/panel/trend/module');
const welcomeBanner = async () =>
  await import(/* webpackChunkName: "welcomeBanner" */ '@grafana-module/app/plugins/panel/welcome/module');

const geomapPanel = async () => await import(/* webpackChunkName: "geomapPanel" */ '@grafana-module/app/plugins/panel/geomap/module');
const canvasPanel = async () => await import(/* webpackChunkName: "canvasPanel" */ '@grafana-module/app/plugins/panel/canvas/module');
const graphPanel = async () => await import(/* webpackChunkName: "graphPlugin" */ '@grafana-module/app/plugins/panel/graph/module');
const xychartPanel = async () => await import(/* webpackChunkName: "xychart" */ '@grafana-module/app/plugins/panel/xychart/module');
const heatmapPanel = async () =>
  await import(/* webpackChunkName: "heatmapPanel" */ '@grafana-module/app/plugins/panel/heatmap/module');
const tableOldPanel = async () =>
  await import(/* webpackChunkName: "tableOldPlugin" */ '@grafana-module/app/plugins/panel/table-old/module');

const nodeGraph = async () =>
  await import(/* webpackChunkName: "nodeGraphPanel" */ '@grafana-module/app/plugins/panel/nodeGraph/module');

const builtInPlugins: Record<string, System.Module | (() => Promise<System.Module>)> = {
  // datasources
  'core:plugin/graphite': graphitePlugin,
  'core:plugin/cloudwatch': cloudwatchPlugin,
  'core:plugin/dashboard': dashboardDSPlugin,
  'core:plugin/elasticsearch': elasticsearchPlugin,
  'core:plugin/opentsdb': opentsdbPlugin,
  'core:plugin/grafana': grafanaPlugin,
  'core:plugin/influxdb': influxdbPlugin,
  'core:plugin/loki': lokiPlugin,
  'core:plugin/mixed': mixedPlugin,
  'core:plugin/prometheus': prometheusPlugin,
  'core:plugin/alertmanager': alertmanagerPlugin,
  // panels
  'core:plugin/text': textPanel,
  'core:plugin/timeseries': timeseriesPanel,
  'core:plugin/trend': trendPanel,
  'core:plugin/state-timeline': stateTimelinePanel,
  'core:plugin/status-history': statusHistoryPanel,
  'core:plugin/candlestick': candlestickPanel,
  'core:plugin/graph': graphPanel,
  'core:plugin/xychart': xychartPanel,
  'core:plugin/geomap': geomapPanel,
  'core:plugin/canvas': canvasPanel,
  'core:plugin/dashlist': dashListPanel,
  'core:plugin/alertlist': alertListPanel,
  'core:plugin/annolist': annoListPanel,
  'core:plugin/heatmap': heatmapPanel,
  'core:plugin/table': tablePanel,
  'core:plugin/table-old': tableOldPanel,
  'core:plugin/news': newsPanel,
  'core:plugin/live': livePanel,
  'core:plugin/stat': statPanel,
  'core:plugin/datagrid': dataGridPanel,
  'core:plugin/debug': debugPanel,
  'core:plugin/flamegraph': flamegraphPanel,
  'core:plugin/gettingstarted': gettingStartedPanel,
  'core:plugin/gauge': gaugePanel,
  'core:plugin/piechart': pieChartPanel,
  'core:plugin/bargauge': barGaugePanel,
  'core:plugin/barchart': barChartPanel,
  'core:plugin/logs': logsPanel,
  'core:plugin/logs-new': newLogsPanel,
  'core:plugin/traces': tracesPanel,
  'core:plugin/welcome': welcomeBanner,
  'core:plugin/nodeGraph': nodeGraph,
  'core:plugin/histogram': histogramPanel,
};

export default builtInPlugins;

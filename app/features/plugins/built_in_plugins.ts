const graphitePlugin = async () =>
  await import(/* webpackChunkName: "graphitePlugin" */ '~/plugins/datasource/graphite/module');
const cloudwatchPlugin = async () =>
  await import(/* webpackChunkName: "cloudwatchPlugin" */ '~/plugins/datasource/cloudwatch/module');
const dashboardDSPlugin = async () =>
  await import(/* webpackChunkName "dashboardDSPlugin" */ '~/plugins/datasource/dashboard/module');
const elasticsearchPlugin = async () =>
  await import(/* webpackChunkName: "elasticsearchPlugin" */ '~/plugins/datasource/elasticsearch/module');
const opentsdbPlugin = async () =>
  await import(/* webpackChunkName: "opentsdbPlugin" */ '~/plugins/datasource/opentsdb/module');
const grafanaPlugin = async () =>
  await import(/* webpackChunkName: "grafanaPlugin" */ '~/plugins/datasource/grafana/module');
const influxdbPlugin = async () =>
  await import(/* webpackChunkName: "influxdbPlugin" */ '~/plugins/datasource/influxdb/module');
const lokiPlugin = async () => await import(/* webpackChunkName: "lokiPlugin" */ '~/plugins/datasource/loki/module');
const mixedPlugin = async () =>
  await import(/* webpackChunkName: "mixedPlugin" */ '~/plugins/datasource/mixed/module');
const prometheusPlugin = async () =>
  await import(/* webpackChunkName: "prometheusPlugin" */ '~/plugins/datasource/prometheus/module');
const alertmanagerPlugin = async () =>
  await import(/* webpackChunkName: "alertmanagerPlugin" */ '~/plugins/datasource/alertmanager/module');

// Async loaded panels
const alertListPanel = async () =>
  await import(/* webpackChunkName: "alertListPanel" */ '~/plugins/panel/alertlist/module');
const annoListPanel = async () =>
  await import(/* webpackChunkName: "annoListPanel" */ '~/plugins/panel/annolist/module');
const barChartPanel = async () =>
  await import(/* webpackChunkName: "barChartPanel" */ '~/plugins/panel/barchart/module');
const barGaugePanel = async () =>
  await import(/* webpackChunkName: "barGaugePanel" */ '~/plugins/panel/bargauge/module');
const candlestickPanel = async () =>
  await import(/* webpackChunkName: "candlestickPanel" */ '~/plugins/panel/candlestick/module');
const dashListPanel = async () =>
  await import(/* webpackChunkName: "dashListPanel" */ '~/plugins/panel/dashlist/module');
const dataGridPanel = async () =>
  await import(/* webpackChunkName: "dataGridPanel" */ '~/plugins/panel/datagrid/module');
const debugPanel = async () => await import(/* webpackChunkName: "debugPanel" */ '~/plugins/panel/debug/module');
const flamegraphPanel = async () =>
  await import(/* webpackChunkName: "flamegraphPanel" */ '~/plugins/panel/flamegraph/module');
const gaugePanel = async () => await import(/* webpackChunkName: "gaugePanel" */ '~/plugins/panel/gauge/module');
const gettingStartedPanel = async () =>
  await import(/* webpackChunkName: "gettingStartedPanel" */ '~/plugins/panel/gettingstarted/module');
const histogramPanel = async () =>
  await import(/* webpackChunkName: "histogramPanel" */ '~/plugins/panel/histogram/module');
const livePanel = async () => await import(/* webpackChunkName: "livePanel" */ '~/plugins/panel/live/module');
const logsPanel = async () => await import(/* webpackChunkName: "logsPanel" */ '~/plugins/panel/logs/module');
const newLogsPanel = async () =>
  await import(/* webpackChunkName: "newLogsPanel" */ '~/plugins/panel/logs-new/module');
const newsPanel = async () => await import(/* webpackChunkName: "newsPanel" */ '~/plugins/panel/news/module');
const pieChartPanel = async () =>
  await import(/* webpackChunkName: "pieChartPanel" */ '~/plugins/panel/piechart/module');
const statPanel = async () => await import(/* webpackChunkName: "statPanel" */ '~/plugins/panel/stat/module');
const stateTimelinePanel = async () =>
  await import(/* webpackChunkName: "stateTimelinePanel" */ '~/plugins/panel/state-timeline/module');
const statusHistoryPanel = async () =>
  await import(/* webpackChunkName: "statusHistoryPanel" */ '~/plugins/panel/status-history/module');
const tablePanel = async () => await import(/* webpackChunkName: "tablePanel" */ '~/plugins/panel/table/module');
const textPanel = async () => await import(/* webpackChunkName: "textPanel" */ '~/plugins/panel/text/module');
const timeseriesPanel = async () =>
  await import(/* webpackChunkName: "timeseriesPanel" */ '~/plugins/panel/timeseries/module');
const tracesPanel = async () => await import(/* webpackChunkName: "tracesPanel" */ '~/plugins/panel/traces/module');
const trendPanel = async () => await import(/* webpackChunkName: "trendPanel" */ '~/plugins/panel/trend/module');
const welcomeBanner = async () =>
  await import(/* webpackChunkName: "welcomeBanner" */ '~/plugins/panel/welcome/module');

const geomapPanel = async () => await import(/* webpackChunkName: "geomapPanel" */ '~/plugins/panel/geomap/module');
const canvasPanel = async () => await import(/* webpackChunkName: "canvasPanel" */ '~/plugins/panel/canvas/module');
const graphPanel = async () => await import(/* webpackChunkName: "graphPlugin" */ '~/plugins/panel/graph/module');
const xychartPanel = async () => await import(/* webpackChunkName: "xychart" */ '~/plugins/panel/xychart/module');
const heatmapPanel = async () =>
  await import(/* webpackChunkName: "heatmapPanel" */ '~/plugins/panel/heatmap/module');
const tableOldPanel = async () =>
  await import(/* webpackChunkName: "tableOldPlugin" */ '~/plugins/panel/table-old/module');

const nodeGraph = async () =>
  await import(/* webpackChunkName: "nodeGraphPanel" */ '~/plugins/panel/nodeGraph/module');

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

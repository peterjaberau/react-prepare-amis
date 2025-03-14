import { makeClassES5Compatible } from '@data/index';
import { loadPluginCss } from '@runtime/index';
import { MetricsPanelCtrl as MetricsPanelCtrlES6 } from '@grafana-module/app/angular/panel/metrics_panel_ctrl';
import { PanelCtrl as PanelCtrlES6 } from '@grafana-module/app/angular/panel/panel_ctrl';
import { QueryCtrl as QueryCtrlES6 } from '@grafana-module/app/angular/panel/query_ctrl';

const PanelCtrl = makeClassES5Compatible(PanelCtrlES6);
const MetricsPanelCtrl = makeClassES5Compatible(MetricsPanelCtrlES6);
const QueryCtrl = makeClassES5Compatible(QueryCtrlES6);

export { PanelCtrl, MetricsPanelCtrl, QueryCtrl, loadPluginCss };

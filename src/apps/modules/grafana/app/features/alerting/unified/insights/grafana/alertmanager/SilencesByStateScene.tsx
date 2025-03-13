import { PanelBuilders, SceneFlexItem, SceneQueryRunner } from '@scenes/index';
import { DataSourceRef, GraphDrawStyle, TooltipDisplayMode } from '@schema/index';

import { INSTANCE_ID, PANEL_STYLES } from '../../../home/Insights';
import { InsightsMenuButton } from '../../InsightsMenuButton';

export function getGrafanaAlertmanagerSilencesScene(datasource: DataSourceRef, panelTitle: string) {
  const expr = INSTANCE_ID
    ? `sum by (state) (grafanacloud_grafana_instance_alerting_silences{id="${INSTANCE_ID}"})`
    : `sum by (state) (grafanacloud_grafana_instance_alerting_silences)`;

  const query = new SceneQueryRunner({
    datasource,
    queries: [
      {
        refId: 'A',
        expr,
        range: true,
        legendFormat: '{{state}}',
      },
    ],
  });

  return new SceneFlexItem({
    ...PANEL_STYLES,
    body: PanelBuilders.timeseries()
      .setTitle(panelTitle)
      .setDescription('The number of silences by state')
      .setData(query)
      .setCustomFieldConfig('drawStyle', GraphDrawStyle.Line)
      .setOption('tooltip', { mode: TooltipDisplayMode.Multi })
      .setHeaderActions([new InsightsMenuButton({ panel: panelTitle })])
      .build(),
  });
}

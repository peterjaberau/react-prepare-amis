import { ThresholdsMode } from '@data/index';
import { PanelBuilders, SceneFlexItem, SceneQueryRunner } from '@scenes/index';
import { DataSourceRef } from '@schema/index';

import { PANEL_STYLES } from '../../../home/Insights';
import { InsightsMenuButton } from '../../InsightsMenuButton';

export function getFiringCloudAlertsScene(datasource: DataSourceRef, panelTitle: string) {
  const query = new SceneQueryRunner({
    datasource,
    queries: [
      {
        refId: 'A',
        instant: true,
        expr: 'sum by (alertstate) (ALERTS{alertstate="firing"})',
      },
    ],
  });

  return new SceneFlexItem({
    ...PANEL_STYLES,
    body: PanelBuilders.stat()
      .setTitle(panelTitle)
      .setDescription('The number of currently firing alert rule instances')
      .setData(query)
      .setThresholds({
        mode: ThresholdsMode.Absolute,
        steps: [
          {
            color: 'red',
            value: 0,
          },
          {
            color: 'red',
            value: 80,
          },
        ],
      })
      .setNoValue('0')
      .setHeaderActions([new InsightsMenuButton({ panel: panelTitle })])
      .build(),
  });
}

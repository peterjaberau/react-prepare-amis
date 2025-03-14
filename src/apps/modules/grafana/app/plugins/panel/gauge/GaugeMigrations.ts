import { PanelModel } from '@data/index';
import { sharedSingleStatPanelChangedHandler, sharedSingleStatMigrationHandler } from '@grafana-ui/index';

import { Options } from './panelcfg';

// This is called when the panel first loads
export const gaugePanelMigrationHandler = (panel: PanelModel<Options>): Partial<Options> => {
  return sharedSingleStatMigrationHandler(panel);
};

// This is called when the panel changes from another panel
export const gaugePanelChangedHandler = (
  panel: PanelModel<Partial<Options>>,
  prevPluginId: string,
  prevOptions: any
) => {
  // This handles most config changes
  const opts: Options = sharedSingleStatPanelChangedHandler(panel, prevPluginId, prevOptions);

  // Changing from angular singlestat
  if (prevPluginId === 'singlestat' && prevOptions.angular) {
    const gauge = prevOptions.angular.gauge;
    if (gauge) {
      opts.showThresholdMarkers = gauge.thresholdMarkers;
      opts.showThresholdLabels = gauge.thresholdLabels;
    }
  }
  return opts;
};

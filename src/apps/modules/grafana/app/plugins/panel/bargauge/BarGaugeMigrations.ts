import { PanelModel } from '@data/index';
import { sharedSingleStatMigrationHandler } from '@grafana-ui/index';

import { Options } from './panelcfg';

export const barGaugePanelMigrationHandler = (panel: PanelModel<Options>): Partial<Options> => {
  return sharedSingleStatMigrationHandler(panel);
};

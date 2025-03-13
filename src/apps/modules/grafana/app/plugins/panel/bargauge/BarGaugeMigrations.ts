import { PanelModel } from '@data/index';
import { sharedSingleStatMigrationHandler } from '@grafana/ui';

import { Options } from './panelcfg.gen';

export const barGaugePanelMigrationHandler = (panel: PanelModel<Options>): Partial<Options> => {
  return sharedSingleStatMigrationHandler(panel);
};

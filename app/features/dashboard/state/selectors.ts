import { PanelPlugin } from '@data/index';
import { StoreState } from '~/types';

import { getPanelPluginNotFound } from '../../panel/components/PanelPluginError';

export const getPanelPluginWithFallback =
  (panelType: string) =>
  (state: StoreState): PanelPlugin => {
    const plugin = state.plugins.panels[panelType];
    return plugin || getPanelPluginNotFound(`Panel plugin not found (${panelType})`, true);
  };

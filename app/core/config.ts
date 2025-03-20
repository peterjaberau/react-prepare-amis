import { PluginState } from '@data/index';
import { config, GrafanaBootConfig } from '@runtime/index';
export { config, GrafanaBootConfig as Settings };

let grafanaConfig: GrafanaBootConfig = config;

export default grafanaConfig;

export const getConfig = () => {
  return grafanaConfig;
};

export const updateConfig = (update: Partial<GrafanaBootConfig>) => {
  grafanaConfig = {
    ...grafanaConfig,
    ...update,
  };
};

// The `enable_alpha` flag is not exposed directly, this is equivalent
export const hasAlphaPanels = Boolean(config.panels?.debug?.state === PluginState.alpha);

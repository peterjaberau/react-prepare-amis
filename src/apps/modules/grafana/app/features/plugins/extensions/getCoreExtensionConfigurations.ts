import { PluginExtensionAddedLinkConfig } from '@data/index';
import { getExploreExtensionConfigs } from '@grafana-module/app/features/explore/extensions/getExploreExtensionConfigs';

export function getCoreExtensionConfigurations(): PluginExtensionAddedLinkConfig[] {
  return [...getExploreExtensionConfigs()];
}

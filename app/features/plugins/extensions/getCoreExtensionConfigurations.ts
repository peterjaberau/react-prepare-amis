import { PluginExtensionAddedLinkConfig } from '@data/index';
import { getExploreExtensionConfigs } from '~/features/explore/extensions/getExploreExtensionConfigs';

export function getCoreExtensionConfigurations(): PluginExtensionAddedLinkConfig[] {
  return [...getExploreExtensionConfigs()];
}
